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

interface ProReportPanelV2Props {
  toolTitle: string;
  sections: ResolvedReportSection[];
  warnings?: string[];
  decisionStateLabel?: string;
  decisionSeverity?: "pass" | "warning" | "danger" | "info";
  /** Fired insight rules from buildProReport(). Optional -- most tools don't declare any yet. */
  firedInsights?: Array<{ id: string; severity: "critical" | "opportunity" | "info"; message: string }>;
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
