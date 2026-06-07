/**
 * Production formula locator — where each governed tool's live calculator runs.
 */

import type { FinanceOracleSlug } from "@/lib/formula-governance/oracle/finance-oracles";
import {
  BUSINESS_ORACLE_SLUGS,
  type BusinessOracleSlug,
} from "@/lib/formula-governance/oracle/business-oracles";
import {
  OPERATIONS_ORACLE_SLUGS,
  type OperationsOracleSlug,
} from "@/lib/formula-governance/oracle/operations-oracles";

export type ProductionFormulaLocator = {
  readonly slug: string;
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

export type BusinessOperationsOracleSlug = BusinessOracleSlug | OperationsOracleSlug;

export const BUSINESS_OPERATIONS_ORACLE_SLUGS = [
  ...BUSINESS_ORACLE_SLUGS,
  ...OPERATIONS_ORACLE_SLUGS,
] as const;

export function isBusinessOperationsOracleSlug(slug: string): slug is BusinessOperationsOracleSlug {
  return (BUSINESS_OPERATIONS_ORACLE_SLUGS as readonly string[]).includes(slug);
}

export const BUSINESS_OPERATIONS_PRODUCTION_FORMULA_LOCATORS: readonly ProductionFormulaLocator[] = [
  {
    slug: "break-even-calculator",
    toolId: "free-traffic.break-even-calculator",
    productionFilePath: "src/lib/tools/free-traffic-calculators.ts",
    productionFunctionName: "calculateFreeTrafficTool",
    productionEntry: 'CALCULATORS["break-even-calculator"] → fixed ÷ contribution',
    oracleFunctionName: "calculateBreakEvenOracle",
    inputShape: ["fixedCost", "unitPrice", "variableCost"],
    productionOutputShape: ["primaryValue: Units to break even", "secondary: Contribution margin"],
    oracleOutputShape: ["breakEvenUnits", "contributionMargin"],
    comparisonWired: true,
  },
  {
    slug: "salary-cost-calculator",
    toolId: "free-traffic.salary-cost-calculator",
    productionFilePath: "src/lib/tools/free-traffic-calculators.ts",
    productionFunctionName: "calculateFreeTrafficTool",
    productionEntry: 'CALCULATORS["salary-cost-calculator"] → gross × (1 + burden%)',
    oracleFunctionName: "calculateSalaryCostOracle",
    inputShape: ["grossSalary", "employerRatePercent"],
    productionOutputShape: ["primaryValue: Total cost (currency)", "secondary: Gross salary"],
    oracleOutputShape: ["totalEmployerCost"],
    comparisonWired: true,
  },
  {
    slug: "cash-flow-gap-calculator",
    toolId: "free-traffic.cash-flow-gap-calculator",
    productionFilePath: "src/lib/tools/free-traffic-calculators.ts",
    productionFunctionName: "calculateFreeTrafficTool",
    productionEntry: 'CALCULATORS["cash-flow-gap-calculator"] → gap days × daily cost',
    oracleFunctionName: "calculateCashFlowGapOracle",
    inputShape: ["receivablesDays", "payableDays", "dailyCost"],
    productionOutputShape: ["primaryValue: Working capital gap", "secondary: Day difference"],
    oracleOutputShape: ["gapDays", "workingCapitalGap"],
    comparisonWired: true,
  },
  {
    slug: "machine-time-calculator",
    toolId: "free-traffic.machine-time-calculator",
    productionFilePath: "src/lib/tools/free-traffic-calculators.ts",
    productionFunctionName: "calculateFreeTrafficTool",
    productionEntry: 'CALCULATORS["machine-time-calculator"] → setup + cycle × qty',
    oracleFunctionName: "calculateMachineTimeOracle",
    inputShape: ["setupMinutes", "cycleSeconds", "quantity", "machineRate"],
    productionOutputShape: ["primaryValue: Machine cost", "secondary: Total time (minutes)"],
    oracleOutputShape: ["totalMinutes", "machineCost"],
    comparisonWired: true,
  },
  {
    slug: "cnc-quote-risk-analyzer",
    toolId: "revenue-premium.cnc-quote-risk-analyzer",
    productionFilePath: "src/lib/tools/premium-decision-engine.ts",
    productionFunctionName: "calculatePremiumDecisionReport",
    productionEntry: 'BASE_COST_CALCULATORS["cnc-quote-risk-analyzer"] → calcCnc baseCost',
    oracleFunctionName: "calculateCncQuoteRiskOracle",
    inputShape: [
      "setupTime",
      "cycleTime",
      "quantity",
      "toolCost",
      "materialCost",
      "machineRate",
      "scrapRatePercent",
    ],
    productionOutputShape: ["report.baseCost (numeric)", "minimumSafePriceDisplay (premium layer)"],
    oracleOutputShape: ["baseCost", "machineCost", "machineHours"],
    comparisonWired: true,
  },
];

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

export function getBusinessOperationsProductionFormulaLocator(
  slug: BusinessOperationsOracleSlug,
): ProductionFormulaLocator | undefined {
  return BUSINESS_OPERATIONS_PRODUCTION_FORMULA_LOCATORS.find((entry) => entry.slug === slug);
}

export function getAnyProductionFormulaLocator(slug: string): ProductionFormulaLocator | undefined {
  return (
    getProductionFormulaLocator(slug as FinanceOracleSlug) ??
    getBusinessOperationsProductionFormulaLocator(slug as BusinessOperationsOracleSlug)
  );
}
