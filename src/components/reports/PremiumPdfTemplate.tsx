import {
 Document,
 Page,
 StyleSheet,
 Text,
 View,
} from "@react-pdf/renderer";
import {
 formatPremiumPdfGeneratedLabel,
 formatPremiumPdfUsd,
 type PremiumPdfData,
} from "@/lib/features/reports/premium-pdf-data";

const NAVY = "#1E40AF";
const AMBER = "#D97706";
const SLATE = "#999999";
const BORDER = "#E2E8F0";
const ROW_ALT = "#F8FAFC";

const styles = StyleSheet.create({
 page: {
 padding: 40,
 fontFamily: "Helvetica",
 fontSize: 10,
 color: NAVY,
 backgroundColor: "#FFFFFF",
 },
 headerBar: {
 backgroundColor: NAVY,
 paddingVertical: 14,
 paddingHorizontal: 16,
 marginBottom: 20,
 },
 brand: {
 fontSize: 11,
 fontWeight: 700,
 color: "#FFFFFF",
 letterSpacing: 0.4,
 },
 title: {
 fontSize: 20,
 fontWeight: 700,
 color: NAVY,
 marginBottom: 6,
 },
 subtitle: {
 fontSize: 10,
 color: SLATE,
 marginBottom: 18,
 },
 sectionTitle: {
 fontSize: 11,
 fontWeight: 700,
 color: NAVY,
 marginTop: 16,
 marginBottom: 8,
 textTransform: "uppercase",
 letterSpacing: 0.6,
 },
 verdictBox: {
 borderWidth: 1,
 borderColor: AMBER,
 padding: 14,
 marginBottom: 16,
 },
 verdictLabel: {
 fontSize: 9,
 fontWeight: 700,
 color: AMBER,
 textTransform: "uppercase",
 letterSpacing: 0.8,
 marginBottom: 6,
 },
 verdictText: {
 fontSize: 16,
 fontWeight: 700,
 color: NAVY,
 lineHeight: 1.35,
 },
 table: {
 borderWidth: 1,
 borderColor: BORDER,
 marginBottom: 8,
 },
 tableHeader: {
 flexDirection: "row",
 backgroundColor: NAVY,
 borderBottomWidth: 1,
 borderBottomColor: NAVY,
 },
 tableHeaderCell: {
 flex: 1,
 paddingVertical: 8,
 paddingHorizontal: 10,
 fontSize: 8,
 fontWeight: 700,
 color: "#FFFFFF",
 textTransform: "uppercase",
 letterSpacing: 0.4,
 },
 tableHeaderCellWide: {
 flex: 1.4,
 paddingVertical: 8,
 paddingHorizontal: 10,
 fontSize: 8,
 fontWeight: 700,
 color: "#FFFFFF",
 textTransform: "uppercase",
 letterSpacing: 0.4,
 },
 tableRow: {
 flexDirection: "row",
 borderBottomWidth: 1,
 borderBottomColor: BORDER,
 },
 tableRowAlt: {
 flexDirection: "row",
 borderBottomWidth: 1,
 borderBottomColor: BORDER,
 backgroundColor: ROW_ALT,
 },
 tableCell: {
 flex: 1,
 paddingVertical: 8,
 paddingHorizontal: 10,
 fontSize: 9,
 color: NAVY,
 },
 tableCellWide: {
 flex: 1.4,
 paddingVertical: 8,
 paddingHorizontal: 10,
 fontSize: 9,
 color: NAVY,
 },
 tableCellRight: {
 flex: 1,
 paddingVertical: 8,
 paddingHorizontal: 10,
 fontSize: 9,
 color: NAVY,
 textAlign: "right",
 },
 matrixCellRight: {
 flex: 1,
 paddingVertical: 7,
 paddingHorizontal: 8,
 fontSize: 8,
 color: NAVY,
 textAlign: "right",
 },
 matrixCell: {
 flex: 1.2,
 paddingVertical: 7,
 paddingHorizontal: 8,
 fontSize: 8,
 color: NAVY,
 },
 inputRow: {
 borderBottomWidth: 1,
 borderBottomColor: BORDER,
 paddingVertical: 6,
 },
 inputLabel: {
 fontSize: 8,
 color: SLATE,
 textTransform: "uppercase",
 letterSpacing: 0.3,
 },
 inputValue: {
 fontSize: 9,
 color: NAVY,
 marginTop: 2,
 },
 legal: {
 marginTop: 24,
 paddingTop: 12,
 borderTopWidth: 1,
 borderTopColor: BORDER,
 fontSize: 7,
 lineHeight: 1.45,
 color: SLATE,
 },
 footnote: {
 fontSize: 8,
 color: SLATE,
 marginTop: 6,
 },
});

interface PremiumPdfTemplateProps {
 data: PremiumPdfData;
}

