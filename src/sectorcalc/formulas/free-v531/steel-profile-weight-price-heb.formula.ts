import "server-only";

export type CalculationStatus = "OK" | "REVIEW" | "BLOCKED";
export type RedactionStatus = "PUBLIC_SAFE_REDACTED" | "REDACTION_NOT_REQUIRED" | "REDACTION_FAILED_BLOCKED";

export const toolKey = "steel-profile-weight-price-heb";
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
  for (const key of ["profile_length", "linear_mass", "steel_price_per_kg", "waste_allowance_percent", "surcharge_percent"]) {
    if (!isFiniteNumber(inputs[key])) {
      warnings.push("Missing or non-finite input: " + key);
    }
  }

  // Compute formula outputs
    const val_profile_length = get(inputs, "profile_length");
    const val_linear_mass = get(inputs, "linear_mass");
    const val_steel_price_per_kg = get(inputs, "steel_price_per_kg");
    const val_waste_allowance_percent = get(inputs, "waste_allowance_percent");
    const val_surcharge_percent = get(inputs, "surcharge_percent");
    outputs["profile_material_cost"] = round(val_profile_length * val_linear_mass * val_steel_price_per_kg * val_waste_allowance_percent * val_surcharge_percent, 4);

  return {
    status: warnings.length > 0 ? "REVIEW" : "OK",
    outputs,
    warnings,
    outputKeys: ["profile_weight", "chargeable_weight", "profile_material_cost"],
    redaction_status: "PUBLIC_SAFE_REDACTED",
  };
}
