import {
  Document,
  Image,
  Page,
  StyleSheet,
  Text,
  View,
} from "@react-pdf/renderer";
import type { GeneratedToolResult } from "@/lib/features/generated-tools/types";

const NAVY = "#1E3A5F";
const SLATE = "#64748B";
const BORDER = "#E2E8F0";

const styles = StyleSheet.create({
  page: {
    padding: 36,
    fontSize: 9,
    fontFamily: "Helvetica",
    color: "#111111",
    lineHeight: 1.45,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 18,
    borderBottomWidth: 1,
    borderBottomColor: BORDER,
    paddingBottom: 12,
  },
  logo: {
    width: 120,
    height: 32,
    objectFit: "contain",
  },
  companyName: {
    fontSize: 14,
    fontWeight: 700,
    color: NAVY,
  },
  meta: {
    fontSize: 8,
    color: SLATE,
    textAlign: "right",
  },
  title: {
    fontSize: 16,
    fontWeight: 700,
    color: NAVY,
    marginBottom: 6,
  },
  sectionTitle: {
    fontSize: 10,
    fontWeight: 700,
    color: NAVY,
    marginTop: 12,
    marginBottom: 6,
    textTransform: "uppercase",
  },
  row: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: BORDER,
    paddingVertical: 4,
  },
  label: {
    width: "38%",
    fontWeight: 700,
    color: SLATE,
  },
  value: {
    width: "62%",
  },
  breakdownRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  totalBox: {
    marginTop: 12,
    padding: 10,
    borderWidth: 1,
    borderColor: BORDER,
    backgroundColor: "#F8FAFC",
  },
  totalLabel: {
    fontSize: 8,
    color: SLATE,
    marginBottom: 4,
  },
  totalValue: {
    fontSize: 16,
    fontWeight: 700,
    color: NAVY,
  },
  bullet: {
    marginBottom: 3,
  },
  footer: {
    marginTop: 24,
    fontSize: 7,
    color: SLATE,
    textAlign: "center",
  },
});

export type QuotePdfDocumentProps = {
  readonly companyName: string;
  readonly quoteNumber: string;
  readonly toolName: string;
  readonly quoteDate: string;
  readonly currency: string;
  readonly locale: string;
  readonly inputRows: ReadonlyArray<{ readonly label: string; readonly value: string }>;
  readonly result: GeneratedToolResult;
  readonly baseTotal: number;
  readonly adjustedTotal: number;
  readonly includeFireRate: boolean;
  readonly fireRatePercent: number;
  readonly logoSrc?: string;
  readonly disclaimer: string;
  readonly labels: {
    readonly quoteNo: string;
    readonly date: string;
    readonly quoteReport: string;
    readonly inputValues: string;
    readonly calcSummary: string;
    readonly baseTotal: string;
    readonly totalWithFireRate: string;
    readonly breakdown: string;
    readonly hiddenLossDrivers: string;
    readonly suggestedActions: string;
  };
};

function formatMoney(value: number, currency: string, locale: string): string {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
  }).format(value);
}

function humanizeKey(key: string): string {
  return key.replace(/([A-Z])/g, " $1").replace(/_/g, " ").trim();
}

export function QuotePdfDocument({
  companyName,
  quoteNumber,
  toolName,
  quoteDate,
  currency,
  locale,
  inputRows,
  result,
  baseTotal,
  adjustedTotal,
  includeFireRate,
  fireRatePercent,
  logoSrc,
  disclaimer,
  labels,
}: QuotePdfDocumentProps) {
  const hiddenDrivers = result.hiddenLossDrivers.filter(Boolean);
  const suggestedActions = result.suggestedActions.filter(Boolean);
  const breakdownEntries = Object.entries(result.breakdown).filter(
    ([, value]) => typeof value === "number" && Number.isFinite(value),
  );

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <View>
            {logoSrc ? (
              // eslint-disable-next-line jsx-a11y/alt-text -- react-pdf Image has no alt prop
              <Image src={logoSrc} style={styles.logo} />
            ) : (
              <Text style={styles.companyName}>{companyName}</Text>
            )}
            {logoSrc ? <Text style={{ marginTop: 4, fontSize: 10 }}>{companyName}</Text> : null}
          </View>
          <View>
            <Text style={styles.meta}>{labels.quoteNo}: {quoteNumber}</Text>
            <Text style={styles.meta}>{labels.date}: {quoteDate}</Text>
          </View>
        </View>

        <Text style={styles.title}>{toolName} - {labels.quoteReport}</Text>

        <Text style={styles.sectionTitle}>{labels.inputValues}</Text>
        {inputRows.map((entry) => (
          <View key={entry.label} style={styles.row}>
            <Text style={styles.label}>{entry.label}</Text>
            <Text style={styles.value}>{entry.value}</Text>
          </View>
        ))}

        <Text style={styles.sectionTitle}>{labels.calcSummary}</Text>
        <View style={styles.totalBox}>
          <Text style={styles.totalLabel}>{labels.baseTotal}</Text>
          <Text style={styles.totalValue}>{formatMoney(baseTotal, currency, locale)}</Text>
        </View>
        {includeFireRate ? (
          <View style={styles.totalBox}>
            <Text style={styles.totalLabel}>{labels.totalWithFireRate} ({fireRatePercent}%)</Text>
            <Text style={styles.totalValue}>{formatMoney(adjustedTotal, currency, locale)}</Text>
          </View>
        ) : null}

        {breakdownEntries.length > 0 ? (
          <>
            <Text style={styles.sectionTitle}>{labels.breakdown}</Text>
            {breakdownEntries.map(([key, value]) => (
              <View key={key} style={styles.breakdownRow}>
                <Text>{humanizeKey(key)}</Text>
                <Text>{formatMoney(value as number, currency, locale)}</Text>
              </View>
            ))}
          </>
        ) : null}

        {hiddenDrivers.length > 0 ? (
          <>
            <Text style={styles.sectionTitle}>{labels.hiddenLossDrivers}</Text>
            {hiddenDrivers.map((driver) => (
              <Text key={driver} style={styles.bullet}>
                - {driver}
              </Text>
            ))}
          </>
        ) : null}

        {suggestedActions.length > 0 ? (
          <>
            <Text style={styles.sectionTitle}>{labels.suggestedActions}</Text>
            {suggestedActions.map((action) => (
              <Text key={action} style={styles.bullet}>
                - {action}
              </Text>
            ))}
          </>
        ) : null}

        <Text style={styles.footer}>{disclaimer}</Text>
      </Page>
    </Document>
  );
}
