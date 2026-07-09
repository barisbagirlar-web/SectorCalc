// SectorCalc PRO V2 — Result Panel
// Full premium insight report with all required sections.

"use client";

import type { ProInsightReport } from "./proInsightContract";

interface ProResultPanelV2Props {
  report: ProInsightReport;
  traceId?: string;
  onExportPdf?: () => void;
  onCopySummary?: () => void;
}

function severityColor(severity?: string): string {
  switch (severity) {
    case "CRITICAL": return "#BD5D3A";
    case "WARNING": return "#B8860B";
    case "HIGH": return "#BD5D3A";
    case "MEDIUM": return "#B8860B";
    case "LOW": return "#556B2F";
    case "OK": return "#2E7D32";
    case "INFO": return "#1A1915";
    case "PASS": return "#2E7D32";
    case "FAIL": return "#BD5D3A";
    case "REVIEW": return "#B8860B";
    default: return "#1A1915";
  }
}

function severityBadge(severity?: string): string {
  const s = severity ?? "INFO";
  return `pro-badge-${s.toLowerCase()}`;
}

function DecisionStateBadge({ state }: { state: string }) {
  const colors: Record<string, { bg: string; text: string }> = {
    PROFITABLE: { bg: "#E8F5E9", text: "#2E7D32" },
    AT_RISK: { bg: "#FFF8E1", text: "#B8860B" },
    LOSS: { bg: "#FFEBEE", text: "#BD5D3A" },
    REVIEW: { bg: "#E3F2FD", text: "#1565C0" },
    INFO: { bg: "#F5F5F5", text: "#1A1915" },
  };
  const c = colors[state] ?? colors.INFO;
  return (
    <span
      style={{
        display: "inline-block",
        padding: "4px 12px",
        fontSize: "12px",
        fontWeight: 600,
        borderRadius: "0px",
        backgroundColor: c.bg,
        color: c.text,
        textTransform: "uppercase",
        letterSpacing: "0.5px",
      }}
    >
      {state.replace(/_/g, " ")}
    </span>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h3
      style={{
        fontSize: "16px",
        fontWeight: 600,
        color: "#1A1915",
        margin: "24px 0 12px 0",
        paddingBottom: "6px",
        borderBottom: "2px solid #BD5D3A",
        textTransform: "uppercase",
        letterSpacing: "0.5px",
      }}
    >
      {children}
    </h3>
  );
}

function MetricBox({
  label,
  value,
  severity,
  explanation,
}: {
  label: string;
  value: string;
  severity?: string;
  explanation?: string;
}) {
  return (
    <div
      style={{
        backgroundColor: "#F0EEE6",
        padding: "12px 16px",
        border: `1px solid ${severityColor(severity)}`,
      }}
    >
      <div style={{ fontSize: "11px", color: "#666", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "4px" }}>
        {label}
      </div>
      <div style={{ fontSize: "20px", fontWeight: 700, color: "#1A1915" }}>
        {value}
      </div>
      {explanation && (
        <div style={{ fontSize: "12px", color: "#555", marginTop: "4px" }}>
          {explanation}
        </div>
      )}
    </div>
  );
}

function CostBar({ label, amount, percentage, color }: { label: string; amount: number; percentage: number; color?: string }) {
  const barColor = color ?? "#BD5D3A";
  return (
    <div style={{ marginBottom: "8px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", marginBottom: "2px" }}>
        <span style={{ color: "#1A1915" }}>{label}</span>
        <span style={{ color: "#555" }}>${amount.toFixed(2)} ({percentage.toFixed(1)}%)</span>
      </div>
      <div style={{ backgroundColor: "#E0DDD5", height: "6px" }}>
        <div
          style={{
            width: `${Math.max(percentage, 2)}%`,
            height: "100%",
            backgroundColor: barColor,
            transition: "width 0.3s",
          }}
        />
      </div>
    </div>
  );
}

