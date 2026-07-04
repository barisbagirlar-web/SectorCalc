import "server-only";

export type CalculationStatus = "OK" | "REVIEW" | "BLOCKED";
export type RedactionStatus = "PUBLIC_SAFE_REDACTED" | "REDACTION_NOT_REQUIRED" | "REDACTION_FAILED_BLOCKED";

export const toolKey = "water-tank-capacity-household";
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
  for (const key of ["occupants", "daily_consumption_per_person", "autonomy_days", "reserve_percent", "peak_factor"]) {
    if (!isFiniteNumber(inputs[key])) {
      warnings.push("Missing or non-finite input: " + key);
    }
  }

  // Compute formula outputs
    const val_occupants = get(inputs, "occupants");
    const val_daily_consumption_per_person = get(inputs, "daily_consumption_per_person");
    const val_autonomy_days = get(inputs, "autonomy_days");
    const val_reserve_percent = get(inputs, "reserve_percent");
    const val_peak_factor = get(inputs, "peak_factor");
    outputs["recommended_tank_capacity"] = round(val_occupants * val_daily_consumption_per_person * val_autonomy_days * val_reserve_percent * val_peak_factor, 4);

  return {
    status: warnings.length > 0 ? "REVIEW" : "OK",
    outputs,
    warnings,
    outputKeys: ["base_storage_volume", "recommended_tank_capacity", "peak_day_volume"],
    redaction_status: "PUBLIC_SAFE_REDACTED",
  };
}
