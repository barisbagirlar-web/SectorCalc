/**
 * Production formula locator — where each governed tool's live calculator runs.
 */

import type { FinanceOracleSlug } from "@/lib/formula-governance/oracle/finance-oracles";
import {
  BATCH_FREE_ORACLE_SLUGS,
  type BatchFreeOracleSlug,
} from "@/lib/formula-governance/oracle/batch-free-oracles";
import {
  BATCH_PREMIUM_ORACLE_SLUGS,
  type BatchPremiumOracleSlug,
} from "@/lib/formula-governance/oracle/batch-premium-oracles";
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

export const BATCH_FREE_PRODUCTION_FORMULA_LOCATORS: readonly ProductionFormulaLocator[] = [
  {
    slug: "project-cost-calculator",
    toolId: "revenue-free.project-cost-calculator",
    productionFilePath: "src/lib/calculators/project-cost-estimator.ts",
    productionFunctionName: "calculateProjectCostEstimator",
    productionEntry: 'runCalculator("project-cost-estimator") → material + labor + overhead + contingency',
    oracleFunctionName: "calculateProjectCostOracle",
    inputShape: [
      "materialCost",
      "laborHours",
      "laborHourlyRate",
      "equipmentCost",
      "overheadRate",
      "contingencyRate",
    ],
    productionOutputShape: [
      "estimatedProjectCost",
      "laborCost",
      "overheadCost",
      "contingencyCost",
    ],
    oracleOutputShape: [
      "estimatedProjectCost",
      "laborCost",
      "overheadCost",
      "contingencyCost",
    ],
    comparisonWired: true,
  },
  {
    slug: "cleaning-cost-calculator",
    toolId: "revenue-free.cleaning-cost-calculator",
    productionFilePath: "src/lib/calculators/cleaning-cost-estimator.ts",
    productionFunctionName: "calculateCleaningCostEstimator",
    productionEntry: 'runCalculator("cleaning-cost-estimator") → labor + supplies + travel',
    oracleFunctionName: "calculateCleaningCostOracle",
    inputShape: [
      "area",
      "estimatedHours",
      "crewSize",
      "laborHourlyCost",
      "suppliesCost",
      "travelCost",
    ],
    productionOutputShape: ["totalCost", "laborCost", "costPerSqFt"],
    oracleOutputShape: ["totalCost", "laborCost", "costPerSqFt"],
    comparisonWired: true,
  },
  {
    slug: "food-cost-calculator",
    toolId: "free-traffic.food-cost-calculator",
    productionFilePath: "src/lib/tools/free-traffic-calculators.ts",
    productionFunctionName: "calculateFreeTrafficTool",
    productionEntry: 'CALCULATORS["food-cost-calculator"] → ingredient ÷ menu price × 100',
    oracleFunctionName: "calculateFoodCostOracle",
    inputShape: ["ingredientCost", "menuPrice"],
    productionOutputShape: ["primaryValue: Food cost %"],
    oracleOutputShape: ["foodCostPercent"],
    comparisonWired: true,
  },
  {
    slug: "product-margin-calculator",
    toolId: "revenue-free.product-margin-calculator",
    productionFilePath: "src/lib/calculators/product-margin-calculator.ts",
    productionFunctionName: "calculateProductMarginCalculator",
    productionEntry: 'runCalculator("product-margin-calculator") → margin after fees and returns',
    oracleFunctionName: "calculateProductMarginOracle",
    inputShape: [
      "sellingPrice",
      "productCost",
      "shippingCost",
      "platformFeeRate",
      "paymentFeeRate",
      "returnRate",
    ],
    productionOutputShape: ["margin", "grossProfit", "totalCost", "returnImpact"],
    oracleOutputShape: ["margin", "grossProfit", "totalCost", "returnImpact"],
    comparisonWired: true,
  },
  {
    slug: "welding-cost-estimator",
    toolId: "free-traffic.welding-cost-estimator",
    productionFilePath: "src/lib/tools/free-traffic-calculators.ts",
    productionFunctionName: "calculateFreeTrafficTool",
    productionEntry: 'CALCULATORS["welding-cost-estimator"] → material + labor + consumables',
    oracleFunctionName: "calculateWeldingCostOracle",
    inputShape: ["materialCost", "laborHours", "laborRate", "consumablesCost"],
    productionOutputShape: ["primaryValue: Estimated cost", "secondary: Labor"],
    oracleOutputShape: ["estimatedCost", "laborCost"],
    comparisonWired: true,
  },
];

export function getBatchFreeProductionFormulaLocator(
  slug: BatchFreeOracleSlug,
): ProductionFormulaLocator | undefined {
  return BATCH_FREE_PRODUCTION_FORMULA_LOCATORS.find((entry) => entry.slug === slug);
}

export function isBatchFreeProductionSlug(slug: string): slug is BatchFreeOracleSlug {
  return (BATCH_FREE_ORACLE_SLUGS as readonly string[]).includes(slug);
}

