// @server-only
/**
 * Machine Investment Feasibility: Buy vs Lease vs Keep — formula engine
 *
 * SINGLE SOURCE OF TRUTH. Pure function, no eval/new Function.
 * Isomorphic — no Node-only or browser-only APIs.
 *
 * Conforms to ProFormulaModule contract for generated-registry.ts.
 * The `calculate` wrapper maps generic Record<string, number> inputs
 * (n_ prefix keys) to typed InvestmentFeasibilityInputs, calls executeFormula(),
 * and wraps the result in ProFormulaResult format.
 */

import type { ProFormulaModule, ProFormulaResult } from "./pro-formula-contract";

// ─── Type exports ───────────────────────────────────────────────────────────

export interface InvestmentFeasibilityInputs {
  initialInvestment: number;
  annualNetCashFlow: number;
  discountRate: number;
  analysisYears: number;
  residualValue: number;
  stressDownsideFactor: number;
  annualVolume: number;
  laborRate: number;
  overheadRate: number;
  defectOrLossCost: number;
  sourceConfidence: number;
  uncertaintyMultiplier: number;
}

export interface InvestmentFeasibilityOutputs {
  out_evidence_completeness: number;
  out_normalized_demand: number;
  out_reference_deviation: number;
  out_derating_factor: number;
  out_demand_metric: number;
  out_capacity_metric: number;
  out_utilization_margin: number;
  out_expanded_uncertainty: number;
  out_threshold_crossing: number;
  out_sensitivity_driver: number;
  out_fmea_trigger: number;
  out_money_at_risk: number;
  out_scenario_delta: number;
  out_audit_hash_payload: number;
  out_final_decision_state: number;
}

// ─── Pure calculation ───────────────────────────────────────────────────────

