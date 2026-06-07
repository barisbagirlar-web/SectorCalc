"use client";

import { BarChart3, TrendingDown, TrendingUp } from "lucide-react";
import { useTranslations } from "next-intl";
import { MANUFACTURING_OS_I18N_NS } from "@/lib/os/registry/sectors";

export interface BenchmarkPanelProps {
  userScore: number;
  industryAvg: number;
  className?: string;
}

function formatScore(value: number): string {
  return `${Number(value.toFixed(1))}%`;
}

export function BenchmarkPanel({
  userScore,
  industryAvg,
  className = "",
}: BenchmarkPanelProps) {
  const t = useTranslations(MANUFACTURING_OS_I18N_NS);
  const isBetter = userScore > industryAvg;
  const isEqual = userScore === industryAvg;

  return (
    <div
      className={`mt-6 border border-technical-gray bg-white p-6 font-sans ${className}`.trim()}
    >
      <div className="mb-4 flex items-center gap-2">
        <BarChart3 className="h-4 w-4 text-body-charcoal" aria-hidden />
        <h3 className="label-badge text-body-charcoal">{t("benchmarkPanel.title")}</h3>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="grid grid-cols-2 gap-3 sm:gap-5">
          <div>
            <span className="text-[10px] uppercase text-body-charcoal">
              {t("benchmarkPanel.yourScore")}
            </span>
            <div className="data-value text-2xl font-bold text-premium-velvet">
              {formatScore(userScore)}
            </div>
          </div>
          <div>
            <span className="text-[10px] uppercase text-body-charcoal">
              {t("benchmarkPanel.industryAverage")}
            </span>
            <div className="data-value text-2xl font-bold text-premium-velvet">
              {formatScore(industryAvg)}
            </div>
          </div>
        </div>

        <div
          className={`inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold uppercase tracking-wider ${
            isEqual
              ? "border border-technical-gray bg-industrial-matte text-body-charcoal"
              : isBetter
                ? "status-safe-bg text-safe-green"
                : "status-crit-bg text-crit-red"
          }`}
        >
          {isEqual ? null : isBetter ? (
            <TrendingUp className="h-4 w-4" aria-hidden />
          ) : (
            <TrendingDown className="h-4 w-4" aria-hidden />
          )}
          {isEqual
            ? t("benchmarkPanel.atAverage")
            : isBetter
              ? t("benchmarkPanel.topPerformer")
              : t("benchmarkPanel.needsOptimization")}
        </div>
      </div>
    </div>
  );
}
