/**
 * Production output adapters — normalize calculator UI output for oracle comparison (Phase 5A).
 */

import type { FreeTrafficInputValues } from "@/lib/tools/free-traffic-calculators";
import { calculateFreeTrafficTool } from "@/lib/tools/free-traffic-calculators";
import type { FinanceOracleSlug } from "@/lib/formula-governance/oracle/finance-oracles";

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

export type NormalizedFinanceProductionOutput =
  | NormalizedLoanProductionOutput
  | NormalizedMortgageProductionOutput
  | NormalizedSimpleInterestProductionOutput
  | NormalizedCompoundInterestProductionOutput
  | NormalizedProfitMarginProductionOutput;

export type ProductionAdapterResult =
  | { readonly status: "ok"; readonly output: NormalizedFinanceProductionOutput }
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
