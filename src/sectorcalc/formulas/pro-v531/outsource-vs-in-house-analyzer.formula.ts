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
  requireRange,
  roundDisplay,
} from "./pro-formula-safety";

export const toolKey = "outsource-vs-in-house-analyzer";
export const formulaVersion = "5.3.1-pro-baris.1";

export const requiredInputKeys = [
  "n_in_house_material_cost",
  "n_in_house_labor_cost",
  "n_in_house_overhead",
  "n_in_house_setup_cost",
  "n_outsource_unit_price",
  "n_outsource_logistics_cost",
  "n_annual_volume",
  "n_quality_risk_premium_pct",
  "n_capacity_utilization_pct",
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

  const materialCost = v.n_in_house_material_cost;
  const laborCost = v.n_in_house_labor_cost;
  const overheadCost = v.n_in_house_overhead;
  const setupCost = v.n_in_house_setup_cost;
  const outsourcePrice = v.n_outsource_unit_price;
  const logisticsCost = v.n_outsource_logistics_cost;
  const annualVolume = v.n_annual_volume;
  const qualityRiskPct = v.n_quality_risk_premium_pct;
  const utilizationPct = v.n_capacity_utilization_pct;
  const confidence = v.n_source_confidence_ratio;

  requireNonNegative(materialCost, "In-house material cost", state);
  requireNonNegative(laborCost, "In-house labor cost", state);
  requireNonNegative(overheadCost, "In-house overhead", state);
  requireNonNegative(setupCost, "In-house setup cost", state);
  requireNonNegative(outsourcePrice, "Outsource unit price", state);
  requireNonNegative(logisticsCost, "Outsource logistics cost", state);
  requireInteger(annualVolume, 1, 1000000000000, "Annual volume", state);
  requireRange(qualityRiskPct, 0, 100, "Quality risk premium (%)", state);
  requireRange(utilizationPct, 0, 100, "Capacity utilization (%)", state);
  requireRange(confidence, 0, 1, "Source confidence", state);

  if (state.errors.length > 0) {
    return finalizeResult({ outputs: {}, outputKeys: declaredOutputKeys, state });
  }

  const setupPerUnit = divideOrError(setupCost, annualVolume, "Setup cost per unit", state);
  const inHouseUnitCost = materialCost + laborCost + overheadCost + setupPerUnit;
  const outsourceLandedUnitCost = outsourcePrice + logisticsCost;
  const qualityRiskPremium = outsourceLandedUnitCost * (qualityRiskPct / 100);
  const riskAdjustedOutsourceUnitCost = outsourceLandedUnitCost + qualityRiskPremium;
  const savingsPerUnitFromOutsource = inHouseUnitCost - riskAdjustedOutsourceUnitCost;
  const annualDelta = savingsPerUnitFromOutsource * annualVolume;
  const uncertaintyBand =
    Math.max(inHouseUnitCost, riskAdjustedOutsourceUnitCost) * (1 - confidence);
  const annualMoneyAtRisk = uncertaintyBand * annualVolume;

  // Capacity utilization is a constraint signal only. The prior model invented a
  // monetary opportunity-cost coefficient. Without an entered opportunity-cost
  // rate, no capacity premium is added to either scenario.
  const highCapacityPressure = utilizationPct >= 90;
  const economicallySeparated = Math.abs(savingsPerUnitFromOutsource) > uncertaintyBand;

  let decision: number;
  if (!economicallySeparated || confidence < 0.7 || highCapacityPressure) {
    decision = 2; // REVIEW
  } else if (savingsPerUnitFromOutsource > 0) {
    decision = 1; // BUY
  } else {
    decision = 0; // MAKE
  }

  if (highCapacityPressure) {
    state.warnings.push(
      "Capacity utilization is at or above 90%; quantify the opportunity cost before final make/buy commitment.",
    );
  }
  if (confidence < 0.7) {
    state.warnings.push("Source confidence is below 70%; verify supplier quote and internal cost evidence.");
  }

  const drivers = [materialCost, laborCost, overheadCost, outsourcePrice, logisticsCost, qualityRiskPremium];
  const sensitivityDriver = drivers.indexOf(Math.max(...drivers));

  const outputs: Record<string, number> = {
    out_evidence_completeness: roundDisplay(confidence, 4),
    out_normalized_demand: roundDisplay(annualVolume, 0),
    out_reference_deviation: roundDisplay(qualityRiskPct / 100, 4),
    out_derating_factor: roundDisplay(utilizationPct / 100, 4),
    out_demand_metric: roundDisplay(inHouseUnitCost, 4),
    out_capacity_metric: roundDisplay(riskAdjustedOutsourceUnitCost, 4),
    out_utilization_margin: roundDisplay(utilizationPct / 100, 4),
    out_expanded_uncertainty: roundDisplay(uncertaintyBand, 4),
    out_threshold_crossing: economicallySeparated ? 1 : 0,
    out_sensitivity_driver: sensitivityDriver,
    out_fmea_trigger: decision === 2 ? 1 : 0,
    out_money_at_risk: roundDisplay(annualMoneyAtRisk, 2),
    out_scenario_delta: roundDisplay(annualDelta, 2),
    out_audit_hash_payload: 0,
    out_final_decision_state: decision,
  };

  return finalizeResult({
    outputs,
    outputKeys: declaredOutputKeys,
    state,
    status: decision === 2 ? "REVIEW" : "OK",
  });
}
