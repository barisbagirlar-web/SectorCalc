import "server-only";

export type CalculationStatus = "OK" | "REVIEW" | "BLOCKED";
export type RedactionStatus = "PUBLIC_SAFE_REDACTED" | "REDACTION_NOT_REQUIRED" | "REDACTION_FAILED_BLOCKED";

export const toolKey = "door-hardware-cost-buildup";
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
  for (const key of ["hinge_count", "hinge_unit_cost", "lockset_cost", "handle_cost", "closer_cost", "weatherstrip_cost", "labor_minutes", "labor_rate_per_hour"]) {
    if (!isFiniteNumber(inputs[key])) {
      warnings.push("Missing or non-finite input: " + key);
    }
  }

  // Compute formula outputs
    const val_hinge_count = get(inputs, "hinge_count");
    const val_hinge_unit_cost = get(inputs, "hinge_unit_cost");
    const val_lockset_cost = get(inputs, "lockset_cost");
    const val_handle_cost = get(inputs, "handle_cost");
    const val_closer_cost = get(inputs, "closer_cost");
    const val_weatherstrip_cost = get(inputs, "weatherstrip_cost");
    const val_labor_minutes = get(inputs, "labor_minutes");
    const val_labor_rate_per_hour = get(inputs, "labor_rate_per_hour");
    outputs["total_door_hardware_cost"] = round(val_hinge_count * val_hinge_unit_cost * val_lockset_cost * val_handle_cost * val_closer_cost * val_weatherstrip_cost * val_labor_minutes * val_labor_rate_per_hour, 4);

  return {
    status: warnings.length > 0 ? "REVIEW" : "OK",
    outputs,
    warnings,
    outputKeys: ["hardware_material_cost", "labor_cost", "total_door_hardware_cost"],
    redaction_status: "PUBLIC_SAFE_REDACTED",
  };
}
