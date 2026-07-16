// @server-only
/**
 * Capital Equipment Investment Appraisal (NPV/IRR) — formula engine
 *
 * SINGLE SOURCE OF TRUTH. Pure function, no eval/new Function.
 * Isomorphic — no Node-only or browser-only APIs.
 *
 * Conforms to ProFormulaModule contract for generated-registry.ts.
 * The `calculate` wrapper maps generic Record<string, number> inputs
 * (n_ prefix keys) to typed NPVIRRInputs, calls executeFormula(),
 * and wraps the result in ProFormulaResult format.
 */

import type { ProFormulaModule, ProFormulaResult } from "./pro-formula-contract";

// ─── Type exports ───────────────────────────────────────────────────────────

export interface NPVIRRInputs {
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

export interface NPVIRROutputs {
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

export function executeFormula(inputs: NPVIRRInputs): NPVIRROutputs {
  const {
    initialInvestment, annualNetCashFlow, discountRate, analysisYears,
    residualValue, stressDownsideFactor, annualVolume, laborRate,
    overheadRate, defectOrLossCost, sourceConfidence, uncertaintyMultiplier,
  } = inputs;

  const years = Math.max(1, Math.round(analysisYears));
  const rate = discountRate;
  const stress = Math.max(0, Math.min(1, stressDownsideFactor));

  const safeDiv = (n: number, d: number): number => {
    if (!isFinite(n) || !isFinite(d) || Math.abs(d) < 1e-12) return 0;
    return n / d;
  };

  // --- NPV calculation ---
  const annualCf = annualNetCashFlow + safeDiv(residualValue, analysisYears);
  let npv = -initialInvestment;
  for (let y = 1; y <= years; y++) {
    npv += annualCf / Math.pow(1 + rate, y);
  }
  npv += residualValue / Math.pow(1 + rate, years);

  // --- IRR calculation (Newton's method) ---
  let irr = 0.1;
  const maxIter = 100;
  for (let iter = 0; iter < maxIter; iter++) {
    let npvAtGuess = -initialInvestment;
    for (let y = 1; y <= years; y++) {
      npvAtGuess += annualCf / Math.pow(1 + irr, y);
    }
    npvAtGuess += residualValue / Math.pow(1 + irr, years);

    if (Math.abs(npvAtGuess) < 0.001) break;

    let dnpv = 0;
    for (let y = 1; y <= years; y++) {
      dnpv += (-y * annualCf) / Math.pow(1 + irr, y + 1);
    }
    dnpv += (-years * residualValue) / Math.pow(1 + irr, years + 1);

    if (Math.abs(dnpv) < 1e-12) {
      irr = 0;
      break;
    }
    irr = irr - npvAtGuess / dnpv;

    if (!isFinite(irr)) {
      irr = 0;
      break;
    }
    if (irr < -0.99) irr = -0.99;
    if (irr > 10) irr = 10;
  }
  const irrPct = irr * 100;

  // --- Payback period ---
  let cumulative = -initialInvestment;
  let payback = years;
  for (let y = 1; y <= years; y++) {
    cumulative += annualCf;
    if (cumulative >= 0) {
      payback = y - safeDiv(cumulative - annualCf, annualCf);
      break;
    }
  }

  // --- Profitability Index ---
  const pi = initialInvestment > 0
    ? safeDiv(npv + initialInvestment, initialInvestment)
    : 0;

  // --- Decision ---
  let decision: number;
  if (npv > 0 && irr > rate) {
    decision = 0; // PASS
  } else if (npv > 0) {
    decision = 1; // REVIEW (NPV positive but IRR below discount rate)
  } else {
    decision = 2; // HOLD
  }

  // --- Standard outputs ---
  const evidenceCount = 12;
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

  const out_utilization_margin = pi;

  const uncertainty = uncertaintyMultiplier * (1 - sourceConfidence) * Math.abs(npv);
  const out_expanded_uncertainty = uncertainty;

  let threshold = 0;
  if (npv > 0) threshold = 1;
  if (defectOrLossCost > 0 && npv < defectOrLossCost) threshold = -1;
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
  if (decision === 1) fmeaTrigger = 1;
  if (stress > 0.3) fmeaTrigger += 2;
  if (irr <= 0) fmeaTrigger += 4;
  const out_fmea_trigger = fmeaTrigger;

  const riskCost = defectOrLossCost * annualVolume * stress;
  const moneyAtRisk = Math.max(0, riskCost - npv * (1 - stress));
  const out_money_at_risk = moneyAtRisk;

  const scenarioDelta = npv - irrPct * 100;
  const out_scenario_delta = scenarioDelta;

  const hashSeed = npv * 1000 + irr * 100 + payback * 10 + initialInvestment;
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
  inputs: NPVIRRInputs,
  driver: keyof NPVIRRInputs,
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

  const typed: NPVIRRInputs = {
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
  if (decision === 2) status = "BLOCKED";

  return {
    status,
    outputs,
    warnings,
    outputKeys: [...OUTPUT_KEYS],
    redaction_status: "PUBLIC_SAFE_REDACTED",
  };
}

export const toolKey = "capital-equipment-investment-appraisal-npv-irr";
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
