import { Controller } from "react-hook-form";
import FormField from "@/components/common/FormField";
import ToggleField from "@/components/property/ToggleField";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select } from "@/components/ui/select";
import { AMENITIES } from "@/lib/features";
import { cn } from "@/lib/utils";

export default function AmenitiesSection({ control, register }) {
  const toggles = AMENITIES.filter((a) => a.type === "toggle");
  const selects = AMENITIES.filter((a) => a.type === "select");
  const checks = AMENITIES.filter((a) => a.type === "checkboxes");

  return (
    <Card>
      <CardHeader>
        <CardTitle>Property features and amenities</CardTitle>
        <CardDescription>Switch on what the property has.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-3 sm:grid-cols-2">
          {toggles.map((a) => (
            <ToggleField key={a.key} control={control} name={`amenities.${a.key}`} label={a.label} icon={a.icon} />
          ))}
        </div>

        <div className="grid gap-5 sm:grid-cols-3">
          {selects.map((a) => (
            <FormField key={a.key} label={a.label} htmlFor={`amenity-${a.key}`}>
              <Select id={`amenity-${a.key}`} {...register(`amenities.${a.key}`)}>
                {a.options.map((o) => <option key={o} value={o}>{o}</option>)}
              </Select>
            </FormField>
          ))}
        </div>

        {checks.map((a) => (
          <Controller
            key={a.key}
            control={control}
            name={`amenities.${a.key}`}
            render={({ field }) => {
              const value = field.value || [];
              return (
                <fieldset>
                  <legend className="mb-2 text-sm font-semibold">{a.label} <span className="font-normal text-muted-foreground">(select all that apply)</span></legend>
                  <div className="flex flex-wrap gap-2">
                    {a.options.map((opt) => {
                      const on = value.includes(opt);
                      return (
                        <label
                          key={opt}
                          className={cn(
                            "flex cursor-pointer items-center gap-2 rounded-md border px-3 py-2 text-sm transition-colors",
                            on ? "border-primary bg-accent text-accent-foreground" : "bg-card hover:bg-accent/50"
                          )}
                        >
                          <input
                            type="checkbox"
                            className="h-4 w-4 accent-primary"
                            checked={on}
                            onChange={() => field.onChange(on ? value.filter((v) => v !== opt) : [...value, opt])}
                          />
                          {opt}
                        </label>
                      );
                    })}
                  </div>
                </fieldset>
              );
            }}
          />
        ))}
      </CardContent>
    </Card>
  );
}
