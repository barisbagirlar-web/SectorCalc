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

export const toolKey = "v-belt-length-pulley-calculator";
export const formulaVersion = "1.0.0";
export const publicFormulaExpressionPolicy = "FORBIDDEN" as const;

/**
 * Server-only deterministic formula module for V-Belt Length Pulley Calculator.
 * Exact formula logic must remain server-side and must never be rendered in public UI, public schema, PDF export, JSON audit, or copy summary.
 */
export function calculate(inputs: Record<string, number>): CalculationResult {
  const warnings: string[] = [];
  const outputs: Record<string, number> = {};

  const center_distance = get(inputs, "center_distance");
  const large_pulley_diameter = get(inputs, "large_pulley_diameter");
  const small_pulley_diameter = get(inputs, "small_pulley_diameter");
  const tension_allowance_percent = get(inputs, "tension_allowance_percent");

  for (const key of ["center_distance", "large_pulley_diameter", "small_pulley_diameter", "tension_allowance_percent"]) {
    const value = inputs[key];
    if (!isFiniteNumber(value)) {
      warnings.push(`Missing or non-finite input: ${key}`);
    }
  }

  const D = large_pulley_diameter;
  const d = small_pulley_diameter;
  const C = center_distance;
  outputs.nominal_belt_length = round(2 * C + Math.PI * (D + d) / 2 + Math.pow(D - d, 2) / (4 * C), 2);
  outputs.adjusted_belt_length = round(outputs.nominal_belt_length * (1 + tension_allowance_percent / 100), 2);
  outputs.diameter_ratio = round(D / Math.max(0.01, d), 3);

  for (const key of ["nominal_belt_length", "adjusted_belt_length", "diameter_ratio"]) {
    if (!isFiniteNumber(outputs[key])) {
      outputs[key] = 0;
      warnings.push(`Non-finite output corrected to zero for public-safe response: ${key}`);
    }
  }

  return {
    status: warnings.length > 0 ? "REVIEW" : "OK",
    outputs,
    warnings,
    outputKeys: ["nominal_belt_length", "adjusted_belt_length", "diameter_ratio"],
    redaction_status: "PUBLIC_SAFE_REDACTED"
  };
}
