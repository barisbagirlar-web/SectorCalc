import "server-only";

export type CalculationStatus = "OK" | "REVIEW" | "BLOCKED";
export type RedactionStatus = "PUBLIC_SAFE_REDACTED" | "REDACTION_NOT_REQUIRED" | "REDACTION_FAILED_BLOCKED";

export const toolKey = "seasonal-cash-reserve-planner";
export const formulaVersion = "1.0.0";

function isFiniteNumber(v: unknown): v is number {
  return typeof v === "number" && Number.isFinite(v);
}

function get(inputs: Record<string, number>, key: string): number {
  const v = inputs[key];
  return isFiniteNumber(v) ? v : 0;
}

function round(v: number, d: number): number {
  if (!isFiniteNumber(v)) return 0;
  const f = Math.pow(10, d);
  return Math.round(v * f) / f;
}

export function calculate(inputs: Record<string, number>): {
  status: CalculationStatus;
  outputs: Record<string, number>;
  warnings: string[];
  outputKeys: string[];
  redaction_status: RedactionStatus;
} {
  const warnings: string[] = [];
  const outputs: Record<string, number> = {};

  // Validate required inputs
  for (const key of ["fixed_monthly_cost", "minimum_variable_monthly_cost", "slow_months", "expected_slow_month_revenue", "monthly_debt_service", "safety_buffer_percent"]) {
    if (!isFiniteNumber(inputs[key])) {
      warnings.push("Missing or non-finite input: " + key);
    }
  }

  // Compute formula outputs
    const val_fixed_monthly_cost = get(inputs, "fixed_monthly_cost");
    const val_minimum_variable_monthly_cost = get(inputs, "minimum_variable_monthly_cost");
    const val_slow_months = get(inputs, "slow_months");
    const val_expected_slow_month_revenue = get(inputs, "expected_slow_month_revenue");
    const val_monthly_debt_service = get(inputs, "monthly_debt_service");
    const val_safety_buffer_percent = get(inputs, "safety_buffer_percent");
    outputs["reserve_with_buffer"] = round(val_fixed_monthly_cost * val_minimum_variable_monthly_cost * val_slow_months * val_expected_slow_month_revenue * val_monthly_debt_service * val_safety_buffer_percent, 4);

  return {
    status: warnings.length > 0 ? "REVIEW" : "OK",
    outputs,
    warnings,
    outputKeys: ["required_cash_reserve", "monthly_cash_deficit", "reserve_with_buffer"],
    redaction_status: "PUBLIC_SAFE_REDACTED",
  };
}
