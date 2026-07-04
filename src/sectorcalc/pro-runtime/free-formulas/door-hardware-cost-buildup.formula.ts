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

export const toolKey = "door-hardware-cost-buildup";
export const formulaVersion = "1.0.0";
export const publicFormulaExpressionPolicy = "FORBIDDEN" as const;

/**
 * Server-only deterministic formula module for Door Hardware Cost Buildup Calculator.
 * Exact formula logic must remain server-side and must never be rendered in public UI, public schema, PDF export, JSON audit, or copy summary.
 */
export function calculate(inputs: Record<string, number>): CalculationResult {
  const warnings: string[] = [];
  const outputs: Record<string, number> = {};

  const hinge_count = get(inputs, "hinge_count");
  const hinge_unit_cost = get(inputs, "hinge_unit_cost");
  const lockset_cost = get(inputs, "lockset_cost");
  const handle_cost = get(inputs, "handle_cost");
  const closer_cost = get(inputs, "closer_cost");
  const weatherstrip_cost = get(inputs, "weatherstrip_cost");
  const labor_minutes = get(inputs, "labor_minutes");
  const labor_rate_per_hour = get(inputs, "labor_rate_per_hour");

  for (const key of ["hinge_count", "hinge_unit_cost", "lockset_cost", "handle_cost", "closer_cost", "weatherstrip_cost", "labor_minutes", "labor_rate_per_hour"]) {
    const value = inputs[key];
    if (!isFiniteNumber(value)) {
      warnings.push(`Missing or non-finite input: ${key}`);
    }
  }

  outputs.hardware_material_cost = round(hinge_count * hinge_unit_cost + lockset_cost + handle_cost + closer_cost + weatherstrip_cost, 2);
  outputs.labor_cost = round(labor_minutes / 60 * labor_rate_per_hour, 2);
  outputs.total_door_hardware_cost = round(outputs.hardware_material_cost + outputs.labor_cost, 2);

  for (const key of ["hardware_material_cost", "labor_cost", "total_door_hardware_cost"]) {
    if (!isFiniteNumber(outputs[key])) {
      outputs[key] = 0;
      warnings.push(`Non-finite output corrected to zero for public-safe response: ${key}`);
    }
  }

  return {
    status: warnings.length > 0 ? "REVIEW" : "OK",
    outputs,
    warnings,
    outputKeys: ["hardware_material_cost", "labor_cost", "total_door_hardware_cost"],
    redaction_status: "PUBLIC_SAFE_REDACTED"
  };
}
