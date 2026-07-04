import "server-only";

export type CalculationStatus = "OK" | "REVIEW" | "BLOCKED";
export type RedactionStatus = "PUBLIC_SAFE_REDACTED" | "REDACTION_NOT_REQUIRED" | "REDACTION_FAILED_BLOCKED";

export const toolKey = "tire-shop-profit-per-set";
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
  for (const key of ["set_sale_price", "tire_purchase_cost", "labor_minutes", "labor_rate_per_hour", "valve_and_weight_cost", "disposal_fee", "balancing_consumables", "shop_overhead"]) {
    if (!isFiniteNumber(inputs[key])) {
      warnings.push("Missing or non-finite input: " + key);
    }
  }

  // Compute formula outputs
    const val_set_sale_price = get(inputs, "set_sale_price");
    const val_tire_purchase_cost = get(inputs, "tire_purchase_cost");
    const val_labor_minutes = get(inputs, "labor_minutes");
    const val_labor_rate_per_hour = get(inputs, "labor_rate_per_hour");
    const val_valve_and_weight_cost = get(inputs, "valve_and_weight_cost");
    const val_disposal_fee = get(inputs, "disposal_fee");
    const val_balancing_consumables = get(inputs, "balancing_consumables");
    const val_shop_overhead = get(inputs, "shop_overhead");
    outputs["net_profit_per_set"] = round(val_set_sale_price * val_tire_purchase_cost * val_labor_minutes * val_labor_rate_per_hour * val_valve_and_weight_cost * val_disposal_fee * val_balancing_consumables * val_shop_overhead, 4);

  return {
    status: warnings.length > 0 ? "REVIEW" : "OK",
    outputs,
    warnings,
    outputKeys: ["total_set_cost", "net_profit_per_set", "net_margin_percent"],
    redaction_status: "PUBLIC_SAFE_REDACTED",
  };
}
