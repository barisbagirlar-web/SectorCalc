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

export const toolKey = "service-vehicle-km-total-cost";
export const formulaVersion = "1.0.0";
export const publicFormulaExpressionPolicy = "FORBIDDEN" as const;

/**
 * Server-only deterministic formula module for Service Vehicle Km Cost Calculator.
 * Exact formula logic must remain server-side and must never be rendered in public UI, public schema, PDF export, JSON audit, or copy summary.
 */
export function calculate(inputs: Record<string, number>): CalculationResult {
  const warnings: string[] = [];
  const outputs: Record<string, number> = {};

  const fuel_consumption_l_per_100km = get(inputs, "fuel_consumption_l_per_100km");
  const fuel_price_per_liter = get(inputs, "fuel_price_per_liter");
  const maintenance_cost_per_km = get(inputs, "maintenance_cost_per_km");
  const tire_cost_per_km = get(inputs, "tire_cost_per_km");
  const depreciation_cost_per_km = get(inputs, "depreciation_cost_per_km");
  const monthly_insurance = get(inputs, "monthly_insurance");
  const monthly_distance_km = get(inputs, "monthly_distance_km");

  for (const key of ["fuel_consumption_l_per_100km", "fuel_price_per_liter", "maintenance_cost_per_km", "tire_cost_per_km", "depreciation_cost_per_km", "monthly_insurance", "monthly_distance_km"]) {
    const value = inputs[key];
    if (!isFiniteNumber(value)) {
      warnings.push(`Missing or non-finite input: ${key}`);
    }
  }

  outputs.fuel_cost_per_km = round(fuel_consumption_l_per_100km / 100 * fuel_price_per_liter, 3);
  const insurancePerKm = monthly_insurance / Math.max(1, monthly_distance_km);
  outputs.fully_loaded_cost_per_km = round(outputs.fuel_cost_per_km + maintenance_cost_per_km + tire_cost_per_km + depreciation_cost_per_km + insurancePerKm, 3);
  outputs.monthly_vehicle_cost = round(outputs.fully_loaded_cost_per_km * monthly_distance_km, 2);

  for (const key of ["fuel_cost_per_km", "fully_loaded_cost_per_km", "monthly_vehicle_cost"]) {
    if (!isFiniteNumber(outputs[key])) {
      outputs[key] = 0;
      warnings.push(`Non-finite output corrected to zero for public-safe response: ${key}`);
    }
  }

  return {
    status: warnings.length > 0 ? "REVIEW" : "OK",
    outputs,
    warnings,
    outputKeys: ["fuel_cost_per_km", "fully_loaded_cost_per_km", "monthly_vehicle_cost"],
    redaction_status: "PUBLIC_SAFE_REDACTED"
  };
}
