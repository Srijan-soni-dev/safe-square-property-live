import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { NEARBY, withNearbyDefaults } from "@/lib/features";

export default function NearbyCard({ facilities }) {
  const data = withNearbyDefaults(facilities);
  const any = NEARBY.some((n) => data[n.key]);
  return (
    <Card>
      <CardHeader><CardTitle>Nearby facilities</CardTitle></CardHeader>
      <CardContent>
        {!any ? (
          <p className="text-sm text-muted-foreground">No distances added. Edit the property to add them.</p>
        ) : (
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {NEARBY.map(({ key, label, icon: Icon }) => (
              <li key={key} className="flex items-center gap-3 rounded-md border p-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-accent text-accent-foreground">
                  <Icon className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-muted-foreground">{label}</p>
                  <p className="text-sm font-semibold tabular-nums">{data[key] || "—"}</p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
