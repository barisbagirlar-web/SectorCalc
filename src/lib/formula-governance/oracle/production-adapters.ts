/**
 * Production output adapters — normalize calculator UI output for oracle comparison (Phase 5A).
 */

import type { FreeTrafficInputValues } from "@/lib/tools/free-traffic-calculators";
import { calculateFreeTrafficTool } from "@/lib/tools/free-traffic-calculators";
import type { FinanceOracleSlug } from "@/lib/formula-governance/oracle/finance-oracles";
import type { BusinessOperationsOracleSlug } from "@/lib/formula-governance/oracle/production-formula-locator";
import { calculatePremiumDecisionReport } from "@/lib/tools/premium-decision-engine";
import type { PremiumInputValues } from "@/lib/tools/premium-decision-engine";

export type NormalizedLoanProductionOutput = {
  readonly monthlyPayment: number;
};

export type NormalizedMortgageProductionOutput = {
  readonly monthlyPayment: number;
  readonly totalPaid: number;
  readonly totalInterest: number;
};

export type NormalizedSimpleInterestProductionOutput = {
  readonly interestAmount: number;
  readonly totalRepayment: number;
};

export type NormalizedCompoundInterestProductionOutput = {
  readonly futureValue: number;
  readonly interestEarned: number;
};

export type NormalizedProfitMarginProductionOutput = {
  readonly marginPercent: number;
  readonly markupPercent: number;
};

export type NormalizedRentVsBuyProductionOutput = {
  readonly totalRentPaid: number;
  readonly investmentValueIfRenting: number;
  readonly monthlyMortgagePayment: number;
  readonly totalMortgagePaid: number;
  readonly remainingMortgageBalance: number;
  readonly futureHomeValue: number;
  readonly estimatedOwnershipCosts: number;
  readonly estimatedSellingCosts: number;
  readonly rentNetPosition: number;
  readonly buyNetPosition: number;
  readonly netDifference: number;
};

export type NormalizedBreakEvenProductionOutput = {
  readonly breakEvenUnits: number;
  readonly contributionMargin: number;
};

export type NormalizedSalaryCostProductionOutput = {
  readonly totalEmployerCost: number;
};

export type NormalizedCashFlowGapProductionOutput = {
  readonly gapDays: number;
  readonly workingCapitalGap: number;
};

export type NormalizedMachineTimeProductionOutput = {
  readonly totalMinutes: number;
  readonly machineCost: number;
};

export type NormalizedCncQuoteRiskProductionOutput = {
  readonly baseCost: number;
};

export type NormalizedBusinessOperationsProductionOutput =
  | NormalizedBreakEvenProductionOutput
  | NormalizedSalaryCostProductionOutput
  | NormalizedCashFlowGapProductionOutput
  | NormalizedMachineTimeProductionOutput
  | NormalizedCncQuoteRiskProductionOutput;

export type NormalizedFinanceProductionOutput =
  | NormalizedLoanProductionOutput
  | NormalizedMortgageProductionOutput
  | NormalizedSimpleInterestProductionOutput
  | NormalizedCompoundInterestProductionOutput
  | NormalizedProfitMarginProductionOutput
  | NormalizedRentVsBuyProductionOutput;

export type ProductionAdapterResult =
  | { readonly status: "ok"; readonly output: NormalizedFinanceProductionOutput | NormalizedBusinessOperationsProductionOutput }
  | { readonly status: "needs_adapter"; readonly reason: string }
  | { readonly status: "error"; readonly reason: string };

function parseCurrency(value: string): number | null {
  const cleaned = value.replace(/[^0-9.\-]/g, "");
  if (!cleaned) {
    return null;
  }
  const parsed = Number(cleaned);
  return Number.isFinite(parsed) ? parsed : null;
}

function parsePercent(value: string): number | null {
  const match = value.match(/-?\d[\d,]*(?:\.\d+)?/);
  if (!match) {
    return null;
  }
  const parsed = Number(match[0].replace(/,/g, ""));
  return Number.isFinite(parsed) ? parsed : null;
}

