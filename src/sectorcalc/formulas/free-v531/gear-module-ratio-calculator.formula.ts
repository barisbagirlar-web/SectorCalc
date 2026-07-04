import "server-only";

export type CalculationStatus = "OK" | "REVIEW" | "BLOCKED";
export type RedactionStatus = "PUBLIC_SAFE_REDACTED" | "REDACTION_NOT_REQUIRED" | "REDACTION_FAILED_BLOCKED";

export const toolKey = "gear-module-ratio-calculator";
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
  for (const key of ["driver_teeth", "driven_teeth", "module", "input_speed", "input_torque", "mesh_efficiency_percent"]) {
    if (!isFiniteNumber(inputs[key])) {
      warnings.push("Missing or non-finite input: " + key);
    }
  }

  // Compute formula outputs
    const val_driver_teeth = get(inputs, "driver_teeth");
    const val_driven_teeth = get(inputs, "driven_teeth");
    const val_module = get(inputs, "module");
    const val_input_speed = get(inputs, "input_speed");
    const val_input_torque = get(inputs, "input_torque");
    const val_mesh_efficiency_percent = get(inputs, "mesh_efficiency_percent");
    outputs["gear_ratio"] = round(val_driver_teeth * val_driven_teeth * val_module * val_input_speed * val_input_torque * val_mesh_efficiency_percent, 4);

  return {
    status: warnings.length > 0 ? "REVIEW" : "OK",
    outputs,
    warnings,
    outputKeys: ["gear_ratio", "output_speed", "output_torque", "center_distance"],
    redaction_status: "PUBLIC_SAFE_REDACTED",
  };
}
