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

export const toolKey = "motor-compressor-replacement-roi";
export const formulaVersion = "5.3.1-pro-baris.1";

export const requiredInputKeys = [
  "n_motor_power_kw",
  "n_annual_operating_hours",
  "n_current_efficiency_pct",
  "n_new_efficiency_pct",
  "n_avg_kwh_rate",
  "n_replacement_cost",
  "n_installation_cost",
  "n_maintenance_saving_per_year",
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

  const outputPowerKw = v.n_motor_power_kw;
  const annualHours = v.n_annual_operating_hours;
  const currentEfficiencyPct = v.n_current_efficiency_pct;
  const newEfficiencyPct = v.n_new_efficiency_pct;
  const energyRate = v.n_avg_kwh_rate;
  const replacementCost = v.n_replacement_cost;
  const installationCost = v.n_installation_cost;
  const maintenanceSaving = v.n_maintenance_saving_per_year;
  const lifeYears = v.n_equipment_life_years;
  const discountRate = v.n_discount_rate;
  const confidence = v.n_source_confidence_ratio;

  requirePositive(outputPowerKw, "Motor/compressor output power", state);
  requireRange(annualHours, 0, 8760, "Annual operating hours", state, {
    minInclusive: false,
  });
  requireRange(currentEfficiencyPct, 0, 100, "Current efficiency (%)", state, {
    minInclusive: false,
  });
  requireRange(newEfficiencyPct, 0, 100, "New efficiency (%)", state, {
    minInclusive: false,
  });
  requireNonNegative(energyRate, "Energy price", state);
  requireNonNegative(replacementCost, "Replacement cost", state);
  requireNonNegative(installationCost, "Installation cost", state);
  requireNonNegative(maintenanceSaving, "Annual maintenance saving", state);
  requireInteger(lifeYears, 1, 100, "Equipment life", state);
  requireRange(discountRate, 0, 1, "Discount rate", state, {
    maxInclusive: false,
  });
  requireRange(confidence, 0, 1, "Source confidence", state);

  const totalInvestment = replacementCost + installationCost;
  requirePositive(totalInvestment, "Total replacement investment", state);

  if (state.errors.length > 0) {
    return finalizeResult({ outputs: {}, outputKeys: declaredOutputKeys, state });
  }

  const currentEfficiency = currentEfficiencyPct / 100;
  const newEfficiency = newEfficiencyPct / 100;
  const currentKwh = divideOrError(
    outputPowerKw * annualHours,
    currentEfficiency,
    "Current annual energy",
    state,
  );
  const newKwh = divideOrError(
    outputPowerKw * annualHours,
    newEfficiency,
    "New annual energy",
    state,
  );
  const currentEnergyCost = currentKwh * energyRate;
  const newEnergyCost = newKwh * energyRate;
  const energySaving = currentEnergyCost - newEnergyCost;
  const annualSaving = energySaving + maintenanceSaving;

  // ROI and simple payback are undefined when the replacement does not produce
  // positive annual cash savings. Do not emit an arbitrary 999-month sentinel.
  if (annualSaving <= 0) {
    state.errors.push(
      "Replacement does not produce positive annual savings; ROI and payback are undefined.",
    );
    return finalizeResult({ outputs: {}, outputKeys: declaredOutputKeys, state });
  }

  let npv = -totalInvestment;
  for (let year = 1; year <= lifeYears; year += 1) {
    npv += annualSaving / (1 + discountRate) ** year;
  }

  const paybackMonths =
    divideOrError(totalInvestment, annualSaving, "Simple payback", state) * 12;
  const discountedReturnRatio = divideOrError(
    npv,
    totalInvestment,
    "Discounted return ratio",
    state,
  );
  const uncertainty = Math.abs(npv) * (1 - confidence);

  let decision = 0;
  if (npv <= 0) decision = 2;
  else if (
    paybackMonths > 24 ||
    confidence < 0.7 ||
    newEfficiency <= currentEfficiency
  ) {
    decision = 1;
  }

  if (newEfficiency <= currentEfficiency) {
    state.warnings.push(
      "New efficiency does not exceed current efficiency; verify nameplate and load-point data.",
    );
  }
  if (confidence < 0.7) {
    state.warnings.push(
      "Source confidence is below 70%; verify measured load, hours and tariff evidence.",
    );
  }

  const drivers = [Math.abs(energySaving), maintenanceSaving, totalInvestment];
  const sensitivityDriver = drivers.indexOf(Math.max(...drivers));

  const outputs: Record<string, number> = {
    out_evidence_completeness: roundDisplay(confidence, 4),
    out_normalized_demand: roundDisplay(annualHours, 0),
    out_reference_deviation: roundDisplay(
      newEfficiency - currentEfficiency,
      6,
    ),
    out_derating_factor: roundDisplay(confidence, 4),
    out_demand_metric: roundDisplay(currentEnergyCost, 2),
    out_capacity_metric: roundDisplay(newEnergyCost, 2),
    out_utilization_margin: roundDisplay(annualSaving, 2),
    out_expanded_uncertainty: roundDisplay(uncertainty, 2),
    out_threshold_crossing: npv > 0 ? 1 : 0,
    out_sensitivity_driver: sensitivityDriver,
    out_fmea_trigger: decision > 0 ? 1 : 0,
    out_money_at_risk: roundDisplay(totalInvestment, 2),
    out_scenario_delta: roundDisplay(paybackMonths, 2),
    out_audit_hash_payload: 0,
    out_final_decision_state: decision,
  };

  if (!Number.isFinite(discountedReturnRatio)) {
    state.errors.push("Discounted return ratio is non-finite.");
  }

  return finalizeResult({
    outputs,
    outputKeys: declaredOutputKeys,
    state,
    status: decision === 0 ? "OK" : "REVIEW",
  });
}
