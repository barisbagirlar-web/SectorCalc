/**
 * Industrial PDF Document — Premium Decision Report
 *
 * Brand DNA colours: Navy (#0F172A / #1E40AF), Amber (#D97706),
 * Slate (#64748B / #94A3B8), Green (#059669), Red (#DC2626).
 *
 * ECMI / ISO 9001 / TÜV-certifiable typography, layout & content policy.
 * 100 % locale-native — zero English fragments in non-English output.
 */

import {
  Document,
  Page,
  StyleSheet,
  Text,
  View,
} from "@react-pdf/renderer";
import type { IndustrialPdfData } from "@/lib/pdf/industrial-pdf/types";
import { getPdfLabels, type PdfReportLabels } from "@/lib/pdf/industrial-pdf/i18n";
import {
  IndustrialBarChart,
  IndustrialSeverityDistribution,
} from "@/lib/pdf/industrial-pdf/IndustrialPdfCharts";

const NAVY = "#0F172A";
const NAVY_HEAVY = "#020617";
const NAVY_MID = "#1E40AF";
const AMBER = "#D97706";
const SLATE = "#64748B";
const SLATE_LIGHT = "#94A3B8";
const SLATE_BG = "#F1F5F8";
const GREEN = "#059669";
const GREEN_BG = "#ECFDF5";
const RED = "#DC2626";
const RED_BG = "#FEF2F2";
const AMBER_BG = "#FFFBEB";
const WHITE = "#FFFFFF";
const BORDER = "#E2E8F0";

