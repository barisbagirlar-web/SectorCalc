import "server-only";

export type CalculationStatus = "OK" | "REVIEW" | "BLOCKED";
export type RedactionStatus = "PUBLIC_SAFE_REDACTED" | "REDACTION_NOT_REQUIRED" | "REDACTION_FAILED_BLOCKED";

export const toolKey = "compressor-air-demand-cfm";
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
  for (const key of ["tool_air_demand", "simultaneous_use_factor", "leakage_allowance_percent", "reserve_percent", "compressor_capacity"]) {
    if (!isFiniteNumber(inputs[key])) {
      warnings.push("Missing or non-finite input: " + key);
    }
  }

  // Compute formula outputs
    const val_tool_air_demand = get(inputs, "tool_air_demand");
    const val_simultaneous_use_factor = get(inputs, "simultaneous_use_factor");
    const val_leakage_allowance_percent = get(inputs, "leakage_allowance_percent");
    const val_reserve_percent = get(inputs, "reserve_percent");
    const val_compressor_capacity = get(inputs, "compressor_capacity");
    outputs["capacity_gap"] = round(val_tool_air_demand * val_simultaneous_use_factor * val_leakage_allowance_percent * val_reserve_percent * val_compressor_capacity, 4);

  return {
    status: warnings.length > 0 ? "REVIEW" : "OK",
    outputs,
    warnings,
    outputKeys: ["required_air_capacity", "capacity_gap", "leakage_air_demand"],
    redaction_status: "PUBLIC_SAFE_REDACTED",
  };
}
