import "server-only";

export type CalculationStatus = "OK" | "REVIEW" | "BLOCKED";
export type RedactionStatus = "PUBLIC_SAFE_REDACTED" | "REDACTION_NOT_REQUIRED" | "REDACTION_FAILED_BLOCKED";

export const toolKey = "accounts-receivable-risk-tracker";
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
  for (const key of ["past_due_amount", "days_past_due", "expected_collection_percent", "financing_apr_percent", "dispute_probability_percent"]) {
    if (!isFiniteNumber(inputs[key])) {
      warnings.push("Missing or non-finite input: " + key);
    }
  }

  // Compute formula outputs
    const val_past_due_amount = get(inputs, "past_due_amount");
    const val_days_past_due = get(inputs, "days_past_due");
    const val_expected_collection_percent = get(inputs, "expected_collection_percent");
    const val_financing_apr_percent = get(inputs, "financing_apr_percent");
    const val_dispute_probability_percent = get(inputs, "dispute_probability_percent");
    outputs["cash_at_risk"] = round(val_past_due_amount * val_days_past_due * val_expected_collection_percent * val_financing_apr_percent * val_dispute_probability_percent, 4);

  return {
    status: warnings.length > 0 ? "REVIEW" : "OK",
    outputs,
    warnings,
    outputKeys: ["cash_at_risk", "carrying_cost", "expected_recoverable_cash"],
    redaction_status: "PUBLIC_SAFE_REDACTED",
  };
}
