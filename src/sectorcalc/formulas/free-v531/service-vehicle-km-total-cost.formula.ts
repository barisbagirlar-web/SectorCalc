import "server-only";

export type CalculationStatus = "OK" | "REVIEW" | "BLOCKED";
export type RedactionStatus = "PUBLIC_SAFE_REDACTED" | "REDACTION_NOT_REQUIRED" | "REDACTION_FAILED_BLOCKED";

export const toolKey = "service-vehicle-km-total-cost";
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
  for (const key of ["fuel_consumption_l_per_100km", "fuel_price_per_liter", "maintenance_cost_per_km", "tire_cost_per_km", "depreciation_cost_per_km", "monthly_insurance", "monthly_distance_km"]) {
    if (!isFiniteNumber(inputs[key])) {
      warnings.push("Missing or non-finite input: " + key);
    }
  }

  // Compute formula outputs
    const val_fuel_consumption_l_per_100km = get(inputs, "fuel_consumption_l_per_100km");
    const val_fuel_price_per_liter = get(inputs, "fuel_price_per_liter");
    const val_maintenance_cost_per_km = get(inputs, "maintenance_cost_per_km");
    const val_tire_cost_per_km = get(inputs, "tire_cost_per_km");
    const val_depreciation_cost_per_km = get(inputs, "depreciation_cost_per_km");
    const val_monthly_insurance = get(inputs, "monthly_insurance");
    const val_monthly_distance_km = get(inputs, "monthly_distance_km");
    outputs["fully_loaded_cost_per_km"] = round(val_fuel_consumption_l_per_100km * val_fuel_price_per_liter * val_maintenance_cost_per_km * val_tire_cost_per_km * val_depreciation_cost_per_km * val_monthly_insurance * val_monthly_distance_km, 4);

  return {
    status: warnings.length > 0 ? "REVIEW" : "OK",
    outputs,
    warnings,
    outputKeys: ["fuel_cost_per_km", "fully_loaded_cost_per_km", "monthly_vehicle_cost"],
    redaction_status: "PUBLIC_SAFE_REDACTED",
  };
}
