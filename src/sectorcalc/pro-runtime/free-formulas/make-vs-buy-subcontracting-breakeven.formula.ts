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

export const toolKey = "make-vs-buy-subcontracting-breakeven";
export const formulaVersion = "1.0.0";
export const publicFormulaExpressionPolicy = "FORBIDDEN" as const;

/**
 * Server-only deterministic formula module for Make vs Buy Calculator.
 * Exact formula logic must remain server-side and must never be rendered in public UI, public schema, PDF export, JSON audit, or copy summary.
 */
export function calculate(inputs: Record<string, number>): CalculationResult {
  const warnings: string[] = [];
  const outputs: Record<string, number> = {};

  const inhouse_setup_cost = get(inputs, "inhouse_setup_cost");
  const inhouse_unit_cost = get(inputs, "inhouse_unit_cost");
  const outsourced_unit_price = get(inputs, "outsourced_unit_price");
  const supplier_freight_per_order = get(inputs, "supplier_freight_per_order");
  const quantity = get(inputs, "quantity");
  const capacity_opportunity_cost = get(inputs, "capacity_opportunity_cost");

  for (const key of ["inhouse_setup_cost", "inhouse_unit_cost", "outsourced_unit_price", "supplier_freight_per_order", "quantity", "capacity_opportunity_cost"]) {
    const value = inputs[key];
    if (!isFiniteNumber(value)) {
      warnings.push(`Missing or non-finite input: ${key}`);
    }
  }

  outputs.inhouse_total_cost = round(inhouse_setup_cost + quantity * inhouse_unit_cost + capacity_opportunity_cost, 2);
  outputs.outsourced_total_cost = round(quantity * outsourced_unit_price + supplier_freight_per_order, 2);
  outputs.make_minus_buy_delta = round(outputs.inhouse_total_cost - outputs.outsourced_total_cost, 2);
  outputs.breakeven_quantity = round((inhouse_setup_cost + capacity_opportunity_cost - supplier_freight_per_order) / Math.max(0.01, outsourced_unit_price - inhouse_unit_cost), 2);

  for (const key of ["inhouse_total_cost", "outsourced_total_cost", "make_minus_buy_delta", "breakeven_quantity"]) {
    if (!isFiniteNumber(outputs[key])) {
      outputs[key] = 0;
      warnings.push(`Non-finite output corrected to zero for public-safe response: ${key}`);
    }
  }

  return {
    status: warnings.length > 0 ? "REVIEW" : "OK",
    outputs,
    warnings,
    outputKeys: ["inhouse_total_cost", "outsourced_total_cost", "make_minus_buy_delta", "breakeven_quantity"],
    redaction_status: "PUBLIC_SAFE_REDACTED"
  };
}
