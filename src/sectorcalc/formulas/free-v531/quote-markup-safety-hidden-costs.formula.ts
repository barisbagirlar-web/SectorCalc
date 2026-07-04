import "server-only";

export type CalculationStatus = "OK" | "REVIEW" | "BLOCKED";
export type RedactionStatus = "PUBLIC_SAFE_REDACTED" | "REDACTION_NOT_REQUIRED" | "REDACTION_FAILED_BLOCKED";

export const toolKey = "quote-markup-safety-hidden-costs";
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
  for (const key of ["direct_material_cost", "direct_labor_hours", "labor_rate_per_hour", "shop_overhead_percent", "hidden_consumables_cost", "contingency_percent", "quoted_price"]) {
    if (!isFiniteNumber(inputs[key])) {
      warnings.push("Missing or non-finite input: " + key);
    }
  }

  // Compute formula outputs
    const val_direct_material_cost = get(inputs, "direct_material_cost");
    const val_direct_labor_hours = get(inputs, "direct_labor_hours");
    const val_labor_rate_per_hour = get(inputs, "labor_rate_per_hour");
    const val_shop_overhead_percent = get(inputs, "shop_overhead_percent");
    const val_hidden_consumables_cost = get(inputs, "hidden_consumables_cost");
    const val_contingency_percent = get(inputs, "contingency_percent");
    const val_quoted_price = get(inputs, "quoted_price");
    outputs["quoted_margin_percent"] = round(val_direct_material_cost * val_direct_labor_hours * val_labor_rate_per_hour * val_shop_overhead_percent * val_hidden_consumables_cost * val_contingency_percent * val_quoted_price, 4);

  return {
    status: warnings.length > 0 ? "REVIEW" : "OK",
    outputs,
    warnings,
    outputKeys: ["true_job_cost", "quoted_margin_percent", "minimum_safe_quote"],
    redaction_status: "PUBLIC_SAFE_REDACTED",
  };
}
