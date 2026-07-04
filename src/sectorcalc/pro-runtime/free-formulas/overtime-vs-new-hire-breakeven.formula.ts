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

export const toolKey = "overtime-vs-new-hire-breakeven";
export const formulaVersion = "1.0.0";
export const publicFormulaExpressionPolicy = "FORBIDDEN" as const;

/**
 * Server-only deterministic formula module for Overtime vs New Hire Breakeven Calculator.
 * Exact formula logic must remain server-side and must never be rendered in public UI, public schema, PDF export, JSON audit, or copy summary.
 */
export function calculate(inputs: Record<string, number>): CalculationResult {
  const warnings: string[] = [];
  const outputs: Record<string, number> = {};

  const overtime_hours_per_week = get(inputs, "overtime_hours_per_week");
  const base_hourly_rate = get(inputs, "base_hourly_rate");
  const overtime_multiplier = get(inputs, "overtime_multiplier");
  const new_hire_weekly_fixed_cost = get(inputs, "new_hire_weekly_fixed_cost");
  const new_hire_hourly_rate = get(inputs, "new_hire_hourly_rate");
  const new_hire_productivity_percent = get(inputs, "new_hire_productivity_percent");
  const training_cost_per_week = get(inputs, "training_cost_per_week");

  for (const key of ["overtime_hours_per_week", "base_hourly_rate", "overtime_multiplier", "new_hire_weekly_fixed_cost", "new_hire_hourly_rate", "new_hire_productivity_percent", "training_cost_per_week"]) {
    const value = inputs[key];
    if (!isFiniteNumber(value)) {
      warnings.push(`Missing or non-finite input: ${key}`);
    }
  }

  outputs.weekly_overtime_cost = round(overtime_hours_per_week * base_hourly_rate * overtime_multiplier, 2);
  const effectiveNewHireRate = new_hire_hourly_rate / Math.max(0.01, new_hire_productivity_percent / 100);
  outputs.weekly_new_hire_cost = round(new_hire_weekly_fixed_cost + training_cost_per_week + overtime_hours_per_week * effectiveNewHireRate, 2);
  outputs.breakeven_overtime_hours = round((new_hire_weekly_fixed_cost + training_cost_per_week) / Math.max(0.01, base_hourly_rate * overtime_multiplier - effectiveNewHireRate), 2);

  for (const key of ["weekly_overtime_cost", "weekly_new_hire_cost", "breakeven_overtime_hours"]) {
    if (!isFiniteNumber(outputs[key])) {
      outputs[key] = 0;
      warnings.push(`Non-finite output corrected to zero for public-safe response: ${key}`);
    }
  }

  return {
    status: warnings.length > 0 ? "REVIEW" : "OK",
    outputs,
    warnings,
    outputKeys: ["weekly_overtime_cost", "weekly_new_hire_cost", "breakeven_overtime_hours"],
    redaction_status: "PUBLIC_SAFE_REDACTED"
  };
}
