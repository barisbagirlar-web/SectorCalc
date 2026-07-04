import "server-only";

export type CalculationStatus = "OK" | "REVIEW" | "BLOCKED";
export type RedactionStatus = "PUBLIC_SAFE_REDACTED" | "REDACTION_NOT_REQUIRED" | "REDACTION_FAILED_BLOCKED";

export const toolKey = "solder-consumption-calculator";
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
  for (const key of ["joint_count", "solder_per_joint", "scrap_allowance_percent", "solder_price_per_kg", "flux_cost_per_batch"]) {
    if (!isFiniteNumber(inputs[key])) {
      warnings.push("Missing or non-finite input: " + key);
    }
  }

  // Compute formula outputs
    const val_joint_count = get(inputs, "joint_count");
    const val_solder_per_joint = get(inputs, "solder_per_joint");
    const val_scrap_allowance_percent = get(inputs, "scrap_allowance_percent");
    const val_solder_price_per_kg = get(inputs, "solder_price_per_kg");
    const val_flux_cost_per_batch = get(inputs, "flux_cost_per_batch");
    outputs["solder_mass_required"] = round(val_joint_count * val_solder_per_joint * val_scrap_allowance_percent * val_solder_price_per_kg * val_flux_cost_per_batch, 4);

  return {
    status: warnings.length > 0 ? "REVIEW" : "OK",
    outputs,
    warnings,
    outputKeys: ["solder_mass_required", "solder_cost", "batch_consumable_cost"],
    redaction_status: "PUBLIC_SAFE_REDACTED",
  };
}
