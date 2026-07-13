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

export const toolKey = "energy-efficiency-grant-incentive-feasibility-pack";
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
    "n_current_kwh_per_year",
    "n_target_kwh_per_year",
    "n_avg_kwh_rate",
    "n_implementation_cost",
    "n_grant_coverage_pct",
    "n_maintenance_cost_saving",
    "n_emission_factor_kgco2_per_kwh",
    "n_equipment_life_years",
    "n_discount_rate",
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
  const n_current_kwh_per_year = get(inputs, "n_current_kwh_per_year");
  const n_target_kwh_per_year = get(inputs, "n_target_kwh_per_year");
  const n_avg_kwh_rate = get(inputs, "n_avg_kwh_rate");
  const n_implementation_cost = get(inputs, "n_implementation_cost");
  const n_grant_coverage_pct = get(inputs, "n_grant_coverage_pct");
  const n_maintenance_cost_saving = get(inputs, "n_maintenance_cost_saving");
  const n_emission_factor_kgco2_per_kwh = get(inputs, "n_emission_factor_kgco2_per_kwh");
  const n_equipment_life_years = get(inputs, "n_equipment_life_years");
  const n_discount_rate = get(inputs, "n_discount_rate");
  const n_source_confidence_ratio = get(inputs, "n_source_confidence_ratio");

  // --- Core energy efficiency feasibility logic ---
  const kwh_saving = n_current_kwh_per_year - n_target_kwh_per_year;
  const money_saving = kwh_saving * n_avg_kwh_rate + n_maintenance_cost_saving;
  const grant_amount = n_implementation_cost * n_grant_coverage_pct;
  const net_cost = n_implementation_cost - grant_amount;
  const payback = net_cost > 0 ? net_cost / money_saving : 0;

  const total_saving_5yr = money_saving * 5;
  const roi = net_cost > 0
    ? (total_saving_5yr - net_cost) / net_cost * 100
    : 999;

  const co2_saving = kwh_saving * n_emission_factor_kgco2_per_kwh / 1000;
  const annual_co2_reduction = co2_saving;

  // --- Decision ---
  let decision: number;
  if (payback <= 3) {
    decision = 0; // PROCEED
  } else if (payback <= 5) {
    decision = 1; // REVIEW
  } else {
    decision = 2; // HOLD
  }

  // --- Output 1: out_evidence_completeness ---
  const totalInputs = requiredKeys.length;
  const evidenceRatio = safeDiv(evidenceCount, totalInputs);
  outputs["out_evidence_completeness"] = round(Math.min(1, Math.max(0, evidenceRatio)), 4);

  // --- Output 2: out_normalized_demand (dimensionless ratio) ---
  const demandMetric = safeDiv(kwh_saving, Math.max(1, n_current_kwh_per_year));
  outputs["out_normalized_demand"] = round(demandMetric, 4);

  // --- Output 3: out_reference_deviation ---
  const refDev = safeDiv(n_current_kwh_per_year - n_target_kwh_per_year, Math.max(1, n_current_kwh_per_year));
  outputs["out_reference_deviation"] = round(Math.min(1, Math.max(0, refDev)), 4);

  // --- Output 4: out_derating_factor ---
  const derating = 1 - safeDiv(payback, 10) * (1 - n_source_confidence_ratio);
  outputs["out_derating_factor"] = round(Math.max(0, Math.min(1, derating)), 4);

  // --- Output 5: out_demand_metric ---
  outputs["out_demand_metric"] = round(demandMetric * n_source_confidence_ratio, 4);

  // --- Output 6: out_capacity_metric ---
  const capacityMetric = safeDiv(money_saving, Math.max(1, n_implementation_cost));
  outputs["out_capacity_metric"] = round(capacityMetric, 4);

  // --- Output 7: out_utilization_margin ---
  const utilizationMargin = safeDiv(total_saving_5yr, Math.max(1, net_cost));
  outputs["out_utilization_margin"] = round(utilizationMargin, 4);

  // --- Output 8: out_expanded_uncertainty ---
  const uncertainty = safeDiv(payback * (1 - n_source_confidence_ratio), 2);
  outputs["out_expanded_uncertainty"] = round(uncertainty, 4);

  // --- Output 9: out_threshold_crossing ---
  let threshold = 0;
  if (payback <= 3) threshold = 1;
  if (payback > 5) threshold = -1;
  outputs["out_threshold_crossing"] = threshold;

  // --- Output 10: out_sensitivity_driver ---
  const drivers = [
    Math.abs(kwh_saving),
    Math.abs(n_avg_kwh_rate),
    Math.abs(n_implementation_cost),
    Math.abs(n_grant_coverage_pct),
  ];
  const maxDriver = Math.max(...drivers);
  const driverIdx = drivers.indexOf(maxDriver);
  outputs["out_sensitivity_driver"] = driverIdx;

  // --- Output 11: out_fmea_trigger ---
  let fmeaTrigger = 0;
  if (decision === 1) fmeaTrigger = 1;
  if (payback > 10) fmeaTrigger += 2;
  if (n_grant_coverage_pct > 0.8) fmeaTrigger += 4;
  outputs["out_fmea_trigger"] = fmeaTrigger;

  // --- Output 12: out_money_at_risk ---
  const moneyAtRisk = Math.max(0, net_cost - money_saving * n_equipment_life_years);
  outputs["out_money_at_risk"] = round(moneyAtRisk, 4);

  // --- Output 13: out_scenario_delta (dimensionless benefit/cost ratio) ---
  const scenarioDelta = safeDiv(money_saving, Math.max(1, net_cost));
  outputs["out_scenario_delta"] = round(scenarioDelta, 4);

  // --- Output 14: out_audit_hash_payload ---
  const hashSeed = payback * 1000 + roi * 10 + kwh_saving;
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
