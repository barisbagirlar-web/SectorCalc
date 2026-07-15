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

export const toolKey = "machine-hourly-rate-proof-report";
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

  const machineRatePerHour = v.n_machine_rate;
  const cycleTimeSeconds = v.n_cycle_time;
  const setupTimeSeconds = v.n_setup_time;
  const batchQuantity = v.n_batch_quantity;
  const materialCostPerUnit = v.n_material_cost;
  const targetGrossMargin = v.n_target_margin;
  const annualVolume = v.n_annual_volume;
  const laborRatePerHour = v.n_labor_rate;
  const overheadRatePerHour = v.n_overhead_rate;
  const lossCostPerUnit = v.n_defect_or_loss_cost;
  const sourceConfidence = v.n_source_confidence_ratio;
  const uncertaintyMultiplier = v.n_uncertainty_multiplier;

  requireNonNegative(machineRatePerHour, "Machine hourly rate", state);
  requirePositive(cycleTimeSeconds, "Cycle time", state);
  requireNonNegative(setupTimeSeconds, "Batch setup time", state);
  requireInteger(batchQuantity, 1, 1000000000, "Batch quantity", state);
  requireNonNegative(materialCostPerUnit, "Material cost per unit", state);
  requireRange(targetGrossMargin, 0, 1, "Target gross margin", state, {
    minInclusive: true,
    maxInclusive: false,
  });
  requireInteger(annualVolume, 1, 1000000000, "Annual volume", state);
  requireNonNegative(laborRatePerHour, "Labor rate", state);
  requireNonNegative(overheadRatePerHour, "Allocated overhead rate", state);
  requireNonNegative(lossCostPerUnit, "Unit loss cost", state);
  requireRange(sourceConfidence, 0, 1, "Source confidence", state);
  requireRange(uncertaintyMultiplier, 0, 5, "Uncertainty multiplier", state, {
    minInclusive: false,
  });

  if (state.errors.length > 0) {
    return finalizeResult({ outputs: {}, outputKeys: declaredOutputKeys, state });
  }

  // Schema-normalized time values are seconds. Setup is absorbed across the
  // batch; it is not added to every unit.
  const cycleHoursPerUnit = cycleTimeSeconds / 3600;
  const setupHoursPerUnit = setupTimeSeconds / 3600 / batchQuantity;
  const productiveHoursPerUnit = cycleHoursPerUnit + setupHoursPerUnit;
  const annualProductiveHours = productiveHoursPerUnit * annualVolume;

  const machineCostPerUnit = machineRatePerHour * productiveHoursPerUnit;
  const laborCostPerUnit = laborRatePerHour * productiveHoursPerUnit;
  const overheadCostPerUnit = overheadRatePerHour * productiveHoursPerUnit;
  const fullyLoadedCostPerUnit =
    materialCostPerUnit +
    machineCostPerUnit +
    laborCostPerUnit +
    overheadCostPerUnit +
    lossCostPerUnit;

  const quoteFloorPerUnit = divideOrError(
    fullyLoadedCostPerUnit,
    1 - targetGrossMargin,
    "Gross-margin quote floor",
    state,
  );
  const unitGrossProfit = quoteFloorPerUnit - fullyLoadedCostPerUnit;
  const uncertaintyPerUnit =
    fullyLoadedCostPerUnit * (1 - sourceConfidence) * uncertaintyMultiplier;
  const moneyAtRisk = uncertaintyPerUnit * annualVolume;

  const costDrivers = [
    materialCostPerUnit,
    machineCostPerUnit,
    laborCostPerUnit,
    overheadCostPerUnit,
    lossCostPerUnit,
  ];
  const sensitivityDriver = costDrivers.indexOf(Math.max(...costDrivers));

  let decisionState = 0;
  if (sourceConfidence < 0.7 || annualProductiveHours > 8760) {
    decisionState = 1;
  }
  if (annualProductiveHours > 8760) {
    state.warnings.push(
      "Required annual productive hours exceed one machine-year; verify machine count, utilization and capacity allocation.",
    );
  }
  if (sourceConfidence < 0.7) {
    state.warnings.push("Source confidence is below 70%; verify rate and time evidence before quoting.");
  }

  const outputs: Record<string, number> = {
    out_evidence_completeness: roundDisplay(sourceConfidence, 4),
    out_normalized_demand: roundDisplay(annualVolume, 0),
    out_reference_deviation: roundDisplay(
      divideOrError(unitGrossProfit, fullyLoadedCostPerUnit || 1, "Quote markup ratio", state),
      4,
    ),
    out_derating_factor: roundDisplay(sourceConfidence, 4),
    out_demand_metric: roundDisplay(machineCostPerUnit, 4),
    out_capacity_metric: roundDisplay(annualProductiveHours, 2),
    out_utilization_margin: roundDisplay(machineRatePerHour, 4),
    out_expanded_uncertainty: roundDisplay(uncertaintyPerUnit, 4),
    out_threshold_crossing: annualProductiveHours > 8760 ? 1 : 0,
    out_sensitivity_driver: sensitivityDriver,
    out_fmea_trigger: decisionState > 0 ? 1 : 0,
    out_money_at_risk: roundDisplay(moneyAtRisk, 2),
    out_scenario_delta: roundDisplay(unitGrossProfit, 4),
    out_audit_hash_payload: 0,
    out_final_decision_state: decisionState,
  };

  return finalizeResult({
    outputs,
    outputKeys: declaredOutputKeys,
    state,
    status: decisionState === 0 ? "OK" : "REVIEW",
  });
}
