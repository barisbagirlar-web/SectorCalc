"use client";

import { useTranslations } from "@/lib/i18n-stub";

interface RiskGaugeProps {
 score: number;
 label: string;
}

function gaugeColor(score: number): { text: string; bg: string; bar: string } {
 if (score > 70) {
 return { text: "text-amber", bg: "bg-amber/10", bar: "bg-amber" };
 }
 if (score > 40) {
 return { text: "text-amber", bg: "bg-amber/10", bar: "bg-amber" };
 }
 return { text: "text-deep-navy", bg: "bg-emerald/10", bar: "bg-deep-navy" };
}

export function RiskGauge({ score, label }: RiskGaugeProps) {
 const t = useTranslations("freeTool");
 const clamped = Math.min(100, Math.max(0, score));
 const colors = gaugeColor(clamped);

 return (
 <div
 className={`rounded-sm border border-border-subtle p-6 shadow-card ${colors.bg}`}
 >
 <div className="mb-2 flex items-center justify-between">
 <span className="text-sm font-medium uppercase tracking-wider text-text-secondary">
 {t("riskScoreLabel")}
 </span>
 <span className={`text-3xl font-bold ${colors.text}`}>{clamped}%</span>
 </div>
 <div
 className="h-2 w-full overflow-hidden rounded-full bg-slate/20"
 role="progressbar"
 aria-valuenow={clamped}
 aria-valuemin={0}
 aria-valuemax={100}
 aria-label={t("riskScoreAria", { score: clamped })}
 >
 <div
 className={`h-full rounded-full transition-all duration-500 ${colors.bar}`}
 style={{ width: `${clamped}%` }}
 />
 </div>
 <p className="mt-3 text-sm font-medium text-text-primary">{label}</p>
 </div>
 );
}
