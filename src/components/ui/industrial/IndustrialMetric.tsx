import type { ReactNode } from "react";

export interface IndustrialMetricProps {
  label: string;
  value: ReactNode;
  tone?: "default" | "amber" | "critical" | "stable";
  className?: string;
}

const toneClass = {
  default: "text-white",
  amber: "text-amber",
  critical: "text-red-400",
  stable: "text-emerald-400",
} as const;

export function IndustrialMetric({
  label,
  value,
  tone = "default",
  className = "",
}: IndustrialMetricProps) {
  return (
    <div className={`ind-terminal-metric ${className}`.trim()}>
      <span className="ind-mono-label text-slate-400">{label}</span>
      <div className={`mt-2 text-2xl font-bold tracking-tight ${toneClass[tone]}`}>
        {value}
      </div>
    </div>
  );
}
