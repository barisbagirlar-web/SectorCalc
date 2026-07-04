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

export const toolKey = "quote-markup-safety-hidden-costs";
export const formulaVersion = "1.0.0";
export const publicFormulaExpressionPolicy = "FORBIDDEN" as const;

/**
 * Server-only deterministic formula module for Quote Markup Safety Analyzer Calculator.
 * Exact formula logic must remain server-side and must never be rendered in public UI, public schema, PDF export, JSON audit, or copy summary.
 */
export function calculate(inputs: Record<string, number>): CalculationResult {
  const warnings: string[] = [];
  const outputs: Record<string, number> = {};

  const direct_material_cost = get(inputs, "direct_material_cost");
  const direct_labor_hours = get(inputs, "direct_labor_hours");
  const labor_rate_per_hour = get(inputs, "labor_rate_per_hour");
  const shop_overhead_percent = get(inputs, "shop_overhead_percent");
  const hidden_consumables_cost = get(inputs, "hidden_consumables_cost");
  const contingency_percent = get(inputs, "contingency_percent");
  const quoted_price = get(inputs, "quoted_price");

  for (const key of ["direct_material_cost", "direct_labor_hours", "labor_rate_per_hour", "shop_overhead_percent", "hidden_consumables_cost", "contingency_percent", "quoted_price"]) {
    const value = inputs[key];
    if (!isFiniteNumber(value)) {
      warnings.push(`Missing or non-finite input: ${key}`);
    }
  }

  const labor = direct_labor_hours * labor_rate_per_hour;
  const baseCost = direct_material_cost + labor + hidden_consumables_cost;
  const overhead = baseCost * shop_overhead_percent / 100;
  outputs.true_job_cost = round(baseCost + overhead, 2);
  outputs.minimum_safe_quote = round(outputs.true_job_cost * (1 + contingency_percent / 100), 2);
  outputs.quoted_margin_percent = round(safeDiv(quoted_price - outputs.true_job_cost, quoted_price) * 100, 2);

  for (const key of ["true_job_cost", "quoted_margin_percent", "minimum_safe_quote"]) {
    if (!isFiniteNumber(outputs[key])) {
      outputs[key] = 0;
      warnings.push(`Non-finite output corrected to zero for public-safe response: ${key}`);
    }
  }

  return {
    status: warnings.length > 0 ? "REVIEW" : "OK",
    outputs,
    warnings,
    outputKeys: ["true_job_cost", "quoted_margin_percent", "minimum_safe_quote"],
    redaction_status: "PUBLIC_SAFE_REDACTED"
  };
}
