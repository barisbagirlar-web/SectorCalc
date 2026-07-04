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

export const toolKey = "batch-size-economy-optimizer";
export const formulaVersion = "1.0.0";
export const publicFormulaExpressionPolicy = "FORBIDDEN" as const;

/**
 * Server-only deterministic formula module for Batch Size Economy Calculator.
 * Exact formula logic must remain server-side and must never be rendered in public UI, public schema, PDF export, JSON audit, or copy summary.
 */
export function calculate(inputs: Record<string, number>): CalculationResult {
  const warnings: string[] = [];
  const outputs: Record<string, number> = {};

  const monthly_demand_units = get(inputs, "monthly_demand_units");
  const setup_time_hours = get(inputs, "setup_time_hours");
  const machine_hourly_rate = get(inputs, "machine_hourly_rate");
  const holding_cost_per_unit_month = get(inputs, "holding_cost_per_unit_month");
  const candidate_batch_size = get(inputs, "candidate_batch_size");
  const unit_production_cost = get(inputs, "unit_production_cost");

  for (const key of ["monthly_demand_units", "setup_time_hours", "machine_hourly_rate", "holding_cost_per_unit_month", "candidate_batch_size", "unit_production_cost"]) {
    const value = inputs[key];
    if (!isFiniteNumber(value)) {
      warnings.push(`Missing or non-finite input: ${key}`);
    }
  }

  outputs.setup_cost_per_batch = round(setup_time_hours * machine_hourly_rate, 2);
  outputs.economic_batch_size = Math.ceil(Math.sqrt((2 * monthly_demand_units * outputs.setup_cost_per_batch) / Math.max(0.01, holding_cost_per_unit_month)));
  const batches = monthly_demand_units / Math.max(1, candidate_batch_size);
  outputs.candidate_total_monthly_cost = round(batches * outputs.setup_cost_per_batch + candidate_batch_size / 2 * holding_cost_per_unit_month + monthly_demand_units * unit_production_cost, 2);

  for (const key of ["economic_batch_size", "candidate_total_monthly_cost", "setup_cost_per_batch"]) {
    if (!isFiniteNumber(outputs[key])) {
      outputs[key] = 0;
      warnings.push(`Non-finite output corrected to zero for public-safe response: ${key}`);
    }
  }

  return {
    status: warnings.length > 0 ? "REVIEW" : "OK",
    outputs,
    warnings,
    outputKeys: ["economic_batch_size", "candidate_total_monthly_cost", "setup_cost_per_batch"],
    redaction_status: "PUBLIC_SAFE_REDACTED"
  };
}
