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

export const toolKey = "shop-daily-breakeven-hours";
export const formulaVersion = "1.0.0";
export const publicFormulaExpressionPolicy = "FORBIDDEN" as const;

/**
 * Server-only deterministic formula module for Shop Daily Breakeven Calculator.
 * Exact formula logic must remain server-side and must never be rendered in public UI, public schema, PDF export, JSON audit, or copy summary.
 */
export function calculate(inputs: Record<string, number>): CalculationResult {
  const warnings: string[] = [];
  const outputs: Record<string, number> = {};

  const fixed_cost_daily = get(inputs, "fixed_cost_daily");
  const base_labor_cost_daily = get(inputs, "base_labor_cost_daily");
  const utility_cost_daily = get(inputs, "utility_cost_daily");
  const billing_rate_per_hour = get(inputs, "billing_rate_per_hour");
  const variable_cost_per_billable_hour = get(inputs, "variable_cost_per_billable_hour");
  const target_profit_daily = get(inputs, "target_profit_daily");

  for (const key of ["fixed_cost_daily", "base_labor_cost_daily", "utility_cost_daily", "billing_rate_per_hour", "variable_cost_per_billable_hour", "target_profit_daily"]) {
    const value = inputs[key];
    if (!isFiniteNumber(value)) {
      warnings.push(`Missing or non-finite input: ${key}`);
    }
  }

  const contribution = Math.max(0.01, billing_rate_per_hour - variable_cost_per_billable_hour);
  const overhead = fixed_cost_daily + base_labor_cost_daily + utility_cost_daily;
  outputs.breakeven_billable_hours = round(overhead / contribution, 2);
  outputs.target_billable_hours = round((overhead + target_profit_daily) / contribution, 2);
  outputs.daily_revenue_gap = round(overhead, 2);

  for (const key of ["breakeven_billable_hours", "target_billable_hours", "daily_revenue_gap"]) {
    if (!isFiniteNumber(outputs[key])) {
      outputs[key] = 0;
      warnings.push(`Non-finite output corrected to zero for public-safe response: ${key}`);
    }
  }

  return {
    status: warnings.length > 0 ? "REVIEW" : "OK",
    outputs,
    warnings,
    outputKeys: ["breakeven_billable_hours", "target_billable_hours", "daily_revenue_gap"],
    redaction_status: "PUBLIC_SAFE_REDACTED"
  };
}
