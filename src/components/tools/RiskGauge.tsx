"use client";

import { useTranslations } from "next-intl";

interface RiskGaugeProps {
  score: number;
  label: string;
}

function gaugeColor(score: number): { text: string; bg: string; bar: string } {
  if (score > 70) {
    return { text: "text-soft-red", bg: "bg-soft-red/10", bar: "bg-soft-red" };
  }
  if (score > 40) {
    return { text: "text-amber", bg: "bg-amber/10", bar: "bg-amber" };
  }
  return { text: "text-emerald", bg: "bg-emerald/10", bar: "bg-emerald" };
}

export function RiskGauge({ score, label }: RiskGaugeProps) {
  const t = useTranslations("freeTool");
  const clamped = Math.min(100, Math.max(0, score));
  const colors = gaugeColor(clamped);

  return (
    <div
      className={`rounded-2xl border border-slate/15 p-6 dark:border-slate-600 ${colors.bg}`}
    >
      <div className="mb-2 flex items-center justify-between">
        <span className="text-sm font-medium uppercase tracking-wider text-slate">
          {t("riskScoreLabel")}
        </span>
        <span className={`text-3xl font-bold ${colors.text}`}>{clamped}%</span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-slate/20">
        <div
          className={`h-full rounded-full transition-all duration-500 ${colors.bar}`}
          style={{ width: `${clamped}%` }}
        />
      </div>
      <p className="mt-3 text-sm font-medium text-deep-navy dark:text-off-white">{label}</p>
    </div>
  );
}
