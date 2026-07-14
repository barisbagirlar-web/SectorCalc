import "server-only";

import {
  MACHINE_OPTION_ARITHMETIC_MODE,
  MACHINE_OPTION_FORMULA_VERSION,
  MACHINE_OPTION_MODEL_ID,
  evaluateMachineOption,
} from "./machine-option-core";
import { decimalToPresentationNumber, domainErrorMessage, isCanonicalDecimalSource, type Decimal, type DecimalSource } from "./pro-decimal-domain";
import type { ProFormulaResult } from "./pro-formula-contract";
import { PRO_SAMPLE_INPUTS } from "./pro-sample-inputs";

export const toolKey = "machine-investment-feasibility-buy-lease-keep";
export const formulaVersion = MACHINE_OPTION_FORMULA_VERSION;
export const arithmeticMode = MACHINE_OPTION_ARITHMETIC_MODE;
export const modelId = MACHINE_OPTION_MODEL_ID;
export const verificationEvidenceId = "tests/pro-calculation-correctness/machine-option.property.test.ts";
export const sampleInputs = PRO_SAMPLE_INPUTS[toolKey];

const REQUIRED = [
  "n_initial_investment", "n_annual_net_cash_flow", "n_discount_rate",
  "n_analysis_years", "n_residual_value", "n_stress_downside_factor",
  "n_annual_volume", "n_labor_rate", "n_overhead_rate", "n_defect_or_loss_cost",
  "n_source_confidence_ratio", "n_uncertainty_multiplier",
] as const;

function blocked(warnings: string[]): ProFormulaResult {
  return { status: "BLOCKED", outputs: {}, decimalOutputs: {}, warnings, outputKeys: [], redaction_status: "PUBLIC_SAFE_REDACTED" };
}

export function calculate(inputs: Record<string, DecimalSource>): ProFormulaResult {
  const invalid = REQUIRED.filter((key) => !isCanonicalDecimalSource(inputs[key]));
  if (invalid.length > 0) return blocked([`Missing or non-finite normalized inputs: ${invalid.join(", ")}.`]);
  const evaluated = evaluateMachineOption({
    buyPurchaseAndInstallationCost: inputs.n_initial_investment,
    annualBuyOperatingCost: inputs.n_annual_net_cash_flow,
    discountRate: inputs.n_discount_rate,
    analysisYears: inputs.n_analysis_years,
    buyResidualValue: inputs.n_residual_value,
    downsideAnnualCostIncreaseRatio: inputs.n_stress_downside_factor,
    leaseUpfrontCost: inputs.n_annual_volume,
    annualLeasePaymentAndServiceCost: inputs.n_labor_rate,
    keepRefurbishmentCostToday: inputs.n_overhead_rate,
    annualKeepMaintenanceAndDowntimeCost: inputs.n_defect_or_loss_cost,
    sourceConfidenceRatio: inputs.n_source_confidence_ratio,
    uncertaintyCoverageMultiplier: inputs.n_uncertainty_multiplier,
  });
  if (!evaluated.ok) return blocked([domainErrorMessage(evaluated.error)]);
  const value = evaluated.value;
  const exact: Array<readonly [string, Decimal]> = [
    ["out_annuity_present_value_factor", value.annuityPresentValueFactor],
    ["out_residual_present_value_factor", value.residualPresentValueFactor],
    ["out_buy_residual_present_value", value.buyResidualPresentValue],
    ["out_buy_present_cost", value.buyPresentCost],
    ["out_lease_present_cost", value.leasePresentCost],
    ["out_keep_present_cost", value.keepPresentCost],
    ["out_stressed_buy_present_cost", value.stressedBuyPresentCost],
    ["out_stressed_lease_present_cost", value.stressedLeasePresentCost],
    ["out_stressed_keep_present_cost", value.stressedKeepPresentCost],
    ["out_stressed_buy_equivalent_annual_cost", value.stressedBuyEquivalentAnnualCost],
    ["out_stressed_lease_equivalent_annual_cost", value.stressedLeaseEquivalentAnnualCost],
    ["out_stressed_keep_equivalent_annual_cost", value.stressedKeepEquivalentAnnualCost],
    ["out_stressed_cost_advantage", value.stressedCostAdvantage],
    ["out_source_confidence_ratio", value.sourceConfidenceRatio],
    ["out_winner_cost_uncertainty", value.winnerCostUncertainty],
    ["out_runner_up_cost_uncertainty", value.runnerUpCostUncertainty],
    ["out_winner_cost_upper_bound", value.winnerCostUpperBound],
    ["out_runner_up_cost_lower_bound", value.runnerUpCostLowerBound],
    ["out_robust_cost_advantage_lower_bound", value.robustCostAdvantageLowerBound],
    ["out_selection_money_at_risk", value.selectionMoneyAtRisk],
  ];
  const outputs: Record<string, number> = {};
  const decimalOutputs: Record<string, string> = {};
  for (const [id, exactValue] of exact) {
    const presented = decimalToPresentationNumber(exactValue, id);
    if (!presented.ok) return blocked([domainErrorMessage(presented.error)]);
    outputs[id] = presented.value;
    decimalOutputs[id] = exactValue.toString();
  }
  outputs.out_recommended_option = value.recommendedOption;
  outputs.out_runner_up_option = value.runnerUpOption;
  outputs.out_decision_state = value.decisionState;
  decimalOutputs.out_recommended_option = String(value.recommendedOption);
  decimalOutputs.out_runner_up_option = String(value.runnerUpOption);
  decimalOutputs.out_decision_state = String(value.decisionState);
  const warnings = value.decisionState === 1
    ? ["The evidence-adjusted winner and runner-up cost intervals overlap; review source evidence before committing to buy, lease, or keep."]
    : [];
  return { status: warnings.length > 0 ? "REVIEW" : "OK", outputs, decimalOutputs, warnings,
    outputKeys: Object.keys(outputs), redaction_status: "PUBLIC_SAFE_REDACTED" };
}
