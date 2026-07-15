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

export const toolKey = "loss-making-job-detector";
export const formulaVersion = "5.3.1-pro-baris.1";

export const requiredInputKeys = [
  "n_machine_rate",
  "n_material_cost",
  "n_labor_rate",
  "n_overhead_rate",
  "n_defect_or_loss_cost",
  "n_target_margin",
  "n_batch_quantity",
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

  const quotedPricePerUnit = v.n_machine_rate;
  const materialCostPerUnit = v.n_material_cost;
  const laborCostPerUnit = v.n_labor_rate;
  const overheadCostPerUnit = v.n_overhead_rate;
  const lossCostPerUnit = v.n_defect_or_loss_cost;
  const targetMargin = v.n_target_margin;
  const batchQuantity = v.n_batch_quantity;
  const annualVolume = v.n_annual_volume;
  const confidence = v.n_source_confidence_ratio;

  requirePositive(quotedPricePerUnit, "Quoted selling price per unit", state);
  requireNonNegative(materialCostPerUnit, "Material cost per unit", state);
  requireNonNegative(laborCostPerUnit, "Labor cost per unit", state);
  requireNonNegative(overheadCostPerUnit, "Overhead cost per unit", state);
  requireNonNegative(lossCostPerUnit, "Loss cost per unit", state);
  requireRange(targetMargin, -1, 1, "Target margin ratio", state, { maxInclusive: false });
  requireInteger(batchQuantity, 1, 1000000000, "Batch quantity", state);
  requireInteger(annualVolume, 1, 1000000000000, "Annual volume", state);
  requireRange(confidence, 0, 1, "Source confidence", state);

  if (state.errors.length > 0) {
    return finalizeResult({ outputs: {}, outputKeys: declaredOutputKeys, state });
  }

  const unitCost =
    materialCostPerUnit + laborCostPerUnit + overheadCostPerUnit + lossCostPerUnit;
  const unitMargin = quotedPricePerUnit - unitCost;
  const marginRatio = divideOrError(unitMargin, quotedPricePerUnit, "Quoted margin ratio", state);
  const targetPrice = divideOrError(unitCost, 1 - targetMargin, "Target-margin price", state);
  const batchMargin = unitMargin * batchQuantity;
  const annualMargin = unitMargin * annualVolume;
  const annualLossExposure = Math.max(0, -annualMargin);
  const uncertainty = Math.abs(annualMargin) * (1 - confidence);

  const drivers = [
    materialCostPerUnit,
    laborCostPerUnit,
    overheadCostPerUnit,
    lossCostPerUnit,
  ];
  const sensitivityDriver = drivers.indexOf(Math.max(...drivers));

  let decision = 0;
  if (unitMargin <= 0) decision = 2;
  else if (marginRatio < targetMargin || confidence < 0.7) decision = 1;

  if (confidence < 0.7) {
    state.warnings.push("Source confidence is below 70%; verify quoted price and unit-cost evidence.");
  }

  const outputs: Record<string, number> = {
    out_evidence_completeness: roundDisplay(confidence, 4),
    out_normalized_demand: roundDisplay(quotedPricePerUnit * batchQuantity, 2),
    out_reference_deviation: roundDisplay(quotedPricePerUnit - targetPrice, 4),
    out_derating_factor: roundDisplay(confidence, 4),
    out_demand_metric: roundDisplay(unitMargin, 4),
    out_capacity_metric: roundDisplay(targetPrice, 4),
    out_utilization_margin: roundDisplay(marginRatio, 6),
    out_expanded_uncertainty: roundDisplay(uncertainty, 2),
    out_threshold_crossing: marginRatio < targetMargin ? 1 : 0,
    out_sensitivity_driver: sensitivityDriver,
    out_fmea_trigger: unitMargin <= 0 ? 1 : 0,
    out_money_at_risk: roundDisplay(annualLossExposure + uncertainty, 2),
    out_scenario_delta: roundDisplay(batchMargin, 2),
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
