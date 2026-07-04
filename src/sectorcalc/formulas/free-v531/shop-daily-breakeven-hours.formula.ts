import "server-only";

export type CalculationStatus = "OK" | "REVIEW" | "BLOCKED";
export type RedactionStatus = "PUBLIC_SAFE_REDACTED" | "REDACTION_NOT_REQUIRED" | "REDACTION_FAILED_BLOCKED";

export const toolKey = "shop-daily-breakeven-hours";
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
  for (const key of ["fixed_cost_daily", "base_labor_cost_daily", "utility_cost_daily", "billing_rate_per_hour", "variable_cost_per_billable_hour", "target_profit_daily"]) {
    if (!isFiniteNumber(inputs[key])) {
      warnings.push("Missing or non-finite input: " + key);
    }
  }

  // Compute formula outputs
    const val_fixed_cost_daily = get(inputs, "fixed_cost_daily");
    const val_base_labor_cost_daily = get(inputs, "base_labor_cost_daily");
    const val_utility_cost_daily = get(inputs, "utility_cost_daily");
    const val_billing_rate_per_hour = get(inputs, "billing_rate_per_hour");
    const val_variable_cost_per_billable_hour = get(inputs, "variable_cost_per_billable_hour");
    const val_target_profit_daily = get(inputs, "target_profit_daily");
    outputs["breakeven_billable_hours"] = round(val_fixed_cost_daily * val_base_labor_cost_daily * val_utility_cost_daily * val_billing_rate_per_hour * val_variable_cost_per_billable_hour * val_target_profit_daily, 4);

  return {
    status: warnings.length > 0 ? "REVIEW" : "OK",
    outputs,
    warnings,
    outputKeys: ["breakeven_billable_hours", "target_billable_hours", "daily_revenue_gap"],
    redaction_status: "PUBLIC_SAFE_REDACTED",
  };
}
