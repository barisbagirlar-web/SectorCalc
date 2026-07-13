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

export const toolKey = "fx-commodity-pass-through-pricer";
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

export const sampleInputs = PRO_SAMPLE_INPUTS[toolKey];

export function calculate(inputs: Record<string, number>): CalculationResult {
  const warnings: string[] = [];
  const outputs: Record<string, number> = {};

  // --- Validate required inputs ---
  const requiredKeys = [
    "n_base_price",
    "n_fx_rate_spot",
    "n_fx_rate_budget",
    "n_commodity_index_current",
    "n_commodity_index_budget",
    "n_material_cost_pct",
    "n_fx_hedge_pct",
    "n_commodity_hedge_pct",
    "n_annual_volume",
    "n_source_confidence_ratio",
  ];

  let evidenceCount = 0;
  for (const key of requiredKeys) {
    if (!isFiniteNumber(inputs[key])) {
      warnings.push("Missing or non-finite input: " + key);
    } else {
      evidenceCount++;
    }
  }

  // --- Extract inputs ---
  const n_base_price = get(inputs, "n_base_price");
  const n_fx_rate_spot = get(inputs, "n_fx_rate_spot");
  const n_fx_rate_budget = get(inputs, "n_fx_rate_budget");
  const n_commodity_index_current = get(inputs, "n_commodity_index_current");
  const n_commodity_index_budget = get(inputs, "n_commodity_index_budget");
  const n_material_cost_pct = get(inputs, "n_material_cost_pct");
  const n_fx_hedge_pct = get(inputs, "n_fx_hedge_pct");
  const n_commodity_hedge_pct = get(inputs, "n_commodity_hedge_pct");
  const n_annual_volume = get(inputs, "n_annual_volume");
  const n_source_confidence_ratio = get(inputs, "n_source_confidence_ratio");

  // Annualize volume (input is per-second)
  const SECONDS_PER_YEAR = 31536000;
  const annual_vol = n_annual_volume * SECONDS_PER_YEAR;

  // --- Core FX & commodity pass-through logic ---
  const fx_change = n_fx_rate_budget > 0
    ? (n_fx_rate_spot - n_fx_rate_budget) / n_fx_rate_budget
    : 0;

  const comm_change = n_commodity_index_budget > 0
    ? (n_commodity_index_current - n_commodity_index_budget) / n_commodity_index_budget
    : 0;

  const fx_impact = fx_change * (n_material_cost_pct / 100) * (1 - n_fx_hedge_pct / 100);
  const comm_impact = comm_change * (n_material_cost_pct / 100) * (1 - n_commodity_hedge_pct / 100);

  const total_pass_through = (fx_impact + comm_impact) * 100;
  const adjusted_price = n_base_price * (1 + fx_impact + comm_impact);
  const escalation_amount = adjusted_price - n_base_price;
  const annual_escalation = escalation_amount * annual_vol;

  // --- Decision ---
  let decision: number;
  if (Math.abs(total_pass_through) < 5) {
    decision = 0; // OK
  } else if (total_pass_through >= 5) {
    decision = 1; // REPRICE
  } else {
    decision = 2; // HOLD
  }

  // --- Output 1: out_evidence_completeness ---
  const totalInputs = requiredKeys.length;
  const evidenceRatio = safeDiv(evidenceCount, totalInputs);
  outputs["out_evidence_completeness"] = round(Math.min(1, Math.max(0, evidenceRatio)), 4);

  // --- Output 2: out_normalized_demand ---
  const demandMetric = annual_vol * safeDiv(n_base_price, 100);
  outputs["out_normalized_demand"] = round(demandMetric, 4);

  // --- Output 3: out_reference_deviation ---
  const refDev = safeDiv(n_fx_rate_spot - n_fx_rate_budget, Math.max(1, n_fx_rate_budget));
  outputs["out_reference_deviation"] = round(Math.min(1, Math.max(-1, refDev)), 4);

  // --- Output 4: out_derating_factor ---
  const derating = 1 - Math.abs(total_pass_through) / 100 * (1 - n_source_confidence_ratio);
  outputs["out_derating_factor"] = round(Math.max(0, Math.min(1, derating)), 4);

  // --- Output 5: out_demand_metric ---
  outputs["out_demand_metric"] = round(demandMetric * n_source_confidence_ratio, 4);

  // --- Output 6: out_capacity_metric ---
  const capacityMetric = safeDiv(annual_escalation, Math.max(1, n_base_price));
  outputs["out_capacity_metric"] = round(capacityMetric, 4);

  // --- Output 7: out_utilization_margin ---
  const utilizationMargin = safeDiv(adjusted_price, Math.max(1, n_base_price));
  outputs["out_utilization_margin"] = round(utilizationMargin, 4);

  // --- Output 8: out_expanded_uncertainty ---
  const uncertainty = Math.abs(total_pass_through) * (1 - n_source_confidence_ratio);
  outputs["out_expanded_uncertainty"] = round(uncertainty, 4);

  // --- Output 9: out_threshold_crossing ---
  let threshold = 0;
  if (total_pass_through >= 5) threshold = 1;
  if (total_pass_through < -5) threshold = -1;
  outputs["out_threshold_crossing"] = threshold;

  // --- Output 10: out_sensitivity_driver ---
  const drivers = [
    Math.abs(fx_change),
    Math.abs(comm_change),
    Math.abs(n_fx_hedge_pct),
    Math.abs(n_commodity_hedge_pct),
  ];
  const maxDriver = Math.max(...drivers);
  const driverIdx = drivers.indexOf(maxDriver);
  outputs["out_sensitivity_driver"] = driverIdx;

  // --- Output 11: out_fmea_trigger ---
  let fmeaTrigger = 0;
  if (decision === 1) fmeaTrigger = 1;
  if (Math.abs(total_pass_through) > 15) fmeaTrigger += 2;
  if (n_fx_hedge_pct < 50 && n_commodity_hedge_pct < 50) fmeaTrigger += 4;
  outputs["out_fmea_trigger"] = fmeaTrigger;

  // --- Output 12: out_money_at_risk ---
  const riskCost = Math.abs(annual_escalation) * (1 - n_source_confidence_ratio);
  const moneyAtRisk = Math.max(0, riskCost);
  outputs["out_money_at_risk"] = round(moneyAtRisk, 4);

  // --- Output 13: out_scenario_delta ---
  const scenarioDelta = total_pass_through * annual_vol;
  outputs["out_scenario_delta"] = round(scenarioDelta, 4);

  // --- Output 14: out_audit_hash_payload ---
  const hashSeed = total_pass_through * 100 + adjusted_price * 10 + n_base_price;
  const auditHash = Math.abs(hashSeed) % 1000000;
  outputs["out_audit_hash_payload"] = round(auditHash, 0);

  // --- Output 15: out_final_decision_state ---
  outputs["out_final_decision_state"] = decision;

  // --- Sanity check: ensure all 15 outputs are finite ---
  const allOutputKeys = [
    "out_evidence_completeness",
    "out_normalized_demand",
    "out_reference_deviation",
    "out_derating_factor",
    "out_demand_metric",
    "out_capacity_metric",
    "out_utilization_margin",
    "out_expanded_uncertainty",
    "out_threshold_crossing",
    "out_sensitivity_driver",
    "out_fmea_trigger",
    "out_money_at_risk",
    "out_scenario_delta",
    "out_audit_hash_payload",
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
