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

export const toolKey = "setup-time-reduction-roi-smed";
export const formulaVersion = "5.3.1-pro-baris.1";

export const requiredInputKeys = [
  "n_machine_rate",
  "n_setup_time",
  "n_batch_quantity",
  "n_annual_volume",
  "n_labor_rate",
  "n_overhead_rate",
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

  const downtimeRate = v.n_machine_rate;
  const currentSetupSeconds = v.n_setup_time;
  const targetSetupSeconds = v.n_batch_quantity;
  const annualChangeovers = v.n_annual_volume;
  const laborRate = v.n_labor_rate;
  const implementationCost = v.n_overhead_rate;
  const confidence = v.n_source_confidence_ratio;

  requireNonNegative(downtimeRate, "Downtime cost rate", state);
  requirePositive(currentSetupSeconds, "Current setup time", state);
  requireNonNegative(targetSetupSeconds, "Target setup time", state);
  requireInteger(annualChangeovers, 1, 1000000000, "Annual changeovers", state);
  requireNonNegative(laborRate, "Labor rate", state);
  requireNonNegative(implementationCost, "SMED implementation cost", state);
  requireRange(confidence, 0, 1, "Source confidence", state);

  if (targetSetupSeconds >= currentSetupSeconds) {
    state.errors.push("Target setup time must be lower than current setup time.");
  }

  if (state.errors.length > 0) {
    return finalizeResult({ outputs: {}, outputKeys: declaredOutputKeys, state });
  }

  const savedSecondsPerChangeover = currentSetupSeconds - targetSetupSeconds;
  const annualRecoveredHours = savedSecondsPerChangeover * annualChangeovers / 3600;
  const recoverableCostRate = downtimeRate + laborRate;
  const annualRecoverableValue = annualRecoveredHours * recoverableCostRate;
  const paybackMonths = annualRecoverableValue > 0
    ? divideOrError(implementationCost, annualRecoverableValue, "SMED payback", state) * 12
    : Number.POSITIVE_INFINITY;
  const annualRoiRatio = implementationCost > 0
    ? divideOrError(annualRecoverableValue, implementationCost, "Annual SMED ROI", state)
    : annualRecoverableValue > 0 ? 1 : 0;
  const reductionRatio = savedSecondsPerChangeover / currentSetupSeconds;
  const uncertainty = annualRecoverableValue * (1 - confidence);

  let decision = 0;
  if (annualRecoverableValue <= 0 || !Number.isFinite(paybackMonths)) decision = 2;
  else if (paybackMonths > 24 || confidence < 0.7) decision = 2;
  else if (paybackMonths > 12) decision = 1;

  if (confidence < 0.7) {
    state.warnings.push("Source confidence is below 70%; verify setup studies and changeover frequency.");
  }

  const outputs: Record<string, number> = {
    out_evidence_completeness: roundDisplay(confidence, 4),
    out_normalized_demand: roundDisplay(annualRecoveredHours, 2),
    out_reference_deviation: roundDisplay(reductionRatio, 6),
    out_derating_factor: roundDisplay(confidence, 4),
    out_demand_metric: roundDisplay(annualRecoverableValue, 2),
    out_capacity_metric: roundDisplay(annualRecoveredHours, 2),
    out_utilization_margin: roundDisplay(annualRoiRatio, 6),
    out_expanded_uncertainty: roundDisplay(uncertainty, 2),
    out_threshold_crossing: Number.isFinite(paybackMonths) && paybackMonths <= 24 ? 1 : 0,
    out_sensitivity_driver: downtimeRate >= laborRate ? 0 : 1,
    out_fmea_trigger: decision === 2 ? 1 : 0,
    out_money_at_risk: roundDisplay(implementationCost, 2),
    out_scenario_delta: Number.isFinite(paybackMonths) ? roundDisplay(paybackMonths, 2) : 999,
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
