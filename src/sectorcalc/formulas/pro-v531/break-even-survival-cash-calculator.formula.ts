import "server-only";
import { PRO_SAMPLE_INPUTS } from "./pro-sample-inputs";

export type CalculationStatus = "OK" | "REVIEW" | "BLOCKED";
export type RedactionStatus = "PUBLIC_SAFE_REDACTED" | "REDACTION_NOT_REQUIRED" | "REDACTION_FAILED_BLOCKED";

export interface CalculationResult {
  status: CalculationStatus;
  outputs: Record<string, number>;
  warnings: string[];
  outputKeys: string[];
  redaction_status: RedactionStatus;
}

export const toolKey = "break-even-survival-cash-calculator";
export const formulaVersion = "5.3.1-pro-baris.2";

const RUNWAY_CAP_MONTHS = 120;
const EPSILON = 1e-9;

function isFiniteNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function round(value: number, decimals: number): number {
  if (!isFiniteNumber(value)) return 0;
  const factor = 10 ** decimals;
  return Math.round((value + Number.EPSILON) * factor) / factor;
}

function valueOf(inputs: Record<string, number>, key: string): number {
  const value = inputs[key];
  return isFiniteNumber(value) ? value : Number.NaN;
}

function blockedResult(warnings: string[]): CalculationResult {
  const outputs = {
    out_break_even_monthly_revenue: 0,
    out_current_revenue_gap: 0,
    out_stressed_monthly_revenue: 0,
    out_monthly_cash_burn: 0,
    out_cash_runway_months: 0,
    out_survival_cash_target: 0,
    out_funding_gap: 0,
    out_margin_of_safety_ratio: 0,
    out_evidence_completeness: 0,
    out_uncertainty_cash_buffer: 0,
    out_threshold_crossing: 1,
    out_final_decision_state: 2,
  };

  return {
    status: "BLOCKED",
    outputs,
    warnings,
    outputKeys: Object.keys(outputs),
    redaction_status: "PUBLIC_SAFE_REDACTED",
  };
}

export const sampleInputs = PRO_SAMPLE_INPUTS[toolKey];

