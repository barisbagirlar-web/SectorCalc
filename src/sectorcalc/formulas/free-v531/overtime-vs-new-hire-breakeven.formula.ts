import "server-only";

export type CalculationStatus = "OK" | "REVIEW" | "BLOCKED";
export type RedactionStatus = "PUBLIC_SAFE_REDACTED" | "REDACTION_NOT_REQUIRED" | "REDACTION_FAILED_BLOCKED";

export const toolKey = "overtime-vs-new-hire-breakeven";
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
  for (const key of ["overtime_hours_per_week", "base_hourly_rate", "overtime_multiplier", "new_hire_weekly_fixed_cost", "new_hire_hourly_rate", "new_hire_productivity_percent", "training_cost_per_week"]) {
    if (!isFiniteNumber(inputs[key])) {
      warnings.push("Missing or non-finite input: " + key);
    }
  }

  // Compute formula outputs
    const val_overtime_hours_per_week = get(inputs, "overtime_hours_per_week");
    const val_base_hourly_rate = get(inputs, "base_hourly_rate");
    const val_overtime_multiplier = get(inputs, "overtime_multiplier");
    const val_new_hire_weekly_fixed_cost = get(inputs, "new_hire_weekly_fixed_cost");
    const val_new_hire_hourly_rate = get(inputs, "new_hire_hourly_rate");
    const val_new_hire_productivity_percent = get(inputs, "new_hire_productivity_percent");
    const val_training_cost_per_week = get(inputs, "training_cost_per_week");
    outputs["breakeven_overtime_hours"] = round(val_overtime_hours_per_week * val_base_hourly_rate * val_overtime_multiplier * val_new_hire_weekly_fixed_cost * val_new_hire_hourly_rate * val_new_hire_productivity_percent * val_training_cost_per_week, 4);

  return {
    status: warnings.length > 0 ? "REVIEW" : "OK",
    outputs,
    warnings,
    outputKeys: ["weekly_overtime_cost", "weekly_new_hire_cost", "breakeven_overtime_hours"],
    redaction_status: "PUBLIC_SAFE_REDACTED",
  };
}
