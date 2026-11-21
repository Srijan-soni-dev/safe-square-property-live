import { Loader2 } from "lucide-react";

export default function PageLoader({ label = "Loading" }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background" role="status" aria-live="polite">
      <div className="flex flex-col items-center gap-3 text-muted-foreground">
        <Loader2 className="h-7 w-7 animate-spin text-primary" />
        <span className="text-sm font-medium">{label}</span>
      </div>
    </div>
  );
}
