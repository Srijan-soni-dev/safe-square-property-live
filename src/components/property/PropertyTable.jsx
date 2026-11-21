import { Link } from "react-router-dom";
import { Eye, MapPin, Pencil, Trash2 } from "lucide-react";
import StatusBadge from "@/components/common/StatusBadge";
import PropertyThumb from "@/components/property/PropertyThumb";
import { Button } from "@/components/ui/button";
import { formatArea, formatDate, formatPrice } from "@/lib/format";

const contacts = (p) => [p.owner_phone, p.additional_contact_number].filter(Boolean);

function Actions({ property, onDelete }) {
  return (
    <div className="flex items-center justify-end gap-1">
      <Button asChild variant="ghost" size="icon" className="h-9 w-9" title="View">
        <Link to={`/properties/${property.id}`} aria-label={`View ${property.title}`}><Eye /></Link>
      </Button>
      <Button asChild variant="ghost" size="icon" className="h-9 w-9" title="Edit">
        <Link to={`/properties/${property.id}/edit`} aria-label={`Edit ${property.title}`}><Pencil /></Link>
      </Button>
      <Button variant="ghost" size="icon" className="h-9 w-9 text-destructive hover:bg-destructive/10 hover:text-destructive" title="Delete" aria-label={`Delete ${property.title}`} onClick={() => onDelete(property)}>
        <Trash2 />
      </Button>
    </div>
  );
}

function OwnerCell({ property }) {
  const numbers = contacts(property);
  return (
    <>
      <p className="font-medium">{property.owner_name || "—"}</p>
      {numbers.length > 0 && (
        <p className="text-xs text-muted-foreground tabular-nums">
          {numbers.map((n, i) => (
            <span key={n + i}>
              {i > 0 && " · "}
              <a href={`tel:${n.replace(/\s/g, "")}`} className="hover:text-primary hover:underline">{n}</a>
            </span>
          ))}
        </p>
      )}
    </>
  );
}

export default function PropertyTable({ properties, onDelete }) {
  return (
    <>
      {/* Desktop table */}
      <div className="hidden overflow-x-auto md:block">
        <table className="w-full min-w-[960px] text-left text-sm">
          <thead>
            <tr className="border-b bg-muted/50 text-xs font-semibold text-muted-foreground">
              <th className="px-4 py-3">Image</th>
              <th className="px-4 py-3">Title</th>
              <th className="px-4 py-3">Type</th>
              <th className="px-4 py-3">Owner and contacts</th>
              <th className="px-4 py-3">Location</th>
              <th className="px-4 py-3">Price</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {properties.map((p) => (
              <tr key={p.id} className="transition-colors hover:bg-accent/40">
                <td className="px-4 py-3"><PropertyThumb property={p} className="h-12 w-16 rounded-md" /></td>
                <td className="max-w-[240px] px-4 py-3">
                  <Link to={`/properties/${p.id}`} className="block truncate font-semibold hover:text-primary hover:underline">{p.title}</Link>
                  <p className="text-xs text-muted-foreground">{formatArea(p.area)} · Added {formatDate(p.created_at)}</p>
                </td>
                <td className="px-4 py-3">{p.property_type}</td>
                <td className="px-4 py-3"><OwnerCell property={p} /></td>
                <td className="max-w-[180px] truncate px-4 py-3">{p.location || "—"}</td>
                <td className="whitespace-nowrap px-4 py-3 font-semibold">{formatPrice(p.price)}</td>
                <td className="px-4 py-3"><StatusBadge status={p.status} /></td>
                <td className="px-4 py-3"><Actions property={p} onDelete={onDelete} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <ul className="divide-y md:hidden">
        {properties.map((p) => (
          <li key={p.id} className="p-4">
            <div className="flex gap-3">
              <PropertyThumb property={p} className="h-16 w-20 shrink-0 rounded-md" />
              <div className="min-w-0 flex-1">
                <Link to={`/properties/${p.id}`} className="block truncate font-semibold">{p.title}</Link>
                <p className="mt-0.5 flex items-center gap-1 truncate text-xs text-muted-foreground">
                  <MapPin className="h-3 w-3 shrink-0" /> {p.location || "—"} · {p.property_type}
                </p>
                <p className="mt-1 text-sm font-semibold">{formatPrice(p.price)}</p>
              </div>
            </div>
            <div className="mt-3 flex items-start justify-between gap-3">
              <div className="min-w-0 space-y-1.5">
                <StatusBadge status={p.status} />
                <div className="text-sm"><OwnerCell property={p} /></div>
              </div>
              <Actions property={p} onDelete={onDelete} />
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}
