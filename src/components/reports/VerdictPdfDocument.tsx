import {
 Document,
 Page,
 StyleSheet,
 Text,
 View,
} from "@react-pdf/renderer";
import {
 PREMIUM_DECISION_SUMMARY_TITLE,
 formatVerdictReportDate,
 type VerdictReportData,
} from "@/lib/features/reports/verdict-report";
import type { PremiumSeverity } from "@/lib/features/tools/premium-tool-results";

const NAVY = "#1E3A5F";
const SLATE = "#64748B";
const BORDER = "#E2E8F0";

const baseStyles = StyleSheet.create({
 page: {
 padding: 36,
 fontFamily: "Helvetica",
 fontSize: 9,
 color: "#111111",
 backgroundColor: "#ffffff",
 lineHeight: 1.45,
 },
 headerBar: {
 backgroundColor: NAVY,
 paddingVertical: 10,
 paddingHorizontal: 12,
 marginBottom: 14,
 },
 brand: {
 fontSize: 10,
 color: "#FFFFFF",
 fontWeight: 700,
 letterSpacing: 0.3,
 },
 docTitle: {
 fontSize: 16,
 fontWeight: 700,
 color: NAVY,
 marginBottom: 4,
 },
 docSubtitle: {
 fontSize: 8,
 color: SLATE,
 marginBottom: 14,
 },
 toolMeta: {
 fontSize: 8,
 color: SLATE,
 marginBottom: 12,
 },
 sectionTitle: {
 fontSize: 10,
 fontWeight: 700,
 color: NAVY,
 marginTop: 10,
 marginBottom: 6,
 textTransform: "uppercase",
 letterSpacing: 0.5,
 },
 paragraph: {
 fontSize: 9,
 lineHeight: 1.45,
 color: "#111111",
 marginBottom: 6,
 },
 bullet: {
 fontSize: 9,
 lineHeight: 1.4,
 color: "#111111",
 marginBottom: 4,
 paddingLeft: 4,
 },
 verdictLabel: {
 fontSize: 8,
 marginBottom: 4,
 textTransform: "uppercase",
 letterSpacing: 0.4,
 },
 verdict: {
 fontSize: 18,
 fontWeight: 700,
 },
 metricBox: {
 borderWidth: 1,
 borderColor: BORDER,
 backgroundColor: "#F8FAFC",
 padding: 10,
 marginBottom: 10,
 },
 metricLabel: {
 fontSize: 8,
 color: SLATE,
 marginBottom: 3,
 },
 metricValue: {
 fontSize: 14,
 fontWeight: 700,
 color: NAVY,
 },
 row: {
 borderBottomWidth: 1,
 borderBottomColor: BORDER,
 paddingVertical: 5,
 },
 inputLabel: {
 fontSize: 7,
 color: SLATE,
 textTransform: "uppercase",
 },
 inputValue: {
 fontSize: 9,
 color: "#111111",
 marginTop: 1,
 },
 scenarioTitle: {
 fontSize: 9,
 fontWeight: 700,
 color: NAVY,
 },
 scenarioDetail: {
 fontSize: 8,
 color: SLATE,
 marginTop: 2,
 },
 legal: {
 marginTop: 12,
 paddingTop: 10,
 borderTopWidth: 1,
 borderTopColor: BORDER,
 fontSize: 7,
 lineHeight: 1.4,
 color: SLATE,
 },
 footerNote: {
 fontSize: 7,
 color: SLATE,
 marginTop: 8,
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
 borderWidth: 1,
 borderColor: "#059669",
 backgroundColor: "#ecfdf5",
 padding: 12,
 marginBottom: 10,
 },
 verdictLabel: { color: "#047857" },
 verdict: { color: "#065f46" },
 },
 watch: {
 verdictBox: {
 borderWidth: 1,
 borderColor: "#d97706",
 backgroundColor: "#fffbeb",
 padding: 12,
 marginBottom: 10,
 },
 verdictLabel: { color: "#b45309" },
 verdict: { color: "#92400e" },
 },
 danger: {
 verdictBox: {
 borderWidth: 1,
 borderColor: "#dc2626",
 backgroundColor: "#fef2f2",
 padding: 12,
 marginBottom: 10,
 },
 verdictLabel: { color: "#991b1b" },
 verdict: { color: "#991b1b" },
 },
};

