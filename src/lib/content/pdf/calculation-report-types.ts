type AppLocale = "en";

export type CalculationReportRow = {
  readonly label: string;
  readonly value: string;
};

export type CalculationReportCopy = {
  readonly subtitle: string;
  readonly inputsTitle: string;
  readonly resultsTitle: string;
  readonly primaryLabel: string;
  readonly breakdownTitle: string;
  readonly footerLine1: string;
  readonly footerLine2: string;
  readonly footerLine3: string;
  readonly disclaimer: string;
};

export type CalculationReportProps = {
  readonly toolName: string;
  readonly locale: AppLocale;
  readonly copy: CalculationReportCopy;
  readonly inputRows: readonly CalculationReportRow[];
  readonly primaryResult: string;
  readonly breakdownRows: readonly CalculationReportRow[];
  readonly generatedAt: string;
  readonly trustTrace?: {
    readonly hash: string;
    readonly verifyUrl: string;
  };
};

export function buildCalculationReportFileName(toolName: string): string {
  const slug = toolName
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return `${slug || "sectorcalc"}-report.pdf`;
}
