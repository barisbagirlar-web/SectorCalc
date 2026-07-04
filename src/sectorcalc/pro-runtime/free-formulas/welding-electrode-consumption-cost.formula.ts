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

export const toolKey = "welding-electrode-consumption-cost";
export const formulaVersion = "1.0.0";
export const publicFormulaExpressionPolicy = "FORBIDDEN" as const;

/**
 * Server-only deterministic formula module for Welding Electrode Consumption Calculator.
 * Exact formula logic must remain server-side and must never be rendered in public UI, public schema, PDF export, JSON audit, or copy summary.
 */
export function calculate(inputs: Record<string, number>): CalculationResult {
  const warnings: string[] = [];
  const outputs: Record<string, number> = {};

  const weld_length = get(inputs, "weld_length");
  const deposition_kg_per_meter = get(inputs, "deposition_kg_per_meter");
  const electrode_efficiency_percent = get(inputs, "electrode_efficiency_percent");
  const electrode_price_per_kg = get(inputs, "electrode_price_per_kg");
  const shielding_gas_cost_per_meter = get(inputs, "shielding_gas_cost_per_meter");
  const labor_minutes_per_meter = get(inputs, "labor_minutes_per_meter");
  const labor_rate_per_hour = get(inputs, "labor_rate_per_hour");

  for (const key of ["weld_length", "deposition_kg_per_meter", "electrode_efficiency_percent", "electrode_price_per_kg", "shielding_gas_cost_per_meter", "labor_minutes_per_meter", "labor_rate_per_hour"]) {
    const value = inputs[key];
    if (!isFiniteNumber(value)) {
      warnings.push(`Missing or non-finite input: ${key}`);
    }
  }

  outputs.electrode_mass_required = round(weld_length * deposition_kg_per_meter / Math.max(0.01, electrode_efficiency_percent / 100), 3);
  const laborCost = weld_length * labor_minutes_per_meter / 60 * labor_rate_per_hour;
  outputs.material_cost = round(outputs.electrode_mass_required * electrode_price_per_kg + weld_length * shielding_gas_cost_per_meter, 2);
  outputs.cost_per_meter = round((outputs.material_cost + laborCost) / Math.max(0.01, weld_length), 2);

  for (const key of ["electrode_mass_required", "material_cost", "cost_per_meter"]) {
    if (!isFiniteNumber(outputs[key])) {
      outputs[key] = 0;
      warnings.push(`Non-finite output corrected to zero for public-safe response: ${key}`);
    }
  }

  return {
    status: warnings.length > 0 ? "REVIEW" : "OK",
    outputs,
    warnings,
    outputKeys: ["electrode_mass_required", "material_cost", "cost_per_meter"],
    redaction_status: "PUBLIC_SAFE_REDACTED"
  };
}
