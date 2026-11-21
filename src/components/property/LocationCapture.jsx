import { AlertCircle, CheckCircle2, ExternalLink, Loader2, LocateFixed, X } from "lucide-react";
import FormField from "@/components/common/FormField";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useGeolocation } from "@/hooks/useGeolocation";
import { buildMapLink, isValidCoord } from "@/lib/geo";

export default function LocationCapture({ register, errors, watch, setValue }) {
  const { locate, loading, error, accuracy, reset } = useGeolocation();
  const [lat, lng] = watch(["latitude", "longitude"]);
  const mapLink = isValidCoord(lat, lng) ? buildMapLink(lat, lng) : "";
  const opts = { shouldValidate: true, shouldDirty: true };

  function capture() {
    locate(({ latitude, longitude }) => {
      setValue("latitude", latitude, opts);
      setValue("longitude", longitude, opts);
    });
  }

  function clear() {
    setValue("latitude", "", opts);
    setValue("longitude", "", opts);
    reset();
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>GPS location</CardTitle>
        <CardDescription>Stand at the property and tap the button. Your browser will ask for location permission.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="flex flex-wrap gap-2">
          <Button type="button" onClick={capture} disabled={loading}>
            {loading ? <Loader2 className="animate-spin" /> : <LocateFixed />}
            {loading ? "Getting location" : "Get Current Property Location"}
          </Button>
          {(lat || lng) && (
            <Button type="button" variant="outline" onClick={clear} disabled={loading}>
              <X /> Clear
            </Button>
          )}
        </div>

        {error && (
          <div role="alert" className="flex items-start gap-2 rounded-md border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {accuracy !== null && !error && (
          <div role="status" className="flex items-start gap-2 rounded-md border border-emerald-500/40 bg-emerald-500/10 p-3 text-sm text-emerald-700 dark:text-emerald-400">
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
            <span>
              Location captured (accurate to about {accuracy} m).
              {accuracy > 100 && " Accuracy is low. Step outside or wait a moment and capture again."}
            </span>
          </div>
        )}

        <div className="grid gap-5 sm:grid-cols-2">
          <FormField label="Latitude" htmlFor="latitude" error={errors.latitude?.message}>
            <Input id="latitude" inputMode="decimal" placeholder="e.g. 26.218287" aria-invalid={!!errors.latitude} {...register("latitude")} />
          </FormField>
          <FormField label="Longitude" htmlFor="longitude" error={errors.longitude?.message}>
            <Input id="longitude" inputMode="decimal" placeholder="e.g. 78.182831" aria-invalid={!!errors.longitude} {...register("longitude")} />
          </FormField>
          <FormField label="Google Maps link" htmlFor="mapLink" className="sm:col-span-2" hint="Created automatically from latitude and longitude">
            <div className="flex gap-2">
              <Input id="mapLink" readOnly value={mapLink} placeholder="Appears after the location is captured" className="text-muted-foreground" />
              {mapLink && (
                <Button asChild variant="outline" size="icon" title="Open in Google Maps">
                  <a href={mapLink} target="_blank" rel="noopener noreferrer" aria-label="Open in Google Maps"><ExternalLink /></a>
                </Button>
              )}
            </div>
          </FormField>
        </div>
      </CardContent>
    </Card>
  );
}
