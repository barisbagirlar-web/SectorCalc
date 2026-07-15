import "server-only";
import { PRO_SAMPLE_INPUTS } from "./pro-sample-inputs";

export type CalculationStatus = "OK" | "REVIEW" | "BLOCKED";
export type RedactionStatus =
  | "PUBLIC_SAFE_REDACTED"
  | "REDACTION_NOT_REQUIRED"
  | "REDACTION_FAILED_BLOCKED";

export interface CalculationResult {
  status: CalculationStatus;
  outputs: Record<string, number>;
  warnings: string[];
  outputKeys: string[];
  redaction_status: RedactionStatus;
}

export const toolKey = "break-even-survival-cash-calculator";
export const formulaVersion = "5.3.1-pro-baris.3";

export const requiredInputKeys = [
  "n_monthly_fixed_cash_cost",
  "n_monthly_debt_service",
  "n_contribution_margin_ratio",
  "n_current_monthly_revenue",
  "n_unrestricted_cash_balance",
  "n_minimum_cash_buffer",
  "n_target_survival_months",
  "n_downside_revenue_factor",
  "n_source_confidence_ratio",
  "n_uncertainty_multiplier",
] as const;

export const declaredOutputKeys = [
  "out_break_even_monthly_revenue",
  "out_current_revenue_gap",
  "out_stressed_monthly_revenue",
  "out_monthly_cash_burn",
  "out_cash_runway_months",
  "out_survival_cash_target",
  "out_funding_gap",
  "out_margin_of_safety_ratio",
  "out_source_confidence_ratio",
  "out_uncertainty_cash_buffer",
  "out_target_runway_breached",
  "out_decision_code",
] as const;

const RUNWAY_CAP_MONTHS = 120;
const EPSILON = 1e-9;
const REQUIRED_INPUT_SET = new Set<string>(requiredInputKeys);

function isFiniteNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function round(value: number, decimals: number): number {
  if (!isFiniteNumber(value)) return Number.NaN;
  const factor = 10 ** decimals;
  return Math.round((value + Number.EPSILON) * factor) / factor;
}

function invalidInputResult(warnings: string[]): CalculationResult {
  return {
    status: "BLOCKED",
    // Invalid or incomplete inputs have no valid business result. Returning
    // zero-filled outputs would make a blocked calculation look like a genuine
    // zero-obligation or zero-gap case.
    outputs: {},
    warnings,
    outputKeys: [...declaredOutputKeys],
    redaction_status: "PUBLIC_SAFE_REDACTED",
  };
}

function readRequiredInputs(
  inputs: Record<string, number>,
): { ok: true; values: Record<(typeof requiredInputKeys)[number], number> } | { ok: false; warnings: string[] } {
  const missing = requiredInputKeys.filter((key) => !isFiniteNumber(inputs[key]));
  const unknown = Object.keys(inputs).filter((key) => !REQUIRED_INPUT_SET.has(key));

  if (missing.length > 0 || unknown.length > 0) {
    const warnings: string[] = [];
    if (missing.length > 0) warnings.push(`Missing or non-finite required inputs: ${missing.join(", ")}.`);
    if (unknown.length > 0) warnings.push(`Unexpected normalized inputs: ${unknown.join(", ")}.`);
    return { ok: false, warnings };
  }

  return {
    ok: true,
    values: Object.fromEntries(requiredInputKeys.map((key) => [key, inputs[key]])) as Record<
      (typeof requiredInputKeys)[number],
      number
    >,
  };
}

export const sampleInputs = PRO_SAMPLE_INPUTS[toolKey];

