import {
 Document,
 Page,
 StyleSheet,
 Text,
 View,
} from "@react-pdf/renderer";
import type { VerdictReportData } from "@/lib/reports/verdict-report";
import { formatVerdictReportDate } from "@/lib/reports/verdict-report";
import type { PremiumSeverity } from "@/lib/tools/premium-tool-results";

const baseStyles = StyleSheet.create({
 page: {
 padding: 40,
 fontFamily: "Helvetica",
 fontSize: 10,
 color: "#111111",
 backgroundColor: "#ffffff",
 },
 brand: {
 fontSize: 11,
 color: "#1E40AF",
 marginBottom: 8,
 fontWeight: 700,
 },
 title: {
 fontSize: 24,
 fontWeight: 700,
 color: "#111111",
 marginBottom: 6,
 },
 subtitle: {
 fontSize: 10,
 color: "#999999",
 marginBottom: 20,
 },
 verdictLabel: {
 fontSize: 10,
 marginBottom: 6,
 textTransform: "uppercase",
 },
 verdict: {
 fontSize: 22,
 fontWeight: 700,
 },
 metricBox: {
 borderWidth: 1,
 borderColor: "#dbeafe",
 backgroundColor: "#eff6ff",
 padding: 14,
 marginBottom: 18,
 },
 metricLabel: {
 fontSize: 10,
 color: "#1d4ed8",
 marginBottom: 4,
 },
 metricValue: {
 fontSize: 20,
 fontWeight: 700,
 color: "#1e3a8a",
 },
 sectionTitle: {
 fontSize: 13,
 fontWeight: 700,
 color: "#111111",
 marginTop: 12,
 marginBottom: 8,
 },
 paragraph: {
 fontSize: 10,
 lineHeight: 1.5,
 color: "#111111",
 marginBottom: 8,
 },
 row: {
 borderBottomWidth: 1,
 borderBottomColor: "#e2e8f0",
 paddingVertical: 7,
 },
 inputLabel: {
 fontSize: 9,
 color: "#999999",
 },
 inputValue: {
 fontSize: 10,
 color: "#111111",
 marginTop: 2,
 },
 legal: {
 marginTop: 28,
 paddingTop: 12,
 borderTopWidth: 1,
 borderTopColor: "#e2e8f0",
 fontSize: 7,
 lineHeight: 1.4,
 color: "#999999",
 },
});

const severityStyles: Record<
 PremiumSeverity,
 {
 verdictBox: {
 borderWidth: number;
 borderColor: string;
 backgroundColor: string;
 padding: number;
 marginBottom: number;
 };
 verdictLabel: { color: string };
 verdict: { color: string };
 }
> = {
 safe: {
 verdictBox: {
 borderWidth: 2,
 borderColor: "#059669",
 backgroundColor: "#ecfdf5",
 padding: 16,
 marginBottom: 18,
 },
 verdictLabel: { color: "#047857" },
 verdict: { color: "#065f46" },
 },
 watch: {
 verdictBox: {
 borderWidth: 2,
 borderColor: "#d97706",
 backgroundColor: "#fffbeb",
 padding: 16,
 marginBottom: 18,
 },
 verdictLabel: { color: "#b45309" },
 verdict: { color: "#92400e" },
 },
 danger: {
 verdictBox: {
 borderWidth: 2,
 borderColor: "#dc2626",
 backgroundColor: "#fef2f2",
 padding: 16,
 marginBottom: 18,
 },
 verdictLabel: { color: "#991b1b" },
 verdict: { color: "#991b1b" },
 },
};

interface VerdictPdfDocumentProps {
 data: VerdictReportData;
 severity: PremiumSeverity;
}

export function VerdictPdfDocument({ data, severity }: VerdictPdfDocumentProps) {
 const verdictStyles = severityStyles[severity];
 const generatedLabel = formatVerdictReportDate(data.generatedAt);

 return (
 <Document>
 <Page size="A4" style={baseStyles.page}>
 <Text style={baseStyles.brand}>SectorCalc Pro</Text>
 <Text style={baseStyles.title}>Verdict Report</Text>
 <Text style={baseStyles.subtitle}>
 {data.toolTitle} · {data.sector} · {generatedLabel}
 </Text>

 <View style={verdictStyles.verdictBox}>
 <Text style={[baseStyles.verdictLabel, verdictStyles.verdictLabel]}>
 Verdict
 </Text>
 <Text style={[baseStyles.verdict, verdictStyles.verdict]}>{data.verdict}</Text>
 </View>

 <View style={baseStyles.metricBox}>
 <Text style={baseStyles.metricLabel}>{data.primaryMetricLabel}</Text>
 <Text style={baseStyles.metricValue}>{data.primaryMetricValue}</Text>
 </View>

 <Text style={baseStyles.sectionTitle}>What this means</Text>
 <Text style={baseStyles.paragraph}>{data.headline}</Text>

 <Text style={baseStyles.sectionTitle}>Suggested action</Text>
 <Text style={baseStyles.paragraph}>{data.suggestedAction}</Text>
 </Page>

 <Page size="A4" style={baseStyles.page}>
 <Text style={baseStyles.brand}>SectorCalc Pro</Text>
 <Text style={baseStyles.title}>Input Summary</Text>
 <Text style={baseStyles.subtitle}>
 {data.toolTitle} · {generatedLabel}
 </Text>

 <Text style={baseStyles.sectionTitle}>Inputs used</Text>
 {data.inputs.map((input) => (
 <View key={input.label} style={baseStyles.row}>
 <Text style={baseStyles.inputLabel}>{input.label}</Text>
 <Text style={baseStyles.inputValue}>{input.value}</Text>
 </View>
 ))}

 <Text style={baseStyles.sectionTitle}>Key risk drivers</Text>
 {data.riskDrivers.map((driver) => (
 <Text key={driver} style={baseStyles.paragraph}>
 - {driver}
 </Text>
 ))}

 <Text style={baseStyles.legal}>{data.legalDisclaimer}</Text>
 </Page>
 </Document>
 );
}
