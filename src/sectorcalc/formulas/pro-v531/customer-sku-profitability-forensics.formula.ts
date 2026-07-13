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

export const toolKey = "customer-sku-profitability-forensics";
export const formulaVersion = "5.3.1-pro-baris.1";

function isFiniteNumber(v: unknown): v is number { return typeof v === "number" && Number.isFinite(v); }
function get(inputs: Record<string, number>, key: string): number { const v = inputs[key]; return isFiniteNumber(v) ? v : 0; }
function round(v: number, d: number): number { if (!isFiniteNumber(v)) return 0; const f = Math.pow(10, d); return Math.round(v * f) / f; }

export const sampleInputs = PRO_SAMPLE_INPUTS[toolKey];

export function calculate(inputs: Record<string, number>): CalculationResult {
  const warnings: string[] = [];
  const outputs: Record<string, number> = {};

  const up = get(inputs, "n_unit_price");
  const uvc = get(inputs, "n_unit_variable_cost");
  const av = get(inputs, "n_annual_volume");
  const SECONDS_PER_YEAR = 31536000;
  const annual_vol = av * SECONDS_PER_YEAR;
  const lcp = get(inputs, "n_logistics_cost_pct");
  const scp = get(inputs, "n_service_cost_pct");
  const rrp = get(inputs, "n_return_rate_pct");
  const tm = get(inputs, "n_target_margin");
  const lr = get(inputs, "n_labor_rate");
  const oh = get(inputs, "n_overhead_rate");
  const conf = get(inputs, "n_source_confidence_ratio");

  if (!isFiniteNumber(inputs["n_unit_price"])) warnings.push("Missing: n_unit_price");
  if (!isFiniteNumber(inputs["n_unit_variable_cost"])) warnings.push("Missing: n_unit_variable_cost");
  if (!isFiniteNumber(inputs["n_annual_volume"])) warnings.push("Missing: n_annual_volume");

  const unit_contribution = up - uvc;
  const cm_ratio = up > 0 ? unit_contribution / up : 0;
  const logistics_burden = up * (lcp / 100);
  const service_burden = up * (scp / 100);
  const return_burden = up * (rrp / 100);
  const net_margin = unit_contribution - logistics_burden - service_burden - return_burden;
  const toxic_flag = net_margin < 0 ? 1 : 0;
  const total_margin = net_margin * annual_vol;
  const biggest_burden = Math.max(logistics_burden, service_burden, return_burden);
  const target_margin_ratio = tm / 100;
  let decision: number;
  if (cm_ratio > target_margin_ratio) decision = 0; // GROW
  else if (cm_ratio > 0) decision = 1;             // HOLD
  else decision = 2;                                // CUT

  outputs["out_evidence_completeness"] = round(conf, 3);
  outputs["out_normalized_demand"] = round(av, 0);
  outputs["out_reference_deviation"] = round(tm > 0 ? Math.abs(cm_ratio - target_margin_ratio) / target_margin_ratio : 0, 4);
  outputs["out_derating_factor"] = round(net_margin < 0 ? 0 : net_margin / unit_contribution, 4);
  outputs["out_demand_metric"] = round(net_margin, 2);
  outputs["out_capacity_metric"] = round(total_margin, 2);
  outputs["out_utilization_margin"] = round(cm_ratio, 4);
  outputs["out_expanded_uncertainty"] = round(Math.abs(net_margin * (1 - conf)), 2);
  outputs["out_threshold_crossing"] = toxic_flag;
  outputs["out_sensitivity_driver"] = biggest_burden === logistics_burden ? 0 : (biggest_burden === service_burden ? 1 : 2);
  outputs["out_fmea_trigger"] = toxic_flag;
  outputs["out_money_at_risk"] = round(toxic_flag ? total_margin : 0, 2);
  outputs["out_scenario_delta"] = round(biggest_burden * annual_vol, 2);
  outputs["out_audit_hash_payload"] = 0;
  outputs["out_final_decision_state"] = decision;

  const ok = Object.values(outputs).every(v => isFiniteNumber(v));
  return { status: ok ? "OK" : "REVIEW", outputs, warnings: warnings.length ? warnings : [], outputKeys: Object.keys(outputs), redaction_status: "PUBLIC_SAFE_REDACTED" };
}
