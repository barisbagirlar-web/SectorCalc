import "server-only";

export type CalculationStatus = "OK" | "REVIEW" | "BLOCKED";
export type RedactionStatus = "PUBLIC_SAFE_REDACTED" | "REDACTION_NOT_REQUIRED" | "REDACTION_FAILED_BLOCKED";

export const toolKey = "scrap-metal-resale-value-tracker";
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
  for (const key of ["steel_scrap_kg", "aluminum_scrap_kg", "copper_scrap_kg", "steel_price_per_kg", "aluminum_price_per_kg", "copper_price_per_kg", "contamination_discount_percent"]) {
    if (!isFiniteNumber(inputs[key])) {
      warnings.push("Missing or non-finite input: " + key);
    }
  }

  // Compute formula outputs
    const val_steel_scrap_kg = get(inputs, "steel_scrap_kg");
    const val_aluminum_scrap_kg = get(inputs, "aluminum_scrap_kg");
    const val_copper_scrap_kg = get(inputs, "copper_scrap_kg");
    const val_steel_price_per_kg = get(inputs, "steel_price_per_kg");
    const val_aluminum_price_per_kg = get(inputs, "aluminum_price_per_kg");
    const val_copper_price_per_kg = get(inputs, "copper_price_per_kg");
    const val_contamination_discount_percent = get(inputs, "contamination_discount_percent");
    outputs["net_scrap_value"] = round(val_steel_scrap_kg * val_aluminum_scrap_kg * val_copper_scrap_kg * val_steel_price_per_kg * val_aluminum_price_per_kg * val_copper_price_per_kg * val_contamination_discount_percent, 4);

  return {
    status: warnings.length > 0 ? "REVIEW" : "OK",
    outputs,
    warnings,
    outputKeys: ["gross_scrap_value", "net_scrap_value", "discount_loss"],
    redaction_status: "PUBLIC_SAFE_REDACTED",
  };
}
