/**
 * Production formula locator — where each finance tool's live calculator runs (Phase 5A).
 */

import type { FinanceOracleSlug } from "@/lib/formula-governance/oracle/finance-oracles";

export type ProductionFormulaLocator = {
  readonly slug: FinanceOracleSlug;
  readonly toolId: string;
  readonly productionFilePath: string;
  readonly productionFunctionName: string;
  readonly productionEntry: string;
  readonly oracleFunctionName: string;
  readonly inputShape: readonly string[];
  readonly productionOutputShape: readonly string[];
  readonly oracleOutputShape: readonly string[];
  readonly comparisonWired: boolean;
};

export const FINANCE_PRODUCTION_FORMULA_LOCATORS: readonly ProductionFormulaLocator[] = [
  {
    slug: "loan-payment-calculator",
    toolId: "free-traffic.loan-payment-calculator",
    productionFilePath: "src/lib/tools/free-traffic-calculators.ts",
    productionFunctionName: "calculateFreeTrafficTool",
    productionEntry: 'CALCULATORS["loan-payment-calculator"] → amortizingPayment',
    oracleFunctionName: "calculateLoanPaymentOracle",
    inputShape: ["principal", "annualRate", "months"],
    productionOutputShape: ["primaryValue: Payment (currency)", "secondary: Principal, Term"],
    oracleOutputShape: ["monthlyPayment"],
    comparisonWired: true,
  },
  {
    slug: "mortgage-calculator",
    toolId: "free-traffic.mortgage-calculator",
    productionFilePath: "src/lib/tools/free-traffic-calculators.ts",
    productionFunctionName: "calculateFreeTrafficTool",
    productionEntry: 'CALCULATORS["mortgage-calculator"] → amortizingPayment + totals',
    oracleFunctionName: "calculateMortgagePaymentOracle",
    inputShape: ["principal", "annualRate", "months"],
    productionOutputShape: [
      "primaryValue: Payment (currency)",
      "secondary: Total paid, Total interest",
    ],
    oracleOutputShape: ["monthlyPayment", "totalPaid", "totalInterest"],
    comparisonWired: true,
  },
  {
    slug: "interest-calculator",
    toolId: "free-traffic.interest-calculator",
    productionFilePath: "src/lib/tools/free-traffic-calculators.ts",
    productionFunctionName: "calculateFreeTrafficTool",
    productionEntry: 'CALCULATORS["interest-calculator"] → simple interest',
    oracleFunctionName: "calculateSimpleInterestOracle",
    inputShape: ["principal", "ratePercent", "years"],
    productionOutputShape: ["primaryValue: Total repayment", "secondary: Interest portion"],
    oracleOutputShape: ["interestAmount", "totalRepayment"],
    comparisonWired: true,
  },
  {
    slug: "compound-interest-calculator",
    toolId: "free-traffic.compound-interest-calculator",
    productionFilePath: "src/lib/tools/free-traffic-calculators.ts",
    productionFunctionName: "calculateFreeTrafficTool",
    productionEntry: 'CALCULATORS["compound-interest-calculator"] → compound FV',
    oracleFunctionName: "calculateCompoundInterestOracle",
    inputShape: ["principal", "annualRate", "years", "compoundsPerYear"],
    productionOutputShape: ["primaryValue: Future value", "secondary: Interest earned"],
    oracleOutputShape: ["futureValue", "interestEarned"],
    comparisonWired: true,
  },
  {
    slug: "profit-margin-calculator",
    toolId: "free-traffic.profit-margin-calculator",
    productionFilePath: "src/lib/tools/free-traffic-calculators.ts",
    productionFunctionName: "calculateFreeTrafficTool",
    productionEntry: 'CALCULATORS["profit-margin-calculator"] → margin % + markup %',
    oracleFunctionName: "calculateProfitMarginOracle",
    inputShape: ["sellingPrice", "cost"],
    productionOutputShape: ["primaryValue: Margin (percent)", "secondary: Markup on cost (percent)"],
    oracleOutputShape: ["marginPercent", "markupPercent"],
    comparisonWired: true,
  },
];

export function getProductionFormulaLocator(
  slug: FinanceOracleSlug,
): ProductionFormulaLocator | undefined {
  return FINANCE_PRODUCTION_FORMULA_LOCATORS.find((entry) => entry.slug === slug);
}
