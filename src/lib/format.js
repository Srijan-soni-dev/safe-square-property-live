const inr = new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 });
const num = new Intl.NumberFormat("en-IN");
const trim = (n) => Number(n.toFixed(2)).toString();

export function formatPrice(value) {
  if (value === null || value === undefined || value === "") return "—";
  return inr.format(Number(value));
}

/** 12500000 -> "₹1.25 Cr" (helper text under the price field) */
export function formatPriceShort(value) {
  const n = Number(value);
  if (!n || n < 1000) return "";
  if (n >= 1e7) return `₹${trim(n / 1e7)} Cr`;
  if (n >= 1e5) return `₹${trim(n / 1e5)} Lakh`;
  return `₹${trim(n / 1e3)} Thousand`;
}

export function formatArea(value) {
  return `${num.format(Number(value || 0))} sq ft`;
}

export function formatDate(value) {
  if (!value) return "—";
  const d = new Date(/^\d{4}-\d{2}-\d{2}$/.test(value) ? `${value}T00:00:00` : value);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}
