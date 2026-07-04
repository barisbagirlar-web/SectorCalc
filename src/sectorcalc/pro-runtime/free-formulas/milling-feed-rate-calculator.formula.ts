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

export const toolKey = "milling-feed-rate-calculator";
export const formulaVersion = "1.0.0";
export const publicFormulaExpressionPolicy = "FORBIDDEN" as const;

/**
 * Server-only deterministic formula module for Milling Feed Rate Calculator.
 * Exact formula logic must remain server-side and must never be rendered in public UI, public schema, PDF export, JSON audit, or copy summary.
 */
export function calculate(inputs: Record<string, number>): CalculationResult {
  const warnings: string[] = [];
  const outputs: Record<string, number> = {};

  const spindle_rpm = get(inputs, "spindle_rpm");
  const flute_count = get(inputs, "flute_count");
  const chip_load = get(inputs, "chip_load");
  const radial_width_of_cut = get(inputs, "radial_width_of_cut");
  const axial_depth_of_cut = get(inputs, "axial_depth_of_cut");

  for (const key of ["spindle_rpm", "flute_count", "chip_load", "radial_width_of_cut", "axial_depth_of_cut"]) {
    const value = inputs[key];
    if (!isFiniteNumber(value)) {
      warnings.push(`Missing or non-finite input: ${key}`);
    }
  }

  outputs.table_feed_rate = round(spindle_rpm * flute_count * chip_load, 2);
  outputs.material_removal_rate = round(outputs.table_feed_rate * radial_width_of_cut * axial_depth_of_cut, 2);
  outputs.chip_load_status_index = round(chip_load / Math.max(0.001, axial_depth_of_cut), 3);

  for (const key of ["table_feed_rate", "material_removal_rate", "chip_load_status_index"]) {
    if (!isFiniteNumber(outputs[key])) {
      outputs[key] = 0;
      warnings.push(`Non-finite output corrected to zero for public-safe response: ${key}`);
    }
  }

  return {
    status: warnings.length > 0 ? "REVIEW" : "OK",
    outputs,
    warnings,
    outputKeys: ["table_feed_rate", "material_removal_rate", "chip_load_status_index"],
    redaction_status: "PUBLIC_SAFE_REDACTED"
  };
}
