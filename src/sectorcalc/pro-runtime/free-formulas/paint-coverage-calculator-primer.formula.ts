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

export const toolKey = "paint-coverage-calculator-primer";
export const formulaVersion = "1.0.0";
export const publicFormulaExpressionPolicy = "FORBIDDEN" as const;

/**
 * Server-only deterministic formula module for Paint Coverage Calculator.
 * Exact formula logic must remain server-side and must never be rendered in public UI, public schema, PDF export, JSON audit, or copy summary.
 */
export function calculate(inputs: Record<string, number>): CalculationResult {
  const warnings: string[] = [];
  const outputs: Record<string, number> = {};

  const surface_area = get(inputs, "surface_area");
  const coat_count = get(inputs, "coat_count");
  const coverage_per_liter = get(inputs, "coverage_per_liter");
  const porosity_factor = get(inputs, "porosity_factor");
  const waste_allowance_percent = get(inputs, "waste_allowance_percent");

  for (const key of ["surface_area", "coat_count", "coverage_per_liter", "porosity_factor", "waste_allowance_percent"]) {
    const value = inputs[key];
    if (!isFiniteNumber(value)) {
      warnings.push(`Missing or non-finite input: ${key}`);
    }
  }

  const finishLiters = surface_area * coat_count * porosity_factor / Math.max(0.01, coverage_per_liter) * (1 + waste_allowance_percent / 100);
  const primerLiters = surface_area * porosity_factor / Math.max(0.01, coverage_per_liter) * (1 + waste_allowance_percent / 100);
  outputs.paint_liters_required = round(finishLiters, 2);
  outputs.primer_liters_required = round(primerLiters, 2);
  outputs.total_coating_liters = round(finishLiters + primerLiters, 2);

  for (const key of ["paint_liters_required", "primer_liters_required", "total_coating_liters"]) {
    if (!isFiniteNumber(outputs[key])) {
      outputs[key] = 0;
      warnings.push(`Non-finite output corrected to zero for public-safe response: ${key}`);
    }
  }

  return {
    status: warnings.length > 0 ? "REVIEW" : "OK",
    outputs,
    warnings,
    outputKeys: ["paint_liters_required", "primer_liters_required", "total_coating_liters"],
    redaction_status: "PUBLIC_SAFE_REDACTED"
  };
}
