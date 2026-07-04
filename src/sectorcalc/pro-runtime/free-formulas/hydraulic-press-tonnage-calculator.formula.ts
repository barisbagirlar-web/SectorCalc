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

export const toolKey = "hydraulic-press-tonnage-calculator";
export const formulaVersion = "1.0.0";
export const publicFormulaExpressionPolicy = "FORBIDDEN" as const;

/**
 * Server-only deterministic formula module for Hydraulic Press Tonnage Calculator.
 * Exact formula logic must remain server-side and must never be rendered in public UI, public schema, PDF export, JSON audit, or copy summary.
 */
export function calculate(inputs: Record<string, number>): CalculationResult {
  const warnings: string[] = [];
  const outputs: Record<string, number> = {};

  const material_strength = get(inputs, "material_strength");
  const plate_thickness = get(inputs, "plate_thickness");
  const bend_length = get(inputs, "bend_length");
  const die_opening = get(inputs, "die_opening");
  const safety_factor = get(inputs, "safety_factor");

  for (const key of ["material_strength", "plate_thickness", "bend_length", "die_opening", "safety_factor"]) {
    const value = inputs[key];
    if (!isFiniteNumber(value)) {
      warnings.push(`Missing or non-finite input: ${key}`);
    }
  }

  outputs.required_press_force = round(1.42 * material_strength * bend_length * Math.pow(plate_thickness, 2) / Math.max(0.01, die_opening) * safety_factor, 2);
  outputs.required_tonnage = round(outputs.required_press_force / 9806.65, 2);
  outputs.die_opening_ratio = round(die_opening / Math.max(0.01, plate_thickness), 2);

  for (const key of ["required_press_force", "required_tonnage", "die_opening_ratio"]) {
    if (!isFiniteNumber(outputs[key])) {
      outputs[key] = 0;
      warnings.push(`Non-finite output corrected to zero for public-safe response: ${key}`);
    }
  }

  return {
    status: warnings.length > 0 ? "REVIEW" : "OK",
    outputs,
    warnings,
    outputKeys: ["required_press_force", "required_tonnage", "die_opening_ratio"],
    redaction_status: "PUBLIC_SAFE_REDACTED"
  };
}
