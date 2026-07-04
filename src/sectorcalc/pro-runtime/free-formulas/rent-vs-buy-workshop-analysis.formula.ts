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

export const toolKey = "rent-vs-buy-workshop-analysis";
export const formulaVersion = "1.0.0";
export const publicFormulaExpressionPolicy = "FORBIDDEN" as const;

/**
 * Server-only deterministic formula module for Rent vs Buy Workshop Calculator.
 * Exact formula logic must remain server-side and must never be rendered in public UI, public schema, PDF export, JSON audit, or copy summary.
 */
export function calculate(inputs: Record<string, number>): CalculationResult {
  const warnings: string[] = [];
  const outputs: Record<string, number> = {};

  const monthly_rent = get(inputs, "monthly_rent");
  const purchase_price = get(inputs, "purchase_price");
  const down_payment = get(inputs, "down_payment");
  const annual_interest_rate = get(inputs, "annual_interest_rate");
  const loan_term_years = get(inputs, "loan_term_years");
  const owner_monthly_costs = get(inputs, "owner_monthly_costs");
  const annual_rent_escalation = get(inputs, "annual_rent_escalation");
  const horizon_years = get(inputs, "horizon_years");

  for (const key of ["monthly_rent", "purchase_price", "down_payment", "annual_interest_rate", "loan_term_years", "owner_monthly_costs", "annual_rent_escalation", "horizon_years"]) {
    const value = inputs[key];
    if (!isFiniteNumber(value)) {
      warnings.push(`Missing or non-finite input: ${key}`);
    }
  }

  const years = Math.max(1, horizon_years);
  let rentTotal = 0;
  for (let y = 0; y < Math.ceil(years); y += 1) { rentTotal += monthly_rent * 12 * Math.pow(1 + annual_rent_escalation / 100, y); }
  const principal = Math.max(0, purchase_price - down_payment);
  const monthlyRate = annual_interest_rate / 100 / 12;
  const months = Math.max(1, loan_term_years * 12);
  const monthlyPayment = monthlyRate === 0 ? principal / months : principal * monthlyRate / (1 - Math.pow(1 + monthlyRate, -months));
  const buyTotal = down_payment + monthlyPayment * Math.min(months, years * 12) + owner_monthly_costs * years * 12;
  outputs.rent_total_cost = round(rentTotal, 2);
  outputs.buy_total_cash_outflow = round(buyTotal, 2);
  outputs.buy_minus_rent_cash_delta = round(buyTotal - rentTotal, 2);

  for (const key of ["rent_total_cost", "buy_total_cash_outflow", "buy_minus_rent_cash_delta"]) {
    if (!isFiniteNumber(outputs[key])) {
      outputs[key] = 0;
      warnings.push(`Non-finite output corrected to zero for public-safe response: ${key}`);
    }
  }

  return {
    status: warnings.length > 0 ? "REVIEW" : "OK",
    outputs,
    warnings,
    outputKeys: ["rent_total_cost", "buy_total_cash_outflow", "buy_minus_rent_cash_delta"],
    redaction_status: "PUBLIC_SAFE_REDACTED"
  };
}
