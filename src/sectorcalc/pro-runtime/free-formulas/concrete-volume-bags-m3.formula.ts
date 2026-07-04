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

export const toolKey = "concrete-volume-bags-m3";
export const formulaVersion = "1.0.0";
export const publicFormulaExpressionPolicy = "FORBIDDEN" as const;

/**
 * Server-only deterministic formula module for Concrete Volume Bags Calculator.
 * Exact formula logic must remain server-side and must never be rendered in public UI, public schema, PDF export, JSON audit, or copy summary.
 */
export function calculate(inputs: Record<string, number>): CalculationResult {
  const warnings: string[] = [];
  const outputs: Record<string, number> = {};

  const pour_length = get(inputs, "pour_length");
  const pour_width = get(inputs, "pour_width");
  const pour_thickness = get(inputs, "pour_thickness");
  const bag_yield = get(inputs, "bag_yield");
  const waste_allowance_percent = get(inputs, "waste_allowance_percent");

  for (const key of ["pour_length", "pour_width", "pour_thickness", "bag_yield", "waste_allowance_percent"]) {
    const value = inputs[key];
    if (!isFiniteNumber(value)) {
      warnings.push(`Missing or non-finite input: ${key}`);
    }
  }

  outputs.concrete_volume = round(pour_length * pour_width * pour_thickness, 3);
  outputs.volume_with_waste = round(outputs.concrete_volume * (1 + waste_allowance_percent / 100), 3);
  outputs.bag_count = Math.ceil(outputs.volume_with_waste / Math.max(0.0001, bag_yield));

  for (const key of ["concrete_volume", "volume_with_waste", "bag_count"]) {
    if (!isFiniteNumber(outputs[key])) {
      outputs[key] = 0;
      warnings.push(`Non-finite output corrected to zero for public-safe response: ${key}`);
    }
  }

  return {
    status: warnings.length > 0 ? "REVIEW" : "OK",
    outputs,
    warnings,
    outputKeys: ["concrete_volume", "volume_with_waste", "bag_count"],
    redaction_status: "PUBLIC_SAFE_REDACTED"
  };
}
