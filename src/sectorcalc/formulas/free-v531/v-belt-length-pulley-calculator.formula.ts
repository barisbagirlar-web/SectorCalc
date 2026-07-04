import "server-only";

export type CalculationStatus = "OK" | "REVIEW" | "BLOCKED";
export type RedactionStatus = "PUBLIC_SAFE_REDACTED" | "REDACTION_NOT_REQUIRED" | "REDACTION_FAILED_BLOCKED";

export const toolKey = "v-belt-length-pulley-calculator";
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
  for (const key of ["center_distance", "large_pulley_diameter", "small_pulley_diameter", "tension_allowance_percent"]) {
    if (!isFiniteNumber(inputs[key])) {
      warnings.push("Missing or non-finite input: " + key);
    }
  }

  // Compute formula outputs
    const val_center_distance = get(inputs, "center_distance");
    const val_large_pulley_diameter = get(inputs, "large_pulley_diameter");
    const val_small_pulley_diameter = get(inputs, "small_pulley_diameter");
    const val_tension_allowance_percent = get(inputs, "tension_allowance_percent");
    outputs["adjusted_belt_length"] = round(val_center_distance * val_large_pulley_diameter * val_small_pulley_diameter * val_tension_allowance_percent, 4);

  return {
    status: warnings.length > 0 ? "REVIEW" : "OK",
    outputs,
    warnings,
    outputKeys: ["nominal_belt_length", "adjusted_belt_length", "diameter_ratio"],
    redaction_status: "PUBLIC_SAFE_REDACTED",
  };
}
