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

export const toolKey = "scrap-rework-cost-tracker";
export const formulaVersion = "5.3.1-pro-baris.1";

export const requiredInputKeys = [
  "n_total_produced",
  "n_scrap_quantity",
  "n_rework_quantity",
  "n_unit_material_cost",
  "n_unit_labor_cost",
  "n_rework_labor_rate",
  "n_rework_time_per_unit",
  "n_defect_rate_target_pct",
  "n_monthly_volume",
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

  const totalProduced = v.n_total_produced;
  const scrapQuantity = v.n_scrap_quantity;
  const reworkQuantity = v.n_rework_quantity;
  const unitMaterialCost = v.n_unit_material_cost;
  const unitLaborCost = v.n_unit_labor_cost;
  const reworkLaborRate = v.n_rework_labor_rate;
  const reworkSecondsPerUnit = v.n_rework_time_per_unit;
  const defectTargetPct = v.n_defect_rate_target_pct;
  const monthlyVolume = v.n_monthly_volume;
  const confidence = v.n_source_confidence_ratio;

  requireInteger(totalProduced, 1, 1000000000000, "Total produced", state);
  requireInteger(scrapQuantity, 0, totalProduced, "Scrap quantity", state);
  requireInteger(reworkQuantity, 0, totalProduced, "Rework quantity", state);
  requireNonNegative(unitMaterialCost, "Unit material cost", state);
  requireNonNegative(unitLaborCost, "Unit labor cost", state);
  requireNonNegative(reworkLaborRate, "Rework labor rate", state);
  requireNonNegative(reworkSecondsPerUnit, "Rework time per unit", state);
  requireRange(defectTargetPct, 0, 100, "Defect-rate target (%)", state);
  requirePositive(monthlyVolume, "Monthly volume", state);
  requireRange(confidence, 0, 1, "Source confidence", state);

  if (scrapQuantity + reworkQuantity > totalProduced) {
    state.errors.push("Scrap plus rework quantity must not exceed total produced quantity.");
  }

  if (state.errors.length > 0) {
    return finalizeResult({ outputs: {}, outputKeys: declaredOutputKeys, state });
  }

  const scrapCost = scrapQuantity * (unitMaterialCost + unitLaborCost);
  const reworkCost =
    reworkQuantity * (reworkSecondsPerUnit / 3600) * reworkLaborRate;
  const observedDefectUnits = scrapQuantity + reworkQuantity;
  const observedDefectRate = divideOrError(
    observedDefectUnits,
    totalProduced,
    "Observed defect rate",
    state,
  );
  const targetDefectRate = defectTargetPct / 100;
  const recordedPeriodLoss = scrapCost + reworkCost;
  const projectedMonthlyLoss = recordedPeriodLoss * divideOrError(
    monthlyVolume,
    totalProduced,
    "Monthly volume scaling",
    state,
  );
  const defectCostPerAffectedUnit = observedDefectUnits > 0
    ? recordedPeriodLoss / observedDefectUnits
    : 0;
  const uncertainty = projectedMonthlyLoss * (1 - confidence);
  const dominantDriver = scrapCost >= reworkCost ? 0 : 1;

  let decision = 0;
  if (observedDefectRate > targetDefectRate) decision = 1;
  if (
    observedDefectRate > targetDefectRate &&
    defectCostPerAffectedUnit > (unitMaterialCost + unitLaborCost) * 0.5
  ) {
    decision = 2;
  }
  if (confidence < 0.7) decision = Math.max(decision, 1);

  if (confidence < 0.7) {
    state.warnings.push("Source confidence is below 70%; verify production and NCR records.");
  }

  const outputs: Record<string, number> = {
    out_evidence_completeness: roundDisplay(confidence, 4),
    out_normalized_demand: roundDisplay(observedDefectUnits, 0),
    out_reference_deviation: roundDisplay(observedDefectRate, 6),
    out_derating_factor: roundDisplay(targetDefectRate, 6),
    out_demand_metric: roundDisplay(scrapCost, 2),
    out_capacity_metric: roundDisplay(reworkCost, 2),
    out_utilization_margin: roundDisplay(defectCostPerAffectedUnit, 4),
    out_expanded_uncertainty: roundDisplay(uncertainty, 2),
    out_threshold_crossing: observedDefectRate > targetDefectRate ? 1 : 0,
    out_sensitivity_driver: dominantDriver,
    out_fmea_trigger: decision > 0 ? 1 : 0,
    out_money_at_risk: roundDisplay(recordedPeriodLoss, 2),
    out_scenario_delta: roundDisplay(scrapCost - reworkCost, 2),
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
