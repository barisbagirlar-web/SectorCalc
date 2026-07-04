import "server-only";

export type CalculationStatus = "OK" | "REVIEW" | "BLOCKED";
export type RedactionStatus = "PUBLIC_SAFE_REDACTED" | "REDACTION_NOT_REQUIRED" | "REDACTION_FAILED_BLOCKED";

export const toolKey = "bolt-torque-spec-calculator";
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
  for (const key of ["nominal_diameter", "tensile_stress_area", "proof_strength", "preload_percent", "nut_factor"]) {
    if (!isFiniteNumber(inputs[key])) {
      warnings.push("Missing or non-finite input: " + key);
    }
  }

  // Compute formula outputs
    const val_nominal_diameter = get(inputs, "nominal_diameter");
    const val_tensile_stress_area = get(inputs, "tensile_stress_area");
    const val_proof_strength = get(inputs, "proof_strength");
    const val_preload_percent = get(inputs, "preload_percent");
    const val_nut_factor = get(inputs, "nut_factor");
    outputs["tightening_torque"] = round(val_nominal_diameter * val_tensile_stress_area * val_proof_strength * val_preload_percent * val_nut_factor, 4);

  return {
    status: warnings.length > 0 ? "REVIEW" : "OK",
    outputs,
    warnings,
    outputKeys: ["target_preload", "tightening_torque", "preload_utilization"],
    redaction_status: "PUBLIC_SAFE_REDACTED",
  };
}
