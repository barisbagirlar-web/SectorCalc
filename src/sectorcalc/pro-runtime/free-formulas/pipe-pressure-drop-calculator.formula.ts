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

export const toolKey = "pipe-pressure-drop-calculator";
export const formulaVersion = "1.0.0";
export const publicFormulaExpressionPolicy = "FORBIDDEN" as const;

/**
 * Server-only deterministic formula module for Pipe Pressure Drop Calculator.
 * Exact formula logic must remain server-side and must never be rendered in public UI, public schema, PDF export, JSON audit, or copy summary.
 */
export function calculate(inputs: Record<string, number>): CalculationResult {
  const warnings: string[] = [];
  const outputs: Record<string, number> = {};

  const flow_rate = get(inputs, "flow_rate");
  const pipe_diameter = get(inputs, "pipe_diameter");
  const pipe_length = get(inputs, "pipe_length");
  const friction_factor = get(inputs, "friction_factor");
  const fluid_density = get(inputs, "fluid_density");
  const minor_loss_coefficient = get(inputs, "minor_loss_coefficient");

  for (const key of ["flow_rate", "pipe_diameter", "pipe_length", "friction_factor", "fluid_density", "minor_loss_coefficient"]) {
    const value = inputs[key];
    if (!isFiniteNumber(value)) {
      warnings.push(`Missing or non-finite input: ${key}`);
    }
  }

  const diameterM = pipe_diameter / 1000;
  const area = Math.PI * Math.pow(diameterM, 2) / 4;
  const flowM3s = flow_rate / 1000 / 60;
  outputs.flow_velocity = round(flowM3s / Math.max(0.000001, area), 3);
  const dynamicPressure = fluid_density * Math.pow(outputs.flow_velocity, 2) / 2;
  const frictionPressure = friction_factor * pipe_length / Math.max(0.0001, diameterM) * dynamicPressure;
  outputs.minor_loss_pressure = round(minor_loss_coefficient * dynamicPressure / 100000, 4);
  outputs.pressure_drop = round(frictionPressure / 100000 + outputs.minor_loss_pressure, 4);

  for (const key of ["flow_velocity", "pressure_drop", "minor_loss_pressure"]) {
    if (!isFiniteNumber(outputs[key])) {
      outputs[key] = 0;
      warnings.push(`Non-finite output corrected to zero for public-safe response: ${key}`);
    }
  }

  return {
    status: warnings.length > 0 ? "REVIEW" : "OK",
    outputs,
    warnings,
    outputKeys: ["flow_velocity", "pressure_drop", "minor_loss_pressure"],
    redaction_status: "PUBLIC_SAFE_REDACTED"
  };
}
