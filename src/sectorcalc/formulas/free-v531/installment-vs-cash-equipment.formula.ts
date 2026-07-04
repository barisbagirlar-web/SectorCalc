import "server-only";

export type CalculationStatus = "OK" | "REVIEW" | "BLOCKED";
export type RedactionStatus = "PUBLIC_SAFE_REDACTED" | "REDACTION_NOT_REQUIRED" | "REDACTION_FAILED_BLOCKED";

export const toolKey = "installment-vs-cash-equipment";
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
  for (const key of ["equipment_price", "down_payment", "annual_interest_rate", "term_months", "monthly_revenue_increment", "current_cash_reserve", "minimum_cash_reserve"]) {
    if (!isFiniteNumber(inputs[key])) {
      warnings.push("Missing or non-finite input: " + key);
    }
  }

  // Compute formula outputs
    const val_equipment_price = get(inputs, "equipment_price");
    const val_down_payment = get(inputs, "down_payment");
    const val_annual_interest_rate = get(inputs, "annual_interest_rate");
    const val_term_months = get(inputs, "term_months");
    const val_monthly_revenue_increment = get(inputs, "monthly_revenue_increment");
    const val_current_cash_reserve = get(inputs, "current_cash_reserve");
    const val_minimum_cash_reserve = get(inputs, "minimum_cash_reserve");
    outputs["payback_months"] = round(val_equipment_price * val_down_payment * val_annual_interest_rate * val_term_months * val_monthly_revenue_increment * val_current_cash_reserve * val_minimum_cash_reserve, 4);

  return {
    status: warnings.length > 0 ? "REVIEW" : "OK",
    outputs,
    warnings,
    outputKeys: ["monthly_installment", "cash_reserve_after_purchase", "payback_months"],
    redaction_status: "PUBLIC_SAFE_REDACTED",
  };
}
