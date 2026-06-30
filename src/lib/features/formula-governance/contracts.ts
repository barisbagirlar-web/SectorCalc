/**
 * Formula contract registry — no contract, no launch.
 */

import type { FormulaContract } from "@/lib/features/formula-governance/types";
import {
  GOVERNANCE_RECOMMENDED_PRICE_DIFFERENCE_TARGET_NOTE,
  freeTrafficProductionAssumption,
  scenarioRuntimeTests,
} from "@/lib/features/formula-governance/contracts/shared";
import { TOP_CRITICAL_FORMULA_CONTRACTS } from "@/lib/features/formula-governance/contracts/top-critical";
import { BATCH_EXPANSION_CRITICAL_FORMULA_CONTRACTS } from "@/lib/features/formula-governance/contracts/batch-expansion-critical";
import { BATCH_TRAFFIC_CATALOG_CRITICAL_FORMULA_CONTRACTS } from "@/lib/features/formula-governance/contracts/batch-traffic-catalog-critical";
import { BATCH_PREMIUM_SCHEMA_CRITICAL_FORMULA_CONTRACTS } from "@/lib/features/formula-governance/contracts/batch-premium-schema-critical";
import { PREMIUM_SCHEMA_EXTENDED_CRITICAL_FORMULA_CONTRACTS } from "@/lib/features/formula-governance/contracts/premium-schema-extended-critical";
import { SEVEN_MUDA_WASTE_COST_CRITICAL_FORMULA_CONTRACTS } from "@/lib/features/formula-governance/contracts/seven-muda-waste-cost-critical";
import { AGRICULTURE_IRRIGATION_YIELD_LOSS_CRITICAL_FORMULA_CONTRACTS } from "@/lib/features/formula-governance/contracts/agriculture-irrigation-yield-loss-critical";
import { ENERGY_COMPRESSOR_LEAK_COST_CRITICAL_FORMULA_CONTRACTS } from "@/lib/features/formula-governance/contracts/energy-compressor-leak-cost-critical";
import { CNC_TOOL_WEAR_COST_CRITICAL_FORMULA_CONTRACTS } from "@/lib/features/formula-governance/contracts/cnc-tool-wear-cost-critical";
import { DAIRY_FEED_EFFICIENCY_LOSS_CRITICAL_FORMULA_CONTRACTS } from "@/lib/features/formula-governance/contracts/dairy-feed-efficiency-loss-critical";
import { CONSTRUCTION_PROJECT_OVERRUN_CRITICAL_FORMULA_CONTRACTS } from "@/lib/features/formula-governance/contracts/construction-project-overrun-critical";
import { CONSTRUCTION_SUBCONTRACTOR_MARGIN_LEAK_CRITICAL_FORMULA_CONTRACTS } from "@/lib/features/formula-governance/contracts/construction-subcontractor-margin-leak-critical";
import { PAINTING_REWORK_COVERAGE_RISK_CRITICAL_FORMULA_CONTRACTS } from "@/lib/features/formula-governance/contracts/painting-rework-coverage-risk-critical";
import { FOOD_WASTE_MARGIN_LOSS_CRITICAL_FORMULA_CONTRACTS } from "@/lib/features/formula-governance/contracts/food-waste-margin-loss-critical";
import { HVAC_CALLBACK_MARGIN_RISK_CRITICAL_FORMULA_CONTRACTS } from "@/lib/features/formula-governance/contracts/hvac-callback-margin-risk-critical";
import { RESTAURANT_MENU_MARGIN_LEAK_CRITICAL_FORMULA_CONTRACTS } from "@/lib/features/formula-governance/contracts/restaurant-menu-margin-leak-critical";
import { WAREHOUSE_SPACE_COST_LEAK_CRITICAL_FORMULA_CONTRACTS } from "@/lib/features/formula-governance/contracts/warehouse-space-cost-leak-critical";
import { SHEET_METAL_SCRAP_RISK_CRITICAL_FORMULA_CONTRACTS } from "@/lib/features/formula-governance/contracts/sheet-metal-scrap-risk-critical";
import { PRINTING_REPRINT_MARGIN_LEAK_CRITICAL_FORMULA_CONTRACTS } from "@/lib/features/formula-governance/contracts/printing-reprint-margin-leak-critical";
import { COMPRESSOR_LEAK_COST_CALCULATOR_CRITICAL_FORMULA_CONTRACTS } from "@/lib/features/formula-governance/contracts/compressor-leak-cost-calculator-critical";
import { DOWNTIME_MINUTE_COST_CALCULATOR_CRITICAL_FORMULA_CONTRACTS } from "@/lib/features/formula-governance/contracts/downtime-minute-cost-calculator-critical";
import { ENERGY_PEAK_COST_CRITICAL_FORMULA_CONTRACTS } from "@/lib/features/formula-governance/contracts/energy-peak-cost-critical";
import { ENERGY_SAVINGS_PACKAGE_CALCULATOR_CRITICAL_FORMULA_CONTRACTS } from "@/lib/features/formula-governance/contracts/energy-savings-package-calculator-critical";
import { INVENTORY_CARRYING_COST_EOQ_CALCULATOR_CRITICAL_FORMULA_CONTRACTS } from "@/lib/features/formula-governance/contracts/inventory-carrying-cost-eoq-calculator-critical";
import { LOGISTICS_FUEL_ROUTE_DRIFT_CRITICAL_FORMULA_CONTRACTS } from "@/lib/features/formula-governance/contracts/logistics-fuel-route-drift-critical";
import { LOGISTICS_ROUTE_LOSS_CRITICAL_FORMULA_CONTRACTS } from "@/lib/features/formula-governance/contracts/logistics-route-loss-critical";
import { PLUMBING_LEAK_CALLBACK_COST_CRITICAL_FORMULA_CONTRACTS } from "@/lib/features/formula-governance/contracts/plumbing-leak-callback-cost-critical";
import { PRODUCT_CUSTOMER_PROFITABILITY_CALCULATOR_CRITICAL_FORMULA_CONTRACTS } from "@/lib/features/formula-governance/contracts/product-customer-profitability-calculator-critical";
import { RETAIL_INVENTORY_TURNOVER_RISK_CRITICAL_FORMULA_CONTRACTS } from "@/lib/features/formula-governance/contracts/retail-inventory-turnover-risk-critical";
import { ROOFING_WEATHER_DELAY_RISK_CRITICAL_FORMULA_CONTRACTS } from "@/lib/features/formula-governance/contracts/roofing-weather-delay-risk-critical";
import { TEXTILE_FABRIC_WASTE_RISK_CRITICAL_FORMULA_CONTRACTS } from "@/lib/features/formula-governance/contracts/textile-fabric-waste-risk-critical";
import { VALUE_STREAM_MAP_VSM_CALCULATOR_CRITICAL_FORMULA_CONTRACTS } from "@/lib/features/formula-governance/contracts/value-stream-map-vsm-calculator-critical";
import { ANNUAL_LEAVE_SEVERANCE_NOTICE_CALCULATOR_CRITICAL_FORMULA_CONTRACTS } from "@/lib/features/formula-governance/contracts/annual-leave-severance-notice-calculator-critical";
import { BELT_PULLEY_SPEED_LENGTH_CALCULATOR_CRITICAL_FORMULA_CONTRACTS } from "@/lib/features/formula-governance/contracts/belt-pulley-speed-length-calculator-critical";
import { BOLT_TIGHTENING_TORQUE_CALCULATOR_CRITICAL_FORMULA_CONTRACTS } from "@/lib/features/formula-governance/contracts/bolt-tightening-torque-calculator-critical";
import { CNC_OEE_LOSS_CRITICAL_FORMULA_CONTRACTS } from "@/lib/features/formula-governance/contracts/cnc-oee-loss-critical";
import { EMPLOYEE_TOTAL_COST_CALCULATOR_CRITICAL_FORMULA_CONTRACTS } from "@/lib/features/formula-governance/contracts/employee-total-cost-calculator-critical";
import { FIRE_SYSTEM_FLOW_HYDRANT_CALCULATOR_CRITICAL_FORMULA_CONTRACTS } from "@/lib/features/formula-governance/contracts/fire-system-flow-hydrant-calculator-critical";
import { HYDRAULIC_PNEUMATIC_CYLINDER_FORCE_CALCULATOR_CRITICAL_FORMULA_CONTRACTS } from "@/lib/features/formula-governance/contracts/hydraulic-pneumatic-cylinder-force-calculator-critical";
import { INVESTMENT_PAYBACK_NPV_CALCULATOR_CRITICAL_FORMULA_CONTRACTS } from "@/lib/features/formula-governance/contracts/investment-payback-npv-calculator-critical";
import { OEE_EQUIPMENT_EFFECTIVENESS_CALCULATOR_CRITICAL_FORMULA_CONTRACTS } from "@/lib/features/formula-governance/contracts/oee-equipment-effectiveness-calculator-critical";
import { QUALITY_COST_PAF_CALCULATOR_CRITICAL_FORMULA_CONTRACTS } from "@/lib/features/formula-governance/contracts/quality-cost-paf-calculator-critical";
import { SHOP_RATE_HOURLY_COST_CALCULATOR_CRITICAL_FORMULA_CONTRACTS } from "@/lib/features/formula-governance/contracts/shop-rate-hourly-cost-calculator-critical";
import { TOLERANCE_STACK_UP_CALCULATOR_CRITICAL_FORMULA_CONTRACTS } from "@/lib/features/formula-governance/contracts/tolerance-stack-up-calculator-critical";
import { AUTO_REPAIR_COMEBACK_COST_CRITICAL_FORMULA_CONTRACTS } from "@/lib/features/formula-governance/contracts/auto-repair-comeback-cost-critical";
import { CARBON_FOOTPRINT_COMPLIANCE_RISK_CRITICAL_FORMULA_CONTRACTS } from "@/lib/features/formula-governance/contracts/carbon-footprint-compliance-risk-critical";
import { CBAM_COMPLIANCE_VERDICT_CRITICAL_FORMULA_CONTRACTS } from "@/lib/features/formula-governance/contracts/cbam-compliance-verdict-critical";
import { CBAM_EXPOSURE_QUICK_CHECK_CRITICAL_FORMULA_CONTRACTS } from "@/lib/features/formula-governance/contracts/cbam-exposure-quick-check-critical";
import { ELECTRICAL_PANEL_REWORK_COST_CRITICAL_FORMULA_CONTRACTS } from "@/lib/features/formula-governance/contracts/electrical-panel-rework-cost-critical";
import { LEGAL_INTEREST_FEE_CALCULATOR_PRO_CRITICAL_FORMULA_CONTRACTS } from "@/lib/features/formula-governance/contracts/legal-interest-fee-calculator-pro-critical";
import { ENGINE_MODULES_CRITICAL_FORMULA_CONTRACTS } from "@/lib/features/formula-governance/contracts/engine-modules-critical";
import { P77_FREE_TRAFFIC_FORMULA_CONTRACTS } from "@/lib/features/formula-governance/contracts/p77-free-traffic-batch";
import { RENT_VS_BUY_RESULT_WARNING } from "@/lib/features/tools/rent-vs-buy-model";
import { THREE_D_PRINT_JOB_MARGIN_TOOL_CRITICAL_FORMULA_CONTRACTS } from "@/lib/features/formula-governance/contracts/3d-print-job-margin-tool-critical";
import { CNC_QUOTE_RISK_ANALYZER_CRITICAL_FORMULA_CONTRACTS } from "@/lib/features/formula-governance/contracts/cnc-quote-risk-analyzer-critical";
import { INDUSTRIAL_FORMULA_CONTRACTS } from "@/lib/features/formula-governance/contracts/industrial-formulas-critical";
import { PREMIUM_152_BATCH1_CRITICAL_FORMULA_CONTRACTS } from "@/lib/features/formula-governance/contracts/premium-152-batch1-critical";

