"use client";

import { IndustrialFieldPanel } from "@/components/tools/IndustrialFieldPanel";
import type { PremiumDecisionReport } from "@/lib/tools/premium-tool-contract";

export interface PremiumAnalyzerReportPanelProps {
  report: PremiumDecisionReport;
}

export function PremiumAnalyzerReportPanel({ report }: PremiumAnalyzerReportPanelProps) {
  return (
    <article className="min-w-0 space-y-4" aria-live="polite">
      <IndustrialFieldPanel
        panel={report.architecture.fieldPanel}
        verdictSeverity={report.verdict.severity}
      />

      <div className="sc-premium-report">
        <div className="sc-premium-report-section">
          <p className="sc-premium-report-section__title">Hidden loss drivers</p>
          <div className="sc-loss-driver-grid">
            {report.hiddenLossDrivers.map((driver) => (
              <div key={driver.id} className="sc-loss-driver-card">
                <p className="sc-loss-driver-card__label">{driver.label}</p>
                <p className="sc-loss-driver-card__amount">{driver.amountDisplay}</p>
                <p className="mt-1 text-xs leading-relaxed text-body-charcoal">
                  {driver.explanation}
                </p>
              </div>
            ))}
          </div>
        </div>

        <details className="sc-premium-report-section">
          <summary className="cursor-pointer sc-premium-report-section__title">
            Sensitivity — Measurement · Loss · Optimization
          </summary>
          <ul className="mt-3 space-y-2 border-t border-technical-gray pt-3">
            {report.architecture.profile.engineModes.map((mode) => (
              <li key={mode.mode} className="text-sm text-body-charcoal">
                <span className="font-semibold text-premium-velvet">{mode.label}:</span>{" "}
                {mode.operatorSummary}
              </li>
            ))}
            {report.sensitivity.map((row) => (
              <li key={`${row.factor}-${row.shockPercent}`} className="text-sm text-body-charcoal">
                {row.impactSummary}
              </li>
            ))}
          </ul>
        </details>
      </div>

      <p className="text-xs leading-relaxed text-body-charcoal">{report.legalNote}</p>
    </article>
  );
}
