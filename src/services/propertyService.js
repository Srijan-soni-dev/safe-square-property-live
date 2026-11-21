import { supabase } from "@/lib/supabaseClient";
import { buildMapLink, isValidCoord } from "@/lib/geo";
import { withAmenityDefaults, withNearbyDefaults } from "@/lib/features";
import { getMediaList, splitMedia } from "@/lib/media";
import { deleteMediaByUrls, uploadMedia } from "@/services/storageService";

const TABLE = "properties";

/** Form (camelCase) -> database (snake_case) */
export function toDbPayload(v) {
  const hasCoords = isValidCoord(v.latitude, v.longitude);
  return {
    title: v.title.trim(),
    property_type: v.propertyType,
    status: v.status,
    number_of_floors: v.numberOfFloors === "" ? null : Number(v.numberOfFloors),
    has_boundary: !!v.hasBoundary,
    price: Number(v.price) || 0,
    area: Number(v.area) || 0,
    location: v.location.trim(),
    address: v.address.trim(),
    description: (v.description || "").trim(),
    latitude: hasCoords ? Number(v.latitude) : null,
    longitude: hasCoords ? Number(v.longitude) : null,
    map_link: hasCoords ? buildMapLink(v.latitude, v.longitude) : "",
    amenities: v.amenities,
    nearby_facilities: Object.fromEntries(Object.entries(v.nearby).map(([k, val]) => [k, (val || "").trim()])),
    owner_name: v.ownerName.trim(),
    owner_phone: (v.ownerPhone || "").trim(),
    additional_contact_number: (v.additionalContactNumber || "").trim(),
    notes: (v.notes || "").trim(),
    follow_up_date: v.followUpDate || null,
  };
}

/** Database row -> form default values */
export function toFormValues(p) {
  const amenities = withAmenityDefaults(p.amenities);
  return {
    title: p.title ?? "",
    propertyType: p.property_type ?? "House",
    status: p.status ?? "Available",
    numberOfFloors: p.number_of_floors != null ? String(p.number_of_floors) : "",
    hasBoundary: !!p.has_boundary,
    price: p.price ?? "",
    area: p.area ?? "",
    location: p.location ?? "",
    address: p.address ?? "",
    description: p.description ?? "",
    latitude: p.latitude != null ? String(p.latitude) : "",
    longitude: p.longitude != null ? String(p.longitude) : "",
    amenities: { ...amenities, water_source: [...(amenities.water_source || [])] },
    nearby: withNearbyDefaults(p.nearby_facilities),
    ownerName: p.owner_name ?? "",
    ownerPhone: p.owner_phone ?? "",
    additionalContactNumber: p.additional_contact_number ?? "",
    notes: p.notes ?? "",
    followUpDate: p.follow_up_date ?? "",
  };
}

export async function fetchProperties() {
  const { data, error } = await supabase.from(TABLE).select("*").order("created_at", { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function fetchPropertyById(id) {
  const { data, error } = await supabase.from(TABLE).select("*").eq("id", id).maybeSingle();
  if (error) throw error;
  return data;
}

export async function fetchDashboardData() {
  const count = (status) => {
    let q = supabase.from(TABLE).select("id", { count: "exact", head: true });
    if (status) q = q.eq("status", status);
    return q;
  };
  const [total, available, sold, rented, recent] = await Promise.all([
    count(),
    count("Available"),
    count("Sold"),
    count("Rented"),
    supabase.from(TABLE).select("*").order("created_at", { ascending: false }).limit(5),
  ]);
  const failed = [total, available, sold, rented, recent].find((r) => r.error);
  if (failed) throw failed.error;

  return {
    stats: { total: total.count ?? 0, available: available.count ?? 0, sold: sold.count ?? 0, rented: rented.count ?? 0 },
    recent: recent.data ?? [],
  };
}

/** items: new media files [{ id, file, mime, kind }] */
export async function createProperty({ userId, values, items, onProgress }) {
  const id = crypto.randomUUID();
  const uploaded = await uploadMedia({ userId, propertyId: id, items, onProgress });
  const { images, videos } = splitMedia(uploaded);
  const { data, error } = await supabase
    .from(TABLE)
    .insert({ id, ...toDbPayload(values), images, videos })
    .select()
    .single();
  if (error) {
    await deleteMediaByUrls(uploaded.map((m) => m.url));
    throw error;
  }
  return data;
}

/** keptMedia: [{ url, type }] that stay on the property */
export async function updateProperty({ userId, property, values, keptMedia, items, onProgress }) {
  const uploaded = await uploadMedia({ userId, propertyId: property.id, items, onProgress });
  const { images, videos } = splitMedia([...keptMedia, ...uploaded]);
  const { data, error } = await supabase
    .from(TABLE)
    .update({ ...toDbPayload(values), images, videos })
    .eq("id", property.id)
    .select()
    .single();
  if (error) {
    await deleteMediaByUrls(uploaded.map((m) => m.url));
    throw error;
  }
  const removed = getMediaList(property).filter((m) => !keptMedia.some((k) => k.url === m.url));
  await deleteMediaByUrls(removed.map((m) => m.url));
  return data;
}

export async function deleteProperty(property) {
  const { error } = await supabase.from(TABLE).delete().eq("id", property.id);
  if (error) throw error;
  await deleteMediaByUrls(getMediaList(property).map((m) => m.url));
}
