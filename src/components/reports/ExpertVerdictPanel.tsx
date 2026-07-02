"use client";

import { useTranslations } from "@/lib/i18n-stub";
import { BenchmarkPanel } from "@/components/os/BenchmarkPanel";
import { IntelligencePanel } from "@/components/os/IntelligencePanel";
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
    <div className="mx-auto max-w-2xl font-sans">
      <div className="sc-premium-report">
        <div className="sc-premium-report-section">
          <p className="sc-craft-eyebrow">{sectorTitle}</p>
          <h2 className="sc-craft-headline text-xl sm:text-2xl">{t("expertVerdict.title")}</h2>
        </div>

        <div className={isCritical ? "sc-risk-strip sc-risk-strip--danger" : "sc-risk-strip sc-risk-strip--safe"}>
          {isCritical
            ? "High risk — hidden cost may erase the margin."
            : "Current inputs are inside the acceptable range."}
        </div>

        <div className="sc-premium-report-section">
          <p className="text-base font-medium leading-snug text-premium-velvet">
            {isCritical
              ? t("expertVerdict.summaryHigh", { variance: variancePct })
              : t("expertVerdict.summaryOk")}
          </p>

          <div className="mt-5">
            <div className="mb-1 flex items-center justify-between text-[10px] uppercase tracking-wide text-body-charcoal">
              <span>{t("expertVerdict.riskGauge")}</span>
              <span>{riskPct}%</span>
            </div>
            <div
              className="h-2 w-full overflow-hidden bg-technical-gray/40"
              role="meter"
              aria-valuenow={riskPct}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label={t("expertVerdict.riskGauge")}
            >
              <div
                className={`h-full transition-all ${isCritical ? "bg-warn-amber" : "bg-safe-green"}`}
                style={{ width: `${riskPct}%` }}
              />
            </div>
          </div>

          <dl className="sc-result-secondary-grid mt-5">
            <div>
              <dt>{t("auditPanel.variance")}</dt>
              <dd className="text-warn-amber">{variancePct}%</dd>
            </div>
            <div>
              <dt>{t("auditPanel.financialImpact")}</dt>
              <dd>{financialLoss}</dd>
            </div>
          </dl>

          <div className="sc-decision-block mt-4">
            <p className="sc-decision-block__title">Suggested action</p>
            <p className="sc-decision-block__body">
              {isCritical ? t("expertVerdict.actionHigh") : t("expertVerdict.actionOk")}
            </p>
          </div>
        </div>

        {intelligence ? (
          <div className="sc-premium-report-section">
            <IntelligencePanel intelligence={intelligence} features={features} />
          </div>
        ) : null}

        {showBenchmark && benchmark ? (
          <div className="sc-premium-report-section">
            <BenchmarkPanel userScore={benchmark.userScore} industryAvg={benchmark.industryAvg} />
          </div>
        ) : null}

        <div className="sc-premium-report-section">
          <button
            type="button"
            onClick={onRestart}
            className="text-xs font-semibold uppercase tracking-wider text-body-charcoal transition-colors hover:text-premium-velvet"
          >
            {t("premiumAudit.restart")}
          </button>
        </div>
      </div>
    </div>
  );
}
