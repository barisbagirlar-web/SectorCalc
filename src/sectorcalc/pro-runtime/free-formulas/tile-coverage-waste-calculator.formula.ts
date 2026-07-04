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

export const toolKey = "tile-coverage-waste-calculator";
export const formulaVersion = "1.0.0";
export const publicFormulaExpressionPolicy = "FORBIDDEN" as const;

/**
 * Server-only deterministic formula module for Tile Coverage Waste Calculator.
 * Exact formula logic must remain server-side and must never be rendered in public UI, public schema, PDF export, JSON audit, or copy summary.
 */
export function calculate(inputs: Record<string, number>): CalculationResult {
  const warnings: string[] = [];
  const outputs: Record<string, number> = {};

  const floor_area = get(inputs, "floor_area");
  const tile_area = get(inputs, "tile_area");
  const box_coverage = get(inputs, "box_coverage");
  const pattern_waste_percent = get(inputs, "pattern_waste_percent");
  const breakage_allowance_percent = get(inputs, "breakage_allowance_percent");

  for (const key of ["floor_area", "tile_area", "box_coverage", "pattern_waste_percent", "breakage_allowance_percent"]) {
    const value = inputs[key];
    if (!isFiniteNumber(value)) {
      warnings.push(`Missing or non-finite input: ${key}`);
    }
  }

  const adjustedArea = floor_area * (1 + (pattern_waste_percent + breakage_allowance_percent) / 100);
  outputs.tiles_required = Math.ceil(adjustedArea / Math.max(0.0001, tile_area));
  outputs.boxes_required = Math.ceil(adjustedArea / Math.max(0.0001, box_coverage));
  outputs.waste_area = round(adjustedArea - floor_area, 2);

  for (const key of ["tiles_required", "boxes_required", "waste_area"]) {
    if (!isFiniteNumber(outputs[key])) {
      outputs[key] = 0;
      warnings.push(`Non-finite output corrected to zero for public-safe response: ${key}`);
    }
  }

  return {
    status: warnings.length > 0 ? "REVIEW" : "OK",
    outputs,
    warnings,
    outputKeys: ["tiles_required", "boxes_required", "waste_area"],
    redaction_status: "PUBLIC_SAFE_REDACTED"
  };
}
