import "server-only";

import type { Decimal, DomainResult } from "./pro-decimal-domain";
import { createDecimalContext, err, ok } from "./pro-decimal-domain";

export const CASH_SURVIVAL_FORMULA_VERSION = "2.0.0";
export const CASH_SURVIVAL_SCHEMA_VERSION = "5.3.1-pro-cash-survival.1";
export const CASH_SURVIVAL_MODEL_ID = "PRO_MONTHLY_CASH_SURVIVAL_BREAK_EVEN_V2";
export const CASH_SURVIVAL_ARITHMETIC_MODE = "DECIMAL_BIGJS_50_HALF_EVEN" as const;

export interface CashSurvivalInputs {
  openingCashBalance: string | number;
  monthlyRevenue: string | number;
  variableCashCostRatio: string | number;
  forecastMonths: string | number;
  minimumCashReserve: string | number;
  stressedRevenueRetentionRatio: string | number;
  monthlyPayrollCashCost: string | number;
  monthlyOtherFixedOperatingCost: string | number;
  monthlyDebtAndFixedObligations: string | number;
  sourceConfidenceRatio: string | number;
  uncertaintyCoverageMultiplier: string | number;
}

export interface CashSurvivalResult {
  contributionMarginRatio: Decimal;
  monthlyVariableCashCost: Decimal;
  monthlyContribution: Decimal;
  monthlyFixedCashCost: Decimal;
  monthlyNetCashFlow: Decimal;
  breakEvenMonthlyRevenue: Decimal;
  monthlyRevenueGapToBreakEven: Decimal;
  stressedMonthlyRevenue: Decimal;
  stressedMonthlyNetCashFlow: Decimal;
  baseEndingCash: Decimal;
  stressedEndingCash: Decimal;
  minimumCashReserve: Decimal;
  cashAvailableAboveReserve: Decimal;
  stressedMonthlyBurn: Decimal;
  stressedRunwayWithinHorizonMonths: Decimal;
  requiredOpeningCashForStressHorizon: Decimal;
  additionalFundingRequired: Decimal;
  sourceConfidenceRatio: Decimal;
  cashUncertainty: Decimal;
  stressedCashLowerBound: Decimal;
  stressedCashUpperBound: Decimal;
  moneyAtRisk: Decimal;
  primaryCashCostDriver: 0 | 1 | 2 | 3;
  decisionState: 0 | 1 | 2;
}

type Kind = "NON_NEGATIVE" | "POSITIVE_INTEGER" | "RATIO" | "COVERAGE";

