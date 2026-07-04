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

export const toolKey = "generator-fuel-consumption-cost";
export const formulaVersion = "1.0.0";
export const publicFormulaExpressionPolicy = "FORBIDDEN" as const;

/**
 * Server-only deterministic formula module for Generator Fuel Consumption Calculator.
 * Exact formula logic must remain server-side and must never be rendered in public UI, public schema, PDF export, JSON audit, or copy summary.
 */
export function calculate(inputs: Record<string, number>): CalculationResult {
  const warnings: string[] = [];
  const outputs: Record<string, number> = {};

  const rated_power = get(inputs, "rated_power");
  const load_percent = get(inputs, "load_percent");
  const specific_fuel_consumption = get(inputs, "specific_fuel_consumption");
  const fuel_price_per_liter = get(inputs, "fuel_price_per_liter");
  const operating_hours = get(inputs, "operating_hours");

  for (const key of ["rated_power", "load_percent", "specific_fuel_consumption", "fuel_price_per_liter", "operating_hours"]) {
    const value = inputs[key];
    if (!isFiniteNumber(value)) {
      warnings.push(`Missing or non-finite input: ${key}`);
    }
  }

  const outputPower = rated_power * load_percent / 100;
  outputs.fuel_consumption_per_hour = round(outputPower * specific_fuel_consumption, 3);
  outputs.fuel_cost_per_hour = round(outputs.fuel_consumption_per_hour * fuel_price_per_liter, 2);
  outputs.total_fuel_cost = round(outputs.fuel_cost_per_hour * operating_hours, 2);

  for (const key of ["fuel_consumption_per_hour", "fuel_cost_per_hour", "total_fuel_cost"]) {
    if (!isFiniteNumber(outputs[key])) {
      outputs[key] = 0;
      warnings.push(`Non-finite output corrected to zero for public-safe response: ${key}`);
    }
  }

  return {
    status: warnings.length > 0 ? "REVIEW" : "OK",
    outputs,
    warnings,
    outputKeys: ["fuel_consumption_per_hour", "fuel_cost_per_hour", "total_fuel_cost"],
    redaction_status: "PUBLIC_SAFE_REDACTED"
  };
}
