"use client";

import {
  Document,
  Page,
  StyleSheet,
  Text,
  View,
} from "@react-pdf/renderer";
import type { ApprovedReportPayload } from "@/lib/features/trust-trace/types";

const NAVY = "#1E3A5F";
const SLATE = "#64748B";
const BORDER = "#E2E8F0";
const GREEN = "#15803D";
const FONT_SIZE = 9;

const styles = StyleSheet.create({
  page: {
    padding: 36,
    fontFamily: "Helvetica",
    fontSize: FONT_SIZE,
    color: "#111111",
    backgroundColor: "#ffffff",
    lineHeight: 1.45,
  },
  headerBar: {
    backgroundColor: NAVY,
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginBottom: 14,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  brand: {
    fontSize: 10,
    color: "#FFFFFF",
    fontWeight: 700,
    letterSpacing: 0.3,
  },
  badge: {
    fontSize: 7,
    color: "#FFFFFF",
    backgroundColor: GREEN,
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 2,
    fontWeight: 700,
  },
  title: {
    fontSize: 14,
    fontWeight: 700,
    color: NAVY,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 7,
    color: SLATE,
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 10,
    fontWeight: 700,
    color: NAVY,
    marginTop: 16,
    marginBottom: 6,
    paddingBottom: 4,
    borderBottomWidth: 1,
    borderBottomColor: BORDER,
  },
  trustTraceBox: {
    flexDirection: "row",
    gap: 12,
    padding: 10,
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 4,
    backgroundColor: "#F9FAFB",
    marginBottom: 8,
    alignItems: "center",
  },
  trustTraceText: {
    fontSize: 8,
    color: SLATE,
    flex: 1,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#F9FAFB",
    borderBottomWidth: 1,
    borderBottomColor: BORDER,
  },
  tableHeaderCell: {
    padding: 4,
    fontSize: 7,
    fontWeight: 700,
    color: SLATE,
    flex: 1,
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: BORDER,
  },
  tableCell: {
    padding: 4,
    fontSize: 8,
    flex: 1,
  },
  tableCellMono: {
    padding: 4,
    fontSize: 6,
    fontFamily: "Courier",
    flex: 1,
  },
  metaRow: {
    flexDirection: "row",
    marginBottom: 2,
  },
  metaLabel: {
    fontSize: 7,
    color: SLATE,
    width: 100,
  },
  metaValue: {
    fontSize: 8,
    flex: 1,
  },
  metaValueMono: {
    fontSize: 6,
    fontFamily: "Courier",
    flex: 1,
  },
  disclaimer: {
    fontSize: 6,
    color: "#9CA3AF",
    marginTop: 24,
    borderTopWidth: 1,
    borderTopColor: BORDER,
    paddingTop: 8,
  },
  footer: {
    position: "absolute",
    bottom: 24,
    left: 36,
    right: 36,
    fontSize: 6,
    color: "#D1D5DB",
    textAlign: "center",
  },
});

type Props = {
  report: ApprovedReportPayload;
};

function SnapshotTable({ data }: { data: Record<string, unknown> }) {
  const entries = Object.entries(data);
  if (entries.length === 0) return <Text style={{ fontSize: 8, color: SLATE }}>—</Text>;

  return (
    <View>
      <View style={styles.tableHeader}>
        <Text style={styles.tableHeaderCell}>Field</Text>
        <Text style={styles.tableHeaderCell}>Value</Text>
      </View>
      {entries.map(([key, value]) => (
        <View key={key} style={styles.tableRow}>
          <Text style={styles.tableCell}>{key}</Text>
          <Text style={styles.tableCellMono}>{String(value ?? "")}</Text>
        </View>
      ))}
    </View>
  );
}

export function TrustTracePdfDocument({ report }: Props) {
  const issuedDate = report.issuedAt
    ? new Date(report.issuedAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "—";

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.headerBar}>
          <Text style={styles.brand}>SectorCalc</Text>
          <Text style={styles.badge}>ISSUED</Text>
        </View>

        {/* Title */}
        <Text style={styles.title}>Approved Calculation Report</Text>
        <Text style={styles.subtitle}>
          Report ID: {report.reportId} &nbsp;|&nbsp; Issued: {issuedDate} &nbsp;|&nbsp; Tool: {report.toolSlug}
        </Text>

        {/* Trust Trace section */}
        <Text style={styles.sectionTitle}>Trust Trace</Text>
        <View style={styles.trustTraceBox}>
          <View>
            <Text style={styles.trustTraceText}>
              Scan the QR code on the SectorCalc verify page to confirm this
              report&apos;s cryptographic integrity.
            </Text>
            <Text style={{ ...styles.trustTraceText, marginTop: 4, fontWeight: 700 }}>
              Verify: {report.qrTargetUrl}
            </Text>
          </View>
        </View>

        {/* Validation section */}
        <Text style={styles.sectionTitle}>Validation</Text>
        <View>
          <View style={styles.metaRow}>
            <Text style={styles.metaLabel}>Validation Stamp</Text>
            <Text style={styles.metaValue}>{report.validationStampId}</Text>
          </View>
          <View style={styles.metaRow}>
            <Text style={styles.metaLabel}>Calculation Hash</Text>
            <Text style={styles.metaValueMono}>{report.calculationHash}</Text>
          </View>
          <View style={styles.metaRow}>
            <Text style={styles.metaLabel}>Formula Version</Text>
            <Text style={styles.metaValue}>{report.formulaVersion}</Text>
          </View>
          <View style={styles.metaRow}>
            <Text style={styles.metaLabel}>Verify URL</Text>
            <Text style={styles.metaValueMono}>{report.qrTargetUrl}</Text>
          </View>
        </View>

        {/* Input Snapshot */}
        <Text style={styles.sectionTitle}>Input Snapshot</Text>
        <SnapshotTable data={report.inputSnapshot} />

        {/* Result Snapshot */}
        <Text style={styles.sectionTitle}>Result Snapshot</Text>
        <SnapshotTable data={report.resultSnapshot} />

        {/* Disclaimer */}
        <Text style={styles.disclaimer}>
          Technical simulation only. Not financial, legal, or engineering advice.
          Report ID: {report.reportId}. Disclaimer v{report.disclaimerVersion}.
          Generated by SectorCalc — sectorcalc.com
        </Text>

        {/* Footer */}
        <Text style={styles.footer}>
          SectorCalc &bull; Trust Trace &bull; {report.reportId}
        </Text>
      </Page>
    </Document>
  );
}