export const BATCH_PREMIUM_PRODUCTION_FORMULA_LOCATORS: readonly ProductionFormulaLocator[] = [
  {
    slug: "change-order-impact-analyzer",
    toolId: "revenue-premium.change-order-impact-analyzer",
    productionFilePath: "src/lib/calculators/change-order-impact-analyzer.ts",
    productionFunctionName: "calculateChangeOrderAnalyzer",
    productionEntry:
      'runCalculator("change-order-impact-analyzer") → extra direct cost + minimum safe change price',
    oracleFunctionName: "calculateChangeOrderImpactOracle",
    inputShape: [
      "originalContractValue",
      "originalEstimatedCost",
      "extraLaborHours",
      "laborHourlyRate",
      "extraMaterialCost",
      "extraEquipmentCost",
      "delayDays",
      "dailyOverheadCost",
      "targetChangeMargin",
      "customerOfferedPrice",
    ],
    productionOutputShape: ["extraDirectCost", "minimumSafeChangePrice", "delayCost"],
    oracleOutputShape: ["extraDirectCost", "minimumSafeChangePrice", "delayCost"],
    comparisonWired: true,
  },
  {
    slug: "office-cleaning-bid-optimizer",
    toolId: "revenue-premium.office-cleaning-bid-optimizer",
    productionFilePath: "src/lib/calculators/office-cleaning-bid-optimizer.ts",
    productionFunctionName: "calculateCleaningBidOptimizer",
    productionEntry:
      'runCalculator("office-cleaning-bid-optimizer") → monthly direct cost + minimum safe bid',
    oracleFunctionName: "calculateOfficeCleaningBidOptimizerOracle",
    inputShape: [
      "area",
      "frequencyPerMonth",
      "hoursPerVisit",
      "crewSize",
      "laborHourlyCost",
      "suppliesCostPerVisit",
      "travelCostPerVisit",
      "monthlyOverhead",
      "targetMargin",
      "customerBudget",
    ],
    productionOutputShape: ["monthlyDirectCost", "minimumSafeMonthlyBid"],
    oracleOutputShape: ["monthlyDirectCost", "minimumSafeMonthlyBid"],
    comparisonWired: true,
  },
  {
    slug: "menu-profit-leak-detector",
    toolId: "revenue-premium.menu-profit-leak-detector",
    productionFilePath: "src/lib/calculators/menu-profit-leak-detector.ts",
    productionFunctionName: "calculateMenuProfitLeak",
    productionEntry:
      'runCalculator("menu-profit-leak-detector") → item cost, margin and minimum safe price',
    oracleFunctionName: "calculateMenuProfitLeakDetectorOracle",
    inputShape: [
      "sellingPrice",
      "ingredientCost",
      "wasteRate",
      "packagingCost",
      "laborCostPerItem",
      "deliveryCommissionRate",
      "targetMargin",
      "monthlyUnitsSold",
    ],
    productionOutputShape: ["totalCostPerItem", "actualMargin", "minimumSafePrice"],
    oracleOutputShape: ["totalCostPerItem", "actualMargin", "minimumSafePrice"],
    comparisonWired: true,
  },
  {
    slug: "return-profit-erosion-tool",
    toolId: "revenue-premium.return-profit-erosion-tool",
    productionFilePath: "src/lib/calculators/return-rate-profit-erosion-tool.ts",
    productionFunctionName: "calculateReturnRateErosion",
    productionEntry:
      'runCalculator("return-rate-profit-erosion-tool") → net profit, margin and return impact',
    oracleFunctionName: "calculateReturnProfitErosionOracle",
    inputShape: [
      "sellingPrice",
      "productCost",
      "shippingCost",
      "platformFeeRate",
      "paymentFeeRate",
      "returnRate",
      "returnHandlingCost",
      "adCostPerOrder",
      "targetMargin",
    ],
    productionOutputShape: ["netProfit", "netMargin", "returnImpact"],
    oracleOutputShape: ["netProfit", "netMargin", "returnImpact"],
    comparisonWired: true,
  },
  {
    slug: "welding-bid-risk-analyzer",
    toolId: "revenue-premium.welding-bid-risk-analyzer",
    productionFilePath: "src/lib/tools/premium-decision-engine.ts",
    productionFunctionName: "calculatePremiumDecisionReport",
    productionEntry:
      'BASE_COST_CALCULATORS["welding-bid-risk-analyzer"] → calcWelding + MarginCore floor',
    oracleFunctionName: "calculateWeldingBidRiskOracle",
    inputShape: [
      "materialCost",
      "laborHours",
      "laborRate",
      "gasConsumableCost",
      "fitUpHours",
      "reworkRiskPercent",
      "targetMargin",
    ],
    productionOutputShape: ["baseCost", "p90Cost", "minimumSafePrice"],
    oracleOutputShape: ["baseCost", "p90Cost", "minimumSafePrice"],
    comparisonWired: true,
  },
];

export function getBatchPremiumProductionFormulaLocator(
  slug: BatchPremiumOracleSlug,
): ProductionFormulaLocator | undefined {
  return BATCH_PREMIUM_PRODUCTION_FORMULA_LOCATORS.find((entry) => entry.slug === slug);
}

export function isBatchPremiumProductionSlug(slug: string): slug is BatchPremiumOracleSlug {
  return (BATCH_PREMIUM_ORACLE_SLUGS as readonly string[]).includes(slug);
}

export function getAnyProductionFormulaLocator(slug: string): ProductionFormulaLocator | undefined {
  return (
    getProductionFormulaLocator(slug as FinanceOracleSlug) ??
    getBusinessOperationsProductionFormulaLocator(slug as BusinessOperationsOracleSlug) ??
    getBatchFreeProductionFormulaLocator(slug as BatchFreeOracleSlug) ??
    getBatchPremiumProductionFormulaLocator(slug as BatchPremiumOracleSlug)
  );
}
