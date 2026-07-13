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

export const toolKey = "scrap-rework-cost-tracker";
export const formulaVersion = "5.3.1-pro-baris.1";

function isFiniteNumber(v: unknown): v is number { return typeof v === "number" && Number.isFinite(v); }
function get(inputs: Record<string, number>, key: string): number { const v = inputs[key]; return isFiniteNumber(v) ? v : 0; }
function round(v: number, d: number): number { if (!isFiniteNumber(v)) return 0; const f = Math.pow(10, d); return Math.round(v * f) / f; }

export const sampleInputs = PRO_SAMPLE_INPUTS[toolKey];

export function calculate(inputs: Record<string, number>): CalculationResult {
  const warnings: string[] = [];
  const outputs: Record<string, number> = {};

  const total_produced = get(inputs, "n_total_produced");
  const scrap_quantity = get(inputs, "n_scrap_quantity");
  const rework_quantity = get(inputs, "n_rework_quantity");
  const unit_material_cost = get(inputs, "n_unit_material_cost");
  const unit_labor_cost = get(inputs, "n_unit_labor_cost");
  const rework_labor_rate = get(inputs, "n_rework_labor_rate");
  const rework_time_per_unit = get(inputs, "n_rework_time_per_unit");
  const defect_rate_target_pct = get(inputs, "n_defect_rate_target_pct");
  const monthly_volume = get(inputs, "n_monthly_volume");
  const conf = get(inputs, "n_source_confidence_ratio");

  if (!isFiniteNumber(inputs["n_total_produced"])) warnings.push("Missing: n_total_produced");
  if (!isFiniteNumber(inputs["n_scrap_quantity"])) warnings.push("Missing: n_scrap_quantity");
  if (!isFiniteNumber(inputs["n_rework_quantity"])) warnings.push("Missing: n_rework_quantity");

  const scrap_cost = scrap_quantity * (unit_material_cost + unit_labor_cost);
  const rework_cost = rework_quantity * rework_labor_rate * rework_time_per_unit / 3600;
  const total_defect_units = scrap_quantity + rework_quantity;
  const defect_cost_per_unit = total_defect_units > 0 ? (scrap_cost + rework_cost) / total_defect_units : 0;
  const monthly_quality_loss = total_produced > 0 ? (scrap_cost + rework_cost) * (monthly_volume / total_produced) : 0;
  const defect_rate = total_produced > 0 ? total_defect_units / total_produced : 0;
  const primary_driver = scrap_cost > rework_cost ? 0 : 1;
  const decision = defect_rate <= defect_rate_target_pct / 100 ? 0 : (defect_cost_per_unit > unit_material_cost * 0.5 ? 2 : 1);

  outputs["out_evidence_completeness"] = round(conf, 3);
  outputs["out_normalized_demand"] = round(total_defect_units, 0);
  outputs["out_reference_deviation"] = round(defect_rate, 4);
  outputs["out_derating_factor"] = round(defect_rate_target_pct / 100, 4);
  outputs["out_demand_metric"] = round(scrap_cost, 2);
  outputs["out_capacity_metric"] = round(rework_cost, 2);
  outputs["out_utilization_margin"] = round(defect_cost_per_unit, 4);
  outputs["out_expanded_uncertainty"] = round(monthly_quality_loss, 2);
  outputs["out_threshold_crossing"] = defect_rate > defect_rate_target_pct / 100 ? 1 : 0;
  outputs["out_sensitivity_driver"] = primary_driver;
  outputs["out_fmea_trigger"] = defect_rate > 0.05 ? 1 : 0;
  outputs["out_money_at_risk"] = round(scrap_cost + rework_cost, 2);
  outputs["out_scenario_delta"] = round(scrap_cost - rework_cost, 2);
  outputs["out_audit_hash_payload"] = 0;
  outputs["out_final_decision_state"] = decision;

  const ok = Object.values(outputs).every(v => isFiniteNumber(v));
  return { status: ok ? "OK" : "REVIEW", outputs, warnings: warnings.length ? warnings : [], outputKeys: Object.keys(outputs), redaction_status: "PUBLIC_SAFE_REDACTED" };
}
