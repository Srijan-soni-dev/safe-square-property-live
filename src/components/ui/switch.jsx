import * as React from "react";
import { cn } from "@/lib/utils";

const Switch = React.forwardRef(({ checked, onCheckedChange, className, disabled, ...props }, ref) => (
  <button
    ref={ref}
    type="button"
    role="switch"
    aria-checked={!!checked}
    disabled={disabled}
    onClick={() => onCheckedChange?.(!checked)}
    className={cn(
      "relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-60",
      checked ? "bg-primary" : "bg-muted-foreground/40",
      className
    )}
    {...props}
  >
    <span
      className={cn(
        "pointer-events-none block h-5 w-5 rounded-full bg-white shadow transition-transform",
        checked ? "translate-x-[22px]" : "translate-x-0.5"
      )}
    />
  </button>
));
Switch.displayName = "Switch";

export { Switch };
