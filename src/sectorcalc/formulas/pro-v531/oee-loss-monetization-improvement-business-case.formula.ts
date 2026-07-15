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

export const toolKey = "oee-loss-monetization-improvement-business-case";
export const formulaVersion = "5.3.1-pro-baris.1";

export const requiredInputKeys = [
  "n_planned_production_time",
  "n_operating_time",
  "n_net_operating_time",
  "n_valuable_operating_time",
  "n_ideal_cycle_time",
  "n_total_parts",
  "n_good_parts",
  "n_hourly_contribution",
  "n_improvement_cost",
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

  const plannedSeconds = v.n_planned_production_time;
  const operatingSeconds = v.n_operating_time;
  const netOperatingSeconds = v.n_net_operating_time;
  const valuableSeconds = v.n_valuable_operating_time;
  const idealCycleSeconds = v.n_ideal_cycle_time;
  const totalParts = v.n_total_parts;
  const goodParts = v.n_good_parts;
  const hourlyContribution = v.n_hourly_contribution;
  const improvementCost = v.n_improvement_cost;
  const confidence = v.n_source_confidence_ratio;

  requirePositive(plannedSeconds, "Planned production time", state);
  requireNonNegative(operatingSeconds, "Operating time", state);
  requireNonNegative(netOperatingSeconds, "Net operating time", state);
  requireNonNegative(valuableSeconds, "Valuable operating time", state);
  requirePositive(idealCycleSeconds, "Ideal cycle time", state);
  requireInteger(totalParts, 1, 1000000000000, "Total parts", state);
  requireInteger(goodParts, 0, totalParts, "Good parts", state);
  requireNonNegative(hourlyContribution, "Hourly contribution", state);
  requireNonNegative(improvementCost, "Improvement cost", state);
  requireRange(confidence, 0, 1, "Source confidence", state);

  if (operatingSeconds > plannedSeconds) {
    state.errors.push("Operating time must not exceed planned production time.");
  }
  if (netOperatingSeconds > operatingSeconds) {
    state.errors.push("Net operating time must not exceed operating time.");
  }
  if (valuableSeconds > netOperatingSeconds) {
    state.errors.push("Valuable operating time must not exceed net operating time.");
  }

  if (state.errors.length > 0) {
    return finalizeResult({ outputs: {}, outputKeys: declaredOutputKeys, state });
  }

  const availability = divideOrError(
    operatingSeconds,
    plannedSeconds,
    "OEE availability",
    state,
  );
  const performance = divideOrError(
    netOperatingSeconds,
    operatingSeconds,
    "OEE performance",
    state,
  );
  const quality = divideOrError(
    valuableSeconds,
    netOperatingSeconds,
    "OEE quality",
    state,
  );
  const oee = availability * performance * quality;

  // Independent conservation identities from part counts. They are used as a
  // cross-check, not as a second competing OEE definition.
  const expectedNetSeconds = idealCycleSeconds * totalParts;
  const expectedValuableSeconds = idealCycleSeconds * goodParts;
  const netIdentityDeviation = divideOrError(
    Math.abs(netOperatingSeconds - expectedNetSeconds),
    Math.max(netOperatingSeconds, expectedNetSeconds, 1),
    "Net operating time identity deviation",
    state,
  );
  const valuableIdentityDeviation = divideOrError(
    Math.abs(valuableSeconds - expectedValuableSeconds),
    Math.max(valuableSeconds, expectedValuableSeconds, 1),
    "Valuable operating time identity deviation",
    state,
  );
  const identityDeviation = Math.max(netIdentityDeviation, valuableIdentityDeviation);

  if (identityDeviation > 0.25) {
    state.errors.push(
      `Time and part-count identities differ by ${roundDisplay(identityDeviation * 100, 2)}%; verify units and source records.`,
    );
  } else if (identityDeviation > 0.05) {
    state.warnings.push(
      `Time and part-count identities differ by ${roundDisplay(identityDeviation * 100, 2)}%; review the time basis.`,
    );
  }

  if (state.errors.length > 0) {
    return finalizeResult({ outputs: {}, outputKeys: declaredOutputKeys, state });
  }

  const availabilityLoss = ((plannedSeconds - operatingSeconds) / 3600) * hourlyContribution;
  const performanceLoss = ((operatingSeconds - netOperatingSeconds) / 3600) * hourlyContribution;
  const qualityLoss = ((netOperatingSeconds - valuableSeconds) / 3600) * hourlyContribution;
  const totalOeeLoss = availabilityLoss + performanceLoss + qualityLoss;
  const dominantLosses = [availabilityLoss, performanceLoss, qualityLoss];
  const dominantDriver = dominantLosses.indexOf(Math.max(...dominantLosses));

  // The schema has no recovery percentage or analysis horizon. Therefore the
  // engine reports the measured-period loss and cost gap, but does not fabricate
  // an annualized ROI or payback conclusion.
  const businessCaseGap = totalOeeLoss - improvementCost;
  state.warnings.push(
    "Measured-period OEE loss is calculated; ROI requires an explicit recovery percentage and analysis horizon.",
  );
  if (confidence < 0.7) {
    state.warnings.push("Source confidence is below 70%; verify production records before commitment.");
  }

  const outputs: Record<string, number> = {
    out_evidence_completeness: roundDisplay(confidence, 4),
    out_normalized_demand: roundDisplay(totalOeeLoss, 2),
    out_reference_deviation: roundDisplay(oee, 4),
    out_derating_factor: roundDisplay(availability, 4),
    out_demand_metric: roundDisplay(availabilityLoss, 2),
    out_capacity_metric: roundDisplay(performanceLoss, 2),
    out_utilization_margin: roundDisplay(performance, 4),
    out_expanded_uncertainty: roundDisplay(qualityLoss, 2),
    out_threshold_crossing: oee < 0.85 ? 1 : 0,
    out_sensitivity_driver: dominantDriver,
    out_fmea_trigger: oee < 0.85 || identityDeviation > 0.05 ? 1 : 0,
    out_money_at_risk: roundDisplay(totalOeeLoss, 2),
    out_scenario_delta: roundDisplay(businessCaseGap, 2),
    out_audit_hash_payload: 0,
    out_final_decision_state: 1,
  };

  return finalizeResult({
    outputs,
    outputKeys: declaredOutputKeys,
    state,
    status: "REVIEW",
  });
}
