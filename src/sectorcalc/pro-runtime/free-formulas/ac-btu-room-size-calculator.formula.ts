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

export const toolKey = "ac-btu-room-size-calculator";
export const formulaVersion = "1.0.0";
export const publicFormulaExpressionPolicy = "FORBIDDEN" as const;

/**
 * Server-only deterministic formula module for AC BTU Room Size Calculator.
 * Exact formula logic must remain server-side and must never be rendered in public UI, public schema, PDF export, JSON audit, or copy summary.
 */
export function calculate(inputs: Record<string, number>): CalculationResult {
  const warnings: string[] = [];
  const outputs: Record<string, number> = {};

  const room_area = get(inputs, "room_area");
  const ceiling_height = get(inputs, "ceiling_height");
  const window_area = get(inputs, "window_area");
  const sun_exposure_factor = get(inputs, "sun_exposure_factor");
  const occupants = get(inputs, "occupants");
  const equipment_watts = get(inputs, "equipment_watts");

  for (const key of ["room_area", "ceiling_height", "window_area", "sun_exposure_factor", "occupants", "equipment_watts"]) {
    const value = inputs[key];
    if (!isFiniteNumber(value)) {
      warnings.push(`Missing or non-finite input: ${key}`);
    }
  }

  const volume = room_area * ceiling_height;
  const baseBtu = volume * 120 * sun_exposure_factor;
  const windowBtu = window_area * 180;
  const occupantBtu = occupants * 600;
  const equipmentBtu = equipment_watts * 3412.142;
  outputs.cooling_load_btu_per_hour = round(baseBtu + windowBtu + occupantBtu + equipmentBtu, 0);
  outputs.recommended_capacity_kw = round(outputs.cooling_load_btu_per_hour / 3412.142, 2);
  outputs.sensible_load_index = round(outputs.cooling_load_btu_per_hour / Math.max(1, room_area), 2);

  for (const key of ["cooling_load_btu_per_hour", "sensible_load_index", "recommended_capacity_kw"]) {
    if (!isFiniteNumber(outputs[key])) {
      outputs[key] = 0;
      warnings.push(`Non-finite output corrected to zero for public-safe response: ${key}`);
    }
  }

  return {
    status: warnings.length > 0 ? "REVIEW" : "OK",
    outputs,
    warnings,
    outputKeys: ["cooling_load_btu_per_hour", "sensible_load_index", "recommended_capacity_kw"],
    redaction_status: "PUBLIC_SAFE_REDACTED"
  };
}
