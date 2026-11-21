import FormField from "@/components/common/FormField";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { NEARBY } from "@/lib/features";

export default function NearbySection({ register, errors }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Nearby facilities</CardTitle>
        <CardDescription>Approximate distance from the property. Examples: 500m, 1km, 2.5km. Leave blank if unknown.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {NEARBY.map((n) => (
          <FormField key={n.key} label={`${n.label} distance`} htmlFor={`nearby-${n.key}`} error={errors.nearby?.[n.key]?.message}>
            <Input
              id={`nearby-${n.key}`}
              placeholder="e.g. 1km"
              autoComplete="off"
              aria-invalid={!!errors.nearby?.[n.key]}
              {...register(`nearby.${n.key}`)}
            />
          </FormField>
        ))}
      </CardContent>
    </Card>
  );
}
