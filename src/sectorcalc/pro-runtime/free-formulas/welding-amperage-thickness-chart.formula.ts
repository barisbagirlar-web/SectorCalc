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

export const toolKey = "welding-amperage-thickness-chart";
export const formulaVersion = "1.0.0";
export const publicFormulaExpressionPolicy = "FORBIDDEN" as const;

/**
 * Server-only deterministic formula module for Welding Amperage Thickness Calculator.
 * Exact formula logic must remain server-side and must never be rendered in public UI, public schema, PDF export, JSON audit, or copy summary.
 */
export function calculate(inputs: Record<string, number>): CalculationResult {
  const warnings: string[] = [];
  const outputs: Record<string, number> = {};

  const plate_thickness = get(inputs, "plate_thickness");
  const wire_diameter = get(inputs, "wire_diameter");
  const joint_factor = get(inputs, "joint_factor");
  const process_factor = get(inputs, "process_factor");
  const travel_speed = get(inputs, "travel_speed");
  const weld_length = get(inputs, "weld_length");

  for (const key of ["plate_thickness", "wire_diameter", "joint_factor", "process_factor", "travel_speed", "weld_length"]) {
    const value = inputs[key];
    if (!isFiniteNumber(value)) {
      warnings.push(`Missing or non-finite input: ${key}`);
    }
  }

  outputs.recommended_amperage = round(plate_thickness * 35 * joint_factor * process_factor, 0);
  outputs.recommended_voltage = round(16 + wire_diameter * 8 + plate_thickness * 0.35, 1);
  outputs.heat_input_index = round((outputs.recommended_amperage * outputs.recommended_voltage) / Math.max(0.01, travel_speed * 1000), 3);

  for (const key of ["recommended_amperage", "recommended_voltage", "heat_input_index"]) {
    if (!isFiniteNumber(outputs[key])) {
      outputs[key] = 0;
      warnings.push(`Non-finite output corrected to zero for public-safe response: ${key}`);
    }
  }

  return {
    status: warnings.length > 0 ? "REVIEW" : "OK",
    outputs,
    warnings,
    outputKeys: ["recommended_amperage", "recommended_voltage", "heat_input_index"],
    redaction_status: "PUBLIC_SAFE_REDACTED"
  };
}
