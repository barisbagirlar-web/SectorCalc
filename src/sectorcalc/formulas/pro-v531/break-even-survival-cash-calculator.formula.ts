import "server-only";

import {
  CASH_SURVIVAL_ARITHMETIC_MODE,
  CASH_SURVIVAL_FORMULA_VERSION,
  CASH_SURVIVAL_MODEL_ID,
  evaluateCashSurvival,
} from "./cash-survival-core";
import {
  decimalToPresentationNumber,
  domainErrorMessage,
  isCanonicalDecimalSource,
  type Decimal,
  type DecimalSource,
} from "./pro-decimal-domain";
import type { ProFormulaResult } from "./pro-formula-contract";
import { PRO_SAMPLE_INPUTS } from "./pro-sample-inputs";

export const toolKey = "break-even-survival-cash-calculator";
export const formulaVersion = CASH_SURVIVAL_FORMULA_VERSION;
export const arithmeticMode = CASH_SURVIVAL_ARITHMETIC_MODE;
export const modelId = CASH_SURVIVAL_MODEL_ID;
export const verificationEvidenceId = "tests/pro-calculation-correctness/cash-survival.property.test.ts";
export const sampleInputs = PRO_SAMPLE_INPUTS[toolKey];

export const requiredInputKeys = Object.freeze([
  "n_initial_investment",
  "n_annual_net_cash_flow",
  "n_discount_rate",
  "n_analysis_years",
  "n_residual_value",
  "n_stress_downside_factor",
  "n_labor_rate",
  "n_overhead_rate",
  "n_defect_or_loss_cost",
  "n_source_confidence_ratio",
  "n_uncertainty_multiplier",
] as const);

export const declaredOutputKeys = Object.freeze([
  "out_contribution_margin_ratio",
  "out_monthly_variable_cash_cost",
  "out_monthly_contribution",
  "out_monthly_fixed_cash_cost",
  "out_monthly_net_cash_flow",
  "out_break_even_monthly_revenue",
  "out_monthly_revenue_gap_to_break_even",
  "out_stressed_monthly_revenue",
  "out_stressed_monthly_net_cash_flow",
  "out_base_ending_cash",
  "out_stressed_ending_cash",
  "out_minimum_cash_reserve",
  "out_cash_available_above_reserve",
  "out_stressed_monthly_burn",
  "out_stressed_runway_within_horizon_months",
  "out_required_opening_cash_for_stress_horizon",
  "out_additional_funding_required",
  "out_source_confidence_ratio",
  "out_cash_uncertainty",
  "out_stressed_cash_lower_bound",
  "out_stressed_cash_upper_bound",
  "out_money_at_risk",
  "out_primary_cash_cost_driver",
  "out_decision_state",
] as const);

const requiredInputSet = new Set<string>(requiredInputKeys);

function blocked(warnings: string[]): ProFormulaResult {
  return {
    status: "BLOCKED",
    outputs: {},
    decimalOutputs: {},
    warnings,
    outputKeys: [],
    redaction_status: "PUBLIC_SAFE_REDACTED",
  };
}

