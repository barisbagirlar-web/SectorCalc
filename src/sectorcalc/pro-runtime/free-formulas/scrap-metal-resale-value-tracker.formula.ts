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

export const toolKey = "scrap-metal-resale-value-tracker";
export const formulaVersion = "1.0.0";
export const publicFormulaExpressionPolicy = "FORBIDDEN" as const;

/**
 * Server-only deterministic formula module for Scrap Metal Resale Value Calculator.
 * Exact formula logic must remain server-side and must never be rendered in public UI, public schema, PDF export, JSON audit, or copy summary.
 */
export function calculate(inputs: Record<string, number>): CalculationResult {
  const warnings: string[] = [];
  const outputs: Record<string, number> = {};

  const steel_scrap_kg = get(inputs, "steel_scrap_kg");
  const aluminum_scrap_kg = get(inputs, "aluminum_scrap_kg");
  const copper_scrap_kg = get(inputs, "copper_scrap_kg");
  const steel_price_per_kg = get(inputs, "steel_price_per_kg");
  const aluminum_price_per_kg = get(inputs, "aluminum_price_per_kg");
  const copper_price_per_kg = get(inputs, "copper_price_per_kg");
  const contamination_discount_percent = get(inputs, "contamination_discount_percent");

  for (const key of ["steel_scrap_kg", "aluminum_scrap_kg", "copper_scrap_kg", "steel_price_per_kg", "aluminum_price_per_kg", "copper_price_per_kg", "contamination_discount_percent"]) {
    const value = inputs[key];
    if (!isFiniteNumber(value)) {
      warnings.push(`Missing or non-finite input: ${key}`);
    }
  }

  outputs.gross_scrap_value = round(steel_scrap_kg * steel_price_per_kg + aluminum_scrap_kg * aluminum_price_per_kg + copper_scrap_kg * copper_price_per_kg, 2);
  outputs.discount_loss = round(outputs.gross_scrap_value * contamination_discount_percent / 100, 2);
  outputs.net_scrap_value = round(outputs.gross_scrap_value - outputs.discount_loss, 2);

  for (const key of ["gross_scrap_value", "net_scrap_value", "discount_loss"]) {
    if (!isFiniteNumber(outputs[key])) {
      outputs[key] = 0;
      warnings.push(`Non-finite output corrected to zero for public-safe response: ${key}`);
    }
  }

  return {
    status: warnings.length > 0 ? "REVIEW" : "OK",
    outputs,
    warnings,
    outputKeys: ["gross_scrap_value", "net_scrap_value", "discount_loss"],
    redaction_status: "PUBLIC_SAFE_REDACTED"
  };
}
