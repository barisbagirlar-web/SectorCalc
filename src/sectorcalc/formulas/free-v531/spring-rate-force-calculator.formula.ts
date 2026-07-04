import "server-only";

export type CalculationStatus = "OK" | "REVIEW" | "BLOCKED";
export type RedactionStatus = "PUBLIC_SAFE_REDACTED" | "REDACTION_NOT_REQUIRED" | "REDACTION_FAILED_BLOCKED";

export const toolKey = "spring-rate-force-calculator";
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
  for (const key of ["wire_diameter", "mean_coil_diameter", "active_coils", "shear_modulus", "deflection"]) {
    if (!isFiniteNumber(inputs[key])) {
      warnings.push("Missing or non-finite input: " + key);
    }
  }

  // Compute formula outputs
    const val_wire_diameter = get(inputs, "wire_diameter");
    const val_mean_coil_diameter = get(inputs, "mean_coil_diameter");
    const val_active_coils = get(inputs, "active_coils");
    const val_shear_modulus = get(inputs, "shear_modulus");
    const val_deflection = get(inputs, "deflection");
    outputs["spring_rate"] = round(val_wire_diameter * val_mean_coil_diameter * val_active_coils * val_shear_modulus * val_deflection, 4);

  return {
    status: warnings.length > 0 ? "REVIEW" : "OK",
    outputs,
    warnings,
    outputKeys: ["spring_rate", "spring_force", "spring_index"],
    redaction_status: "PUBLIC_SAFE_REDACTED",
  };
}
