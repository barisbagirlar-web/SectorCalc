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

export const toolKey = "spring-rate-force-calculator";
export const formulaVersion = "1.0.0";
export const publicFormulaExpressionPolicy = "FORBIDDEN" as const;

/**
 * Server-only deterministic formula module for Spring Rate Force Calculator.
 * Exact formula logic must remain server-side and must never be rendered in public UI, public schema, PDF export, JSON audit, or copy summary.
 */
export function calculate(inputs: Record<string, number>): CalculationResult {
  const warnings: string[] = [];
  const outputs: Record<string, number> = {};

  const wire_diameter = get(inputs, "wire_diameter");
  const mean_coil_diameter = get(inputs, "mean_coil_diameter");
  const active_coils = get(inputs, "active_coils");
  const shear_modulus = get(inputs, "shear_modulus");
  const deflection = get(inputs, "deflection");

  for (const key of ["wire_diameter", "mean_coil_diameter", "active_coils", "shear_modulus", "deflection"]) {
    const value = inputs[key];
    if (!isFiniteNumber(value)) {
      warnings.push(`Missing or non-finite input: ${key}`);
    }
  }

  outputs.spring_rate = round((shear_modulus * Math.pow(wire_diameter, 4)) / (8 * Math.pow(mean_coil_diameter, 3) * Math.max(1, active_coils)), 3);
  outputs.spring_force = round(outputs.spring_rate * deflection, 2);
  outputs.spring_index = round(mean_coil_diameter / Math.max(0.01, wire_diameter), 2);

  for (const key of ["spring_rate", "spring_force", "spring_index"]) {
    if (!isFiniteNumber(outputs[key])) {
      outputs[key] = 0;
      warnings.push(`Non-finite output corrected to zero for public-safe response: ${key}`);
    }
  }

  return {
    status: warnings.length > 0 ? "REVIEW" : "OK",
    outputs,
    warnings,
    outputKeys: ["spring_rate", "spring_force", "spring_index"],
    redaction_status: "PUBLIC_SAFE_REDACTED"
  };
}