function findSecondaryValue(
  secondaryValues: readonly { readonly label: string; readonly value: string }[],
  labelIncludes: string,
): string | undefined {
  const entry = secondaryValues.find((item) =>
    item.label.toLowerCase().includes(labelIncludes.toLowerCase()),
  );
  return entry?.value;
}

function adaptLoanProduction(slug: FinanceOracleSlug, values: FreeTrafficInputValues): ProductionAdapterResult {
  const result = calculateFreeTrafficTool(slug, values, "en");
  const monthlyPayment = parseCurrency(result.primaryValue);
  if (monthlyPayment === null) {
    return { status: "needs_adapter", reason: "Could not parse loan payment from primaryValue." };
  }
  return { status: "ok", output: { monthlyPayment } };
}

function adaptMortgageProduction(slug: FinanceOracleSlug, values: FreeTrafficInputValues): ProductionAdapterResult {
  const result = calculateFreeTrafficTool(slug, values, "en");
  const monthlyPayment = parseCurrency(result.primaryValue);
  const totalPaid = parseCurrency(findSecondaryValue(result.secondaryValues, "total paid") ?? "");
  const totalInterest = parseCurrency(findSecondaryValue(result.secondaryValues, "total interest") ?? "");
  if (monthlyPayment === null || totalPaid === null || totalInterest === null) {
    return {
      status: "needs_adapter",
      reason: "Could not parse mortgage payment, total paid, or total interest from production output.",
    };
  }
  return { status: "ok", output: { monthlyPayment, totalPaid, totalInterest } };
}

function adaptSimpleInterestProduction(
  slug: FinanceOracleSlug,
  values: FreeTrafficInputValues,
): ProductionAdapterResult {
  const result = calculateFreeTrafficTool(slug, values, "en");
  const totalRepayment = parseCurrency(result.primaryValue);
  const interestAmount = parseCurrency(findSecondaryValue(result.secondaryValues, "interest") ?? "");
  if (totalRepayment === null || interestAmount === null) {
    return {
      status: "needs_adapter",
      reason: "Could not parse simple interest totals from production output.",
    };
  }
  return { status: "ok", output: { interestAmount, totalRepayment } };
}

function adaptCompoundInterestProduction(
  slug: FinanceOracleSlug,
  values: FreeTrafficInputValues,
): ProductionAdapterResult {
  const result = calculateFreeTrafficTool(slug, values, "en");
  const futureValue = parseCurrency(result.primaryValue);
  const interestEarned = parseCurrency(findSecondaryValue(result.secondaryValues, "interest earned") ?? "");
  if (futureValue === null || interestEarned === null) {
    return {
      status: "needs_adapter",
      reason: "Could not parse compound interest future value from production output.",
    };
  }
  return { status: "ok", output: { futureValue, interestEarned } };
}

function adaptProfitMarginProduction(
  slug: FinanceOracleSlug,
  values: FreeTrafficInputValues,
): ProductionAdapterResult {
  const result = calculateFreeTrafficTool(slug, values, "en");
  const marginPercent = parsePercent(result.primaryValue);
  const markupPercent = parsePercent(findSecondaryValue(result.secondaryValues, "markup") ?? "");
  if (marginPercent === null || markupPercent === null) {
    return {
      status: "needs_adapter",
      reason: "Could not parse margin or markup percent from production output.",
    };
  }
  return { status: "ok", output: { marginPercent, markupPercent } };
}

