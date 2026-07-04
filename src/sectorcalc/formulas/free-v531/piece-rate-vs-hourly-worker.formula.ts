import "server-only";

export type CalculationStatus = "OK" | "REVIEW" | "BLOCKED";
export type RedactionStatus = "PUBLIC_SAFE_REDACTED" | "REDACTION_NOT_REQUIRED" | "REDACTION_FAILED_BLOCKED";

export const toolKey = "piece-rate-vs-hourly-worker";
export const formulaVersion = "1.0.0";

function isFiniteNumber(v: unknown): v is number {
  return typeof v === "number" && Number.isFinite(v);
}

function get(inputs: Record<string, number>, key: string): number {
  const v = inputs[key];
  return isFiniteNumber(v) ? v : 0;
}

function round(v: number, d: number): number {
  if (!isFiniteNumber(v)) return 0;
  const f = Math.pow(10, d);
  return Math.round(v * f) / f;
}

export function calculate(inputs: Record<string, number>): {
  status: CalculationStatus;
  outputs: Record<string, number>;
  warnings: string[];
  outputKeys: string[];
  redaction_status: RedactionStatus;
} {
  const warnings: string[] = [];
  const outputs: Record<string, number> = {};

  // Validate required inputs
  for (const key of ["pieces_per_hour", "piece_rate", "hourly_wage", "quality_rework_percent", "rework_cost_per_piece", "target_daily_pieces", "paid_hours_per_day"]) {
    if (!isFiniteNumber(inputs[key])) {
      warnings.push("Missing or non-finite input: " + key);
    }
  }

  // Compute formula outputs
    const val_pieces_per_hour = get(inputs, "pieces_per_hour");
    const val_piece_rate = get(inputs, "piece_rate");
    const val_hourly_wage = get(inputs, "hourly_wage");
    const val_quality_rework_percent = get(inputs, "quality_rework_percent");
    const val_rework_cost_per_piece = get(inputs, "rework_cost_per_piece");
    const val_target_daily_pieces = get(inputs, "target_daily_pieces");
    const val_paid_hours_per_day = get(inputs, "paid_hours_per_day");
    outputs["cost_delta_piece_minus_hourly"] = round(val_pieces_per_hour * val_piece_rate * val_hourly_wage * val_quality_rework_percent * val_rework_cost_per_piece * val_target_daily_pieces * val_paid_hours_per_day, 4);

  return {
    status: warnings.length > 0 ? "REVIEW" : "OK",
    outputs,
    warnings,
    outputKeys: ["piece_rate_daily_cost", "hourly_daily_cost", "cost_delta_piece_minus_hourly", "good_piece_cost"],
    redaction_status: "PUBLIC_SAFE_REDACTED",
  };
}
