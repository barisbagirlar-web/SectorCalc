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

export const toolKey = "job-quote-builder-pro-pack";
export const formulaVersion = "5.3.1-pro-baris.1";

export const requiredInputKeys = [
  "n_machine_rate",
  "n_cycle_time",
  "n_setup_time",
  "n_batch_quantity",
  "n_material_cost",
  "n_target_margin",
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

export function calculate(inputs: Record<string, number>): ProFormulaResult {
  const state = createValidationState();
  const v = requireFiniteInputs(inputs, requiredInputKeys, state);
  if (state.errors.length > 0) {
    return finalizeResult({ outputs: {}, outputKeys: declaredOutputKeys, state });
  }

  const machineRate = v.n_machine_rate;
  const cycleSeconds = v.n_cycle_time;
  const setupSeconds = v.n_setup_time;
  const batchQuantity = v.n_batch_quantity;
  const materialCostPerUnit = v.n_material_cost;
  const targetMargin = v.n_target_margin;
  const annualVolume = v.n_annual_volume;
  const laborRate = v.n_labor_rate;
  const overheadRate = v.n_overhead_rate;
  const lossAllowancePerUnit = v.n_defect_or_loss_cost;
  const confidence = v.n_source_confidence_ratio;
  const uncertaintyMultiplier = v.n_uncertainty_multiplier;

  requireNonNegative(machineRate, "Machine rate", state);
  requirePositive(cycleSeconds, "Cycle time", state);
  requireNonNegative(setupSeconds, "Setup time", state);
  requireInteger(batchQuantity, 1, 1000000000, "Batch quantity", state);
  requireNonNegative(materialCostPerUnit, "Material cost per unit", state);
  requireRange(targetMargin, 0, 1, "Target gross margin", state, { maxInclusive: false });
  requireInteger(annualVolume, 1, 1000000000, "Annual volume", state);
  requireNonNegative(laborRate, "Labor rate", state);
  requireNonNegative(overheadRate, "Overhead rate", state);
  requireNonNegative(lossAllowancePerUnit, "Loss allowance per unit", state);
  requireRange(confidence, 0, 1, "Source confidence", state);
  requireRange(uncertaintyMultiplier, 0, 5, "Uncertainty multiplier", state, {
    minInclusive: false,
  });

  if (state.errors.length > 0) {
    return finalizeResult({ outputs: {}, outputKeys: declaredOutputKeys, state });
  }

  const cycleHoursPerUnit = cycleSeconds / 3600;
  const setupHoursPerUnit = setupSeconds / 3600 / batchQuantity;
  const processHoursPerUnit = cycleHoursPerUnit + setupHoursPerUnit;
  const machineCostPerUnit = machineRate * processHoursPerUnit;
  const laborCostPerUnit = laborRate * processHoursPerUnit;
  const overheadCostPerUnit = overheadRate * processHoursPerUnit;
  const costPerUnit =
    materialCostPerUnit +
    machineCostPerUnit +
    laborCostPerUnit +
    overheadCostPerUnit +
    lossAllowancePerUnit;
  const totalBatchCost = costPerUnit * batchQuantity;
  const quotePerUnit = divideOrError(costPerUnit, 1 - targetMargin, "Gross-margin quote", state);
  const totalQuote = quotePerUnit * batchQuantity;
  const grossProfit = totalQuote - totalBatchCost;
  const achievedMargin = divideOrError(grossProfit, totalQuote, "Achieved gross margin", state);
  const uncertaintyAmount = totalBatchCost * (1 - confidence) * uncertaintyMultiplier;
  const minimumRiskAdjustedQuote = totalQuote + uncertaintyAmount;

  const costDrivers = [
    materialCostPerUnit,
    machineCostPerUnit,
    laborCostPerUnit,
    overheadCostPerUnit,
    lossAllowancePerUnit,
  ];
  const sensitivityDriver = costDrivers.indexOf(Math.max(...costDrivers));

  const annualRequiredHours = processHoursPerUnit * annualVolume;
  let decision = 0;
  if (confidence < 0.7 || annualRequiredHours > 8760) decision = 1;
  if (annualRequiredHours > 8760) {
    state.warnings.push("Annual required hours exceed one machine-year; verify capacity or machine count.");
  }
  if (confidence < 0.7) {
    state.warnings.push("Source confidence is below 70%; verify cost and time evidence before issuing the quote.");
  }

  const outputs: Record<string, number> = {
    out_evidence_completeness: roundDisplay(confidence, 4),
    out_normalized_demand: roundDisplay(totalBatchCost, 2),
    out_reference_deviation: roundDisplay(achievedMargin - targetMargin, 6),
    out_derating_factor: roundDisplay(confidence, 4),
    out_demand_metric: roundDisplay(totalBatchCost, 2),
    out_capacity_metric: roundDisplay(minimumRiskAdjustedQuote, 2),
    out_utilization_margin: roundDisplay(achievedMargin, 6),
    out_expanded_uncertainty: roundDisplay(uncertaintyAmount, 2),
    out_threshold_crossing: achievedMargin + 1e-9 >= targetMargin ? 0 : 1,
    out_sensitivity_driver: sensitivityDriver,
    out_fmea_trigger: decision > 0 ? 1 : 0,
    out_money_at_risk: roundDisplay(uncertaintyAmount, 2),
    out_scenario_delta: roundDisplay(grossProfit, 2),
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
