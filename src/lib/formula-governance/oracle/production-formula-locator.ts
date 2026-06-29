/**
 * Production formula locator — where each governed tool's live calculator runs.
 */

import type { FinanceOracleSlug } from "@/lib/formula-governance/oracle/finance-oracles";
import {
  BATCH_FREE_ORACLE_SLUGS,
  type BatchFreeOracleSlug,
} from "@/lib/formula-governance/oracle/batch-free-oracles";
import {
  BATCH_FREE_BATCH2_ORACLE_SLUGS,
  type BatchFreeBatch2OracleSlug,
} from "@/lib/formula-governance/oracle/batch-free-batch2-oracles";
import {
  BATCH_PREMIUM_ORACLE_SLUGS,
  type BatchPremiumOracleSlug,
} from "@/lib/formula-governance/oracle/batch-premium-oracles";
import {
  BATCH_PREMIUM_BATCH3_ORACLE_SLUGS,
  type BatchPremiumBatch3OracleSlug,
} from "@/lib/formula-governance/oracle/batch-premium-batch3-oracles";
import {
  BATCH_PREMIUM_SCHEMA_ORACLE_SLUGS,
  type BatchPremiumSchemaOracleSlug,
} from "@/lib/formula-governance/oracle/batch-premium-schema-oracles";
import {
  BUSINESS_ORACLE_SLUGS,
  type BusinessOracleSlug,
} from "@/lib/formula-governance/oracle/business-oracles";
import {
  getBatchTrafficCatalogProductionFormulaLocator,
  isBatchTrafficCatalogProductionSlug,
} from "@/lib/formula-governance/oracle/batch-traffic-catalog-production-locators";
import {
  getRoadmapFreeBatchProductionFormulaLocator,
  isRoadmapFreeBatchProductionSlug,
} from "@/lib/formula-governance/oracle/roadmap-free-batch-production-locators";
import {
  getPremiumSchemaExtendedProductionFormulaLocator,
  isPremiumSchemaExtendedProductionSlug,
} from "@/lib/formula-governance/oracle/premium-schema-extended-production-locators";
import {
  getEngineModulesProductionFormulaLocator,
  isEngineModulesProductionSlug,
} from "@/lib/formula-governance/oracle/engine-modules-production-locators";
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
    slug: "rent-vs-buy-calculator",
    toolId: "free-traffic.rent-vs-buy-calculator",
    productionFilePath: "src/lib/tools/free-traffic-calculators.ts",
    productionFunctionName: "calculateFreeTrafficTool",
    productionEntry: 'CALCULATORS["rent-vs-buy-calculator"] → calculateRentVsBuyComparison',
    oracleFunctionName: "calculateRentVsBuyOracle",
    inputShape: [
      "monthlyRent",
      "homePrice",
      "comparisonYears",
      "annualRentIncrease",
      "annualHomeAppreciation",
      "downPaymentPercent",
      "mortgageInterestRate",
      "mortgageTermYears",
      "investmentReturnRate",
      "ownershipCostPercent",
      "purchaseCostPercent",
      "sellingCostPercent",
    ],
    productionOutputShape: [
      "rentNetPosition",
      "buyNetPosition",
      "netDifference",
      "strongerScenario (narrative)",
    ],
    oracleOutputShape: [
      "rentNetPosition",
      "buyNetPosition",
      "netDifference",
      "strongerScenario",
      "totalRentPaid",
      "futureHomeValue",
    ],
    comparisonWired: true,
  },
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
    productionFilePath: "src/lib/tools/free-tool-results.ts",
    productionFunctionName: "calculateFreeToolResult",
    productionEntry:
      "construction sector → changeOrderWastePercent + adjusted change ratio (RSMeans-style)",
    oracleFunctionName: "calculateProjectChangeOrderFreeOracle",
    inputShape: ["originalBudget", "changeEstimate", "deadlinePressureWastePercent"],
    productionOutputShape: ["adjustedChange", "changeRatioPercent", "wastePercent"],
    oracleOutputShape: ["adjustedChange", "changeRatioPercent", "wastePercent"],
    comparisonWired: true,
  },
  {
    slug: "cleaning-cost-calculator",
    toolId: "revenue-free.cleaning-cost-calculator",
    productionFilePath: "src/lib/tools/sector-formulas-b.ts",
    productionFunctionName: "calculateCleaningFreeResult",
    productionEntry: "calculateCleaningFreeResult → ISSA 2500 sqft/hr productivity benchmark",
    oracleFunctionName: "calculateCleaningIssaFreeOracle",
    inputShape: ["areaSize", "staffCount", "visitFrequency"],
    productionOutputShape: ["monthlyHours", "workloadIndex", "hoursPerVisit"],
    oracleOutputShape: ["monthlyHours", "workloadIndex", "hoursPerVisit"],
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
    productionFilePath: "src/lib/tools/sector-formulas-b.ts",
    productionFunctionName: "calculateEcommerceFreeResult",
    productionEntry:
      "calculateEcommerceFreeResult → calculateProductMarginResult (shipping 0, platform 3%)",
    oracleFunctionName: "calculateProductMarginDtcFreeOracle",
    inputShape: ["productPrice", "productCost", "returnRate"],
    productionOutputShape: ["marginPercent", "grossMargin", "totalCost"],
    oracleOutputShape: ["marginPercent", "grossMargin", "totalCost"],
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

export const BATCH_FREE_BATCH2_PRODUCTION_FORMULA_LOCATORS: readonly ProductionFormulaLocator[] = [
  {
    slug: "sample-size-calculator",
    toolId: "free-traffic.sample-size-calculator",
    productionFilePath: "src/lib/tools/free-traffic-calculators.ts",
    productionFunctionName: "calculateFreeTrafficTool",
    productionEntry: 'CALCULATORS["sample-size-calculator"] → Cochran sample size',
    oracleFunctionName: "calculateSampleSizeOracle",
    inputShape: ["population", "confidenceZ", "marginErrorPercent", "proportionPercent"],
    productionOutputShape: ["primaryValue: Required sample", "secondary: Infinite population estimate"],
    oracleOutputShape: ["requiredSample", "infinitePopulationEstimate"],
    comparisonWired: true,
  },
  {
    slug: "hvac-tonnage-rule-check",
    toolId: "revenue-free.hvac-tonnage-rule-check",
    productionFilePath: "src/lib/tools/free-sector-calculations.ts",
    productionFunctionName: "calculateHvacFreeResult",
    productionEntry: "calculateHvacFreeResult → calculateHvacTonnageResult (ASHRAE defaults)",
    oracleFunctionName: "calculateHvacTonnageRuleOracle",
    inputShape: ["squareFootage", "tonnage", "laborHours"],
    productionOutputShape: ["totalBtu", "totalTons", "recommendedTons"],
    oracleOutputShape: ["totalBtu", "totalTons", "recommendedTons"],
    comparisonWired: true,
  },
  {
    slug: "electrical-labor-estimator",
    toolId: "revenue-free.electrical-labor-estimator",
    productionFilePath: "src/lib/tools/free-sector-calculations.ts",
    productionFunctionName: "calculateElectricalFreeResult",
    productionEntry: "calculateElectricalFreeResult → labor/material ratio",
    oracleFunctionName: "calculateElectricalLaborOracle",
    inputShape: ["materialCost", "laborHours", "laborRate"],
    productionOutputShape: ["laborCost", "laborMaterialRatio"],
    oracleOutputShape: ["laborCost", "laborMaterialRatio"],
    comparisonWired: true,
  },
  {
    slug: "lawn-care-cost-check",
    toolId: "revenue-free.lawn-care-cost-check",
    productionFilePath: "src/lib/tools/free-sector-calculations.ts",
    productionFunctionName: "calculateLandscapingFreeResult",
    productionEntry: "calculateLandscapingFreeResult → monthly crew-hour load",
    oracleFunctionName: "calculateLawnCareCostOracle",
    inputShape: ["crewHoursPerVisit", "visitsPerMonth", "laborRate"],
    productionOutputShape: ["monthlyLoad"],
    oracleOutputShape: ["monthlyLoad", "monthlyLaborCost"],
    comparisonWired: true,
  },
  {
    slug: "repair-time-vs-price-check",
    toolId: "revenue-free.repair-time-vs-price-check",
    productionFilePath: "src/lib/tools/free-sector-calculations.ts",
    productionFunctionName: "calculateAutoRepairFreeResult",
    productionEntry: "calculateAutoRepairFreeResult → Mitchell burdened cost",
    oracleFunctionName: "calculateRepairTimeVsPriceOracle",
    inputShape: ["quotedPrice", "repairHours", "partsCost"],
    productionOutputShape: ["burdenedCost", "mitchellTotalHours"],
    oracleOutputShape: ["burdenedCost", "mitchellTotalHours"],
    comparisonWired: true,
  },
  {
    slug: "print-job-cost-check",
    toolId: "revenue-free.print-job-cost-check",
    productionFilePath: "src/lib/tools/free-sector-calculations.ts",
    productionFunctionName: "calculatePrintingFreeResult",
    productionEntry: "calculatePrintingFreeResult → design/material ratio",
    oracleFunctionName: "calculatePrintJobCostOracle",
    inputShape: ["materialCost", "designHours", "laborRate"],
    productionOutputShape: ["designCost", "designMaterialRatio"],
    oracleOutputShape: ["designCost", "designMaterialRatio"],
    comparisonWired: true,
  },
  {
    slug: "plumbing-job-margin-verdict",
    toolId: "revenue-premium.plumbing-job-margin-verdict",
    productionFilePath: "src/lib/tools/premium-decision-engine.ts",
    productionFunctionName: "calculatePremiumDecisionReport",
    productionEntry: 'BASE_COST_CALCULATORS["plumbing-job-margin-verdict"] → calcPlumbing',
    oracleFunctionName: "calculatePlumbingJobMarginOracle",
    inputShape: [
      "partsCost",
      "laborHours",
      "laborRate",
      "fixtureCount",
      "materialRunCost",
      "callbackRiskPercent",
      "targetMargin",
    ],
    productionOutputShape: ["baseCost", "p90Cost", "minimumSafePrice"],
    oracleOutputShape: ["baseCost", "p90Cost", "minimumSafePrice"],
    comparisonWired: true,
  },
  {
    slug: "cabinet-cost-estimator",
    toolId: "revenue-free.cabinet-cost-estimator",
    productionFilePath: "src/lib/tools/free-sector-calculations.ts",
    productionFunctionName: "calculateCarpentryFreeResult",
    productionEntry: "calculateCarpentryFreeResult → WWPA waste-adjusted hours",
    oracleFunctionName: "calculateCabinetCostOracle",
    inputShape: ["sheetMaterialCost", "laborHours", "installHours"],
    productionOutputShape: ["totalHours", "wasteAdjustedHours"],
    oracleOutputShape: ["totalHours", "wasteAdjustedHours"],
    comparisonWired: true,
  },
  {
    slug: "roofing-square-cost-check",
    toolId: "revenue-free.roofing-square-cost-check",
    productionFilePath: "src/lib/tools/free-sector-calculations.ts",
    productionFunctionName: "calculateRoofingFreeResult",
    productionEntry: "calculateRoofingFreeResult → NRCA estimate + labor cost",
    oracleFunctionName: "calculateRoofingSquareCostOracle",
    inputShape: ["materialCost", "laborHours", "laborRate"],
    productionOutputShape: ["laborCost", "nrcaEstimate"],
    oracleOutputShape: ["laborCost", "nrcaEstimate"],
    comparisonWired: true,
  },
  {
    slug: "laser-cutting-time-check",
    toolId: "free-traffic.laser-cutting-time-check",
    productionFilePath: "src/lib/tools/free-traffic-calculators.ts",
    productionFunctionName: "calculateFreeTrafficTool",
    productionEntry: 'CALCULATORS["laser-cutting-time-check"] → setup + cut + pierce minutes',
    oracleFunctionName: "calculateLaserCuttingTimeOracle",
    inputShape: ["setupMinutes", "cutLengthM", "cutSpeedMMin", "pierceCount", "pierceSeconds"],
    productionOutputShape: ["primaryValue: Total minutes", "secondary: Cut path time"],
    oracleOutputShape: ["totalMinutes", "cutMinutes"],
    comparisonWired: true,
  },
];

export const P77_BATCH_B_PRODUCTION_FORMULA_LOCATORS: readonly ProductionFormulaLocator[] = [
  {
    slug: "kwh-consumption-check",
    toolId: "free-traffic.kwh-consumption-check",
    productionFilePath: "src/lib/tools/p77-batch-b-free-calculators.ts",
    productionFunctionName: "calculateKwhConsumptionCheck",
    productionEntry: "dailyKwh = powerKw × hoursPerDay; periodKwh = dailyKwh × days; energyCost = periodKwh × tariffPerKwh",
    oracleFunctionName: "calculateKwhConsumptionCheck",
    inputShape: ["powerKw", "hoursPerDay", "days", "tariffPerKwh"],
    productionOutputShape: ["dailyKwh", "periodKwh", "energyCost", "recommendedPrice"],
    oracleOutputShape: ["dailyKwh", "periodKwh", "energyCost", "recommendedPrice"],
    comparisonWired: true,
  },
  {
    slug: "paint-coverage-cost-check",
    toolId: "free-traffic.paint-coverage-cost-check",
    productionFilePath: "src/lib/tools/p77-batch-b-free-calculators.ts",
    productionFunctionName: "calculatePaintCoverageCostCheck",
    productionEntry: "requiredUnits = ceil(netArea/coverage + waste); paintCost = requiredUnits × unitPrice",
    oracleFunctionName: "calculatePaintCoverageCostCheck",
    inputShape: ["paintableArea", "coveragePerUnit", "coats", "unitPrice", "wasteAllowancePct"],
    productionOutputShape: ["requiredUnits", "paintCost", "recommendedPrice"],
    oracleOutputShape: ["requiredUnits", "paintCost", "recommendedPrice"],
    comparisonWired: true,
  },
  {
    slug: "plumbing-fixture-cost-check",
    toolId: "free-traffic.plumbing-fixture-cost-check",
    productionFilePath: "src/lib/tools/p77-batch-b-free-calculators.ts",
    productionFunctionName: "calculatePlumbingFixtureCostCheck",
    productionEntry: "totalCost = (material + labor) × (1 + overheadPct/100)",
    oracleFunctionName: "calculatePlumbingFixtureCostCheck",
    inputShape: ["fixtureCount", "unitMaterialCost", "laborHoursPerFixture", "laborRate", "overheadPct"],
    productionOutputShape: ["materialCost", "laborCost", "totalCost", "recommendedPrice"],
    oracleOutputShape: ["materialCost", "laborCost", "totalCost", "recommendedPrice"],
    comparisonWired: true,
  },
  {
    slug: "home-renovation-m2",
    toolId: "free-traffic.home-renovation-m2",
    productionFilePath: "src/lib/tools/p77-batch-b-free-calculators.ts",
    productionFunctionName: "calculateHomeRenovationM2Check",
    productionEntry: "totalEstimatedCost = (areaM2 × unitCostPerM2 + demolition) × (1 + contingencyPct/100)",
    oracleFunctionName: "calculateHomeRenovationM2Check",
    inputShape: ["areaM2", "unitCostPerM2", "demolitionCost", "contingencyPct"],
    productionOutputShape: ["baseCost", "totalEstimatedCost", "recommendedPrice"],
    oracleOutputShape: ["baseCost", "totalEstimatedCost", "recommendedPrice"],
    comparisonWired: true,
  },
];

export function getP77BatchBProductionFormulaLocator(slug: string): ProductionFormulaLocator | undefined {
  return P77_BATCH_B_PRODUCTION_FORMULA_LOCATORS.find((entry) => entry.slug === slug);
}

export function isP77BatchBProductionSlug(slug: string): boolean {
  return P77_BATCH_B_PRODUCTION_FORMULA_LOCATORS.some((entry) => entry.slug === slug);
}

export const BATCH_PREMIUM_BATCH3_PRODUCTION_FORMULA_LOCATORS: readonly ProductionFormulaLocator[] = [
  {
    slug: "hvac-project-margin-guard",
    toolId: "revenue-premium.hvac-project-margin-guard",
    productionFilePath: "src/lib/tools/premium-decision-engine.ts",
    productionFunctionName: "calculatePremiumDecisionReport",
    productionEntry: 'BASE_COST_CALCULATORS["hvac-project-margin-guard"] → calcHvac + MarginCore',
    oracleFunctionName: "calculateHvacProjectMarginGuardOracle",
    inputShape: [
      "equipmentCost",
      "ductworkCost",
      "laborHours",
      "laborRate",
      "commissioningCost",
      "callbackRiskPercent",
      "targetMargin",
    ],
    productionOutputShape: ["baseCost", "p90Cost", "minimumSafePrice"],
    oracleOutputShape: ["baseCost", "p90Cost", "minimumSafePrice"],
    comparisonWired: true,
  },
  {
    slug: "panel-shop-margin-verdict",
    toolId: "revenue-premium.panel-shop-margin-verdict",
    productionFilePath: "src/lib/tools/premium-decision-engine.ts",
    productionFunctionName: "calculatePremiumDecisionReport",
    productionEntry: 'BASE_COST_CALCULATORS["panel-shop-margin-verdict"] → calcElectrical + MarginCore',
    oracleFunctionName: "calculatePanelShopMarginVerdictOracle",
    inputShape: [
      "materialCost",
      "laborHours",
      "laborRate",
      "testingHours",
      "inspectionRiskPercent",
      "targetMargin",
    ],
    productionOutputShape: ["baseCost", "p90Cost", "minimumSafePrice"],
    oracleOutputShape: ["baseCost", "p90Cost", "minimumSafePrice"],
    comparisonWired: true,
  },
  {
    slug: "landscaping-contract-profit-tool",
    toolId: "revenue-premium.landscaping-contract-profit-tool",
    productionFilePath: "src/lib/tools/premium-decision-engine.ts",
    productionFunctionName: "calculatePremiumDecisionReport",
    productionEntry:
      'BASE_COST_CALCULATORS["landscaping-contract-profit-tool"] → calcLandscaping + MarginCore',
    oracleFunctionName: "calculateLandscapingContractProfitOracle",
    inputShape: [
      "crewHoursPerVisit",
      "laborRate",
      "fuelCostPerVisit",
      "supplyCostPerMonth",
      "visitsPerMonth",
      "equipmentWearCost",
      "targetMargin",
    ],
    productionOutputShape: ["baseCost", "p90Cost", "minimumSafePrice"],
    oracleOutputShape: ["baseCost", "p90Cost", "minimumSafePrice"],
    comparisonWired: true,
  },
  {
    slug: "auto-shop-margin-leak-detector",
    toolId: "revenue-premium.auto-shop-margin-leak-detector",
    productionFilePath: "src/lib/tools/premium-decision-engine.ts",
    productionFunctionName: "calculatePremiumDecisionReport",
    productionEntry:
      'BASE_COST_CALCULATORS["auto-shop-margin-leak-detector"] → calcAutoShop + MarginCore',
    oracleFunctionName: "calculateAutoShopMarginLeakOracle",
    inputShape: [
      "quotedPrice",
      "diagnosticHours",
      "repairHours",
      "laborRate",
      "partsCost",
      "comebackRiskPercent",
      "partsMarkupPercent",
    ],
    productionOutputShape: ["baseCost", "p90Cost", "minimumSafePrice"],
    oracleOutputShape: ["baseCost", "p90Cost", "minimumSafePrice"],
    comparisonWired: true,
  },
  {
    slug: "signage-bid-safe-price-tool",
    toolId: "revenue-premium.signage-bid-safe-price-tool",
    productionFilePath: "src/lib/tools/premium-decision-engine.ts",
    productionFunctionName: "calculatePremiumDecisionReport",
    productionEntry: 'BASE_COST_CALCULATORS["signage-bid-safe-price-tool"] → calcSignage + MarginCore',
    oracleFunctionName: "calculateSignageBidSafePriceOracle",
    inputShape: [
      "materialCost",
      "inkCost",
      "designHours",
      "laborRate",
      "installHours",
      "reprintRiskPercent",
      "targetMargin",
    ],
    productionOutputShape: ["baseCost", "p90Cost", "minimumSafePrice"],
    oracleOutputShape: ["baseCost", "p90Cost", "minimumSafePrice"],
    comparisonWired: true,
  },
  {
    slug: "millwork-bid-risk-analyzer",
    toolId: "revenue-premium.millwork-bid-risk-analyzer",
    productionFilePath: "src/lib/tools/premium-decision-engine.ts",
    productionFunctionName: "calculatePremiumDecisionReport",
    productionEntry: 'BASE_COST_CALCULATORS["millwork-bid-risk-analyzer"] → calcMillwork + MarginCore',
    oracleFunctionName: "calculateMillworkBidRiskOracle",
    inputShape: [
      "sheetMaterialCost",
      "laborHours",
      "laborRate",
      "finishingCost",
      "installHours",
      "wasteRatePercent",
      "targetMargin",
    ],
    productionOutputShape: ["baseCost", "p90Cost", "minimumSafePrice"],
    oracleOutputShape: ["baseCost", "p90Cost", "minimumSafePrice"],
    comparisonWired: true,
  },
  {
    slug: "roofing-contract-margin-guard",
    toolId: "revenue-premium.roofing-contract-margin-guard",
    productionFilePath: "src/lib/tools/premium-decision-engine.ts",
    productionFunctionName: "calculatePremiumDecisionReport",
    productionEntry:
      'BASE_COST_CALCULATORS["roofing-contract-margin-guard"] → calcRoofing + MarginCore',
    oracleFunctionName: "calculateRoofingContractMarginGuardOracle",
    inputShape: [
      "materialCost",
      "laborHours",
      "laborRate",
      "tearOffCost",
      "dumpFees",
      "weatherDelayRiskPercent",
      "targetMargin",
    ],
    productionOutputShape: ["baseCost", "p90Cost", "minimumSafePrice"],
    oracleOutputShape: ["baseCost", "p90Cost", "minimumSafePrice"],
    comparisonWired: true,
  },
  {
    slug: "painting-job-profit-verdict",
    toolId: "revenue-premium.painting-job-profit-verdict",
    productionFilePath: "src/lib/tools/premium-decision-engine.ts",
    productionFunctionName: "calculatePremiumDecisionReport",
    productionEntry:
      'BASE_COST_CALCULATORS["painting-job-profit-verdict"] → calcPainting + MarginCore',
    oracleFunctionName: "calculatePaintingJobProfitVerdictOracle",
    inputShape: [
      "paintCost",
      "prepHours",
      "laborRate",
      "scaffoldCost",
      "touchUpRiskPercent",
      "areaSize",
      "targetMargin",
    ],
    productionOutputShape: ["baseCost", "p90Cost", "minimumSafePrice"],
    oracleOutputShape: ["baseCost", "p90Cost", "minimumSafePrice"],
    comparisonWired: true,
  },
  {
    slug: "sheet-metal-quote-risk-tool",
    toolId: "revenue-premium.sheet-metal-quote-risk-tool",
    productionFilePath: "src/lib/tools/premium-decision-engine.ts",
    productionFunctionName: "calculatePremiumDecisionReport",
    productionEntry:
      'BASE_COST_CALCULATORS["sheet-metal-quote-risk-tool"] → calcSheetMetal + MarginCore',
    oracleFunctionName: "calculateSheetMetalQuoteRiskOracle",
    inputShape: [
      "programmingTime",
      "setupTime",
      "cutTime",
      "bendCount",
      "laborRate",
      "materialCost",
      "scrapRatePercent",
      "finishingCost",
      "targetMargin",
    ],
    productionOutputShape: ["baseCost", "p90Cost", "minimumSafePrice"],
    oracleOutputShape: ["baseCost", "p90Cost", "minimumSafePrice"],
    comparisonWired: true,
  },
  {
    slug: "3d-print-cost-check",
    toolId: "free-traffic.3d-print-cost-check",
    productionFilePath: "src/lib/tools/free-traffic-calculators.ts",
    productionFunctionName: "calculateFreeTrafficTool",
    productionEntry:
      'CALCULATORS["3d-print-cost-check"] → material + printHours×machineRate + postProcess×laborRate',
    oracleFunctionName: "calculate3dPrintCostOracle",
    inputShape: ["materialCost", "printHours", "machineRate", "postProcessHours", "laborRate"],
    productionOutputShape: ["primaryValue: Estimated cost", "secondary: Machine time cost"],
    oracleOutputShape: ["estimatedCost", "machineTimeCost"],
    comparisonWired: true,
  },
];

export function getBatchPremiumBatch3ProductionFormulaLocator(
  slug: BatchPremiumBatch3OracleSlug,
): ProductionFormulaLocator | undefined {
  return BATCH_PREMIUM_BATCH3_PRODUCTION_FORMULA_LOCATORS.find((entry) => entry.slug === slug);
}

export function isBatchPremiumBatch3ProductionSlug(slug: string): slug is BatchPremiumBatch3OracleSlug {
  return (BATCH_PREMIUM_BATCH3_ORACLE_SLUGS as readonly string[]).includes(slug);
}

const PREMIUM_SCHEMA_ORACLE_FN: Record<BatchPremiumSchemaOracleSlug, string> = {
  "route-optimization-analyzer": "calculateRouteOptimizationAnalyzerOracle",
  "energy-efficiency-report": "calculateEnergyEfficiencyReportOracle",
  "meal-planning-verdict": "calculateMealPlanningVerdictOracle",
  "trip-budget-optimizer": "calculateTripBudgetOptimizerOracle",
  "cbam-compliance-verdict": "calculateCbamComplianceVerdictOracle",
  "crop-yield-loss-analyzer": "calculateCropYieldLossAnalyzerOracle",
  "feed-efficiency-analyzer": "calculateFeedEfficiencyAnalyzerOracle",
  "dairy-profit-detector": "calculateDairyProfitDetectorOracle",
  "water-optimization-verdict": "calculateWaterOptimizationVerdictOracle",
  "renovation-budget-optimizer": "calculateRenovationBudgetOptimizerOracle",
  "3d-print-job-margin-tool": "calculate3dPrintJobMarginToolOracle",
};

export const BATCH_PREMIUM_SCHEMA_PRODUCTION_FORMULA_LOCATORS: readonly ProductionFormulaLocator[] =
  BATCH_PREMIUM_SCHEMA_ORACLE_SLUGS.map((slug) => ({
    slug,
    toolId: `revenue-premium.${slug}`,
    productionFilePath: "src/lib/tools/premium-decision-engine.ts",
    productionFunctionName: "calculatePremiumDecisionReport",
    productionEntry: `BASE_COST_CALCULATORS["${slug}"] + MarginCore`,
    oracleFunctionName: PREMIUM_SCHEMA_ORACLE_FN[slug],
    inputShape: ["paid revenue inputs per slug"],
    productionOutputShape: ["baseCost", "p90Cost", "minimumSafePrice"],
    oracleOutputShape: ["baseCost", "p90Cost", "minimumSafePrice"],
    comparisonWired: true,
  }));

export function getBatchPremiumSchemaProductionFormulaLocator(
  slug: BatchPremiumSchemaOracleSlug,
): ProductionFormulaLocator | undefined {
  return BATCH_PREMIUM_SCHEMA_PRODUCTION_FORMULA_LOCATORS.find((entry) => entry.slug === slug);
}

export function isBatchPremiumSchemaProductionSlug(slug: string): slug is BatchPremiumSchemaOracleSlug {
  return (BATCH_PREMIUM_SCHEMA_ORACLE_SLUGS as readonly string[]).includes(slug);
}

export function getBatchFreeBatch2ProductionFormulaLocator(
  slug: BatchFreeBatch2OracleSlug,
): ProductionFormulaLocator | undefined {
  return BATCH_FREE_BATCH2_PRODUCTION_FORMULA_LOCATORS.find((entry) => entry.slug === slug);
}

export function isBatchFreeBatch2ProductionSlug(slug: string): slug is BatchFreeBatch2OracleSlug {
  return (BATCH_FREE_BATCH2_ORACLE_SLUGS as readonly string[]).includes(slug);
}

export function getAnyProductionFormulaLocator(slug: string): ProductionFormulaLocator | undefined {
  return (
    getProductionFormulaLocator(slug as FinanceOracleSlug) ??
    getBusinessOperationsProductionFormulaLocator(slug as BusinessOperationsOracleSlug) ??
    getBatchFreeProductionFormulaLocator(slug as BatchFreeOracleSlug) ??
    getBatchPremiumProductionFormulaLocator(slug as BatchPremiumOracleSlug) ??
    getBatchFreeBatch2ProductionFormulaLocator(slug as BatchFreeBatch2OracleSlug) ??
    getP77BatchBProductionFormulaLocator(slug) ??
    getBatchPremiumBatch3ProductionFormulaLocator(slug as BatchPremiumBatch3OracleSlug) ??
    getBatchPremiumSchemaProductionFormulaLocator(slug as BatchPremiumSchemaOracleSlug) ??
    (isBatchTrafficCatalogProductionSlug(slug)
      ? getBatchTrafficCatalogProductionFormulaLocator(slug)
      : undefined) ??
    (isRoadmapFreeBatchProductionSlug(slug)
      ? getRoadmapFreeBatchProductionFormulaLocator(slug)
      : undefined) ??
    (isPremiumSchemaExtendedProductionSlug(slug)
      ? getPremiumSchemaExtendedProductionFormulaLocator(slug)
      : undefined) ??
    (isEngineModulesProductionSlug(slug)
      ? getEngineModulesProductionFormulaLocator(slug)
      : undefined)
  );
}
