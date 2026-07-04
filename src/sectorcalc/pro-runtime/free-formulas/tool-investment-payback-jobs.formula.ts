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

export const toolKey = "tool-investment-payback-jobs";
export const formulaVersion = "1.0.0";
export const publicFormulaExpressionPolicy = "FORBIDDEN" as const;

/**
 * Server-only deterministic formula module for Tool Investment Payback Calculator.
 * Exact formula logic must remain server-side and must never be rendered in public UI, public schema, PDF export, JSON audit, or copy summary.
 */
export function calculate(inputs: Record<string, number>): CalculationResult {
  const warnings: string[] = [];
  const outputs: Record<string, number> = {};

  const tool_cost = get(inputs, "tool_cost");
  const gross_profit_per_job = get(inputs, "gross_profit_per_job");
  const expected_jobs_per_month = get(inputs, "expected_jobs_per_month");
  const monthly_tool_maintenance = get(inputs, "monthly_tool_maintenance");
  const scrap_risk_per_job = get(inputs, "scrap_risk_per_job");

  for (const key of ["tool_cost", "gross_profit_per_job", "expected_jobs_per_month", "monthly_tool_maintenance", "scrap_risk_per_job"]) {
    const value = inputs[key];
    if (!isFiniteNumber(value)) {
      warnings.push(`Missing or non-finite input: ${key}`);
    }
  }

  const netProfit = Math.max(0.01, gross_profit_per_job - scrap_risk_per_job);
  outputs.net_profit_per_job_after_tool_risk = round(netProfit, 2);
  outputs.jobs_to_payback = Math.ceil(tool_cost / netProfit);
  outputs.months_to_payback = round(outputs.jobs_to_payback / Math.max(0.01, expected_jobs_per_month), 1);

  for (const key of ["jobs_to_payback", "months_to_payback", "net_profit_per_job_after_tool_risk"]) {
    if (!isFiniteNumber(outputs[key])) {
      outputs[key] = 0;
      warnings.push(`Non-finite output corrected to zero for public-safe response: ${key}`);
    }
  }

  return {
    status: warnings.length > 0 ? "REVIEW" : "OK",
    outputs,
    warnings,
    outputKeys: ["jobs_to_payback", "months_to_payback", "net_profit_per_job_after_tool_risk"],
    redaction_status: "PUBLIC_SAFE_REDACTED"
  };
}
