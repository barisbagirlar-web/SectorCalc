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

export const toolKey = "solar-panel-payback-rooftop";
export const formulaVersion = "1.0.0";
export const publicFormulaExpressionPolicy = "FORBIDDEN" as const;

/**
 * Server-only deterministic formula module for Solar Panel Payback Calculator.
 * Exact formula logic must remain server-side and must never be rendered in public UI, public schema, PDF export, JSON audit, or copy summary.
 */
export function calculate(inputs: Record<string, number>): CalculationResult {
  const warnings: string[] = [];
  const outputs: Record<string, number> = {};

  const installed_system_cost = get(inputs, "installed_system_cost");
  const system_capacity_kw = get(inputs, "system_capacity_kw");
  const sun_hours_per_day = get(inputs, "sun_hours_per_day");
  const electricity_rate = get(inputs, "electricity_rate");
  const self_consumption_percent = get(inputs, "self_consumption_percent");
  const annual_maintenance_cost = get(inputs, "annual_maintenance_cost");

  for (const key of ["installed_system_cost", "system_capacity_kw", "sun_hours_per_day", "electricity_rate", "self_consumption_percent", "annual_maintenance_cost"]) {
    const value = inputs[key];
    if (!isFiniteNumber(value)) {
      warnings.push(`Missing or non-finite input: ${key}`);
    }
  }

  outputs.annual_energy_production = round(system_capacity_kw * sun_hours_per_day * 365, 0);
  outputs.annual_savings = round(outputs.annual_energy_production * electricity_rate * self_consumption_percent / 100 - annual_maintenance_cost, 2);
  outputs.payback_years = round(installed_system_cost / Math.max(0.01, outputs.annual_savings), 2);

  for (const key of ["annual_energy_production", "annual_savings", "payback_years"]) {
    if (!isFiniteNumber(outputs[key])) {
      outputs[key] = 0;
      warnings.push(`Non-finite output corrected to zero for public-safe response: ${key}`);
    }
  }

  return {
    status: warnings.length > 0 ? "REVIEW" : "OK",
    outputs,
    warnings,
    outputKeys: ["annual_energy_production", "annual_savings", "payback_years"],
    redaction_status: "PUBLIC_SAFE_REDACTED"
  };
}