export default function ProResultPanelV2({ report, traceId, onExportPdf, onCopySummary }: ProResultPanelV2Props) {
  return (
    <div
      id="pro-v2-result-panel"
      style={{
        backgroundColor: "#F0EEE6",
        padding: "24px",
        marginTop: "24px",
      }}
    >
      {/* Report header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
        <div>
          <h2 style={{ fontSize: "22px", fontWeight: 700, color: "#1A1915", margin: 0 }}>
            {report.toolName}
          </h2>
          <p style={{ fontSize: "12px", color: "#888", margin: "4px 0 0 0" }}>
            Generated: {new Date(report.generatedAt).toLocaleString()}
            {traceId && ` · Ref: ${traceId}`}
          </p>
        </div>
        <div style={{ display: "flex", gap: "8px" }}>
          {onCopySummary && (
            <button
              onClick={onCopySummary}
              style={{
                padding: "8px 16px",
                backgroundColor: "#1A1915",
                color: "#F0EEE6",
                border: "none",
                cursor: "pointer",
                fontSize: "12px",
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: "0.5px",
              }}
            >
              Copy Summary
            </button>
          )}
          {onExportPdf && (
            <button
              onClick={onExportPdf}
              style={{
                padding: "8px 16px",
                backgroundColor: "#BD5D3A",
                color: "#F0EEE6",
                border: "none",
                cursor: "pointer",
                fontSize: "12px",
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: "0.5px",
              }}
            >
              Export PDF Report
            </button>
          )}
        </div>
      </div>

      {/* 1. Primary KPI */}
      <SectionTitle>Primary Result</SectionTitle>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "12px" }}>
        <MetricBox
          label={report.primaryKpi.label}
          value={report.primaryKpi.value}
          severity={report.primaryKpi.severity}
          explanation={report.primaryKpi.explanation}
        />
        {report.costPerMeter && (
          <MetricBox label="Cost per Meter" value={report.costPerMeter} severity="INFO" />
        )}
        {report.keyCostDriver && (
          <MetricBox label="Key Cost Driver" value={report.keyCostDriver} severity="INFO" />
        )}
        {report.marginPercent && report.marginPercent !== "N/A" && (
          <MetricBox label="Margin" value={`${report.marginPercent} (${report.marginAmount})`} severity={report.decisionState.state === "PROFITABLE" ? "OK" : "WARNING"} />
        )}
      </div>

      {/* 2. Decision State */}
      <SectionTitle>Decision State</SectionTitle>
      <div
        style={{
          padding: "16px",
          border: `1px solid #1A1915`,
          marginBottom: "12px",
        }}
      >
        <div style={{ marginBottom: "8px" }}>
          <DecisionStateBadge state={report.decisionState.state} />
        </div>
        <div style={{ fontSize: "14px", color: "#555", marginTop: "4px" }}>
          {report.decisionState.summary}
        </div>
      </div>

      {/* 3. Executive Interpretation */}
      <SectionTitle>Executive Interpretation</SectionTitle>
      <p style={{ fontSize: "14px", lineHeight: "1.6", color: "#333", margin: "8px 0" }}>
        {report.executiveInterpretation}
      </p>

      {/* 4. Cost Distribution */}
      {report.costDistribution.length > 0 && (
        <>
          <SectionTitle>Cost Distribution</SectionTitle>
          <div style={{ marginBottom: "12px" }}>
            {report.costDistribution.map((item, i) => (
              <CostBar key={i} label={item.category} amount={item.amount} percentage={item.percentage} />
            ))}
          </div>
        </>
      )}

      {/* 5. Calculated Values */}
      {report.calculatedValues.length > 0 && (
        <>
          <SectionTitle>Calculated Values</SectionTitle>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
              gap: "12px",
            }}
          >
            {report.calculatedValues.map((val, i) => (
              <div
                key={i}
                style={{
                  backgroundColor: "#E8E6DE",
                  padding: "10px 14px",
                }}
              >
                <div style={{ fontSize: "11px", color: "#666", textTransform: "uppercase", marginBottom: "2px" }}>
                  {val.label}
                </div>
                <div style={{ fontSize: "16px", fontWeight: 600, color: "#1A1915" }}>
                  {val.value}
                </div>
                {val.formula_ref && (
                  <div style={{ fontSize: "10px", color: "#999", marginTop: "2px" }}>
                    {val.formula_ref}
                  </div>
                )}
              </div>
            ))}
          </div>
        </>
      )}

      {/* 6. Hidden Loss Diagnosis */}
      {report.hiddenLosses.length > 0 && (
        <>
          <SectionTitle>Hidden Loss Diagnosis</SectionTitle>
          {report.hiddenLosses.map((loss, i) => (
            <div
              key={i}
              style={{
                padding: "10px 14px",
                marginBottom: "6px",
                border: `1px solid ${severityColor(loss.severity)}`,
                backgroundColor: "#E8E6DE",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                <span style={{ fontWeight: 600, color: "#1A1915", fontSize: "14px" }}>{loss.title}</span>
                <span style={{ fontSize: "11px", color: severityColor(loss.severity), fontWeight: 600 }}>
                  {loss.severity} · Impact: {loss.potential_impact}
                </span>
              </div>
              <p style={{ fontSize: "12px", color: "#555", margin: 0, lineHeight: "1.5" }}>
                {loss.description}
              </p>
            </div>
          ))}
        </>
      )}

      {/* 7. Missed Assumptions */}
      {report.missedAssumptions.length > 0 && (
        <>
          <SectionTitle>Missed Assumptions</SectionTitle>
          {report.missedAssumptions.map((assumption, i) => (
            <div
              key={i}
              style={{
                padding: "10px 14px",
                marginBottom: "6px",
                border: "1px solid #B8860B",
                backgroundColor: "#FFF8E1",
              }}
            >
              <div style={{ fontWeight: 600, color: "#1A1915", fontSize: "14px", marginBottom: "4px" }}>
                {assumption.title}
              </div>
              <p style={{ fontSize: "12px", color: "#555", margin: "0 0 4px 0" }}>
                {assumption.description}
              </p>
              <p style={{ fontSize: "11px", color: "#BD5D3A", margin: 0 }}>
                Impact: {assumption.impact_on_result}
              </p>
            </div>
          ))}
        </>
      )}

      {/* 8. Risk Warnings */}
      {report.riskWarnings.length > 0 && (
        <>
          <SectionTitle>Risk Warnings</SectionTitle>
          {report.riskWarnings.map((risk, i) => (
            <div
              key={i}
              style={{
                padding: "10px 14px",
                marginBottom: "6px",
                border: `1px solid ${severityColor(risk.severity)}`,
                backgroundColor: severityColor(risk.severity) === "#BD5D3A" ? "#FFEBEE" : "#FFF8E1",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                <span style={{ fontWeight: 600, color: "#1A1915", fontSize: "14px" }}>{risk.title}</span>
                <span style={{ fontSize: "11px", color: severityColor(risk.severity), fontWeight: 600 }}>
                  {risk.severity}
                </span>
              </div>
              <p style={{ fontSize: "12px", color: "#555", margin: "0 0 4px 0" }}>
                {risk.description}
              </p>
              {risk.mitigation && (
                <p style={{ fontSize: "11px", color: "#2E7D32", margin: 0 }}>
                  Mitigation: {risk.mitigation}
                </p>
              )}
            </div>
          ))}
        </>
      )}

      {/* 9. Sensitivity Checks */}
      {report.sensitivityChecks.length > 0 && (
        <>
          <SectionTitle>Sensitivity Checks</SectionTitle>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px", minWidth: "500px" }}>
              <thead>
                <tr style={{ backgroundColor: "#1A1915", color: "#F0EEE6" }}>
                  <th style={{ padding: "8px 12px", textAlign: "left" }}>Parameter</th>
                  <th style={{ padding: "8px 12px", textAlign: "left" }}>Change</th>
                  <th style={{ padding: "8px 12px", textAlign: "left" }}>Impact</th>
                  <th style={{ padding: "8px 12px", textAlign: "left" }}>Severity</th>
                </tr>
              </thead>
              <tbody>
                {report.sensitivityChecks.map((check, i) => (
                  <tr
                    key={i}
                    style={{
                      borderBottom: "1px solid #E0DDD5",
                      backgroundColor: i % 2 === 0 ? "#F0EEE6" : "#E8E6DE",
                    }}
                  >
                    <td style={{ padding: "8px 12px", fontWeight: 500 }}>{check.parameter}</td>
                    <td style={{ padding: "8px 12px" }}>{check.change}</td>
                    <td style={{ padding: "8px 12px" }}>{check.impact}</td>
                    <td style={{ padding: "8px 12px", color: severityColor(check.severity), fontWeight: 600 }}>
                      {check.severity}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* 10. Professional Checklist */}
      {report.checklist.length > 0 && (
        <>
          <SectionTitle>Professional Checklist</SectionTitle>
          {report.checklist.map((item, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: "8px",
                padding: "6px 0",
                borderBottom: "1px solid #E0DDD5",
              }}
            >
              <span style={{ fontSize: "12px", fontWeight: 600, color: severityColor(item.status), minWidth: "40px" }}>
                {item.status}
              </span>
              <div>
                <span style={{ fontSize: "13px", color: "#1A1915" }}>{item.item}</span>
                {item.details && (
                  <span style={{ fontSize: "11px", color: "#888", marginLeft: "8px" }}>
                    — {item.details}
                  </span>
                )}
              </div>
            </div>
          ))}
        </>
      )}

      {/* 11. Recommended Next Action */}
      <SectionTitle>Recommended Next Action</SectionTitle>
      <div
        style={{
          padding: "16px",
          border: "2px solid #BD5D3A",
          backgroundColor: "#FFF8E1",
        }}
      >
        <div style={{ fontSize: "14px", fontWeight: 600, color: "#1A1915", marginBottom: "4px" }}>
          {report.recommendedAction.action}
        </div>
        <div style={{ display: "flex", gap: "16px", fontSize: "12px", color: "#555" }}>
          <span>Priority: <strong>{report.recommendedAction.priority}</strong></span>
          <span>Expected benefit: <strong>{report.recommendedAction.expected_benefit}</strong></span>
        </div>
      </div>

      {/* 12. Assumptions Used */}
      {report.assumptionsUsed.length > 0 && (
        <>
          <SectionTitle>Assumptions Used</SectionTitle>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
              gap: "8px",
            }}
          >
            {report.assumptionsUsed.map((a, i) => (
              <div key={i} style={{ fontSize: "12px", color: "#555", padding: "4px 8px", backgroundColor: "#E8E6DE" }}>
                <span style={{ fontWeight: 600, color: "#1A1915" }}>{a.parameter}:</span> {a.value}
              </div>
            ))}
          </div>
        </>
      )}

      {/* PDF Print Styles */}
      <style jsx>{`
        @media print {
          #pro-v2-result-panel {
            padding: 0 !important;
          }
          button {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}
