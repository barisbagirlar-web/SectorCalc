/**
 * Phase 5E — next 10 critical FormulaContracts (skeleton coverage only).
 * No oracle, runtime scenarios, or production formula changes in this phase.
 */

import type { FormulaContract } from "@/lib/formula-governance/types";
import {
  FINANCIAL_SIMULATION_DISCLAIMER,
  STANDARD_DECISION_LANGUAGE_RULE,
  STANDARD_MUST_NOT_CLAIM,
  buildAssuredCriticalContract,
  buildCriticalContract,
  scenarioSkeletons,
} from "@/lib/formula-governance/contracts/shared";

export const BATCH_FREE_ORACLE_WIRED_SLUGS = [
  "project-cost-calculator",
  "cleaning-cost-calculator",
  "food-cost-calculator",
  "product-margin-calculator",
  "welding-cost-estimator",
] as const;
import { createWarningPolicy } from "@/lib/formula-governance/warning-policy";

const PREMIUM_DECISION_DISCLAIMER =
  "Technical simulation only — not financial, legal, or engineering advice. Verify assumptions before bid, pricing or business decisions.";

export const projectCostCalculatorContract: FormulaContract = buildAssuredCriticalContract({
  toolId: "revenue-free.project-cost-calculator",
  toolName: "Concrete / Project Cost Calculator",
  slug: "project-cost-calculator",
  purpose:
    "Estimate total project cost from material, labor, equipment, overhead and contingency inputs.",
  userDecision: "What total project cost do these scope and rate assumptions imply?",
  decisionImpact: "financial",
  requiredInputs: [
    "materialCost",
    "laborHours",
    "laborHourlyRate",
    "equipmentCost",
    "overheadRate",
    "contingencyRate",
  ],
  criticalInputs: ["originalBudget", "changeEstimate", "deadlinePressure"],
  outputs: ["estimatedProjectCost", "laborCost", "overheadCost", "contingencyCost"],
  assumptions: [
    FINANCIAL_SIMULATION_DISCLAIMER,
    "Linear material, labor and equipment base cost with percent overhead and contingency.",
    "Schedule delay, change-order knock-on effects and subcontractor risk excluded on free tier.",
  ],
  formulaSummary:
    "Labor = hours × rate; base = material + labor + equipment; overhead = base × overheadRate%; contingency = (base + overhead) × contingencyRate%; total = base + overhead + contingency.",
  missingParameterWarnings: [],
  warningPolicy: createWarningPolicy({
    acceptedAssumptions: [
      "Flat overhead and contingency percentages applied to base cost.",
    ],
    modelLimitations: [
      "Change-order delay and crew standby cost not modeled on free tier",
      "Subcontractor markup and permit fees not itemized",
    ],
    futureExtensions: [
      "Integration with change-order impact analyzer for margin verdict",
    ],
  }),
  validationRules: [
    { id: "material-non-negative", description: "materialCost must be ≥ 0", kind: "edge" },
    { id: "labor-hours-positive", description: "laborHours must be ≥ 0", kind: "edge" },
    { id: "percent-bounds", description: "overheadRate and contingencyRate within 0–100%", kind: "dimensional" },
  ],
  scenarioSpecs: [
    { id: "normal-build", description: "Normal case: mid-size project with standard overhead" },
    { id: "edge-labor-heavy", description: "Edge case: labor share dominates base cost" },
    { id: "absurd-negative-cost", description: "Absurd input: negative material or labor rejected" },
    { id: "directional-material", description: "Directional: higher material cost increases total project cost" },
    { id: "sensitivity-contingency", description: "Sensitivity: +5% contingency increases total cost" },
  ],
  monotonicityRules: [
    {
      id: "material-up-total",
      description: "Higher materialCost must not decrease estimated project cost",
      inputKey: "materialCost",
      direction: "increase_should_increase",
      outputKey: "estimatedProjectCost",
    },
    {
      id: "labor-rate-up-total",
      description: "Higher laborHourlyRate must not decrease estimated project cost",
      inputKey: "laborHourlyRate",
      direction: "increase_should_increase",
      outputKey: "estimatedProjectCost",
    },
    {
      id: "contingency-up-total",
      description: "Higher contingencyRate must not decrease estimated project cost",
      inputKey: "contingencyRate",
      direction: "increase_should_increase",
      outputKey: "estimatedProjectCost",
    },
  ],
  decisionLanguageRules: [STANDARD_DECISION_LANGUAGE_RULE],
  mustNotClaim: [...STANDARD_MUST_NOT_CLAIM],
});

