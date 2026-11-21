import { Check, Minus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AMENITIES, withAmenityDefaults } from "@/lib/features";
import { cn } from "@/lib/utils";

export default function AmenitiesCard({ amenities }) {
  const data = withAmenityDefaults(amenities);
  return (
    <Card>
      <CardHeader><CardTitle>Features and amenities</CardTitle></CardHeader>
      <CardContent>
        <ul className="grid gap-3 sm:grid-cols-2">
          {AMENITIES.map(({ key, label, icon: Icon, type }) => {
            const value = data[key];
            const on = type === "toggle" ? !!value : type === "checkboxes" ? value.length > 0 : value !== "None";
            return (
              <li key={key} className={cn("flex items-start gap-3 rounded-md border p-3", !on && "opacity-60")}>
                <div className={cn("flex h-9 w-9 shrink-0 items-center justify-center rounded-md", on ? "bg-emerald-500/12 text-emerald-600 dark:text-emerald-400" : "bg-muted text-muted-foreground")}>
                  <Icon className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-muted-foreground">{label}</p>
                  <div className="text-sm font-medium">
                    {type === "toggle" && (
                      <span className="flex items-center gap-1">
                        {on ? <Check className="h-4 w-4 text-emerald-500" /> : <Minus className="h-4 w-4" />}
                        {on ? "Available" : "Not available"}
                      </span>
                    )}
                    {type === "select" && value}
                    {type === "checkboxes" &&
                      (value.length ? (
                        <span className="mt-1 flex flex-wrap gap-1.5">
                          {value.map((v) => <span key={v} className="rounded-full bg-accent px-2 py-0.5 text-xs text-accent-foreground">{v}</span>)}
                        </span>
                      ) : (
                        "Not specified"
                      ))}
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </CardContent>
    </Card>
  );
}
