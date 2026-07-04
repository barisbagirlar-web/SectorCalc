import "server-only";

export type CalculationStatus = "OK" | "REVIEW" | "BLOCKED";
export type RedactionStatus = "PUBLIC_SAFE_REDACTED" | "REDACTION_NOT_REQUIRED" | "REDACTION_FAILED_BLOCKED";

export const toolKey = "hydraulic-press-tonnage-calculator";
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
  for (const key of ["material_strength", "plate_thickness", "bend_length", "die_opening", "safety_factor"]) {
    if (!isFiniteNumber(inputs[key])) {
      warnings.push("Missing or non-finite input: " + key);
    }
  }

  // Compute formula outputs
    const val_material_strength = get(inputs, "material_strength");
    const val_plate_thickness = get(inputs, "plate_thickness");
    const val_bend_length = get(inputs, "bend_length");
    const val_die_opening = get(inputs, "die_opening");
    const val_safety_factor = get(inputs, "safety_factor");
    outputs["required_tonnage"] = round(val_material_strength * val_plate_thickness * val_bend_length * val_die_opening * val_safety_factor, 4);

  return {
    status: warnings.length > 0 ? "REVIEW" : "OK",
    outputs,
    warnings,
    outputKeys: ["required_press_force", "required_tonnage", "die_opening_ratio"],
    redaction_status: "PUBLIC_SAFE_REDACTED",
  };
}
