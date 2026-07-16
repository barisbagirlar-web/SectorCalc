// SectorCalc PRO V2 — Tool-Specific Report Panel
// Renders business-labeled output sections per tool contract.
// No generic decision-engine display. Each tool shows its own domain metrics.

"use client";

import type { ResolvedReportSection } from "./pro-report-types";

function resolveDisplayDecimals(value: number | undefined): number | null {
  if (!Number.isInteger(value) || value === undefined || value < 0 || value > 12) {
    return null;
  }
  return value;
}

function formatReportValue(
  value: string | number | boolean | null,
  unit: string | null,
  displayDecimals?: number,
): string {
  if (value === null || value === undefined) return "—";
  if (typeof value === "boolean") return value ? "Yes" : "No";
  if (typeof value === "number") {
    const exactDecimals = resolveDisplayDecimals(displayDecimals);
    if (exactDecimals !== null) {
      return value.toLocaleString("en-US", {
        minimumFractionDigits: exactDecimals,
        maximumFractionDigits: exactDecimals,
      }) + (unit ? ` ${unit}` : "");
    }

    if (Math.abs(value) >= 1000000) return value.toLocaleString("en-US", { maximumFractionDigits: 0 }) + (unit ? ` ${unit}` : "");
    if (Math.abs(value) >= 1000) return value.toLocaleString("en-US", { maximumFractionDigits: 0 }) + (unit ? ` ${unit}` : "");
    if (value === Math.floor(value)) return value.toLocaleString("en-US") + (unit ? ` ${unit}` : "");
    return value.toFixed(2) + (unit ? ` ${unit}` : "");
  }
  return String(value) + (unit ? ` ${unit}` : "");
}

interface SensitivityDriverResult {
  inputId: string;
  label: string;
  up: number | null;
  down: number | null;
  span: number | null;
}

interface ProReportPanelV2Props {
  toolTitle: string;
  sections: ResolvedReportSection[];
  warnings?: string[];
  decisionStateLabel?: string;
  decisionSeverity?: "pass" | "warning" | "danger" | "info";
  /** Fired insight rules from buildProReport(). Optional -- most tools don't declare any yet. */
  firedInsights?: Array<{ id: string; severity: "critical" | "opportunity" | "info"; message: string }>;
  /** +/-10% sensitivity sweep from /api/pro-calculator/sensitivity. Optional, opt-in per tool. */
  sensitivity?: { targetOutput: string; drivers: SensitivityDriverResult[] } | null;
  /** Resolved Pareto/cost-breakdown chart from buildProReport(). Optional, opt-in per tool. */
  paretoBreakdown?: { title: string; segments: Array<{ label: string; value: number }> } | null;
}

const severityClassMap: Record<string, string> = {
  pass: "sc-report-severity-pass",
  warning: "sc-report-severity-warning",
  danger: "sc-report-severity-danger",
  info: "sc-report-severity-info",
};

const insightClassMap: Record<string, string> = {
  critical: "sc-report-insight-critical",
  opportunity: "sc-report-insight-opportunity",
  info: "sc-report-insight-info",
};

