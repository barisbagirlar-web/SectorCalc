import "server-only";

import {
  MAKE_BUY_ARITHMETIC_MODE,
  MAKE_BUY_FORMULA_VERSION,
  MAKE_BUY_MODEL_ID,
  evaluateMakeBuy,
} from "./make-buy-core";
import { decimalToPresentationNumber, domainErrorMessage, isCanonicalDecimalSource, type Decimal, type DecimalSource } from "./pro-decimal-domain";
import type { ProFormulaResult } from "./pro-formula-contract";
import { PRO_SAMPLE_INPUTS } from "./pro-sample-inputs";

export const toolKey = "outsource-vs-in-house-analyzer";
export const formulaVersion = MAKE_BUY_FORMULA_VERSION;
export const arithmeticMode = MAKE_BUY_ARITHMETIC_MODE;
export const modelId = MAKE_BUY_MODEL_ID;
export const verificationEvidenceId = "tests/pro-calculation-correctness/make-buy.property.test.ts";
export const sampleInputs = PRO_SAMPLE_INPUTS[toolKey];

const REQUIRED = [
  "n_in_house_material_cost", "n_in_house_labor_cost", "n_in_house_overhead",
  "n_in_house_setup_cost", "n_outsource_unit_price", "n_outsource_logistics_cost",
  "n_annual_volume", "n_quality_risk_premium_pct", "n_source_confidence_ratio",
] as const;

function blocked(warnings: string[]): ProFormulaResult {
  return { status: "BLOCKED", outputs: {}, decimalOutputs: {}, warnings, outputKeys: [], redaction_status: "PUBLIC_SAFE_REDACTED" };
}

export function calculate(inputs: Record<string, DecimalSource>): ProFormulaResult {
  const invalid = REQUIRED.filter((key) => !isCanonicalDecimalSource(inputs[key]));
  if (invalid.length > 0) return blocked([`Missing or non-finite normalized inputs: ${invalid.join(", ")}.`]);
  const evaluated = evaluateMakeBuy({
    inHouseMaterialCostPerUnit: inputs.n_in_house_material_cost,
    inHouseLaborCostPerUnit: inputs.n_in_house_labor_cost,
    inHouseOverheadCostPerUnit: inputs.n_in_house_overhead,
    inHouseAnnualSetupCost: inputs.n_in_house_setup_cost,
    outsourcePricePerUnit: inputs.n_outsource_unit_price,
    outsourceLogisticsCostPerUnit: inputs.n_outsource_logistics_cost,
    annualVolume: inputs.n_annual_volume,
    outsourceQualityRiskRatio: inputs.n_quality_risk_premium_pct,
    sourceConfidenceRatio: inputs.n_source_confidence_ratio,
  });
  if (!evaluated.ok) return blocked([domainErrorMessage(evaluated.error)]);
  const value = evaluated.value;
  const exact: Array<readonly [string, Decimal]> = [
    ["out_in_house_variable_cost_per_unit", value.inHouseVariableCostPerUnit],
    ["out_setup_cost_per_unit", value.setupCostPerUnit],
    ["out_in_house_total_cost_per_unit", value.inHouseTotalCostPerUnit],
    ["out_outsource_base_cost_per_unit", value.outsourceBaseCostPerUnit],
    ["out_quality_risk_premium_per_unit", value.qualityRiskPremiumPerUnit],
    ["out_outsource_risk_adjusted_cost_per_unit", value.outsourceRiskAdjustedCostPerUnit],
    ["out_in_house_annual_cost", value.inHouseAnnualCost],
    ["out_outsource_annual_cost", value.outsourceAnnualCost],
    ["out_annual_cost_delta", value.annualCostDelta],
    ["out_cost_delta_per_unit", value.costDeltaPerUnit],
    ["out_absolute_annual_cost_difference", value.absoluteAnnualCostDifference],
    ["out_source_confidence_ratio", value.sourceConfidenceRatio],
    ["out_delta_uncertainty_amount", value.deltaUncertaintyAmount],
    ["out_delta_lower_bound", value.deltaLowerBound],
    ["out_delta_upper_bound", value.deltaUpperBound],
  ];
  const outputs: Record<string, number> = {};
  const decimalOutputs: Record<string, string> = {};
  for (const [id, exactValue] of exact) {
    const presented = decimalToPresentationNumber(exactValue, id);
    if (!presented.ok) return blocked([domainErrorMessage(presented.error)]);
    outputs[id] = presented.value;
    decimalOutputs[id] = exactValue.toString();
  }
  outputs.out_primary_in_house_cost_driver = value.primaryInHouseCostDriver;
  outputs.out_decision_state = value.decisionState;
  decimalOutputs.out_primary_in_house_cost_driver = String(value.primaryInHouseCostDriver);
  decimalOutputs.out_decision_state = String(value.decisionState);
  const warnings = value.decisionState === 2
    ? ["The risk-adjusted annual cost-delta bounds cross zero; obtain stronger evidence before make-or-buy approval."]
    : [];
  return { status: warnings.length > 0 ? "REVIEW" : "OK", outputs, decimalOutputs, warnings,
    outputKeys: Object.keys(outputs), redaction_status: "PUBLIC_SAFE_REDACTED" };
}
