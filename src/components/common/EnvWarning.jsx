import { AlertTriangle } from "lucide-react";

export default function EnvWarning() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-6">
      <div className="max-w-md rounded-lg border border-destructive/40 bg-card p-6 shadow-sm">
        <div className="mb-3 flex items-center gap-2 text-destructive">
          <AlertTriangle className="h-5 w-5" />
          <h1 className="text-lg font-semibold">Supabase is not configured</h1>
        </div>
        <p className="text-sm text-muted-foreground">
          Create a <code className="rounded bg-muted px-1">.env</code> file from{" "}
          <code className="rounded bg-muted px-1">.env.example</code>, add{" "}
          <code className="rounded bg-muted px-1">VITE_SUPABASE_URL</code> and{" "}
          <code className="rounded bg-muted px-1">VITE_SUPABASE_ANON_KEY</code>, then restart{" "}
          <code className="rounded bg-muted px-1">npm run dev</code>.
        </p>
      </div>
    </div>
  );
}
