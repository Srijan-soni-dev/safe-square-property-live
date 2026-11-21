export function isValidCoord(lat, lng) {
  if (String(lat ?? "").trim() === "" || String(lng ?? "").trim() === "") return false;
  const la = Number(lat);
  const ln = Number(lng);
  return Number.isFinite(la) && Number.isFinite(ln) && la >= -90 && la <= 90 && ln >= -180 && ln <= 180;
}

export function buildMapLink(lat, lng) {
  return `https://maps.google.com/?q=${lat},${lng}`;
}

/** Only open links that point to Google Maps (defence against odd data in the column). */
export function isGoogleMapsLink(url) {
  return typeof url === "string" && url.startsWith("https://maps.google.com/");
}
