import "server-only";

export type CalculationStatus = "OK" | "REVIEW" | "BLOCKED";
export type RedactionStatus = "PUBLIC_SAFE_REDACTED" | "REDACTION_NOT_REQUIRED" | "REDACTION_FAILED_BLOCKED";

export const toolKey = "generator-fuel-consumption-cost";
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
  for (const key of ["rated_power", "load_percent", "specific_fuel_consumption", "fuel_price_per_liter", "operating_hours"]) {
    if (!isFiniteNumber(inputs[key])) {
      warnings.push("Missing or non-finite input: " + key);
    }
  }

  // Compute formula outputs
    const val_rated_power = get(inputs, "rated_power");
    const val_load_percent = get(inputs, "load_percent");
    const val_specific_fuel_consumption = get(inputs, "specific_fuel_consumption");
    const val_fuel_price_per_liter = get(inputs, "fuel_price_per_liter");
    const val_operating_hours = get(inputs, "operating_hours");
    outputs["fuel_cost_per_hour"] = round(val_rated_power * val_load_percent * val_specific_fuel_consumption * val_fuel_price_per_liter * val_operating_hours, 4);

  return {
    status: warnings.length > 0 ? "REVIEW" : "OK",
    outputs,
    warnings,
    outputKeys: ["fuel_consumption_per_hour", "fuel_cost_per_hour", "total_fuel_cost"],
    redaction_status: "PUBLIC_SAFE_REDACTED",
  };
}