export function evaluateCashSurvival(inputs: CashSurvivalInputs): DomainResult<CashSurvivalResult> {
  const context = createDecimalContext();
  const read = (value: string | number, field: string, kind: Kind): DomainResult<Decimal> => {
    const parsed = context.decimal(value, field);
    if (!parsed.ok) return parsed;
    if (kind === "NON_NEGATIVE" && parsed.value.lt("0")) {
      return err({ code: "DOMAIN_VIOLATION", field, message: `${field} must be non-negative.` });
    }
    if (kind === "POSITIVE_INTEGER" && (parsed.value.lte("0") || !parsed.value.round(0, 0).eq(parsed.value))) {
      return err({ code: "DOMAIN_VIOLATION", field, message: `${field} must be a positive integer count.` });
    }
    if (kind === "RATIO" && (parsed.value.lt("0") || parsed.value.gt("1"))) {
      return err({ code: "DOMAIN_VIOLATION", field, message: `${field} must be within [0, 1].` });
    }
    if (kind === "COVERAGE" && (parsed.value.lt("0") || parsed.value.gt("10"))) {
      return err({ code: "DOMAIN_VIOLATION", field, message: `${field} must be within [0, 10].` });
    }
    return parsed;
  };

  const openingCash = read(inputs.openingCashBalance, "opening_cash_balance", "NON_NEGATIVE");
  if (!openingCash.ok) return openingCash;
  const revenue = read(inputs.monthlyRevenue, "monthly_revenue", "NON_NEGATIVE");
  if (!revenue.ok) return revenue;
  const variableRatio = read(inputs.variableCashCostRatio, "variable_cash_cost_ratio", "RATIO");
  if (!variableRatio.ok) return variableRatio;
  if (variableRatio.value.eq("1")) {
    return err({ code: "DOMAIN_VIOLATION", field: "variable_cash_cost_ratio", message: "Variable cash cost ratio must be less than 1 so break-even revenue is defined." });
  }
  const months = read(inputs.forecastMonths, "forecast_months", "POSITIVE_INTEGER");
  if (!months.ok) return months;
  if (months.value.gt("120")) {
    return err({ code: "DOMAIN_VIOLATION", field: "forecast_months", message: "Forecast horizon cannot exceed 120 months." });
  }
  const reserve = read(inputs.minimumCashReserve, "minimum_cash_reserve", "NON_NEGATIVE");
  if (!reserve.ok) return reserve;
  const retention = read(inputs.stressedRevenueRetentionRatio, "stressed_revenue_retention_ratio", "RATIO");
  if (!retention.ok) return retention;
  const payroll = read(inputs.monthlyPayrollCashCost, "monthly_payroll_cash_cost", "NON_NEGATIVE");
  if (!payroll.ok) return payroll;
  const otherFixed = read(inputs.monthlyOtherFixedOperatingCost, "monthly_other_fixed_operating_cost", "NON_NEGATIVE");
  if (!otherFixed.ok) return otherFixed;
  const obligations = read(inputs.monthlyDebtAndFixedObligations, "monthly_debt_and_fixed_obligations", "NON_NEGATIVE");
  if (!obligations.ok) return obligations;
  const confidence = read(inputs.sourceConfidenceRatio, "source_confidence_ratio", "RATIO");
  if (!confidence.ok) return confidence;
  const coverage = read(inputs.uncertaintyCoverageMultiplier, "uncertainty_coverage_multiplier", "COVERAGE");
  if (!coverage.ok) return coverage;

  const one = context.DecimalConstructor("1");
  const zero = context.DecimalConstructor("0");
  const contributionMarginRatio = one.minus(variableRatio.value);
  const monthlyVariableCashCost = revenue.value.times(variableRatio.value);
  const monthlyContribution = revenue.value.minus(monthlyVariableCashCost);
  const monthlyFixedCashCost = payroll.value.plus(otherFixed.value).plus(obligations.value);
  const monthlyNetCashFlow = monthlyContribution.minus(monthlyFixedCashCost);
  const breakEvenMonthlyRevenue = monthlyFixedCashCost.div(contributionMarginRatio);
  const monthlyRevenueGapToBreakEven = revenue.value.minus(breakEvenMonthlyRevenue);
  const stressedMonthlyRevenue = revenue.value.times(retention.value);
  const stressedVariableCashCost = stressedMonthlyRevenue.times(variableRatio.value);
  const stressedContribution = stressedMonthlyRevenue.minus(stressedVariableCashCost);
  const stressedMonthlyNetCashFlow = stressedContribution.minus(monthlyFixedCashCost);
  const baseEndingCash = openingCash.value.plus(monthlyNetCashFlow.times(months.value));
  const stressedEndingCash = openingCash.value.plus(stressedMonthlyNetCashFlow.times(months.value));
  const cashAvailableAboveReserve = openingCash.value.gt(reserve.value)
    ? openingCash.value.minus(reserve.value)
    : zero;
  const stressedMonthlyBurn = stressedMonthlyNetCashFlow.lt("0")
    ? stressedMonthlyNetCashFlow.abs()
    : zero;
  const uncappedRunway = stressedMonthlyBurn.eq("0")
    ? months.value
    : cashAvailableAboveReserve.div(stressedMonthlyBurn);
  const stressedRunwayWithinHorizonMonths = uncappedRunway.gt(months.value) ? months.value : uncappedRunway;
  const requiredOpeningCashForStressHorizon = reserve.value.plus(stressedMonthlyBurn.times(months.value));
  const additionalFundingRequired = requiredOpeningCashForStressHorizon.gt(openingCash.value)
    ? requiredOpeningCashForStressHorizon.minus(openingCash.value)
    : zero;
  const stressedMonthlyOperatingExposure = stressedVariableCashCost.plus(monthlyFixedCashCost);
  const cashUncertainty = stressedMonthlyOperatingExposure
    .times(months.value)
    .times(one.minus(confidence.value))
    .times(coverage.value);
  const stressedCashLowerBound = stressedEndingCash.minus(cashUncertainty);
  const stressedCashUpperBound = stressedEndingCash.plus(cashUncertainty);
  const moneyAtRisk = reserve.value.gt(stressedCashLowerBound)
    ? reserve.value.minus(stressedCashLowerBound)
    : zero;

  const drivers = [payroll.value, otherFixed.value, obligations.value, stressedVariableCashCost] as const;
  let primaryCashCostDriver: 0 | 1 | 2 | 3 = 0;
  for (let index = 1; index < drivers.length; index += 1) {
    if (drivers[index].gt(drivers[primaryCashCostDriver])) primaryCashCostDriver = index as 1 | 2 | 3;
  }
  const decisionState: 0 | 1 | 2 = stressedCashLowerBound.gte(reserve.value) && monthlyRevenueGapToBreakEven.gte("0")
    ? 0
    : stressedCashUpperBound.gte(reserve.value) ? 1 : 2;

  return ok({
    contributionMarginRatio,
    monthlyVariableCashCost,
    monthlyContribution,
    monthlyFixedCashCost,
    monthlyNetCashFlow,
    breakEvenMonthlyRevenue,
    monthlyRevenueGapToBreakEven,
    stressedMonthlyRevenue,
    stressedMonthlyNetCashFlow,
    baseEndingCash,
    stressedEndingCash,
    minimumCashReserve: reserve.value,
    cashAvailableAboveReserve,
    stressedMonthlyBurn,
    stressedRunwayWithinHorizonMonths,
    requiredOpeningCashForStressHorizon,
    additionalFundingRequired,
    sourceConfidenceRatio: confidence.value,
    cashUncertainty,
    stressedCashLowerBound,
    stressedCashUpperBound,
    moneyAtRisk,
    primaryCashCostDriver,
    decisionState,
  });
}
