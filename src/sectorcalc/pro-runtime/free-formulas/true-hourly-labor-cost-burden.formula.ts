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

export const toolKey = "true-hourly-labor-cost-burden";
export const formulaVersion = "1.0.0";
export const publicFormulaExpressionPolicy = "FORBIDDEN" as const;

/**
 * Server-only deterministic formula module for True Hourly Labor Cost Calculator.
 * Exact formula logic must remain server-side and must never be rendered in public UI, public schema, PDF export, JSON audit, or copy summary.
 */
export function calculate(inputs: Record<string, number>): CalculationResult {
  const warnings: string[] = [];
  const outputs: Record<string, number> = {};

  const base_wage_per_hour = get(inputs, "base_wage_per_hour");
  const employer_tax_percent = get(inputs, "employer_tax_percent");
  const benefits_per_day = get(inputs, "benefits_per_day");
  const meal_allowance_per_day = get(inputs, "meal_allowance_per_day");
  const paid_hours_per_day = get(inputs, "paid_hours_per_day");
  const billable_utilization_percent = get(inputs, "billable_utilization_percent");
  const idle_time_percent = get(inputs, "idle_time_percent");

  for (const key of ["base_wage_per_hour", "employer_tax_percent", "benefits_per_day", "meal_allowance_per_day", "paid_hours_per_day", "billable_utilization_percent", "idle_time_percent"]) {
    const value = inputs[key];
    if (!isFiniteNumber(value)) {
      warnings.push(`Missing or non-finite input: ${key}`);
    }
  }

  const dailyWage = base_wage_per_hour * paid_hours_per_day;
  const taxCost = dailyWage * employer_tax_percent / 100;
  const dailyCost = dailyWage + taxCost + benefits_per_day + meal_allowance_per_day;
  const billableHours = paid_hours_per_day * Math.max(0.01, billable_utilization_percent / 100);
  outputs.fully_burdened_hourly_cost = round(dailyCost / Math.max(0.01, paid_hours_per_day), 2);
  outputs.billable_hour_recovery_rate = round(dailyCost / Math.max(0.01, billableHours), 2);
  outputs.idle_time_cost_per_day = round(dailyCost * idle_time_percent / 100, 2);

  for (const key of ["fully_burdened_hourly_cost", "billable_hour_recovery_rate", "idle_time_cost_per_day"]) {
    if (!isFiniteNumber(outputs[key])) {
      outputs[key] = 0;
      warnings.push(`Non-finite output corrected to zero for public-safe response: ${key}`);
    }
  }

  return {
    status: warnings.length > 0 ? "REVIEW" : "OK",
    outputs,
    warnings,
    outputKeys: ["fully_burdened_hourly_cost", "billable_hour_recovery_rate", "idle_time_cost_per_day"],
    redaction_status: "PUBLIC_SAFE_REDACTED"
  };
}
