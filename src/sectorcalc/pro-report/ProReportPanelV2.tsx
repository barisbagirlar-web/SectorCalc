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
  /** +/-10% sensitivity sweep from /api/pro-calculator/sensitivity. Optional, opt-in per tool. */
  sensitivity?: { targetOutput: string; baseline?: number | null; drivers: SensitivityDriverResult[] } | null;
  /** Resolved Pareto/cost-breakdown chart from buildProReport(). Optional, opt-in per tool. */
  paretoBreakdown?: { title: string; segments: Array<{ label: string; value: number }> } | null;
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

        // Waterfall: same segments, rendered as a running-total cascade (complements the
        // ranked-magnitude view below by showing how the components sum toward the total).
        const W = 640;
        const H = 220;
        const padL = 8;
        const padR = 8;
        const padT = 16;
        const padB = 46;
        const plotW = W - padL - padR;
        const plotH = H - padT - padB;
        const barW = plotW / (paretoBreakdown.segments.length + 1) - 14;
        const wfY = (v: number) => padT + plotH - (Math.max(0, v) / total) * plotH;
        let running = 0;
        const wfSteps = paretoBreakdown.segments.map((seg) => {
          const start = running;
          running += Math.abs(seg.value);
          return { label: seg.label, start, end: running, negative: seg.value < 0 };
        });

        return (
          <>
            <div className="sc-report-chart-block">
              <h4 className="sc-report-section-title">{paretoBreakdown.title} — Waterfall</h4>
              <svg viewBox={`0 0 ${W} ${H}`} className="sc-report-chart-svg" role="img" aria-label="Cost breakdown waterfall">
                <line x1={padL} y1={wfY(0)} x2={W - padR} y2={wfY(0)} stroke="#D4D2C8" strokeWidth={1} />
                {wfSteps.map((s, i) => {
                  const x = padL + i * (plotW / (wfSteps.length + 1)) + 7;
                  const top = wfY(s.end);
                  const bottom = wfY(s.start);
                  return (
                    <g key={s.label}>
                      <rect
                        x={x}
                        y={top}
                        width={barW}
                        height={Math.max(1, bottom - top)}
                        fill={s.negative ? "#9C3520" : "#C15F3C"}
                      />
                      <text x={x + barW / 2} y={top - 6} textAnchor="middle" fontSize="10.5" fontFamily="JetBrains Mono, monospace" fill="#1A1915">
                        {formatReportValue(Math.abs(s.end - s.start), null, 0)}
                      </text>
                      <text x={x + barW / 2} y={H - padB + 16} textAnchor="middle" fontSize="9.5" fill="#8C887E">
                        {s.label}
                      </text>
                    </g>
                  );
                })}
                {/* running total bar */}
                {(() => {
                  const x = padL + wfSteps.length * (plotW / (wfSteps.length + 1)) + 7;
                  return (
                    <g>
                      <rect x={x} y={wfY(total)} width={barW} height={Math.max(1, wfY(0) - wfY(total))} fill="#3A4D8F" />
                      <text x={x + barW / 2} y={wfY(total) - 6} textAnchor="middle" fontSize="10.5" fontFamily="JetBrains Mono, monospace" fill="#1A1915">
                        {formatReportValue(total, null, 0)}
                      </text>
                      <text x={x + barW / 2} y={H - padB + 16} textAnchor="middle" fontSize="9.5" fill="#8C887E">
                        Total
                      </text>
                    </g>
                  );
                })()}
              </svg>
              <p className="sc-report-sensitivity-note">
                Running total from left to right, ranked by the size of each component&apos;s contribution.
              </p>
            </div>
            <div className="sc-report-pareto">
            <h4 className="sc-report-section-title">{paretoBreakdown.title} — Ranked by Magnitude</h4>
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
          </>
        );
      })()}

      {/* Sensitivity chart: "what moves the result most" (opt-in per tool) */}
      {sensitivity && sensitivity.drivers.length > 0 && (() => {
        const withSpan = sensitivity.drivers.filter((d) => d.span !== null) as Array<SensitivityDriverResult & { span: number }>;
        if (withSpan.length === 0) return null;
        const baseline = sensitivity.baseline;

        if (typeof baseline === "number" && Number.isFinite(baseline)) {
          const withDirection = withSpan.filter((d) => d.up !== null && d.down !== null) as Array<
            SensitivityDriverResult & { span: number; up: number; down: number }
          >;
          if (withDirection.length > 0) {
            const maxDeviation = Math.max(
              ...withDirection.map((d) => Math.max(Math.abs(d.up - baseline), Math.abs(d.down - baseline))),
              1e-9,
            );
            return (
              <div className="sc-report-sensitivity sc-report-tornado">
                <h4 className="sc-report-section-title">What Moves This Result Most (±10% each input)</h4>
                <div className="sc-report-tornado-chart">
                  <div className="sc-report-tornado-axis" />
                  {withDirection.map((d) => {
                    const upDeltaPct = (Math.max(0, d.up - baseline) / maxDeviation) * 50;
                    const downDeltaPct = (Math.max(0, baseline - d.up) / maxDeviation) * 50;
                    const downUpDeltaPct = (Math.max(0, d.down - baseline) / maxDeviation) * 50;
                    const downDownDeltaPct = (Math.max(0, baseline - d.down) / maxDeviation) * 50;
                    const upOnRight = d.up >= baseline;
                    const upWidth = upOnRight ? upDeltaPct : downDeltaPct;
                    const downOnRight = d.down >= baseline;
                    const downWidth = downOnRight ? downUpDeltaPct : downDownDeltaPct;
                    return (
                      <div key={d.inputId} className="sc-report-tornado-row">
                        <span className="sc-report-tornado-label">{d.label}</span>
                        <div className="sc-report-tornado-track">
                          <div
                            className="sc-report-tornado-bar sc-report-tornado-bar-up"
                            style={upOnRight ? { left: "50%", width: `${upWidth}%` } : { right: "50%", width: `${upWidth}%` }}
                          />
                          <div
                            className="sc-report-tornado-bar sc-report-tornado-bar-down"
                            style={downOnRight ? { left: "50%", width: `${downWidth}%` } : { right: "50%", width: `${downWidth}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
                <p className="sc-report-sensitivity-note">
                  Green = result at a +10% change in that input; red = result at a -10% change; bars are centered on
                  the baseline {sensitivity.targetOutput.replace(/^out_/, "").replace(/_/g, " ")} of{" "}
                  {formatReportValue(baseline, null, 2)}. Longer bars mean the result is more sensitive to that
                  input — verify those inputs first.
                </p>
              </div>
            );
          }
        }

        const maxSpan = Math.max(...withSpan.map((d) => d.span), 1e-9);
        return (
          <div className="sc-report-sensitivity">
            <h4 className="sc-report-section-title">What Moves This Result Most (±10% each input)</h4>
            <div className="sc-report-sensitivity-bars">
              {withSpan.map((d) => (
                <div key={d.inputId} className="sc-report-sensitivity-row">
                  <span className="sc-report-sensitivity-label">{d.label}</span>
                  <div className="sc-report-sensitivity-track">
                    <div className="sc-report-sensitivity-bar" style={{ width: `${Math.max(2, (100 * d.span) / maxSpan)}%` }} />
                  </div>
                  <span className="sc-report-sensitivity-value">±{formatReportValue(d.span / 2, null, 2)}</span>
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
            <div key={ins.id} className={`sc-report-insight ${insightClassMap[ins.severity] ?? insightClassMap.info}`}>
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
              {section.entries.map((entry, ei) => {
                const isPercent = entry.unit === "%" && typeof entry.value === "number" && Number.isFinite(entry.value);
                const pct = isPercent ? Math.max(0, Math.min(100, Math.abs(entry.value as number))) : null;
                return (
                  <div key={ei} className="sc-report-item">
                    <span className="sc-report-item-label">{entry.label}</span>
                    <span className="sc-report-item-value">
                      {formatReportValue(entry.value, entry.unit, entry.displayDecimals)}
                    </span>
                    {pct !== null && (
                      <div className="sc-report-item-spark" aria-hidden="true">
                        <div className="sc-report-item-spark-fill" style={{ width: `${pct}%` }} />
                      </div>
                    )}
                    {entry.explanation && (
                      <span className="sc-report-item-explanation">{entry.explanation}</span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
    </div>
  );
}