export const changeOrderImpactAnalyzerContract: FormulaContract = buildCriticalContract({
  toolId: "revenue-premium.change-order-impact-analyzer",
  toolName: "Change Order Impact Analyzer",
  slug: "change-order-impact-analyzer",
  purpose:
    "Measure delay, crew cost and margin impact before accepting a construction change order.",
  userDecision: "Should I accept this change order at the quoted price given delay and margin targets?",
  decisionImpact: "pricing",
  requiredInputs: [
    "originalBudget",
    "changeEstimate",
    "delayDays",
    "crewCostPerDay",
    "marginTarget",
  ],
  criticalInputs: [
    "originalBudget",
    "changeEstimate",
    "delayDays",
    "crewCostPerDay",
    "marginTarget",
  ],
  outputs: ["minimumSafePrice", "quoteVerdict", "p90Cost", "suggestedAction"],
  assumptions: [
    PREMIUM_DECISION_DISCLAIMER,
    "Change cost plus delay days × crew cost plus site overhead buffer.",
    "Hidden productivity slip and permit revision fees applied via risk engine multipliers.",
  ],
  formulaSummary:
    "Base cost = changeEstimate + delayDays × crewCostPerDay + originalBudget overhead slice; safe price and verdict via MarginCore risk engine with volatility buffer.",
  missingParameterWarnings: [],
  warningPolicy: createWarningPolicy({
    acceptedAssumptions: [
      "Flat crew cost per delay day; site overhead scaled from original budget.",
    ],
    modelLimitations: [
      "Weather and seasonal productivity not modeled explicitly",
      "Subcontractor pass-through and owner-directed acceleration costs not itemized",
      "Premium decision layer not oracle-compared in Phase 5E",
    ],
    futureExtensions: [
      "Independent oracle for minimum safe change price",
      "Multi-trade ripple delay modeling",
    ],
  }),
  validationRules: [
    { id: "budget-positive", description: "originalBudget must be > 0", kind: "edge" },
    { id: "delay-non-negative", description: "delayDays must be ≥ 0", kind: "edge" },
    { id: "margin-percent", description: "marginTarget is percent not decimal", kind: "dimensional" },
  ],
  scenarioTests: scenarioSkeletons([
    { id: "normal-change", description: "Normal case: moderate change with short delay" },
    { id: "edge-zero-delay", description: "Edge case: change cost only, zero delay days" },
    { id: "absurd-negative-delay", description: "Absurd input: negative delay days rejected" },
    { id: "directional-change-cost", description: "Directional: higher changeEstimate increases impact" },
    { id: "sensitivity-crew-rate", description: "Sensitivity: higher crewCostPerDay widens minimum safe price" },
  ]),
  monotonicityRules: [
    {
      id: "change-up-impact",
      description: "Higher changeEstimate must not decrease minimum safe price",
      inputKey: "changeEstimate",
      direction: "increase_should_increase",
      outputKey: "minimumSafePrice",
    },
    {
      id: "delay-up-impact",
      description: "Higher delayDays must not decrease schedule/cost impact",
      inputKey: "delayDays",
      direction: "increase_should_increase",
      outputKey: "minimumSafePrice",
    },
    {
      id: "margin-up-floor",
      description: "Higher marginTarget must not decrease minimum safe price",
      inputKey: "marginTarget",
      direction: "increase_should_increase",
      outputKey: "minimumSafePrice",
    },
  ],
  decisionLanguageRules: [STANDARD_DECISION_LANGUAGE_RULE],
  mustNotClaim: [...STANDARD_MUST_NOT_CLAIM, "Guaranteed change-order acceptance outcome"],
});

