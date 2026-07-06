/**
 * Engineering Diagnostics PDF Builder
 *
 * Generates a sealed PDF from the DiagnosticReport contract.
 * Uses @react-pdf/renderer for deterministic server-side PDF generation.
 *
 * STRICT: PDF reads only from the report contract — never recomputes risk,
 * cost, decision, or measurements.
 */

import React from "react";
import {
  Document,
  Page,
  StyleSheet,
  Text,
  View,
  renderToBuffer,
} from "@react-pdf/renderer";
import type { DiagnosticReport } from "@/sectorcalc/diagnostics/report/diagnostic-report-types";
import { createDiagnosticReportHash } from "@/sectorcalc/diagnostics/report/diagnostic-report-canonicalize";

/* ── Colors ── */

const BG = "#F0EEE6";
const DARK = "#1A1915";
const MID = "#4A4A48";
const SOFT = "#6B6B68";
const ACCENT = "#BD5D3A";
const WHITE = "#FFFFFF";
const BORDER = "#D6D4CC";

const DECISION_COLORS: Record<string, string> = {
  LOW_RISK: "#238A23",
  PROCEED_WITH_CAUTION: "#8A7A23",
  STOP_AND_INSPECT: "#A16A23",
  QC_REQUIRED: "#A12323",
  HIGH_SCRAP_RISK: "#8A1010",
};

/* ── Styles ── */

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: "Helvetica",
    fontSize: 10,
    color: DARK,
    backgroundColor: WHITE,
  },
  header: {
    fontSize: 18,
    fontWeight: "bold",
    color: ACCENT,
    marginBottom: 4,
  },
  subheader: {
    fontSize: 9,
    color: SOFT,
    marginBottom: 16,
    fontFamily: "Courier",
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: "bold",
    color: DARK,
    backgroundColor: BG,
    padding: "6 10",
    marginBottom: 8,
    marginTop: 12,
  },
  row: {
    flexDirection: "row",
    marginBottom: 3,
  },
  label: {
    width: 140,
    color: SOFT,
    fontSize: 9,
  },
  value: {
    flex: 1,
    color: DARK,
    fontSize: 9,
  },
  badge: {
    padding: "2 6",
    borderRadius: 3,
    fontSize: 8,
    fontWeight: "bold",
    marginRight: 4,
  },
  decisionBanner: {
    padding: "10 14",
    borderRadius: 4,
    marginBottom: 12,
    borderWidth: 1,
  },
  decisionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  decisionLabel: {
    fontSize: 8,
    color: SOFT,
    marginBottom: 2,
  },
  decisionValue: {
    fontSize: 14,
    fontWeight: "bold",
  },
  riskBar: {
    height: 6,
    borderRadius: 3,
    marginTop: 2,
    marginBottom: 6,
  },
  riskBarFill: {
    height: "100%",
    borderRadius: 3,
  },
  toolEntry: {
    flexDirection: "row",
    marginBottom: 4,
    fontSize: 9,
  },
  toolStatusBadge: {
    padding: "1 4",
    borderRadius: 2,
    color: WHITE,
    fontSize: 7,
    fontWeight: "bold",
    marginRight: 4,
    marginTop: 1,
  },
  methodologyEntry: {
    marginBottom: 8,
  },
  methodologyName: {
    fontSize: 9,
    fontWeight: "bold",
    color: DARK,
    marginBottom: 2,
  },
  methodologyDesc: {
    fontSize: 8,
    color: MID,
    marginBottom: 2,
    lineHeight: 1.4,
  },
  methodologyFormula: {
    fontSize: 8,
    color: SOFT,
    fontFamily: "Courier",
    padding: "2 4",
    backgroundColor: BG,
  },
  auditLine: {
    fontSize: 7,
    color: SOFT,
    fontFamily: "Courier",
    marginBottom: 1,
    lineHeight: 1.3,
  },
  footer: {
    position: "absolute",
    bottom: 20,
    left: 40,
    right: 40,
    fontSize: 7,
    color: SOFT,
    textAlign: "center",
    borderTopWidth: 1,
    borderTopColor: BORDER,
    paddingTop: 6,
  },
  actionItem: {
    flexDirection: "row",
    fontSize: 8,
    marginBottom: 2,
    lineHeight: 1.3,
  },
  actionPriority: {
    width: 60,
    fontWeight: "bold",
  },
  actionDetail: {
    flex: 1,
  },
});

/* ── Helper: decision color ── */

function decColor(state: string): string {
  return DECISION_COLORS[state] ?? "#A12323";
}

/* ── Diagnostic PDF Document ── */

