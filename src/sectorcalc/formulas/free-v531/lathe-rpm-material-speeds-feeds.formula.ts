import "server-only";

export type CalculationStatus = "OK" | "REVIEW" | "BLOCKED";
export type RedactionStatus = "PUBLIC_SAFE_REDACTED" | "REDACTION_NOT_REQUIRED" | "REDACTION_FAILED_BLOCKED";

export const toolKey = "lathe-rpm-material-speeds-feeds";
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
  for (const key of ["cutting_speed", "workpiece_diameter", "feed_per_rev", "depth_of_cut", "tool_factor"]) {
    if (!isFiniteNumber(inputs[key])) {
      warnings.push("Missing or non-finite input: " + key);
    }
  }

  // Compute formula outputs
    const val_cutting_speed = get(inputs, "cutting_speed");
    const val_workpiece_diameter = get(inputs, "workpiece_diameter");
    const val_feed_per_rev = get(inputs, "feed_per_rev");
    const val_depth_of_cut = get(inputs, "depth_of_cut");
    const val_tool_factor = get(inputs, "tool_factor");
    outputs["spindle_rpm"] = round(val_cutting_speed * val_workpiece_diameter * val_feed_per_rev * val_depth_of_cut * val_tool_factor, 4);

  return {
    status: warnings.length > 0 ? "REVIEW" : "OK",
    outputs,
    warnings,
    outputKeys: ["spindle_rpm", "feed_rate", "material_removal_index"],
    redaction_status: "PUBLIC_SAFE_REDACTED",
  };
}