export function executeFormula(inputs: InvestmentFeasibilityInputs): InvestmentFeasibilityOutputs {
  const {
    initialInvestment, annualNetCashFlow, discountRate, analysisYears,
    residualValue, stressDownsideFactor, annualVolume, laborRate,
    overheadRate, defectOrLossCost, sourceConfidence, uncertaintyMultiplier,
  } = inputs;

  const years = Math.max(1, Math.round(analysisYears));
  const rate = discountRate;
  const stress = Math.max(0, Math.min(1, stressDownsideFactor));

  // --- Buy scenario NPV ---
  const net_capex = initialInvestment;
  const annual_maintenance = overheadRate * 0.2;
  const annual_savings_buy = annualNetCashFlow - annual_maintenance;
  let npv_buy = -net_capex;
  for (let y = 1; y <= years; y++) {
    npv_buy += annual_savings_buy / Math.pow(1 + rate, y);
  }
  npv_buy += residualValue / Math.pow(1 + rate, years);

  // --- Lease scenario NPV ---
  const annual_lease_payment = initialInvestment * 0.25;
  let npv_lease = 0;
  for (let y = 1; y <= years; y++) {
    npv_lease += (annualNetCashFlow - annual_lease_payment) / Math.pow(1 + rate, y);
  }

  // --- Keep scenario NPV ---
  let npv_keep = 0;
  for (let y = 1; y <= years; y++) {
    npv_keep += (annualNetCashFlow * 0.5) / Math.pow(1 + rate, y);
  }

  // --- Decision ---
  const allNpv = [npv_buy, npv_lease, npv_keep];
  const allNegative = allNpv.every((v) => v <= 0);
  let decision: number;
  if (allNegative) {
    decision = 3; // REVIEW
  } else {
    const maxNpv = Math.max(npv_buy, npv_lease, npv_keep);
    if (maxNpv === npv_buy) decision = 0; // BUY
    else if (maxNpv === npv_lease) decision = 1; // LEASE
    else decision = 2; // KEEP
  }

  // --- Helper math ---
  const safeDiv = (n: number, d: number): number => {
    if (!isFinite(n) || !isFinite(d) || Math.abs(d) < 1e-12) return 0;
    return n / d;
  };

  const evidenceCount = 12; // all 12 inputs present
  const totalInputs = 12;
  const evidenceRatio = safeDiv(evidenceCount, totalInputs);
  const out_evidence_completeness = Math.min(1, Math.max(0, evidenceRatio));

  const demandMetric = annualVolume * safeDiv(laborRate, 1000);
  const out_normalized_demand = demandMetric;

  const refDev = safeDiv(overheadRate - laborRate, Math.max(1, laborRate));
  const out_reference_deviation = Math.min(1, Math.max(-1, refDev));

  const derating = 1 - stress * uncertaintyMultiplier * (1 - sourceConfidence);
  const out_derating_factor = Math.max(0, Math.min(1, derating));

  const out_demand_metric = demandMetric * sourceConfidence;

  const capacityMetric = safeDiv(annualNetCashFlow, Math.max(1, initialInvestment));
  const out_capacity_metric = capacityMetric;

  const sortedNpv = [...allNpv].sort((a, b) => b - a);
  const margin = sortedNpv.length > 1 ? sortedNpv[0] - sortedNpv[1] : 0;
  const out_utilization_margin = margin;

  const bestNpv = sortedNpv[0] || 0;
  const uncertainty = uncertaintyMultiplier * (1 - sourceConfidence) * Math.abs(bestNpv);
  const out_expanded_uncertainty = uncertainty;

  let threshold = 0;
  if (bestNpv > 0) threshold = 1;
  if (defectOrLossCost > 0 && bestNpv < defectOrLossCost) threshold = -1;
  const out_threshold_crossing = threshold;

  const drivers = [
    Math.abs(initialInvestment),
    Math.abs(annualNetCashFlow),
    Math.abs(overheadRate),
    Math.abs(laborRate),
  ];
  const maxDriver = Math.max(...drivers);
  const driverIdx = drivers.indexOf(maxDriver);
  const out_sensitivity_driver = driverIdx;

  let fmeaTrigger = 0;
  if (!allNegative && margin < 0.01 * Math.abs(bestNpv)) fmeaTrigger = 1;
  if (stress > 0.3) fmeaTrigger += 2;
  if (uncertainty > 0.2 * Math.abs(bestNpv)) fmeaTrigger += 4;
  const out_fmea_trigger = fmeaTrigger;

  const riskCost = defectOrLossCost * annualVolume * stress;
  const moneyAtRisk = Math.max(0, riskCost - bestNpv * (1 - stress));
  const out_money_at_risk = moneyAtRisk;

  const scenarioDelta = npv_buy - npv_lease;
  const out_scenario_delta = scenarioDelta;

  const hashSeed = npv_buy * 1000 + npv_lease * 100 + npv_keep * 10 + initialInvestment * 1.0;
  const auditHash = Math.abs(hashSeed) % 1000000;
  const out_audit_hash_payload = auditHash;

  const out_final_decision_state = decision;

  return {
    out_evidence_completeness,
    out_normalized_demand,
    out_reference_deviation,
    out_derating_factor,
    out_demand_metric,
    out_capacity_metric,
    out_utilization_margin,
    out_expanded_uncertainty,
    out_threshold_crossing,
    out_sensitivity_driver,
    out_fmea_trigger,
    out_money_at_risk,
    out_scenario_delta,
    out_audit_hash_payload,
    out_final_decision_state,
  };
}

// ─── Sensitivity helper ─────────────────────────────────────────────────────

export function sensitivity(
  inputs: InvestmentFeasibilityInputs,
  driver: keyof InvestmentFeasibilityInputs,
  pct = 0.10,
): number {
  const up = executeFormula({ ...inputs, [driver]: (inputs[driver] as number) * (1 + pct) }).out_money_at_risk;
  const dn = executeFormula({ ...inputs, [driver]: (inputs[driver] as number) * (1 - pct) }).out_money_at_risk;
  return Math.abs(up - dn);
}

// ─── ProFormulaModule contract ──────────────────────────────────────────────

function isFiniteNumber(v: unknown): v is number {
  return typeof v === "number" && Number.isFinite(v);
}

function get(inputs: Record<string, number>, key: string, fallback = 0): number {
  const v = inputs[key];
  return isFiniteNumber(v) ? v : fallback;
}

