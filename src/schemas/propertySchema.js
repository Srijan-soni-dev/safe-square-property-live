import { z } from "zod";
import { PROPERTY_STATUSES, PROPERTY_TYPES } from "@/lib/constants";
import { AMENITIES, NEARBY, defaultAmenities, defaultNearby } from "@/lib/features";

const phone = z
  .string()
  .trim()
  .refine((v) => v === "" || /^\+?[0-9\s-]{7,15}$/.test(v), "Enter a valid phone number");

const distance = z
  .string()
  .trim()
  .max(20, "Too long")
  .refine((v) => v === "" || /^\d+(\.\d+)?\s?(m|km|meters?|kms?)$/i.test(v), "Use a format like 500m, 1km or 2.5km");

const coordinate = (min, max, name) =>
  z
    .string()
    .trim()
    .refine(
      (v) => v === "" || (/^-?\d+(\.\d+)?$/.test(v) && Number(v) >= min && Number(v) <= max),
      `${name} must be a number between ${min} and ${max}`
    );

const optionsOf = (key) => AMENITIES.find((a) => a.key === key).options;

const amenitiesSchema = z.object({
  lift: z.boolean(),
  power_backup: z.enum(optionsOf("power_backup")),
  security: z.enum(optionsOf("security")),
  parking: z.enum(optionsOf("parking")),
  gated_society: z.boolean(),
  garden: z.boolean(),
  cctv: z.boolean(),
  club_house: z.boolean(),
  water_source: z.array(z.enum(optionsOf("water_source"))),
});

const nearbySchema = z.object(Object.fromEntries(NEARBY.map((n) => [n.key, distance])));

export const propertySchema = z
  .object({
    title: z.string().trim().min(3, "Enter at least 3 characters").max(150, "Keep the title under 150 characters"),
    propertyType: z.enum(PROPERTY_TYPES, { errorMap: () => ({ message: "Choose a property type" }) }),
    status: z.enum(PROPERTY_STATUSES, { errorMap: () => ({ message: "Choose a status" }) }),
    numberOfFloors: z
      .string()
      .trim()
      .refine((v) => v === "" || (/^\d{1,3}$/.test(v) && Number(v) <= 200), "Enter a whole number from 0 to 200"),
    hasBoundary: z.boolean(),
    price: z.coerce.number({ invalid_type_error: "Enter a valid price" }).min(1, "Enter the price"),
    area: z.coerce.number({ invalid_type_error: "Enter a valid area" }).min(1, "Enter the area in sq ft"),
    location: z.string().trim().min(2, "Enter the locality").max(120, "Keep the locality under 120 characters"),
    address: z.string().trim().min(5, "Enter the complete address").max(300, "Keep the address under 300 characters"),
    description: z.string().trim().max(3000, "Keep the description under 3000 characters"),
    latitude: coordinate(-90, 90, "Latitude"),
    longitude: coordinate(-180, 180, "Longitude"),
    amenities: amenitiesSchema,
    nearby: nearbySchema,
    ownerName: z.string().trim().min(2, "Enter the owner's name").max(100),
    ownerPhone: phone,
    additionalContactNumber: phone,
    notes: z.string().trim().max(3000, "Keep notes under 3000 characters"),
    followUpDate: z.string(),
  })
  .superRefine((v, ctx) => {
    const hasLat = v.latitude !== "";
    const hasLng = v.longitude !== "";
    if (hasLat && !hasLng) ctx.addIssue({ code: "custom", path: ["longitude"], message: "Enter the longitude too" });
    if (hasLng && !hasLat) ctx.addIssue({ code: "custom", path: ["latitude"], message: "Enter the latitude too" });
  });

export const emptyPropertyValues = {
  title: "",
  propertyType: "House",
  status: "Available",
  numberOfFloors: "",
  hasBoundary: false,
  price: "",
  area: "",
  location: "",
  address: "",
  description: "",
  latitude: "",
  longitude: "",
  amenities: { ...defaultAmenities, water_source: [] },
  nearby: { ...defaultNearby },
  ownerName: "",
  ownerPhone: "",
  additionalContactNumber: "",
  notes: "",
  followUpDate: "",
};
