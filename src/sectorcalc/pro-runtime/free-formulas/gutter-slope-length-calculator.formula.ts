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

export const toolKey = "gutter-slope-length-calculator";
export const formulaVersion = "1.0.0";
export const publicFormulaExpressionPolicy = "FORBIDDEN" as const;

/**
 * Server-only deterministic formula module for Gutter Slope Length Calculator.
 * Exact formula logic must remain server-side and must never be rendered in public UI, public schema, PDF export, JSON audit, or copy summary.
 */
export function calculate(inputs: Record<string, number>): CalculationResult {
  const warnings: string[] = [];
  const outputs: Record<string, number> = {};

  const gutter_run_length = get(inputs, "gutter_run_length");
  const slope_mm_per_meter = get(inputs, "slope_mm_per_meter");
  const max_outlet_spacing = get(inputs, "max_outlet_spacing");
  const roof_catchment_area = get(inputs, "roof_catchment_area");
  const rainfall_intensity = get(inputs, "rainfall_intensity");

  for (const key of ["gutter_run_length", "slope_mm_per_meter", "max_outlet_spacing", "roof_catchment_area", "rainfall_intensity"]) {
    const value = inputs[key];
    if (!isFiniteNumber(value)) {
      warnings.push(`Missing or non-finite input: ${key}`);
    }
  }

  outputs.total_fall = round(gutter_run_length * slope_mm_per_meter, 1);
  outputs.downspout_count = Math.max(1, Math.ceil(gutter_run_length / Math.max(0.01, max_outlet_spacing)));
  outputs.drainage_load_index = round(roof_catchment_area * rainfall_intensity / outputs.downspout_count, 2);

  for (const key of ["total_fall", "downspout_count", "drainage_load_index"]) {
    if (!isFiniteNumber(outputs[key])) {
      outputs[key] = 0;
      warnings.push(`Non-finite output corrected to zero for public-safe response: ${key}`);
    }
  }

  return {
    status: warnings.length > 0 ? "REVIEW" : "OK",
    outputs,
    warnings,
    outputKeys: ["total_fall", "downspout_count", "drainage_load_index"],
    redaction_status: "PUBLIC_SAFE_REDACTED"
  };
}
