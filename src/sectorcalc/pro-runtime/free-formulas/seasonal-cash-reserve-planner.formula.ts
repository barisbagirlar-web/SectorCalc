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

export const toolKey = "seasonal-cash-reserve-planner";
export const formulaVersion = "1.0.0";
export const publicFormulaExpressionPolicy = "FORBIDDEN" as const;

/**
 * Server-only deterministic formula module for Seasonal Cash Reserve Calculator.
 * Exact formula logic must remain server-side and must never be rendered in public UI, public schema, PDF export, JSON audit, or copy summary.
 */
export function calculate(inputs: Record<string, number>): CalculationResult {
  const warnings: string[] = [];
  const outputs: Record<string, number> = {};

  const fixed_monthly_cost = get(inputs, "fixed_monthly_cost");
  const minimum_variable_monthly_cost = get(inputs, "minimum_variable_monthly_cost");
  const slow_months = get(inputs, "slow_months");
  const expected_slow_month_revenue = get(inputs, "expected_slow_month_revenue");
  const monthly_debt_service = get(inputs, "monthly_debt_service");
  const safety_buffer_percent = get(inputs, "safety_buffer_percent");

  for (const key of ["fixed_monthly_cost", "minimum_variable_monthly_cost", "slow_months", "expected_slow_month_revenue", "monthly_debt_service", "safety_buffer_percent"]) {
    const value = inputs[key];
    if (!isFiniteNumber(value)) {
      warnings.push(`Missing or non-finite input: ${key}`);
    }
  }

  const monthlyNeed = fixed_monthly_cost + minimum_variable_monthly_cost + monthly_debt_service;
  const deficit = Math.max(0, monthlyNeed - expected_slow_month_revenue);
  outputs.monthly_cash_deficit = round(deficit, 2);
  outputs.required_cash_reserve = round(deficit * slow_months, 2);
  outputs.reserve_with_buffer = round(outputs.required_cash_reserve * (1 + safety_buffer_percent / 100), 2);

  for (const key of ["required_cash_reserve", "monthly_cash_deficit", "reserve_with_buffer"]) {
    if (!isFiniteNumber(outputs[key])) {
      outputs[key] = 0;
      warnings.push(`Non-finite output corrected to zero for public-safe response: ${key}`);
    }
  }

  return {
    status: warnings.length > 0 ? "REVIEW" : "OK",
    outputs,
    warnings,
    outputKeys: ["required_cash_reserve", "monthly_cash_deficit", "reserve_with_buffer"],
    redaction_status: "PUBLIC_SAFE_REDACTED"
  };
}
