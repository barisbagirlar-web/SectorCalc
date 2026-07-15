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

export const toolKey = "downtime-scrap-loss-statement";
export const formulaVersion = "5.3.1-pro-baris.1";

export const requiredInputKeys = [
  "n_productive_hours",
  "n_actual_hours",
  "n_hourly_rate",
  "n_scrap_quantity",
  "n_unit_cost",
  "n_rework_hours",
  "n_rework_rate",
  "n_material_cost",
  "n_defect_rate_pct",
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

  const plannedSeconds = v.n_productive_hours;
  const actualSeconds = v.n_actual_hours;
  const hourlyRate = v.n_hourly_rate;
  const scrapQuantity = v.n_scrap_quantity;
  const scrapUnitCost = v.n_unit_cost;
  const reworkSeconds = v.n_rework_hours;
  const reworkRate = v.n_rework_rate;
  const materialCostBasis = v.n_material_cost;
  const defectRatePct = v.n_defect_rate_pct;
  const confidence = v.n_source_confidence_ratio;

  requirePositive(plannedSeconds, "Planned productive time", state);
  requireNonNegative(actualSeconds, "Actual productive time", state);
  requireNonNegative(hourlyRate, "Hourly contribution/cost rate", state);
  requireInteger(scrapQuantity, 0, 1000000000000, "Scrap quantity", state);
  requireNonNegative(scrapUnitCost, "Scrap unit cost", state);
  requireNonNegative(reworkSeconds, "Rework time", state);
  requireNonNegative(reworkRate, "Rework hourly rate", state);
  requireNonNegative(materialCostBasis, "Material cost basis", state);
  requireRange(defectRatePct, 0, 100, "Defect rate (%)", state);
  requireRange(confidence, 0, 1, "Source confidence", state);

  if (actualSeconds > plannedSeconds) {
    state.errors.push("Actual productive time must not exceed planned productive time.");
  }

  if (state.errors.length > 0) {
    return finalizeResult({ outputs: {}, outputKeys: declaredOutputKeys, state });
  }

  const downtimeSeconds = plannedSeconds - actualSeconds;
  const downtimeCost = (downtimeSeconds / 3600) * hourlyRate;
  const scrapLoss = scrapQuantity * scrapUnitCost;
  const reworkLoss = (reworkSeconds / 3600) * reworkRate;
  const totalLoss = downtimeCost + scrapLoss + reworkLoss;
  const uptimeRatio = divideOrError(actualSeconds, plannedSeconds, "Uptime ratio", state);
  const uncertainty = totalLoss * (1 - confidence);

  const components = [downtimeCost, scrapLoss, reworkLoss];
  const dominantDriver = components.indexOf(Math.max(...components));
  const largestMinusSmallest = Math.max(...components) - Math.min(...components);

  let decision = 0;
  if (materialCostBasis > 0) {
    const exposureRatio = totalLoss / materialCostBasis;
    if (exposureRatio >= 0.15) decision = 2;
    else if (exposureRatio >= 0.05) decision = 1;
  } else if (totalLoss > 0) {
    decision = 1;
    state.warnings.push("Material cost basis is zero; loss-severity classification requires review.");
  }
  if (confidence < 0.7) decision = Math.max(decision, 1);

  if (confidence < 0.7) {
    state.warnings.push("Source confidence is below 70%; verify downtime and quality records.");
  }

  const outputs: Record<string, number> = {
    out_evidence_completeness: roundDisplay(confidence, 4),
    out_normalized_demand: roundDisplay(plannedSeconds / 3600, 2),
    out_reference_deviation: roundDisplay(defectRatePct / 100, 4),
    out_derating_factor: roundDisplay(1 - uptimeRatio, 4),
    out_demand_metric: roundDisplay(downtimeCost, 2),
    out_capacity_metric: roundDisplay(totalLoss, 2),
    out_utilization_margin: roundDisplay(uptimeRatio, 4),
    out_expanded_uncertainty: roundDisplay(uncertainty, 2),
    out_threshold_crossing: decision > 0 ? 1 : 0,
    out_sensitivity_driver: dominantDriver,
    out_fmea_trigger: decision > 0 ? 1 : 0,
    out_money_at_risk: roundDisplay(totalLoss, 2),
    out_scenario_delta: roundDisplay(largestMinusSmallest, 2),
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
