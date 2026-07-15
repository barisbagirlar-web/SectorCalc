import "server-only";

import { PRO_SAMPLE_INPUTS } from "./pro-sample-inputs";
import type { ProFormulaResult } from "./pro-formula-contract";
import {
  createValidationState,
  divideOrError,
  finalizeResult,
  requireFiniteInputs,
  requireInteger,
  requireNonNegative,
  requirePositive,
  requireRange,
  roundDisplay,
} from "./pro-formula-safety";

export const toolKey = "capital-equipment-investment-appraisal-npv-irr";
export const formulaVersion = "5.3.1-pro-baris.1";

export const requiredInputKeys = [
  "n_initial_investment",
  "n_annual_net_cash_flow",
  "n_discount_rate",
  "n_analysis_years",
  "n_residual_value",
  "n_stress_downside_factor",
  "n_annual_volume",
  "n_labor_rate",
  "n_overhead_rate",
  "n_defect_or_loss_cost",
  "n_source_confidence_ratio",
  "n_uncertainty_multiplier",
] as const;

export const declaredOutputKeys = [
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
] as const;

export const sampleInputs = PRO_SAMPLE_INPUTS[toolKey];

function npvForRate(
  rate: number,
  investment: number,
  annualCashFlow: number,
  years: number,
  residual: number,
): number {
  let value = -investment;
  for (let year = 1; year <= years; year += 1) {
    value += annualCashFlow / (1 + rate) ** year;
  }
  value += residual / (1 + rate) ** years;
  return value;
}

function solveIrr(
  investment: number,
  annualCashFlow: number,
  years: number,
  residual: number,
): number | null {
  let low = -0.999999;
  let high = 10;
  let lowValue = npvForRate(low, investment, annualCashFlow, years, residual);
  let highValue = npvForRate(high, investment, annualCashFlow, years, residual);

  if (!Number.isFinite(lowValue) || !Number.isFinite(highValue) || lowValue * highValue > 0) {
    return null;
  }

  for (let iteration = 0; iteration < 200; iteration += 1) {
    const mid = (low + high) / 2;
    const midValue = npvForRate(mid, investment, annualCashFlow, years, residual);
    if (!Number.isFinite(midValue)) return null;
    if (Math.abs(midValue) < 1e-7) return mid;

    if (lowValue * midValue <= 0) {
      high = mid;
      highValue = midValue;
    } else {
      low = mid;
      lowValue = midValue;
    }
  }

  const irr = (low + high) / 2;
  return Number.isFinite(irr) ? irr : null;
}

