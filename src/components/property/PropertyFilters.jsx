import { useState } from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { PROPERTY_STATUSES, PROPERTY_TYPES } from "@/lib/constants";
import { countActiveFilters, defaultFilters } from "@/lib/filterProperties";

export default function PropertyFilters({ filters, onChange }) {
  const [showMore, setShowMore] = useState(false);
  const active = countActiveFilters(filters);
  const set = (key) => (e) => onChange({ ...filters, [key]: e.target.value });

  return (
    <div className="space-y-3 rounded-lg border bg-card p-4">
      <div className="flex flex-col gap-3 lg:flex-row">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={filters.search}
            onChange={set("search")}
            placeholder="Search by title, owner name or locality"
            aria-label="Search properties"
            className="pl-9"
          />
        </div>
        <div className="grid grid-cols-2 gap-3 lg:flex">
          <Select value={filters.type} onChange={set("type")} aria-label="Filter by property type" className="lg:w-40">
            <option value="all">All types</option>
            {PROPERTY_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
          </Select>
          <Select value={filters.status} onChange={set("status")} aria-label="Filter by status" className="lg:w-40">
            <option value="all">All statuses</option>
            {PROPERTY_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
          </Select>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setShowMore((v) => !v)} aria-expanded={showMore}>
            <SlidersHorizontal /> Price & area
          </Button>
          {active > 0 && (
            <Button variant="ghost" onClick={() => onChange(defaultFilters)}>
              <X /> Clear ({active})
            </Button>
          )}
        </div>
      </div>

      {showMore && (
        <div className="grid grid-cols-2 gap-3 border-t pt-3 lg:grid-cols-4">
          <Input type="number" min="0" inputMode="numeric" placeholder="Min price (₹)" aria-label="Minimum price" value={filters.minPrice} onChange={set("minPrice")} />
          <Input type="number" min="0" inputMode="numeric" placeholder="Max price (₹)" aria-label="Maximum price" value={filters.maxPrice} onChange={set("maxPrice")} />
          <Input type="number" min="0" inputMode="numeric" placeholder="Min area (sq ft)" aria-label="Minimum area" value={filters.minArea} onChange={set("minArea")} />
          <Input type="number" min="0" inputMode="numeric" placeholder="Max area (sq ft)" aria-label="Maximum area" value={filters.maxArea} onChange={set("maxArea")} />
        </div>
      )}
    </div>
  );
}