const RENT_VS_BUY_DISCLAIMER =
  "Technical simulation only — not financial, legal, or tax advice. Verify assumptions before housing or investment decisions.";

export const rentVsBuyContract: FormulaContract = {
  toolId: "free-traffic.rent-vs-buy-calculator",
  toolName: "Rent vs Buy Comparison",
  slug: "rent-vs-buy-calculator",
  purpose:
    "Help users compare renting versus buying a home over a defined horizon with financing and ownership economics.",
  userDecision: "Should I rent or buy over the comparison period given my assumptions?",
  riskLevel: "critical",
  decisionImpact: "investment",
  requiredInputs: [
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
  criticalInputs: [
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
  outputs: [
    "recommendedPriceDifference",
    "totalRentPaid",
    "investmentValueIfRenting",
    "monthlyMortgagePayment",
    "totalMortgagePaid",
    "remainingMortgageBalance",
    "futureHomeValue",
    "estimatedOwnershipCosts",
    "estimatedSellingCosts",
    "rentNetPosition",
    "buyNetPosition",
    "netDifference",
    "strongerScenario",
  ],
  assumptions: [
    RENT_VS_BUY_DISCLAIMER,
    freeTrafficProductionAssumption(
      "rent-vs-buy-calculator",
      "calculateRentVsBuyComparison",
    ),
    RENT_VS_BUY_RESULT_WARNING,
    "Comparison horizon is held constant across scenarios.",
    "Ownership, tax and insurance effects are approximated via ownership cost percent.",
    GOVERNANCE_RECOMMENDED_PRICE_DIFFERENCE_TARGET_NOTE,
    "Model limitation: property tax, insurance, maintenance, financing and appreciation assumptions simplified.",
    "Model limitation: property tax, insurance, maintenance and opportunity cost approximated via ownership cost percent.",
    "Model limitation: local market conditions, rent control and transaction timing not modeled.",
    "Model limitation: investment return on down payment uses flat rate; tax treatment of rent vs buy excluded.",
    "Future extension: itemized tax deduction and capital-gains modeling.",
    "Future extension: regional insurance, PMI and maintenance schedules.",
    "Future extension: scenario-based ownership and financing stress tests.",
    "Numeric decision target is net cost comparison (netDifference); strongerScenario is narrative verdict only.",
  ],
  formulaSummary:
    "Rent scenario projects annual rent with growth, invests down payment plus purchase costs at the investment return rate, and compares rentNetPosition. Buy scenario amortizes mortgage, projects appreciation, ownership and selling costs, and compares buyNetPosition.",
  missingParameterWarnings: [],
  validationRules: [
    {
      id: "years-range",
      description: "comparisonYears must be between 1 and 40",
      kind: "edge",
    },
    {
      id: "calendar-year-guard",
      description: "comparisonYears must not be entered as a calendar year such as 2026",
      kind: "edge",
    },
    {
      id: "percent-bounds",
      description: "Rate and percent inputs must stay within 0–100 where applicable",
      kind: "dimensional",
    },
    {
      id: "currency-units",
      description: "Rent and price inputs must use consistent currency units",
      kind: "dimensional",
    },
    {
      id: "net-difference-currency",
      description: "netDifference and recommendedPriceDifference use consistent currency units",
      kind: "dimensional",
    },
    {
      id: "verdict-non-numeric",
      description: "strongerScenario is narrative verdict output; not a numeric calculation target",
      kind: "purpose",
    },
  ],
  scenarioTests: scenarioRuntimeTests([
    { id: "normal-7yr", description: "7-year horizon with moderate rates" },
    { id: "high-rent-growth", description: "High annual rent increase" },
    { id: "low-appreciation", description: "Flat home appreciation" },
    { id: "high-mortgage-rate", description: "Elevated mortgage interest" },
    { id: "invalid-years", description: "comparisonYears outside 1–40 rejected" },
  ]),
  monotonicityRules: [
    {
      id: "rent-increase",
      description: "Higher annual rent increase must not reduce total rent paid",
      inputKey: "annualRentIncrease",
      direction: "increase_should_increase",
      outputKey: "totalRentPaid",
    },
    {
      id: "investment-return",
      description: "Higher investment return must not weaken rent net position",
      inputKey: "investmentReturnRate",
      direction: "increase_should_increase",
      outputKey: "rentNetPosition",
    },
    {
      id: "home-appreciation",
      description: "Higher home appreciation must not weaken buy net position",
      inputKey: "annualHomeAppreciation",
      direction: "increase_should_increase",
      outputKey: "buyNetPosition",
    },
    {
      id: "mortgage-rate-payment",
      description: "Higher mortgage interest must not decrease monthly payment",
      inputKey: "mortgageInterestRate",
      direction: "increase_should_increase",
      outputKey: "monthlyMortgagePayment",
    },
    {
      id: "down-payment-payment",
      description: "Higher down payment percent must not increase monthly mortgage payment",
      inputKey: "downPaymentPercent",
      direction: "increase_should_decrease",
      outputKey: "monthlyMortgagePayment",
    },
  ],
  oracleRequired: true,
  propertyTestsRegistered: true,
  auditStatus: "NEEDS_REVIEW",
  decisionLanguageRules: [
    {
      id: "no-definitive-verdict",
      description:
        "Rent vs Buy must not give a definitive buy/rent command; use assumption-qualified language only.",
      acceptablePhrases: [
        "Under these assumptions, buying looks stronger.",
        "Under these assumptions, renting and investing the difference looks stronger.",
        "Small changes in rates, rent growth or home appreciation can change the result.",
      ],
      requiredDisclaimer: true,
      forbiddenPhrases: [
        "you should buy",
        "you should rent",
        "this guarantees savings",
        "this is the best decision",
        "always buy",
        "always rent",
        "guaranteed savings",
        "guaranteed margin",
        "guaranteed profit",
      ],
    },
  ],
  mustNotClaim: [
    "You should buy.",
    "You should rent.",
    "This guarantees savings.",
    "This is the best decision.",
    "Guaranteed better option",
    "Certified financial advice",
    "Exact future home value",
    "Guaranteed savings",
    "Guaranteed margin",
    "Guaranteed profit",
  ],
  auditOwner: "formula-governance",
};

export const FORMULA_CONTRACTS: readonly FormulaContract[] = [
  rentVsBuyContract,
  ...TOP_CRITICAL_FORMULA_CONTRACTS,
  ...BATCH_EXPANSION_CRITICAL_FORMULA_CONTRACTS,
  ...BATCH_TRAFFIC_CATALOG_CRITICAL_FORMULA_CONTRACTS,
  ...BATCH_PREMIUM_SCHEMA_CRITICAL_FORMULA_CONTRACTS,
  ...PREMIUM_SCHEMA_EXTENDED_CRITICAL_FORMULA_CONTRACTS,
  ...SEVEN_MUDA_WASTE_COST_CRITICAL_FORMULA_CONTRACTS,
  ...AGRICULTURE_IRRIGATION_YIELD_LOSS_CRITICAL_FORMULA_CONTRACTS,
  ...ENERGY_COMPRESSOR_LEAK_COST_CRITICAL_FORMULA_CONTRACTS,
  ...CNC_TOOL_WEAR_COST_CRITICAL_FORMULA_CONTRACTS,
  ...DAIRY_FEED_EFFICIENCY_LOSS_CRITICAL_FORMULA_CONTRACTS,
  ...CONSTRUCTION_PROJECT_OVERRUN_CRITICAL_FORMULA_CONTRACTS,
  ...CONSTRUCTION_SUBCONTRACTOR_MARGIN_LEAK_CRITICAL_FORMULA_CONTRACTS,
  ...PAINTING_REWORK_COVERAGE_RISK_CRITICAL_FORMULA_CONTRACTS,
  ...FOOD_WASTE_MARGIN_LOSS_CRITICAL_FORMULA_CONTRACTS,
  ...HVAC_CALLBACK_MARGIN_RISK_CRITICAL_FORMULA_CONTRACTS,
  ...RESTAURANT_MENU_MARGIN_LEAK_CRITICAL_FORMULA_CONTRACTS,
  ...WAREHOUSE_SPACE_COST_LEAK_CRITICAL_FORMULA_CONTRACTS,
  ...SHEET_METAL_SCRAP_RISK_CRITICAL_FORMULA_CONTRACTS,
  ...PRINTING_REPRINT_MARGIN_LEAK_CRITICAL_FORMULA_CONTRACTS,
  ...COMPRESSOR_LEAK_COST_CALCULATOR_CRITICAL_FORMULA_CONTRACTS,
  ...DOWNTIME_MINUTE_COST_CALCULATOR_CRITICAL_FORMULA_CONTRACTS,
  ...ENERGY_PEAK_COST_CRITICAL_FORMULA_CONTRACTS,
  ...ENERGY_SAVINGS_PACKAGE_CALCULATOR_CRITICAL_FORMULA_CONTRACTS,
  ...INVENTORY_CARRYING_COST_EOQ_CALCULATOR_CRITICAL_FORMULA_CONTRACTS,
  ...LOGISTICS_FUEL_ROUTE_DRIFT_CRITICAL_FORMULA_CONTRACTS,
  ...LOGISTICS_ROUTE_LOSS_CRITICAL_FORMULA_CONTRACTS,
  ...PLUMBING_LEAK_CALLBACK_COST_CRITICAL_FORMULA_CONTRACTS,
  ...PRODUCT_CUSTOMER_PROFITABILITY_CALCULATOR_CRITICAL_FORMULA_CONTRACTS,
  ...RETAIL_INVENTORY_TURNOVER_RISK_CRITICAL_FORMULA_CONTRACTS,
  ...ROOFING_WEATHER_DELAY_RISK_CRITICAL_FORMULA_CONTRACTS,
  ...TEXTILE_FABRIC_WASTE_RISK_CRITICAL_FORMULA_CONTRACTS,
  ...VALUE_STREAM_MAP_VSM_CALCULATOR_CRITICAL_FORMULA_CONTRACTS,
  ...ANNUAL_LEAVE_SEVERANCE_NOTICE_CALCULATOR_CRITICAL_FORMULA_CONTRACTS,
  ...BELT_PULLEY_SPEED_LENGTH_CALCULATOR_CRITICAL_FORMULA_CONTRACTS,
  ...BOLT_TIGHTENING_TORQUE_CALCULATOR_CRITICAL_FORMULA_CONTRACTS,
  ...CNC_OEE_LOSS_CRITICAL_FORMULA_CONTRACTS,
  ...EMPLOYEE_TOTAL_COST_CALCULATOR_CRITICAL_FORMULA_CONTRACTS,
  ...FIRE_SYSTEM_FLOW_HYDRANT_CALCULATOR_CRITICAL_FORMULA_CONTRACTS,
  ...HYDRAULIC_PNEUMATIC_CYLINDER_FORCE_CALCULATOR_CRITICAL_FORMULA_CONTRACTS,
  ...INVESTMENT_PAYBACK_NPV_CALCULATOR_CRITICAL_FORMULA_CONTRACTS,
  ...OEE_EQUIPMENT_EFFECTIVENESS_CALCULATOR_CRITICAL_FORMULA_CONTRACTS,
  ...QUALITY_COST_PAF_CALCULATOR_CRITICAL_FORMULA_CONTRACTS,
  ...SHOP_RATE_HOURLY_COST_CALCULATOR_CRITICAL_FORMULA_CONTRACTS,
  ...TOLERANCE_STACK_UP_CALCULATOR_CRITICAL_FORMULA_CONTRACTS,
  ...AUTO_REPAIR_COMEBACK_COST_CRITICAL_FORMULA_CONTRACTS,
  ...CARBON_FOOTPRINT_COMPLIANCE_RISK_CRITICAL_FORMULA_CONTRACTS,
  ...CBAM_COMPLIANCE_VERDICT_CRITICAL_FORMULA_CONTRACTS,
  ...CBAM_EXPOSURE_QUICK_CHECK_CRITICAL_FORMULA_CONTRACTS,
  ...ELECTRICAL_PANEL_REWORK_COST_CRITICAL_FORMULA_CONTRACTS,
  ...LEGAL_INTEREST_FEE_CALCULATOR_PRO_CRITICAL_FORMULA_CONTRACTS,
  ...ENGINE_MODULES_CRITICAL_FORMULA_CONTRACTS,
  ...P77_FREE_TRAFFIC_FORMULA_CONTRACTS,
  ...THREE_D_PRINT_JOB_MARGIN_TOOL_CRITICAL_FORMULA_CONTRACTS,
  ...CNC_QUOTE_RISK_ANALYZER_CRITICAL_FORMULA_CONTRACTS,
  ...INDUSTRIAL_FORMULA_CONTRACTS,
  ...PREMIUM_152_BATCH1_CRITICAL_FORMULA_CONTRACTS,
];

export function getFormulaContractBySlug(slug: string): FormulaContract | undefined {
  return FORMULA_CONTRACTS.find((c) => c.slug === slug);
}

export function getFormulaContractById(toolId: string): FormulaContract | undefined {
  return FORMULA_CONTRACTS.find((c) => c.toolId === toolId);
}

export function listFormulaContractSlugs(): readonly string[] {
  return FORMULA_CONTRACTS.map((c) => c.slug);
}
