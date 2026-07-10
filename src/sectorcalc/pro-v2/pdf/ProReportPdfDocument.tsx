// SectorCalc PRO V2 — PDF Document (produced from ProInsightReport data)
import { Document, Page, StyleSheet, View, Text } from "@react-pdf/renderer";
import type { ProInsightReport } from "../proInsightContract";
import ProPdfHeader from "./ProPdfHeader";
import ProPdfFooter from "./ProPdfFooter";
import ProPdfSection from "./ProPdfSection";
import ProPdfTable from "./ProPdfTable";

const styles = StyleSheet.create({
  page: {
    paddingTop: 56,
    paddingRight: 32,
    paddingBottom: 44,
    paddingLeft: 32,
    fontFamily: "Helvetica",
    fontSize: 9,
    color: "#1A1915",
    lineHeight: 1.35,
    backgroundColor: "#FFFFFF",
  },
  // Cover / Decision Summary
  coverBrand: {
    fontSize: 22,
    fontWeight: 700,
    color: "#1A1915",
    letterSpacing: 1.5,
    marginBottom: 4,
  },
  coverTitle: {
    fontSize: 18,
    fontWeight: 700,
    color: "#BD5D3A",
    marginBottom: 12,
  },
  coverMeta: {
    fontSize: 9,
    color: "#888",
    marginBottom: 4,
  },
  divider: {
    borderBottom: "2px solid #BD5D3A",
    marginVertical: 14,
  },
  // KPI
  kpiRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 10,
  },
  kpiCard: {
    flex: 1,
    padding: "10px 14px",
    backgroundColor: "#F0EEE6",
    border: "1px solid #D6D1C7",
  },
  kpiLabel: {
    fontSize: 8,
    color: "#888",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 3,
  },
  kpiValue: {
    fontSize: 17,
    fontWeight: 700,
    color: "#1A1915",
  },
  kpiExplanation: {
    fontSize: 8.5,
    color: "#666",
    marginTop: 3,
  },
  // Decision state
  decisionBadge: {
    fontSize: 11,
    fontWeight: 700,
    color: "#1A1915",
    marginBottom: 4,
    padding: "6px 14px",
    backgroundColor: "#F0EEE6",
    border: "1px solid #1A1915",
  },
  decisionSummary: {
    fontSize: 9.5,
    color: "#555",
    lineHeight: 1.4,
    marginBottom: 8,
  },
  // Paragraph
  paragraph: {
    fontSize: 9.5,
    color: "#333",
    lineHeight: 1.45,
    marginBottom: 8,
  },
  // Cost bar text
  costRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    fontSize: 9,
    paddingVertical: 2,
    borderBottom: "1px solid #E0DDD5",
  },
  costLabel: {
    color: "#1A1915",
  },
  costValue: {
    color: "#555",
  },
  // Metric value cards (calculated values)
  metricGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 8,
  },
  metricCard: {
    width: "46%",
    padding: "8px 10px",
    backgroundColor: "#E8E6DE",
  },
  metricLabel: {
    fontSize: 8,
    color: "#888",
    textTransform: "uppercase",
    marginBottom: 2,
  },
  metricValue: {
    fontSize: 11,
    fontWeight: 700,
    color: "#1A1915",
  },
  // Warning/risk card
  warningCard: {
    padding: "8px 12px",
    marginBottom: 5,
    border: "1px solid #B8860B",
    backgroundColor: "#FFF8E1",
  },
  criticalCard: {
    padding: "8px 12px",
    marginBottom: 5,
    border: "1px solid #BD5D3A",
    backgroundColor: "#FFEBEE",
  },
  cardTitle: {
    fontSize: 10,
    fontWeight: 700,
    color: "#1A1915",
    marginBottom: 2,
  },
  cardDesc: {
    fontSize: 9,
    color: "#555",
  },
  cardImpact: {
    fontSize: 8.5,
    color: "#BD5D3A",
    marginTop: 2,
  },
  // Checklist
  checklistRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 6,
    paddingVertical: 3,
    borderBottom: "1px solid #E0DDD5",
  },
  checkStatus: {
    width: 44,
    fontSize: 8.5,
    fontWeight: 700,
  },
  checkItem: {
    fontSize: 9,
    color: "#1A1915",
    flex: 1,
  },
  // Assumptions
  assumptionsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
  },
  assumptionItem: {
    width: "48%",
    fontSize: 8.5,
    color: "#555",
    padding: "3px 6px",
    backgroundColor: "#F0EEE6",
  },
  assumptionParam: {
    fontWeight: 700,
    color: "#1A1915",
  },
});

function severityColor(severity?: string): string {
  switch (severity) {
    case "CRITICAL": case "HIGH": case "FAIL": return "#BD5D3A";
    case "WARNING": case "MEDIUM": case "REVIEW": return "#B8860B";
    case "LOW": case "OK": case "PASS": return "#2E7D32";
    default: return "#1A1915";
  }
}