export const cleaningCostCalculatorContract: FormulaContract = buildAssuredCriticalContract({
  toolId: "revenue-free.cleaning-cost-calculator",
  toolName: "Cleaning Cost Calculator",
  slug: "cleaning-cost-calculator",
  purpose: "Estimate basic cleaning job cost from area, crew hours, labor rate and supplies.",
  userDecision: "What cleaning cost does this area and crew workload imply?",
  decisionImpact: "pricing",
  requiredInputs: ["area", "estimatedHours", "crewSize", "laborHourlyCost", "suppliesCost", "travelCost"],
  criticalInputs: ["areaSize", "staffCount", "visitFrequency"],
  outputs: ["totalCost", "laborCost", "costPerSqFt"],
  assumptions: [
    FINANCIAL_SIMULATION_DISCLAIMER,
    "Labor = estimated hours × crew size × hourly cost; supplies and travel added flat.",
    "Recurring contract margin, supervision and travel between sites excluded on free tier.",
  ],
  formulaSummary:
    "Labor cost = estimatedHours × crewSize × laborHourlyCost; totalCost = labor + suppliesCost + travelCost; costPerSqFt = totalCost ÷ area.",
  missingParameterWarnings: [],
  warningPolicy: createWarningPolicy({
    acceptedAssumptions: [
      "Single-visit snapshot; linear labor hours per area.",
    ],
    modelLimitations: [
      "Supervision, G&A and multi-site travel not allocated",
      "Supply inflation and restocking frequency not modeled",
    ],
    futureExtensions: [
      "Monthly recurring bid optimizer integration",
      "Frequency-adjusted labor loading",
    ],
  }),
  validationRules: [
    { id: "area-positive", description: "area must be > 0", kind: "edge" },
    { id: "hours-positive", description: "estimatedHours must be > 0", kind: "edge" },
    { id: "crew-min-one", description: "crewSize must be ≥ 1", kind: "edge" },
    {
      id: "currency-units",
      description: "Labor, supplies and travel costs use consistent currency units",
      kind: "dimensional",
    },
  ],
  scenarioSpecs: [
    { id: "normal-office", description: "Normal case: office clean with standard crew hours" },
    { id: "edge-small-area", description: "Edge case: small high-touch area" },
    { id: "absurd-zero-area", description: "Absurd input: zero area rejected" },
    { id: "directional-area", description: "Directional: larger area increases total cost" },
    { id: "sensitivity-labor-rate", description: "Sensitivity: +10% labor rate increases total cost" },
  ],
  monotonicityRules: [
    {
      id: "area-up-cost",
      description: "Higher area with fixed hours must not decrease cost per sq ft denominator effect alone — larger workload inputs increase total cost",
      inputKey: "estimatedHours",
      direction: "increase_should_increase",
      outputKey: "totalCost",
    },
    {
      id: "labor-rate-up-cost",
      description: "Higher laborHourlyCost must not decrease total cost",
      inputKey: "laborHourlyCost",
      direction: "increase_should_increase",
      outputKey: "totalCost",
    },
    {
      id: "supplies-up-cost",
      description: "Higher suppliesCost must not decrease total cost",
      inputKey: "suppliesCost",
      direction: "increase_should_increase",
      outputKey: "totalCost",
    },
  ],
  decisionLanguageRules: [STANDARD_DECISION_LANGUAGE_RULE],
  mustNotClaim: [...STANDARD_MUST_NOT_CLAIM],
});

export const officeCleaningBidOptimizerContract: FormulaContract = buildCriticalContract({
  toolId: "revenue-premium.office-cleaning-bid-optimizer",
  toolName: "Office Cleaning Bid Optimizer",
  slug: "office-cleaning-bid-optimizer",
  purpose:
    "Find minimum monthly bid with labor, supplies, visit frequency and target margin for office cleaning contracts.",
  userDecision: "What minimum monthly bid covers labor, supplies and margin on this contract?",
  decisionImpact: "pricing",
  requiredInputs: [
    "areaSize",
    "laborRate",
    "hoursPerVisit",
    "supplyCost",
    "visitFrequency",
    "targetMargin",
  ],
  criticalInputs: [
    "areaSize",
    "laborRate",
    "hoursPerVisit",
    "supplyCost",
    "visitFrequency",
    "targetMargin",
  ],
  outputs: ["minimumSafePrice", "quoteVerdict", "p90Cost", "suggestedAction"],
  assumptions: [
    PREMIUM_DECISION_DISCLAIMER,
    "Monthly labor = laborRate × hoursPerVisit × visitFrequency; supplies and overhead buffer added.",
    "Travel between sites and supervision G&A applied via hidden multipliers.",
  ],
  formulaSummary:
    "Base cost = labor + supply + overhead slice; minimum monthly bid and verdict via MarginCore with volatility buffer.",
  missingParameterWarnings: [],
  warningPolicy: createWarningPolicy({
    acceptedAssumptions: [
      "Flat labor hours per visit across the month.",
    ],
    modelLimitations: [
      "Multi-site travel time not modeled explicitly",
      "Supply cost drift and QA supervision loaded via hidden buffers only",
      "Premium decision layer not oracle-compared in Phase 5E",
    ],
    futureExtensions: [
      "Independent oracle for minimum monthly bid",
      "Seasonal visit intensity adjustments",
    ],
  }),
  validationRules: [
    { id: "frequency-positive", description: "visitFrequency must be ≥ 1", kind: "edge" },
    { id: "labor-rate-positive", description: "laborRate must be > 0", kind: "edge" },
    { id: "margin-percent", description: "targetMargin is percent", kind: "dimensional" },
  ],
  scenarioTests: scenarioSkeletons([
    { id: "normal-contract", description: "Normal case: weekly office visits with target margin" },
    { id: "edge-high-frequency", description: "Edge case: daily visit frequency" },
    { id: "absurd-zero-visits", description: "Absurd input: zero visit frequency rejected" },
    { id: "directional-labor-hours", description: "Directional: more hours per visit raises bid floor" },
    { id: "sensitivity-supply", description: "Sensitivity: higher supply cost raises minimum bid" },
  ]),
  monotonicityRules: [
    {
      id: "hours-up-bid",
      description: "Higher hoursPerVisit must not decrease minimum safe price",
      inputKey: "hoursPerVisit",
      direction: "increase_should_increase",
      outputKey: "minimumSafePrice",
    },
    {
      id: "supply-up-bid",
      description: "Higher supplyCost must not decrease minimum safe price",
      inputKey: "supplyCost",
      direction: "increase_should_increase",
      outputKey: "minimumSafePrice",
    },
    {
      id: "margin-up-bid",
      description: "Higher targetMargin must not decrease minimum safe price",
      inputKey: "targetMargin",
      direction: "increase_should_increase",
      outputKey: "minimumSafePrice",
    },
  ],
  decisionLanguageRules: [STANDARD_DECISION_LANGUAGE_RULE],
  mustNotClaim: [...STANDARD_MUST_NOT_CLAIM, "Guaranteed contract win"],
});

