import "server-only";

export type CalculationStatus = "OK" | "REVIEW" | "BLOCKED";
export type RedactionStatus = "PUBLIC_SAFE_REDACTED" | "REDACTION_NOT_REQUIRED" | "REDACTION_FAILED_BLOCKED";

export const toolKey = "steel-bar-cutting-optimizer-waste";
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
  for (const key of ["stock_bar_length", "part_length", "saw_kerf", "bar_count", "cost_per_bar", "scrap_resale_value_per_meter"]) {
    if (!isFiniteNumber(inputs[key])) {
      warnings.push("Missing or non-finite input: " + key);
    }
  }

  // Compute formula outputs
    const val_stock_bar_length = get(inputs, "stock_bar_length");
    const val_part_length = get(inputs, "part_length");
    const val_saw_kerf = get(inputs, "saw_kerf");
    const val_bar_count = get(inputs, "bar_count");
    const val_cost_per_bar = get(inputs, "cost_per_bar");
    const val_scrap_resale_value_per_meter = get(inputs, "scrap_resale_value_per_meter");
    outputs["total_parts"] = round(val_stock_bar_length * val_part_length * val_saw_kerf * val_bar_count * val_cost_per_bar * val_scrap_resale_value_per_meter, 4);

  return {
    status: warnings.length > 0 ? "REVIEW" : "OK",
    outputs,
    warnings,
    outputKeys: ["parts_per_bar", "total_parts", "scrap_length_total", "scrap_value"],
    redaction_status: "PUBLIC_SAFE_REDACTED",
  };
}
