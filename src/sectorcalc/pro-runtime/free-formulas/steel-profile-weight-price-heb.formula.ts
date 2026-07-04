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

export const toolKey = "steel-profile-weight-price-heb";
export const formulaVersion = "1.0.0";
export const publicFormulaExpressionPolicy = "FORBIDDEN" as const;

/**
 * Server-only deterministic formula module for Steel Profile Weight Price Calculator.
 * Exact formula logic must remain server-side and must never be rendered in public UI, public schema, PDF export, JSON audit, or copy summary.
 */
export function calculate(inputs: Record<string, number>): CalculationResult {
  const warnings: string[] = [];
  const outputs: Record<string, number> = {};

  const profile_length = get(inputs, "profile_length");
  const linear_mass = get(inputs, "linear_mass");
  const steel_price_per_kg = get(inputs, "steel_price_per_kg");
  const waste_allowance_percent = get(inputs, "waste_allowance_percent");
  const surcharge_percent = get(inputs, "surcharge_percent");

  for (const key of ["profile_length", "linear_mass", "steel_price_per_kg", "waste_allowance_percent", "surcharge_percent"]) {
    const value = inputs[key];
    if (!isFiniteNumber(value)) {
      warnings.push(`Missing or non-finite input: ${key}`);
    }
  }

  outputs.profile_weight = round(profile_length * linear_mass, 3);
  outputs.chargeable_weight = round(outputs.profile_weight * (1 + waste_allowance_percent / 100), 3);
  outputs.profile_material_cost = round(outputs.chargeable_weight * steel_price_per_kg * (1 + surcharge_percent / 100), 2);

  for (const key of ["profile_weight", "chargeable_weight", "profile_material_cost"]) {
    if (!isFiniteNumber(outputs[key])) {
      outputs[key] = 0;
      warnings.push(`Non-finite output corrected to zero for public-safe response: ${key}`);
    }
  }

  return {
    status: warnings.length > 0 ? "REVIEW" : "OK",
    outputs,
    warnings,
    outputKeys: ["profile_weight", "chargeable_weight", "profile_material_cost"],
    redaction_status: "PUBLIC_SAFE_REDACTED"
  };
}
