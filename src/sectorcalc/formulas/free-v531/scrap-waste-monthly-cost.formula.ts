import "server-only";

export type CalculationStatus = "OK" | "REVIEW" | "BLOCKED";
export type RedactionStatus = "PUBLIC_SAFE_REDACTED" | "REDACTION_NOT_REQUIRED" | "REDACTION_FAILED_BLOCKED";

export const toolKey = "scrap-waste-monthly-cost";
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
  for (const key of ["daily_scrap_mass", "material_cost_per_kg", "scrap_resale_value_per_kg", "working_days_per_month", "rework_hours_per_day", "labor_rate_per_hour"]) {
    if (!isFiniteNumber(inputs[key])) {
      warnings.push("Missing or non-finite input: " + key);
    }
  }

  // Compute formula outputs
    const val_daily_scrap_mass = get(inputs, "daily_scrap_mass");
    const val_material_cost_per_kg = get(inputs, "material_cost_per_kg");
    const val_scrap_resale_value_per_kg = get(inputs, "scrap_resale_value_per_kg");
    const val_working_days_per_month = get(inputs, "working_days_per_month");
    const val_rework_hours_per_day = get(inputs, "rework_hours_per_day");
    const val_labor_rate_per_hour = get(inputs, "labor_rate_per_hour");
    outputs["total_monthly_scrap_loss"] = round(val_daily_scrap_mass * val_material_cost_per_kg * val_scrap_resale_value_per_kg * val_working_days_per_month * val_rework_hours_per_day * val_labor_rate_per_hour, 4);

  return {
    status: warnings.length > 0 ? "REVIEW" : "OK",
    outputs,
    warnings,
    outputKeys: ["monthly_material_loss", "monthly_rework_cost", "total_monthly_scrap_loss"],
    redaction_status: "PUBLIC_SAFE_REDACTED",
  };
}
