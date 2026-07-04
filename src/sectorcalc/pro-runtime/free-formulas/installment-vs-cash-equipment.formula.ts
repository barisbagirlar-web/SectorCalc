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

export const toolKey = "installment-vs-cash-equipment";
export const formulaVersion = "1.0.0";
export const publicFormulaExpressionPolicy = "FORBIDDEN" as const;

/**
 * Server-only deterministic formula module for Installment vs Cash Equipment Purchase Calculator.
 * Exact formula logic must remain server-side and must never be rendered in public UI, public schema, PDF export, JSON audit, or copy summary.
 */
export function calculate(inputs: Record<string, number>): CalculationResult {
  const warnings: string[] = [];
  const outputs: Record<string, number> = {};

  const equipment_price = get(inputs, "equipment_price");
  const down_payment = get(inputs, "down_payment");
  const annual_interest_rate = get(inputs, "annual_interest_rate");
  const term_months = get(inputs, "term_months");
  const monthly_revenue_increment = get(inputs, "monthly_revenue_increment");
  const current_cash_reserve = get(inputs, "current_cash_reserve");
  const minimum_cash_reserve = get(inputs, "minimum_cash_reserve");

  for (const key of ["equipment_price", "down_payment", "annual_interest_rate", "term_months", "monthly_revenue_increment", "current_cash_reserve", "minimum_cash_reserve"]) {
    const value = inputs[key];
    if (!isFiniteNumber(value)) {
      warnings.push(`Missing or non-finite input: ${key}`);
    }
  }

  const principal = Math.max(0, equipment_price - down_payment);
  const monthlyRate = annual_interest_rate / 100 / 12;
  const months = Math.max(1, term_months);
  outputs.monthly_installment = round(monthlyRate === 0 ? principal / months : principal * monthlyRate / (1 - Math.pow(1 + monthlyRate, -months)), 2);
  outputs.cash_reserve_after_purchase = round(current_cash_reserve - equipment_price, 2);
  outputs.payback_months = round(equipment_price / Math.max(0.01, monthly_revenue_increment), 1);

  for (const key of ["monthly_installment", "cash_reserve_after_purchase", "payback_months"]) {
    if (!isFiniteNumber(outputs[key])) {
      outputs[key] = 0;
      warnings.push(`Non-finite output corrected to zero for public-safe response: ${key}`);
    }
  }

  return {
    status: warnings.length > 0 ? "REVIEW" : "OK",
    outputs,
    warnings,
    outputKeys: ["monthly_installment", "cash_reserve_after_purchase", "payback_months"],
    redaction_status: "PUBLIC_SAFE_REDACTED"
  };
}
