"use client";

import { AlertTriangle, CheckCircle2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { BenchmarkPanel } from "@/components/os/BenchmarkPanel";
import { IntelligencePanel } from "@/components/os/IntelligencePanel";
import { IndustrialBadge } from "@/components/ui/industrial";
import type { SectorIntelligenceResult } from "@/lib/os/core/intelligence-layer";
import { MANUFACTURING_OS_I18N_NS } from "@/lib/os/registry/sectors";
import type { SmartModuleId } from "@/lib/os/registry/smart-modules";

export type ExpertVerdictStatus = "CRITICAL" | "OPTIMAL";

export interface ExpertVerdictPanelProps {
  sectorTitle: string;
  status: ExpertVerdictStatus;
  variancePct: string;
  financialLoss: string;
  intelligence: SectorIntelligenceResult | null;
  features: readonly SmartModuleId[];
  benchmark?: { userScore: number; industryAvg: number } | null;
  showBenchmark?: boolean;
  onRestart: () => void;
}

function riskPercentFromVariance(variancePct: string): number {
  const numeric = parseFloat(variancePct);
  if (!Number.isFinite(numeric)) {
    return 50;
  }
  return Math.min(100, Math.max(8, Math.round(numeric * 2.5)));
}

export function ExpertVerdictPanel({
  sectorTitle,
  status,
  variancePct,
  financialLoss,
  intelligence,
  features,
  benchmark,
  showBenchmark = false,
  onRestart,
}: ExpertVerdictPanelProps) {
  const t = useTranslations(MANUFACTURING_OS_I18N_NS);
  const isCritical = status === "CRITICAL";
  const riskPct = riskPercentFromVariance(variancePct);

  return (
    <div className="mx-auto max-w-2xl space-y-6 font-sans">
      <div className="ind-os-panel p-5">
        <p className="label-badge text-body-charcoal">{sectorTitle}</p>
        <h2 className="font-display mt-2 text-2xl font-semibold tracking-tight text-premium-velvet">
          {t("expertVerdict.title")}
        </h2>

        <div className="mt-6 flex flex-wrap items-center gap-2">
          <IndustrialBadge tone={isCritical ? "critical" : "stable"}>
            {isCritical ? t("expertVerdict.statusHigh") : t("expertVerdict.statusOk")}
          </IndustrialBadge>
          <span className="text-xs text-body-charcoal">{t("expertVerdict.premiumBadge")}</span>
        </div>

        <p className="mt-4 text-base font-medium leading-snug text-premium-velvet">
          {isCritical ? t("expertVerdict.summaryHigh", { variance: variancePct }) : t("expertVerdict.summaryOk")}
        </p>

        <div className="mt-6">
          <div className="mb-1 flex items-center justify-between text-[10px] uppercase tracking-wide text-body-charcoal">
            <span>{t("expertVerdict.riskGauge")}</span>
            <span>{riskPct}%</span>
          </div>
          <div
            className="h-2 w-full overflow-hidden rounded-full bg-technical-gray/40"
            role="meter"
            aria-valuenow={riskPct}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={t("expertVerdict.riskGauge")}
          >
            <div
              className={`h-full rounded-full transition-all ${
                isCritical ? "bg-warn-amber" : "bg-safe-green"
              }`}
              style={{ width: `${riskPct}%` }}
            />
          </div>
        </div>

        <dl className="mt-6 grid gap-3 sm:grid-cols-2">
          <div>
            <dt className="text-[10px] uppercase tracking-wide text-body-charcoal">
              {t("auditPanel.variance")}
            </dt>
            <dd className="data-value text-lg font-bold text-warn-amber">{variancePct}%</dd>
          </div>
          <div>
            <dt className="text-[10px] uppercase tracking-wide text-body-charcoal">
              {t("auditPanel.financialImpact")}
            </dt>
            <dd className="data-value text-lg font-bold text-premium-velvet">{financialLoss}</dd>
          </div>
        </dl>

        <div className="mt-4 flex items-start gap-2 rounded-sm border border-technical-gray/60 bg-white/60 p-3 text-sm text-body-charcoal">
          {isCritical ? (
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-red-400" aria-hidden />
          ) : (
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" aria-hidden />
          )}
          <p>{isCritical ? t("expertVerdict.actionHigh") : t("expertVerdict.actionOk")}</p>
        </div>

        {intelligence ? (
          <IntelligencePanel intelligence={intelligence} features={features} />
        ) : null}

        {showBenchmark && benchmark ? (
          <BenchmarkPanel userScore={benchmark.userScore} industryAvg={benchmark.industryAvg} />
        ) : null}

        <button
          type="button"
          onClick={onRestart}
          className="mt-8 text-xs font-semibold uppercase tracking-wider text-body-charcoal transition-colors hover:text-premium-velvet"
        >
          {t("premiumAudit.restart")}
        </button>
      </div>
    </div>
  );
}
