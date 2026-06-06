"use client";

import { useTranslations } from "next-intl";
import { RiskGauge } from "@/components/tools/RiskGauge";

interface FreeToolResultDisplayProps {
  riskScore: number;
  riskLabel: string;
  explanation: string;
  premiumPreviewItems: string[];
}

export function FreeToolResultDisplay({
  riskScore,
  riskLabel,
  explanation,
  premiumPreviewItems,
}: FreeToolResultDisplayProps) {
  const t = useTranslations("freeTool");

  return (
    <div className="space-y-6">
      <RiskGauge score={riskScore} label={riskLabel} />

      <div className="rounded-2xl border border-slate/15 bg-off-white p-6 dark:border-slate-600 dark:bg-slate-800">
        <h3 className="mb-2 text-lg font-bold text-deep-navy dark:text-off-white">
          {t("whatItMeans")}
        </h3>
        <p className="text-sm leading-relaxed text-slate">{explanation}</p>
      </div>

      <div className="relative overflow-hidden rounded-2xl border border-slate/15 bg-deep-navy p-6">
        <h3 className="mb-3 text-lg font-bold text-white">{t("premiumPreviewTitle")}</h3>
        <ul className="space-y-2">
          {premiumPreviewItems.map((item) => (
            <li key={item} className="flex items-center gap-2 text-white/80">
              <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-cyan" />
              <span className="blur-sm select-none">{item}</span>
            </li>
          ))}
        </ul>
        <div className="absolute inset-0 flex items-center justify-center bg-deep-navy/40 backdrop-blur-[1px]">
          <span className="text-sm font-bold uppercase tracking-wider text-amber">
            {t("premiumBadge")}
          </span>
        </div>
      </div>
    </div>
  );
}
