import "server-only";

export type CalculationStatus = "OK" | "REVIEW" | "BLOCKED";
export type RedactionStatus = "PUBLIC_SAFE_REDACTED" | "REDACTION_NOT_REQUIRED" | "REDACTION_FAILED_BLOCKED";

export const toolKey = "welding-electrode-consumption-cost";
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
  for (const key of ["weld_length", "deposition_kg_per_meter", "electrode_efficiency_percent", "electrode_price_per_kg", "shielding_gas_cost_per_meter", "labor_minutes_per_meter", "labor_rate_per_hour"]) {
    if (!isFiniteNumber(inputs[key])) {
      warnings.push("Missing or non-finite input: " + key);
    }
  }

  // Compute formula outputs
    const val_weld_length = get(inputs, "weld_length");
    const val_deposition_kg_per_meter = get(inputs, "deposition_kg_per_meter");
    const val_electrode_efficiency_percent = get(inputs, "electrode_efficiency_percent");
    const val_electrode_price_per_kg = get(inputs, "electrode_price_per_kg");
    const val_shielding_gas_cost_per_meter = get(inputs, "shielding_gas_cost_per_meter");
    const val_labor_minutes_per_meter = get(inputs, "labor_minutes_per_meter");
    const val_labor_rate_per_hour = get(inputs, "labor_rate_per_hour");
    outputs["cost_per_meter"] = round(val_weld_length * val_deposition_kg_per_meter * val_electrode_efficiency_percent * val_electrode_price_per_kg * val_shielding_gas_cost_per_meter * val_labor_minutes_per_meter * val_labor_rate_per_hour, 4);

  return {
    status: warnings.length > 0 ? "REVIEW" : "OK",
    outputs,
    warnings,
    outputKeys: ["electrode_mass_required", "material_cost", "cost_per_meter"],
    redaction_status: "PUBLIC_SAFE_REDACTED",
  };
}
