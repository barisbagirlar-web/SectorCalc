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

export const toolKey = "customer-breakeven-count-daily";
export const formulaVersion = "1.0.0";
export const publicFormulaExpressionPolicy = "FORBIDDEN" as const;

/**
 * Server-only deterministic formula module for Daily Customer Breakeven Count Calculator.
 * Exact formula logic must remain server-side and must never be rendered in public UI, public schema, PDF export, JSON audit, or copy summary.
 */
export function calculate(inputs: Record<string, number>): CalculationResult {
  const warnings: string[] = [];
  const outputs: Record<string, number> = {};

  const daily_overhead = get(inputs, "daily_overhead");
  const average_ticket_revenue = get(inputs, "average_ticket_revenue");
  const variable_cost_per_customer = get(inputs, "variable_cost_per_customer");
  const target_profit_daily = get(inputs, "target_profit_daily");
  const operating_hours = get(inputs, "operating_hours");

  for (const key of ["daily_overhead", "average_ticket_revenue", "variable_cost_per_customer", "target_profit_daily", "operating_hours"]) {
    const value = inputs[key];
    if (!isFiniteNumber(value)) {
      warnings.push(`Missing or non-finite input: ${key}`);
    }
  }

  const contribution = Math.max(0.01, average_ticket_revenue - variable_cost_per_customer);
  outputs.breakeven_customer_count = Math.ceil(daily_overhead / contribution);
  outputs.target_customer_count = Math.ceil((daily_overhead + target_profit_daily) / contribution);
  outputs.required_customers_per_hour = round(outputs.target_customer_count / Math.max(0.01, operating_hours), 2);

  for (const key of ["breakeven_customer_count", "target_customer_count", "required_customers_per_hour"]) {
    if (!isFiniteNumber(outputs[key])) {
      outputs[key] = 0;
      warnings.push(`Non-finite output corrected to zero for public-safe response: ${key}`);
    }
  }

  return {
    status: warnings.length > 0 ? "REVIEW" : "OK",
    outputs,
    warnings,
    outputKeys: ["breakeven_customer_count", "target_customer_count", "required_customers_per_hour"],
    redaction_status: "PUBLIC_SAFE_REDACTED"
  };
}
