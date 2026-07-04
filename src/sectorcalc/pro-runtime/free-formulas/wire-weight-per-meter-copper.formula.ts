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

export const toolKey = "wire-weight-per-meter-copper";
export const formulaVersion = "1.0.0";
export const publicFormulaExpressionPolicy = "FORBIDDEN" as const;

/**
 * Server-only deterministic formula module for Wire Weight per Meter Calculator.
 * Exact formula logic must remain server-side and must never be rendered in public UI, public schema, PDF export, JSON audit, or copy summary.
 */
export function calculate(inputs: Record<string, number>): CalculationResult {
  const warnings: string[] = [];
  const outputs: Record<string, number> = {};

  const cross_section_area = get(inputs, "cross_section_area");
  const cable_length = get(inputs, "cable_length");
  const conductor_density = get(inputs, "conductor_density");
  const conductor_count = get(inputs, "conductor_count");
  const material_price_per_kg = get(inputs, "material_price_per_kg");

  for (const key of ["cross_section_area", "cable_length", "conductor_density", "conductor_count", "material_price_per_kg"]) {
    const value = inputs[key];
    if (!isFiniteNumber(value)) {
      warnings.push(`Missing or non-finite input: ${key}`);
    }
  }

  outputs.weight_per_meter = round(cross_section_area * conductor_density * conductor_count, 4);
  outputs.total_cable_weight = round(outputs.weight_per_meter * cable_length, 3);
  outputs.material_value = round(outputs.total_cable_weight * material_price_per_kg, 2);

  for (const key of ["weight_per_meter", "total_cable_weight", "material_value"]) {
    if (!isFiniteNumber(outputs[key])) {
      outputs[key] = 0;
      warnings.push(`Non-finite output corrected to zero for public-safe response: ${key}`);
    }
  }

  return {
    status: warnings.length > 0 ? "REVIEW" : "OK",
    outputs,
    warnings,
    outputKeys: ["weight_per_meter", "total_cable_weight", "material_value"],
    redaction_status: "PUBLIC_SAFE_REDACTED"
  };
}
