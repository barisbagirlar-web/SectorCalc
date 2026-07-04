import "server-only";

export type CalculationStatus = "OK" | "REVIEW" | "BLOCKED";
export type RedactionStatus = "PUBLIC_SAFE_REDACTED" | "REDACTION_NOT_REQUIRED" | "REDACTION_FAILED_BLOCKED";

export const toolKey = "make-vs-buy-subcontracting-breakeven";
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
  for (const key of ["inhouse_setup_cost", "inhouse_unit_cost", "outsourced_unit_price", "supplier_freight_per_order", "quantity", "capacity_opportunity_cost"]) {
    if (!isFiniteNumber(inputs[key])) {
      warnings.push("Missing or non-finite input: " + key);
    }
  }

  // Compute formula outputs
    const val_inhouse_setup_cost = get(inputs, "inhouse_setup_cost");
    const val_inhouse_unit_cost = get(inputs, "inhouse_unit_cost");
    const val_outsourced_unit_price = get(inputs, "outsourced_unit_price");
    const val_supplier_freight_per_order = get(inputs, "supplier_freight_per_order");
    const val_quantity = get(inputs, "quantity");
    const val_capacity_opportunity_cost = get(inputs, "capacity_opportunity_cost");
    outputs["make_minus_buy_delta"] = round(val_inhouse_setup_cost * val_inhouse_unit_cost * val_outsourced_unit_price * val_supplier_freight_per_order * val_quantity * val_capacity_opportunity_cost, 4);

  return {
    status: warnings.length > 0 ? "REVIEW" : "OK",
    outputs,
    warnings,
    outputKeys: ["inhouse_total_cost", "outsourced_total_cost", "make_minus_buy_delta", "breakeven_quantity"],
    redaction_status: "PUBLIC_SAFE_REDACTED",
  };
}
