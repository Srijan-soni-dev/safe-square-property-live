const segments = [
  { key: "available", label: "Available", color: "bg-emerald-500" },
  { key: "rented", label: "Rented", color: "bg-amber-500" },
  { key: "sold", label: "Sold", color: "bg-slate-500" },
];

export default function StatusBar({ stats }) {
  if (!stats.total) return null;
  return (
    <div className="rounded-lg border bg-card p-5 shadow-sm">
      <p className="text-sm font-semibold">Portfolio by status</p>
      <div className="mt-3 flex h-3 overflow-hidden rounded-full bg-muted" role="img" aria-label={segments.map((s) => `${s.label} ${stats[s.key]}`).join(", ")}>
        {segments.map((s) => (
          <div key={s.key} className={s.color} style={{ width: `${(stats[s.key] / stats.total) * 100}%` }} />
        ))}
      </div>
      <ul className="mt-3 flex flex-wrap gap-x-6 gap-y-1 text-sm">
        {segments.map((s) => (
          <li key={s.key} className="flex items-center gap-2 text-muted-foreground">
            <span className={`h-2.5 w-2.5 rounded-full ${s.color}`} />
            {s.label} <span className="font-semibold text-foreground">{Math.round((stats[s.key] / stats.total) * 100)}%</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
