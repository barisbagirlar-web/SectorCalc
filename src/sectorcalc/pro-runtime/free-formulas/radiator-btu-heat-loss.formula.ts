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

export const toolKey = "radiator-btu-heat-loss";
export const formulaVersion = "1.0.0";
export const publicFormulaExpressionPolicy = "FORBIDDEN" as const;

/**
 * Server-only deterministic formula module for Radiator BTU Heat Loss Calculator.
 * Exact formula logic must remain server-side and must never be rendered in public UI, public schema, PDF export, JSON audit, or copy summary.
 */
export function calculate(inputs: Record<string, number>): CalculationResult {
  const warnings: string[] = [];
  const outputs: Record<string, number> = {};

  const room_volume = get(inputs, "room_volume");
  const temperature_difference = get(inputs, "temperature_difference");
  const insulation_loss_factor = get(inputs, "insulation_loss_factor");
  const window_loss_btu = get(inputs, "window_loss_btu");
  const safety_margin_percent = get(inputs, "safety_margin_percent");

  for (const key of ["room_volume", "temperature_difference", "insulation_loss_factor", "window_loss_btu", "safety_margin_percent"]) {
    const value = inputs[key];
    if (!isFiniteNumber(value)) {
      warnings.push(`Missing or non-finite input: ${key}`);
    }
  }

  const baseLoss = room_volume * temperature_difference * insulation_loss_factor * 3.41;
  outputs.heat_loss_btu_per_hour = round(baseLoss + window_loss_btu * 3412.142, 0);
  outputs.radiator_capacity_required = round(outputs.heat_loss_btu_per_hour * (1 + safety_margin_percent / 100), 0);
  outputs.loss_intensity = round(outputs.heat_loss_btu_per_hour / Math.max(1, room_volume), 2);

  for (const key of ["heat_loss_btu_per_hour", "radiator_capacity_required", "loss_intensity"]) {
    if (!isFiniteNumber(outputs[key])) {
      outputs[key] = 0;
      warnings.push(`Non-finite output corrected to zero for public-safe response: ${key}`);
    }
  }

  return {
    status: warnings.length > 0 ? "REVIEW" : "OK",
    outputs,
    warnings,
    outputKeys: ["heat_loss_btu_per_hour", "radiator_capacity_required", "loss_intensity"],
    redaction_status: "PUBLIC_SAFE_REDACTED"
  };
}
