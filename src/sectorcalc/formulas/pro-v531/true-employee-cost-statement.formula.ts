import "server-only";

import {
  EMPLOYEE_COST_ARITHMETIC_MODE,
  EMPLOYEE_COST_FORMULA_VERSION,
  EMPLOYEE_COST_MODEL_ID,
  evaluateEmployeeCost,
} from "./employee-cost-core";
import { decimalToPresentationNumber, domainErrorMessage, isCanonicalDecimalSource, type Decimal, type DecimalSource } from "./pro-decimal-domain";
import type { ProFormulaResult } from "./pro-formula-contract";
import { PRO_SAMPLE_INPUTS } from "./pro-sample-inputs";

export const toolKey = "true-employee-cost-statement";
export const formulaVersion = EMPLOYEE_COST_FORMULA_VERSION;
export const arithmeticMode = EMPLOYEE_COST_ARITHMETIC_MODE;
export const modelId = EMPLOYEE_COST_MODEL_ID;
export const verificationEvidenceId = "tests/pro-calculation-correctness/employee-cost.property.test.ts";
export const sampleInputs = PRO_SAMPLE_INPUTS[toolKey];

const REQUIRED = [
  "n_labor_rate", "n_annual_volume", "n_target_margin", "n_uncertainty_multiplier",
  "n_material_cost", "n_defect_or_loss_cost", "n_machine_rate", "n_overhead_rate",
  "n_source_confidence_ratio",
] as const;

function blocked(warnings: string[]): ProFormulaResult {
  return { status: "BLOCKED", outputs: {}, decimalOutputs: {}, warnings, outputKeys: [], redaction_status: "PUBLIC_SAFE_REDACTED" };
}

export function calculate(inputs: Record<string, DecimalSource>): ProFormulaResult {
  const invalid = REQUIRED.filter((key) => !isCanonicalDecimalSource(inputs[key]));
  if (invalid.length > 0) return blocked([`Missing or non-finite normalized inputs: ${invalid.join(", ")}.`]);
  const evaluated = evaluateEmployeeCost({
    baseHourlyWage: inputs.n_labor_rate,
    annualPaidHours: inputs.n_annual_volume,
    productiveTimeRatio: inputs.n_target_margin,
    employerPayrollTaxRatio: inputs.n_uncertainty_multiplier,
    annualBenefitsCost: inputs.n_material_cost,
    annualTrainingCost: inputs.n_defect_or_loss_cost,
    annualEquipmentItCost: inputs.n_machine_rate,
    annualWorkspaceFacilityCost: inputs.n_overhead_rate,
    sourceConfidenceRatio: inputs.n_source_confidence_ratio,
  });
  if (!evaluated.ok) return blocked([domainErrorMessage(evaluated.error)]);
  const value = evaluated.value;
  const exact: Array<readonly [string, Decimal]> = [
    ["out_base_annual_compensation", value.baseAnnualCompensation],
    ["out_employer_payroll_taxes", value.employerPayrollTaxes],
    ["out_annual_benefits_cost", value.annualBenefitsCost],
    ["out_paid_non_productive_hours", value.paidNonProductiveHours],
    ["out_paid_non_productive_cost", value.paidNonProductiveCost],
    ["out_annual_training_cost", value.annualTrainingCost],
    ["out_annual_equipment_it_cost", value.annualEquipmentItCost],
    ["out_annual_workspace_facility_cost", value.annualWorkspaceFacilityCost],
    ["out_fully_loaded_annual_cost", value.fullyLoadedAnnualCost],
    ["out_monthly_employer_cost", value.monthlyEmployerCost],
    ["out_productive_hours_annual", value.productiveHoursAnnual],
    ["out_productive_hourly_cost", value.productiveHourlyCost],
    ["out_base_to_loaded_multiplier", value.baseToLoadedMultiplier],
    ["out_source_confidence_ratio", value.sourceConfidenceRatio],
    ["out_annual_cost_uncertainty", value.annualCostUncertainty],
    ["out_annual_cost_lower_bound", value.annualCostLowerBound],
    ["out_annual_cost_upper_bound", value.annualCostUpperBound],
  ];
  const outputs: Record<string, number> = {};
  const decimalOutputs: Record<string, string> = {};
  for (const [id, exactValue] of exact) {
    const presented = decimalToPresentationNumber(exactValue, id);
    if (!presented.ok) return blocked([domainErrorMessage(presented.error)]);
    outputs[id] = presented.value;
    decimalOutputs[id] = exactValue.toString();
  }
  outputs.out_primary_additive_cost_driver = value.primaryAdditiveCostDriver;
  outputs.out_decision_state = value.decisionState;
  decimalOutputs.out_primary_additive_cost_driver = String(value.primaryAdditiveCostDriver);
  decimalOutputs.out_decision_state = String(value.decisionState);
  const warnings = value.decisionState === 2
    ? ["Source confidence is below 75%; hold employee-cost approval until payroll evidence is strengthened."]
    : value.decisionState === 1 ? ["Source confidence is below 90%; review payroll and burden evidence."] : [];
  return { status: warnings.length > 0 ? "REVIEW" : "OK", outputs, decimalOutputs, warnings,
    outputKeys: Object.keys(outputs), redaction_status: "PUBLIC_SAFE_REDACTED" };
}
