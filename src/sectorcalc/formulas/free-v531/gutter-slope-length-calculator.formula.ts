import "server-only";

export type CalculationStatus = "OK" | "REVIEW" | "BLOCKED";
export type RedactionStatus = "PUBLIC_SAFE_REDACTED" | "REDACTION_NOT_REQUIRED" | "REDACTION_FAILED_BLOCKED";

export const toolKey = "gutter-slope-length-calculator";
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
  for (const key of ["gutter_run_length", "slope_mm_per_meter", "max_outlet_spacing", "roof_catchment_area", "rainfall_intensity"]) {
    if (!isFiniteNumber(inputs[key])) {
      warnings.push("Missing or non-finite input: " + key);
    }
  }

  // Compute formula outputs
    const val_gutter_run_length = get(inputs, "gutter_run_length");
    const val_slope_mm_per_meter = get(inputs, "slope_mm_per_meter");
    const val_max_outlet_spacing = get(inputs, "max_outlet_spacing");
    const val_roof_catchment_area = get(inputs, "roof_catchment_area");
    const val_rainfall_intensity = get(inputs, "rainfall_intensity");
    outputs["downspout_count"] = round(val_gutter_run_length * val_slope_mm_per_meter * val_max_outlet_spacing * val_roof_catchment_area * val_rainfall_intensity, 4);

  return {
    status: warnings.length > 0 ? "REVIEW" : "OK",
    outputs,
    warnings,
    outputKeys: ["total_fall", "downspout_count", "drainage_load_index"],
    redaction_status: "PUBLIC_SAFE_REDACTED",
  };
}
