import { Controller } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

/** Yes / No switch bound to a react-hook-form boolean field. */
export default function ToggleField({ control, name, label, description, icon: Icon, className }) {
  const id = `toggle-${name.replace(/\./g, "-")}`;
  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => (
        <div className={`flex items-center justify-between gap-4 rounded-lg border bg-card p-3 ${className || ""}`}>
          <div className="flex min-w-0 items-center gap-3">
            {Icon && (
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-accent text-accent-foreground">
                <Icon className="h-4 w-4" />
              </div>
            )}
            <div className="min-w-0">
              <Label htmlFor={id} className="cursor-pointer">{label}</Label>
              {description && <p className="mt-1 text-xs text-muted-foreground">{description}</p>}
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <span className="w-7 text-right text-xs font-semibold text-muted-foreground">{field.value ? "Yes" : "No"}</span>
            <Switch id={id} checked={!!field.value} onCheckedChange={field.onChange} aria-label={label} />
          </div>
        </div>
      )}
    />
  );
}
