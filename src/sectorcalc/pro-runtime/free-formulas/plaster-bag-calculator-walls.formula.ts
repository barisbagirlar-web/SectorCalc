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

export const toolKey = "plaster-bag-calculator-walls";
export const formulaVersion = "1.0.0";
export const publicFormulaExpressionPolicy = "FORBIDDEN" as const;

/**
 * Server-only deterministic formula module for Plaster Bag Calculator.
 * Exact formula logic must remain server-side and must never be rendered in public UI, public schema, PDF export, JSON audit, or copy summary.
 */
export function calculate(inputs: Record<string, number>): CalculationResult {
  const warnings: string[] = [];
  const outputs: Record<string, number> = {};

  const wall_area = get(inputs, "wall_area");
  const coat_thickness = get(inputs, "coat_thickness");
  const material_density = get(inputs, "material_density");
  const bag_weight = get(inputs, "bag_weight");
  const waste_allowance_percent = get(inputs, "waste_allowance_percent");

  for (const key of ["wall_area", "coat_thickness", "material_density", "bag_weight", "waste_allowance_percent"]) {
    const value = inputs[key];
    if (!isFiniteNumber(value)) {
      warnings.push(`Missing or non-finite input: ${key}`);
    }
  }

  outputs.wet_material_volume = round(wall_area * coat_thickness / 1000, 3);
  outputs.dry_mass_required = round(outputs.wet_material_volume * material_density * (1 + waste_allowance_percent / 100), 2);
  outputs.bag_count = Math.ceil(outputs.dry_mass_required / Math.max(0.01, bag_weight));

  for (const key of ["wet_material_volume", "dry_mass_required", "bag_count"]) {
    if (!isFiniteNumber(outputs[key])) {
      outputs[key] = 0;
      warnings.push(`Non-finite output corrected to zero for public-safe response: ${key}`);
    }
  }

  return {
    status: warnings.length > 0 ? "REVIEW" : "OK",
    outputs,
    warnings,
    outputKeys: ["wet_material_volume", "dry_mass_required", "bag_count"],
    redaction_status: "PUBLIC_SAFE_REDACTED"
  };
}
