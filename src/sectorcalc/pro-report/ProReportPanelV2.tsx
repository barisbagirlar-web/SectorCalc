// SectorCalc PRO V2 — Tool-Specific Report Panel
// Renders business-labeled output sections per tool contract.
// No generic decision-engine display. Each tool shows its own domain metrics.

"use client";

import type { ResolvedReportSection } from "./pro-report-types";

function formatReportValue(
  value: string | number | boolean | null,
  unit: string | null
): string {
  if (value === null || value === undefined) return "—";
  if (typeof value === "boolean") return value ? "Yes" : "No";
  if (typeof value === "number") {
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
}

const severityClassMap: Record<string, string> = {
  pass: "sc-report-severity-pass",
  warning: "sc-report-severity-warning",
  danger: "sc-report-severity-danger",
  info: "sc-report-severity-info",
};

export function ProReportPanelV2({
  toolTitle,
  sections,
  warnings,
  decisionStateLabel,
  decisionSeverity,
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
    <div className="sc-report-panel">
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
                  <span className="sc-report-item-value">{formatReportValue(entry.value, entry.unit)}</span>
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
