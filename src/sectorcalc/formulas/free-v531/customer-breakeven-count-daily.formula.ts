import "server-only";

export type CalculationStatus = "OK" | "REVIEW" | "BLOCKED";
export type RedactionStatus = "PUBLIC_SAFE_REDACTED" | "REDACTION_NOT_REQUIRED" | "REDACTION_FAILED_BLOCKED";

export const toolKey = "customer-breakeven-count-daily";
export const formulaVersion = "1.0.0";

function isFiniteNumber(v: unknown): v is number {
  return typeof v === "number" && Number.isFinite(v);
}

function get(inputs: Record<string, number>, key: string): number {
  const v = inputs[key];
  return isFiniteNumber(v) ? v : 0;
}

function round(v: number, d: number): number {
  if (!isFiniteNumber(v)) return 0;
  const f = Math.pow(10, d);
  return Math.round(v * f) / f;
}

export function calculate(inputs: Record<string, number>): {
  status: CalculationStatus;
  outputs: Record<string, number>;
  warnings: string[];
  outputKeys: string[];
  redaction_status: RedactionStatus;
} {
  const warnings: string[] = [];
  const outputs: Record<string, number> = {};

  // Validate required inputs
  for (const key of ["daily_overhead", "average_ticket_revenue", "variable_cost_per_customer", "target_profit_daily", "operating_hours"]) {
    if (!isFiniteNumber(inputs[key])) {
      warnings.push("Missing or non-finite input: " + key);
    }
  }

  // Compute formula outputs
    const val_daily_overhead = get(inputs, "daily_overhead");
    const val_average_ticket_revenue = get(inputs, "average_ticket_revenue");
    const val_variable_cost_per_customer = get(inputs, "variable_cost_per_customer");
    const val_target_profit_daily = get(inputs, "target_profit_daily");
    const val_operating_hours = get(inputs, "operating_hours");
    outputs["breakeven_customer_count"] = round(val_daily_overhead * val_average_ticket_revenue * val_variable_cost_per_customer * val_target_profit_daily * val_operating_hours, 4);

  return {
    status: warnings.length > 0 ? "REVIEW" : "OK",
    outputs,
    warnings,
    outputKeys: ["breakeven_customer_count", "target_customer_count", "required_customers_per_hour"],
    redaction_status: "PUBLIC_SAFE_REDACTED",
  };
}
