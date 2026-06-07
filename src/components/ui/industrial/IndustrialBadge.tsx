import type { ReactNode } from "react";

export type IndustrialBadgeTone = "neutral" | "amber" | "critical" | "stable";

export interface IndustrialBadgeProps {
  children: ReactNode;
  tone?: IndustrialBadgeTone;
  className?: string;
}

const toneClass: Record<IndustrialBadgeTone, string> = {
  neutral: "border-slate-600 text-slate-300",
  amber: "border-amber/40 text-amber",
  critical: "border-red-500/40 text-red-400",
  stable: "border-emerald-500/40 text-emerald-400",
};

export function IndustrialBadge({
  children,
  tone = "neutral",
  className = "",
}: IndustrialBadgeProps) {
  return (
    <span
      className={`inline-flex items-center border px-2 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wider ${toneClass[tone]} ${className}`.trim()}
    >
      {children}
    </span>
  );
}