function AnalysisTable({ data }: { data: PremiumPdfData }) {
 const bufferPercent =
 data.naivePrice > 0 ? (data.riskBuffer / data.naivePrice) * 100 : 0;

 const rows: {
 metric: string;
 deterministic: string;
 p90: string;
 alt?: boolean;
 }[] = [
 {
 metric: "Deterministic (naive) cost",
 deterministic: formatPremiumPdfUsd(data.naivePrice),
 p90: "—",
 },
 {
 metric: "P90 risk buffer",
 deterministic: formatPremiumPdfUsd(data.riskBuffer),
 p90: `+${bufferPercent.toFixed(1)}% reserve`,
 alt: true,
 },
 {
 metric: "P90 safe price",
 deterministic: "—",
 p90: formatPremiumPdfUsd(data.p90SafePrice),
 },
 ];

 return (
 <View style={styles.table}>
 <View style={styles.tableHeader}>
 <Text style={styles.tableHeaderCellWide}>Metric</Text>
 <Text style={styles.tableHeaderCell}>Deterministic</Text>
 <Text style={styles.tableHeaderCell}>P90 calculation</Text>
 </View>
 {rows.map((row) => (
 <View key={row.metric} style={row.alt ? styles.tableRowAlt : styles.tableRow}>
 <Text style={styles.tableCellWide}>{row.metric}</Text>
 <Text style={styles.tableCellRight}>{row.deterministic}</Text>
 <Text style={styles.tableCellRight}>{row.p90}</Text>
 </View>
 ))}
 </View>
 );
}

function SensitivityMatrixTable({
 rows,
}: {
 rows: PremiumPdfData["matrixRows"];
}) {
 if (rows.length === 0) {
 return (
 <Text style={styles.footnote}>
 Sensitivity scenarios were not stored for this report.
 </Text>
 );
 }

 return (
 <View style={styles.table}>
 <View style={styles.tableHeader}>
 <Text style={styles.tableHeaderCellWide}>Scenario</Text>
 <Text style={styles.tableHeaderCell}>Cost shift</Text>
 <Text style={styles.tableHeaderCell}>Delta amount</Text>
 <Text style={styles.tableHeaderCell}>P90 adjusted</Text>
 </View>
 {rows.map((row, index) => (
 <View
 key={`${row.scenario}-${index}`}
 style={index % 2 === 1 ? styles.tableRowAlt : styles.tableRow}
 >
 <Text style={styles.matrixCell}>{row.scenario}</Text>
 <Text style={styles.matrixCellRight}>{row.deltaPercent}</Text>
 <Text style={styles.matrixCellRight}>{row.deltaAmount}</Text>
 <Text style={styles.matrixCellRight}>{row.p90Adjusted}</Text>
 </View>
 ))}
 </View>
 );
}

export function PremiumPdfTemplate({ data }: PremiumPdfTemplateProps) {
 const generatedLabel = formatPremiumPdfGeneratedLabel(data.generatedAt);

 return (
 <Document>
 <Page size="A4" style={styles.page}>
 <View style={styles.headerBar}>
 <Text style={styles.brand}>SectorCalc · Premium Decision Summary</Text>
 </View>

 <Text style={styles.title}>{data.toolTitle}</Text>
 <Text style={styles.subtitle}>
 {data.sector} · Generated {generatedLabel}
 </Text>

 <View style={styles.verdictBox}>
 <Text style={styles.verdictLabel}>Verdict</Text>
 <Text style={styles.verdictText}>{data.verdict}</Text>
 </View>

 <Text style={styles.sectionTitle}>Deterministic vs P90 calculation</Text>
 <AnalysisTable data={data} />
 <Text style={styles.footnote}>
 Deterministic cost reflects naive exposure. P90 safe price includes a Z = 1.28
 stochastic reserve for 90% confidence.
 </Text>

 <Text style={styles.sectionTitle}>Sensitivity matrix</Text>
 <SensitivityMatrixTable rows={data.matrixRows} />
 <Text style={styles.footnote}>
 Three stress scenarios — material, labor and schedule delay impact on P90 safe
 price.
 </Text>
 </Page>

 <Page size="A4" style={styles.page}>
 <View style={styles.headerBar}>
 <Text style={styles.brand}>SectorCalc · Premium Decision Summary</Text>
 </View>

 {data.inputs.length > 0 ? (
 <>
 <Text style={styles.title}>Input summary</Text>
 <Text style={styles.subtitle}>
 {data.toolTitle} · {generatedLabel}
 </Text>

 <Text style={styles.sectionTitle}>Inputs used</Text>
 {data.inputs.map((input) => (
 <View key={input.label} style={styles.inputRow}>
 <Text style={styles.inputLabel}>{input.label}</Text>
 <Text style={styles.inputValue}>{input.value}</Text>
 </View>
 ))}
 </>
 ) : null}

 <Text style={styles.legal}>{data.legalDisclaimer}</Text>
 </Page>
 </Document>
 );
}
