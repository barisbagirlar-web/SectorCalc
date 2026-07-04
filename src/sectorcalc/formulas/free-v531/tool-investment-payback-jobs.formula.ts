import "server-only";

export type CalculationStatus = "OK" | "REVIEW" | "BLOCKED";
export type RedactionStatus = "PUBLIC_SAFE_REDACTED" | "REDACTION_NOT_REQUIRED" | "REDACTION_FAILED_BLOCKED";

export const toolKey = "tool-investment-payback-jobs";
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
  for (const key of ["tool_cost", "gross_profit_per_job", "expected_jobs_per_month", "monthly_tool_maintenance", "scrap_risk_per_job"]) {
    if (!isFiniteNumber(inputs[key])) {
      warnings.push("Missing or non-finite input: " + key);
    }
  }

  // Compute formula outputs
    const val_tool_cost = get(inputs, "tool_cost");
    const val_gross_profit_per_job = get(inputs, "gross_profit_per_job");
    const val_expected_jobs_per_month = get(inputs, "expected_jobs_per_month");
    const val_monthly_tool_maintenance = get(inputs, "monthly_tool_maintenance");
    const val_scrap_risk_per_job = get(inputs, "scrap_risk_per_job");
    outputs["jobs_to_payback"] = round(val_tool_cost * val_gross_profit_per_job * val_expected_jobs_per_month * val_monthly_tool_maintenance * val_scrap_risk_per_job, 4);

  return {
    status: warnings.length > 0 ? "REVIEW" : "OK",
    outputs,
    warnings,
    outputKeys: ["jobs_to_payback", "months_to_payback", "net_profit_per_job_after_tool_risk"],
    redaction_status: "PUBLIC_SAFE_REDACTED",
  };
}
