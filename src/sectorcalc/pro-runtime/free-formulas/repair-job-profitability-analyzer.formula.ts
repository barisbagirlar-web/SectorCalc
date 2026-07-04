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

export const toolKey = "repair-job-profitability-analyzer";
export const formulaVersion = "1.0.0";
export const publicFormulaExpressionPolicy = "FORBIDDEN" as const;

/**
 * Server-only deterministic formula module for Repair Job Profitability Analyzer Calculator.
 * Exact formula logic must remain server-side and must never be rendered in public UI, public schema, PDF export, JSON audit, or copy summary.
 */
export function calculate(inputs: Record<string, number>): CalculationResult {
  const warnings: string[] = [];
  const outputs: Record<string, number> = {};

  const ticket_revenue = get(inputs, "ticket_revenue");
  const parts_cost = get(inputs, "parts_cost");
  const consumables_cost = get(inputs, "consumables_cost");
  const travel_distance_km = get(inputs, "travel_distance_km");
  const vehicle_cost_per_km = get(inputs, "vehicle_cost_per_km");
  const labor_hours = get(inputs, "labor_hours");
  const labor_cost_per_hour = get(inputs, "labor_cost_per_hour");
  const unbilled_hours = get(inputs, "unbilled_hours");

  for (const key of ["ticket_revenue", "parts_cost", "consumables_cost", "travel_distance_km", "vehicle_cost_per_km", "labor_hours", "labor_cost_per_hour", "unbilled_hours"]) {
    const value = inputs[key];
    if (!isFiniteNumber(value)) {
      warnings.push(`Missing or non-finite input: ${key}`);
    }
  }

  const travelCost = travel_distance_km * vehicle_cost_per_km;
  const laborCost = (labor_hours + unbilled_hours) * labor_cost_per_hour;
  const hidden = consumables_cost + travelCost + unbilled_hours * labor_cost_per_hour;
  const cost = parts_cost + consumables_cost + travelCost + laborCost;
  outputs.net_profit_per_ticket = round(ticket_revenue - cost, 2);
  outputs.net_margin_percent = round(safeDiv(outputs.net_profit_per_ticket, ticket_revenue) * 100, 2);
  outputs.hidden_cost_total = round(hidden, 2);

  for (const key of ["net_profit_per_ticket", "net_margin_percent", "hidden_cost_total"]) {
    if (!isFiniteNumber(outputs[key])) {
      outputs[key] = 0;
      warnings.push(`Non-finite output corrected to zero for public-safe response: ${key}`);
    }
  }

  return {
    status: warnings.length > 0 ? "REVIEW" : "OK",
    outputs,
    warnings,
    outputKeys: ["net_profit_per_ticket", "net_margin_percent", "hidden_cost_total"],
    redaction_status: "PUBLIC_SAFE_REDACTED"
  };
}
