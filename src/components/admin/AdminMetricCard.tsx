interface AdminMetricCardProps {
 label: string;
 value: string;
 hint?: string;
}

export function AdminMetricCard({ label, value, hint }: AdminMetricCardProps) {
 return (
 <article className="rounded-sm border border-slate/20 bg-white p-5 shadow-card">
 <p className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
 {label}
 </p>
 <p className="mt-2 text-2xl font-bold text-ink-black">{value}</p>
 {hint ? (
 <p className="mt-1 text-xs text-text-secondary">{hint}</p>
 ) : null}
 </article>
 );
}
