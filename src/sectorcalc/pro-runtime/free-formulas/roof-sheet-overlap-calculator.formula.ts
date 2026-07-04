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

export const toolKey = "roof-sheet-overlap-calculator";
export const formulaVersion = "1.0.0";
export const publicFormulaExpressionPolicy = "FORBIDDEN" as const;

/**
 * Server-only deterministic formula module for Roof Sheet Overlap Calculator.
 * Exact formula logic must remain server-side and must never be rendered in public UI, public schema, PDF export, JSON audit, or copy summary.
 */
export function calculate(inputs: Record<string, number>): CalculationResult {
  const warnings: string[] = [];
  const outputs: Record<string, number> = {};

  const roof_length = get(inputs, "roof_length");
  const roof_width = get(inputs, "roof_width");
  const sheet_length = get(inputs, "sheet_length");
  const sheet_width = get(inputs, "sheet_width");
  const side_lap = get(inputs, "side_lap");
  const end_lap = get(inputs, "end_lap");
  const waste_allowance_percent = get(inputs, "waste_allowance_percent");
  const screws_per_sheet = get(inputs, "screws_per_sheet");

  for (const key of ["roof_length", "roof_width", "sheet_length", "sheet_width", "side_lap", "end_lap", "waste_allowance_percent", "screws_per_sheet"]) {
    const value = inputs[key];
    if (!isFiniteNumber(value)) {
      warnings.push(`Missing or non-finite input: ${key}`);
    }
  }

  const effectiveWidth = Math.max(0.01, sheet_width - side_lap);
  const effectiveLength = Math.max(0.01, sheet_length - end_lap);
  outputs.effective_sheet_area = round(effectiveWidth * effectiveLength, 3);
  const roofArea = roof_length * roof_width * (1 + waste_allowance_percent / 100);
  outputs.sheet_count = Math.ceil(roofArea / Math.max(0.0001, outputs.effective_sheet_area));
  outputs.screw_count = Math.ceil(outputs.sheet_count * screws_per_sheet);

  for (const key of ["effective_sheet_area", "sheet_count", "screw_count"]) {
    if (!isFiniteNumber(outputs[key])) {
      outputs[key] = 0;
      warnings.push(`Non-finite output corrected to zero for public-safe response: ${key}`);
    }
  }

  return {
    status: warnings.length > 0 ? "REVIEW" : "OK",
    outputs,
    warnings,
    outputKeys: ["effective_sheet_area", "sheet_count", "screw_count"],
    redaction_status: "PUBLIC_SAFE_REDACTED"
  };
}