export function calculate(inputs: Record<string, number>): ProFormulaResult {
  const state = createValidationState();
  const v = requireFiniteInputs(inputs, requiredInputKeys, state);
  if (state.errors.length > 0) {
    return finalizeResult({ outputs: {}, outputKeys: declaredOutputKeys, state });
  }

  const investment = v.n_initial_investment;
  const annualCashFlow = v.n_annual_net_cash_flow;
  const discountRate = v.n_discount_rate;
  const years = v.n_analysis_years;
  const residual = v.n_residual_value;
  const downsideRetention = v.n_stress_downside_factor;
  const annualVolume = v.n_annual_volume;
  const laborRate = v.n_labor_rate;
  const overheadRate = v.n_overhead_rate;
  const lossExposure = v.n_defect_or_loss_cost;
  const confidence = v.n_source_confidence_ratio;
  const uncertaintyMultiplier = v.n_uncertainty_multiplier;

  requirePositive(investment, "Initial investment", state);
  requireNonNegative(annualCashFlow, "Annual net cash flow", state);
  requireRange(discountRate, 0, 1, "Discount rate", state, { maxInclusive: false });
  requireInteger(years, 1, 100, "Analysis years", state);
  requireNonNegative(residual, "Residual value", state);
  requireRange(downsideRetention, 0, 1, "Downside cash-flow retention", state);
  requireNonNegative(annualVolume, "Annual volume", state);
  requireNonNegative(laborRate, "Labor rate", state);
  requireNonNegative(overheadRate, "Overhead rate", state);
  requireNonNegative(lossExposure, "Defect or loss exposure", state);
  requireRange(confidence, 0, 1, "Source confidence", state);
  requireRange(uncertaintyMultiplier, 0, 5, "Uncertainty multiplier", state, {
    minInclusive: false,
  });

  if (residual > investment) {
    state.warnings.push("Residual value exceeds initial investment; verify the disposal-value basis.");
  }

  if (state.errors.length > 0) {
    return finalizeResult({ outputs: {}, outputKeys: declaredOutputKeys, state });
  }

  // Residual value is included once, at the terminal year. The previous engine
  // incorrectly spread it across annual cash flow and added it again at exit.
  const npv = npvForRate(discountRate, investment, annualCashFlow, years, residual);
  const stressedCashFlow = annualCashFlow * downsideRetention;
  const stressedNpv = npvForRate(discountRate, investment, stressedCashFlow, years, residual);
  const irr = solveIrr(investment, annualCashFlow, years, residual);

  if (irr === null) {
    state.warnings.push("IRR is not uniquely bracketed by the cash-flow pattern; use NPV as the governing metric.");
  }

  const presentValueInflows = npv + investment;
  const profitabilityIndex = divideOrError(
    presentValueInflows,
    investment,
    "Profitability index",
    state,
  );
  const irrValue = irr ?? 0;
  const scenarioDelta = npv - stressedNpv;
  const uncertainty =
    Math.abs(scenarioDelta) * uncertaintyMultiplier + Math.abs(npv) * (1 - confidence);
  const moneyAtRisk = Math.max(0, -stressedNpv) + lossExposure;

  const sensitivityMagnitudes = [
    investment,
    annualCashFlow * years,
    residual,
    Math.abs(npvForRate(Math.min(0.999999, discountRate + 0.01), investment, annualCashFlow, years, residual) - npv),
  ];
  const sensitivityDriver = sensitivityMagnitudes.indexOf(Math.max(...sensitivityMagnitudes));

  let decision = 0;
  if (npv <= 0 || (irr !== null && irr <= discountRate)) decision = 2;
  else if (stressedNpv < 0 || confidence < 0.7) decision = 1;

  if (confidence < 0.7) {
    state.warnings.push("Source confidence is below 70%; verify cash-flow evidence before investment approval.");
  }
  if (stressedNpv < 0 && npv > 0) {
    state.warnings.push("Base-case NPV is positive but downside NPV is negative.");
  }

  const outputs: Record<string, number> = {
    out_evidence_completeness: roundDisplay(confidence, 4),
    out_normalized_demand: roundDisplay(annualCashFlow, 2),
    out_reference_deviation: roundDisplay(irr === null ? 0 : irr - discountRate, 4),
    out_derating_factor: roundDisplay(downsideRetention * confidence, 4),
    out_demand_metric: roundDisplay(npv, 2),
    out_capacity_metric: roundDisplay(irrValue, 6),
    out_utilization_margin: roundDisplay(profitabilityIndex, 4),
    out_expanded_uncertainty: roundDisplay(uncertainty, 2),
    out_threshold_crossing: npv > 0 ? 1 : 0,
    out_sensitivity_driver: sensitivityDriver,
    out_fmea_trigger: stressedNpv < 0 || irr === null ? 1 : 0,
    out_money_at_risk: roundDisplay(moneyAtRisk, 2),
    out_scenario_delta: roundDisplay(scenarioDelta, 2),
    out_audit_hash_payload: 0,
    out_final_decision_state: decision,
  };

  return finalizeResult({
    outputs,
    outputKeys: declaredOutputKeys,
    state,
    status: decision === 0 ? "OK" : "REVIEW",
  });
}