export const foodCostCalculatorContract: FormulaContract = buildAssuredCriticalContract({
  toolId: "free-traffic.food-cost-calculator",
  toolName: "Food Cost Percentage Calculator",
  slug: "food-cost-calculator",
  purpose: "Calculate food cost as a percent of menu price from ingredient cost and selling price.",
  userDecision: "What food cost percentage does this plate cost imply at the menu price entered?",
  decisionImpact: "pricing",
  requiredInputs: ["ingredientCost", "menuPrice"],
  criticalInputs: ["ingredientCost", "menuPrice"],
  outputs: ["foodCostPercent"],
  assumptions: [
    FINANCIAL_SIMULATION_DISCLAIMER,
    "Single menu item snapshot; food cost % = ingredientCost ÷ menuPrice × 100.",
    "Waste, labor, delivery commission and packaging excluded on free tier.",
  ],
  formulaSummary: "Food cost % = ingredientCost ÷ menuPrice × 100.",
  missingParameterWarnings: [],
  warningPolicy: createWarningPolicy({
    acceptedAssumptions: [
      "Simple food cost ratio without waste or labor allocation.",
    ],
    modelLimitations: [
      "Kitchen labor and packaging not included",
      "Delivery commission and waste not modeled",
    ],
    futureExtensions: [
      "Menu profit leak detector integration for true margin",
    ],
  }),
  validationRules: [
    { id: "ingredient-positive", description: "ingredientCost must be > 0", kind: "edge" },
    { id: "menu-price-positive", description: "menuPrice must be > 0", kind: "edge" },
    { id: "ratio-bounds", description: "Food cost percent stays within 0–100% for valid inputs", kind: "dimensional" },
  ],
  scenarioSpecs: [
    { id: "normal-menu-item", description: "Normal case: standard plate at target food cost %" },
    { id: "edge-thin-margin", description: "Edge case: ingredient cost near menu price" },
    { id: "absurd-zero-price", description: "Absurd input: zero menu price rejected" },
    { id: "directional-ingredient", description: "Directional: higher ingredient cost increases food cost %" },
    { id: "sensitivity-menu-price", description: "Sensitivity: +10% menu price lowers food cost %" },
  ],
  monotonicityRules: [
    {
      id: "ingredient-up-pct",
      description: "Higher ingredientCost must not decrease food cost percent",
      inputKey: "ingredientCost",
      direction: "increase_should_increase",
      outputKey: "foodCostPercent",
    },
    {
      id: "price-up-pct",
      description: "Higher menuPrice must not increase food cost percent",
      inputKey: "menuPrice",
      direction: "increase_should_decrease",
      outputKey: "foodCostPercent",
    },
    {
      id: "ingredient-up-margin-headroom",
      description: "Higher ingredientCost must not improve gross margin headroom",
      inputKey: "ingredientCost",
      direction: "increase_should_increase",
      outputKey: "foodCostPercent",
    },
  ],
  decisionLanguageRules: [STANDARD_DECISION_LANGUAGE_RULE],
  mustNotClaim: [...STANDARD_MUST_NOT_CLAIM],
});

