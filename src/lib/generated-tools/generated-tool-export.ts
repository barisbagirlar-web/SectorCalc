import type { GeneratedToolResult, GeneratedToolSchema } from "@/lib/generated-tools/types";

function escapeCsvCell(value: string): string {
  if (/[",\n\r]/.test(value)) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

function row(cells: readonly string[]): string {
  return cells.map(escapeCsvCell).join(",");
}

export function serializeGeneratedToolCsv(input: {
  readonly slug: string;
  readonly title: string;
  readonly schema: GeneratedToolSchema;
  readonly inputs: Record<string, unknown>;
  readonly result: GeneratedToolResult;
}): string {
  const lines: string[] = [];
  lines.push(row(["SectorCalc", "Generated Tool Report"]));
  lines.push(row(["Tool", input.title]));
  lines.push(row(["Slug", input.slug]));
  lines.push(row(["Primary output", input.schema.outputs.primary]));
  lines.push("");

  lines.push(row(["Input", "Value"]));
  for (const field of input.schema.inputs) {
    const value = input.inputs[field.id];
    lines.push(row([field.label || field.id, value === undefined ? "" : String(value)]));
  }
  lines.push("");

  lines.push(row(["Breakdown", "Value"]));
  for (const [key, value] of Object.entries(input.result.breakdown)) {
    if (typeof value === "number" && Number.isFinite(value)) {
      lines.push(row([key, String(value)]));
    }
  }
  lines.push("");

  if (input.result.hiddenLossDrivers.length > 0) {
    lines.push(row(["Loss drivers"]));
    for (const driver of input.result.hiddenLossDrivers) {
      lines.push(row([driver]));
    }
    lines.push("");
  }

  if (input.result.suggestedActions.length > 0) {
    lines.push(row(["Suggested actions"]));
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
