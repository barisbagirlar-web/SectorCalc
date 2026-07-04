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

export const toolKey = "tire-shop-profit-per-set";
export const formulaVersion = "1.0.0";
export const publicFormulaExpressionPolicy = "FORBIDDEN" as const;

/**
 * Server-only deterministic formula module for Tire Shop Profit Calculator.
 * Exact formula logic must remain server-side and must never be rendered in public UI, public schema, PDF export, JSON audit, or copy summary.
 */
export function calculate(inputs: Record<string, number>): CalculationResult {
  const warnings: string[] = [];
  const outputs: Record<string, number> = {};

  const set_sale_price = get(inputs, "set_sale_price");
  const tire_purchase_cost = get(inputs, "tire_purchase_cost");
  const labor_minutes = get(inputs, "labor_minutes");
  const labor_rate_per_hour = get(inputs, "labor_rate_per_hour");
  const valve_and_weight_cost = get(inputs, "valve_and_weight_cost");
  const disposal_fee = get(inputs, "disposal_fee");
  const balancing_consumables = get(inputs, "balancing_consumables");
  const shop_overhead = get(inputs, "shop_overhead");

  for (const key of ["set_sale_price", "tire_purchase_cost", "labor_minutes", "labor_rate_per_hour", "valve_and_weight_cost", "disposal_fee", "balancing_consumables", "shop_overhead"]) {
    const value = inputs[key];
    if (!isFiniteNumber(value)) {
      warnings.push(`Missing or non-finite input: ${key}`);
    }
  }

  const laborCost = labor_minutes / 60 * labor_rate_per_hour;
  outputs.total_set_cost = round(tire_purchase_cost + laborCost + valve_and_weight_cost + disposal_fee + balancing_consumables + shop_overhead, 2);
  outputs.net_profit_per_set = round(set_sale_price - outputs.total_set_cost, 2);
  outputs.net_margin_percent = round(safeDiv(outputs.net_profit_per_set, set_sale_price) * 100, 2);

  for (const key of ["total_set_cost", "net_profit_per_set", "net_margin_percent"]) {
    if (!isFiniteNumber(outputs[key])) {
      outputs[key] = 0;
      warnings.push(`Non-finite output corrected to zero for public-safe response: ${key}`);
    }
  }

  return {
    status: warnings.length > 0 ? "REVIEW" : "OK",
    outputs,
    warnings,
    outputKeys: ["total_set_cost", "net_profit_per_set", "net_margin_percent"],
    redaction_status: "PUBLIC_SAFE_REDACTED"
  };
}