export function calculate(inputs: Record<string, number>): CalculationResult {
  const parsed = readRequiredInputs(inputs);
  if (!parsed.ok) return invalidInputResult(parsed.warnings);

  const fixedCashCost = parsed.values.n_monthly_fixed_cash_cost;
  const debtService = parsed.values.n_monthly_debt_service;
  const contributionMarginRatio = parsed.values.n_contribution_margin_ratio;
  const currentMonthlyRevenue = parsed.values.n_current_monthly_revenue;
  const unrestrictedCash = parsed.values.n_unrestricted_cash_balance;
  const minimumCashBuffer = parsed.values.n_minimum_cash_buffer;
  const targetSurvivalMonths = parsed.values.n_target_survival_months;
  const downsideRevenueFactor = parsed.values.n_downside_revenue_factor;
  const sourceConfidenceRatio = parsed.values.n_source_confidence_ratio;
  const uncertaintyMultiplier = parsed.values.n_uncertainty_multiplier;

  if (
    fixedCashCost < 0 ||
    debtService < 0 ||
    currentMonthlyRevenue < 0 ||
    unrestrictedCash < 0 ||
    minimumCashBuffer < 0
  ) {
    return invalidInputResult(["Cash, revenue, and mandatory cost inputs must not be negative."]);
  }

  if (contributionMarginRatio <= 0 || contributionMarginRatio > 1) {
    return invalidInputResult(["Contribution Margin Ratio must be greater than 0 and no greater than 100%."]);
  }

  if (targetSurvivalMonths <= 0 || targetSurvivalMonths > RUNWAY_CAP_MONTHS) {
    return invalidInputResult([
      `Target Survival Months must be greater than 0 and no greater than ${RUNWAY_CAP_MONTHS}.`,
    ]);
  }

  if (downsideRevenueFactor < 0 || downsideRevenueFactor > 1) {
    return invalidInputResult(["Downside Revenue Retention must be between 0% and 100%."]);
  }

  if (sourceConfidenceRatio < 0 || sourceConfidenceRatio > 1) {
    return invalidInputResult(["Source Confidence Ratio must be between 0% and 100%."]);
  }

  if (uncertaintyMultiplier < 1 || uncertaintyMultiplier > 3) {
    return invalidInputResult(["Uncertainty Coverage Multiplier must be between 1.00 and 3.00."]);
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

  const targetBurnCoverage = monthlyCashBurn * targetSurvivalMonths;
  const uncertaintyCashBuffer = targetBurnCoverage * Math.max(0, uncertaintyMultiplier - 1);
  const survivalCashTarget = minimumCashBuffer + targetBurnCoverage + uncertaintyCashBuffer;
  const fundingGap = Math.max(0, survivalCashTarget - unrestrictedCash);
  const marginOfSafetyRatio =
    currentMonthlyRevenue > EPSILON
      ? currentRevenueGap / currentMonthlyRevenue
      : breakEvenMonthlyRevenue <= EPSILON
        ? 0
        : -1;
  const targetRunwayBreached =
    monthlyCashBurn > EPSILON && cashRunwayMonths + EPSILON < targetSurvivalMonths;

  const warnings: string[] = [];
  if (currentRevenueGap < 0) {
    warnings.push("Current monthly revenue is below the calculated break-even revenue.");
  }
  if (targetRunwayBreached) {
    warnings.push("Available survival cash does not cover the selected target runway.");
  }
  if (fundingGap > EPSILON) {
    warnings.push("A funding gap remains after the reserve and uncertainty allowance.");
  }
  if (sourceConfidenceRatio < 0.7) {
    warnings.push("Source confidence is below 70%; verify accounting records before commitment.");
  }

  const decisionCode =
    sourceConfidenceRatio < 0.5
      ? 2
      : fundingGap > EPSILON ||
          currentRevenueGap < 0 ||
          targetRunwayBreached ||
          sourceConfidenceRatio < 0.7
        ? 1
        : 0;

  const outputs: Record<(typeof declaredOutputKeys)[number], number> = {
    out_break_even_monthly_revenue: round(breakEvenMonthlyRevenue, 2),
    out_current_revenue_gap: round(currentRevenueGap, 2),
    out_stressed_monthly_revenue: round(stressedMonthlyRevenue, 2),
    out_monthly_cash_burn: round(monthlyCashBurn, 2),
    out_cash_runway_months: round(cashRunwayMonths, 2),
    out_survival_cash_target: round(survivalCashTarget, 2),
    out_funding_gap: round(fundingGap, 2),
    out_margin_of_safety_ratio: round(marginOfSafetyRatio, 4),
    out_source_confidence_ratio: round(sourceConfidenceRatio, 3),
    out_uncertainty_cash_buffer: round(uncertaintyCashBuffer, 2),
    out_target_runway_breached: targetRunwayBreached ? 1 : 0,
    out_decision_code: decisionCode,
  };

  if (!Object.values(outputs).every(isFiniteNumber)) {
    return invalidInputResult(["A non-finite result was produced; execution was blocked."]);
  }

  return {
    status: decisionCode === 0 ? "OK" : decisionCode === 1 ? "REVIEW" : "BLOCKED",
    outputs,
    warnings,
    outputKeys: [...declaredOutputKeys],
    redaction_status: "PUBLIC_SAFE_REDACTED",
  };
}