export const menuProfitLeakDetectorContract: FormulaContract = buildCriticalContract({
  toolId: "revenue-premium.menu-profit-leak-detector",
  toolName: "Menu Profit Leak Detector",
  slug: "menu-profit-leak-detector",
  purpose:
    "Detect real menu margin after waste, delivery commission and labor cost per item.",
  userDecision: "Is this menu item leaking profit after waste, labor and delivery fees?",
  decisionImpact: "pricing",
  requiredInputs: [
    "menuPrice",
    "ingredientCost",
    "wasteRate",
    "deliveryCommission",
    "laborCostPerItem",
    "targetMargin",
  ],
  criticalInputs: [
    "menuPrice",
    "ingredientCost",
    "wasteRate",
    "deliveryCommission",
    "laborCostPerItem",
    "targetMargin",
  ],
  outputs: ["minimumSafePrice", "quoteVerdict", "p90Cost", "suggestedAction"],
  assumptions: [
    PREMIUM_DECISION_DISCLAIMER,
    "True cost includes waste-inflated ingredients, labor per item and delivery commission on menu price.",
    "Portion variance and rush-hour labor loaded via hidden multipliers.",
  ],
  formulaSummary:
    "Base cost = ingredient × (1 + waste%) + labor + menuPrice × commission% + overhead slice; safe price and verdict via MarginCore.",
  missingParameterWarnings: [],
  warningPolicy: createWarningPolicy({
    acceptedAssumptions: [
      "Per-item labor allocation entered by operator.",
    ],
    modelLimitations: [
      "Packaging and garnish costs not always itemized",
      "Third-party delivery mix modeled as flat commission only",
      "Premium decision layer not oracle-compared in Phase 5E",
    ],
    futureExtensions: [
      "Independent oracle for minimum safe menu price",
      "Multi-item menu mix optimization",
    ],
  }),
  validationRules: [
    { id: "menu-price-positive", description: "menuPrice must be > 0", kind: "edge" },
    { id: "waste-percent", description: "wasteRate is percent 0–100", kind: "dimensional" },
    { id: "commission-percent", description: "deliveryCommission is percent", kind: "dimensional" },
  ],
  scenarioTests: scenarioSkeletons([
    { id: "normal-item", description: "Normal case: dine-in item with moderate waste" },
    { id: "edge-high-delivery", description: "Edge case: high delivery commission mix" },
    { id: "absurd-waste", description: "Absurd input: waste rate above 100% rejected" },
    { id: "directional-waste", description: "Directional: higher wasteRate increases profit leak" },
    { id: "sensitivity-labor", description: "Sensitivity: higher laborCostPerItem widens leak" },
  ]),
  monotonicityRules: [
    {
      id: "waste-up-leak",
      description: "Higher wasteRate must not decrease minimum safe price",
      inputKey: "wasteRate",
      direction: "increase_should_increase",
      outputKey: "minimumSafePrice",
    },
    {
      id: "ingredient-up-leak",
      description: "Higher ingredientCost must not decrease minimum safe price",
      inputKey: "ingredientCost",
      direction: "increase_should_increase",
      outputKey: "minimumSafePrice",
    },
    {
      id: "price-down-margin",
      description: "Lower menuPrice must not improve margin verdict floor",
      inputKey: "menuPrice",
      direction: "increase_should_increase",
      outputKey: "minimumSafePrice",
    },
  ],
  decisionLanguageRules: [STANDARD_DECISION_LANGUAGE_RULE],
  mustNotClaim: [...STANDARD_MUST_NOT_CLAIM, "Guaranteed menu profitability"],
});