function BulletList({ items, emptyLabel }: { items: string[]; emptyLabel: string }) {
 if (items.length === 0) {
  return <Text style={baseStyles.paragraph}>{emptyLabel}</Text>;
 }

 return (
  <>
   {items.map((item) => (
    <Text key={item} style={baseStyles.bullet}>
     • {item}
    </Text>
   ))}
  </>
 );
}

function PdfHeader({ generatedLabel }: { generatedLabel: string }) {
 return (
  <>
   <View style={baseStyles.headerBar}>
    <Text style={baseStyles.brand}>SectorCalc</Text>
   </View>
   <Text style={baseStyles.docTitle}>{PREMIUM_DECISION_SUMMARY_TITLE}</Text>
   <Text style={baseStyles.docSubtitle}>
    Calculation summary · For decision support only · {generatedLabel}
   </Text>
  </>
 );
}

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
 <PdfHeader generatedLabel={generatedLabel} />
 <Text style={baseStyles.toolMeta}>
 {data.toolTitle} · {data.sector}
 </Text>

 <Text style={baseStyles.sectionTitle}>Result summary</Text>
 <View style={verdictStyles.verdictBox}>
 <Text style={[baseStyles.verdictLabel, verdictStyles.verdictLabel]}>Verdict</Text>
 <Text style={[baseStyles.verdict, verdictStyles.verdict]}>{data.verdict}</Text>
 </View>

 <View style={baseStyles.metricBox}>
 <Text style={baseStyles.metricLabel}>{data.primaryMetricLabel}</Text>
 <Text style={baseStyles.metricValue}>{data.primaryMetricValue}</Text>
 </View>

 <Text style={baseStyles.paragraph}>{data.headline}</Text>

 <Text style={baseStyles.sectionTitle}>Suggested action</Text>
 <Text style={baseStyles.paragraph}>{data.suggestedAction}</Text>

 {data.riskDrivers.length > 0 ? (
  <>
   <Text style={baseStyles.sectionTitle}>Key risk drivers</Text>
   <BulletList items={data.riskDrivers} emptyLabel="No risk drivers recorded." />
  </>
 ) : null}
 </Page>

 <Page size="A4" style={baseStyles.page}>
 <PdfHeader generatedLabel={generatedLabel} />
 <Text style={baseStyles.toolMeta}>{data.toolTitle}</Text>

 <Text style={baseStyles.sectionTitle}>Input summary</Text>
 {data.inputs.length > 0 ? (
  data.inputs.map((input) => (
   <View key={input.label} style={baseStyles.row}>
    <Text style={baseStyles.inputLabel}>{input.label}</Text>
    <Text style={baseStyles.inputValue}>{input.value}</Text>
   </View>
  ))
 ) : (
  <Text style={baseStyles.paragraph}>Inputs captured in the live analyzer session.</Text>
 )}

 <Text style={baseStyles.sectionTitle}>Assumption summary</Text>
 <BulletList items={data.assumptions} emptyLabel="Standard sector defaults applied." />

 <Text style={baseStyles.sectionTitle}>Scenario summary</Text>
 {data.scenarios.length > 0 ? (
  data.scenarios.map((scenario) => (
   <View key={`${scenario.title}-${scenario.detail}`} style={baseStyles.row}>
    <Text style={baseStyles.scenarioTitle}>{scenario.title}</Text>
    <Text style={baseStyles.scenarioDetail}>{scenario.detail}</Text>
    {scenario.metric ? (
     <Text style={baseStyles.scenarioDetail}>Reference value: {scenario.metric}</Text>
    ) : null}
   </View>
  ))
 ) : (
  <Text style={baseStyles.paragraph}>No additional stress scenarios stored for this run.</Text>
 )}

 <Text style={baseStyles.sectionTitle}>Validation summary</Text>
 <BulletList items={data.validationNotes} emptyLabel="Browser-side input checks completed." />
 </Page>

 <Page size="A4" style={baseStyles.page}>
 <PdfHeader generatedLabel={generatedLabel} />

 <Text style={baseStyles.sectionTitle}>Methodology note</Text>
 <Text style={baseStyles.paragraph}>{data.methodologyNote}</Text>

 <Text style={baseStyles.sectionTitle}>Usage agreement</Text>
 <Text style={baseStyles.paragraph}>{data.usageNote}</Text>

 <Text style={baseStyles.sectionTitle}>Disclaimer</Text>
 <Text style={baseStyles.legal}>{data.legalDisclaimer}</Text>

 <Text style={baseStyles.footerNote}>
 SectorCalc · Premium Decision Summary · Generated {generatedLabel}
 </Text>
 </Page>
 </Document>
 );
}
