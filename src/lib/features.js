import {
  ArrowUpDown, Bus, Car, DoorClosed, Droplets, Dumbbell, GraduationCap, Route,
  ShieldCheck, ShoppingBag, Stethoscope, Train, Trees, Video, Zap,
} from "lucide-react";

/**
 * One config drives the form, the validation schema and the details page.
 * Keys are stored as-is inside the `amenities` jsonb column.
 */
export const AMENITIES = [
  { key: "lift", label: "Lift", icon: ArrowUpDown, type: "toggle" },
  { key: "power_backup", label: "Power backup", icon: Zap, type: "select", options: ["None", "Partial", "Full"] },
  { key: "security", label: "Security", icon: ShieldCheck, type: "select", options: ["None", "Day guard", "24x7 guard"] },
  { key: "parking", label: "Parking", icon: Car, type: "select", options: ["None", "Open", "Covered", "Open + Covered"] },
  { key: "gated_society", label: "Gated society", icon: DoorClosed, type: "toggle" },
  { key: "garden", label: "Garden", icon: Trees, type: "toggle" },
  { key: "cctv", label: "CCTV", icon: Video, type: "toggle" },
  { key: "club_house", label: "Club house", icon: Dumbbell, type: "toggle" },
  { key: "water_source", label: "Water source", icon: Droplets, type: "checkboxes", options: ["Municipal", "Borewell", "Tanker", "Well"] },
];

export const NEARBY = [
  { key: "school", label: "School", icon: GraduationCap },
  { key: "hospital", label: "Hospital", icon: Stethoscope },
  { key: "market", label: "Market", icon: ShoppingBag },
  { key: "bus_stand", label: "Bus stand", icon: Bus },
  { key: "railway_station", label: "Railway station", icon: Train },
  { key: "highway", label: "Highway", icon: Route },
];

export const defaultAmenities = {
  lift: false,
  power_backup: "None",
  security: "None",
  parking: "None",
  gated_society: false,
  garden: false,
  cctv: false,
  club_house: false,
  water_source: [],
};

export const defaultNearby = {
  school: "",
  hospital: "",
  market: "",
  bus_stand: "",
  railway_station: "",
  highway: "",
};

/** Old rows have {} in these columns, so always merge with defaults. */
export const withAmenityDefaults = (value) => ({ ...defaultAmenities, ...(value || {}) });
export const withNearbyDefaults = (value) => ({ ...defaultNearby, ...(value || {}) });
