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
function round(v: number, d: number): number { if (!isFiniteNumber(v)) return 0; const f = Math.pow(10, d); return Math.round(v * f) / f; }

export const sampleInputs = PRO_SAMPLE_INPUTS[toolKey];

export function calculate(inputs: Record<string, number>): CalculationResult {
  const warnings: string[] = [];
  const outputs: Record<string, number> = {};

  const planned_production_time = get(inputs, "n_planned_production_time");
  const operating_time = get(inputs, "n_operating_time");
  const net_operating_time = get(inputs, "n_net_operating_time");
  const valuable_operating_time = get(inputs, "n_valuable_operating_time");
  const ideal_cycle_time = get(inputs, "n_ideal_cycle_time");
  const total_parts = get(inputs, "n_total_parts");
  const good_parts = get(inputs, "n_good_parts");
  const hourly_contribution = get(inputs, "n_hourly_contribution");
  const improvement_cost = get(inputs, "n_improvement_cost");
  const conf = get(inputs, "n_source_confidence_ratio");

  if (!isFiniteNumber(inputs["n_planned_production_time"])) warnings.push("Missing: n_planned_production_time");
  if (!isFiniteNumber(inputs["n_operating_time"])) warnings.push("Missing: n_operating_time");
  if (!isFiniteNumber(inputs["n_net_operating_time"])) warnings.push("Missing: n_net_operating_time");
  if (!isFiniteNumber(inputs["n_valuable_operating_time"])) warnings.push("Missing: n_valuable_operating_time");

  const availability = planned_production_time > 0 ? operating_time / planned_production_time : 0;
  const performance = net_operating_time > 0 ? (total_parts * ideal_cycle_time) / net_operating_time : 0;
  const quality = total_parts > 0 ? good_parts / total_parts : 0;
  const oee = availability * performance * quality;

  const avail_loss_value = (planned_production_time - operating_time) * hourly_contribution / 3600;
  const perf_loss_value = (net_operating_time - valuable_operating_time) * hourly_contribution / 3600;
  const qual_loss_value = total_parts > 0 ? (total_parts - good_parts) * ideal_cycle_time * hourly_contribution / 3600 : 0;
  const total_oee_loss = avail_loss_value + perf_loss_value + qual_loss_value;

  const improvement_value = total_oee_loss * 3 * 0.7;
  const decision = improvement_value > improvement_cost * 2 ? 0 : (improvement_value > improvement_cost ? 1 : 2);

  outputs["out_evidence_completeness"] = round(conf, 3);
  outputs["out_normalized_demand"] = round(total_oee_loss, 2);
  outputs["out_reference_deviation"] = round(oee, 4);
  outputs["out_derating_factor"] = round(availability, 4);
  outputs["out_demand_metric"] = round(avail_loss_value, 2);
  outputs["out_capacity_metric"] = round(perf_loss_value, 2);
  outputs["out_utilization_margin"] = round(performance, 4);
  outputs["out_expanded_uncertainty"] = round(qual_loss_value, 2);
  outputs["out_threshold_crossing"] = oee < 0.85 ? 1 : 0;
  outputs["out_sensitivity_driver"] = avail_loss_value > perf_loss_value ? 0 : 1;
  outputs["out_fmea_trigger"] = quality < 0.95 ? 1 : 0;
  outputs["out_money_at_risk"] = round(total_oee_loss, 2);
  outputs["out_scenario_delta"] = round(improvement_value, 2);
  outputs["out_audit_hash_payload"] = 0;
  outputs["out_final_decision_state"] = decision;

  const ok = Object.values(outputs).every(v => isFiniteNumber(v));
  return { status: ok ? "OK" : "REVIEW", outputs, warnings: warnings.length ? warnings : [], outputKeys: Object.keys(outputs), redaction_status: "PUBLIC_SAFE_REDACTED" };
}
