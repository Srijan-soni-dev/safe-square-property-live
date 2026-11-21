import { cn } from "@/lib/utils";

const styles = {
  Available: "bg-emerald-500/10 text-emerald-700 ring-emerald-500/25 dark:text-emerald-400",
  Sold: "bg-slate-500/10 text-slate-700 ring-slate-500/25 dark:text-slate-300",
  Rented: "bg-amber-500/12 text-amber-700 ring-amber-500/30 dark:text-amber-400",
};
const dots = { Available: "bg-emerald-500", Sold: "bg-slate-500", Rented: "bg-amber-500" };

export default function StatusBadge({ status, className }) {
  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset", styles[status], className)}>
      <span className={cn("h-1.5 w-1.5 rounded-full", dots[status])} />
      {status}
    </span>
  );
}
