import "server-only";

import { PRO_SAMPLE_INPUTS } from "./pro-sample-inputs";
import type { ProFormulaResult } from "./pro-formula-contract";
import {
  createValidationState,
  divideOrError,
  finalizeResult,
  requireFiniteInputs,
  requireNonNegative,
  requirePositive,
  requireRange,
  roundDisplay,
} from "./pro-formula-safety";

export const toolKey = "plant-wide-shop-rate-cost-structure-audit";
export const formulaVersion = "5.3.1-pro-baris.1";

export const requiredInputKeys = [
  "n_total_annual_cost",
  "n_total_productive_hours",
  "n_machine_group_cost",
  "n_machine_group_hours",
  "n_overhead_pool",
  "n_overhead_allocation_base",
  "n_current_shop_rate",
  "n_target_margin_pct",
  "n_utilization_pct",
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

  const annualCost = v.n_total_annual_cost;
  const practicalCapacityHours = v.n_total_productive_hours;
  const machineGroupCost = v.n_machine_group_cost;
  const machineGroupHours = v.n_machine_group_hours;
  const overheadPool = v.n_overhead_pool;
  const overheadAllocationBase = v.n_overhead_allocation_base;
  const currentShopRate = v.n_current_shop_rate;
  const targetMarginPct = v.n_target_margin_pct;
  const utilizationPct = v.n_utilization_pct;
  const confidence = v.n_source_confidence_ratio;

  requireNonNegative(annualCost, "Total annual cost", state);
  requirePositive(practicalCapacityHours, "Practical capacity hours", state);
  requireNonNegative(machineGroupCost, "Machine-group cost", state);
  requirePositive(machineGroupHours, "Machine-group hours", state);
  requireNonNegative(overheadPool, "Overhead pool", state);
  requirePositive(overheadAllocationBase, "Overhead allocation base", state);
  requireNonNegative(currentShopRate, "Current shop rate", state);
  requireRange(targetMarginPct, 0, 100, "Target gross margin (%)", state, {
    maxInclusive: false,
  });
  requireRange(utilizationPct, 0, 100, "Utilization (%)", state, {
    minInclusive: false,
  });
  requireRange(confidence, 0, 1, "Source confidence", state);

  if (state.errors.length > 0) {
    return finalizeResult({ outputs: {}, outputKeys: declaredOutputKeys, state });
  }

  const utilization = utilizationPct / 100;
  const targetMargin = targetMarginPct / 100;
  const realizedHours = practicalCapacityHours * utilization;
  const plantCostRate = divideOrError(annualCost, realizedHours, "Plant-wide cost rate", state);
  const machineGroupRate = divideOrError(
    machineGroupCost,
    machineGroupHours,
    "Machine-group cost rate",
    state,
  );
  const overheadAbsorptionRate = divideOrError(
    overheadPool,
    overheadAllocationBase,
    "Overhead absorption rate",
    state,
  );
  const governingCostRate = Math.max(plantCostRate, machineGroupRate + overheadAbsorptionRate);
  const pricingFloor = divideOrError(
    governingCostRate,
    1 - targetMargin,
    "Gross-margin shop-rate floor",
    state,
  );
  const rateGap = pricingFloor - currentShopRate;
  const underRecovery = Math.max(0, rateGap) * realizedHours;
  const uncertainty = annualCost * (1 - confidence);

  let decision = 0;
  if (rateGap > 0 || confidence < 0.7) decision = 1;
  if (currentShopRate <= 0) decision = 2;

  if (confidence < 0.7) {
    state.warnings.push("Source confidence is below 70%; reconcile ledger pools and productive-hour evidence.");
  }

  const drivers = [plantCostRate, machineGroupRate, overheadAbsorptionRate];
  const sensitivityDriver = drivers.indexOf(Math.max(...drivers));

  const outputs: Record<string, number> = {
    out_evidence_completeness: roundDisplay(confidence, 4),
    out_normalized_demand: roundDisplay(realizedHours, 2),
    out_reference_deviation: roundDisplay(rateGap, 4),
    out_derating_factor: roundDisplay(utilization, 4),
    out_demand_metric: roundDisplay(plantCostRate, 4),
    out_capacity_metric: roundDisplay(machineGroupRate, 4),
    out_utilization_margin: roundDisplay(utilization, 4),
    out_expanded_uncertainty: roundDisplay(uncertainty, 2),
    out_threshold_crossing: rateGap > 0 ? 1 : 0,
    out_sensitivity_driver: sensitivityDriver,
    out_fmea_trigger: decision > 0 ? 1 : 0,
    out_money_at_risk: roundDisplay(underRecovery, 2),
    out_scenario_delta: roundDisplay(rateGap, 4),
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
