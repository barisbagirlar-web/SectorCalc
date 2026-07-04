import "server-only";

export type CalculationStatus = "OK" | "REVIEW" | "BLOCKED";
export type RedactionStatus = "PUBLIC_SAFE_REDACTED" | "REDACTION_NOT_REQUIRED" | "REDACTION_FAILED_BLOCKED";

export const toolKey = "commodity-price-escalation-clause";
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
  for (const key of ["stock_quantity", "purchase_unit_cost", "current_replacement_unit_cost", "monthly_storage_cost", "holding_months", "target_margin_percent"]) {
    if (!isFiniteNumber(inputs[key])) {
      warnings.push("Missing or non-finite input: " + key);
    }
  }

  // Compute formula outputs
    const val_stock_quantity = get(inputs, "stock_quantity");
    const val_purchase_unit_cost = get(inputs, "purchase_unit_cost");
    const val_current_replacement_unit_cost = get(inputs, "current_replacement_unit_cost");
    const val_monthly_storage_cost = get(inputs, "monthly_storage_cost");
    const val_holding_months = get(inputs, "holding_months");
    const val_target_margin_percent = get(inputs, "target_margin_percent");
    outputs["minimum_resale_unit_price"] = round(val_stock_quantity * val_purchase_unit_cost * val_current_replacement_unit_cost * val_monthly_storage_cost * val_holding_months * val_target_margin_percent, 4);

  return {
    status: warnings.length > 0 ? "REVIEW" : "OK",
    outputs,
    warnings,
    outputKeys: ["minimum_resale_unit_price", "inventory_value_delta", "storage_cost_per_unit"],
    redaction_status: "PUBLIC_SAFE_REDACTED",
  };
}