function adaptRentVsBuyProduction(values: FreeTrafficInputValues): ProductionAdapterResult {
  const result = calculateFreeTrafficTool("rent-vs-buy-calculator", values, "en");
  if (result.primaryValue === "—") {
    return { status: "error", reason: result.explanation };
  }

  const rentNetPosition = parseCurrency(findSecondaryValue(result.secondaryValues, "rent net position") ?? "");
  const buyNetPosition = parseCurrency(findSecondaryValue(result.secondaryValues, "buy net position") ?? "");
  const netDifference = parseCurrency(findSecondaryValue(result.secondaryValues, "net difference") ?? "");
  const totalRentPaid = parseCurrency(findSecondaryValue(result.secondaryValues, "total rent paid") ?? "");
  const investmentValueIfRenting = parseCurrency(
    findSecondaryValue(result.secondaryValues, "investment value if renting") ?? "",
  );
  const monthlyMortgagePayment = parseCurrency(
    findSecondaryValue(result.secondaryValues, "monthly mortgage payment") ?? "",
  );
  const totalMortgagePaid = parseCurrency(findSecondaryValue(result.secondaryValues, "total mortgage paid") ?? "");
  const remainingMortgageBalance = parseCurrency(
    findSecondaryValue(result.secondaryValues, "remaining mortgage balance") ?? "",
  );
  const futureHomeValue = parseCurrency(findSecondaryValue(result.secondaryValues, "future home value") ?? "");
  const estimatedOwnershipCosts = parseCurrency(
    findSecondaryValue(result.secondaryValues, "estimated ownership costs") ?? "",
  );
  const estimatedSellingCosts = parseCurrency(
    findSecondaryValue(result.secondaryValues, "estimated selling costs") ?? "",
  );

  if (
    rentNetPosition === null ||
    buyNetPosition === null ||
    netDifference === null ||
    totalRentPaid === null ||
    investmentValueIfRenting === null ||
    monthlyMortgagePayment === null ||
    totalMortgagePaid === null ||
    remainingMortgageBalance === null ||
    futureHomeValue === null ||
    estimatedOwnershipCosts === null ||
    estimatedSellingCosts === null
  ) {
    return {
      status: "needs_adapter",
      reason: "Could not parse rent vs buy numeric outputs from production result.",
    };
  }

  return {
    status: "ok",
    output: {
      totalRentPaid,
      investmentValueIfRenting,
      monthlyMortgagePayment,
      totalMortgagePaid,
      remainingMortgageBalance,
      futureHomeValue,
      estimatedOwnershipCosts,
      estimatedSellingCosts,
      rentNetPosition,
      buyNetPosition,
      netDifference,
    },
  };
}

export function adaptProductionRentVsBuyOutput(
  values: FreeTrafficInputValues,
): ProductionAdapterResult {
  try {
    return adaptRentVsBuyProduction(values);
  } catch (error) {
    const reason = error instanceof Error ? error.message : String(error);
    return { status: "error", reason };
  }
}

function parsePlainNumber(value: string): number | null {
  const match = value.match(/-?\d[\d,]*(?:\.\d+)?/);
  if (!match) {
    return null;
  }
  const parsed = Number(match[0].replace(/,/g, ""));
  return Number.isFinite(parsed) ? parsed : null;
}

function parseMinutes(value: string): number | null {
  const parsed = parsePlainNumber(value);
  return parsed;
}

function adaptBreakEvenProduction(values: FreeTrafficInputValues): ProductionAdapterResult {
  const result = calculateFreeTrafficTool("break-even-calculator", values, "en");
  if (result.primaryValue === "—") {
    return { status: "error", reason: result.explanation };
  }
  const breakEvenUnits = parsePlainNumber(result.primaryValue);
  const contributionMargin = parsePlainNumber(
    findSecondaryValue(result.secondaryValues, "contribution margin") ?? "",
  );
  if (breakEvenUnits === null || contributionMargin === null) {
    return { status: "needs_adapter", reason: "Could not parse break-even units or contribution margin." };
  }
  return { status: "ok", output: { breakEvenUnits, contributionMargin } };
}

