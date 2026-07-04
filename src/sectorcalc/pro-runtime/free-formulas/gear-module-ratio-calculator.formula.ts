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

export const toolKey = "gear-module-ratio-calculator";
export const formulaVersion = "1.0.0";
export const publicFormulaExpressionPolicy = "FORBIDDEN" as const;

/**
 * Server-only deterministic formula module for Gear Module Ratio Calculator.
 * Exact formula logic must remain server-side and must never be rendered in public UI, public schema, PDF export, JSON audit, or copy summary.
 */
export function calculate(inputs: Record<string, number>): CalculationResult {
  const warnings: string[] = [];
  const outputs: Record<string, number> = {};

  const driver_teeth = get(inputs, "driver_teeth");
  const driven_teeth = get(inputs, "driven_teeth");
  const gearModule = get(inputs, "module");
  const input_speed = get(inputs, "input_speed");
  const input_torque = get(inputs, "input_torque");
  const mesh_efficiency_percent = get(inputs, "mesh_efficiency_percent");

  for (const key of ["driver_teeth", "driven_teeth", "module", "input_speed", "input_torque", "mesh_efficiency_percent"]) {
    const value = inputs[key];
    if (!isFiniteNumber(value)) {
      warnings.push(`Missing or non-finite input: ${key}`);
    }
  }

  outputs.gear_ratio = round(driven_teeth / Math.max(1, driver_teeth), 4);
  outputs.output_speed = round(input_speed / Math.max(0.0001, outputs.gear_ratio), 2);
  outputs.output_torque = round(input_torque * outputs.gear_ratio * mesh_efficiency_percent / 100, 2);
  outputs.center_distance = round(gearModule * (driver_teeth + driven_teeth) / 2, 2);

  for (const key of ["gear_ratio", "output_speed", "output_torque", "center_distance"]) {
    if (!isFiniteNumber(outputs[key])) {
      outputs[key] = 0;
      warnings.push(`Non-finite output corrected to zero for public-safe response: ${key}`);
    }
  }

  return {
    status: warnings.length > 0 ? "REVIEW" : "OK",
    outputs,
    warnings,
    outputKeys: ["gear_ratio", "output_speed", "output_torque", "center_distance"],
    redaction_status: "PUBLIC_SAFE_REDACTED"
  };
}
