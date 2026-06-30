import type { GeneratedToolResult, GeneratedToolSchema } from "@/lib/generated-tools/types";

export interface CsvLabels {
  readonly reportLabel: string;
  readonly tool: string;
  readonly slug: string;
  readonly primaryOutput: string;
  readonly input: string;
  readonly value: string;
  readonly breakdown: string;
  readonly lossDrivers: string;
  readonly suggestedActions: string;
}

function escapeCsvCell(value: string): string {
  if (/[",\n\r]/.test(value)) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

function row(cells: readonly string[]): string {
  return cells.map(escapeCsvCell).join(",");
}

export function serializeGeneratedToolCsv(
  input: {
    readonly slug: string;
    readonly title: string;
    readonly schema: GeneratedToolSchema;
    readonly inputs: Record<string, unknown>;
    readonly result: GeneratedToolResult;
  },
  labels: CsvLabels,
): string {
  const lines: string[] = [];
  lines.push(row(["SectorCalc", labels.reportLabel]));
  lines.push(row([labels.tool, input.title]));
  lines.push(row([labels.slug, input.slug]));
  lines.push(row([labels.primaryOutput, input.schema.outputs.primary]));
  lines.push("");

  lines.push(row([labels.input, labels.value]));
  for (const field of input.schema.inputs) {
    const value = input.inputs[field.id];
    lines.push(row([field.label || field.id, value === undefined ? "" : String(value)]));
  }
  lines.push("");

  lines.push(row([labels.breakdown, labels.value]));
  for (const [key, value] of Object.entries(input.result.breakdown)) {
    if (typeof value === "number" && Number.isFinite(value)) {
      lines.push(row([key, String(value)]));
    }
  }
  lines.push("");

  if (input.result.hiddenLossDrivers.length > 0) {
    lines.push(row([labels.lossDrivers]));
    for (const driver of input.result.hiddenLossDrivers) {
      lines.push(row([driver]));
    }
    lines.push("");
  }

  if (input.result.suggestedActions.length > 0) {
    lines.push(row([labels.suggestedActions]));
    for (const action of input.result.suggestedActions) {
      lines.push(row([action]));
    }
  }

  return `${lines.join("\n")}\n`;
}

export function downloadGeneratedToolCsv(filename: string, content: string): void {
  const blob = new Blob([content], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.rel = "noopener";
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);
}
