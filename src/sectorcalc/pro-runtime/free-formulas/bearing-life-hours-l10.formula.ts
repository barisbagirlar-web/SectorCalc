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

export const toolKey = "bearing-life-hours-l10";
export const formulaVersion = "1.0.0";
export const publicFormulaExpressionPolicy = "FORBIDDEN" as const;

/**
 * Server-only deterministic formula module for Bearing Life Hours Calculator.
 * Exact formula logic must remain server-side and must never be rendered in public UI, public schema, PDF export, JSON audit, or copy summary.
 */
export function calculate(inputs: Record<string, number>): CalculationResult {
  const warnings: string[] = [];
  const outputs: Record<string, number> = {};

  const dynamic_load_rating = get(inputs, "dynamic_load_rating");
  const equivalent_dynamic_load = get(inputs, "equivalent_dynamic_load");
  const shaft_speed = get(inputs, "shaft_speed");
  const life_exponent = get(inputs, "life_exponent");
  const reliability_factor = get(inputs, "reliability_factor");

  for (const key of ["dynamic_load_rating", "equivalent_dynamic_load", "shaft_speed", "life_exponent", "reliability_factor"]) {
    const value = inputs[key];
    if (!isFiniteNumber(value)) {
      warnings.push(`Missing or non-finite input: ${key}`);
    }
  }

  outputs.load_ratio = round(dynamic_load_rating / Math.max(0.01, equivalent_dynamic_load), 3);
  outputs.basic_rating_life_million_rev = round(Math.pow(outputs.load_ratio, life_exponent) * reliability_factor, 3);
  outputs.l10_life_hours = round(outputs.basic_rating_life_million_rev * 1000000 / (60 * Math.max(0.01, shaft_speed)), 1);

  for (const key of ["basic_rating_life_million_rev", "l10_life_hours", "load_ratio"]) {
    if (!isFiniteNumber(outputs[key])) {
      outputs[key] = 0;
      warnings.push(`Non-finite output corrected to zero for public-safe response: ${key}`);
    }
  }

  return {
    status: warnings.length > 0 ? "REVIEW" : "OK",
    outputs,
    warnings,
    outputKeys: ["basic_rating_life_million_rev", "l10_life_hours", "load_ratio"],
    redaction_status: "PUBLIC_SAFE_REDACTED"
  };
}
