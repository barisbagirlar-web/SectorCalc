import "server-only";

export type CalculationStatus = "OK" | "REVIEW" | "BLOCKED";
export type RedactionStatus = "PUBLIC_SAFE_REDACTED" | "REDACTION_NOT_REQUIRED" | "REDACTION_FAILED_BLOCKED";

export interface CalculationResult {
  status: CalculationStatus;
  outputs: Record<string, number>;
  warnings: string[];
  outputKeys: string[];
  redaction_status: RedactionStatus;
}

function isFiniteNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function get(inputs: Record<string, number>, key: string): number {
  const value = inputs[key];
  return isFiniteNumber(value) ? value : 0;
}

function round(value: number, decimals: number): number {
  if (!Number.isFinite(value)) return 0;
  const factor = Math.pow(10, decimals);
  return Math.round(value * factor) / factor;
}

function safeDiv(numerator: number, denominator: number): number {
  if (!Number.isFinite(numerator) || !Number.isFinite(denominator) || Math.abs(denominator) < 1e-9) {
    return 0;
  }
  return numerator / denominator;
}

export const toolKey = "water-tank-capacity-household";
export const formulaVersion = "1.0.0";
export const publicFormulaExpressionPolicy = "FORBIDDEN" as const;

/**
 * Server-only deterministic formula module for Water Tank Capacity Calculator.
 * Exact formula logic must remain server-side and must never be rendered in public UI, public schema, PDF export, JSON audit, or copy summary.
 */
export function calculate(inputs: Record<string, number>): CalculationResult {
  const warnings: string[] = [];
  const outputs: Record<string, number> = {};

  const occupants = get(inputs, "occupants");
  const daily_consumption_per_person = get(inputs, "daily_consumption_per_person");
  const autonomy_days = get(inputs, "autonomy_days");
  const reserve_percent = get(inputs, "reserve_percent");
  const peak_factor = get(inputs, "peak_factor");

  for (const key of ["occupants", "daily_consumption_per_person", "autonomy_days", "reserve_percent", "peak_factor"]) {
    const value = inputs[key];
    if (!isFiniteNumber(value)) {
      warnings.push(`Missing or non-finite input: ${key}`);
    }
  }

  outputs.base_storage_volume = round(occupants * daily_consumption_per_person * autonomy_days, 1);
  outputs.peak_day_volume = round(occupants * daily_consumption_per_person * peak_factor, 1);
  outputs.recommended_tank_capacity = round(outputs.base_storage_volume * (1 + reserve_percent / 100), 1);

  for (const key of ["base_storage_volume", "recommended_tank_capacity", "peak_day_volume"]) {
    if (!isFiniteNumber(outputs[key])) {
      outputs[key] = 0;
      warnings.push(`Non-finite output corrected to zero for public-safe response: ${key}`);
    }
  }

  return {
    status: warnings.length > 0 ? "REVIEW" : "OK",
    outputs,
    warnings,
    outputKeys: ["base_storage_volume", "recommended_tank_capacity", "peak_day_volume"],
    redaction_status: "PUBLIC_SAFE_REDACTED"
  };
}
