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

export const toolKey = "piece-rate-vs-hourly-worker";
export const formulaVersion = "1.0.0";
export const publicFormulaExpressionPolicy = "FORBIDDEN" as const;

/**
 * Server-only deterministic formula module for Piece Rate vs Hourly Share Calculator.
 * Exact formula logic must remain server-side and must never be rendered in public UI, public schema, PDF export, JSON audit, or copy summary.
 */
export function calculate(inputs: Record<string, number>): CalculationResult {
  const warnings: string[] = [];
  const outputs: Record<string, number> = {};

  const pieces_per_hour = get(inputs, "pieces_per_hour");
  const piece_rate = get(inputs, "piece_rate");
  const hourly_wage = get(inputs, "hourly_wage");
  const quality_rework_percent = get(inputs, "quality_rework_percent");
  const rework_cost_per_piece = get(inputs, "rework_cost_per_piece");
  const target_daily_pieces = get(inputs, "target_daily_pieces");
  const paid_hours_per_day = get(inputs, "paid_hours_per_day");

  for (const key of ["pieces_per_hour", "piece_rate", "hourly_wage", "quality_rework_percent", "rework_cost_per_piece", "target_daily_pieces", "paid_hours_per_day"]) {
    const value = inputs[key];
    if (!isFiniteNumber(value)) {
      warnings.push(`Missing or non-finite input: ${key}`);
    }
  }

  const produced = Math.max(1, target_daily_pieces);
  const reworkCost = produced * quality_rework_percent / 100 * rework_cost_per_piece;
  outputs.piece_rate_daily_cost = round(produced * piece_rate + reworkCost, 2);
  outputs.hourly_daily_cost = round(paid_hours_per_day * hourly_wage + reworkCost, 2);
  outputs.cost_delta_piece_minus_hourly = round(outputs.piece_rate_daily_cost - outputs.hourly_daily_cost, 2);
  outputs.good_piece_cost = round(outputs.piece_rate_daily_cost / Math.max(1, produced * (1 - quality_rework_percent / 100)), 2);

  for (const key of ["piece_rate_daily_cost", "hourly_daily_cost", "cost_delta_piece_minus_hourly", "good_piece_cost"]) {
    if (!isFiniteNumber(outputs[key])) {
      outputs[key] = 0;
      warnings.push(`Non-finite output corrected to zero for public-safe response: ${key}`);
    }
  }

  return {
    status: warnings.length > 0 ? "REVIEW" : "OK",
    outputs,
    warnings,
    outputKeys: ["piece_rate_daily_cost", "hourly_daily_cost", "cost_delta_piece_minus_hourly", "good_piece_cost"],
    redaction_status: "PUBLIC_SAFE_REDACTED"
  };
}
