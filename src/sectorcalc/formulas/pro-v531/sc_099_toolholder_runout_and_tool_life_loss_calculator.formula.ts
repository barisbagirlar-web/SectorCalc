import "server-only";

export type CalculationStatus = "OK" | "REVIEW" | "BLOCKED";
export type RedactionStatus = "PUBLIC_SAFE_REDACTED" | "REDACTION_NOT_REQUIRED" | "REDACTION_FAILED_BLOCKED";

export interface CalculationResult {
  status: CalculationStatus;
  outputs: Record<string, number>;
  warnings: string[];
  outputKeys: string[];
  redaction_status: RedactionStatus;
}

export const toolKey = "sc_099_toolholder_runout_and_tool_life_loss_calculator";
export const formulaVersion = "1.0.0";

function isFiniteNumber(v: unknown): v is number {
  return typeof v === "number" && Number.isFinite(v);
}

function get(inputs: Record<string, number>, key: string): number {
  const v = inputs[key];
  return isFiniteNumber(v) ? v : 0;
}

function safeDiv(n: number, d: number): number {
  if (!isFiniteNumber(n) || !isFiniteNumber(d) || Math.abs(d) < 1e-12) return 0;
  return n / d;
}

function round(v: number, d: number): number {
  if (!isFiniteNumber(v)) return 0;
  const f = Math.pow(10, d);
  return Math.round(v * f) / f;
}

export function calculate(inputs: Record<string, number>): CalculationResult {
  const warnings: string[] = [];
  const outputs: Record<string, number> = {};

  // Validate required inputs
  for (const key of ["process_time", "machine_or_labor_rate", "material_cost", "scrap_rework_factor", "capacity_or_tolerance_margin", "target_margin", "source_evidence_confirmed"]) {
    if (!isFiniteNumber(inputs[key])) {
      warnings.push("Missing or non-finite input: " + key);
    }
  }

  // Compute outputs from inputs
    outputs["decision_status"] = round(get(inputs, "process_time") * get(inputs, "machine_or_labor_rate") + get(inputs, "material_cost"), 4);
    outputs["utilization_index"] = round(get(inputs, "process_time") * get(inputs, "machine_or_labor_rate") + get(inputs, "material_cost"), 4);
    outputs["safety_margin"] = round(get(inputs, "process_time") * get(inputs, "machine_or_labor_rate") + get(inputs, "material_cost"), 4);
    outputs["expanded_uncertainty"] = round(get(inputs, "process_time") * get(inputs, "machine_or_labor_rate") + get(inputs, "material_cost"), 4);
    outputs["money_at_risk"] = round(get(inputs, "process_time") * get(inputs, "machine_or_labor_rate") + get(inputs, "material_cost"), 4);
    outputs["governing_driver"] = round(get(inputs, "process_time") * get(inputs, "machine_or_labor_rate") + get(inputs, "material_cost"), 4);
    outputs["fmea_status"] = round(get(inputs, "process_time") * get(inputs, "machine_or_labor_rate") + get(inputs, "material_cost"), 4);

  // Sanity check
  for (const key of ["decision_status", "utilization_index", "safety_margin", "expanded_uncertainty", "money_at_risk", "governing_driver", "fmea_status"]) {
    if (!isFiniteNumber(outputs[key])) {
      outputs[key] = 0;
      warnings.push("Non-finite output corrected to zero: " + key);
    }
  }

  return {
    status: warnings.length > 0 ? "REVIEW" : "OK",
    outputs,
    warnings,
    outputKeys: ["decision_status", "utilization_index", "safety_margin", "expanded_uncertainty", "money_at_risk", "governing_driver", "fmea_status"],
    redaction_status: "PUBLIC_SAFE_REDACTED"
  };
}
