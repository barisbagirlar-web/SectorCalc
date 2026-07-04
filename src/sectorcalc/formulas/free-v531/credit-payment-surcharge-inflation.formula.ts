import "server-only";

export type CalculationStatus = "OK" | "REVIEW" | "BLOCKED";
export type RedactionStatus = "PUBLIC_SAFE_REDACTED" | "REDACTION_NOT_REQUIRED" | "REDACTION_FAILED_BLOCKED";

export const toolKey = "credit-payment-surcharge-inflation";
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
  for (const key of ["invoice_amount", "payment_terms_days", "monthly_inflation_percent", "default_risk_percent", "financing_apr_percent", "admin_cost"]) {
    if (!isFiniteNumber(inputs[key])) {
      warnings.push("Missing or non-finite input: " + key);
    }
  }

  // Compute formula outputs
    const val_invoice_amount = get(inputs, "invoice_amount");
    const val_payment_terms_days = get(inputs, "payment_terms_days");
    const val_monthly_inflation_percent = get(inputs, "monthly_inflation_percent");
    const val_default_risk_percent = get(inputs, "default_risk_percent");
    const val_financing_apr_percent = get(inputs, "financing_apr_percent");
    const val_admin_cost = get(inputs, "admin_cost");
    outputs["recommended_surcharge"] = round(val_invoice_amount * val_payment_terms_days * val_monthly_inflation_percent * val_default_risk_percent * val_financing_apr_percent * val_admin_cost, 4);

  return {
    status: warnings.length > 0 ? "REVIEW" : "OK",
    outputs,
    warnings,
    outputKeys: ["recommended_surcharge", "protected_invoice_amount", "term_risk_cost"],
    redaction_status: "PUBLIC_SAFE_REDACTED",
  };
}
