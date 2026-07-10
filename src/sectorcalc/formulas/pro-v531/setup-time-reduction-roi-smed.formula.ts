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

export const toolKey = "setup-time-reduction-roi-smed";
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
    "n_current_setup_time_minutes",
    "n_future_setup_time_minutes",
    "n_setups_per_year",
    "n_machine_hourly_rate",
    "n_labor_rate_per_hour",
    "n_implementation_cost",
    "n_operator_count",
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
  const n_current_setup_time_minutes = clamp(get(inputs, "n_current_setup_time_minutes"));
  const n_future_setup_time_minutes = clamp(get(inputs, "n_future_setup_time_minutes"));
  const n_setups_per_year = clamp(get(inputs, "n_setups_per_year"));
  const n_machine_hourly_rate = clamp(get(inputs, "n_machine_hourly_rate"));
  const n_labor_rate_per_hour = clamp(get(inputs, "n_labor_rate_per_hour"));
  const n_implementation_cost = clamp(get(inputs, "n_implementation_cost"));
  const n_operator_count = Math.max(1, Math.round(clamp(get(inputs, "n_operator_count"))));

  // --- Core calculations ---
  const current_setup_time = n_current_setup_time_minutes;
  const future_setup_time = n_future_setup_time_minutes;
  const time_saved_per_setup = Math.max(0, n_current_setup_time_minutes - n_future_setup_time_minutes);
  const annual_setups = n_setups_per_year;
  const annual_hours_recovered = safeDiv(time_saved_per_setup * n_setups_per_year, 60);
  const labor_saving = annual_hours_recovered * n_labor_rate_per_hour * n_operator_count;
  const machine_capacity_value = annual_hours_recovered * n_machine_hourly_rate;
  const annual_financial_benefit = labor_saving + machine_capacity_value;
  const implementation_cost = n_implementation_cost;
  const payback_months = annual_financial_benefit > 0
    ? safeDiv(implementation_cost, annual_financial_benefit) * 12
    : 999;
  const roi_percent = safeDiv(annual_financial_benefit, implementation_cost) * 100;

  // --- Decision state ---
  // 0=GOOD (payback < 12 months), 1=REVIEW (12-24 months), 2=BLOCKED (>24 months)
  let decision: number;
  if (payback_months < 12) {
    decision = 0;
  } else if (payback_months <= 24) {
    decision = 1;
  } else {
    decision = 2;
  }

  // --- Outputs ---
  outputs["out_current_setup_time"] = round(current_setup_time, 2);
  outputs["out_future_setup_time"] = round(future_setup_time, 2);
  outputs["out_time_saved_per_setup"] = round(time_saved_per_setup, 2);
  outputs["out_annual_setups"] = round(annual_setups, 0);
  outputs["out_annual_hours_recovered"] = round(annual_hours_recovered, 2);
  outputs["out_labor_saving"] = round(labor_saving, 2);
  outputs["out_machine_capacity_value"] = round(machine_capacity_value, 2);
  outputs["out_annual_financial_benefit"] = round(annual_financial_benefit, 2);
  outputs["out_implementation_cost"] = round(implementation_cost, 2);
  outputs["out_payback_months"] = round(payback_months, 2);
  outputs["out_roi_percent"] = round(roi_percent, 2);
  outputs["out_final_decision_state"] = decision;

  // --- Sanity check ---
  const allOutputKeys = [
    "out_current_setup_time",
    "out_future_setup_time",
    "out_time_saved_per_setup",
    "out_annual_setups",
    "out_annual_hours_recovered",
    "out_labor_saving",
    "out_machine_capacity_value",
    "out_annual_financial_benefit",
    "out_implementation_cost",
    "out_payback_months",
    "out_roi_percent",
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
