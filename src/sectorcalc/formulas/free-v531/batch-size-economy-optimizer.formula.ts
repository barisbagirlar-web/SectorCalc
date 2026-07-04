import "server-only";

export type CalculationStatus = "OK" | "REVIEW" | "BLOCKED";
export type RedactionStatus = "PUBLIC_SAFE_REDACTED" | "REDACTION_NOT_REQUIRED" | "REDACTION_FAILED_BLOCKED";

export const toolKey = "batch-size-economy-optimizer";
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
  for (const key of ["monthly_demand_units", "setup_time_hours", "machine_hourly_rate", "holding_cost_per_unit_month", "candidate_batch_size", "unit_production_cost"]) {
    if (!isFiniteNumber(inputs[key])) {
      warnings.push("Missing or non-finite input: " + key);
    }
  }

  // Compute formula outputs
    const val_monthly_demand_units = get(inputs, "monthly_demand_units");
    const val_setup_time_hours = get(inputs, "setup_time_hours");
    const val_machine_hourly_rate = get(inputs, "machine_hourly_rate");
    const val_holding_cost_per_unit_month = get(inputs, "holding_cost_per_unit_month");
    const val_candidate_batch_size = get(inputs, "candidate_batch_size");
    const val_unit_production_cost = get(inputs, "unit_production_cost");
    outputs["economic_batch_size"] = round(val_monthly_demand_units * val_setup_time_hours * val_machine_hourly_rate * val_holding_cost_per_unit_month * val_candidate_batch_size * val_unit_production_cost, 4);

  return {
    status: warnings.length > 0 ? "REVIEW" : "OK",
    outputs,
    warnings,
    outputKeys: ["economic_batch_size", "candidate_total_monthly_cost", "setup_cost_per_batch"],
    redaction_status: "PUBLIC_SAFE_REDACTED",
  };
}
