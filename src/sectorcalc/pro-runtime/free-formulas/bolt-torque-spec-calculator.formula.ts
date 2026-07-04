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

export const toolKey = "bolt-torque-spec-calculator";
export const formulaVersion = "1.0.0";
export const publicFormulaExpressionPolicy = "FORBIDDEN" as const;

/**
 * Server-only deterministic formula module for Bolt Torque Spec Calculator.
 * Exact formula logic must remain server-side and must never be rendered in public UI, public schema, PDF export, JSON audit, or copy summary.
 */
export function calculate(inputs: Record<string, number>): CalculationResult {
  const warnings: string[] = [];
  const outputs: Record<string, number> = {};

  const nominal_diameter = get(inputs, "nominal_diameter");
  const tensile_stress_area = get(inputs, "tensile_stress_area");
  const proof_strength = get(inputs, "proof_strength");
  const preload_percent = get(inputs, "preload_percent");
  const nut_factor = get(inputs, "nut_factor");

  for (const key of ["nominal_diameter", "tensile_stress_area", "proof_strength", "preload_percent", "nut_factor"]) {
    const value = inputs[key];
    if (!isFiniteNumber(value)) {
      warnings.push(`Missing or non-finite input: ${key}`);
    }
  }

  outputs.target_preload = round(tensile_stress_area * 1000000 * proof_strength * preload_percent / 100, 2);
  outputs.tightening_torque = round(nut_factor * outputs.target_preload * nominal_diameter / 1000, 2);
  outputs.preload_utilization = round(preload_percent, 2);

  for (const key of ["target_preload", "tightening_torque", "preload_utilization"]) {
    if (!isFiniteNumber(outputs[key])) {
      outputs[key] = 0;
      warnings.push(`Non-finite output corrected to zero for public-safe response: ${key}`);
    }
  }

  return {
    status: warnings.length > 0 ? "REVIEW" : "OK",
    outputs,
    warnings,
    outputKeys: ["target_preload", "tightening_torque", "preload_utilization"],
    redaction_status: "PUBLIC_SAFE_REDACTED"
  };
}
