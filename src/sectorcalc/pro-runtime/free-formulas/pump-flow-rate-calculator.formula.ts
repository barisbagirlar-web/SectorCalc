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

export const toolKey = "pump-flow-rate-calculator";
export const formulaVersion = "1.0.0";
export const publicFormulaExpressionPolicy = "FORBIDDEN" as const;

/**
 * Server-only deterministic formula module for Pump Flow Rate Calculator.
 * Exact formula logic must remain server-side and must never be rendered in public UI, public schema, PDF export, JSON audit, or copy summary.
 */
export function calculate(inputs: Record<string, number>): CalculationResult {
  const warnings: string[] = [];
  const outputs: Record<string, number> = {};

  const motor_power = get(inputs, "motor_power");
  const pump_efficiency_percent = get(inputs, "pump_efficiency_percent");
  const total_head = get(inputs, "total_head");
  const friction_loss_head = get(inputs, "friction_loss_head");
  const fluid_density = get(inputs, "fluid_density");

  for (const key of ["motor_power", "pump_efficiency_percent", "total_head", "friction_loss_head", "fluid_density"]) {
    const value = inputs[key];
    if (!isFiniteNumber(value)) {
      warnings.push(`Missing or non-finite input: ${key}`);
    }
  }

  const totalHead = Math.max(0.01, total_head + friction_loss_head);
  const hydraulicPower = motor_power * pump_efficiency_percent / 100;
  outputs.estimated_flow_rate = round((hydraulicPower * 1000 / (fluid_density * 9.80665 * totalHead)) * 60000, 2);
  outputs.hydraulic_power = round(hydraulicPower, 3);
  outputs.energy_loss_index = round(friction_loss_head / totalHead * 100, 2);

  for (const key of ["estimated_flow_rate", "hydraulic_power", "energy_loss_index"]) {
    if (!isFiniteNumber(outputs[key])) {
      outputs[key] = 0;
      warnings.push(`Non-finite output corrected to zero for public-safe response: ${key}`);
    }
  }

  return {
    status: warnings.length > 0 ? "REVIEW" : "OK",
    outputs,
    warnings,
    outputKeys: ["estimated_flow_rate", "hydraulic_power", "energy_loss_index"],
    redaction_status: "PUBLIC_SAFE_REDACTED"
  };
}
