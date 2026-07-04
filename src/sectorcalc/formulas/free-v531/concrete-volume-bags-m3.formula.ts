import "server-only";

export type CalculationStatus = "OK" | "REVIEW" | "BLOCKED";
export type RedactionStatus = "PUBLIC_SAFE_REDACTED" | "REDACTION_NOT_REQUIRED" | "REDACTION_FAILED_BLOCKED";

export const toolKey = "concrete-volume-bags-m3";
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
  for (const key of ["pour_length", "pour_width", "pour_thickness", "bag_yield", "waste_allowance_percent"]) {
    if (!isFiniteNumber(inputs[key])) {
      warnings.push("Missing or non-finite input: " + key);
    }
  }

  // Compute formula outputs
    const val_pour_length = get(inputs, "pour_length");
    const val_pour_width = get(inputs, "pour_width");
    const val_pour_thickness = get(inputs, "pour_thickness");
    const val_bag_yield = get(inputs, "bag_yield");
    const val_waste_allowance_percent = get(inputs, "waste_allowance_percent");
    outputs["bag_count"] = round(val_pour_length * val_pour_width * val_pour_thickness * val_bag_yield * val_waste_allowance_percent, 4);

  return {
    status: warnings.length > 0 ? "REVIEW" : "OK",
    outputs,
    warnings,
    outputKeys: ["concrete_volume", "volume_with_waste", "bag_count"],
    redaction_status: "PUBLIC_SAFE_REDACTED",
  };
}
