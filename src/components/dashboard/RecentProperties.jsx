import { Link } from "react-router-dom";
import { Building2, MapPin, Plus } from "lucide-react";
import EmptyState from "@/components/common/EmptyState";
import StatusBadge from "@/components/common/StatusBadge";
import PropertyThumb from "@/components/property/PropertyThumb";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDate, formatPrice } from "@/lib/format";

export default function RecentProperties({ properties, loading }) {
  return (
    <section className="rounded-lg border bg-card shadow-sm" aria-labelledby="recent-heading">
      <div className="flex items-center justify-between border-b px-5 py-4">
        <h2 id="recent-heading" className="text-base font-semibold">Recently added</h2>
        <Button asChild variant="ghost" size="sm">
          <Link to="/properties">View all</Link>
        </Button>
      </div>

      {loading ? (
        <ul className="divide-y">
          {[0, 1, 2].map((i) => (
            <li key={i} className="flex items-center gap-4 p-4">
              <Skeleton className="h-14 w-20" />
              <div className="flex-1 space-y-2"><Skeleton className="h-4 w-1/2" /><Skeleton className="h-3 w-1/3" /></div>
            </li>
          ))}
        </ul>
      ) : properties.length === 0 ? (
        <EmptyState icon={Building2} title="No properties yet" description="Add your first property to start building your records.">
          <Button asChild><Link to="/properties/new"><Plus /> Add property</Link></Button>
        </EmptyState>
      ) : (
        <ul className="divide-y">
          {properties.map((p) => (
            <li key={p.id}>
              <Link to={`/properties/${p.id}`} className="flex items-center gap-4 p-4 transition-colors hover:bg-accent/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring">
                <PropertyThumb property={p} className="h-14 w-20 shrink-0 rounded-md" />
                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold">{p.title}</p>
                  <p className="mt-0.5 flex items-center gap-1 truncate text-xs text-muted-foreground">
                    <MapPin className="h-3 w-3 shrink-0" /> {p.location || "—"} · {p.property_type} · Added {formatDate(p.created_at)}
                  </p>
                </div>
                <div className="hidden shrink-0 text-right sm:block">
                  <p className="text-sm font-semibold">{formatPrice(p.price)}</p>
                </div>
                <StatusBadge status={p.status} className="shrink-0" />
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
