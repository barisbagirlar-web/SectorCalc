import "server-only";

export type CalculationStatus = "OK" | "REVIEW" | "BLOCKED";
export type RedactionStatus = "PUBLIC_SAFE_REDACTED" | "REDACTION_NOT_REQUIRED" | "REDACTION_FAILED_BLOCKED";

export const toolKey = "true-hourly-labor-cost-burden";
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
  for (const key of ["base_wage_per_hour", "employer_tax_percent", "benefits_per_day", "meal_allowance_per_day", "paid_hours_per_day", "billable_utilization_percent", "idle_time_percent"]) {
    if (!isFiniteNumber(inputs[key])) {
      warnings.push("Missing or non-finite input: " + key);
    }
  }

  // Compute formula outputs
    const val_base_wage_per_hour = get(inputs, "base_wage_per_hour");
    const val_employer_tax_percent = get(inputs, "employer_tax_percent");
    const val_benefits_per_day = get(inputs, "benefits_per_day");
    const val_meal_allowance_per_day = get(inputs, "meal_allowance_per_day");
    const val_paid_hours_per_day = get(inputs, "paid_hours_per_day");
    const val_billable_utilization_percent = get(inputs, "billable_utilization_percent");
    const val_idle_time_percent = get(inputs, "idle_time_percent");
    outputs["billable_hour_recovery_rate"] = round(val_base_wage_per_hour * val_employer_tax_percent * val_benefits_per_day * val_meal_allowance_per_day * val_paid_hours_per_day * val_billable_utilization_percent * val_idle_time_percent, 4);

  return {
    status: warnings.length > 0 ? "REVIEW" : "OK",
    outputs,
    warnings,
    outputKeys: ["fully_burdened_hourly_cost", "billable_hour_recovery_rate", "idle_time_cost_per_day"],
    redaction_status: "PUBLIC_SAFE_REDACTED",
  };
}
