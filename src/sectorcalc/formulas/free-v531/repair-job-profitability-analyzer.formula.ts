import "server-only";

export type CalculationStatus = "OK" | "REVIEW" | "BLOCKED";
export type RedactionStatus = "PUBLIC_SAFE_REDACTED" | "REDACTION_NOT_REQUIRED" | "REDACTION_FAILED_BLOCKED";

export const toolKey = "repair-job-profitability-analyzer";
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
  for (const key of ["ticket_revenue", "parts_cost", "consumables_cost", "travel_distance_km", "vehicle_cost_per_km", "labor_hours", "labor_cost_per_hour", "unbilled_hours"]) {
    if (!isFiniteNumber(inputs[key])) {
      warnings.push("Missing or non-finite input: " + key);
    }
  }

  // Compute formula outputs
    const val_ticket_revenue = get(inputs, "ticket_revenue");
    const val_parts_cost = get(inputs, "parts_cost");
    const val_consumables_cost = get(inputs, "consumables_cost");
    const val_travel_distance_km = get(inputs, "travel_distance_km");
    const val_vehicle_cost_per_km = get(inputs, "vehicle_cost_per_km");
    const val_labor_hours = get(inputs, "labor_hours");
    const val_labor_cost_per_hour = get(inputs, "labor_cost_per_hour");
    const val_unbilled_hours = get(inputs, "unbilled_hours");
    outputs["net_profit_per_ticket"] = round(val_ticket_revenue * val_parts_cost * val_consumables_cost * val_travel_distance_km * val_vehicle_cost_per_km * val_labor_hours * val_labor_cost_per_hour * val_unbilled_hours, 4);

  return {
    status: warnings.length > 0 ? "REVIEW" : "OK",
    outputs,
    warnings,
    outputKeys: ["net_profit_per_ticket", "net_margin_percent", "hidden_cost_total"],
    redaction_status: "PUBLIC_SAFE_REDACTED",
  };
}
