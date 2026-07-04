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

export const toolKey = "sprocket-chain-ratio-calculator";
export const formulaVersion = "1.0.0";
export const publicFormulaExpressionPolicy = "FORBIDDEN" as const;

/**
 * Server-only deterministic formula module for Sprocket Chain Ratio Calculator.
 * Exact formula logic must remain server-side and must never be rendered in public UI, public schema, PDF export, JSON audit, or copy summary.
 */
export function calculate(inputs: Record<string, number>): CalculationResult {
  const warnings: string[] = [];
  const outputs: Record<string, number> = {};

  const front_sprocket_teeth = get(inputs, "front_sprocket_teeth");
  const rear_sprocket_teeth = get(inputs, "rear_sprocket_teeth");
  const primary_ratio = get(inputs, "primary_ratio");
  const engine_speed = get(inputs, "engine_speed");
  const wheel_circumference = get(inputs, "wheel_circumference");
  const drivetrain_efficiency_percent = get(inputs, "drivetrain_efficiency_percent");

  for (const key of ["front_sprocket_teeth", "rear_sprocket_teeth", "primary_ratio", "engine_speed", "wheel_circumference", "drivetrain_efficiency_percent"]) {
    const value = inputs[key];
    if (!isFiniteNumber(value)) {
      warnings.push(`Missing or non-finite input: ${key}`);
    }
  }

  outputs.final_drive_ratio = round(rear_sprocket_teeth / Math.max(1, front_sprocket_teeth), 4);
  const totalRatio = primary_ratio * outputs.final_drive_ratio;
  outputs.wheel_speed = round(engine_speed / Math.max(0.0001, totalRatio), 2);
  outputs.theoretical_vehicle_speed = round(outputs.wheel_speed * wheel_circumference * 60 / 1000, 2);
  outputs.torque_multiplier = round(totalRatio * drivetrain_efficiency_percent / 100, 3);

  for (const key of ["final_drive_ratio", "wheel_speed", "theoretical_vehicle_speed", "torque_multiplier"]) {
    if (!isFiniteNumber(outputs[key])) {
      outputs[key] = 0;
      warnings.push(`Non-finite output corrected to zero for public-safe response: ${key}`);
    }
  }

  return {
    status: warnings.length > 0 ? "REVIEW" : "OK",
    outputs,
    warnings,
    outputKeys: ["final_drive_ratio", "wheel_speed", "theoretical_vehicle_speed", "torque_multiplier"],
    redaction_status: "PUBLIC_SAFE_REDACTED"
  };
}
