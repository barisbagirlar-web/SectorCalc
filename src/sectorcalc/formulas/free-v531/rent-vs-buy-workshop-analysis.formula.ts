import "server-only";

export type CalculationStatus = "OK" | "REVIEW" | "BLOCKED";
export type RedactionStatus = "PUBLIC_SAFE_REDACTED" | "REDACTION_NOT_REQUIRED" | "REDACTION_FAILED_BLOCKED";

export const toolKey = "rent-vs-buy-workshop-analysis";
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
  for (const key of ["monthly_rent", "purchase_price", "down_payment", "annual_interest_rate", "loan_term_years", "owner_monthly_costs", "annual_rent_escalation", "horizon_years"]) {
    if (!isFiniteNumber(inputs[key])) {
      warnings.push("Missing or non-finite input: " + key);
    }
  }

  // Compute formula outputs
    const val_monthly_rent = get(inputs, "monthly_rent");
    const val_purchase_price = get(inputs, "purchase_price");
    const val_down_payment = get(inputs, "down_payment");
    const val_annual_interest_rate = get(inputs, "annual_interest_rate");
    const val_loan_term_years = get(inputs, "loan_term_years");
    const val_owner_monthly_costs = get(inputs, "owner_monthly_costs");
    const val_annual_rent_escalation = get(inputs, "annual_rent_escalation");
    const val_horizon_years = get(inputs, "horizon_years");
    outputs["buy_minus_rent_cash_delta"] = round(val_monthly_rent * val_purchase_price * val_down_payment * val_annual_interest_rate * val_loan_term_years * val_owner_monthly_costs * val_annual_rent_escalation * val_horizon_years, 4);

  return {
    status: warnings.length > 0 ? "REVIEW" : "OK",
    outputs,
    warnings,
    outputKeys: ["rent_total_cost", "buy_total_cash_outflow", "buy_minus_rent_cash_delta"],
    redaction_status: "PUBLIC_SAFE_REDACTED",
  };
}
