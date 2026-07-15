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

export const toolKey = "energy-efficiency-grant-incentive-feasibility-pack";
export const formulaVersion = "5.3.1-pro-baris.1";

export const requiredInputKeys = [
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

export function calculate(inputs: Record<string, number>): ProFormulaResult {
  const state = createValidationState();
  const v = requireFiniteInputs(inputs, requiredInputKeys, state);
  if (state.errors.length > 0) {
    return finalizeResult({ outputs: {}, outputKeys: declaredOutputKeys, state });
  }

  const currentKwh = v.n_current_kwh_per_year;
  const targetKwh = v.n_target_kwh_per_year;
  const energyRate = v.n_avg_kwh_rate;
  const implementationCost = v.n_implementation_cost;
  const grantCoveragePct = v.n_grant_coverage_pct;
  const maintenanceSaving = v.n_maintenance_cost_saving;
  const emissionFactor = v.n_emission_factor_kgco2_per_kwh;
  const lifeYears = v.n_equipment_life_years;
  const discountRate = v.n_discount_rate;
  const confidence = v.n_source_confidence_ratio;

  requirePositive(currentKwh, "Current annual energy", state);
  requireNonNegative(targetKwh, "Target annual energy", state);
  requireNonNegative(energyRate, "Energy price", state);
  requireNonNegative(implementationCost, "Implementation cost", state);
  requireRange(grantCoveragePct, 0, 100, "Grant coverage (%)", state);
  requireNonNegative(maintenanceSaving, "Annual maintenance saving", state);
  requireNonNegative(emissionFactor, "Emission factor", state);
  requireInteger(lifeYears, 1, 100, "Equipment life", state);
  requireRange(discountRate, 0, 1, "Discount rate", state, { maxInclusive: false });
  requireRange(confidence, 0, 1, "Source confidence", state);

  if (targetKwh >= currentKwh) {
    state.errors.push("Target annual energy must be lower than current annual energy for an efficiency project.");
  }

  if (state.errors.length > 0) {
    return finalizeResult({ outputs: {}, outputKeys: declaredOutputKeys, state });
  }

  const energySavingKwh = currentKwh - targetKwh;
  const annualEnergySaving = energySavingKwh * energyRate;
  const annualCashSaving = annualEnergySaving + maintenanceSaving;
  const grantAmount = implementationCost * (grantCoveragePct / 100);
  const netInvestment = implementationCost - grantAmount;

  let npv = -netInvestment;
  let presentValueSavings = 0;
  for (let year = 1; year <= lifeYears; year += 1) {
    const discountedSaving = annualCashSaving / (1 + discountRate) ** year;
    presentValueSavings += discountedSaving;
    npv += discountedSaving;
  }

  const paybackYears = annualCashSaving > 0
    ? divideOrError(netInvestment, annualCashSaving, "Simple payback", state)
    : Number.POSITIVE_INFINITY;
  const discountedReturn = netInvestment > 0
    ? divideOrError(npv, netInvestment, "Discounted return ratio", state)
    : presentValueSavings > 0 ? 1 : 0;
  const co2SavingTonnes = energySavingKwh * emissionFactor / 1000;
  const uncertainty = Math.abs(npv) * (1 - confidence);

  let decision = 0;
  if (annualCashSaving <= 0 || npv <= 0) decision = 2;
  else if (paybackYears > 3 || confidence < 0.7) decision = 1;

  if (confidence < 0.7) {
    state.warnings.push("Source confidence is below 70%; verify meter, tariff and grant evidence.");
  }

  const drivers = [annualEnergySaving, maintenanceSaving, netInvestment];
  const sensitivityDriver = drivers.indexOf(Math.max(...drivers.map(Math.abs)));
  const moneyAtRisk = Math.max(0, -npv) + uncertainty;

  const outputs: Record<string, number> = {
    out_evidence_completeness: roundDisplay(confidence, 4),
    out_normalized_demand: roundDisplay(currentKwh, 2),
    out_reference_deviation: roundDisplay(energySavingKwh / currentKwh, 6),
    out_derating_factor: roundDisplay(confidence, 4),
    out_demand_metric: roundDisplay(annualCashSaving, 2),
    out_capacity_metric: roundDisplay(npv, 2),
    out_utilization_margin: roundDisplay(discountedReturn, 6),
    out_expanded_uncertainty: roundDisplay(uncertainty, 2),
    out_threshold_crossing: npv > 0 ? 1 : 0,
    out_sensitivity_driver: sensitivityDriver,
    out_fmea_trigger: decision > 0 ? 1 : 0,
    out_money_at_risk: roundDisplay(moneyAtRisk, 2),
    out_scenario_delta: roundDisplay(co2SavingTonnes, 3),
    out_audit_hash_payload: 0,
    out_final_decision_state: decision,
  };

  if (!Number.isFinite(paybackYears) && annualCashSaving > 0) {
    state.errors.push("Payback calculation is non-finite.");
  }

  return finalizeResult({
    outputs,
    outputKeys: declaredOutputKeys,
    state,
    status: decision === 0 ? "OK" : "REVIEW",
  });
}
