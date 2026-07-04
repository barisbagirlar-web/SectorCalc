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

export const toolKey = "accounts-receivable-risk-tracker";
export const formulaVersion = "1.0.0";
export const publicFormulaExpressionPolicy = "FORBIDDEN" as const;

/**
 * Server-only deterministic formula module for Accounts Receivable Risk Tracker Calculator.
 * Exact formula logic must remain server-side and must never be rendered in public UI, public schema, PDF export, JSON audit, or copy summary.
 */
export function calculate(inputs: Record<string, number>): CalculationResult {
  const warnings: string[] = [];
  const outputs: Record<string, number> = {};

  const past_due_amount = get(inputs, "past_due_amount");
  const days_past_due = get(inputs, "days_past_due");
  const expected_collection_percent = get(inputs, "expected_collection_percent");
  const financing_apr_percent = get(inputs, "financing_apr_percent");
  const dispute_probability_percent = get(inputs, "dispute_probability_percent");

  for (const key of ["past_due_amount", "days_past_due", "expected_collection_percent", "financing_apr_percent", "dispute_probability_percent"]) {
    const value = inputs[key];
    if (!isFiniteNumber(value)) {
      warnings.push(`Missing or non-finite input: ${key}`);
    }
  }

  outputs.expected_recoverable_cash = round(past_due_amount * expected_collection_percent / 100 * (1 - dispute_probability_percent / 100), 2);
  outputs.cash_at_risk = round(Math.max(0, past_due_amount - outputs.expected_recoverable_cash), 2);
  outputs.carrying_cost = round(past_due_amount * financing_apr_percent / 100 * days_past_due / 365, 2);

  for (const key of ["cash_at_risk", "carrying_cost", "expected_recoverable_cash"]) {
    if (!isFiniteNumber(outputs[key])) {
      outputs[key] = 0;
      warnings.push(`Non-finite output corrected to zero for public-safe response: ${key}`);
    }
  }

  return {
    status: warnings.length > 0 ? "REVIEW" : "OK",
    outputs,
    warnings,
    outputKeys: ["cash_at_risk", "carrying_cost", "expected_recoverable_cash"],
    redaction_status: "PUBLIC_SAFE_REDACTED"
  };
}
