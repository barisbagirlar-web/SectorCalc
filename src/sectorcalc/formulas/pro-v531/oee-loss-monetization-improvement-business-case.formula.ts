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

export const toolKey = "oee-loss-monetization-improvement-business-case";
export const formulaVersion = "5.3.1-pro-baris.1";

function isFiniteNumber(v: unknown): v is number { return typeof v === "number" && Number.isFinite(v); }
function get(inputs: Record<string, number>, key: string): number { const v = inputs[key]; return isFiniteNumber(v) ? v : 0; }
function safeDiv(n: number, d: number): number { if (!isFiniteNumber(n) || !isFiniteNumber(d) || Math.abs(d) < 1e-12) return 0; return n / d; }
function round(v: number, d: number): number { if (!isFiniteNumber(v)) return 0; const f = Math.pow(10, d); return Math.round(v * f) / f; }

export const sampleInputs = PRO_SAMPLE_INPUTS[toolKey];

export function calculate(inputs: Record<string, number>): CalculationResult {
  const warnings: string[] = [];
  const outputs: Record<string, number> = {};

  // Input keys matching sample inputs
  const planned_time = Math.max(0, get(inputs, "n_planned_production_time_seconds"));
  const operating_time = Math.max(0, get(inputs, "n_operating_time_seconds"));
  const net_operating_time = Math.max(0, get(inputs, "n_net_operating_time_seconds"));
  const ideal_cycle = Math.max(0, get(inputs, "n_ideal_cycle_time_per_part"));
  const total_parts = Math.max(0, get(inputs, "n_total_parts_produced"));
  const good_parts = Math.max(0, get(inputs, "n_good_parts"));
  const hourly_contrib = Math.max(0, get(inputs, "n_hourly_contribution"));
  const improvement_investment = Math.max(0, get(inputs, "n_improvement_investment"));
  const op_hours_per_year = Math.max(0, get(inputs, "n_operating_hours_per_year"));

  // Validate required inputs
  if (!isFiniteNumber(inputs["n_planned_production_time_seconds"])) warnings.push("Missing: n_planned_production_time_seconds");
  if (!isFiniteNumber(inputs["n_operating_time_seconds"])) warnings.push("Missing: n_operating_time_seconds");
  if (!isFiniteNumber(inputs["n_net_operating_time_seconds"])) warnings.push("Missing: n_net_operating_time_seconds");
  if (!isFiniteNumber(inputs["n_total_parts_produced"])) warnings.push("Missing: n_total_parts_produced");
  if (!isFiniteNumber(inputs["n_good_parts"])) warnings.push("Missing: n_good_parts");

  // OEE Pillar Percentages
  const availability_pct = safeDiv(operating_time, planned_time) * 100;
  const valuable_time = total_parts * ideal_cycle;
  const performance_pct = safeDiv(valuable_time, net_operating_time) * 100;
  const quality_pct = safeDiv(good_parts, total_parts) * 100;
  const oee_pct = (availability_pct / 100) * (performance_pct / 100) * (quality_pct / 100) * 100;

  // Loss Hours
  const avail_loss_hrs = Math.max(0, (planned_time - operating_time)) / 3600;
  const perf_loss_hrs = Math.max(0, (net_operating_time - valuable_time)) / 3600;
  const qual_loss_hrs = Math.max(0, ((total_parts - good_parts) * ideal_cycle)) / 3600;
  const total_loss_hrs = avail_loss_hrs + perf_loss_hrs + qual_loss_hrs;

  // Lost Good Units
  const lost_good_units = Math.max(0, total_parts - good_parts);

  // Loss Monetization
  const avail_loss_amt = avail_loss_hrs * hourly_contrib;
  const perf_loss_amt = perf_loss_hrs * hourly_contrib;
  const qual_loss_amt = qual_loss_hrs * hourly_contrib;
  const total_annual_opportunity = total_loss_hrs * op_hours_per_year * safeDiv(total_loss_hrs, 1);

  // Largest OEE Loss Driver: 0=availability, 1=performance, 2=quality
  const losses = [avail_loss_amt, perf_loss_amt, qual_loss_amt];
  const maxLoss = Math.max(...losses);
  const largest_driver = maxLoss > 0 ? losses.indexOf(maxLoss) : 0;

  // Improvement ROI
  const annual_benefit = total_loss_hrs * hourly_contrib * safeDiv(op_hours_per_year, 1);
  const improvement_roi = improvement_investment > 0 ? safeDiv(annual_benefit - improvement_investment, improvement_investment) : 0;

  // Decision: 0=GOOD, 1=REVIEW, 2=BLOCKED
  let decision: number;
  if (improvement_roi > 2) {
    decision = 0; // GOOD — strong ROI case
  } else if (improvement_roi > 0.5) {
    decision = 1; // REVIEW — moderate ROI, needs closer look
  } else {
    decision = 2; // BLOCKED — weak or negative ROI
  }

  outputs["out_availability_pct"] = round(availability_pct, 2);
  outputs["out_performance_pct"] = round(performance_pct, 2);
  outputs["out_quality_pct"] = round(quality_pct, 2);
  outputs["out_oee_pct"] = round(oee_pct, 2);
  outputs["out_availability_loss_hours"] = round(avail_loss_hrs, 2);
  outputs["out_performance_loss_hours"] = round(perf_loss_hrs, 2);
  outputs["out_quality_loss_hours"] = round(qual_loss_hrs, 2);
  outputs["out_lost_productive_hours"] = round(total_loss_hrs, 2);
  outputs["out_lost_good_units"] = round(lost_good_units, 0);
  outputs["out_availability_loss_amount"] = round(avail_loss_amt, 2);
  outputs["out_performance_loss_amount"] = round(perf_loss_amt, 2);
  outputs["out_quality_loss_amount"] = round(qual_loss_amt, 2);
  outputs["out_total_annual_opportunity"] = round(total_annual_opportunity, 2);
  outputs["out_largest_oee_loss_driver"] = largest_driver;
  outputs["out_improvement_roi"] = round(improvement_roi, 4);
  outputs["out_final_decision_state"] = decision;

  const ok = Object.values(outputs).every(v => isFiniteNumber(v));
  return {
    status: ok ? "OK" : "REVIEW",
    outputs,
    warnings: warnings.length ? warnings : [],
    outputKeys: Object.keys(outputs),
    redaction_status: "PUBLIC_SAFE_REDACTED"
  };
}
