interface AdminMetricCardProps {
  label: string;
  value: string;
  hint?: string;
}

export function AdminMetricCard({ label, value, hint }: AdminMetricCardProps) {
  return (
    <article className="rounded-xl border border-slate/20 bg-white p-5 shadow-card">
      <p className="text-xs font-semibold uppercase tracking-wider text-slate">
        {label}
      </p>
      <p className="mt-2 text-2xl font-bold text-deep-navy">{value}</p>
      {hint ? (
        <p className="mt-1 text-xs text-slate">{hint}</p>
      ) : null}
    </article>
  );
}
