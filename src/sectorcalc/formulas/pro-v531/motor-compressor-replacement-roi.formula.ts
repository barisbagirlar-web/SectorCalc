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

export const toolKey = "motor-compressor-replacement-roi";
export const formulaVersion = "5.3.1-pro-baris.1";

function isFiniteNumber(v: unknown): v is number { return typeof v === "number" && Number.isFinite(v); }
function get(inputs: Record<string, number>, key: string): number { const v = inputs[key]; return isFiniteNumber(v) ? v : 0; }
function round(v: number, d: number): number { if (!isFiniteNumber(v)) return 0; const f = Math.pow(10, d); return Math.round(v * f) / f; }

export const sampleInputs = PRO_SAMPLE_INPUTS[toolKey];

export function calculate(inputs: Record<string, number>): CalculationResult {
  const warnings: string[] = [];
  const outputs: Record<string, number> = {};

  const motor_power = get(inputs, "n_motor_power_kw");
  const annual_hours = get(inputs, "n_annual_operating_hours");
  const current_eff = get(inputs, "n_current_efficiency_pct") / 100;
  const new_eff = get(inputs, "n_new_efficiency_pct") / 100;
  const kwh_rate = get(inputs, "n_avg_kwh_rate");
  const replacement_cost = get(inputs, "n_replacement_cost");
  const installation_cost = get(inputs, "n_installation_cost");
  const maint_saving = get(inputs, "n_maintenance_saving_per_year");
  const life = Math.max(1, Math.round(get(inputs, "n_equipment_life_years")));
  const dr = get(inputs, "n_discount_rate");
  const conf = get(inputs, "n_source_confidence_ratio");

  if (!isFiniteNumber(inputs["n_motor_power_kw"])) warnings.push("Missing: n_motor_power_kw");
  if (!isFiniteNumber(inputs["n_current_efficiency_pct"])) warnings.push("Missing: n_current_efficiency_pct");
  if (!isFiniteNumber(inputs["n_new_efficiency_pct"])) warnings.push("Missing: n_new_efficiency_pct");
  if (dr > 0 && dr < 0.02) warnings.push("Discount rate " + dr.toFixed(4) + " ratio is below typical range [0.02, 0.35].");

  const current_kwh = current_eff > 0 ? motor_power * annual_hours / current_eff : 0;
  const new_kwh = new_eff > 0 ? motor_power * annual_hours / new_eff : 0;
  const current_energy_cost = current_kwh * kwh_rate;
  const new_energy_cost = new_kwh * kwh_rate;
  const annual_saving = current_energy_cost - new_energy_cost + maint_saving;
  const total_investment = replacement_cost + installation_cost;
  const payback_months = annual_saving > 0 ? total_investment / annual_saving * 12 : 999;

  let npv = 0;
  for (let y = 1; y <= life; y++) {
    npv += annual_saving / Math.pow(1 + dr, y);
  }
  npv -= total_investment;

  const roipct = total_investment > 0 ? (npv / total_investment) * 100 : 0;
  const decision = payback_months <= 24 || npv > 0 ? 0 : (payback_months <= 48 ? 1 : 2);

  outputs["out_evidence_completeness"] = round(conf, 3);
  outputs["out_normalized_demand"] = round(annual_hours, 0);
  outputs["out_reference_deviation"] = round(current_eff - new_eff, 4);
  outputs["out_derating_factor"] = round(conf, 3);
  outputs["out_demand_metric"] = round(current_energy_cost, 2);
  outputs["out_capacity_metric"] = round(new_energy_cost, 2);
  outputs["out_utilization_margin"] = round(annual_saving, 2);
  outputs["out_expanded_uncertainty"] = round(Math.abs(annual_saving * (1 - conf)), 2);
  outputs["out_threshold_crossing"] = payback_months <= 48 ? 1 : 0;
  outputs["out_sensitivity_driver"] = current_energy_cost > replacement_cost ? 1 : 0;
  outputs["out_fmea_trigger"] = payback_months > 24 ? 1 : 0;
  outputs["out_money_at_risk"] = round(total_investment, 2);
  outputs["out_scenario_delta"] = round(payback_months, 1);
  outputs["out_audit_hash_payload"] = 0;
  outputs["out_final_decision_state"] = decision;

  const ok = Object.values(outputs).every(v => isFiniteNumber(v));
  return { status: ok ? "OK" : "REVIEW", outputs, warnings: warnings.length ? warnings : [], outputKeys: Object.keys(outputs), redaction_status: "PUBLIC_SAFE_REDACTED" };
}
