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

export const toolKey = "lathe-rpm-material-speeds-feeds";
export const formulaVersion = "1.0.0";
export const publicFormulaExpressionPolicy = "FORBIDDEN" as const;

/**
 * Server-only deterministic formula module for Lathe RPM Material Calculator.
 * Exact formula logic must remain server-side and must never be rendered in public UI, public schema, PDF export, JSON audit, or copy summary.
 */
export function calculate(inputs: Record<string, number>): CalculationResult {
  const warnings: string[] = [];
  const outputs: Record<string, number> = {};

  const cutting_speed = get(inputs, "cutting_speed");
  const workpiece_diameter = get(inputs, "workpiece_diameter");
  const feed_per_rev = get(inputs, "feed_per_rev");
  const depth_of_cut = get(inputs, "depth_of_cut");
  const tool_factor = get(inputs, "tool_factor");

  for (const key of ["cutting_speed", "workpiece_diameter", "feed_per_rev", "depth_of_cut", "tool_factor"]) {
    const value = inputs[key];
    if (!isFiniteNumber(value)) {
      warnings.push(`Missing or non-finite input: ${key}`);
    }
  }

  outputs.spindle_rpm = round((1000 * cutting_speed * tool_factor) / Math.max(0.01, Math.PI * workpiece_diameter), 0);
  outputs.feed_rate = round(outputs.spindle_rpm * feed_per_rev, 2);
  outputs.material_removal_index = round(outputs.feed_rate * depth_of_cut * workpiece_diameter, 2);

  for (const key of ["spindle_rpm", "feed_rate", "material_removal_index"]) {
    if (!isFiniteNumber(outputs[key])) {
      outputs[key] = 0;
      warnings.push(`Non-finite output corrected to zero for public-safe response: ${key}`);
    }
  }

  return {
    status: warnings.length > 0 ? "REVIEW" : "OK",
    outputs,
    warnings,
    outputKeys: ["spindle_rpm", "feed_rate", "material_removal_index"],
    redaction_status: "PUBLIC_SAFE_REDACTED"
  };
}
