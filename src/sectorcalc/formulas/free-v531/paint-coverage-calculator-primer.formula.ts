import "server-only";

export type CalculationStatus = "OK" | "REVIEW" | "BLOCKED";
export type RedactionStatus = "PUBLIC_SAFE_REDACTED" | "REDACTION_NOT_REQUIRED" | "REDACTION_FAILED_BLOCKED";

export const toolKey = "paint-coverage-calculator-primer";
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
  for (const key of ["surface_area", "coat_count", "coverage_per_liter", "porosity_factor", "waste_allowance_percent"]) {
    if (!isFiniteNumber(inputs[key])) {
      warnings.push("Missing or non-finite input: " + key);
    }
  }

  // Compute formula outputs
    const val_surface_area = get(inputs, "surface_area");
    const val_coat_count = get(inputs, "coat_count");
    const val_coverage_per_liter = get(inputs, "coverage_per_liter");
    const val_porosity_factor = get(inputs, "porosity_factor");
    const val_waste_allowance_percent = get(inputs, "waste_allowance_percent");
    outputs["total_coating_liters"] = round(val_surface_area * val_coat_count * val_coverage_per_liter * val_porosity_factor * val_waste_allowance_percent, 4);

  return {
    status: warnings.length > 0 ? "REVIEW" : "OK",
    outputs,
    warnings,
    outputKeys: ["paint_liters_required", "primer_liters_required", "total_coating_liters"],
    redaction_status: "PUBLIC_SAFE_REDACTED",
  };
}
