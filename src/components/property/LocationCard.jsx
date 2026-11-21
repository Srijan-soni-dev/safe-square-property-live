import { ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { isGoogleMapsLink } from "@/lib/geo";

export default function LocationCard({ property }) {
  const { latitude, longitude, map_link: mapLink } = property;
  const hasGps = latitude !== null && latitude !== undefined && longitude !== null && longitude !== undefined;
  const safeLink = isGoogleMapsLink(mapLink) ? mapLink : "";

  return (
    <Card>
      <CardHeader><CardTitle>GPS location</CardTitle></CardHeader>
      <CardContent className="space-y-4">
        {!hasGps ? (
          <p className="text-sm text-muted-foreground">No GPS location saved. Edit the property and use "Get Current Property Location".</p>
        ) : (
          <>
            <dl className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <dt className="text-xs font-semibold text-muted-foreground">Latitude</dt>
                <dd className="font-medium tabular-nums">{latitude}</dd>
              </div>
              <div>
                <dt className="text-xs font-semibold text-muted-foreground">Longitude</dt>
                <dd className="font-medium tabular-nums">{longitude}</dd>
              </div>
              <div className="col-span-2">
                <dt className="text-xs font-semibold text-muted-foreground">Map link</dt>
                <dd className="break-all font-medium">
                  {safeLink ? (
                    <a href={safeLink} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">{safeLink}</a>
                  ) : (
                    "—"
                  )}
                </dd>
              </div>
            </dl>
            {safeLink && (
              <Button asChild className="w-full">
                <a href={safeLink} target="_blank" rel="noopener noreferrer"><ExternalLink /> Open in Google Maps</a>
              </Button>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