export function calculate(inputs: Record<string, DecimalSource>): ProFormulaResult {
  const providedKeys = Object.keys(inputs).sort();
  const unexpected = providedKeys.filter((key) => !requiredInputSet.has(key));
  if (unexpected.length > 0) {
    return blocked([`Unexpected normalized inputs: ${unexpected.join(", ")}.`]);
  }

  const invalid = requiredInputKeys.filter((key) => !isCanonicalDecimalSource(inputs[key]));
  if (invalid.length > 0) {
    return blocked([`Missing or non-finite normalized inputs: ${invalid.join(", ")}.`]);
  }

  const evaluated = evaluateCashSurvival({
    openingCashBalance: inputs.n_initial_investment,
    monthlyRevenue: inputs.n_annual_net_cash_flow,
    variableCashCostRatio: inputs.n_discount_rate,
    forecastMonths: inputs.n_analysis_years,
    minimumCashReserve: inputs.n_residual_value,
    stressedRevenueRetentionRatio: inputs.n_stress_downside_factor,
    monthlyPayrollCashCost: inputs.n_labor_rate,
    monthlyOtherFixedOperatingCost: inputs.n_overhead_rate,
    monthlyDebtAndFixedObligations: inputs.n_defect_or_loss_cost,
    sourceConfidenceRatio: inputs.n_source_confidence_ratio,
    uncertaintyCoverageMultiplier: inputs.n_uncertainty_multiplier,
  });
  if (!evaluated.ok) return blocked([domainErrorMessage(evaluated.error)]);

  const value = evaluated.value;
  const exact: Array<readonly [string, Decimal]> = [
    ["out_contribution_margin_ratio", value.contributionMarginRatio],
    ["out_monthly_variable_cash_cost", value.monthlyVariableCashCost],
    ["out_monthly_contribution", value.monthlyContribution],
    ["out_monthly_fixed_cash_cost", value.monthlyFixedCashCost],
    ["out_monthly_net_cash_flow", value.monthlyNetCashFlow],
    ["out_break_even_monthly_revenue", value.breakEvenMonthlyRevenue],
    ["out_monthly_revenue_gap_to_break_even", value.monthlyRevenueGapToBreakEven],
    ["out_stressed_monthly_revenue", value.stressedMonthlyRevenue],
    ["out_stressed_monthly_net_cash_flow", value.stressedMonthlyNetCashFlow],
    ["out_base_ending_cash", value.baseEndingCash],
    ["out_stressed_ending_cash", value.stressedEndingCash],
    ["out_minimum_cash_reserve", value.minimumCashReserve],
    ["out_cash_available_above_reserve", value.cashAvailableAboveReserve],
    ["out_stressed_monthly_burn", value.stressedMonthlyBurn],
    ["out_stressed_runway_within_horizon_months", value.stressedRunwayWithinHorizonMonths],
    ["out_required_opening_cash_for_stress_horizon", value.requiredOpeningCashForStressHorizon],
    ["out_additional_funding_required", value.additionalFundingRequired],
    ["out_source_confidence_ratio", value.sourceConfidenceRatio],
    ["out_cash_uncertainty", value.cashUncertainty],
    ["out_stressed_cash_lower_bound", value.stressedCashLowerBound],
    ["out_stressed_cash_upper_bound", value.stressedCashUpperBound],
    ["out_money_at_risk", value.moneyAtRisk],
  ];

  const outputs: Record<string, number> = {};
  const decimalOutputs: Record<string, string> = {};
  for (const [id, exactValue] of exact) {
    const presented = decimalToPresentationNumber(exactValue, id);
    if (!presented.ok) return blocked([domainErrorMessage(presented.error)]);
    outputs[id] = presented.value;
    decimalOutputs[id] = exactValue.toString();
  }

  outputs.out_primary_cash_cost_driver = value.primaryCashCostDriver;
  outputs.out_decision_state = value.decisionState;
  decimalOutputs.out_primary_cash_cost_driver = String(value.primaryCashCostDriver);
  decimalOutputs.out_decision_state = String(value.decisionState);

  const outputKeys = Object.keys(outputs);
  if (
    outputKeys.length !== declaredOutputKeys.length ||
    declaredOutputKeys.some((key) => !Object.prototype.hasOwnProperty.call(outputs, key))
  ) {
    return blocked(["Formula output contract does not match the declared Exact Decimal namespace."]);
  }

  const warnings = value.decisionState === 2
    ? ["Even the evidence-adjusted stressed cash upper bound falls below the minimum reserve; hold commitments and secure funding or cost action."]
    : value.decisionState === 1
      ? ["Break-even revenue or the stressed cash lower bound is not secured; management review is required."]
      : [];

  return {
    status: warnings.length > 0 ? "REVIEW" : "OK",
    outputs,
    decimalOutputs,
    warnings,
    outputKeys: [...declaredOutputKeys],
    redaction_status: "PUBLIC_SAFE_REDACTED",
  };
}
