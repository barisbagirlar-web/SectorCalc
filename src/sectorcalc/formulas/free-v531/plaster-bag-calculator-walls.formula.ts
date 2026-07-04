import "server-only";

export type CalculationStatus = "OK" | "REVIEW" | "BLOCKED";
export type RedactionStatus = "PUBLIC_SAFE_REDACTED" | "REDACTION_NOT_REQUIRED" | "REDACTION_FAILED_BLOCKED";

export const toolKey = "plaster-bag-calculator-walls";
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
  for (const key of ["wall_area", "coat_thickness", "material_density", "bag_weight", "waste_allowance_percent"]) {
    if (!isFiniteNumber(inputs[key])) {
      warnings.push("Missing or non-finite input: " + key);
    }
  }

  // Compute formula outputs
    const val_wall_area = get(inputs, "wall_area");
    const val_coat_thickness = get(inputs, "coat_thickness");
    const val_material_density = get(inputs, "material_density");
    const val_bag_weight = get(inputs, "bag_weight");
    const val_waste_allowance_percent = get(inputs, "waste_allowance_percent");
    outputs["bag_count"] = round(val_wall_area * val_coat_thickness * val_material_density * val_bag_weight * val_waste_allowance_percent, 4);

  return {
    status: warnings.length > 0 ? "REVIEW" : "OK",
    outputs,
    warnings,
    outputKeys: ["wet_material_volume", "dry_mass_required", "bag_count"],
    redaction_status: "PUBLIC_SAFE_REDACTED",
  };
}
