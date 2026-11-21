export const defaultFilters = {
  search: "",
  type: "all",
  status: "all",
  minPrice: "",
  maxPrice: "",
  minArea: "",
  maxArea: "",
};

export function countActiveFilters(f) {
  return Object.keys(defaultFilters).filter((k) => f[k] !== defaultFilters[k] && String(f[k]).trim() !== "").length;
}

const toNum = (v) => (String(v).trim() === "" ? null : Number(v));

export function applyFilters(list, f) {
  const q = f.search.trim().toLowerCase();
  const minPrice = toNum(f.minPrice);
  const maxPrice = toNum(f.maxPrice);
  const minArea = toNum(f.minArea);
  const maxArea = toNum(f.maxArea);

  return list.filter((p) => {
    if (q) {
      const hay = [p.title, p.owner_name, p.owner_phone, p.additional_contact_number, p.location, p.address]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      if (!hay.includes(q)) return false;
    }
    if (f.type !== "all" && p.property_type !== f.type) return false;
    if (f.status !== "all" && p.status !== f.status) return false;
    if (minPrice !== null && Number(p.price) < minPrice) return false;
    if (maxPrice !== null && Number(p.price) > maxPrice) return false;
    if (minArea !== null && Number(p.area) < minArea) return false;
    if (maxArea !== null && Number(p.area) > maxArea) return false;
    return true;
  });
}
