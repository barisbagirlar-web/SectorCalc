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

export const toolKey = "product-sku-margin-ranker";
export const formulaVersion = "5.3.1-pro-baris.1";

export const requiredInputKeys = [
  "n_machine_rate",
  "n_cycle_time",
  "n_material_cost",
  "n_target_margin",
  "n_annual_volume",
  "n_labor_rate",
  "n_overhead_rate",
  "n_defect_or_loss_cost",
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

  const unitSellingPrice = v.n_machine_rate;
  const cycleSeconds = v.n_cycle_time;
  const materialCostPerUnit = v.n_material_cost;
  const targetMargin = v.n_target_margin;
  const annualVolume = v.n_annual_volume;
  const laborRate = v.n_labor_rate;
  const annualOverheadPool = v.n_overhead_rate;
  const annualQualityLoss = v.n_defect_or_loss_cost;
  const confidence = v.n_source_confidence_ratio;

  requirePositive(unitSellingPrice, "Unit selling price", state);
  requireNonNegative(cycleSeconds, "Cycle time", state);
  requireNonNegative(materialCostPerUnit, "Material cost per unit", state);
  requireRange(targetMargin, -1, 1, "Target margin ratio", state, { maxInclusive: false });
  requireInteger(annualVolume, 1, 1000000000000, "Annual volume", state);
  requireNonNegative(laborRate, "Labor rate", state);
  requireNonNegative(annualOverheadPool, "Annual overhead pool", state);
  requireNonNegative(annualQualityLoss, "Annual quality and loss cost", state);
  requireRange(confidence, 0, 1, "Source confidence", state);

  if (state.errors.length > 0) {
    return finalizeResult({ outputs: {}, outputKeys: declaredOutputKeys, state });
  }

  const laborCostPerUnit = laborRate * cycleSeconds / 3600;
  const overheadPerUnit = annualOverheadPool / annualVolume;
  const qualityLossPerUnit = annualQualityLoss / annualVolume;
  const fullyLoadedCostPerUnit =
    materialCostPerUnit + laborCostPerUnit + overheadPerUnit + qualityLossPerUnit;
  const contributionPerUnit = unitSellingPrice - fullyLoadedCostPerUnit;
  const netMarginRatio = divideOrError(
    contributionPerUnit,
    unitSellingPrice,
    "SKU net margin ratio",
    state,
  );
  const annualContribution = contributionPerUnit * annualVolume;
  const targetPrice = divideOrError(
    fullyLoadedCostPerUnit,
    1 - targetMargin,
    "Target-margin SKU price",
    state,
  );
  const uncertainty = Math.abs(annualContribution) * (1 - confidence);
  const drivers = [materialCostPerUnit, laborCostPerUnit, overheadPerUnit, qualityLossPerUnit];
  const sensitivityDriver = drivers.indexOf(Math.max(...drivers));

  let decision = 0;
  if (contributionPerUnit <= 0) decision = 2;
  else if (netMarginRatio < targetMargin || confidence < 0.7) decision = 1;

  if (confidence < 0.7) {
    state.warnings.push("Source confidence is below 70%; verify price, routing and allocation evidence.");
  }

  const outputs: Record<string, number> = {
    out_evidence_completeness: roundDisplay(confidence, 4),
    out_normalized_demand: roundDisplay(annualVolume, 0),
    out_reference_deviation: roundDisplay(unitSellingPrice - targetPrice, 4),
    out_derating_factor: roundDisplay(confidence, 4),
    out_demand_metric: roundDisplay(contributionPerUnit, 4),
    out_capacity_metric: roundDisplay(unitSellingPrice, 4),
    out_utilization_margin: roundDisplay(netMarginRatio, 6),
    out_expanded_uncertainty: roundDisplay(uncertainty, 2),
    out_threshold_crossing: netMarginRatio < targetMargin ? 1 : 0,
    out_sensitivity_driver: sensitivityDriver,
    out_fmea_trigger: contributionPerUnit <= 0 ? 1 : 0,
    out_money_at_risk: roundDisplay(contributionPerUnit <= 0 ? Math.abs(annualContribution) : uncertainty, 2),
    out_scenario_delta: roundDisplay(annualContribution, 2),
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
