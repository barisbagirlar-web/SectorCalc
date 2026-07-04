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

export const toolKey = "credit-payment-surcharge-inflation";
export const formulaVersion = "1.0.0";
export const publicFormulaExpressionPolicy = "FORBIDDEN" as const;

/**
 * Server-only deterministic formula module for Credit Payment Surcharge Calculator.
 * Exact formula logic must remain server-side and must never be rendered in public UI, public schema, PDF export, JSON audit, or copy summary.
 */
export function calculate(inputs: Record<string, number>): CalculationResult {
  const warnings: string[] = [];
  const outputs: Record<string, number> = {};

  const invoice_amount = get(inputs, "invoice_amount");
  const payment_terms_days = get(inputs, "payment_terms_days");
  const monthly_inflation_percent = get(inputs, "monthly_inflation_percent");
  const default_risk_percent = get(inputs, "default_risk_percent");
  const financing_apr_percent = get(inputs, "financing_apr_percent");
  const admin_cost = get(inputs, "admin_cost");

  for (const key of ["invoice_amount", "payment_terms_days", "monthly_inflation_percent", "default_risk_percent", "financing_apr_percent", "admin_cost"]) {
    const value = inputs[key];
    if (!isFiniteNumber(value)) {
      warnings.push(`Missing or non-finite input: ${key}`);
    }
  }

  const months = payment_terms_days / 30;
  const inflationCost = invoice_amount * monthly_inflation_percent / 100 * months;
  const financingCost = invoice_amount * financing_apr_percent / 100 * payment_terms_days / 365;
  const defaultCost = invoice_amount * default_risk_percent / 100;
  outputs.term_risk_cost = round(inflationCost + financingCost + defaultCost + admin_cost, 2);
  outputs.recommended_surcharge = outputs.term_risk_cost;
  outputs.protected_invoice_amount = round(invoice_amount + outputs.recommended_surcharge, 2);

  for (const key of ["recommended_surcharge", "protected_invoice_amount", "term_risk_cost"]) {
    if (!isFiniteNumber(outputs[key])) {
      outputs[key] = 0;
      warnings.push(`Non-finite output corrected to zero for public-safe response: ${key}`);
    }
  }

  return {
    status: warnings.length > 0 ? "REVIEW" : "OK",
    outputs,
    warnings,
    outputKeys: ["recommended_surcharge", "protected_invoice_amount", "term_risk_cost"],
    redaction_status: "PUBLIC_SAFE_REDACTED"
  };
}
