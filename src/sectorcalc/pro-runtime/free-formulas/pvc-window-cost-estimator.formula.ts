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

export const toolKey = "pvc-window-cost-estimator";
export const formulaVersion = "1.0.0";
export const publicFormulaExpressionPolicy = "FORBIDDEN" as const;

/**
 * Server-only deterministic formula module for PVC Window Cost Estimator Calculator.
 * Exact formula logic must remain server-side and must never be rendered in public UI, public schema, PDF export, JSON audit, or copy summary.
 */
export function calculate(inputs: Record<string, number>): CalculationResult {
  const warnings: string[] = [];
  const outputs: Record<string, number> = {};

  const profile_cost = get(inputs, "profile_cost");
  const glass_area = get(inputs, "glass_area");
  const glass_cost_per_m2 = get(inputs, "glass_cost_per_m2");
  const hardware_cost = get(inputs, "hardware_cost");
  const labor_hours = get(inputs, "labor_hours");
  const labor_rate_per_hour = get(inputs, "labor_rate_per_hour");
  const overhead_margin_percent = get(inputs, "overhead_margin_percent");

  for (const key of ["profile_cost", "glass_area", "glass_cost_per_m2", "hardware_cost", "labor_hours", "labor_rate_per_hour", "overhead_margin_percent"]) {
    const value = inputs[key];
    if (!isFiniteNumber(value)) {
      warnings.push(`Missing or non-finite input: ${key}`);
    }
  }

  outputs.labor_cost = round(labor_hours * labor_rate_per_hour, 2);
  outputs.base_window_cost = round(profile_cost + glass_area * glass_cost_per_m2 + hardware_cost + outputs.labor_cost, 2);
  outputs.quoted_window_price = round(outputs.base_window_cost * (1 + overhead_margin_percent / 100), 2);

  for (const key of ["base_window_cost", "quoted_window_price", "labor_cost"]) {
    if (!isFiniteNumber(outputs[key])) {
      outputs[key] = 0;
      warnings.push(`Non-finite output corrected to zero for public-safe response: ${key}`);
    }
  }

  return {
    status: warnings.length > 0 ? "REVIEW" : "OK",
    outputs,
    warnings,
    outputKeys: ["base_window_cost", "quoted_window_price", "labor_cost"],
    redaction_status: "PUBLIC_SAFE_REDACTED"
  };
}