export function ProReportPanelV2({
  toolTitle,
  sections,
  warnings,
  decisionStateLabel,
  decisionSeverity,
  firedInsights,
  sensitivity,
  paretoBreakdown,
}: ProReportPanelV2Props) {
  const isEmpty = !sections || sections.length === 0;

  if (isEmpty) {
    return (
      <div className="sc-report-panel sc-report-panel--empty">
        <div className="sc-report-empty-state">
          <p className="sc-report-empty-title">Calculation completed.</p>
          <p className="sc-report-empty-description">
            The tool-specific report could not be generated.
            No additional credit was used.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="sc-report-panel" aria-label={`${toolTitle} report`}>
      {/* Decision State Banner */}
      {decisionStateLabel && (
        <div className={`sc-report-decision-banner ${decisionSeverity ? severityClassMap[decisionSeverity] ?? severityClassMap.info : severityClassMap.info}`}>
          <span className="sc-report-decision-label">Decision</span>
          <span className="sc-report-decision-value">{decisionStateLabel}</span>
        </div>
      )}

      {/* Warnings */}
      {warnings && warnings.length > 0 && (
        <div className="sc-report-warnings">
          <h4 className="sc-report-section-title">Warnings</h4>
          <ul className="sc-report-warnings-list">
            {warnings.map((w, i) => (
              <li key={i} className="sc-report-warning-item">{w}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Pareto / cost-breakdown chart (opt-in per tool) */}
      {paretoBreakdown && paretoBreakdown.segments.length > 0 && (() => {
        const total = paretoBreakdown.segments.reduce((s, seg) => s + Math.abs(seg.value), 0);
        if (total <= 0) return null;
        const maxVal = Math.max(...paretoBreakdown.segments.map((s) => Math.abs(s.value)));
        let cumulative = 0;
        return (
          <div className="sc-report-pareto">
            <h4 className="sc-report-section-title">{paretoBreakdown.title}</h4>
            <div className="sc-report-pareto-bars">
              {paretoBreakdown.segments.map((seg) => {
                const pct = (100 * Math.abs(seg.value)) / total;
                cumulative += pct;
                const isNegative = seg.value < 0;
                return (
                  <div key={seg.label} className="sc-report-pareto-row">
                    <span className="sc-report-pareto-label">{seg.label}</span>
                    <div className="sc-report-pareto-track">
                      <div
                        className={`sc-report-pareto-bar${isNegative ? " sc-report-pareto-bar-negative" : ""}`}
                        style={{ width: `${Math.max(2, (100 * Math.abs(seg.value)) / maxVal)}%` }}
                      />
                    </div>
                    <span className="sc-report-pareto-value">
                      {isNegative ? "-" : ""}{pct.toFixed(0)}% <span className="sc-report-pareto-cumulative">(cum. {cumulative.toFixed(0)}%)</span>
                    </span>
                  </div>
                );
              })}
            </div>
            <p className="sc-report-sensitivity-note">
              Ranked by magnitude. Where a small number of components account for most of the total (the 80/20
              pattern), fixing those first gives the largest return for the least effort. Negative bars (shown in a
              different color) work against the total rather than adding to it.
            </p>
          </div>
        );
      })()}

      {/* Sensitivity chart: "what moves the result most" (opt-in per tool) */}
      {sensitivity && sensitivity.drivers.length > 0 && (() => {
        const withSpan = sensitivity.drivers.filter((d) => d.span !== null) as Array<SensitivityDriverResult & { span: number }>;
        if (withSpan.length === 0) return null;
        const maxSpan = Math.max(...withSpan.map((d) => d.span), 1e-9);
        return (
          <div className="sc-report-sensitivity">
            <h4 className="sc-report-section-title">What Moves This Result Most (±10% each input)</h4>
            <div className="sc-report-sensitivity-bars">
              {withSpan.map((d) => (
                <div key={d.inputId} className="sc-report-sensitivity-row">
                  <span className="sc-report-sensitivity-label">{d.label}</span>
                  <div className="sc-report-sensitivity-track">
                    <div
                      className="sc-report-sensitivity-bar"
                      style={{ width: `${Math.max(2, (100 * d.span) / maxSpan)}%` }}
                    />
                  </div>
                  <span className="sc-report-sensitivity-value">
                    ±{formatReportValue(d.span / 2, null, 2)}
                  </span>
                </div>
              ))}
            </div>
            <p className="sc-report-sensitivity-note">
              Ranked by impact on {sensitivity.targetOutput.replace(/^out_/, "").replace(/_/g, " ")} for a ±10% change in
              each input, holding all others constant. Spend negotiation and improvement effort on the top bars first.
            </p>
          </div>
        );
      })()}

      {/* Engineering Insights (opt-in per tool via contract.insights) */}
      {firedInsights && firedInsights.length > 0 && (
        <div className="sc-report-insights">
          <h4 className="sc-report-section-title">Engineering Insights</h4>
          {firedInsights.map((ins) => (
            <div
              key={ins.id}
              className={`sc-report-insight ${insightClassMap[ins.severity] ?? insightClassMap.info}`}
            >
              <span className="sc-report-insight-label">{ins.severity}</span>
              <span dangerouslySetInnerHTML={{ __html: ins.message }} />
            </div>
          ))}
        </div>
      )}

      {/* Report Sections */}
      {sections
        .sort((a, b) => a.priority - b.priority)
        .map((section, si) => (
          <div key={si} className="sc-report-section">
            <h4 className="sc-report-section-title">{section.sectionTitle}</h4>
            <div className="sc-report-grid">
              {section.entries.map((entry, ei) => (
                <div key={ei} className="sc-report-item">
                  <span className="sc-report-item-label">{entry.label}</span>
                  <span className="sc-report-item-value">
                    {formatReportValue(entry.value, entry.unit, entry.displayDecimals)}
                  </span>
                  {entry.explanation && (
                    <span className="sc-report-item-explanation">{entry.explanation}</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
    </div>
  );
}