export function calculate(inputs: Record<string, number>): CalculationResult {
  const fixedCashCost = valueOf(inputs, "n_monthly_fixed_cash_cost");
  const debtService = valueOf(inputs, "n_monthly_debt_service");
  const contributionMarginRatio = valueOf(inputs, "n_contribution_margin_ratio");
  const currentMonthlyRevenue = valueOf(inputs, "n_current_monthly_revenue");
  const unrestrictedCash = valueOf(inputs, "n_unrestricted_cash_balance");
  const targetSurvivalMonths = valueOf(inputs, "n_target_survival_months");
  const downsideRevenueFactor = valueOf(inputs, "n_downside_revenue_factor");
  const minimumCashBuffer = valueOf(inputs, "n_minimum_cash_buffer");
  const sourceConfidenceRatio = valueOf(inputs, "n_source_confidence_ratio");
  const uncertaintyMultiplier = valueOf(inputs, "n_uncertainty_multiplier");

  const requiredValues: Array<[string, number]> = [
    ["Monthly Fixed Cash Cost", fixedCashCost],
    ["Monthly Debt Service", debtService],
    ["Contribution Margin Ratio", contributionMarginRatio],
    ["Current Monthly Revenue", currentMonthlyRevenue],
    ["Unrestricted Cash Balance", unrestrictedCash],
    ["Target Survival Months", targetSurvivalMonths],
    ["Downside Revenue Factor", downsideRevenueFactor],
    ["Minimum Cash Buffer", minimumCashBuffer],
    ["Source Confidence Ratio", sourceConfidenceRatio],
    ["Uncertainty Multiplier", uncertaintyMultiplier],
  ];

  const warnings: string[] = [];
  const missing = requiredValues
    .filter(([, value]) => !isFiniteNumber(value))
    .map(([label]) => label);

  if (missing.length > 0) {
    return blockedResult([`Missing or non-finite required inputs: ${missing.join(", ")}.`]);
  }

  if (
    fixedCashCost < 0 ||
    debtService < 0 ||
    currentMonthlyRevenue < 0 ||
    unrestrictedCash < 0 ||
    minimumCashBuffer < 0
  ) {
    return blockedResult(["Cash, revenue, and mandatory cost inputs must not be negative."]);
  }

  if (contributionMarginRatio <= 0 || contributionMarginRatio > 1) {
    return blockedResult(["Contribution Margin Ratio must be greater than 0 and no greater than 100%."]);
  }

  if (targetSurvivalMonths <= 0 || targetSurvivalMonths > RUNWAY_CAP_MONTHS) {
    return blockedResult([`Target Survival Months must be greater than 0 and no greater than ${RUNWAY_CAP_MONTHS}.`]);
  }

  if (downsideRevenueFactor < 0 || downsideRevenueFactor > 1) {
    return blockedResult(["Downside Revenue Factor must be between 0% and 100%."]);
  }

  if (sourceConfidenceRatio < 0 || sourceConfidenceRatio > 1) {
    return blockedResult(["Source Confidence Ratio must be between 0% and 100%."]);
  }

  if (uncertaintyMultiplier < 1 || uncertaintyMultiplier > 3) {
    return blockedResult(["Uncertainty Multiplier must be between 1.00 and 3.00."]);
  }

  const monthlyObligations = fixedCashCost + debtService;
  const breakEvenMonthlyRevenue = monthlyObligations / contributionMarginRatio;
  const currentRevenueGap = currentMonthlyRevenue - breakEvenMonthlyRevenue;
  const stressedMonthlyRevenue = currentMonthlyRevenue * downsideRevenueFactor;
  const stressedContribution = stressedMonthlyRevenue * contributionMarginRatio;
  const monthlyCashBurn = Math.max(0, monthlyObligations - stressedContribution);
  const availableSurvivalCash = Math.max(0, unrestrictedCash - minimumCashBuffer);
  const cashRunwayMonths =
    monthlyCashBurn > EPSILON
      ? Math.min(RUNWAY_CAP_MONTHS, availableSurvivalCash / monthlyCashBurn)
      : RUNWAY_CAP_MONTHS;
  const uncertaintyCashBuffer = monthlyCashBurn * Math.max(0, uncertaintyMultiplier - 1);
  const survivalCashTarget =
    minimumCashBuffer +
    monthlyCashBurn * targetSurvivalMonths +
    uncertaintyCashBuffer;
  const fundingGap = Math.max(0, survivalCashTarget - unrestrictedCash);
  const marginOfSafetyRatio =
    currentMonthlyRevenue > EPSILON
      ? currentRevenueGap / currentMonthlyRevenue
      : -1;
  const targetRunwayBreached =
    monthlyCashBurn > EPSILON && cashRunwayMonths + EPSILON < targetSurvivalMonths;

  if (currentRevenueGap < 0) {
    warnings.push("Current monthly revenue is below the calculated break-even revenue.");
  }
  if (monthlyCashBurn > EPSILON) {
    warnings.push("The downside scenario produces a monthly cash burn.");
  }
  if (targetRunwayBreached) {
    warnings.push("Available survival cash does not cover the selected target runway.");
  }
  if (fundingGap > EPSILON) {
    warnings.push("A funding gap remains after the minimum cash buffer and uncertainty allowance.");
  }
  if (sourceConfidenceRatio < 0.7) {
    warnings.push("Source confidence is below 70%; verify accounting records before commitment.");
  }

  const decisionCode =
    sourceConfidenceRatio < 0.5
      ? 2
      : (fundingGap > EPSILON || currentRevenueGap < 0 || targetRunwayBreached || sourceConfidenceRatio < 0.7)
        ? 1
        : 0;

  const outputs = {
    out_break_even_monthly_revenue: round(breakEvenMonthlyRevenue, 2),
    out_current_revenue_gap: round(currentRevenueGap, 2),
    out_stressed_monthly_revenue: round(stressedMonthlyRevenue, 2),
    out_monthly_cash_burn: round(monthlyCashBurn, 2),
    out_cash_runway_months: round(cashRunwayMonths, 2),
    out_survival_cash_target: round(survivalCashTarget, 2),
    out_funding_gap: round(fundingGap, 2),
    out_margin_of_safety_ratio: round(marginOfSafetyRatio, 4),
    out_evidence_completeness: round(sourceConfidenceRatio, 3),
    out_uncertainty_cash_buffer: round(uncertaintyCashBuffer, 2),
    out_threshold_crossing: targetRunwayBreached ? 1 : 0,
    out_final_decision_state: decisionCode,
  };

  const outputsFinite = Object.values(outputs).every(isFiniteNumber);
  if (!outputsFinite) {
    return blockedResult(["A non-finite result was produced; execution was blocked."]);
  }

  return {
    status: decisionCode === 0 ? "OK" : decisionCode === 1 ? "REVIEW" : "BLOCKED",
    outputs,
    warnings,
    outputKeys: Object.keys(outputs),
    redaction_status: "PUBLIC_SAFE_REDACTED",
  };
}
