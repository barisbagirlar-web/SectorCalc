import "server-only";

import type { Decimal, DomainResult } from "./pro-decimal-domain";
import { createDecimalContext, err, ok } from "./pro-decimal-domain";

export const MACHINE_OPTION_FORMULA_VERSION = "2.0.0";
export const MACHINE_OPTION_SCHEMA_VERSION = "5.3.1-pro-machine-option.1";
export const MACHINE_OPTION_MODEL_ID = "PRO_BUY_LEASE_KEEP_PRESENT_COST_V2";
export const MACHINE_OPTION_ARITHMETIC_MODE = "DECIMAL_BIGJS_50_HALF_EVEN" as const;

export interface MachineOptionInputs {
  buyPurchaseAndInstallationCost: string | number;
  annualBuyOperatingCost: string | number;
  discountRate: string | number;
  analysisYears: string | number;
  buyResidualValue: string | number;
  downsideAnnualCostIncreaseRatio: string | number;
  leaseUpfrontCost: string | number;
  annualLeasePaymentAndServiceCost: string | number;
  keepRefurbishmentCostToday: string | number;
  annualKeepMaintenanceAndDowntimeCost: string | number;
  sourceConfidenceRatio: string | number;
  uncertaintyCoverageMultiplier: string | number;
}

export interface MachineOptionResult {
  annuityPresentValueFactor: Decimal;
  residualPresentValueFactor: Decimal;
  buyResidualPresentValue: Decimal;
  buyPresentCost: Decimal;
  leasePresentCost: Decimal;
  keepPresentCost: Decimal;
  stressedBuyPresentCost: Decimal;
  stressedLeasePresentCost: Decimal;
  stressedKeepPresentCost: Decimal;
  stressedBuyEquivalentAnnualCost: Decimal;
  stressedLeaseEquivalentAnnualCost: Decimal;
  stressedKeepEquivalentAnnualCost: Decimal;
  recommendedOption: 0 | 1 | 2;
  runnerUpOption: 0 | 1 | 2;
  stressedCostAdvantage: Decimal;
  sourceConfidenceRatio: Decimal;
  winnerCostUncertainty: Decimal;
  runnerUpCostUncertainty: Decimal;
  winnerCostUpperBound: Decimal;
  runnerUpCostLowerBound: Decimal;
  robustCostAdvantageLowerBound: Decimal;
  selectionMoneyAtRisk: Decimal;
  decisionState: 0 | 1;
}

type Kind = "NON_NEGATIVE" | "POSITIVE_INTEGER" | "RATIO" | "COVERAGE";