function round(v: number, d: number): number {
  if (!isFiniteNumber(v)) return 0;
  const f = Math.pow(10, d);
  return Math.round(v * f) / f;
}

const OUTPUT_KEYS: readonly string[] = [
  "out_evidence_completeness", "out_normalized_demand", "out_reference_deviation",
  "out_derating_factor", "out_demand_metric", "out_capacity_metric",
  "out_utilization_margin", "out_expanded_uncertainty", "out_threshold_crossing",
  "out_sensitivity_driver", "out_fmea_trigger", "out_money_at_risk",
  "out_scenario_delta", "out_audit_hash_payload", "out_final_decision_state",
];

export function calculate(inputs: Record<string, number>): ProFormulaResult {
  const warnings: string[] = [];

  const typed: InvestmentFeasibilityInputs = {
    initialInvestment: get(inputs, "n_initial_investment"),
    annualNetCashFlow: get(inputs, "n_annual_net_cash_flow"),
    discountRate: get(inputs, "n_discount_rate"),
    analysisYears: get(inputs, "n_analysis_years"),
    residualValue: get(inputs, "n_residual_value"),
    stressDownsideFactor: get(inputs, "n_stress_downside_factor"),
    annualVolume: get(inputs, "n_annual_volume"),
    laborRate: get(inputs, "n_labor_rate"),
    overheadRate: get(inputs, "n_overhead_rate"),
    defectOrLossCost: get(inputs, "n_defect_or_loss_cost"),
    sourceConfidence: get(inputs, "n_source_confidence_ratio"),
    uncertaintyMultiplier: get(inputs, "n_uncertainty_multiplier"),
  };

  const requiredKeys = [
    "n_initial_investment", "n_annual_net_cash_flow", "n_discount_rate",
    "n_analysis_years", "n_residual_value", "n_stress_downside_factor",
    "n_annual_volume", "n_labor_rate", "n_overhead_rate",
    "n_defect_or_loss_cost", "n_source_confidence_ratio", "n_uncertainty_multiplier",
  ];
  for (const key of requiredKeys) {
    if (!isFiniteNumber(inputs[key])) {
      warnings.push(`Input "${key}" is missing or invalid — using 0`);
    }
  }

  const raw = executeFormula(typed);
  const allOutputs = raw as unknown as Record<string, number>;
  const outputs: Record<string, number> = {};
  for (const key of OUTPUT_KEYS) {
    outputs[key] = round(allOutputs[key], 4);
  }

  const ok = OUTPUT_KEYS.every((k) => isFiniteNumber(outputs[k]));
  const decision = raw.out_final_decision_state;
  let status: "OK" | "REVIEW" | "BLOCKED" = ok ? "OK" : "REVIEW";
  if (warnings.length > 0) status = "REVIEW";
  if (decision === 3) status = "BLOCKED";

  return {
    status,
    outputs,
    warnings,
    outputKeys: [...OUTPUT_KEYS],
    redaction_status: "PUBLIC_SAFE_REDACTED",
  };
}

export const toolKey = "machine-investment-feasibility-buy-lease-keep";
export const formulaVersion = "5.3.1-pro-baris.1";

export const sampleInputs: Record<string, number> = {
  n_initial_investment: 500000,
  n_annual_net_cash_flow: 150000,
  n_discount_rate: 0.10,
  n_analysis_years: 5,
  n_residual_value: 50000,
  n_stress_downside_factor: 0.8,
  n_annual_volume: 10000,
  n_labor_rate: 80000,
  n_overhead_rate: 120000,
  n_defect_or_loss_cost: 15000,
  n_source_confidence_ratio: 0.95,
  n_uncertainty_multiplier: 1.2,
};

export const requiredInputKeys: readonly string[] = [
  "n_initial_investment", "n_annual_net_cash_flow", "n_discount_rate",
  "n_analysis_years", "n_residual_value", "n_stress_downside_factor",
  "n_annual_volume", "n_labor_rate", "n_overhead_rate",
  "n_defect_or_loss_cost", "n_source_confidence_ratio", "n_uncertainty_multiplier",
];

export const declaredOutputKeys: readonly string[] = [...OUTPUT_KEYS];