function adaptSalaryCostProduction(values: FreeTrafficInputValues): ProductionAdapterResult {
  const result = calculateFreeTrafficTool("salary-cost-calculator", values, "en");
  const totalEmployerCost = parseCurrency(result.primaryValue);
  if (totalEmployerCost === null) {
    return { status: "needs_adapter", reason: "Could not parse total employer cost." };
  }
  return { status: "ok", output: { totalEmployerCost } };
}

function adaptCashFlowGapProduction(values: FreeTrafficInputValues): ProductionAdapterResult {
  const result = calculateFreeTrafficTool("cash-flow-gap-calculator", values, "en");
  const workingCapitalGap = parseCurrency(result.primaryValue);
  const gapDays = parsePlainNumber(findSecondaryValue(result.secondaryValues, "day difference") ?? "");
  if (workingCapitalGap === null || gapDays === null) {
    return { status: "needs_adapter", reason: "Could not parse working capital gap or day difference." };
  }
  return { status: "ok", output: { gapDays, workingCapitalGap } };
}

function adaptMachineTimeProduction(values: FreeTrafficInputValues): ProductionAdapterResult {
  const result = calculateFreeTrafficTool("machine-time-calculator", values, "en");
  const machineCost = parseCurrency(result.primaryValue);
  const totalMinutes = parseMinutes(findSecondaryValue(result.secondaryValues, "total time") ?? "");
  if (machineCost === null || totalMinutes === null) {
    return { status: "needs_adapter", reason: "Could not parse machine cost or total minutes." };
  }
  return { status: "ok", output: { totalMinutes, machineCost } };
}

function adaptCncQuoteRiskProduction(values: PremiumInputValues): ProductionAdapterResult {
  const report = calculatePremiumDecisionReport("cnc-quote-risk-analyzer", values);
  if (!Number.isFinite(report.baseCost)) {
    return { status: "needs_adapter", reason: "Could not read numeric baseCost from premium report." };
  }
  return { status: "ok", output: { baseCost: report.baseCost } };
}

export function adaptProductionBusinessOperationsOutput(
  slug: BusinessOperationsOracleSlug,
  values: FreeTrafficInputValues | PremiumInputValues,
): ProductionAdapterResult {
  try {
    switch (slug) {
      case "break-even-calculator":
        return adaptBreakEvenProduction(values as FreeTrafficInputValues);
      case "salary-cost-calculator":
        return adaptSalaryCostProduction(values as FreeTrafficInputValues);
      case "cash-flow-gap-calculator":
        return adaptCashFlowGapProduction(values as FreeTrafficInputValues);
      case "machine-time-calculator":
        return adaptMachineTimeProduction(values as FreeTrafficInputValues);
      case "cnc-quote-risk-analyzer":
        return adaptCncQuoteRiskProduction(values as PremiumInputValues);
      default: {
        const unsupported: never = slug;
        return { status: "needs_adapter", reason: `No production adapter for slug "${unsupported}".` };
      }
    }
  } catch (error) {
    const reason = error instanceof Error ? error.message : String(error);
    return { status: "error", reason };
  }
}

export function adaptProductionFinanceOutput(
  slug: FinanceOracleSlug,
  values: FreeTrafficInputValues,
): ProductionAdapterResult {
  try {
    switch (slug) {
      case "loan-payment-calculator":
        return adaptLoanProduction(slug, values);
      case "mortgage-calculator":
        return adaptMortgageProduction(slug, values);
      case "interest-calculator":
        return adaptSimpleInterestProduction(slug, values);
      case "compound-interest-calculator":
        return adaptCompoundInterestProduction(slug, values);
      case "profit-margin-calculator":
        return adaptProfitMarginProduction(slug, values);
      default:
        return { status: "needs_adapter", reason: `No production adapter for slug "${slug}".` };
    }
  } catch (error) {
    const reason = error instanceof Error ? error.message : String(error);
    return { status: "error", reason };
  }
}

export const PRODUCTION_ADAPTER_EXPORTS = {
  parseCurrency,
  parsePercent,
} as const;
