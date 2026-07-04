import "server-only";

export type CalculationStatus = "OK" | "REVIEW" | "BLOCKED";
export type RedactionStatus = "PUBLIC_SAFE_REDACTED" | "REDACTION_NOT_REQUIRED" | "REDACTION_FAILED_BLOCKED";

export interface CalculationResult {
  status: CalculationStatus;
  outputs: Record<string, number>;
  warnings: string[];
  outputKeys: string[];
  redaction_status: RedactionStatus;
}

function isFiniteNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function get(inputs: Record<string, number>, key: string): number {
  const value = inputs[key];
  return isFiniteNumber(value) ? value : 0;
}

function round(value: number, decimals: number): number {
  if (!Number.isFinite(value)) return 0;
  const factor = Math.pow(10, decimals);
  return Math.round(value * factor) / factor;
}

function safeDiv(numerator: number, denominator: number): number {
  if (!Number.isFinite(numerator) || !Number.isFinite(denominator) || Math.abs(denominator) < 1e-9) {
    return 0;
  }
  return numerator / denominator;
}

export const toolKey = "steel-bar-cutting-optimizer-waste";
export const formulaVersion = "1.0.0";
export const publicFormulaExpressionPolicy = "FORBIDDEN" as const;

/**
 * Server-only deterministic formula module for Steel Bar Cutting Optimizer Calculator.
 * Exact formula logic must remain server-side and must never be rendered in public UI, public schema, PDF export, JSON audit, or copy summary.
 */
export function calculate(inputs: Record<string, number>): CalculationResult {
  const warnings: string[] = [];
  const outputs: Record<string, number> = {};

  const stock_bar_length = get(inputs, "stock_bar_length");
  const part_length = get(inputs, "part_length");
  const saw_kerf = get(inputs, "saw_kerf");
  const bar_count = get(inputs, "bar_count");
  const cost_per_bar = get(inputs, "cost_per_bar");
  const scrap_resale_value_per_meter = get(inputs, "scrap_resale_value_per_meter");

  for (const key of ["stock_bar_length", "part_length", "saw_kerf", "bar_count", "cost_per_bar", "scrap_resale_value_per_meter"]) {
    const value = inputs[key];
    if (!isFiniteNumber(value)) {
      warnings.push(`Missing or non-finite input: ${key}`);
    }
  }

  const unitLength = part_length + saw_kerf;
  outputs.parts_per_bar = Math.floor(stock_bar_length / Math.max(0.0001, unitLength));
  outputs.total_parts = outputs.parts_per_bar * bar_count;
  const scrapPerBar = Math.max(0, stock_bar_length - outputs.parts_per_bar * unitLength);
  outputs.scrap_length_total = round(scrapPerBar * bar_count, 3);
  outputs.scrap_value = round(outputs.scrap_length_total * scrap_resale_value_per_meter, 2);

  for (const key of ["parts_per_bar", "total_parts", "scrap_length_total", "scrap_value"]) {
    if (!isFiniteNumber(outputs[key])) {
      outputs[key] = 0;
      warnings.push(`Non-finite output corrected to zero for public-safe response: ${key}`);
    }
  }

  return {
    status: warnings.length > 0 ? "REVIEW" : "OK",
    outputs,
    warnings,
    outputKeys: ["parts_per_bar", "total_parts", "scrap_length_total", "scrap_value"],
    redaction_status: "PUBLIC_SAFE_REDACTED"
  };
}
