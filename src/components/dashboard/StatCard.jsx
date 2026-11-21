import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

const tones = {
  primary: "bg-primary/10 text-primary",
  emerald: "bg-emerald-500/12 text-emerald-600 dark:text-emerald-400",
  slate: "bg-slate-500/12 text-slate-600 dark:text-slate-300",
  amber: "bg-amber-500/14 text-amber-600 dark:text-amber-400",
};

export default function StatCard({ label, value, icon: Icon, tone = "primary", loading }) {
  return (
    <div className="rounded-lg border bg-card p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-muted-foreground">{label}</p>
        <div className={cn("flex h-10 w-10 items-center justify-center rounded-lg", tones[tone])}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
      {loading ? <Skeleton className="mt-3 h-9 w-16" /> : <p className="mt-2 font-display text-4xl font-bold tabular-nums">{value}</p>}
    </div>
  );
}
