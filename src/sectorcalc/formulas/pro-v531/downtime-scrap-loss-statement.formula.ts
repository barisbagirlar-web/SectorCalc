import "server-only";
import { PRO_SAMPLE_INPUTS } from "./pro-sample-inputs";

export type CalculationStatus = "OK" | "REVIEW" | "BLOCKED";
export type RedactionStatus = "PUBLIC_SAFE_REDACTED" | "REDACTION_NOT_REQUIRED" | "REDACTION_FAILED_BLOCKED";

export interface CalculationResult {
  status: CalculationStatus;
  outputs: Record<string, number>;
  warnings: string[];
  outputKeys: string[];
  redaction_status: RedactionStatus;
}

export const toolKey = "downtime-scrap-loss-statement";
export const formulaVersion = "5.3.1-pro-baris.1";

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

function safeDiv(n: number, d: number): number {
  if (!isFiniteNumber(n) || !isFiniteNumber(d) || Math.abs(d) < 1e-12) return 0;
  return n / d;
}

function clamp(v: number): number {
  return Math.max(0, v);
}

export const sampleInputs = PRO_SAMPLE_INPUTS[toolKey];

export function calculate(inputs: Record<string, number>): CalculationResult {
  const warnings: string[] = [];
  const outputs: Record<string, number> = {};

  // --- Validate required inputs ---
  const requiredKeys = [
    "n_downtime_hours",
    "n_hourly_contribution_rate",
    "n_scrap_quantity",
    "n_material_cost_per_unit",
    "n_rework_hours",
    "n_rework_labor_rate",
    "n_disposal_inspection_cost",
    "n_annual_event_frequency",
  ];

  let evidenceCount = 0;
  for (const key of requiredKeys) {
    if (!isFiniteNumber(inputs[key])) {
      warnings.push("Missing or non-finite input: " + key);
    } else {
      evidenceCount++;
    }
  }

  // --- Extract and clamp inputs ---
  const n_downtime_hours = clamp(get(inputs, "n_downtime_hours"));
  const n_hourly_contribution_rate = clamp(get(inputs, "n_hourly_contribution_rate"));
  const n_scrap_quantity = clamp(get(inputs, "n_scrap_quantity"));
  const n_material_cost_per_unit = clamp(get(inputs, "n_material_cost_per_unit"));
  const n_rework_hours = clamp(get(inputs, "n_rework_hours"));
  const n_rework_labor_rate = clamp(get(inputs, "n_rework_labor_rate"));
  const n_disposal_inspection_cost = clamp(get(inputs, "n_disposal_inspection_cost"));
  const n_annual_event_frequency = Math.max(1, Math.round(clamp(get(inputs, "n_annual_event_frequency"))));

  // --- Core calculations ---
  const downtime_hours = n_downtime_hours;
  const lost_productive_hours = n_downtime_hours;
  const lost_units = n_scrap_quantity; // scrapped units represent lost units from the event
  const lost_contribution = n_downtime_hours * n_hourly_contribution_rate;
  const labor_idle_cost = n_downtime_hours * n_rework_labor_rate;
  const scrap_material_cost = n_scrap_quantity * n_material_cost_per_unit;
  const rework_cost = n_rework_hours * n_rework_labor_rate;
  const disposal_inspection_cost = n_disposal_inspection_cost;

  const total_event_loss = lost_contribution + labor_idle_cost + scrap_material_cost + rework_cost + disposal_inspection_cost;
  const annualized_loss = total_event_loss * n_annual_event_frequency;

  // --- Primary loss driver ---
  // 0=Contribution (lost production value), 1=Scrap (material waste), 2=Rework (rework labor)
  let primary_loss_driver: number;
  if (lost_contribution >= scrap_material_cost && lost_contribution >= rework_cost) {
    primary_loss_driver = 0; // Contribution
  } else if (scrap_material_cost >= rework_cost) {
    primary_loss_driver = 1; // Scrap
  } else {
    primary_loss_driver = 2; // Rework
  }

  // --- Recovery priority ---
  // 0=LOW (<$1K per event), 1=MEDIUM ($1K-$10K), 2=HIGH (>$10K)
  let recovery_priority: number;
  if (total_event_loss >= 10000) {
    recovery_priority = 2; // HIGH
  } else if (total_event_loss >= 1000) {
    recovery_priority = 1; // MEDIUM
  } else {
    recovery_priority = 0; // LOW
  }

  // --- Decision state ---
  // 0=GOOD, 1=REVIEW, 2=BLOCKED
  let decision: number;
  if (annualized_loss < 10000) {
    decision = 0; // GOOD — manageable loss level
  } else if (annualized_loss < 100000) {
    decision = 1; // REVIEW — significant loss requiring attention
  } else {
    decision = 2; // BLOCKED — critical loss level requiring immediate action
  }

  // --- Outputs ---
  outputs["out_downtime_hours"] = round(downtime_hours, 2);
  outputs["out_lost_productive_hours"] = round(lost_productive_hours, 2);
  outputs["out_lost_units"] = round(lost_units, 0);
  outputs["out_lost_contribution"] = round(lost_contribution, 2);
  outputs["out_labor_idle_cost"] = round(labor_idle_cost, 2);
  outputs["out_scrap_material_cost"] = round(scrap_material_cost, 2);
  outputs["out_rework_cost"] = round(rework_cost, 2);
  outputs["out_disposal_inspection_cost"] = round(disposal_inspection_cost, 2);
  outputs["out_total_event_loss"] = round(total_event_loss, 2);
  outputs["out_annualized_loss"] = round(annualized_loss, 2);
  outputs["out_primary_loss_driver"] = primary_loss_driver;
  outputs["out_recovery_priority"] = recovery_priority;
  outputs["out_final_decision_state"] = decision;

  // --- Sanity check ---
  const allOutputKeys = [
    "out_downtime_hours",
    "out_lost_productive_hours",
    "out_lost_units",
    "out_lost_contribution",
    "out_labor_idle_cost",
    "out_scrap_material_cost",
    "out_rework_cost",
    "out_disposal_inspection_cost",
    "out_total_event_loss",
    "out_annualized_loss",
    "out_primary_loss_driver",
    "out_recovery_priority",
    "out_final_decision_state",
  ];

  for (const key of allOutputKeys) {
    if (!isFiniteNumber(outputs[key])) {
      outputs[key] = 0;
      warnings.push("Non-finite output corrected to zero: " + key);
    }
  }

  // Derive status
  let status: CalculationStatus = "OK";
  if (warnings.length > 0) status = "REVIEW";
  if (decision === 2) status = "BLOCKED";

  return {
    status,
    outputs,
    warnings,
    outputKeys: allOutputKeys,
    redaction_status: "PUBLIC_SAFE_REDACTED",
  };
}
