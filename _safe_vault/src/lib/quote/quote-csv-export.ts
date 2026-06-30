import { downloadGeneratedToolCsv } from "@/lib/generated-tools/generated-tool-export";

function escapeCsvCell(value: string): string {
  if (/[",\n\r]/.test(value)) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

function row(cells: readonly string[]): string {
  return cells.map(escapeCsvCell).join(",");
}

export type QuoteCsvRow = {
  readonly field: string;
  readonly value: string;
};

export function buildQuoteCsvRows(input: {
  readonly quoteNumber: string;
  readonly companyName: string;
  readonly toolName: string;
  readonly inputRows: readonly QuoteCsvRow[];
  readonly baseTotal: number;
  readonly currency: string;
  readonly includeFireRate: boolean;
  readonly fireRatePercent: number;
  readonly adjustedTotal: number;
  readonly hiddenLossDrivers: readonly string[];
  readonly suggestedActions: readonly string[];
  readonly quoteNumberFieldLabel?: string;
  readonly companyFieldLabel?: string;
  readonly toolFieldLabel?: string;
  readonly baseTotalFieldLabel?: string;
  readonly fireRateFieldLabel?: string;
  readonly hiddenLossDriversFieldLabel?: string;
  readonly suggestedActionsFieldLabel?: string;
}): readonly QuoteCsvRow[] {
  const rows: QuoteCsvRow[] = [
    { field: input.quoteNumberFieldLabel ?? "Quote number", value: input.quoteNumber },
    { field: input.companyFieldLabel ?? "Company", value: input.companyName },
    { field: input.toolFieldLabel ?? "Tool", value: input.toolName },
    ...input.inputRows,
    { field: input.baseTotalFieldLabel ?? `Base total (${input.currency})`, value: String(input.baseTotal) },
  ];

  if (input.includeFireRate) {
    rows.push({
      field: input.fireRateFieldLabel ?? `Fire rate (${input.fireRatePercent}%)`,
      value: String(input.adjustedTotal),
    });
  }

  if (input.hiddenLossDrivers.length > 0) {
    rows.push({
      field: input.hiddenLossDriversFieldLabel ?? "Hidden loss drivers",
      value: input.hiddenLossDrivers.join("; "),
    });
  }

  if (input.suggestedActions.length > 0) {
    rows.push({
      field: input.suggestedActionsFieldLabel ?? "Suggested actions",
      value: input.suggestedActions.join("; "),
    });
  }

  return rows;
}

export function serializeQuoteCsv(rows: readonly QuoteCsvRow[]): string {
  const lines = [
    row(["SectorCalc", "Quote Export"]),
    row(["Field", "Value"]),
    ...rows.map((entry) => row([entry.field, entry.value])),
  ];
  return `${lines.join("\n")}\n`;
}

export function downloadQuoteCsv(filename: string, rows: readonly QuoteCsvRow[]): void {
  downloadGeneratedToolCsv(filename, serializeQuoteCsv(rows));
}
