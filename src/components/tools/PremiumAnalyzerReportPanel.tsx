"use client";

import type { PremiumDecisionReport } from "@/lib/tools/premium-tool-contract";
import type { PremiumSeverity } from "@/lib/tools/premium-tool-results";

const severityStyles: Record<
  PremiumSeverity,
  { border: string; bg: string; verdict: string }
> = {
  safe: {
    border: "border-border-subtle",
    bg: "bg-light-gray",
    verdict: "text-safe-green status-safe",
  },
  watch: {
    border: "border-border-subtle",
    bg: "status-warn-bg",
    verdict: "text-warn-amber status-warn",
  },
  danger: {
    border: "border-border-subtle",
    bg: "status-crit-bg",
    verdict: "text-crit-red status-crit",
  },
};

function mapVerdictSeverity(
  severity: PremiumDecisionReport["verdict"]["severity"],
): PremiumSeverity {
  if (severity === "accept") {
    return "safe";
  }
  if (severity === "reject") {
    return "danger";
  }
  return "watch";
}

export interface PremiumAnalyzerReportPanelProps {
  report: PremiumDecisionReport;
}

export function PremiumAnalyzerReportPanel({ report }: PremiumAnalyzerReportPanelProps) {
  const uiSeverity = mapVerdictSeverity(report.verdict.severity);
  const styles = severityStyles[uiSeverity];

  return (
    <article
      className={`sc-card sc-result-reveal min-w-0 ${styles.border} ${styles.bg}`}
      aria-live="polite"
    >
      <p className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
        Decision headline
      </p>
      <p className="mt-2 text-sm leading-relaxed text-text-primary">{report.summary}</p>

      <p className="mt-6 text-xs font-semibold uppercase tracking-wider text-text-secondary">
        Decision verdict
      </p>
      <p className={`mt-2 text-xl font-bold leading-snug sm:text-2xl ${styles.verdict}`}>
        {report.verdict.label}
      </p>

      <div className="mt-6 rounded-sm border border-border-subtle bg-white p-5">
        <p className="text-sm font-medium text-text-secondary">{report.primaryMetricLabel}</p>
        <p className="mt-1 text-3xl font-bold tracking-tight text-text-primary">
          {report.primaryMetricValue}
        </p>
      </div>

      <div className="mt-6 grid min-w-0 gap-3 sm:grid-cols-2">
        <div className="rounded-sm border border-border-subtle bg-white/80 p-4">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-text-secondary">
            Visible cost
          </p>
          <p className="mt-1 font-mono text-lg tabular-nums text-text-primary">
            {report.baseCostDisplay}
          </p>
        </div>
        <div className="rounded-sm border border-border-subtle bg-white/80 p-4">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-text-secondary">
            Buffered cost floor
          </p>
          <p className="mt-1 font-mono text-lg tabular-nums text-text-primary">
            {report.adjustedCostDisplay}
          </p>
        </div>
        <div className="rounded-sm border border-border-subtle bg-white/80 p-4">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-text-secondary">
            P90 cost exposure
          </p>
          <p className="mt-1 font-mono text-lg tabular-nums text-text-primary">
            {report.p90CostDisplay}
          </p>
        </div>
        {report.quotedPriceDisplay ? (
          <div className="rounded-sm border border-border-subtle bg-white/80 p-4">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-text-secondary">
              Quoted price
            </p>
            <p className="mt-1 font-mono text-lg tabular-nums text-text-primary">
              {report.quotedPriceDisplay}
            </p>
          </div>
        ) : null}
      </div>

      <div className="mt-6">
        <p className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
          Hidden loss drivers
        </p>
        <ul className="mt-3 space-y-2">
          {report.hiddenLossDrivers.map((driver) => (
            <li key={driver.id} className="text-sm text-text-primary">
              <span className="font-medium">{driver.label}</span>
              {" — "}
              {driver.amountDisplay}. {driver.explanation}
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-6">
        <p className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
          Sensitivity
        </p>
        <ul className="mt-3 space-y-2">
          {report.sensitivity.map((row) => (
            <li key={`${row.factor}-${row.shockPercent}`} className="text-sm text-text-primary">
              {row.impactSummary}
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-6 rounded-sm border border-border-subtle bg-white/80 p-4">
        <p className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
          Suggested action
        </p>
        <p className="mt-2 text-sm leading-relaxed text-text-primary">{report.recommendation}</p>
      </div>

      <p className="mt-6 text-xs leading-relaxed text-text-secondary">{report.legalNote}</p>
    </article>
  );
}
