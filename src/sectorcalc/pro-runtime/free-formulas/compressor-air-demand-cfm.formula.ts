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

export const toolKey = "compressor-air-demand-cfm";
export const formulaVersion = "1.0.0";
export const publicFormulaExpressionPolicy = "FORBIDDEN" as const;

/**
 * Server-only deterministic formula module for Compressor Air Demand Calculator.
 * Exact formula logic must remain server-side and must never be rendered in public UI, public schema, PDF export, JSON audit, or copy summary.
 */
export function calculate(inputs: Record<string, number>): CalculationResult {
  const warnings: string[] = [];
  const outputs: Record<string, number> = {};

  const tool_air_demand = get(inputs, "tool_air_demand");
  const simultaneous_use_factor = get(inputs, "simultaneous_use_factor");
  const leakage_allowance_percent = get(inputs, "leakage_allowance_percent");
  const reserve_percent = get(inputs, "reserve_percent");
  const compressor_capacity = get(inputs, "compressor_capacity");

  for (const key of ["tool_air_demand", "simultaneous_use_factor", "leakage_allowance_percent", "reserve_percent", "compressor_capacity"]) {
    const value = inputs[key];
    if (!isFiniteNumber(value)) {
      warnings.push(`Missing or non-finite input: ${key}`);
    }
  }

  const baseDemand = tool_air_demand * simultaneous_use_factor;
  outputs.leakage_air_demand = round(baseDemand * leakage_allowance_percent / 100, 2);
  outputs.required_air_capacity = round((baseDemand + outputs.leakage_air_demand) * (1 + reserve_percent / 100), 2);
  outputs.capacity_gap = round(outputs.required_air_capacity - compressor_capacity, 2);

  for (const key of ["required_air_capacity", "capacity_gap", "leakage_air_demand"]) {
    if (!isFiniteNumber(outputs[key])) {
      outputs[key] = 0;
      warnings.push(`Non-finite output corrected to zero for public-safe response: ${key}`);
    }
  }

  return {
    status: warnings.length > 0 ? "REVIEW" : "OK",
    outputs,
    warnings,
    outputKeys: ["required_air_capacity", "capacity_gap", "leakage_air_demand"],
    redaction_status: "PUBLIC_SAFE_REDACTED"
  };
}
