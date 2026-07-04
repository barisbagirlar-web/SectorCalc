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

export const toolKey = "scrap-waste-monthly-cost";
export const formulaVersion = "1.0.0";
export const publicFormulaExpressionPolicy = "FORBIDDEN" as const;

/**
 * Server-only deterministic formula module for Monthly Scrap Waste Cost Calculator.
 * Exact formula logic must remain server-side and must never be rendered in public UI, public schema, PDF export, JSON audit, or copy summary.
 */
export function calculate(inputs: Record<string, number>): CalculationResult {
  const warnings: string[] = [];
  const outputs: Record<string, number> = {};

  const daily_scrap_mass = get(inputs, "daily_scrap_mass");
  const material_cost_per_kg = get(inputs, "material_cost_per_kg");
  const scrap_resale_value_per_kg = get(inputs, "scrap_resale_value_per_kg");
  const working_days_per_month = get(inputs, "working_days_per_month");
  const rework_hours_per_day = get(inputs, "rework_hours_per_day");
  const labor_rate_per_hour = get(inputs, "labor_rate_per_hour");

  for (const key of ["daily_scrap_mass", "material_cost_per_kg", "scrap_resale_value_per_kg", "working_days_per_month", "rework_hours_per_day", "labor_rate_per_hour"]) {
    const value = inputs[key];
    if (!isFiniteNumber(value)) {
      warnings.push(`Missing or non-finite input: ${key}`);
    }
  }

  const netLossPerKg = Math.max(0, material_cost_per_kg - scrap_resale_value_per_kg);
  outputs.monthly_material_loss = round(daily_scrap_mass * netLossPerKg * working_days_per_month, 2);
  outputs.monthly_rework_cost = round(rework_hours_per_day * labor_rate_per_hour * working_days_per_month, 2);
  outputs.total_monthly_scrap_loss = round(outputs.monthly_material_loss + outputs.monthly_rework_cost, 2);

  for (const key of ["monthly_material_loss", "monthly_rework_cost", "total_monthly_scrap_loss"]) {
    if (!isFiniteNumber(outputs[key])) {
      outputs[key] = 0;
      warnings.push(`Non-finite output corrected to zero for public-safe response: ${key}`);
    }
  }

  return {
    status: warnings.length > 0 ? "REVIEW" : "OK",
    outputs,
    warnings,
    outputKeys: ["monthly_material_loss", "monthly_rework_cost", "total_monthly_scrap_loss"],
    redaction_status: "PUBLIC_SAFE_REDACTED"
  };
}
