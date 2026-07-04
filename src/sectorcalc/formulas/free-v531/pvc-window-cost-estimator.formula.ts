import "server-only";

export type CalculationStatus = "OK" | "REVIEW" | "BLOCKED";
export type RedactionStatus = "PUBLIC_SAFE_REDACTED" | "REDACTION_NOT_REQUIRED" | "REDACTION_FAILED_BLOCKED";

export const toolKey = "pvc-window-cost-estimator";
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
  for (const key of ["profile_cost", "glass_area", "glass_cost_per_m2", "hardware_cost", "labor_hours", "labor_rate_per_hour", "overhead_margin_percent"]) {
    if (!isFiniteNumber(inputs[key])) {
      warnings.push("Missing or non-finite input: " + key);
    }
  }

  // Compute formula outputs
    const val_profile_cost = get(inputs, "profile_cost");
    const val_glass_area = get(inputs, "glass_area");
    const val_glass_cost_per_m2 = get(inputs, "glass_cost_per_m2");
    const val_hardware_cost = get(inputs, "hardware_cost");
    const val_labor_hours = get(inputs, "labor_hours");
    const val_labor_rate_per_hour = get(inputs, "labor_rate_per_hour");
    const val_overhead_margin_percent = get(inputs, "overhead_margin_percent");
    outputs["quoted_window_price"] = round(val_profile_cost * val_glass_area * val_glass_cost_per_m2 * val_hardware_cost * val_labor_hours * val_labor_rate_per_hour * val_overhead_margin_percent, 4);

  return {
    status: warnings.length > 0 ? "REVIEW" : "OK",
    outputs,
    warnings,
    outputKeys: ["base_window_cost", "quoted_window_price", "labor_cost"],
    redaction_status: "PUBLIC_SAFE_REDACTED",
  };
}
