import "server-only";

import {
  SMED_ROI_ARITHMETIC_MODE,
  SMED_ROI_FORMULA_VERSION,
  SMED_ROI_MODEL_ID,
  evaluateSmedRoi,
} from "./smed-roi-core";
import { decimalToPresentationNumber, domainErrorMessage, isCanonicalDecimalSource, type Decimal, type DecimalSource } from "./pro-decimal-domain";
import type { ProFormulaResult } from "./pro-formula-contract";
import { PRO_SAMPLE_INPUTS } from "./pro-sample-inputs";

export const toolKey = "setup-time-reduction-roi-smed";
export const formulaVersion = SMED_ROI_FORMULA_VERSION;
export const arithmeticMode = SMED_ROI_ARITHMETIC_MODE;
export const modelId = SMED_ROI_MODEL_ID;
export const verificationEvidenceId = "tests/pro-calculation-correctness/smed-roi.property.test.ts";
export const sampleInputs = PRO_SAMPLE_INPUTS[toolKey];

const REQUIRED = [
  "n_machine_rate", "n_cycle_time", "n_setup_time", "n_batch_quantity",
  "n_material_cost", "n_annual_volume", "n_labor_rate", "n_overhead_rate",
  "n_uncertainty_multiplier", "n_source_confidence_ratio",
] as const;

function blocked(warnings: string[]): ProFormulaResult {
  return { status: "BLOCKED", outputs: {}, decimalOutputs: {}, warnings, outputKeys: [], redaction_status: "PUBLIC_SAFE_REDACTED" };
}

export function calculate(inputs: Record<string, DecimalSource>): ProFormulaResult {
  const invalid = REQUIRED.filter((key) => !isCanonicalDecimalSource(inputs[key]));
  if (invalid.length > 0) return blocked([`Missing or non-finite normalized inputs: ${invalid.join(", ")}.`]);
  const evaluated = evaluateSmedRoi({
    machineRatePerHour: inputs.n_machine_rate,
    cycleSecondsPerUnit: inputs.n_cycle_time,
    currentSetupSeconds: inputs.n_setup_time,
    batchQuantity: inputs.n_batch_quantity,
    implementationCost: inputs.n_material_cost,
    annualVolume: inputs.n_annual_volume,
    laborRatePerHour: inputs.n_labor_rate,
    avoidableOverheadRatePerHour: inputs.n_overhead_rate,
    setupReductionRatio: inputs.n_uncertainty_multiplier,
    sourceConfidenceRatio: inputs.n_source_confidence_ratio,
  });
  if (!evaluated.ok) return blocked([domainErrorMessage(evaluated.error)]);
  const value = evaluated.value;
  const exact: Array<readonly [string, Decimal]> = [
    ["out_annual_changeover_equivalents", value.annualChangeoverEquivalents],
    ["out_current_setup_seconds", value.currentSetupSeconds],
    ["out_target_setup_seconds", value.targetSetupSeconds],
    ["out_saved_seconds_per_changeover", value.savedSecondsPerChangeover],
    ["out_annual_saved_hours", value.annualSavedHours],
    ["out_additional_capacity_units", value.additionalCapacityUnits],
    ["out_avoidable_hourly_rate", value.avoidableHourlyRate],
    ["out_annual_gross_saving", value.annualGrossSaving],
    ["out_implementation_cost", value.implementationCost],
    ["out_first_year_net_benefit", value.firstYearNetBenefit],
    ["out_simple_payback_years", value.simplePaybackYears],
    ["out_annual_roi_ratio", value.annualRoiRatio],
    ["out_source_confidence_ratio", value.sourceConfidenceRatio],
    ["out_annual_saving_uncertainty", value.annualSavingUncertainty],
    ["out_saving_lower_bound", value.savingLowerBound],
    ["out_saving_upper_bound", value.savingUpperBound],
  ];
  const outputs: Record<string, number> = {};
  const decimalOutputs: Record<string, string> = {};
  for (const [id, exactValue] of exact) {
    const presented = decimalToPresentationNumber(exactValue, id);
    if (!presented.ok) return blocked([domainErrorMessage(presented.error)]);
    outputs[id] = presented.value;
    decimalOutputs[id] = exactValue.toString();
  }
  outputs.out_primary_saving_rate_driver = value.primarySavingRateDriver;
  outputs.out_decision_state = value.decisionState;
  decimalOutputs.out_primary_saving_rate_driver = String(value.primarySavingRateDriver);
  decimalOutputs.out_decision_state = String(value.decisionState);
  const warnings = value.decisionState === 2
    ? ["Verified annual-saving upper bound does not recover implementation cost within one year."]
    : value.decisionState === 1 ? ["The one-year SMED payback decision crosses the saving uncertainty bounds."] : [];
  return { status: warnings.length > 0 ? "REVIEW" : "OK", outputs, decimalOutputs, warnings,
    outputKeys: Object.keys(outputs), redaction_status: "PUBLIC_SAFE_REDACTED" };
}