export const productMarginCalculatorContract: FormulaContract = buildAssuredCriticalContract({
  toolId: "revenue-free.product-margin-calculator",
  toolName: "Product Margin Calculator",
  slug: "product-margin-calculator",
  purpose:
    "Estimate product margin after COGS, shipping, platform fees, payment processing and return impact.",
  userDecision: "What gross margin does this SKU imply after common selling costs?",
  decisionImpact: "pricing",
  requiredInputs: [
    "sellingPrice",
    "productCost",
    "shippingCost",
    "platformFeeRate",
    "paymentFeeRate",
    "returnRate",
  ],
  criticalInputs: ["productPrice", "productCost", "returnRate"],
  outputs: ["margin", "grossProfit", "totalCost", "returnImpact"],
  assumptions: [
    FINANCIAL_SIMULATION_DISCLAIMER,
    "Per-order snapshot; fees computed as percent of selling price.",
    "Ad spend, reverse logistics detail and cash cycle excluded on free tier.",
  ],
  formulaSummary:
    "Fees = sellingPrice × fee rates; returnImpact = sellingPrice × returnRate%; totalCost = COGS + shipping + fees + returnImpact; margin = (sellingPrice − totalCost) ÷ sellingPrice × 100.",
  missingParameterWarnings: [],
  warningPolicy: createWarningPolicy({
    acceptedAssumptions: [
      "Single-SKU gross margin snapshot without ad spend.",
    ],
    modelLimitations: [
      "Ad cost per sale not included on free tier",
      "Reverse logistics and restocking labor not itemized",
      "Discount and promotional pricing not modeled",
    ],
    futureExtensions: [
      "Return profit erosion tool integration for net margin verdict",
    ],
  }),
  validationRules: [
    { id: "price-positive", description: "sellingPrice must be > 0", kind: "edge" },
    { id: "fee-percent", description: "Fee and return rates within 0–100%", kind: "dimensional" },
    { id: "cost-non-negative", description: "productCost and shippingCost must be ≥ 0", kind: "edge" },
  ],
  scenarioSpecs: [
    { id: "normal-sku", description: "Normal case: healthy margin SKU" },
    { id: "edge-high-returns", description: "Edge case: elevated return rate" },
    { id: "absurd-zero-price", description: "Absurd input: zero selling price rejected" },
    { id: "directional-cost", description: "Directional: higher productCost lowers margin" },
    { id: "sensitivity-discount", description: "Sensitivity: higher return rate erodes margin" },
  ],
  monotonicityRules: [
    {
      id: "cost-up-margin",
      description: "Higher productCost must not improve margin percent",
      inputKey: "productCost",
      direction: "increase_should_decrease",
      outputKey: "margin",
    },
    {
      id: "price-up-margin",
      description: "Higher sellingPrice must not decrease margin percent when costs fixed",
      inputKey: "sellingPrice",
      direction: "increase_should_increase",
      outputKey: "margin",
    },
    {
      id: "return-up-margin",
      description: "Higher returnRate must not improve margin percent",
      inputKey: "returnRate",
      direction: "increase_should_decrease",
      outputKey: "margin",
    },
  ],
  decisionLanguageRules: [STANDARD_DECISION_LANGUAGE_RULE],
  mustNotClaim: [...STANDARD_MUST_NOT_CLAIM],
});

export const returnProfitErosionToolContract: FormulaContract = buildCriticalContract({
  toolId: "revenue-premium.return-profit-erosion-tool",
  toolName: "Return Profit Erosion Tool",
  slug: "return-profit-erosion-tool",
  purpose:
    "Measure net profit after returns, shipping, payment fees and ad cost per sale.",
  userDecision: "Can this SKU scale profitably after returns, fees and ad spend?",
  decisionImpact: "pricing",
  requiredInputs: [
    "productPrice",
    "productCost",
    "shippingCost",
    "returnRate",
    "paymentFeeRate",
    "adCostPerSale",
  ],
  criticalInputs: [
    "productPrice",
    "productCost",
    "shippingCost",
    "returnRate",
    "paymentFeeRate",
    "adCostPerSale",
  ],
  outputs: ["minimumSafePrice", "quoteVerdict", "p90Cost", "suggestedAction"],
  assumptions: [
    PREMIUM_DECISION_DISCLAIMER,
    "Return drag, reverse logistics, payment fees and ad cost stacked on product cost.",
    "Fraud reserve and CAC recovery applied via hidden multipliers.",
  ],
  formulaSummary:
    "Base cost = COGS + shipping + fees + return drag + ad cost + reverse logistics slice; safe price and scale verdict via MarginCore.",
  missingParameterWarnings: [],
  warningPolicy: createWarningPolicy({
    acceptedAssumptions: [
      "Flat return rate applied to selling price for erosion estimate.",
    ],
    modelLimitations: [
      "SKU-specific return curves and seasonality not modeled",
      "Chargeback and fraud reserve applied via hidden buffer only",
      "Premium decision layer not oracle-compared in Phase 5E",
    ],
    futureExtensions: [
      "Independent oracle for minimum viable selling price",
      "Break-even ROAS scenario wiring",
    ],
  }),
  validationRules: [
    { id: "price-positive", description: "productPrice must be > 0", kind: "edge" },
    { id: "return-percent", description: "returnRate within 0–100%", kind: "dimensional" },
    { id: "ad-cost-non-negative", description: "adCostPerSale must be ≥ 0", kind: "edge" },
  ],
  scenarioTests: scenarioSkeletons([
    { id: "normal-sku", description: "Normal case: moderate return rate and ad spend" },
    { id: "edge-high-returns", description: "Edge case: return rate above category norm" },
    { id: "absurd-return-rate", description: "Absurd input: return rate above 100% rejected" },
    { id: "directional-return", description: "Directional: higher returnRate increases erosion" },
    { id: "sensitivity-shipping", description: "Sensitivity: higher shippingCost widens erosion" },
  ]),
  monotonicityRules: [
    {
      id: "return-up-erosion",
      description: "Higher returnRate must not decrease minimum safe price",
      inputKey: "returnRate",
      direction: "increase_should_increase",
      outputKey: "minimumSafePrice",
    },
    {
      id: "shipping-up-erosion",
      description: "Higher shippingCost must not decrease minimum safe price",
      inputKey: "shippingCost",
      direction: "increase_should_increase",
      outputKey: "minimumSafePrice",
    },
    {
      id: "ad-up-erosion",
      description: "Higher adCostPerSale must not decrease minimum safe price",
      inputKey: "adCostPerSale",
      direction: "increase_should_increase",
      outputKey: "minimumSafePrice",
    },
  ],
  decisionLanguageRules: [STANDARD_DECISION_LANGUAGE_RULE],
  mustNotClaim: [...STANDARD_MUST_NOT_CLAIM, "Guaranteed scalable SKU"],
});

