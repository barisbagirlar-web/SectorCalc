import "server-only";

export type CalculationStatus = "OK" | "REVIEW" | "BLOCKED";
export type RedactionStatus = "PUBLIC_SAFE_REDACTED" | "REDACTION_NOT_REQUIRED" | "REDACTION_FAILED_BLOCKED";

export const toolKey = "milling-feed-rate-calculator";
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
  for (const key of ["spindle_rpm", "flute_count", "chip_load", "radial_width_of_cut", "axial_depth_of_cut"]) {
    if (!isFiniteNumber(inputs[key])) {
      warnings.push("Missing or non-finite input: " + key);
    }
  }

  // Compute formula outputs
    const val_spindle_rpm = get(inputs, "spindle_rpm");
    const val_flute_count = get(inputs, "flute_count");
    const val_chip_load = get(inputs, "chip_load");
    const val_radial_width_of_cut = get(inputs, "radial_width_of_cut");
    const val_axial_depth_of_cut = get(inputs, "axial_depth_of_cut");
    outputs["table_feed_rate"] = round(val_spindle_rpm * val_flute_count * val_chip_load * val_radial_width_of_cut * val_axial_depth_of_cut, 4);

  return {
    status: warnings.length > 0 ? "REVIEW" : "OK",
    outputs,
    warnings,
    outputKeys: ["table_feed_rate", "material_removal_rate", "chip_load_status_index"],
    redaction_status: "PUBLIC_SAFE_REDACTED",
  };
}