export function evaluateMachineOption(inputs: MachineOptionInputs): DomainResult<MachineOptionResult> {
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

  const buyUpfront = read(inputs.buyPurchaseAndInstallationCost, "buy_purchase_and_installation_cost", "NON_NEGATIVE");
  if (!buyUpfront.ok) return buyUpfront;
  const buyAnnual = read(inputs.annualBuyOperatingCost, "annual_buy_operating_cost", "NON_NEGATIVE");
  if (!buyAnnual.ok) return buyAnnual;
  const rate = read(inputs.discountRate, "discount_rate", "RATIO");
  if (!rate.ok) return rate;
  const years = read(inputs.analysisYears, "analysis_years", "POSITIVE_INTEGER");
  if (!years.ok) return years;
  if (years.value.gt("50")) {
    return err({ code: "DOMAIN_VIOLATION", field: "analysis_years", message: "Analysis years cannot exceed 50." });
  }
  const residual = read(inputs.buyResidualValue, "buy_residual_value", "NON_NEGATIVE");
  if (!residual.ok) return residual;
  if (residual.value.gt(buyUpfront.value)) {
    return err({ code: "DOMAIN_VIOLATION", field: "buy_residual_value", message: "Buy residual value cannot exceed the purchase and installation cost." });
  }
  const stress = read(inputs.downsideAnnualCostIncreaseRatio, "downside_annual_cost_increase_ratio", "RATIO");
  if (!stress.ok) return stress;
  const leaseUpfront = read(inputs.leaseUpfrontCost, "lease_upfront_cost", "NON_NEGATIVE");
  if (!leaseUpfront.ok) return leaseUpfront;
  const leaseAnnual = read(inputs.annualLeasePaymentAndServiceCost, "annual_lease_payment_and_service_cost", "NON_NEGATIVE");
  if (!leaseAnnual.ok) return leaseAnnual;
  const keepUpfront = read(inputs.keepRefurbishmentCostToday, "keep_refurbishment_cost_today", "NON_NEGATIVE");
  if (!keepUpfront.ok) return keepUpfront;
  const keepAnnual = read(inputs.annualKeepMaintenanceAndDowntimeCost, "annual_keep_maintenance_and_downtime_cost", "NON_NEGATIVE");
  if (!keepAnnual.ok) return keepAnnual;
  const confidence = read(inputs.sourceConfidenceRatio, "source_confidence_ratio", "RATIO");
  if (!confidence.ok) return confidence;
  const coverage = read(inputs.uncertaintyCoverageMultiplier, "uncertainty_coverage_multiplier", "COVERAGE");
  if (!coverage.ok) return coverage;

  const one = context.DecimalConstructor("1");
  const zero = context.DecimalConstructor("0");
  const discountBase = one.plus(rate.value);
  const yearCount = Number(years.value.toString());
  let annuityPresentValueFactor = zero;
  for (let year = 1; year <= yearCount; year += 1) {
    annuityPresentValueFactor = annuityPresentValueFactor.plus(one.div(discountBase.pow(year)));
  }
  const residualPresentValueFactor = one.div(discountBase.pow(yearCount));
  const buyResidualPresentValue = residual.value.times(residualPresentValueFactor);
  const buyPresentCost = buyUpfront.value.plus(buyAnnual.value.times(annuityPresentValueFactor)).minus(buyResidualPresentValue);
  const leasePresentCost = leaseUpfront.value.plus(leaseAnnual.value.times(annuityPresentValueFactor));
  const keepPresentCost = keepUpfront.value.plus(keepAnnual.value.times(annuityPresentValueFactor));
  const stressCostFactor = one.plus(stress.value);
  const stressResidualFactor = one.minus(stress.value);
  const stressedBuyPresentCost = buyUpfront.value
    .plus(buyAnnual.value.times(stressCostFactor).times(annuityPresentValueFactor))
    .minus(residual.value.times(stressResidualFactor).times(residualPresentValueFactor));
  const stressedLeasePresentCost = leaseUpfront.value
    .plus(leaseAnnual.value.times(stressCostFactor).times(annuityPresentValueFactor));
  const stressedKeepPresentCost = keepUpfront.value
    .plus(keepAnnual.value.times(stressCostFactor).times(annuityPresentValueFactor));
  const stressedBuyEquivalentAnnualCost = stressedBuyPresentCost.div(annuityPresentValueFactor);
  const stressedLeaseEquivalentAnnualCost = stressedLeasePresentCost.div(annuityPresentValueFactor);
  const stressedKeepEquivalentAnnualCost = stressedKeepPresentCost.div(annuityPresentValueFactor);
  const costs = [stressedBuyPresentCost, stressedLeasePresentCost, stressedKeepPresentCost] as const;
  let recommendedOption: 0 | 1 | 2 = 0;
  for (let index = 1; index < costs.length; index += 1) {
    if (costs[index].lt(costs[recommendedOption])) recommendedOption = index as 1 | 2;
  }
  const remaining = ([0, 1, 2] as const).filter((index) => index !== recommendedOption);
  const runnerUpOption: 0 | 1 | 2 = costs[remaining[1]].lt(costs[remaining[0]]) ? remaining[1] : remaining[0];
  const winnerCost = costs[recommendedOption];
  const runnerUpCost = costs[runnerUpOption];
  const stressedCostAdvantage = runnerUpCost.minus(winnerCost);
  const uncertaintyFactor = one.minus(confidence.value).times(coverage.value);
  const winnerCostUncertainty = winnerCost.times(uncertaintyFactor);
  const runnerUpCostUncertainty = runnerUpCost.times(uncertaintyFactor);
  const winnerCostUpperBound = winnerCost.plus(winnerCostUncertainty);
  const unboundedRunnerLower = runnerUpCost.minus(runnerUpCostUncertainty);
  const runnerUpCostLowerBound = unboundedRunnerLower.lt("0") ? zero : unboundedRunnerLower;
  const robustCostAdvantageLowerBound = runnerUpCostLowerBound.minus(winnerCostUpperBound);
  const selectionMoneyAtRisk = robustCostAdvantageLowerBound.lt("0")
    ? robustCostAdvantageLowerBound.abs()
    : zero;
  const decisionState: 0 | 1 = robustCostAdvantageLowerBound.gte("0") ? 0 : 1;

  return ok({
    annuityPresentValueFactor,
    residualPresentValueFactor,
    buyResidualPresentValue,
    buyPresentCost,
    leasePresentCost,
    keepPresentCost,
    stressedBuyPresentCost,
    stressedLeasePresentCost,
    stressedKeepPresentCost,
    stressedBuyEquivalentAnnualCost,
    stressedLeaseEquivalentAnnualCost,
    stressedKeepEquivalentAnnualCost,
    recommendedOption,
    runnerUpOption,
    stressedCostAdvantage,
    sourceConfidenceRatio: confidence.value,
    winnerCostUncertainty,
    runnerUpCostUncertainty,
    winnerCostUpperBound,
    runnerUpCostLowerBound,
    robustCostAdvantageLowerBound,
    selectionMoneyAtRisk,
    decisionState,
  });
}
