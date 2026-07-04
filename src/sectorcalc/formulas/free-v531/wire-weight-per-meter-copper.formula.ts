import "server-only";

export type CalculationStatus = "OK" | "REVIEW" | "BLOCKED";
export type RedactionStatus = "PUBLIC_SAFE_REDACTED" | "REDACTION_NOT_REQUIRED" | "REDACTION_FAILED_BLOCKED";

export const toolKey = "wire-weight-per-meter-copper";
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
  for (const key of ["cross_section_area", "cable_length", "conductor_density", "conductor_count", "material_price_per_kg"]) {
    if (!isFiniteNumber(inputs[key])) {
      warnings.push("Missing or non-finite input: " + key);
    }
  }

  // Compute formula outputs
    const val_cross_section_area = get(inputs, "cross_section_area");
    const val_cable_length = get(inputs, "cable_length");
    const val_conductor_density = get(inputs, "conductor_density");
    const val_conductor_count = get(inputs, "conductor_count");
    const val_material_price_per_kg = get(inputs, "material_price_per_kg");
    outputs["total_cable_weight"] = round(val_cross_section_area * val_cable_length * val_conductor_density * val_conductor_count * val_material_price_per_kg, 4);

  return {
    status: warnings.length > 0 ? "REVIEW" : "OK",
    outputs,
    warnings,
    outputKeys: ["weight_per_meter", "total_cable_weight", "material_value"],
    redaction_status: "PUBLIC_SAFE_REDACTED",
  };
}
