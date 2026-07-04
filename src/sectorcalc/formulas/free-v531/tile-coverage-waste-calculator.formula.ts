import "server-only";

export type CalculationStatus = "OK" | "REVIEW" | "BLOCKED";
export type RedactionStatus = "PUBLIC_SAFE_REDACTED" | "REDACTION_NOT_REQUIRED" | "REDACTION_FAILED_BLOCKED";

export const toolKey = "tile-coverage-waste-calculator";
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
  for (const key of ["floor_area", "tile_area", "box_coverage", "pattern_waste_percent", "breakage_allowance_percent"]) {
    if (!isFiniteNumber(inputs[key])) {
      warnings.push("Missing or non-finite input: " + key);
    }
  }

  // Compute formula outputs
    const val_floor_area = get(inputs, "floor_area");
    const val_tile_area = get(inputs, "tile_area");
    const val_box_coverage = get(inputs, "box_coverage");
    const val_pattern_waste_percent = get(inputs, "pattern_waste_percent");
    const val_breakage_allowance_percent = get(inputs, "breakage_allowance_percent");
    outputs["boxes_required"] = round(val_floor_area * val_tile_area * val_box_coverage * val_pattern_waste_percent * val_breakage_allowance_percent, 4);

  return {
    status: warnings.length > 0 ? "REVIEW" : "OK",
    outputs,
    warnings,
    outputKeys: ["tiles_required", "boxes_required", "waste_area"],
    redaction_status: "PUBLIC_SAFE_REDACTED",
  };
}