function DiagnosticPdfDocument({
  report,
  verifyUrl,
}: {
  report: DiagnosticReport;
  verifyUrl: string;
}) {
  const decisionState = report.decision_section.decision;
  const dColor = decColor(decisionState);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <Text style={styles.header}>Engineering Diagnostic Report</Text>
        <Text style={styles.subheader}>
          Report ID: {report.report_id}{"\n"}
          Generated: {report.created_at}
        </Text>

        {/* Decision Banner */}
        <View style={[styles.decisionBanner, { backgroundColor: dColor + "15", borderColor: dColor }]}>
          <View style={styles.decisionRow}>
            <View>
              <Text style={styles.decisionLabel}>Decision State</Text>
              <Text style={[styles.decisionValue, { color: dColor }]}>
                {decisionState.replace(/_/g, " ")}
              </Text>
            </View>
            <View>
              <Text style={[styles.decisionLabel, { textAlign: "right" }]}>Risk Score</Text>
              <Text style={[styles.decisionValue, { color: dColor, textAlign: "right" }]}>
                {report.decision_section.total_risk_score}/100
              </Text>
            </View>
          </View>
          {report.decision_section.mandatory_floor_applied && (
            <Text style={{ fontSize: 8, color: "#A16A23", marginTop: 6 }}>
              Mandatory decision floor applied: STOP_AND_INSPECT
            </Text>
          )}
        </View>

        {/* Problem Summary */}
        <Text style={styles.sectionTitle}>Problem Summary</Text>
        <Text style={{ fontSize: 9, lineHeight: 1.5, marginBottom: 4 }}>
          {report.problem_section.problem_context}
        </Text>
        <View style={styles.row}>
          <Text style={styles.label}>Domain</Text>
          <Text style={styles.value}>{report.domain_section.label}</Text>
        </View>

        {/* Domain */}
        <Text style={styles.sectionTitle}>Domain</Text>
        <View style={styles.row}>
          <Text style={styles.label}>Domain ID</Text>
          <Text style={styles.value}>{report.domain_section.domain_id}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Description</Text>
          <Text style={styles.value}>{report.domain_section.description}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Category</Text>
          <Text style={styles.value}>{report.domain_section.category}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Process</Text>
          <Text style={styles.value}>{report.domain_section.process_description}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Typical Tolerances</Text>
          <Text style={styles.value}>{report.domain_section.typical_tolerances}</Text>
        </View>

        {/* Measurement */}
        <Text style={styles.sectionTitle}>Measurement</Text>
        <View style={styles.row}>
          <Text style={styles.label}>Worst Case</Text>
          <Text style={[styles.value, { fontWeight: "bold" }]}>
            {report.measurement_section.worst_case_tolerance_status}
          </Text>
        </View>
        {report.measurement_section.entries.map((entry, i) => (
          <View key={i} style={{ marginBottom: 6, marginLeft: 4, paddingLeft: 6, borderLeftWidth: 1, borderLeftColor: BORDER }}>
            <View style={styles.row}>
              <Text style={styles.label}>Status</Text>
              <Text style={{ fontSize: 9, fontWeight: "bold", color: decColor(entry.tolerance_status) }}>
                {entry.tolerance_status} {"("}{entry.confidence_class}{")"}
              </Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Tool</Text>
              <Text style={styles.value}>{entry.measurement_tool}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Measured / Nominal</Text>
              <Text style={styles.value}>{entry.measured_value} / {entry.nominal_value} {entry.unit}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Uncertainty (k=2)</Text>
              <Text style={styles.value}>{entry.expanded_uncertainty_k2.toFixed(4)} {entry.unit}</Text>
            </View>
          </View>
        ))}

        {/* Cost at Risk */}
        <Text style={styles.sectionTitle}>Cost-at-Risk</Text>
        <View style={styles.row}>
          <Text style={styles.label}>Estimated Cost at Risk</Text>
          <Text style={[styles.value, { fontWeight: "bold" }]}>
            ${report.cost_section.estimated_cost_at_risk.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </Text>
        </View>

        {/* Decision */}
        <Text style={styles.sectionTitle}>Decision</Text>
        <View style={styles.row}>
          <Text style={styles.label}>Decision</Text>
          <Text style={styles.value}>{decisionState.replace(/_/g, " ")}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Total Risk Score</Text>
          <Text style={styles.value}>{report.decision_section.total_risk_score}/100</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Risk Components</Text>
          <Text style={styles.value}>
            M:{report.decision_section.measurement_risk} C:{report.decision_section.confidence_risk}{" "}
            V:{report.decision_section.visual_advisory_risk} E:{report.decision_section.exposure_risk}{" "}
            $:{report.decision_section.cost_risk} H:{report.decision_section.manual_check_risk}
          </Text>
        </View>

        {/* Action Plan */}
        <Text style={styles.sectionTitle}>Action Plan</Text>
        {(["containment", "temporary_fix", "permanent_corrective_action", "required_manual_checks"] as const).map((group) => {
          const items = report.action_plan_section[group];
          if (items.length === 0) return null;
          const groupLabel = group === "temporary_fix" ? "Temporary Fix" : group === "permanent_corrective_action" ? "Permanent Corrective" : group === "required_manual_checks" ? "Manual Checks" : "Containment";
          return (
            <View key={group} style={{ marginBottom: 6 }}>
              <Text style={{ fontSize: 9, fontWeight: "bold", color: ACCENT, marginBottom: 3 }}>{groupLabel}</Text>
              {items.map((item, i) => (
                <View key={i} style={styles.actionItem}>
                  <Text style={[styles.actionPriority, { fontSize: 8 }]}>{item.priority}</Text>
                  <Text style={styles.actionDetail}>{item.action} — {item.responsible_role} ({item.estimated_duration})</Text>
                </View>
              ))}
            </View>
          );
        })}

        {/* Related Tools */}
        <Text style={styles.sectionTitle}>Related Tools</Text>
        {report.related_tools_section.tools.length === 0 ? (
          <Text style={{ fontSize: 9, color: SOFT }}>None</Text>
        ) : (
          report.related_tools_section.tools.map((tool, i) => {
            const statusColor = tool.status === "ACTIVE" ? "#238A23" : tool.status === "PLANNED" ? "#A16A23" : "#A12323";
            return (
              <View key={i} style={styles.toolEntry}>
                <Text style={[styles.toolStatusBadge, { backgroundColor: statusColor }]}>{tool.status}</Text>
                <Text style={{ fontSize: 9 }}>{tool.label}</Text>
              </View>
            );
          })
        )}

        {/* Methodology */}
        <Text style={styles.sectionTitle}>Methodology</Text>
        {report.methodology_section.entries.map((entry, i) => (
          <View key={i} style={styles.methodologyEntry}>
            <Text style={styles.methodologyName}>{entry.name}</Text>
            <Text style={styles.methodologyDesc}>{entry.description}</Text>
            <Text style={styles.methodologyFormula}>{entry.formula}</Text>
          </View>
        ))}
        <Text style={{ fontSize: 7, color: SOFT, fontStyle: "italic", marginTop: 4 }}>
          {report.methodology_section.note}
        </Text>

        {/* Limitation */}
        <Text style={styles.sectionTitle}>Limitation & Disclaimer</Text>
        <Text style={{ fontSize: 8, lineHeight: 1.4, color: MID, marginBottom: 4 }}>
          {report.limitation_section.disclaimer}
        </Text>
        <Text style={{ fontSize: 8, lineHeight: 1.4, color: MID }}>
          {report.limitation_section.llm_limitation}
        </Text>

        {/* Audit Log */}
        <Text style={styles.sectionTitle}>Audit Log</Text>
        {report.audit_log.map((entry, i) => (
          <Text key={i} style={styles.auditLine}>
            {entry.event} — {entry.at} [source: {entry.source}, v{entry.engine_version}]
          </Text>
        ))}

        {/* Verify URL */}
        <Text style={styles.sectionTitle}>Verification</Text>
        <Text style={{ fontSize: 8, color: ACCENT, fontFamily: "Courier" }}>{verifyUrl}</Text>

        {/* Footer */}
        <Text style={styles.footer}>
          SectorCalc Engineering Diagnostics — Report {report.report_id} — v{report.schema_version}
        </Text>
      </Page>
    </Document>
  );
}

/* ── Public API ── */

/**
 * Build a PDF buffer from a DiagnosticReport contract.
 *
 * STRICT: Only reads from the report contract.
 * Never recomputes risk, cost, decision, or measurements.
 */
export async function buildDiagnosticPdf(
  report: DiagnosticReport,
  options?: { verifyUrl?: string }
): Promise<Buffer> {
  const reportHash = createDiagnosticReportHash(report);
  const domain = "sectorcalc.com";
  const verifyUrl = options?.verifyUrl ?? `https://${domain}/verify/${reportHash}`;

  const element = React.createElement(DiagnosticPdfDocument, {
    report,
    verifyUrl,
  });

  return renderToBuffer(
    element as React.ReactElement<Record<string, unknown>>
  ) as Promise<Buffer>;
}

/**
 * Build the PDF filename for a diagnostic report.
 */
export function buildDiagnosticPdfFileName(reportId: string): string {
  const sanitized = reportId.replace(/[^a-zA-Z0-9_-]/g, "_");
  return `sectorcalc-diagnostic-${sanitized}.pdf`;
}
