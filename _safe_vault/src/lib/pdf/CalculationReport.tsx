import {
  Document,
  Page,
  StyleSheet,
  Text,
  View,
} from "@react-pdf/renderer";
import type { CalculationReportProps } from "@/lib/pdf/calculation-report-types";

const NAVY = "#0F172A";
const SLATE = "#64748B";
const MUTED = "#94A3B8";
const BORDER = "#E2E8F0";

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 10,
    fontFamily: "Helvetica",
    color: NAVY,
    lineHeight: 1.45,
  },
  title: {
    fontSize: 22,
    fontWeight: 700,
    marginBottom: 6,
    color: NAVY,
  },
  subtitle: {
    fontSize: 11,
    color: SLATE,
    marginBottom: 22,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: 700,
    marginBottom: 8,
    color: NAVY,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: BORDER,
    paddingVertical: 7,
    gap: 12,
  },
  label: {
    width: "48%",
    fontSize: 9,
    color: MUTED,
    textTransform: "uppercase",
  },
  value: {
    width: "52%",
    fontSize: 11,
    fontWeight: 700,
    color: NAVY,
    textAlign: "right",
  },
  primaryBox: {
    marginTop: 4,
    marginBottom: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: BORDER,
    backgroundColor: "#F8FAFC",
  },
  primaryValue: {
    fontSize: 18,
    fontWeight: 700,
    color: NAVY,
    marginTop: 4,
  },
  section: {
    marginBottom: 16,
  },
  footer: {
    marginTop: 28,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: BORDER,
    fontSize: 8,
    color: MUTED,
    textAlign: "center",
  },
  disclaimer: {
    marginTop: 10,
    fontSize: 7,
    color: MUTED,
    textAlign: "center",
  },
});

export function CalculationReport({
  toolName,
  copy,
  inputRows,
  primaryResult,
  breakdownRows,
  generatedAt,
}: CalculationReportProps) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.title}>{toolName}</Text>
        <Text style={styles.subtitle}>{copy.subtitle}</Text>
        <Text style={{ fontSize: 8, color: MUTED, marginBottom: 16 }}>{generatedAt}</Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{copy.inputsTitle}</Text>
          {inputRows.map((row) => (
            <View key={`input-${row.label}`} style={styles.row}>
              <Text style={styles.label}>{row.label}</Text>
              <Text style={styles.value}>{row.value}</Text>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{copy.resultsTitle}</Text>
          <View style={styles.primaryBox}>
            <Text style={styles.label}>{copy.primaryLabel}</Text>
            <Text style={styles.primaryValue}>{primaryResult}</Text>
          </View>
          {breakdownRows.length > 0 ? (
            <>
              <Text style={styles.sectionTitle}>{copy.breakdownTitle}</Text>
              {breakdownRows.map((row) => (
                <View key={`breakdown-${row.label}`} style={styles.row}>
                  <Text style={styles.label}>{row.label}</Text>
                  <Text style={styles.value}>{row.value}</Text>
                </View>
              ))}
            </>
          ) : null}
        </View>

        <View style={styles.footer}>
          <Text>{copy.footerLine1}</Text>
          <Text>{copy.footerLine2}</Text>
          <Text>{copy.footerLine3}</Text>
          <Text style={styles.disclaimer}>{copy.disclaimer}</Text>
        </View>
      </Page>
    </Document>
  );
}