export const weldingCostEstimatorContract: FormulaContract = buildAssuredCriticalContract({
  toolId: "free-traffic.welding-cost-estimator",
  toolName: "Welding Cost Estimator",
  slug: "welding-cost-estimator",
  purpose: "Estimate welding job cost from material, labor hours, labor rate and consumables.",
  userDecision: "What visible welding job cost do these material and labor inputs imply?",
  decisionImpact: "pricing",
  requiredInputs: ["materialCost", "laborHours", "laborRate", "consumablesCost"],
  criticalInputs: ["materialCost", "laborHours", "laborRate", "consumablesCost"],
  outputs: ["estimatedCost", "laborCost"],
  assumptions: [
    FINANCIAL_SIMULATION_DISCLAIMER,
    "Cost = material + laborHours × laborRate + consumables.",
    "Fit-up time, rework risk and NDT inspection excluded on free tier.",
  ],
  formulaSummary:
    "Estimated cost = materialCost + laborHours × laborRate + consumablesCost.",
  missingParameterWarnings: [],
  warningPolicy: createWarningPolicy({
    acceptedAssumptions: [
      "Visible material, labor and consumables only; no rework buffer.",
    ],
    modelLimitations: [
      "Fit-up hours and gas consumables split not fully modeled on free tier",
      "Rework probability and position factor not included",
    ],
    futureExtensions: [
      "Welding bid risk analyzer integration for safe bid floor",
    ],
  }),
  validationRules: [
    { id: "material-positive", description: "materialCost must be > 0", kind: "edge" },
    { id: "hours-positive", description: "laborHours must be > 0", kind: "edge" },
    { id: "rate-positive", description: "laborRate must be > 0", kind: "edge" },
    {
      id: "currency-units",
      description: "Material, labor rate and consumables use consistent currency units",
      kind: "dimensional",
    },
  ],
  scenarioSpecs: [
    { id: "normal-job", description: "Normal case: standard weld job with consumables" },
    { id: "edge-material-heavy", description: "Edge case: material dominates labor" },
    { id: "absurd-zero-hours", description: "Absurd input: zero labor hours rejected" },
    { id: "directional-length", description: "Directional: longer weld labor hours increase cost" },
    { id: "sensitivity-consumables", description: "Sensitivity: higher consumablesCost increases total" },
  ],
  monotonicityRules: [
    {
      id: "length-up-cost",
      description: "Higher laborHours must not decrease estimated cost",
      inputKey: "laborHours",
      direction: "increase_should_increase",
      outputKey: "estimatedCost",
    },
    {
      id: "labor-rate-up-cost",
      description: "Higher laborRate must not decrease estimated cost",
      inputKey: "laborRate",
      direction: "increase_should_increase",
      outputKey: "estimatedCost",
    },
    {
      id: "consumables-up-cost",
      description: "Higher consumablesCost must not decrease estimated cost",
      inputKey: "consumablesCost",
      direction: "increase_should_increase",
      outputKey: "estimatedCost",
    },
  ],
  decisionLanguageRules: [STANDARD_DECISION_LANGUAGE_RULE],
  mustNotClaim: [...STANDARD_MUST_NOT_CLAIM],
});

