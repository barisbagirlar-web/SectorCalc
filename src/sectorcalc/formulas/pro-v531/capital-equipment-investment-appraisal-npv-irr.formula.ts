import "server-only";
import { PRO_SAMPLE_INPUTS } from "./pro-sample-inputs";
import {
  INVESTMENT_APPRAISAL_ARITHMETIC_MODE,
  INVESTMENT_APPRAISAL_FORMULA_VERSION,
  INVESTMENT_APPRAISAL_MODEL_ID,
  evaluateInvestmentAppraisalResult,
} from "./investment-appraisal-core";
import {
  createDecimalContext,
  decimalToPresentationNumber,
  domainErrorMessage,
  isCanonicalDecimalSource,
  type Decimal,
  type DecimalSource,
} from "./pro-decimal-domain";

export type CalculationStatus = "OK" | "REVIEW" | "BLOCKED";
export type RedactionStatus =
  | "PUBLIC_SAFE_REDACTED"
  | "REDACTION_NOT_REQUIRED"
  | "REDACTION_FAILED_BLOCKED";

export interface CalculationResult {
  status: CalculationStatus;
  outputs: Record<string, number>;
  decimalOutputs?: Record<string, string>;
  warnings: string[];
  outputKeys: string[];
  redaction_status: RedactionStatus;
}

export const toolKey = "capital-equipment-investment-appraisal-npv-irr";
export const formulaVersion = INVESTMENT_APPRAISAL_FORMULA_VERSION;
export const arithmeticMode = INVESTMENT_APPRAISAL_ARITHMETIC_MODE;
export const modelId = INVESTMENT_APPRAISAL_MODEL_ID;
export const verificationEvidenceId =
  "tests/pro-calculation-correctness/investment-appraisal.property.test.ts";
export const sampleInputs = PRO_SAMPLE_INPUTS[toolKey];

const REQUIRED_INPUTS = [
  "n_initial_investment",
  "n_annual_net_cash_flow",
  "n_discount_rate",
  "n_analysis_years",
  "n_residual_value",
  "n_stress_downside_factor",
  "n_source_confidence_ratio",
  "n_uncertainty_multiplier",
] as const;

function blocked(warnings: string[]): CalculationResult {
  return {
    status: "BLOCKED",
    outputs: {},
    decimalOutputs: {},
    warnings,
    outputKeys: [],
    redaction_status: "PUBLIC_SAFE_REDACTED",
  };
}

export function calculate(inputs: Record<string, DecimalSource>): CalculationResult {
  const invalidInputs = REQUIRED_INPUTS.filter(
    (key) => !isCanonicalDecimalSource(inputs[key]),
  );
  if (invalidInputs.length > 0) {
    return blocked([
      "Missing or non-finite normalized inputs: " +
        invalidInputs.join(", ") +
        ".",
    ]);
  }

  const exactResult = evaluateInvestmentAppraisalResult({
    initialInvestment: inputs.n_initial_investment,
    annualCashFlow: inputs.n_annual_net_cash_flow,
    discountRate: inputs.n_discount_rate,
    periods: inputs.n_analysis_years,
    residualValue: inputs.n_residual_value,
    downsideFactor: inputs.n_stress_downside_factor,
    sourceConfidenceRatio: inputs.n_source_confidence_ratio,
    uncertaintyMultiplier: inputs.n_uncertainty_multiplier,
  });
  if (!exactResult.ok) {
    return blocked([domainErrorMessage(exactResult.error)]);
  }
  const result = exactResult.value;

  const outputs: Record<string, number> = {};
  const decimalOutputs: Record<string, string> = {};
  const exactOutputs: Array<[string, Decimal]> = [
    ["out_net_present_value", result.netPresentValue],
    ["out_profitability_index", result.profitabilityIndex],
    ["out_stressed_net_present_value", result.stressedNetPresentValue],
    ["out_npv_uncertainty_amount", result.uncertaintyAmount],
    ["out_npv_lower_bound", result.lowerBound],
    ["out_npv_upper_bound", result.upperBound],
    ["out_break_even_annual_cash_flow", result.breakEvenAnnualCashFlow],
  ];

  if (result.internalRateOfReturn !== null) {
    exactOutputs.push([
      "out_internal_rate_of_return_percent",
      result.internalRateOfReturn.times("100"),
    ]);
  }
  if (result.simplePaybackYears !== null) {
    exactOutputs.push(["out_simple_payback_years", result.simplePaybackYears]);
  }
  if (result.hurdleRateMargin !== null) {
    exactOutputs.push([
      "out_hurdle_rate_margin_percent",
      result.hurdleRateMargin.times("100"),
    ]);
  }

  const decimalContext = createDecimalContext();
  const confidence = decimalContext.decimal(
    inputs.n_source_confidence_ratio,
    "n_source_confidence_ratio",
  );
  if (!confidence.ok) return blocked([domainErrorMessage(confidence.error)]);
  exactOutputs.push(["out_source_confidence_ratio", confidence.value]);

  for (const [id, exactValue] of exactOutputs) {
    const presented = decimalToPresentationNumber(exactValue, id);
    if (!presented.ok) return blocked([domainErrorMessage(presented.error)]);
    outputs[id] = presented.value;
    decimalOutputs[id] = exactValue.toString();
  }

  outputs["out_decision_state"] = result.decisionState;
  decimalOutputs["out_decision_state"] = String(result.decisionState);

  const warnings: string[] = [];
  if (result.internalRateOfReturn === null) {
    warnings.push(
      "IRR is unavailable because the cash-flow pattern has no unique bracketed root.",
    );
  }
  if (result.simplePaybackYears === null) {
    warnings.push(
      "The initial investment is not recovered within the analysis period.",
    );
  }
  if (result.decisionState === 1) {
    warnings.push(
      "Base-case NPV is positive, but the stressed case requires review.",
    );
  } else if (result.decisionState === 2) {
    warnings.push(
      "The investment does not meet the base-case NPV decision threshold.",
    );
  }

  return {
    status: warnings.length > 0 ? "REVIEW" : "OK",
    outputs,
    decimalOutputs,
    warnings,
    outputKeys: Object.keys(outputs),
    redaction_status: "PUBLIC_SAFE_REDACTED",
  };
}
