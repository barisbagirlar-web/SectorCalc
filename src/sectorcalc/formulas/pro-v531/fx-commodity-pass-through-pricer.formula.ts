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

export const toolKey = "fx-commodity-pass-through-pricer";
export const formulaVersion = "5.3.1-pro-baris.1";

export const requiredInputKeys = [
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

  const basePrice = v.n_base_price;
  const spotFx = v.n_fx_rate_spot;
  const budgetFx = v.n_fx_rate_budget;
  const currentCommodity = v.n_commodity_index_current;
  const budgetCommodity = v.n_commodity_index_budget;
  const materialCostPct = v.n_material_cost_pct;
  const fxHedgePct = v.n_fx_hedge_pct;
  const commodityHedgePct = v.n_commodity_hedge_pct;
  const annualVolume = v.n_annual_volume;
  const confidence = v.n_source_confidence_ratio;

  requireNonNegative(basePrice, "Base price", state);
  requirePositive(spotFx, "Spot FX rate", state);
  requirePositive(budgetFx, "Budget FX rate", state);
  requirePositive(currentCommodity, "Current commodity index", state);
  requirePositive(budgetCommodity, "Budget commodity index", state);
  requireRange(materialCostPct, 0, 100, "Material cost share (%)", state);
  requireRange(fxHedgePct, 0, 100, "FX hedge (%)", state);
  requireRange(commodityHedgePct, 0, 100, "Commodity hedge (%)", state);
  requireInteger(annualVolume, 1, 1000000000000, "Annual volume", state);
  requireRange(confidence, 0, 1, "Source confidence", state);

  if (state.errors.length > 0) {
    return finalizeResult({ outputs: {}, outputKeys: declaredOutputKeys, state });
  }

  const fxChange = divideOrError(spotFx - budgetFx, budgetFx, "FX change", state);
  const commodityChange = divideOrError(
    currentCommodity - budgetCommodity,
    budgetCommodity,
    "Commodity index change",
    state,
  );
  const materialShare = materialCostPct / 100;
  const unhedgedFxShare = 1 - fxHedgePct / 100;
  const unhedgedCommodityShare = 1 - commodityHedgePct / 100;
  const fxImpactRatio = fxChange * materialShare * unhedgedFxShare;
  const commodityImpactRatio =
    commodityChange * materialShare * unhedgedCommodityShare;
  const passThroughRatio = fxImpactRatio + commodityImpactRatio;
  const adjustedPrice = basePrice * (1 + passThroughRatio);
  const escalationPerUnit = adjustedPrice - basePrice;
  const annualEscalation = escalationPerUnit * annualVolume;
  const uncertainty = Math.abs(annualEscalation) * (1 - confidence);

  const impacts = [Math.abs(fxImpactRatio), Math.abs(commodityImpactRatio)];
  const sensitivityDriver = impacts.indexOf(Math.max(...impacts));

  let decision = 0;
  if (Math.abs(passThroughRatio) >= 0.05) decision = 1;
  if (adjustedPrice < 0) {
    state.errors.push("Adjusted price became negative; verify index and hedge inputs.");
  }
  if (confidence < 0.7) decision = 1;
  if (confidence < 0.7) {
    state.warnings.push("Source confidence is below 70%; verify budget rates, index dates and hedge coverage.");
  }

  const outputs: Record<string, number> = {
    out_evidence_completeness: roundDisplay(confidence, 4),
    out_normalized_demand: roundDisplay(annualVolume, 0),
    out_reference_deviation: roundDisplay(fxChange, 6),
    out_derating_factor: roundDisplay(confidence, 4),
    out_demand_metric: roundDisplay(adjustedPrice, 4),
    out_capacity_metric: roundDisplay(annualEscalation, 2),
    out_utilization_margin: roundDisplay(passThroughRatio, 6),
    out_expanded_uncertainty: roundDisplay(uncertainty, 2),
    out_threshold_crossing: Math.abs(passThroughRatio) >= 0.05 ? 1 : 0,
    out_sensitivity_driver: sensitivityDriver,
    out_fmea_trigger: Math.abs(passThroughRatio) >= 0.15 ? 1 : 0,
    out_money_at_risk: roundDisplay(uncertainty, 2),
    out_scenario_delta: roundDisplay(escalationPerUnit, 4),
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
