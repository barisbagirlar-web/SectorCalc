import "server-only";

export type CalculationStatus = "OK" | "REVIEW" | "BLOCKED";
export type RedactionStatus = "PUBLIC_SAFE_REDACTED" | "REDACTION_NOT_REQUIRED" | "REDACTION_FAILED_BLOCKED";

export const toolKey = "welding-amperage-thickness-chart";
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
  for (const key of ["plate_thickness", "wire_diameter", "joint_factor", "process_factor", "travel_speed", "weld_length"]) {
    if (!isFiniteNumber(inputs[key])) {
      warnings.push("Missing or non-finite input: " + key);
    }
  }

  // Compute formula outputs
    const val_plate_thickness = get(inputs, "plate_thickness");
    const val_wire_diameter = get(inputs, "wire_diameter");
    const val_joint_factor = get(inputs, "joint_factor");
    const val_process_factor = get(inputs, "process_factor");
    const val_travel_speed = get(inputs, "travel_speed");
    const val_weld_length = get(inputs, "weld_length");
    outputs["recommended_amperage"] = round(val_plate_thickness * val_wire_diameter * val_joint_factor * val_process_factor * val_travel_speed * val_weld_length, 4);

  return {
    status: warnings.length > 0 ? "REVIEW" : "OK",
    outputs,
    warnings,
    outputKeys: ["recommended_amperage", "recommended_voltage", "heat_input_index"],
    redaction_status: "PUBLIC_SAFE_REDACTED",
  };
}
