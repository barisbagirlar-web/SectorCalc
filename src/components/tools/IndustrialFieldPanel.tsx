"use client";

import type { PremiumFieldPanel, ToleranceStatus } from "@/lib/premium/premium-architecture";
import type { PremiumSeverity } from "@/lib/tools/premium-tool-contract";

const verdictStripClass: Record<PremiumSeverity, string> = {
  accept: "sc-risk-strip sc-risk-strip--safe",
  caution: "sc-risk-strip sc-risk-strip--watch",
  reject: "sc-risk-strip sc-risk-strip--danger",
};

const kpiStyles = {
  ok: "",
  warn: "border-warn-amber/40 bg-status-warn-bg",
  bad: "border-crit-red/40 bg-status-crit-bg",
} as const;

const toleranceBadge: Record<ToleranceStatus, string> = {
  within: "text-safe-green",
  watch: "text-warn-amber",
  breach: "text-crit-red",
};

export interface IndustrialFieldPanelProps {
  panel: PremiumFieldPanel;
  verdictSeverity: PremiumSeverity;
}

/**
 * Shop-floor panel — readable in ~3 seconds with gloves and noise.
 */
export function IndustrialFieldPanel({ panel, verdictSeverity }: IndustrialFieldPanelProps) {
  return (
    <section className="sc-ledger-report sc-premium-report sc-ledger-letterpress" aria-label="Industrial decision panel">
      <div className="sc-premium-report-section flex flex-wrap items-center justify-between gap-2">
        <span className="sc-craft-eyebrow">{panel.familyBadge}</span>
        <span className="font-mono text-[10px] uppercase tracking-wide text-body-charcoal">
          {panel.sectorLabel}
        </span>
      </div>

      <div className={verdictStripClass[verdictSeverity]}>{panel.verdictLine}</div>

      <div className="sc-premium-report-section">
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {panel.kpis.map((kpi) => (
            <div
              key={kpi.label}
              className={`min-h-[44px] border border-technical-gray bg-white p-2 ${kpiStyles[kpi.status]}`}
            >
              <p className="text-[9px] font-semibold uppercase tracking-wider text-body-charcoal">
                {kpi.label}
              </p>
              <p className="mt-0.5 font-mono text-sm font-bold tabular-nums text-premium-velvet sm:text-base">
                {kpi.value}
              </p>
            </div>
          ))}
        </div>
      </div>

      <dl className="sc-premium-report-section space-y-3 text-sm">
        <div>
          <dt className="sc-premium-report-section__title">Measured</dt>
          <dd className="mt-1 leading-snug text-premium-velvet">{panel.measuredLine}</dd>
        </div>
        <div>
          <dt className="sc-premium-report-section__title">Loss hotspot</dt>
          <dd className="mt-1 leading-snug text-premium-velvet">{panel.lossHotspotLine}</dd>
        </div>
        <div>
          <dt className="sc-premium-report-section__title">Tolerance</dt>
          <dd className={`mt-1 leading-snug ${toleranceBadge[panel.toleranceStatus]}`}>
            {panel.toleranceLine}
          </dd>
        </div>
        <div>
          <dt className="sc-premium-report-section__title">Impact</dt>
          <dd className="mt-1 leading-snug text-body-charcoal">{panel.impactLine}</dd>
        </div>
      </dl>

      <div className="sc-decision-block m-4 mt-0">
        <p className="sc-decision-block__title">Do now</p>
        <p className="sc-decision-block__body">{panel.actionLine}</p>
      </div>
    </section>
  );
}
