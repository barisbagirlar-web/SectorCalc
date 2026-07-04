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

export const toolKey = "commodity-price-escalation-clause";
export const formulaVersion = "1.0.0";
export const publicFormulaExpressionPolicy = "FORBIDDEN" as const;

/**
 * Server-only deterministic formula module for Commodity Price Escalation Calculator.
 * Exact formula logic must remain server-side and must never be rendered in public UI, public schema, PDF export, JSON audit, or copy summary.
 */
export function calculate(inputs: Record<string, number>): CalculationResult {
  const warnings: string[] = [];
  const outputs: Record<string, number> = {};

  const stock_quantity = get(inputs, "stock_quantity");
  const purchase_unit_cost = get(inputs, "purchase_unit_cost");
  const current_replacement_unit_cost = get(inputs, "current_replacement_unit_cost");
  const monthly_storage_cost = get(inputs, "monthly_storage_cost");
  const holding_months = get(inputs, "holding_months");
  const target_margin_percent = get(inputs, "target_margin_percent");

  for (const key of ["stock_quantity", "purchase_unit_cost", "current_replacement_unit_cost", "monthly_storage_cost", "holding_months", "target_margin_percent"]) {
    const value = inputs[key];
    if (!isFiniteNumber(value)) {
      warnings.push(`Missing or non-finite input: ${key}`);
    }
  }

  outputs.storage_cost_per_unit = round((monthly_storage_cost * holding_months) / Math.max(1, stock_quantity), 2);
  const economicCost = Math.max(purchase_unit_cost, current_replacement_unit_cost) + outputs.storage_cost_per_unit;
  outputs.minimum_resale_unit_price = round(economicCost * (1 + target_margin_percent / 100), 2);
  outputs.inventory_value_delta = round(stock_quantity * (current_replacement_unit_cost - purchase_unit_cost), 2);

  for (const key of ["minimum_resale_unit_price", "inventory_value_delta", "storage_cost_per_unit"]) {
    if (!isFiniteNumber(outputs[key])) {
      outputs[key] = 0;
      warnings.push(`Non-finite output corrected to zero for public-safe response: ${key}`);
    }
  }

  return {
    status: warnings.length > 0 ? "REVIEW" : "OK",
    outputs,
    warnings,
    outputKeys: ["minimum_resale_unit_price", "inventory_value_delta", "storage_cost_per_unit"],
    redaction_status: "PUBLIC_SAFE_REDACTED"
  };
}