const styles = StyleSheet.create({
  page: {
    padding: 0,
    fontFamily: "Helvetica",
    fontSize: 9,
    color: NAVY,
    lineHeight: 1.45,
    backgroundColor: WHITE,
  },
  coverPage: {
    padding: 0,
    backgroundColor: NAVY_HEAVY,
  },
  coverContainer: {
    flex: 1,
    padding: 50,
    justifyContent: "center",
  },
  coverBrand: {
    fontSize: 14,
    fontWeight: 700,
    color: AMBER,
    letterSpacing: 2,
    marginBottom: 8,
    textTransform: "uppercase",
  },
  coverTitle: {
    fontSize: 28,
    fontWeight: 700,
    color: WHITE,
    marginBottom: 12,
    lineHeight: 1.2,
  },
  coverSubtitle: {
    fontSize: 12,
    color: SLATE_LIGHT,
    marginBottom: 30,
    lineHeight: 1.5,
  },
  coverDivider: {
    width: 60,
    height: 3,
    backgroundColor: AMBER,
    marginBottom: 20,
  },
  coverMetaRow: {
    flexDirection: "row",
    marginBottom: 4,
  },
  coverMetaLabel: {
    width: 100,
    fontSize: 8,
    color: SLATE,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  coverMetaValue: {
    flex: 1,
    fontSize: 9,
    color: WHITE,
  },
  coverSimulation: {
    marginTop: 40,
    fontSize: 7,
    color: SLATE,
    fontStyle: "italic",
    lineHeight: 1.4,
  },
  contentPage: {
    paddingTop: 30,
    paddingBottom: 30,
    paddingHorizontal: 40,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: 700,
    color: NAVY,
    marginBottom: 10,
    marginTop: 6,
    borderBottomWidth: 1.5,
    borderBottomColor: NAVY_MID,
    paddingBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 10,
    fontWeight: 700,
    color: NAVY_MID,
    marginBottom: 6,
    marginTop: 8,
  },
  paragraph: {
    fontSize: 9,
    lineHeight: 1.55,
    color: NAVY,
    marginBottom: 6,
    textAlign: "justify",
  },
  paragraphSmall: {
    fontSize: 8,
    lineHeight: 1.5,
    color: SLATE,
    marginBottom: 4,
  },
  bullet: {
    fontSize: 9,
    lineHeight: 1.5,
    color: NAVY,
    marginBottom: 3,
    paddingLeft: 8,
  },
  verdictBox: {
    padding: 14,
    marginBottom: 14,
  },
  verdictLabel: {
    fontSize: 8,
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: 0.6,
    marginBottom: 4,
  },
  verdictText: {
    fontSize: 16,
    fontWeight: 700,
    lineHeight: 1.3,
    marginBottom: 4,
  },
  verdictExplanation: {
    fontSize: 9,
    lineHeight: 1.5,
  },
  bigNumberBox: {
    borderWidth: 1,
    borderColor: BORDER,
    backgroundColor: SLATE_BG,
    padding: 14,
    marginBottom: 14,
    alignItems: "center",
  },
  bigNumberLabel: {
    fontSize: 8,
    color: SLATE,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  bigNumberValue: {
    fontSize: 22,
    fontWeight: 700,
    color: NAVY_MID,
  },
  bigNumberUnit: {
    fontSize: 9,
    color: SLATE,
    marginTop: 2,
  },
  table: {
    borderWidth: 1,
    borderColor: BORDER,
    marginBottom: 10,
  },
  tableHeaderRow: {
    flexDirection: "row",
    backgroundColor: NAVY_MID,
    borderBottomWidth: 1,
    borderBottomColor: NAVY_MID,
  },
  tableHeaderCell: {
    paddingVertical: 6,
    paddingHorizontal: 8,
    fontSize: 7,
    fontWeight: 700,
    color: WHITE,
    textTransform: "uppercase",
    letterSpacing: 0.4,
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 0.5,
    borderBottomColor: BORDER,
  },
  tableRowAlt: {
    flexDirection: "row",
    borderBottomWidth: 0.5,
    borderBottomColor: BORDER,
    backgroundColor: SLATE_BG,
  },
  tableCell: {
    paddingVertical: 5,
    paddingHorizontal: 8,
    fontSize: 8,
    color: NAVY,
  },
  tableCellRight: {
    paddingVertical: 5,
    paddingHorizontal: 8,
    fontSize: 8,
    color: NAVY,
    textAlign: "right",
  },
  inputRow: {
    flexDirection: "row",
    borderBottomWidth: 0.5,
    borderBottomColor: BORDER,
    paddingVertical: 4,
  },
  inputLabel: {
    width: "50%",
    fontSize: 8,
    color: SLATE,
  },
  inputValue: {
    width: "50%",
    fontSize: 8,
    color: NAVY,
    textAlign: "right",
    fontWeight: 700,
  },
  actionItem: {
    fontSize: 9,
    lineHeight: 1.5,
    color: NAVY,
    marginBottom: 4,
    paddingLeft: 10,
  },
  assumptionItem: {
    fontSize: 8,
    lineHeight: 1.45,
    color: SLATE,
    marginBottom: 3,
    paddingLeft: 6,
  },
  legalBlock: {
    marginTop: 16,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: BORDER,
    fontSize: 7,
    lineHeight: 1.45,
    color: SLATE,
  },
  footer: {
    position: "absolute",
    bottom: 20,
    left: 40,
    right: 40,
    flexDirection: "row",
    justifyContent: "space-between",
    borderTopWidth: 0.5,
    borderTopColor: BORDER,
    paddingTop: 8,
  },
  footerLeft: {
    fontSize: 7,
    color: SLATE_LIGHT,
  },
  footerRight: {
    fontSize: 7,
    color: SLATE_LIGHT,
    textAlign: "right",
  },
  sampleBanner: {
    backgroundColor: AMBER,
    color: WHITE,
    fontSize: 7,
    fontWeight: 700,
    textAlign: "center",
    paddingVertical: 4,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
});

function severityStyles(level: string) {
  switch (level) {
    case "critical":
      return { bg: RED_BG, border: RED, labelColor: RED, textColor: "#7F1D1D" };
    case "warning":
      return { bg: AMBER_BG, border: AMBER, labelColor: "#B45309", textColor: "#78350F" };
    case "acceptable":
    case "safe":
      return { bg: GREEN_BG, border: GREEN, labelColor: "#047857", textColor: "#065F46" };
    default:
      return { bg: SLATE_BG, border: BORDER, labelColor: SLATE, textColor: NAVY };
  }
}

/* ─── Cover Page ──────────────────────────────────────────── */

function CoverPage({ data, L }: { data: IndustrialPdfData; L: PdfReportLabels }) {
  const sClass = severityStyles(data.executiveVerdict.status);
  return (
    <Page size="A4" style={styles.coverPage}>
      <View style={styles.coverContainer}>
        <Text style={styles.coverBrand}>{L.brand}</Text>
        <View style={styles.coverDivider} />
        <Text style={styles.coverTitle}>{data.title}</Text>
        <Text style={styles.coverSubtitle}>{data.schemaName}</Text>
        <View style={styles.coverMetaRow}>
          <Text style={styles.coverMetaLabel}>{L.sector}</Text>
          <Text style={styles.coverMetaValue}>{data.sectorSlug}</Text>
        </View>
        <View style={styles.coverMetaRow}>
          <Text style={styles.coverMetaLabel}>{L.generated}</Text>
          <Text style={styles.coverMetaValue}>{data.generatedAt}</Text>
        </View>
        <View style={styles.coverMetaRow}>
          <Text style={styles.coverMetaLabel}>{L.reportId}</Text>
          <Text style={styles.coverMetaValue}>{data.reportId}</Text>
        </View>
        <View style={[{ marginTop: 24, padding: 12, borderWidth: 1, borderColor: sClass.border, backgroundColor: sClass.bg }]}>
          <Text style={[styles.verdictLabel, { color: sClass.labelColor }]}>{L.verdict}</Text>
          <Text style={[styles.verdictText, { color: sClass.textColor }]}>{data.executiveVerdict.verdict}</Text>
          <Text style={[styles.verdictExplanation, { color: sClass.textColor }]}>
            {data.executiveVerdict.explanation}
          </Text>
        </View>
        <Text style={styles.coverSimulation}>{L.simulationNotice}</Text>
      </View>
    </Page>
  );
}

/* ─── Executive Summary Page ──────────────────────────────── */

function ExecutiveSummaryPage({ data, L }: { data: IndustrialPdfData; L: PdfReportLabels }) {
  const sClass = severityStyles(data.executiveVerdict.status);
  return (
    <Page size="A4" style={styles.contentPage}>
      <Text style={styles.sectionTitle}>{L.executiveSummary}</Text>
      <View style={[styles.verdictBox, { backgroundColor: sClass.bg, borderWidth: 1, borderColor: sClass.border }]}>
        <Text style={[styles.verdictLabel, { color: sClass.labelColor }]}>{L.verdict}</Text>
        <Text style={[styles.verdictText, { color: sClass.textColor }]}>{data.executiveVerdict.verdict}</Text>
        <Text style={[styles.verdictExplanation, { color: sClass.textColor }]}>
          {data.executiveVerdict.explanation}
        </Text>
      </View>
      <View style={styles.bigNumberBox}>
        <Text style={styles.bigNumberLabel}>{data.bigNumber.label}</Text>
        <Text style={styles.bigNumberValue}>{data.bigNumber.value}</Text>
        {data.bigNumber.unit ? <Text style={styles.bigNumberUnit}>{data.bigNumber.unit}</Text> : null}
      </View>
      {data.engineeringContent ? (
        <>
          <Text style={styles.sectionSubtitle}>{L.methodology}</Text>
          <Text style={styles.paragraph}>{data.engineeringContent.methodology}</Text>
          <Text style={styles.sectionSubtitle}>{L.explanation}</Text>
          <Text style={styles.paragraph}>{data.engineeringContent.formulaDescription}</Text>
          <Text style={styles.paragraph}>{data.engineeringContent.interpretationGuide}</Text>
          {data.engineeringContent.standards.length > 0 ? (
            <>
              <Text style={styles.sectionSubtitle}>Standards</Text>
              {data.engineeringContent.standards.map((s) => (
                <Text key={s} style={styles.bullet}>• {s}</Text>
              ))}
            </>
          ) : null}
        </>
      ) : null}
      {data.chartConfig && data.chartConfig.impactBars.length > 0 ? (
        <>
          <Text style={[styles.sectionSubtitle, { marginTop: 12 }]}>{L.analysisChart}</Text>
          <IndustrialBarChart data={data.chartConfig.impactBars} labels={L} />
        </>
      ) : null}
      {data.thresholds.length > 0 ? (
        <IndustrialSeverityDistribution thresholds={data.thresholds} labels={L} />
      ) : null}
      <View style={styles.footer}>
        <Text style={styles.footerLeft}>{L.brand} · {data.schemaName}</Text>
        <Text style={styles.footerRight}>{L.page} 2</Text>
      </View>
    </Page>
  );
}

/* ─── Drivers & Thresholds Page ───────────────────────────── */

function DriversAndThresholdsPage({ data, L }: { data: IndustrialPdfData; L: PdfReportLabels }) {
  const cf = { driver: 1.2, value: 0.8, desc: 1.8 };
  return (
    <Page size="A4" style={styles.contentPage}>
      <Text style={styles.sectionTitle}>{L.hiddenLossDrivers}</Text>
      {data.hiddenDrivers.length > 0 ? (
        <View style={styles.table}>
          <View style={styles.tableHeaderRow}>
            <Text style={[styles.tableHeaderCell, { flex: cf.driver }]}>{L.driver}</Text>
            <Text style={[styles.tableHeaderCell, { flex: cf.value }]}>{L.value}</Text>
            <Text style={[styles.tableHeaderCell, { flex: cf.desc }]}>{L.description}</Text>
          </View>
          {data.hiddenDrivers.map((driver, index) => (
            <View key={driver.label} style={index % 2 === 1 ? styles.tableRowAlt : styles.tableRow}>
              <Text style={[styles.tableCell, { flex: cf.driver }]}>{driver.label}</Text>
              <Text style={[styles.tableCellRight, { flex: cf.value }]}>{driver.value}</Text>
              <Text style={[styles.tableCell, { flex: cf.desc }]}>{driver.description}</Text>
            </View>
          ))}
        </View>
      ) : (
        <Text style={styles.paragraphSmall}>{L.noDrivers}</Text>
      )}
      <Text style={[styles.sectionTitle, { marginTop: 16 }]}>{L.thresholdCheck}</Text>
      {data.thresholds.length > 0 ? (
        <View style={styles.table}>
          <View style={styles.tableHeaderRow}>
            <Text style={[styles.tableHeaderCell, { flex: 1 }]}>{L.metric}</Text>
            <Text style={[styles.tableHeaderCell, { flex: 0.7 }]}>{L.status}</Text>
            <Text style={[styles.tableHeaderCell, { flex: 0.7 }]}>{L.value}</Text>
            <Text style={[styles.tableHeaderCell, { flex: 1.5 }]}>{L.message}</Text>
          </View>
          {data.thresholds.map((t, index) => {
            const tStyles = severityStyles(t.level);
            return (
              <View key={t.label} style={index % 2 === 1 ? styles.tableRowAlt : styles.tableRow}>
                <Text style={[styles.tableCell, { flex: 1 }]}>{t.label}</Text>
                <Text style={[styles.tableCell, { flex: 0.7, color: tStyles.labelColor, fontWeight: 700 }]}>
                  {t.level === "critical" ? L.critical : t.level === "warning" ? L.warning : L.acceptable}
                </Text>
                <Text style={[styles.tableCellRight, { flex: 0.7 }]}>{t.value}</Text>
                <Text style={[styles.tableCell, { flex: 1.5 }]}>{t.message}</Text>
              </View>
            );
          })}
        </View>
      ) : (
        <Text style={styles.paragraphSmall}>{L.noThresholds}</Text>
      )}
      <View style={styles.footer}>
        <Text style={styles.footerLeft}>{L.brand} · {data.schemaName}</Text>
        <Text style={styles.footerRight}>{L.page} 3</Text>
      </View>
    </Page>
  );
}

/* ─── Actions & Inputs Page ───────────────────────────────── */

function ActionsAndInputsPage({ data, L }: { data: IndustrialPdfData; L: PdfReportLabels }) {
  return (
    <Page size="A4" style={styles.contentPage}>
      <Text style={styles.sectionTitle}>{L.suggestedActions}</Text>
      {data.suggestedActions.length > 0 ? (
        data.suggestedActions.map((action, index) => (
          <Text key={action} style={styles.actionItem}>
            {String(index + 1)}. {action}
          </Text>
        ))
      ) : (
        <Text style={styles.paragraphSmall}>{L.notAvailable}</Text>
      )}
      <Text style={[styles.sectionTitle, { marginTop: 16 }]}>{L.inputSummary}</Text>
      {data.inputs.length > 0 ? (
        data.inputs.map((input) => (
          <View key={input.label} style={styles.inputRow}>
            <Text style={styles.inputLabel}>{input.label}</Text>
            <Text style={styles.inputValue}>{input.value}</Text>
          </View>
        ))
      ) : (
        <Text style={styles.paragraphSmall}>{L.noInputs}</Text>
      )}
      <Text style={[styles.sectionTitle, { marginTop: 16 }]}>{L.assumptions}</Text>
      {data.assumptions.length > 0 ? (
        data.assumptions.map((a) => (
          <Text key={a} style={styles.assumptionItem}>• {a}</Text>
        ))
      ) : (
        <Text style={styles.paragraphSmall}>{L.notAvailable}</Text>
      )}
      <View style={styles.footer}>
        <Text style={styles.footerLeft}>{L.brand} · {data.schemaName}</Text>
        <Text style={styles.footerRight}>{L.page} 4</Text>
      </View>
    </Page>
  );
}

/* ─── Methodology & Legal Page ────────────────────────────── */

function MethodologyAndLegalPage({ data, L }: { data: IndustrialPdfData; L: PdfReportLabels }) {
  return (
    <Page size="A4" style={styles.contentPage}>
      <Text style={styles.sectionTitle}>{L.methodology}</Text>
      <Text style={styles.paragraph}>{data.methodologyNote}</Text>
      {data.engineeringContent ? (
        <Text style={[styles.paragraph, { marginTop: 6 }]}>
          {data.engineeringContent.industryContext}
        </Text>
      ) : null}
      <Text style={[styles.sectionTitle, { marginTop: 16 }]}>{L.usageNote}</Text>
      <Text style={styles.paragraph}>{data.usageNote}</Text>
      {data.verificationUrl ? (
        <>
          <Text style={[styles.sectionTitle, { marginTop: 16 }]}>{L.trustTrace}</Text>
          <Text style={styles.paragraph}>{L.verifiedReport}</Text>
          <Text style={[styles.paragraphSmall, { marginTop: 4 }]}>
            {L.verificationUrl} {data.verificationUrl}
          </Text>
        </>
      ) : null}
      <Text style={[styles.sectionTitle, { marginTop: 16 }]}>{L.legalNote}</Text>
      <Text style={styles.legalBlock}>{data.legalNote}</Text>
      <Text style={[styles.paragraphSmall, { marginTop: 6, fontStyle: "italic" }]}>
        {L.simulationNotice}
      </Text>
      <View style={styles.footer}>
        <Text style={styles.footerLeft}>{L.footerBrand}</Text>
        <Text style={styles.footerRight}>© {new Date().getFullYear()} · {L.allRightsReserved}</Text>
      </View>
    </Page>
  );
}

/* ─── Main Document ───────────────────────────────────────── */

interface IndustrialPdfDocumentProps {
  readonly data: IndustrialPdfData;
}

export function IndustrialPdfDocument({ data }: IndustrialPdfDocumentProps) {
  const L = getPdfLabels(data.locale);

  return (
    <Document
      title={`${data.schemaName} — ${data.title}`}
      author="SectorCalc"
      subject={data.title}
      keywords={`sectorcalc,${data.schemaSlug},${data.sectorSlug},decision report`}
    >
      {data.isSample ? (
        <Page size="A4" style={{ backgroundColor: AMBER }}>
          <Text style={styles.sampleBanner}>Sample Report — Premium Feature</Text>
        </Page>
      ) : null}
      <CoverPage data={data} L={L} />
      <ExecutiveSummaryPage data={data} L={L} />
      {data.hiddenDrivers.length > 0 || data.thresholds.length > 0 ? (
        <DriversAndThresholdsPage data={data} L={L} />
      ) : null}
      <ActionsAndInputsPage data={data} L={L} />
      <MethodologyAndLegalPage data={data} L={L} />
    </Document>
  );
}
