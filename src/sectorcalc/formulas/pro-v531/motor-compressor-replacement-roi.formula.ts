import "server-only";

import {
  MOTOR_REPLACEMENT_ARITHMETIC_MODE,
  MOTOR_REPLACEMENT_FORMULA_VERSION,
  MOTOR_REPLACEMENT_MODEL_ID,
  evaluateMotorReplacement,
} from "./motor-replacement-roi-core";
import { decimalToPresentationNumber, domainErrorMessage, isCanonicalDecimalSource, type Decimal, type DecimalSource } from "./pro-decimal-domain";
import type { ProFormulaResult } from "./pro-formula-contract";
import { PRO_SAMPLE_INPUTS } from "./pro-sample-inputs";

export const toolKey = "motor-compressor-replacement-roi";
export const formulaVersion = MOTOR_REPLACEMENT_FORMULA_VERSION;
export const arithmeticMode = MOTOR_REPLACEMENT_ARITHMETIC_MODE;
export const modelId = MOTOR_REPLACEMENT_MODEL_ID;
export const verificationEvidenceId = "tests/pro-calculation-correctness/motor-replacement-roi.property.test.ts";
export const sampleInputs = PRO_SAMPLE_INPUTS[toolKey];

const REQUIRED = [
  "n_motor_power_kw", "n_annual_operating_hours", "n_current_efficiency_pct",
  "n_new_efficiency_pct", "n_avg_kwh_rate", "n_replacement_cost", "n_installation_cost",
  "n_maintenance_saving_per_year", "n_equipment_life_years", "n_discount_rate",
  "n_source_confidence_ratio",
] as const;

function blocked(warnings: string[]): ProFormulaResult {
  return { status: "BLOCKED", outputs: {}, decimalOutputs: {}, warnings, outputKeys: [], redaction_status: "PUBLIC_SAFE_REDACTED" };
}

export function calculate(inputs: Record<string, DecimalSource>): ProFormulaResult {
  const invalid = REQUIRED.filter((key) => !isCanonicalDecimalSource(inputs[key]));
  if (invalid.length > 0) return blocked([`Missing or non-finite normalized inputs: ${invalid.join(", ")}.`]);
  const evaluated = evaluateMotorReplacement({
    shaftPowerKw: inputs.n_motor_power_kw,
    annualOperatingHours: inputs.n_annual_operating_hours,
    currentEfficiencyRatio: inputs.n_current_efficiency_pct,
    newEfficiencyRatio: inputs.n_new_efficiency_pct,
    energyRatePerKwh: inputs.n_avg_kwh_rate,
    replacementCost: inputs.n_replacement_cost,
    installationCost: inputs.n_installation_cost,
    annualMaintenanceSaving: inputs.n_maintenance_saving_per_year,
    equipmentLifeYears: inputs.n_equipment_life_years,
    discountRateRatio: inputs.n_discount_rate,
    sourceConfidenceRatio: inputs.n_source_confidence_ratio,
  });
  if (!evaluated.ok) return blocked([domainErrorMessage(evaluated.error)]);
  const value = evaluated.value;
  const exact: Array<readonly [string, Decimal]> = [
    ["out_current_energy_kwh_per_year", value.currentEnergyKwh],
    ["out_new_energy_kwh_per_year", value.newEnergyKwh],
    ["out_annual_energy_saving_kwh", value.annualEnergySavingKwh],
    ["out_current_energy_cost_per_year", value.currentEnergyCost],
    ["out_new_energy_cost_per_year", value.newEnergyCost],
    ["out_annual_energy_cost_saving", value.annualEnergyCostSaving],
    ["out_annual_maintenance_saving", value.annualMaintenanceSaving],
    ["out_annual_net_saving", value.annualNetSaving],
    ["out_total_investment", value.totalInvestment],
    ["out_present_value_factor", value.presentValueFactor],
    ["out_discounted_savings", value.discountedSavings],
    ["out_net_present_value", value.netPresentValue],
    ["out_annual_roi_ratio", value.annualRoiRatio],
    ["out_break_even_annual_saving", value.breakEvenAnnualSaving],
    ["out_source_confidence_ratio", value.sourceConfidenceRatio],
    ["out_annual_saving_uncertainty", value.annualSavingUncertainty],
    ["out_npv_uncertainty_amount", value.npvUncertaintyAmount],
    ["out_npv_lower_bound", value.npvLowerBound],
    ["out_npv_upper_bound", value.npvUpperBound],
  ];
  const outputs: Record<string, number> = {};
  const decimalOutputs: Record<string, string> = {};
  for (const [id, exactValue] of exact) {
    const presented = decimalToPresentationNumber(exactValue, id);
    if (!presented.ok) return blocked([domainErrorMessage(presented.error)]);
    outputs[id] = presented.value;
    decimalOutputs[id] = exactValue.toString();
  }
  outputs.out_primary_saving_driver = value.primarySavingDriver;
  outputs.out_decision_state = value.decisionState;
  decimalOutputs.out_primary_saving_driver = String(value.primarySavingDriver);
  decimalOutputs.out_decision_state = String(value.decisionState);
  const warnings = value.decisionState === 2
    ? ["Verified NPV upper bound is negative; hold the replacement business case."]
    : value.decisionState === 1 ? ["Replacement NPV uncertainty bounds cross zero; review source evidence."] : [];
  return { status: warnings.length > 0 ? "REVIEW" : "OK", outputs, decimalOutputs, warnings,
    outputKeys: Object.keys(outputs), redaction_status: "PUBLIC_SAFE_REDACTED" };
}
