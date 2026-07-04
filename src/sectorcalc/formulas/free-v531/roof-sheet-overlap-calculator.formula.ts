import "server-only";

export type CalculationStatus = "OK" | "REVIEW" | "BLOCKED";
export type RedactionStatus = "PUBLIC_SAFE_REDACTED" | "REDACTION_NOT_REQUIRED" | "REDACTION_FAILED_BLOCKED";

export const toolKey = "roof-sheet-overlap-calculator";
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
  for (const key of ["roof_length", "roof_width", "sheet_length", "sheet_width", "side_lap", "end_lap", "waste_allowance_percent", "screws_per_sheet"]) {
    if (!isFiniteNumber(inputs[key])) {
      warnings.push("Missing or non-finite input: " + key);
    }
  }

  // Compute formula outputs
    const val_roof_length = get(inputs, "roof_length");
    const val_roof_width = get(inputs, "roof_width");
    const val_sheet_length = get(inputs, "sheet_length");
    const val_sheet_width = get(inputs, "sheet_width");
    const val_side_lap = get(inputs, "side_lap");
    const val_end_lap = get(inputs, "end_lap");
    const val_waste_allowance_percent = get(inputs, "waste_allowance_percent");
    const val_screws_per_sheet = get(inputs, "screws_per_sheet");
    outputs["sheet_count"] = round(val_roof_length * val_roof_width * val_sheet_length * val_sheet_width * val_side_lap * val_end_lap * val_waste_allowance_percent * val_screws_per_sheet, 4);

  return {
    status: warnings.length > 0 ? "REVIEW" : "OK",
    outputs,
    warnings,
    outputKeys: ["effective_sheet_area", "sheet_count", "screw_count"],
    redaction_status: "PUBLIC_SAFE_REDACTED",
  };
}