export const weldingBidRiskAnalyzerContract: FormulaContract = buildCriticalContract({
  toolId: "revenue-premium.welding-bid-risk-analyzer",
  toolName: "Welding Bid Risk Analyzer",
  slug: "welding-bid-risk-analyzer",
  purpose:
    "Find minimum safe welding bid with fit-up time, rework risk and consumables included.",
  userDecision: "Is this welding bid safe given fit-up, rework and margin targets?",
  decisionImpact: "pricing",
  requiredInputs: [
    "materialCost",
    "laborHours",
    "laborRate",
    "gasConsumableCost",
    "fitUpHours",
    "reworkRiskPercent",
    "targetMargin",
  ],
  criticalInputs: [
    "materialCost",
    "laborHours",
    "laborRate",
    "gasConsumableCost",
    "fitUpHours",
    "reworkRiskPercent",
    "targetMargin",
  ],
  outputs: ["minimumSafePrice", "quoteVerdict", "p90Cost", "suggestedAction"],
  assumptions: [
    PREMIUM_DECISION_DISCLAIMER,
    "Base cost includes material, weld labor, fit-up premium, gas/consumables and rework buffer.",
    "Overhead position factor and NDT inspection via hidden multipliers.",
  ],
  formulaSummary:
    "Base = (material + labor + fit-up premium + gas) × shop buffer × (1 + rework%); safe bid via MarginCore.",
  missingParameterWarnings: [],
  warningPolicy: createWarningPolicy({
    acceptedAssumptions: [
      "Rework risk entered as percent; fit-up hours billed at premium labor rate.",
    ],
    modelLimitations: [
      "Overhead and out-of-position welding factor via hidden multipliers only",
      "NDT / inspection scope not itemized per joint",
      "Premium decision layer not oracle-compared in Phase 5E",
    ],
    futureExtensions: [
      "Independent oracle for minimum safe welding bid",
      "Weld-length and procedure-specific consumable curves",
    ],
  }),
  validationRules: [
    { id: "labor-positive", description: "laborHours must be > 0", kind: "edge" },
    { id: "rework-percent", description: "reworkRiskPercent within 0–100%", kind: "dimensional" },
    { id: "margin-percent", description: "targetMargin is percent", kind: "dimensional" },
  ],
  scenarioTests: scenarioSkeletons([
    { id: "normal-fab", description: "Normal case: fabrication job with moderate rework risk" },
    { id: "edge-fit-up-heavy", description: "Edge case: fit-up hours dominate weld time" },
    { id: "absurd-zero-rate", description: "Absurd input: zero labor rate rejected" },
    { id: "directional-rework", description: "Directional: higher reworkRiskPercent raises safe bid" },
    { id: "sensitivity-margin", description: "Sensitivity: higher targetMargin raises minimum bid" },
  ]),
  monotonicityRules: [
    {
      id: "rework-up-risk",
      description: "Higher reworkRiskPercent must not decrease minimum safe price",
      inputKey: "reworkRiskPercent",
      direction: "increase_should_increase",
      outputKey: "minimumSafePrice",
    },
    {
      id: "labor-up-risk",
      description: "Higher laborHours must not decrease minimum safe price",
      inputKey: "laborHours",
      direction: "increase_should_increase",
      outputKey: "minimumSafePrice",
    },
    {
      id: "margin-down-risk",
      description: "Lower targetMargin must not decrease pricing risk floor",
      inputKey: "targetMargin",
      direction: "increase_should_increase",
      outputKey: "minimumSafePrice",
    },
  ],
  decisionLanguageRules: [STANDARD_DECISION_LANGUAGE_RULE],
  mustNotClaim: [...STANDARD_MUST_NOT_CLAIM, "Guaranteed weld bid acceptance"],
});

export const BATCH_EXPANSION_CRITICAL_FORMULA_CONTRACTS: readonly FormulaContract[] = [
  projectCostCalculatorContract,
  changeOrderImpactAnalyzerContract,
  cleaningCostCalculatorContract,
  officeCleaningBidOptimizerContract,
  foodCostCalculatorContract,
  menuProfitLeakDetectorContract,
  productMarginCalculatorContract,
  returnProfitErosionToolContract,
  weldingCostEstimatorContract,
  weldingBidRiskAnalyzerContract,
];

export const BATCH_EXPANSION_CRITICAL_SLUGS: readonly string[] =
  BATCH_EXPANSION_CRITICAL_FORMULA_CONTRACTS.map((contract) => contract.slug);
