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

export const toolKey = "solder-consumption-calculator";
export const formulaVersion = "1.0.0";
export const publicFormulaExpressionPolicy = "FORBIDDEN" as const;

/**
 * Server-only deterministic formula module for Solder Consumption Calculator.
 * Exact formula logic must remain server-side and must never be rendered in public UI, public schema, PDF export, JSON audit, or copy summary.
 */
export function calculate(inputs: Record<string, number>): CalculationResult {
  const warnings: string[] = [];
  const outputs: Record<string, number> = {};

  const joint_count = get(inputs, "joint_count");
  const solder_per_joint = get(inputs, "solder_per_joint");
  const scrap_allowance_percent = get(inputs, "scrap_allowance_percent");
  const solder_price_per_kg = get(inputs, "solder_price_per_kg");
  const flux_cost_per_batch = get(inputs, "flux_cost_per_batch");

  for (const key of ["joint_count", "solder_per_joint", "scrap_allowance_percent", "solder_price_per_kg", "flux_cost_per_batch"]) {
    const value = inputs[key];
    if (!isFiniteNumber(value)) {
      warnings.push(`Missing or non-finite input: ${key}`);
    }
  }

  outputs.solder_mass_required = round(joint_count * solder_per_joint * (1 + scrap_allowance_percent / 100), 2);
  outputs.solder_cost = round(outputs.solder_mass_required / 1000 * solder_price_per_kg, 2);
  outputs.batch_consumable_cost = round(outputs.solder_cost + flux_cost_per_batch, 2);

  for (const key of ["solder_mass_required", "solder_cost", "batch_consumable_cost"]) {
    if (!isFiniteNumber(outputs[key])) {
      outputs[key] = 0;
      warnings.push(`Non-finite output corrected to zero for public-safe response: ${key}`);
    }
  }

  return {
    status: warnings.length > 0 ? "REVIEW" : "OK",
    outputs,
    warnings,
    outputKeys: ["solder_mass_required", "solder_cost", "batch_consumable_cost"],
    redaction_status: "PUBLIC_SAFE_REDACTED"
  };
}