function StatusBadge({ status }: { status: string }) {
  return (
    <Text style={[styles.checkStatus, { color: severityColor(status) }]}>{status}</Text>
  );
}

export default function ProReportPdfDocument({ report }: { report: ProInsightReport }) {
  const hasComparison =
    report.calculatedValues.some((v) => v.label.toLowerCase().includes("current quote")) ||
    report.calculatedValues.some((v) => v.label.toLowerCase().includes("underpricing"));

  return (
    <Document>
      {/* ───── PAGE 1: EXECUTIVE DECISION SUMMARY ───── */}
      <Page size="A4" style={styles.page}>
        <ProPdfHeader reportTitle={report.toolName} reportId={report.traceId} />
        <ProPdfFooter generatedAt={report.generatedAt} />

        <Text style={styles.coverBrand}>SECTORCALC</Text>
        <Text style={styles.coverTitle}>{report.toolName}</Text>
        <Text style={styles.coverMeta}>Generated: {new Date(report.generatedAt).toLocaleString()}</Text>
        {report.traceId && <Text style={styles.coverMeta}>Report ID: {report.traceId}</Text>}
        <Text style={[styles.coverMeta, { color: "#BD5D3A", fontWeight: 600, marginTop: 2 }]}>
          Decision-support simulation — not financial, legal, or engineering advice.
        </Text>

        <View style={styles.divider} />

        {/* Primary KPIs */}
        <View wrap={false}>
          <View style={styles.kpiRow}>
            <View style={styles.kpiCard}>
              <Text style={styles.kpiLabel}>{report.primaryKpi.label}</Text>
              <Text style={styles.kpiValue}>{report.primaryKpi.value}</Text>
              {report.primaryKpi.explanation && (
                <Text style={styles.kpiExplanation}>{report.primaryKpi.explanation}</Text>
              )}
            </View>
            {report.keyCostDriver && (
              <View style={styles.kpiCard}>
                <Text style={styles.kpiLabel}>Key Cost Driver</Text>
                <Text style={styles.kpiValue}>{report.keyCostDriver}</Text>
              </View>
            )}
            {report.marginPercent && report.marginPercent !== "N/A" && (
              <View style={styles.kpiCard}>
                <Text style={styles.kpiLabel}>Margin</Text>
                <Text style={styles.kpiValue}>{report.marginPercent}</Text>
              </View>
            )}
          </View>
        </View>

        {/* Decision State */}
        <View wrap={false} style={{ marginBottom: 8 }}>
          <Text style={styles.decisionBadge}>{report.decisionState.state.replace(/_/g, " ")}</Text>
          <Text style={styles.decisionSummary}>{report.decisionState.summary}</Text>
        </View>

        {/* Executive Interpretation */}
        <ProPdfSection title="Executive Interpretation">
          <Text style={styles.paragraph}>{report.executiveInterpretation}</Text>
        </ProPdfSection>

        {/* Recommended Next Action */}
        <View wrap={false} style={{ marginBottom: 10 }}>
          <View style={styles.cardTitle}>
            <Text>Recommended Next Action</Text>
          </View>
          <View style={{ padding: "8px 12px", border: "2px solid #BD5D3A", backgroundColor: "#FFF8E1" }}>
            <Text style={{ fontSize: 10, fontWeight: 700, color: "#1A1915", marginBottom: 3 }}>
              {report.recommendedAction.action}
            </Text>
            <Text style={{ fontSize: 8.5, color: "#555" }}>
              Priority: {report.recommendedAction.priority} · Expected benefit: {report.recommendedAction.expected_benefit}
            </Text>
          </View>
        </View>
      </Page>

      {/* ───── PAGE 2: CALCULATION AND COST EVIDENCE ───── */}
      <Page size="A4" style={styles.page}>
        <ProPdfHeader reportTitle={report.toolName} reportId={report.traceId} />
        <ProPdfFooter generatedAt={report.generatedAt} />

        {/* Cost Distribution */}
        {report.costDistribution.length > 0 && (
          <ProPdfSection title="Cost Distribution">
            {report.costDistribution.map((item, i) => (
              <View key={i} style={styles.costRow}>
                <Text style={styles.costLabel}>{item.category}</Text>
                <Text style={styles.costValue}>
                  ${item.amount.toFixed(2)} ({item.percentage.toFixed(1)}%)
                </Text>
              </View>
            ))}
          </ProPdfSection>
        )}

        {/* Calculated Values */}
        {report.calculatedValues.length > 0 && (
          <ProPdfSection title="Calculated Values">
            <View style={styles.metricGrid}>
              {report.calculatedValues.map((val, i) => (
                <View key={i} style={styles.metricCard} wrap={false}>
                  <Text style={styles.metricLabel}>{val.label}</Text>
                  <Text style={styles.metricValue}>{val.value}</Text>
                </View>
              ))}
            </View>
          </ProPdfSection>
        )}

        {/* Sensitivity Checks */}
        {report.sensitivityChecks.length > 0 && (
          <ProPdfSection title="Sensitivity Checks">
            <ProPdfTable
              columns={[
                { key: "parameter", label: "Parameter", width: "25%" },
                { key: "change", label: "Change", width: "25%" },
                { key: "impact", label: "Impact", width: "30%" },
                { key: "severity", label: "Severity", width: "20%" },
              ]}
              data={report.sensitivityChecks.map((c) => ({
                parameter: c.parameter,
                change: c.change,
                impact: c.impact,
                severity: c.severity,
              }))}
            />
          </ProPdfSection>
        )}

        {/* Primary Cost Driver */}
        {report.keyCostDriver && (
          <ProPdfSection title="Primary Cost Driver">
            <Text style={styles.paragraph}>{report.keyCostDriver}</Text>
          </ProPdfSection>
        )}
      </Page>

      {/* ───── PAGE 3+: RISK AND ASSUMPTION EVIDENCE ───── */}
      <Page size="A4" style={styles.page}>
        <ProPdfHeader reportTitle={report.toolName} reportId={report.traceId} />
        <ProPdfFooter generatedAt={report.generatedAt} />

        {/* Hidden Loss Diagnosis */}
        {report.hiddenLosses.length > 0 && (
          <ProPdfSection title="Hidden Loss Diagnosis">
            {report.hiddenLosses.map((loss, i) => (
              <View key={i} style={loss.severity === "HIGH" || loss.severity === "CRITICAL" ? styles.criticalCard : styles.warningCard} wrap={false}>
                <Text style={styles.cardTitle}>{loss.title}</Text>
                <Text style={styles.cardDesc}>{loss.description}</Text>
                <Text style={styles.cardImpact}>{loss.severity} · Impact: {loss.potential_impact}</Text>
              </View>
            ))}
          </ProPdfSection>
        )}

        {/* Missed Assumptions */}
        {report.missedAssumptions.length > 0 && (
          <ProPdfSection title="Missed Assumptions">
            {report.missedAssumptions.map((a, i) => (
              <View key={i} style={styles.warningCard} wrap={false}>
                <Text style={styles.cardTitle}>{a.title}</Text>
                <Text style={styles.cardDesc}>{a.description}</Text>
                <Text style={styles.cardImpact}>Impact: {a.impact_on_result}</Text>
              </View>
            ))}
          </ProPdfSection>
        )}

        {/* Risk Warnings */}
        {report.riskWarnings.length > 0 && (
          <ProPdfSection title="Risk Warnings">
            {report.riskWarnings.map((risk, i) => (
              <View key={i} style={risk.severity === "CRITICAL" ? styles.criticalCard : styles.warningCard} wrap={false}>
                <Text style={styles.cardTitle}>{risk.title}</Text>
                <Text style={styles.cardDesc}>{risk.description}</Text>
                {risk.mitigation && (
                  <Text style={{ fontSize: 8.5, color: "#2E7D32", marginTop: 2 }}>
                    Mitigation: {risk.mitigation}
                  </Text>
                )}
              </View>
            ))}
          </ProPdfSection>
        )}

        {/* Professional Checklist */}
        {report.checklist.length > 0 && (
          <ProPdfSection title="Professional Checklist">
            {report.checklist.map((item, i) => (
              <View key={i} style={styles.checklistRow} wrap={false}>
                <StatusBadge status={item.status} />
                <Text style={styles.checkItem}>
                  {item.item}
                  {item.details && <Text style={{ color: "#888" }}> — {item.details}</Text>}
                </Text>
              </View>
            ))}
          </ProPdfSection>
        )}

        {/* Assumptions Used */}
        {report.assumptionsUsed.length > 0 && (
          <ProPdfSection title="Assumptions Used">
            <View style={styles.assumptionsGrid}>
              {report.assumptionsUsed.map((a, i) => (
                <View key={i} style={styles.assumptionItem} wrap={false}>
                  <Text>
                    <Text style={styles.assumptionParam}>{a.parameter}:</Text>{` ${a.value}`}
                  </Text>
                </View>
              ))}
            </View>
          </ProPdfSection>
        )}

        {/* Methodology note */}
        <View style={{ marginTop: 16, padding: "8px 12px", backgroundColor: "#F5F4EF", border: "1px solid #DDD" }}>
          <Text style={{ fontSize: 8, color: "#888", lineHeight: 1.4 }}>
            Methodology: Technical simulation based on declared inputs and referenced standards.
            Verify project-specific assumptions before final use. This is a decision-support report,
            not financial, legal, or engineering advice.
          </Text>
        </View>
      </Page>
    </Document>
  );
}
