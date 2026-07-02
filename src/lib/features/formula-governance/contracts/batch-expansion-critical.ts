/**
 * Phase 5E - next 10 critical FormulaContracts (skeleton coverage only).
 * No oracle, runtime scenarios, or production formula changes in this phase.
 */

import type { FormulaContract } from "@/lib/features/formula-governance/types";
import {
  FINANCIAL_SIMULATION_DISCLAIMER,
  GOVERNANCE_RECOMMENDED_PRICE_TARGET_NOTE,
  PREMIUM_DECISION_PRODUCTION_FILE,
  STANDARD_DECISION_LANGUAGE_RULE,
  STANDARD_MUST_NOT_CLAIM,
  buildAssuredCriticalContract,
  calculatorProductionAssumption,
  freeTrafficProductionAssumption,
} from "@/lib/features/formula-governance/contracts/shared";

export const BATCH_FREE_ORACLE_WIRED_SLUGS = [
  "project-cost-calculator",
  "cleaning-cost-calculator",
  "food-cost-calculator",
  "product-margin-calculator",
  "welding-cost-estimator",
] as const;

export const BATCH_PREMIUM_ORACLE_WIRED_SLUGS = [
  "change-order-impact-analyzer",
  "office-cleaning-bid-optimizer",
  "menu-profit-leak-detector",
  "return-profit-erosion-tool",
  "welding-bid-risk-analyzer",
] as const;

/** Phase 5G-A - next 10 critical contracts (skeleton only; oracle/property/scenario pending). */
export const BATCH_FREE_BATCH2_CRITICAL_SLUGS = [
  "sample-size-calculator",
  "hvac-tonnage-rule-check",
  "electrical-labor-estimator",
  "lawn-care-cost-check",
  "repair-time-vs-price-check",
  "print-job-cost-check",
  "plumbing-job-margin-verdict",
  "cabinet-cost-estimator",
  "roofing-square-cost-check",
  "laser-cutting-time-check",
] as const;

/** Phase 5G-C - paired premium / sector critical contracts (skeleton only). */
export const BATCH_PREMIUM_BATCH3_CRITICAL_SLUGS = [
  "hvac-project-margin-guard",
  "panel-shop-margin-verdict",
  "landscaping-contract-profit-tool",
  "auto-shop-margin-leak-detector",
  "signage-bid-safe-price-tool",
  "millwork-bid-risk-analyzer",
  "roofing-contract-margin-guard",
  "painting-job-profit-verdict",
  "sheet-metal-quote-risk-tool",
  "3d-print-cost-check",
] as const;

import { createWarningPolicy } from "@/lib/features/formula-governance/warning-policy";

const PREMIUM_DECISION_DISCLAIMER =
  "Technical simulation only - not financial, legal, or engineering advice. Verify assumptions before bid, pricing or business decisions.";

export const projectCostCalculatorContract: FormulaContract = buildAssuredCriticalContract({
  toolId: "revenue-free.project-cost-calculator",
  toolName: "Concrete / Project Cost Calculator",
  slug: "project-cost-calculator",
  purpose:
    "Estimate visible change-order exposure from original budget, change estimate and deadline pressure.",
  userDecision: "How much margin risk does this change order create against the original budget?",
  decisionImpact: "financial",
  requiredInputs: ["originalBudget", "changeEstimate", "deadlinePressureWastePercent"],
  criticalInputs: ["originalBudget", "changeEstimate", "deadlinePressure"],
  outputs: ["recommendedPrice", "adjustedChange", "changeRatioPercent", "wastePercent"],
  assumptions: [
    FINANCIAL_SIMULATION_DISCLAIMER,
    calculatorProductionAssumption(
      "src/lib/tools/free-tool-results.ts",
      "construction sector → changeOrderWastePercent + adjusted change ratio (RSMeans-style)",
    ),
    "Deadline pressure maps to RSMeans-style field waste: low 5%, medium 10%, high 15%.",
    "Delay days, crew standby and subcontractor pass-through excluded on free tier.",
  ],
  formulaSummary:
    "wastePercent from deadline pressure; adjustedChange = changeEstimate × (1 + wastePercent ÷ 100); changeRatioPercent = adjustedChange ÷ originalBudget × 100.",
  missingParameterWarnings: [],
  warningPolicy: createWarningPolicy({
    acceptedAssumptions: [
      "RSMeans-style waste factors applied to change estimate only.",
      GOVERNANCE_RECOMMENDED_PRICE_TARGET_NOTE,
      "recommendedPrice metadata alias equals change ratio percent (changeRatioPercent).",
      "Form select deadlinePressure maps to deadlinePressureWastePercent before canonical sanitize.",
    ],
    modelLimitations: [
      "Delay days and crew standby cost not modeled on free tier",
      "Subcontractor markup and permit fees not itemized",
      "Scope creep, labor productivity and permit/inspection costs not modeled",
    ],
    futureExtensions: [
      "Integration with change-order impact analyzer for margin verdict",
      "Risk-adjusted contingency model",
    ],
  }),
  validationRules: [
    { id: "budget-positive", description: "originalBudget must be > 0", kind: "edge" },
    { id: "change-non-negative", description: "changeEstimate must be ≥ 0", kind: "edge" },
    { id: "waste-percent", description: "deadlinePressureWastePercent within 0–100%", kind: "dimensional" },
    {
      id: "change-ratio-percent",
      description: "changeRatioPercent and recommendedPrice use percent semantics",
      kind: "dimensional",
    },
  ],
  scenarioSpecs: [
    { id: "normal-change", description: "Normal case: moderate change with low deadline pressure" },
    { id: "edge-high-pressure", description: "Edge case: high deadline pressure raises waste factor" },
    { id: "absurd-zero-budget", description: "Absurd input: zero original budget rejected" },
    { id: "directional-change", description: "Directional: higher change estimate increases adjusted change" },
    { id: "sensitivity-waste", description: "Sensitivity: higher waste percent increases adjusted change" },
  ],
  monotonicityRules: [
    {
      id: "change-up-adjusted",
      description: "Higher changeEstimate must not decrease adjusted change",
      inputKey: "changeEstimate",
      direction: "increase_should_increase",
      outputKey: "adjustedChange",
    },
    {
      id: "waste-up-adjusted",
      description: "Higher deadlinePressureWastePercent must not decrease adjusted change",
      inputKey: "deadlinePressureWastePercent",
      direction: "increase_should_increase",
      outputKey: "adjustedChange",
    },
    {
      id: "budget-down-ratio",
      description: "Lower originalBudget must not decrease change ratio percent when change fixed",
      inputKey: "originalBudget",
      direction: "increase_should_decrease",
      outputKey: "changeRatioPercent",
    },
  ],
  decisionLanguageRules: [STANDARD_DECISION_LANGUAGE_RULE],
  mustNotClaim: ["dummy"],
});

export const changeOrderImpactAnalyzerContract: FormulaContract = buildAssuredCriticalContract({
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
    calculatorProductionAssumption(
      "src/lib/calculators/change-order-impact-analyzer.ts",
      'runCalculator("change-order-impact-analyzer") → extra direct cost + minimum safe change price',
    ),
    "Change cost plus delay days × crew cost plus site overhead buffer.",
    "Hidden productivity slip and permit revision fees applied via risk engine multipliers.",
    "quoteVerdict and suggestedAction are narrative outputs; minimumSafePrice is numeric target.",
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
      "Contractual approval, delay penalties and indirect cost recovery not modeled",
    ],
    futureExtensions: [
      "Independent oracle for minimum safe change price",
      "Multi-trade ripple delay modeling",
      "Claim documentation score",
    ],
  }),
  validationRules: [
    { id: "budget-positive", description: "originalBudget must be > 0", kind: "edge" },
    { id: "delay-non-negative", description: "delayDays must be ≥ 0", kind: "edge" },
    { id: "margin-percent", description: "marginTarget is percent not decimal", kind: "dimensional" },
    {
      id: "verdict-non-numeric",
      description: "quoteVerdict and suggestedAction are narrative outputs; not numeric targets",
      kind: "purpose",
    },
  ],
  scenarioSpecs: [
    { id: "normal-change", description: "Normal case: moderate change with short delay" },
    { id: "edge-zero-delay", description: "Edge case: change cost only, zero delay days" },
    { id: "absurd-negative-delay", description: "Absurd input: negative delay days rejected" },
    { id: "directional-change-cost", description: "Directional: higher extra labor hours increase impact" },
    { id: "sensitivity-crew-rate", description: "Sensitivity: higher labor hourly rate widens minimum safe price" },
  ],
  monotonicityRules: [
    {
      id: "change-up-impact",
      description: "Higher extraLaborHours must not decrease minimum safe change price",
      inputKey: "extraLaborHours",
      direction: "increase_should_increase",
      outputKey: "minimumSafeChangePrice",
    },
    {
      id: "delay-up-impact",
      description: "Higher delayDays must not decrease schedule/cost impact",
      inputKey: "delayDays",
      direction: "increase_should_increase",
      outputKey: "minimumSafeChangePrice",
    },
    {
      id: "margin-up-floor",
      description: "Higher targetChangeMargin must not decrease minimum safe change price",
      inputKey: "targetChangeMargin",
      direction: "increase_should_increase",
      outputKey: "minimumSafeChangePrice",
    },
  ],
  decisionLanguageRules: [STANDARD_DECISION_LANGUAGE_RULE],
  mustNotClaim: [...STANDARD_MUST_NOT_CLAIM, "Guaranteed change-order acceptance outcome"],
});

export const cleaningCostCalculatorContract: FormulaContract = buildAssuredCriticalContract({
  toolId: "revenue-free.cleaning-cost-calculator",
  toolName: "Cleaning Cost Calculator",
  slug: "cleaning-cost-calculator",
  purpose: "Estimate monthly labor hours from area, staff count and visit frequency using ISSA productivity.",
  userDecision: "Does this cleaning contract workload look manageable for margin?",
  decisionImpact: "pricing",
  requiredInputs: ["areaSize", "staffCount", "visitFrequency"],
  criticalInputs: ["areaSize", "staffCount", "visitFrequency"],
  outputs: ["recommendedPrice", "monthlyHours", "workloadIndex", "hoursPerVisit"],
  assumptions: [
    FINANCIAL_SIMULATION_DISCLAIMER,
    calculatorProductionAssumption(
      "src/lib/tools/sector-formulas-b.ts",
      "calculateCleaningFreeResult → ISSA 2500 sqft/hr productivity benchmark",
    ),
    "hoursPerVisit = areaSize ÷ (2500 × staffCount); monthlyHours = hoursPerVisit × visitFrequency.",
    "Labor rate, supplies, travel and G&A overhead excluded on free tier.",
  ],
  formulaSummary:
    "ISSA 2500 sqft/hr per worker; monthlyHours = (areaSize ÷ (2500 × staffCount)) × visitFrequency; workloadIndex = staffCount × visitFrequency.",
  missingParameterWarnings: [],
  warningPolicy: createWarningPolicy({
    acceptedAssumptions: [
      "ISSA 2500 sqft/hr productivity benchmark per staff member.",
      GOVERNANCE_RECOMMENDED_PRICE_TARGET_NOTE,
      "recommendedPrice metadata alias equals estimated monthly hours (monthlyHours).",
    ],
    modelLimitations: [
      "Supervision, G&A and multi-site travel not allocated",
      "Supply inflation and restocking frequency not modeled",
      "Travel time, access complexity and crew productivity variation not modeled",
    ],
    futureExtensions: [
      "Monthly recurring bid optimizer integration",
      "Frequency-adjusted labor loading",
      "Recurring contract profitability modeling",
    ],
  }),
  validationRules: [
    { id: "area-positive", description: "areaSize must be > 0", kind: "edge" },
    { id: "staff-positive", description: "staffCount must be > 0", kind: "edge" },
    { id: "frequency-positive", description: "visitFrequency must be ≥ 1", kind: "edge" },
    {
      id: "hours-units",
      description: "monthlyHours and hoursPerVisit use consistent hour units",
      kind: "dimensional",
    },
  ],
  scenarioSpecs: [
    { id: "normal-office", description: "Normal case: mid-size office with standard visits" },
    { id: "edge-high-frequency", description: "Edge case: high visit frequency raises monthly hours" },
    { id: "absurd-zero-area", description: "Absurd input: zero area rejected" },
    { id: "directional-area", description: "Directional: larger area increases monthly hours" },
    { id: "sensitivity-staff", description: "Sensitivity: fewer staff increases hours per visit" },
  ],
  monotonicityRules: [
    {
      id: "area-up-hours",
      description: "Higher areaSize must not decrease monthly hours",
      inputKey: "areaSize",
      direction: "increase_should_increase",
      outputKey: "monthlyHours",
    },
    {
      id: "frequency-up-hours",
      description: "Higher visitFrequency must not decrease monthly hours",
      inputKey: "visitFrequency",
      direction: "increase_should_increase",
      outputKey: "monthlyHours",
    },
    {
      id: "staff-up-workload",
      description: "Higher staffCount must not decrease workload index",
      inputKey: "staffCount",
      direction: "increase_should_increase",
      outputKey: "workloadIndex",
    },
  ],
  decisionLanguageRules: [STANDARD_DECISION_LANGUAGE_RULE],
  mustNotClaim: ["dummy"],
});

export const officeCleaningBidOptimizerContract: FormulaContract = buildAssuredCriticalContract({
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
    calculatorProductionAssumption(
      "src/lib/calculators/office-cleaning-bid-optimizer.ts",
      'runCalculator("office-cleaning-bid-optimizer") → monthly direct cost + minimum safe bid',
    ),
    "Monthly labor = laborRate × hoursPerVisit × visitFrequency; supplies and overhead buffer added.",
    "Travel between sites and supervision G&A applied via hidden multipliers.",
    "quoteVerdict and suggestedAction are narrative outputs; minimumSafePrice is numeric target.",
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
      "Frequency, scope variation, churn risk and supply inflation not modeled explicitly",
    ],
    futureExtensions: [
      "Independent oracle for minimum monthly bid",
      "Route density and staff utilization modeling",
      "Seasonal visit intensity adjustments",
    ],
  }),
  validationRules: [
    { id: "frequency-positive", description: "visitFrequency must be ≥ 1", kind: "edge" },
    { id: "labor-rate-positive", description: "laborRate must be > 0", kind: "edge" },
    { id: "margin-percent", description: "targetMargin is percent", kind: "dimensional" },
    {
      id: "verdict-non-numeric",
      description: "quoteVerdict and suggestedAction are narrative outputs; not numeric targets",
      kind: "purpose",
    },
  ],
  scenarioSpecs: [
    { id: "normal-contract", description: "Normal case: weekly office visits with target margin" },
    { id: "edge-high-frequency", description: "Edge case: daily visit frequency" },
    { id: "absurd-zero-visits", description: "Absurd input: zero visit frequency rejected" },
    { id: "directional-labor-hours", description: "Directional: more hours per visit raises bid floor" },
    { id: "sensitivity-supply", description: "Sensitivity: higher supply cost raises minimum bid" },
  ],
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
  outputs: ["recommendedPrice", "foodCostPercent"],
  assumptions: [
    FINANCIAL_SIMULATION_DISCLAIMER,
    freeTrafficProductionAssumption("food-cost-calculator", "ingredient ÷ menu price × 100"),
    "Single menu item snapshot; food cost % = ingredientCost ÷ menuPrice × 100.",
    "Waste, labor, delivery commission and packaging excluded on free tier.",
  ],
  formulaSummary: "Food cost % = ingredientCost ÷ menuPrice × 100.",
  missingParameterWarnings: [],
  warningPolicy: createWarningPolicy({
    acceptedAssumptions: [
      "Simple food cost ratio without waste or labor allocation.",
      GOVERNANCE_RECOMMENDED_PRICE_TARGET_NOTE,
      "recommendedPrice metadata alias equals food cost percent (foodCostPercent).",
    ],
    modelLimitations: [
      "Kitchen labor and packaging not included",
      "Delivery commission and waste not modeled",
      "Spoilage, overhead and supplier volatility excluded unless modeled",
    ],
    futureExtensions: [
      "Menu profit leak detector integration for true margin",
      "Recipe-level waste and contribution margin modeling",
    ],
  }),
  validationRules: [
    { id: "ingredient-positive", description: "ingredientCost must be > 0", kind: "edge" },
    { id: "menu-price-positive", description: "menuPrice must be > 0", kind: "edge" },
    { id: "ratio-bounds", description: "Food cost percent stays within 0–100% for valid inputs", kind: "dimensional" },
    {
      id: "food-cost-percent-dimension",
      description: "foodCostPercent and recommendedPrice use percent semantics for governance target",
      kind: "dimensional",
    },
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
  mustNotClaim: ["dummy"],
});

export const menuProfitLeakDetectorContract: FormulaContract = buildAssuredCriticalContract({
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
    calculatorProductionAssumption(
      "src/lib/calculators/menu-profit-leak-detector.ts",
      'runCalculator("menu-profit-leak-detector") → item cost, margin and minimum safe price',
    ),
    "True cost includes waste-inflated ingredients, labor per item and delivery commission on menu price.",
    "Portion variance and rush-hour labor loaded via hidden multipliers.",
    "quoteVerdict and suggestedAction are narrative outputs; minimumSafePrice is numeric target.",
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
      "Demand mix, prep waste, platform commissions and shrinkage not fully modeled",
    ],
    futureExtensions: [
      "Independent oracle for minimum safe menu price",
      "Multi-item menu mix optimization",
      "Menu engineering matrix and category contribution analysis",
    ],
  }),
  validationRules: [
    { id: "menu-price-positive", description: "menuPrice must be > 0", kind: "edge" },
    { id: "waste-percent", description: "wasteRate is percent 0–100", kind: "dimensional" },
    { id: "commission-percent", description: "deliveryCommission is percent", kind: "dimensional" },
    {
      id: "verdict-non-numeric",
      description: "quoteVerdict and suggestedAction are narrative outputs; not numeric targets",
      kind: "purpose",
    },
  ],
  scenarioSpecs: [
    { id: "normal-item", description: "Normal case: dine-in item with moderate waste" },
    { id: "edge-high-delivery", description: "Edge case: high delivery commission mix" },
    { id: "absurd-waste", description: "Absurd input: waste rate above 100% rejected" },
    { id: "directional-waste", description: "Directional: higher wasteRate increases profit leak" },
    { id: "sensitivity-labor", description: "Sensitivity: higher laborCostPerItem widens leak" },
  ],
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
    "Estimate simplified DTC gross margin after COGS, fixed platform fee and return impact.",
  userDecision: "What gross margin does this SKU imply on the free simplified DTC model?",
  decisionImpact: "pricing",
  requiredInputs: ["productPrice", "productCost"],
  criticalInputs: ["productPrice", "productCost", "returnRate"],
  outputs: ["recommendedPrice", "marginPercent", "grossMargin", "totalCost"],
  assumptions: [
    FINANCIAL_SIMULATION_DISCLAIMER,
    calculatorProductionAssumption(
      "src/lib/tools/sector-formulas-b.ts",
      "calculateEcommerceFreeResult → calculateProductMarginResult with free-tier defaults",
    ),
    "Free tier defaults: shippingCost = 0, platformFeePercent = 3, return cost = sellingPrice × returnRate% × 0.5.",
    "Payment processing, ad spend and reverse logistics detail excluded on free tier.",
  ],
  formulaSummary:
    "platformFee = productPrice × 3%; returnCost = productPrice × returnRate% × 0.5; totalCost = productCost + platformFee + returnCost; marginPercent = (productPrice − totalCost) ÷ productPrice × 100.",
  missingParameterWarnings: [],
  warningPolicy: createWarningPolicy({
    acceptedAssumptions: [
      "Single-SKU gross margin snapshot without ad spend.",
      "shippingCost fixed at 0 and platformFeePercent fixed at 3 on free tier.",
      "returnRate defaults to 0 when omitted from form.",
      GOVERNANCE_RECOMMENDED_PRICE_TARGET_NOTE,
      "recommendedPrice metadata alias equals gross margin percent (marginPercent).",
    ],
    modelLimitations: [
      "Ad cost per sale not included on free tier",
      "Reverse logistics and restocking labor not itemized",
      "Discount and promotional pricing not modeled",
      "Payment processing fees and shipping not user-editable on free tier",
    ],
    futureExtensions: [
      "Return profit erosion tool integration for net margin verdict",
      "Channel-level contribution margin modeling",
    ],
  }),
  validationRules: [
    { id: "price-positive", description: "productPrice must be > 0", kind: "edge" },
    { id: "cost-non-negative", description: "productCost must be ≥ 0", kind: "edge" },
    { id: "return-percent", description: "returnRate within 0–100% when provided", kind: "dimensional" },
    {
      id: "margin-percent-dimension",
      description: "marginPercent and recommendedPrice use percent semantics for governance target",
      kind: "dimensional",
    },
  ],
  scenarioSpecs: [
    { id: "normal-sku", description: "Normal case: healthy margin SKU with default fees" },
    { id: "edge-high-returns", description: "Edge case: elevated return rate" },
    { id: "absurd-zero-price", description: "Absurd input: zero product price rejected" },
    { id: "directional-cost", description: "Directional: higher productCost lowers margin" },
    { id: "sensitivity-returns", description: "Sensitivity: higher return rate erodes margin" },
  ],
  monotonicityRules: [
    {
      id: "cost-up-margin",
      description: "Higher productCost must not improve margin percent",
      inputKey: "productCost",
      direction: "increase_should_decrease",
      outputKey: "marginPercent",
    },
    {
      id: "price-up-margin",
      description: "Higher productPrice must not decrease margin percent when costs fixed",
      inputKey: "productPrice",
      direction: "increase_should_increase",
      outputKey: "marginPercent",
    },
    {
      id: "return-up-margin",
      description: "Higher returnRate must not improve margin percent",
      inputKey: "returnRate",
      direction: "increase_should_decrease",
      outputKey: "marginPercent",
    },
  ],
  decisionLanguageRules: [STANDARD_DECISION_LANGUAGE_RULE],
  mustNotClaim: ["dummy"],
});

export const returnProfitErosionToolContract: FormulaContract = buildAssuredCriticalContract({
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
    calculatorProductionAssumption(
      "src/lib/calculators/return-rate-profit-erosion-tool.ts",
      'runCalculator("return-rate-profit-erosion-tool") → net profit, margin and return impact',
    ),
    "Return drag, reverse logistics, payment fees and ad cost stacked on product cost.",
    "Fraud reserve and CAC recovery applied via hidden multipliers.",
    "quoteVerdict and suggestedAction are narrative outputs; minimumSafePrice is numeric target.",
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
      "Restocking, resale loss, shipping recovery, fraud risk and customer service cost not fully modeled",
    ],
    futureExtensions: [
      "Independent oracle for minimum viable selling price",
      "Break-even ROAS scenario wiring",
      "SKU-level return risk scoring",
    ],
  }),
  validationRules: [
    { id: "price-positive", description: "productPrice must be > 0", kind: "edge" },
    { id: "return-percent", description: "returnRate within 0–100%", kind: "dimensional" },
    { id: "ad-cost-non-negative", description: "adCostPerSale must be ≥ 0", kind: "edge" },
    {
      id: "verdict-non-numeric",
      description: "quoteVerdict and suggestedAction are narrative outputs; not numeric targets",
      kind: "purpose",
    },
  ],
  scenarioSpecs: [
    { id: "normal-sku", description: "Normal case: moderate return rate and ad spend" },
    { id: "edge-high-returns", description: "Edge case: return rate above category norm" },
    { id: "absurd-return-rate", description: "Absurd input: return rate above 100% rejected" },
    { id: "directional-return", description: "Directional: higher returnRate increases erosion" },
    { id: "sensitivity-shipping", description: "Sensitivity: higher shippingCost widens erosion" },
  ],
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
  outputs: ["recommendedPrice", "estimatedCost", "laborCost"],
  assumptions: [
    FINANCIAL_SIMULATION_DISCLAIMER,
    freeTrafficProductionAssumption("welding-cost-estimator", "material + labor + consumables"),
    "Cost = material + laborHours × laborRate + consumables.",
    "Fit-up time, rework risk and NDT inspection excluded on free tier.",
  ],
  formulaSummary:
    "Estimated cost = materialCost + laborHours × laborRate + consumablesCost.",
  missingParameterWarnings: [],
  warningPolicy: createWarningPolicy({
    acceptedAssumptions: [
      "Visible material, labor and consumables only; no rework buffer.",
      GOVERNANCE_RECOMMENDED_PRICE_TARGET_NOTE,
      "recommendedPrice metadata alias equals estimated job cost (estimatedCost).",
    ],
    modelLimitations: [
      "Fit-up hours and gas consumables split not fully modeled on free tier",
      "Rework probability and position factor not included",
      "Setup, joint complexity, gas, rework and inspection excluded unless modeled",
    ],
    futureExtensions: [
      "Welding bid risk analyzer integration for safe bid floor",
      "WPS-aware cost model and defect probability",
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
    {
      id: "estimated-cost-dimension",
      description: "estimatedCost and recommendedPrice use currency semantics for governance target",
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
  mustNotClaim: ["dummy"],
});

export const weldingBidRiskAnalyzerContract: FormulaContract = buildAssuredCriticalContract({
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
    `Production: ${PREMIUM_DECISION_PRODUCTION_FILE} → BASE_COST_CALCULATORS["welding-bid-risk-analyzer"] → calcWelding + MarginCore floor`,
    "Base cost includes material, weld labor, fit-up premium, gas/consumables and rework buffer.",
    "Overhead position factor and NDT inspection via hidden multipliers.",
    "quoteVerdict and suggestedAction are narrative outputs; minimumSafePrice is numeric target.",
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
      "Material grade, position, inspection, rework, heat treatment and certification not fully modeled",
    ],
    futureExtensions: [
      "Independent oracle for minimum safe welding bid",
      "Weld-length and procedure-specific consumable curves",
      "Risk-adjusted bid floor and weld procedure trace",
    ],
  }),
  validationRules: [
    { id: "labor-positive", description: "laborHours must be > 0", kind: "edge" },
    { id: "rework-percent", description: "reworkRiskPercent within 0–100%", kind: "dimensional" },
    { id: "margin-percent", description: "targetMargin is percent", kind: "dimensional" },
    {
      id: "verdict-non-numeric",
      description: "quoteVerdict and suggestedAction are narrative outputs; not numeric targets",
      kind: "purpose",
    },
  ],
  scenarioSpecs: [
    { id: "normal-fab", description: "Normal case: fabrication job with moderate rework risk" },
    { id: "edge-fit-up-heavy", description: "Edge case: fit-up hours dominate weld time" },
    { id: "absurd-zero-rate", description: "Absurd input: zero labor rate rejected" },
    { id: "directional-rework", description: "Directional: higher reworkRiskPercent raises safe bid" },
    { id: "sensitivity-margin", description: "Sensitivity: higher targetMargin raises minimum bid" },
  ],
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

export const sampleSizeCalculatorContract: FormulaContract = buildAssuredCriticalContract({
  toolId: "free-traffic.sample-size-calculator",
  toolName: "Sample Size Calculator",
  slug: "sample-size-calculator",
  purpose:
    "Estimate required survey sample size from population, confidence level, margin of error and expected proportion.",
  userDecision: "How large a sample do I need for this population at the stated confidence and margin?",
  decisionImpact: "technical",
  requiredInputs: ["population", "confidenceZ", "marginErrorPercent", "proportionPercent"],
  criticalInputs: ["population", "confidenceZ", "marginErrorPercent", "proportionPercent"],
  outputs: ["recommendedPrice", "requiredSample", "infinitePopulationEstimate"],
  assumptions: [
    FINANCIAL_SIMULATION_DISCLAIMER,
    freeTrafficProductionAssumption("sample-size-calculator", "Cochran sample size"),
    "Cochran-style sample size with finite population correction when population > 0.",
  ],
  formulaSummary:
    "n₀ = z² × p × (1 − p) ÷ margin²; finite population n = n₀ ÷ (1 + (n₀ − 1) ÷ N); output ceil(sample).",
  missingParameterWarnings: [],
  warningPolicy: createWarningPolicy({
    acceptedAssumptions: [
      "Simple random sampling with stated confidence z-score and proportion estimate.",
      GOVERNANCE_RECOMMENDED_PRICE_TARGET_NOTE,
      "recommendedPrice metadata alias equals required sample count (requiredSample).",
    ],
    modelLimitations: [
      "Sampling bias and non-response not modeled",
      "Finite population correction only when population > 0",
      "Stratified or cluster sampling designs not supported",
      "Population assumptions, response quality and design effect not fully modeled",
    ],
    futureExtensions: [
      "Independent oracle for sample size with confidence interval validation",
      "Design effect factor for cluster samples",
      "Stratified sample and finite population correction modes",
    ],
  }),
  validationRules: [
    { id: "margin-positive", description: "marginErrorPercent must be > 0", kind: "edge" },
    { id: "proportion-percent", description: "proportionPercent within 0–100%", kind: "dimensional" },
    { id: "population-non-negative", description: "population must be ≥ 0", kind: "edge" },
    {
      id: "sample-count-dimension",
      description: "requiredSample and recommendedPrice use count semantics for governance target",
      kind: "dimensional",
    },
  ],
  scenarioSpecs: [
    { id: "normal-survey", description: "Normal case: finite population with 95% confidence" },
    { id: "edge-large-population", description: "Edge case: large population approaches infinite correction" },
    { id: "absurd-zero-margin", description: "Absurd input: zero margin of error rejected" },
    { id: "directional-confidence", description: "Directional: higher z widens required sample" },
    { id: "sensitivity-proportion", description: "Sensitivity: proportion near 50% increases sample need" },
  ],
  monotonicityRules: [
    {
      id: "margin-down-sample",
      description: "Lower marginErrorPercent must not decrease required sample size",
      inputKey: "marginErrorPercent",
      direction: "increase_should_decrease",
      outputKey: "requiredSample",
    },
    {
      id: "z-up-sample",
      description: "Higher confidenceZ must not decrease required sample size",
      inputKey: "confidenceZ",
      direction: "increase_should_increase",
      outputKey: "requiredSample",
    },
    {
      id: "population-up-sample",
      description: "Larger finite population must not decrease required sample below infinite estimate",
      inputKey: "population",
      direction: "increase_should_increase",
      outputKey: "requiredSample",
    },
  ],
  decisionLanguageRules: [STANDARD_DECISION_LANGUAGE_RULE],
  mustNotClaim: [...STANDARD_MUST_NOT_CLAIM, "Statistically valid survey guarantee"],
});

export const hvacTonnageRuleCheckContract: FormulaContract = buildAssuredCriticalContract({
  toolId: "revenue-free.hvac-tonnage-rule-check",
  toolName: "HVAC Tonnage Rule Check",
  slug: "hvac-tonnage-rule-check",
  purpose:
    "Quick-check HVAC tonnage vs simplified ASHRAE/Manual J load estimate for visible sizing risk.",
  userDecision: "Is the specified tonnage reasonable for this square footage and labor exposure?",
  decisionImpact: "technical",
  requiredInputs: ["squareFootage", "tonnage", "laborHours"],
  criticalInputs: ["squareFootage", "tonnage", "laborHours"],
  outputs: ["recommendedPrice", "recommendedTons", "totalBtu", "riskLevel"],
  assumptions: [
    FINANCIAL_SIMULATION_DISCLAIMER,
    calculatorProductionAssumption(
      "src/lib/tools/free-sector-calculations.ts",
      "calculateHvacFreeResult → calculateHvacTonnageResult (ASHRAE defaults)",
    ),
    "Rule-of-thumb load model with average insulation and moderate climate defaults.",
    "riskLevel is a narrative risk signal; recommendedTons is the primary numeric sizing target.",
  ],
  formulaSummary:
    "ASHRAE simplified BTU load from area, window and occupancy factors; tons = BTU ÷ 12000; compare specified tonnage to recommended sizing band.",
  missingParameterWarnings: [],
  warningPolicy: createWarningPolicy({
    acceptedAssumptions: [
      "Average insulation, 15% window area and moderate climate unless overridden in premium tier.",
      GOVERNANCE_RECOMMENDED_PRICE_TARGET_NOTE,
      "recommendedPrice metadata alias equals recommended tonnage (recommendedTons).",
    ],
    modelLimitations: [
      "Rule-of-thumb only - full Manual J / climate envelope not modeled",
      "Duct leakage, ventilation and latent load not itemized on free tier",
      "Equipment efficiency and line-set length excluded",
      "Climate zone, insulation, window load and duct loss excluded unless modeled",
    ],
    futureExtensions: [
      "Oracle for ASHRAE tonnage baseline",
      "HVAC project margin guard integration for callback risk",
      "Envelope-aware load model",
    ],
  }),
  validationRules: [
    { id: "area-positive", description: "squareFootage must be > 0", kind: "edge" },
    { id: "tonnage-non-negative", description: "tonnage must be ≥ 0", kind: "edge" },
    { id: "labor-non-negative", description: "laborHours must be ≥ 0", kind: "edge" },
    { id: "tonnage-ratio", description: "tonnage ratio vs ASHRAE load stays within 0–200%", kind: "dimensional" },
    {
      id: "risk-level-purpose",
      description: "riskLevel is a narrative output; recommendedTons is the numeric sizing target",
      kind: "purpose",
    },
  ],
  scenarioSpecs: [
    { id: "normal-office", description: "Normal case: mid-size office with matched tonnage" },
    { id: "edge-undersized", description: "Edge case: tonnage below 70% of load estimate" },
    { id: "absurd-zero-area", description: "Absurd input: zero square footage rejected" },
    { id: "directional-area", description: "Directional: larger area increases recommended tons" },
    { id: "sensitivity-labor", description: "Sensitivity: high labor hours raises margin check signal" },
  ],
  monotonicityRules: [
    {
      id: "area-up-load",
      description: "Higher squareFootage must not decrease recommended tonnage",
      inputKey: "squareFootage",
      direction: "increase_should_increase",
      outputKey: "recommendedTons",
    },
    {
      id: "tonnage-ratio",
      description: "Lower specified tonnage must not improve undersize risk signal",
      inputKey: "tonnage",
      direction: "increase_should_decrease",
      outputKey: "riskLevel",
    },
    {
      id: "labor-up-exposure",
      description: "Higher laborHours must not decrease install exposure signal",
      inputKey: "laborHours",
      direction: "increase_should_increase",
      outputKey: "riskLevel",
    },
  ],
  decisionLanguageRules: [STANDARD_DECISION_LANGUAGE_RULE],
  mustNotClaim: [...STANDARD_MUST_NOT_CLAIM, "ASHRAE-certified load calculation"],
});

export const electricalLaborEstimatorContract: FormulaContract = buildAssuredCriticalContract({
  toolId: "revenue-free.electrical-labor-estimator",
  toolName: "Electrical Labor Estimator",
  slug: "electrical-labor-estimator",
  purpose:
    "Estimate visible electrical labor vs material ratio and flag under-scoped panel or shop work.",
  userDecision: "Does labor cover material load before inspection and testing time?",
  decisionImpact: "pricing",
  requiredInputs: ["materialCost", "laborHours", "laborRate"],
  criticalInputs: ["materialCost", "laborHours", "laborRate"],
  outputs: ["recommendedPrice", "riskLevel", "laborCost", "laborMaterialRatio"],
  assumptions: [
    FINANCIAL_SIMULATION_DISCLAIMER,
    calculatorProductionAssumption(
      "src/lib/tools/free-sector-calculations.ts",
      "calculateElectricalFreeResult → laborHours × laborRate",
    ),
    "Labor cost = laborHours × laborRate; ratio compared to NEC estimating band (~40–65% commercial).",
    "riskLevel is a narrative risk signal; laborCost is the primary numeric labor estimate target.",
  ],
  formulaSummary:
    "Labor/material ratio = (laborHours × laborRate) ÷ materialCost; risk bands when ratio < 40% on long jobs or labor hours ≥ 16.",
  missingParameterWarnings: [],
  warningPolicy: createWarningPolicy({
    acceptedAssumptions: [
      "Flat labor rate and material cost snapshot per job.",
      GOVERNANCE_RECOMMENDED_PRICE_TARGET_NOTE,
      "recommendedPrice metadata alias equals electrical labor cost estimate (laborCost).",
    ],
    modelLimitations: [
      "Local code, permit and panel complexity not modeled",
      "Inspection, rework and access constraints excluded on free tier",
      "Conduit fill, derating and specialty gear not itemized",
    ],
    futureExtensions: [
      "Code-aware panel and circuit complexity model",
      "Oracle for labor/material ratio bands",
      "Panel shop margin verdict integration for inspection risk",
    ],
  }),
  validationRules: [
    { id: "hours-non-negative", description: "laborHours must be ≥ 0", kind: "edge" },
    { id: "material-non-negative", description: "materialCost must be ≥ 0", kind: "edge" },
    { id: "rate-positive", description: "laborRate must be > 0 when hours > 0", kind: "edge" },
    { id: "ratio-percent", description: "laborMaterialRatio stays within 0–500%", kind: "dimensional" },
    {
      id: "labor-cost-dimension",
      description: "laborCost and recommendedPrice use currency semantics for governance target",
      kind: "purpose",
    },
  ],
  scenarioSpecs: [
    { id: "normal-panel-job", description: "Normal case: balanced labor/material ratio" },
    { id: "edge-labor-heavy", description: "Edge case: long labor hours trigger bid check" },
    { id: "absurd-negative-cost", description: "Absurd input: negative material cost rejected" },
    { id: "directional-labor", description: "Directional: more labor hours increase labor cost" },
    { id: "sensitivity-rate", description: "Sensitivity: higher labor rate widens ratio" },
  ],
  monotonicityRules: [
    {
      id: "hours-up-labor",
      description: "Higher laborHours must not decrease labor cost",
      inputKey: "laborHours",
      direction: "increase_should_increase",
      outputKey: "laborCost",
    },
    {
      id: "rate-up-labor",
      description: "Higher laborRate must not decrease labor cost",
      inputKey: "laborRate",
      direction: "increase_should_increase",
      outputKey: "laborCost",
    },
    {
      id: "material-up-ratio",
      description: "Higher materialCost must not increase labor/material ratio",
      inputKey: "materialCost",
      direction: "increase_should_decrease",
      outputKey: "laborMaterialRatio",
    },
  ],
  decisionLanguageRules: [STANDARD_DECISION_LANGUAGE_RULE],
  mustNotClaim: [...STANDARD_MUST_NOT_CLAIM, "NEC code compliance certification"],
});

export const lawnCareCostCheckContract: FormulaContract = buildAssuredCriticalContract({
  toolId: "revenue-free.lawn-care-cost-check",
  toolName: "Lawn Care Cost Check",
  slug: "lawn-care-cost-check",
  purpose:
    "Check monthly crew-hour load for recurring lawn routes and visible underpricing risk.",
  userDecision: "Is this visit schedule likely underpriced before fuel and equipment wear?",
  decisionImpact: "pricing",
  requiredInputs: ["crewHoursPerVisit", "visitsPerMonth", "laborRate"],
  criticalInputs: ["crewHoursPerVisit", "visitsPerMonth", "laborRate"],
  outputs: ["recommendedPrice", "riskLevel", "monthlyCrewHours"],
  assumptions: [
    FINANCIAL_SIMULATION_DISCLAIMER,
    calculatorProductionAssumption(
      "src/lib/tools/free-sector-calculations.ts",
      "calculateLandscapingFreeResult → crewHoursPerVisit × visitsPerMonth",
    ),
    "Monthly load = crewHoursPerVisit × visitsPerMonth; NALP-style route benchmarks for risk bands.",
    "riskLevel is a narrative risk signal; monthlyCrewHours is the primary numeric visit-load target.",
  ],
  formulaSummary:
    "monthlyCrewHours = crewHoursPerVisit × visitsPerMonth; HIGH risk when load ≥ 40 hr/month; MEDIUM when ≥ 20 hr/month.",
  missingParameterWarnings: [],
  warningPolicy: createWarningPolicy({
    acceptedAssumptions: [
      "Single-route snapshot; crew hours per visit entered by operator.",
      GOVERNANCE_RECOMMENDED_PRICE_TARGET_NOTE,
      "recommendedPrice metadata alias equals monthly crew-hour load (monthlyCrewHours).",
    ],
    modelLimitations: [
      "Route density, seasonality and weather not modeled",
      "Equipment utilization and crew productivity excluded on free tier",
      "Fuel, equipment wear and travel between sites excluded on free tier",
    ],
    futureExtensions: [
      "Recurring route profitability and seasonality model",
      "Oracle for monthly route cost floor",
      "Landscaping contract profit tool integration",
    ],
  }),
  validationRules: [
    { id: "hours-non-negative", description: "crewHoursPerVisit must be ≥ 0", kind: "edge" },
    { id: "visits-positive", description: "visitsPerMonth must be ≥ 1", kind: "edge" },
    { id: "rate-non-negative", description: "laborRate must be ≥ 0", kind: "dimensional" },
    {
      id: "monthly-hours-dimension",
      description: "monthlyCrewHours and recommendedPrice use hour semantics for governance target",
      kind: "purpose",
    },
  ],
  scenarioSpecs: [
    { id: "normal-route", description: "Normal case: moderate weekly visit load" },
    { id: "edge-heavy-route", description: "Edge case: monthly load above 40 crew-hours" },
    { id: "absurd-negative-hours", description: "Absurd input: negative crew hours rejected" },
    { id: "directional-visits", description: "Directional: more visits increase monthly load" },
    { id: "sensitivity-hours", description: "Sensitivity: longer visits widen monthly load" },
  ],
  monotonicityRules: [
    {
      id: "visits-up-load",
      description: "Higher visitsPerMonth must not decrease monthly crew hours",
      inputKey: "visitsPerMonth",
      direction: "increase_should_increase",
      outputKey: "monthlyCrewHours",
    },
    {
      id: "hours-up-load",
      description: "Higher crewHoursPerVisit must not decrease monthly crew hours",
      inputKey: "crewHoursPerVisit",
      direction: "increase_should_increase",
      outputKey: "monthlyCrewHours",
    },
    {
      id: "load-up-risk",
      description: "Higher monthly crew hours must not lower route risk severity",
      inputKey: "crewHoursPerVisit",
      direction: "increase_should_increase",
      outputKey: "riskLevel",
    },
  ],
  decisionLanguageRules: [STANDARD_DECISION_LANGUAGE_RULE],
  mustNotClaim: [...STANDARD_MUST_NOT_CLAIM, "Guaranteed contract profitability"],
});

export const repairTimeVsPriceCheckContract: FormulaContract = buildAssuredCriticalContract({
  toolId: "revenue-free.repair-time-vs-price-check",
  toolName: "Repair Time vs Price Check",
  slug: "repair-time-vs-price-check",
  purpose:
    "Compare quoted repair price to visible labor and parts burden using Mitchell-style book time reference.",
  userDecision: "Does the quoted price cover visible labor and parts before diagnostic and comeback risk?",
  decisionImpact: "pricing",
  requiredInputs: ["quotedPrice", "repairHours", "partsCost"],
  criticalInputs: ["quotedPrice", "repairHours", "partsCost"],
  outputs: ["recommendedPrice", "riskLevel", "burdenedCost", "bookHoursDelta"],
  assumptions: [
    FINANCIAL_SIMULATION_DISCLAIMER,
    calculatorProductionAssumption(
      "src/lib/tools/free-sector-calculations.ts",
      "calculateAutoRepairFreeResult → calculateRepairTimeResult",
    ),
    "Default shop rate $80/hr; diagnostic allowance 0.75 hr added to burdened cost.",
    "riskLevel is a narrative risk signal; burdenedCost is the primary numeric time/cost vs price target.",
  ],
  formulaSummary:
    "visibleCost = repairHours × shopRate + partsCost; burdenedCost = visibleCost + diagnosticAllowance; compare to quotedPrice and Mitchell book hours.",
  missingParameterWarnings: [],
  warningPolicy: createWarningPolicy({
    acceptedAssumptions: [
      "Flat shop rate and parts cost per job; Mitchell brake-pad reference for book time delta.",
      GOVERNANCE_RECOMMENDED_PRICE_TARGET_NOTE,
      "recommendedPrice metadata alias equals visible burdened repair cost (burdenedCost).",
    ],
    modelLimitations: [
      "Diagnostic uncertainty and parts availability not modeled",
      "Warranty comeback and shop utilization excluded on free tier",
      "Vehicle-specific book time variance simplified",
    ],
    futureExtensions: [
      "Warranty comeback and technician efficiency model",
      "Oracle for burdened cost vs quote",
      "Auto shop margin leak detector integration",
    ],
  }),
  validationRules: [
    { id: "quote-non-negative", description: "quotedPrice must be ≥ 0", kind: "edge" },
    { id: "hours-non-negative", description: "repairHours must be ≥ 0", kind: "edge" },
    { id: "parts-non-negative", description: "partsCost must be ≥ 0", kind: "edge" },
    { id: "burden-ratio", description: "burdenedCost ÷ quotedPrice stays within 0–200%", kind: "dimensional" },
    {
      id: "burdened-cost-dimension",
      description: "burdenedCost and recommendedPrice use currency semantics for governance target",
      kind: "purpose",
    },
  ],
  scenarioSpecs: [
    { id: "normal-brake-job", description: "Normal case: quote above burdened cost" },
    { id: "edge-thin-quote", description: "Edge case: burdened cost ≥ 75% of quoted price" },
    { id: "absurd-negative-quote", description: "Absurd input: negative quoted price rejected" },
    { id: "directional-hours", description: "Directional: more repair hours increase burdened cost" },
    { id: "sensitivity-parts", description: "Sensitivity: higher parts cost widens burdened cost" },
  ],
  monotonicityRules: [
    {
      id: "hours-up-burden",
      description: "Higher repairHours must not decrease burdened cost",
      inputKey: "repairHours",
      direction: "increase_should_increase",
      outputKey: "burdenedCost",
    },
    {
      id: "parts-up-burden",
      description: "Higher partsCost must not decrease burdened cost",
      inputKey: "partsCost",
      direction: "increase_should_increase",
      outputKey: "burdenedCost",
    },
    {
      id: "quote-down-risk",
      description: "Lower quotedPrice must not improve underpricing risk signal",
      inputKey: "quotedPrice",
      direction: "increase_should_decrease",
      outputKey: "riskLevel",
    },
  ],
  decisionLanguageRules: [STANDARD_DECISION_LANGUAGE_RULE],
  mustNotClaim: [...STANDARD_MUST_NOT_CLAIM, "Guaranteed job profitability"],
});

export const printJobCostCheckContract: FormulaContract = buildAssuredCriticalContract({
  toolId: "revenue-free.print-job-cost-check",
  toolName: "Print Job Cost Check",
  slug: "print-job-cost-check",
  purpose:
    "Estimate visible print/signage design and material exposure before reprint and install risk.",
  userDecision: "Is design time likely to erode margin relative to material cost?",
  decisionImpact: "pricing",
  requiredInputs: ["materialCost", "designHours", "laborRate"],
  criticalInputs: ["materialCost", "designHours", "laborRate"],
  outputs: ["recommendedPrice", "riskLevel", "designCost", "designMaterialRatio"],
  assumptions: [
    FINANCIAL_SIMULATION_DISCLAIMER,
    calculatorProductionAssumption(
      "src/lib/tools/free-sector-calculations.ts",
      "calculatePrintingFreeResult → designHours × laborRate",
    ),
    "Design cost = designHours × laborRate; SGIA-style design/material ratio thresholds.",
    "riskLevel is a narrative risk signal; designCost is the primary numeric print job cost target.",
  ],
  formulaSummary:
    "designCost = designHours × laborRate; ratio = designCost ÷ materialCost; HIGH when ratio ≥ 1.2.",
  missingParameterWarnings: [],
  warningPolicy: createWarningPolicy({
    acceptedAssumptions: [
      "Flat labor rate for design time; material cost entered as job snapshot.",
      GOVERNANCE_RECOMMENDED_PRICE_TARGET_NOTE,
      "recommendedPrice metadata alias equals visible print job design cost (designCost).",
    ],
    modelLimitations: [
      "Spoilage, color calibration and finishing complexity not modeled",
      "Setup time and machine downtime excluded on free tier",
      "Install labor excluded",
    ],
    futureExtensions: [
      "Press-specific spoilage and finishing complexity model",
      "Oracle for design/material ratio bands",
      "Signage bid safe price tool integration",
    ],
  }),
  validationRules: [
    { id: "material-non-negative", description: "materialCost must be ≥ 0", kind: "edge" },
    { id: "hours-non-negative", description: "designHours must be ≥ 0", kind: "edge" },
    { id: "rate-positive", description: "laborRate must be > 0 when design hours > 0", kind: "edge" },
    { id: "ratio-bounds", description: "designMaterialRatio stays within 0–5.0", kind: "dimensional" },
    {
      id: "design-cost-dimension",
      description: "designCost and recommendedPrice use currency semantics for governance target",
      kind: "purpose",
    },
  ],
  scenarioSpecs: [
    { id: "normal-signage", description: "Normal case: balanced design/material ratio" },
    { id: "edge-design-heavy", description: "Edge case: design/material ratio above 1.2" },
    { id: "absurd-negative-material", description: "Absurd input: negative material cost rejected" },
    { id: "directional-design", description: "Directional: more design hours increase design cost" },
    { id: "sensitivity-rate", description: "Sensitivity: higher labor rate widens design cost" },
  ],
  monotonicityRules: [
    {
      id: "hours-up-design",
      description: "Higher designHours must not decrease design cost",
      inputKey: "designHours",
      direction: "increase_should_increase",
      outputKey: "designCost",
    },
    {
      id: "rate-up-design",
      description: "Higher laborRate must not decrease design cost",
      inputKey: "laborRate",
      direction: "increase_should_increase",
      outputKey: "designCost",
    },
    {
      id: "material-down-ratio",
      description: "Lower materialCost must not decrease design/material ratio",
      inputKey: "materialCost",
      direction: "increase_should_decrease",
      outputKey: "designMaterialRatio",
    },
  ],
  decisionLanguageRules: [STANDARD_DECISION_LANGUAGE_RULE],
  mustNotClaim: [...STANDARD_MUST_NOT_CLAIM, "Guaranteed print margin"],
});

export const plumbingJobMarginVerdictContract: FormulaContract = buildAssuredCriticalContract({
  toolId: "revenue-premium.plumbing-job-margin-verdict",
  toolName: "Plumbing Job Margin Verdict",
  slug: "plumbing-job-margin-verdict",
  purpose:
    "Find safe plumbing job price with callback risk, material runs and access difficulty included.",
  userDecision: "Is this plumbing job priced safely given parts, labor and callback exposure?",
  decisionImpact: "pricing",
  requiredInputs: [
    "partsCost",
    "laborHours",
    "laborRate",
    "fixtureCount",
    "materialRunCost",
    "callbackRiskPercent",
    "targetMargin",
  ],
  criticalInputs: [
    "partsCost",
    "laborHours",
    "laborRate",
    "fixtureCount",
    "materialRunCost",
    "callbackRiskPercent",
    "targetMargin",
  ],
  outputs: ["minimumSafePrice", "quoteVerdict", "p90Cost", "baseCost"],
  assumptions: [
    PREMIUM_DECISION_DISCLAIMER,
    "Production: src/lib/tools/premium-decision-engine.ts → calcPlumbing + MarginCore floor.",
    "Base = parts + labor + material runs + fixture allowance + access/permit buffers × callback%.",
  ],
  formulaSummary:
    "baseCost = (parts + labor + materialRun + fixtureAllowance + access + permit) × (1 + callback%); safe price via hidden multipliers and volatility buffer.",
  missingParameterWarnings: [],
  warningPolicy: createWarningPolicy({
    acceptedAssumptions: [
      "Fixture allowance $25 per fixture; access 15% and permit 10% of labor.",
      "Governance ontology target minimumSafePrice maps to the premium margin floor output documented in formulaSummary.",
    ],
    modelLimitations: [
      "Concealed damage discovery and emergency premium not modeled explicitly",
      "Permit fees and call-back risk loaded via hidden multipliers only",
      "Parts availability and water damage liability simplified",
    ],
    futureExtensions: [
      "Risk-adjusted plumbing bid floor model",
      "Independent oracle for minimum safe job price",
      "Multi-fixture complexity curves",
    ],
  }),
  validationRules: [
    { id: "labor-positive", description: "laborHours must be > 0 for priced jobs", kind: "edge" },
    { id: "rate-positive", description: "laborRate must be > 0", kind: "edge" },
    { id: "callback-percent", description: "callbackRiskPercent within 0–100%", kind: "dimensional" },
    { id: "margin-percent", description: "targetMargin is percent", kind: "dimensional" },
    {
      id: "safe-price-dimension",
      description: "minimumSafePrice uses currency semantics for governance margin verdict target",
      kind: "purpose",
    },
  ],
  scenarioSpecs: [
    { id: "normal-fixture-job", description: "Normal case: multi-fixture job with moderate callback risk" },
    { id: "edge-high-callback", description: "Edge case: callback risk above 15%" },
    { id: "absurd-zero-rate", description: "Absurd input: zero labor rate rejected" },
    { id: "directional-parts", description: "Directional: higher partsCost raises base cost" },
    { id: "sensitivity-margin", description: "Sensitivity: higher targetMargin raises minimum safe price" },
  ],
  monotonicityRules: [
    {
      id: "parts-up-floor",
      description: "Higher partsCost must not decrease minimum safe price",
      inputKey: "partsCost",
      direction: "increase_should_increase",
      outputKey: "minimumSafePrice",
    },
    {
      id: "callback-up-floor",
      description: "Higher callbackRiskPercent must not decrease minimum safe price",
      inputKey: "callbackRiskPercent",
      direction: "increase_should_increase",
      outputKey: "minimumSafePrice",
    },
    {
      id: "margin-up-floor",
      description: "Higher targetMargin must not decrease minimum safe price",
      inputKey: "targetMargin",
      direction: "increase_should_increase",
      outputKey: "minimumSafePrice",
    },
  ],
  decisionLanguageRules: [STANDARD_DECISION_LANGUAGE_RULE],
  mustNotClaim: [...STANDARD_MUST_NOT_CLAIM, "Guaranteed plumbing job acceptance"],
});

export const cabinetCostEstimatorContract: FormulaContract = buildAssuredCriticalContract({
  toolId: "revenue-free.cabinet-cost-estimator",
  toolName: "Cabinet Cost Estimator",
  slug: "cabinet-cost-estimator",
  purpose:
    "Estimate visible millwork shop and install hour exposure before waste and finishing buffers.",
  userDecision: "Are shop and install hours adequate before waste and finishing risk?",
  decisionImpact: "pricing",
  requiredInputs: ["sheetMaterialCost", "laborHours", "installHours"],
  criticalInputs: ["sheetMaterialCost", "laborHours", "installHours"],
  outputs: ["recommendedPrice", "riskLevel", "totalHours", "wasteAdjustedHours"],
  assumptions: [
    FINANCIAL_SIMULATION_DISCLAIMER,
    calculatorProductionAssumption(
      "src/lib/tools/free-sector-calculations.ts",
      "calculateCarpentryFreeResult → shop+install hours × waste factor",
    ),
    "WWPA 12% waste factor applied to total shop+install hours for effective load.",
    "riskLevel is a narrative risk signal; wasteAdjustedHours is the primary numeric carpentry load target.",
  ],
  formulaSummary:
    "totalHours = laborHours + installHours; wasteAdjustedHours = totalHours × 1.12; risk bands at 12 hr and 24 hr thresholds.",
  missingParameterWarnings: [],
  warningPolicy: createWarningPolicy({
    acceptedAssumptions: [
      "Flat shop and install hours; 12% WWPA waste factor on free tier.",
      GOVERNANCE_RECOMMENDED_PRICE_TARGET_NOTE,
      "recommendedPrice metadata alias equals waste-adjusted shop+install hours (wasteAdjustedHours).",
    ],
    modelLimitations: [
      "Finish grade, hardware variation and field measurement risk not fully modeled",
      "Install complexity and finishing schedule delay excluded on free tier",
      "Sheet material cost collected but not used in free risk signal",
    ],
    futureExtensions: [
      "Cut-list and hardware-aware cost model",
      "Oracle for millwork hour and waste baseline",
      "Millwork bid risk analyzer integration",
    ],
  }),
  validationRules: [
    { id: "hours-non-negative", description: "laborHours and installHours must be ≥ 0", kind: "edge" },
    { id: "material-non-negative", description: "sheetMaterialCost must be ≥ 0", kind: "edge" },
    { id: "total-hours-positive", description: "At least one of labor or install hours must be > 0", kind: "edge" },
    { id: "waste-factor", description: "wasteAdjustedHours = totalHours × 1.12", kind: "dimensional" },
    {
      id: "waste-hours-dimension",
      description: "wasteAdjustedHours and recommendedPrice use hour semantics for governance target",
      kind: "purpose",
    },
  ],
  scenarioSpecs: [
    { id: "normal-cabinet-job", description: "Normal case: moderate shop+install hours" },
    { id: "edge-long-install", description: "Edge case: total hours above 24" },
    { id: "absurd-negative-hours", description: "Absurd input: negative labor hours rejected" },
    { id: "directional-install", description: "Directional: more install hours increase total hours" },
    { id: "sensitivity-waste", description: "Sensitivity: waste factor increases effective hours" },
  ],
  monotonicityRules: [
    {
      id: "labor-up-total",
      description: "Higher laborHours must not decrease total hours",
      inputKey: "laborHours",
      direction: "increase_should_increase",
      outputKey: "totalHours",
    },
    {
      id: "install-up-total",
      description: "Higher installHours must not decrease total hours",
      inputKey: "installHours",
      direction: "increase_should_increase",
      outputKey: "totalHours",
    },
    {
      id: "total-up-waste",
      description: "Higher total hours must not decrease waste-adjusted hours",
      inputKey: "laborHours",
      direction: "increase_should_increase",
      outputKey: "wasteAdjustedHours",
    },
  ],
  decisionLanguageRules: [STANDARD_DECISION_LANGUAGE_RULE],
  mustNotClaim: [...STANDARD_MUST_NOT_CLAIM, "Guaranteed millwork bid"],
});

export const roofingSquareCostCheckContract: FormulaContract = buildAssuredCriticalContract({
  toolId: "revenue-free.roofing-square-cost-check",
  toolName: "Roofing Square Cost Check",
  slug: "roofing-square-cost-check",
  purpose:
    "Check roofing labor vs material ratio against NRCA square costing reference for tear-off risk signals.",
  userDecision: "Does labor cover material load before tear-off, pitch and weather delay risk?",
  decisionImpact: "pricing",
  requiredInputs: ["materialCost", "laborHours", "laborRate"],
  criticalInputs: ["materialCost", "laborHours", "laborRate"],
  outputs: ["recommendedPrice", "riskLevel", "laborCost", "nrcaEstimate"],
  assumptions: [
    FINANCIAL_SIMULATION_DISCLAIMER,
    calculatorProductionAssumption(
      "src/lib/tools/free-sector-calculations.ts",
      "calculateRoofingFreeResult → calculateRoofingCostResult",
    ),
    "Area inferred from material cost; NRCA asphalt shingle reference with tear-off.",
    "riskLevel is a narrative risk signal; nrcaEstimate is the primary numeric square cost target.",
  ],
  formulaSummary:
    "laborCost = laborHours × laborRate; compare labor/material ratio to NRCA guide (~45%); HIGH when ratio low on long jobs.",
  missingParameterWarnings: [],
  warningPolicy: createWarningPolicy({
    acceptedAssumptions: [
      "Asphalt shingle, 22° pitch, single story and tear-off defaults in NRCA helper.",
      GOVERNANCE_RECOMMENDED_PRICE_TARGET_NOTE,
      "recommendedPrice metadata alias equals NRCA square cost estimate (nrcaEstimate).",
    ],
    modelLimitations: [
      "Pitch, tear-off layers and access complexity may require override",
      "Disposal, weather delay and local code not modeled on free tier",
      "Dump fees and ice-dam membrane excluded",
    ],
    futureExtensions: [
      "Pitch and tear-off adjusted roofing estimator",
      "Oracle for NRCA square cost baseline",
      "Roofing contract margin guard integration",
    ],
  }),
  validationRules: [
    { id: "material-non-negative", description: "materialCost must be ≥ 0", kind: "edge" },
    { id: "hours-non-negative", description: "laborHours must be ≥ 0", kind: "edge" },
    { id: "rate-positive", description: "laborRate must be > 0 when hours > 0", kind: "edge" },
    { id: "labor-ratio", description: "laborMaterialRatio stays within 0–500%", kind: "dimensional" },
    {
      id: "nrca-cost-dimension",
      description: "nrcaEstimate and recommendedPrice use currency semantics for governance target",
      kind: "purpose",
    },
  ],
  scenarioSpecs: [
    { id: "normal-shingle-job", description: "Normal case: balanced labor/material ratio" },
    { id: "edge-long-labor", description: "Edge case: labor hours ≥ 24 trigger contract check" },
    { id: "absurd-negative-material", description: "Absurd input: negative material cost rejected" },
    { id: "directional-labor", description: "Directional: more labor hours increase labor cost" },
    { id: "sensitivity-material", description: "Sensitivity: higher material shifts NRCA area inference" },
  ],
  monotonicityRules: [
    {
      id: "hours-up-labor",
      description: "Higher laborHours must not decrease labor cost",
      inputKey: "laborHours",
      direction: "increase_should_increase",
      outputKey: "laborCost",
    },
    {
      id: "rate-up-labor",
      description: "Higher laborRate must not decrease labor cost",
      inputKey: "laborRate",
      direction: "increase_should_increase",
      outputKey: "laborCost",
    },
    {
      id: "material-up-nrca",
      description: "Higher materialCost must not decrease inferred NRCA estimate",
      inputKey: "materialCost",
      direction: "increase_should_increase",
      outputKey: "nrcaEstimate",
    },
  ],
  decisionLanguageRules: [STANDARD_DECISION_LANGUAGE_RULE],
  mustNotClaim: [...STANDARD_MUST_NOT_CLAIM, "NRCA-certified bid guarantee"],
});

export const laserCuttingTimeCheckContract: FormulaContract = buildAssuredCriticalContract({
  toolId: "free-traffic.laser-cutting-time-check",
  toolName: "Laser Cutting Time Check",
  slug: "laser-cutting-time-check",
  purpose:
    "Estimate laser cut time from setup, cut path, speed and pierce count before scrap and programming risk.",
  userDecision: "Is total cut time reasonable for this path length and pierce load?",
  decisionImpact: "technical",
  requiredInputs: ["setupMinutes", "cutLengthM", "cutSpeedMMin", "pierceCount", "pierceSeconds"],
  criticalInputs: ["setupMinutes", "cutLengthM", "cutSpeedMMin", "pierceCount", "pierceSeconds"],
  outputs: ["recommendedPrice", "totalMinutes", "cutMinutes"],
  assumptions: [
    FINANCIAL_SIMULATION_DISCLAIMER,
    freeTrafficProductionAssumption(
      "laser-cutting-time-check",
      "setup + cutLength ÷ speed + pierce time",
    ),
    "Revenue-free alternate path uses setupTime/quantity via calculateSheetMetalFreeResult (not oracle-compared).",
    "totalMinutes is the primary numeric laser cutting time/cost estimate target.",
  ],
  formulaSummary:
    "totalMinutes = setupMinutes + cutLengthM ÷ cutSpeedMMin + (pierceCount × pierceSeconds) ÷ 60.",
  missingParameterWarnings: [],
  warningPolicy: createWarningPolicy({
    acceptedAssumptions: [
      "Flat cut speed and pierce seconds per hole on free-traffic path.",
      GOVERNANCE_RECOMMENDED_PRICE_TARGET_NOTE,
      "recommendedPrice metadata alias equals total laser cut minutes (totalMinutes).",
    ],
    modelLimitations: [
      "Material grade, pierce count and nesting not fully modeled",
      "Assist gas, setup and machine condition excluded on free tier",
      "Revenue funnel uses different input shape (setupTime/quantity)",
    ],
    futureExtensions: [
      "Nesting-aware and assist-gas adjusted quote model",
      "Unified oracle across revenue and free-traffic laser paths",
      "Sheet metal quote risk tool integration",
    ],
  }),
  validationRules: [
    { id: "setup-positive", description: "setupMinutes must be > 0", kind: "edge" },
    { id: "speed-positive", description: "cutSpeedMMin must be > 0", kind: "edge" },
    { id: "length-positive", description: "cutLengthM must be > 0", kind: "edge" },
    { id: "pierce-non-negative", description: "pierceCount and pierceSeconds must be ≥ 0", kind: "dimensional" },
    {
      id: "cut-time-dimension",
      description: "totalMinutes and recommendedPrice use minute semantics for governance target",
      kind: "purpose",
    },
  ],
  scenarioSpecs: [
    { id: "normal-batch", description: "Normal case: moderate setup with batch cut path" },
    { id: "normal-sheet", description: "Normal case: standard sheet cut job" },
    { id: "normal-prototype", description: "Normal case: prototype with many pierces" },
    { id: "edge-setup-heavy", description: "Edge case: long setup with short cut path" },
    { id: "absurd-zero-speed", description: "Absurd input: zero cut speed rejected" },
  ],
  monotonicityRules: [
    {
      id: "length-up-time",
      description: "Higher cutLengthM must not decrease total minutes",
      inputKey: "cutLengthM",
      direction: "increase_should_increase",
      outputKey: "totalMinutes",
    },
    {
      id: "pierce-up-time",
      description: "Higher pierceCount must not decrease total minutes",
      inputKey: "pierceCount",
      direction: "increase_should_increase",
      outputKey: "totalMinutes",
    },
    {
      id: "setup-up-time",
      description: "Higher setupMinutes must not decrease total minutes",
      inputKey: "setupMinutes",
      direction: "increase_should_increase",
      outputKey: "totalMinutes",
    },
  ],
  decisionLanguageRules: [STANDARD_DECISION_LANGUAGE_RULE],
  mustNotClaim: [...STANDARD_MUST_NOT_CLAIM, "Guaranteed sheet metal quote"],
});

export const hvacProjectMarginGuardContract: FormulaContract = buildAssuredCriticalContract({
  toolId: "revenue-premium.hvac-project-margin-guard",
  toolName: "HVAC Project Margin Guard",
  slug: "hvac-project-margin-guard",
  purpose:
    "Find minimum HVAC project price with equipment, ductwork, callback and commissioning risk included.",
  userDecision: "Is this HVAC install priced safely given equipment, labor and callback exposure?",
  decisionImpact: "pricing",
  requiredInputs: [
    "equipmentCost",
    "ductworkCost",
    "laborHours",
    "laborRate",
    "commissioningCost",
    "callbackRiskPercent",
    "targetMargin",
  ],
  criticalInputs: [
    "equipmentCost",
    "ductworkCost",
    "laborHours",
    "laborRate",
    "commissioningCost",
    "callbackRiskPercent",
    "targetMargin",
  ],
  outputs: ["minimumSafePrice", "quoteVerdict", "p90Cost", "baseCost"],
  assumptions: [
    PREMIUM_DECISION_DISCLAIMER,
    "Production: src/lib/tools/premium-decision-engine.ts → calcHvac + MarginCore decision layer.",
    "Base = equipment + ductwork + labor + commissioning + callback% on equipment + refrigerant 3% + seasonal labor 20%.",
  ],
  formulaSummary:
    "baseCost = equipment + ductwork + laborHours×laborRate + commissioning + callback buffer + refrigerant + seasonal premium; safe price via hidden multipliers and volatility buffer.",
  missingParameterWarnings: [],
  warningPolicy: createWarningPolicy({
    acceptedAssumptions: [
      "Callback risk applied as percent of equipment cost; seasonal labor premium 20% of labor.",
    ],
    modelLimitations: [
      "Site survey, permit fees and ductwork condition not fully modeled",
      "Climate envelope and full Manual J/S load calculation not modeled",
      "Line-set length, ventilation and latent load excluded from base cost",
    ],
    futureExtensions: [
      "Independent oracle for minimum project price vs calcHvac",
      "Integration with hvac-tonnage-rule-check free funnel",
    ],
  }),
  validationRules: [
    { id: "equipment-non-negative", description: "equipmentCost must be ≥ 0", kind: "edge" },
    { id: "rate-positive", description: "laborRate must be > 0", kind: "edge" },
    { id: "callback-percent", description: "callbackRiskPercent within 0–100%", kind: "dimensional" },
    { id: "margin-percent", description: "targetMargin is percent", kind: "dimensional" },
  ],
  scenarioSpecs: [
    { id: "normal-install", description: "Normal case: mid-size HVAC install with moderate callback risk" },
    { id: "edge-high-callback", description: "Edge case: callback risk above 12%" },
    { id: "absurd-zero-rate", description: "Absurd input: zero labor rate rejected" },
    { id: "directional-equipment", description: "Directional: higher equipmentCost raises base cost" },
    { id: "sensitivity-margin", description: "Sensitivity: higher targetMargin raises minimum safe price" },
  ],
  monotonicityRules: [
    {
      id: "equipment-up-floor",
      description: "Higher equipmentCost must not decrease minimum safe price",
      inputKey: "equipmentCost",
      direction: "increase_should_increase",
      outputKey: "minimumSafePrice",
    },
    {
      id: "callback-up-floor",
      description: "Higher callbackRiskPercent must not decrease minimum safe price",
      inputKey: "callbackRiskPercent",
      direction: "increase_should_increase",
      outputKey: "minimumSafePrice",
    },
    {
      id: "margin-up-floor",
      description: "Higher targetMargin must not decrease minimum safe price",
      inputKey: "targetMargin",
      direction: "increase_should_increase",
      outputKey: "minimumSafePrice",
    },
  ],
  decisionLanguageRules: [STANDARD_DECISION_LANGUAGE_RULE],
  mustNotClaim: [...STANDARD_MUST_NOT_CLAIM, "ASHRAE-certified project guarantee"],
});

export const panelShopMarginVerdictContract: FormulaContract = buildAssuredCriticalContract({
  toolId: "revenue-premium.panel-shop-margin-verdict",
  toolName: "Panel Shop Margin Verdict",
  slug: "panel-shop-margin-verdict",
  purpose:
    "Find safe electrical panel bid with testing hours, permit revision and inspection risk included.",
  userDecision: "Is this panel bid priced safely given material, labor and inspection exposure?",
  decisionImpact: "pricing",
  requiredInputs: [
    "materialCost",
    "laborHours",
    "laborRate",
    "testingHours",
    "inspectionRiskPercent",
    "targetMargin",
  ],
  criticalInputs: [
    "materialCost",
    "laborHours",
    "laborRate",
    "testingHours",
    "inspectionRiskPercent",
    "targetMargin",
  ],
  outputs: ["minimumSafePrice", "quoteVerdict", "p90Cost", "baseCost"],
  assumptions: [
    PREMIUM_DECISION_DISCLAIMER,
    "Production: src/lib/tools/premium-decision-engine.ts → calcElectrical + MarginCore decision layer.",
    "Base = material + labor + testing + permit 4% of material; inspection risk multiplier on base.",
  ],
  formulaSummary:
    "baseCost = (material + laborHours×laborRate + testingHours×laborRate + permit) × (1 + inspectionRisk%); safe price via hidden multipliers.",
  missingParameterWarnings: [],
  warningPolicy: createWarningPolicy({
    acceptedAssumptions: [
      "Permit revision reserve 4% of material; inspection risk entered as percent.",
    ],
    modelLimitations: [
      "Panel complexity, wiring density and conduit fill not fully modeled",
      "Inspection rework, AHJ revision cycles and supplier lead time not itemized",
      "NEC derating and specialty gear excluded from free-tier base",
    ],
    futureExtensions: [
      "Oracle for safe panel bid vs calcElectrical",
      "electrical-labor-estimator funnel integration",
    ],
  }),
  validationRules: [
    { id: "material-non-negative", description: "materialCost must be ≥ 0", kind: "edge" },
    { id: "rate-positive", description: "laborRate must be > 0", kind: "edge" },
    { id: "inspection-percent", description: "inspectionRiskPercent within 0–100%", kind: "dimensional" },
    { id: "margin-percent", description: "targetMargin is percent", kind: "dimensional" },
  ],
  scenarioSpecs: [
    { id: "normal-panel-bid", description: "Normal case: panel job with balanced labor and testing" },
    { id: "edge-high-inspection", description: "Edge case: inspection risk above 15%" },
    { id: "absurd-negative-material", description: "Absurd input: negative material cost rejected" },
    { id: "directional-labor", description: "Directional: higher laborHours raises base cost" },
    { id: "sensitivity-testing", description: "Sensitivity: more testing hours raise base cost" },
  ],
  monotonicityRules: [
    {
      id: "material-up-floor",
      description: "Higher materialCost must not decrease minimum safe price",
      inputKey: "materialCost",
      direction: "increase_should_increase",
      outputKey: "minimumSafePrice",
    },
    {
      id: "inspection-up-floor",
      description: "Higher inspectionRiskPercent must not decrease minimum safe price",
      inputKey: "inspectionRiskPercent",
      direction: "increase_should_increase",
      outputKey: "minimumSafePrice",
    },
    {
      id: "margin-up-floor",
      description: "Higher targetMargin must not decrease minimum safe price",
      inputKey: "targetMargin",
      direction: "increase_should_increase",
      outputKey: "minimumSafePrice",
    },
  ],
  decisionLanguageRules: [STANDARD_DECISION_LANGUAGE_RULE],
  mustNotClaim: [...STANDARD_MUST_NOT_CLAIM, "NEC-certified bid guarantee"],
});

export const landscapingContractProfitToolContract: FormulaContract = buildAssuredCriticalContract({
  toolId: "revenue-premium.landscaping-contract-profit-tool",
  toolName: "Landscaping Contract Profit Tool",
  slug: "landscaping-contract-profit-tool",
  purpose:
    "Find minimum monthly landscaping contract price with fuel, supplies and equipment wear included.",
  userDecision: "Is this recurring lawn contract priced safely for crew, fuel and wear exposure?",
  decisionImpact: "pricing",
  requiredInputs: [
    "crewHoursPerVisit",
    "laborRate",
    "fuelCostPerVisit",
    "supplyCostPerMonth",
    "visitsPerMonth",
    "equipmentWearCost",
    "targetMargin",
  ],
  criticalInputs: [
    "crewHoursPerVisit",
    "laborRate",
    "fuelCostPerVisit",
    "supplyCostPerMonth",
    "visitsPerMonth",
    "equipmentWearCost",
    "targetMargin",
  ],
  outputs: ["minimumSafePrice", "quoteVerdict", "p90Cost", "baseCost"],
  assumptions: [
    PREMIUM_DECISION_DISCLAIMER,
    "Production: src/lib/tools/premium-decision-engine.ts → calcLandscaping + MarginCore decision layer.",
    "Monthly direct = crewHours×laborRate×visits + fuel×visits + supplies + equipment wear + 8% equip depreciation on labor.",
  ],
  formulaSummary:
    "baseCost = monthly labor + fuel + supplies + equipment wear + equip depreciation; minimum monthly price via hidden multipliers and margin floor.",
  missingParameterWarnings: [],
  warningPolicy: createWarningPolicy({
    acceptedAssumptions: [
      "Flat visits per month; equipment depreciation 8% of monthly labor.",
    ],
    modelLimitations: [
      "Seasonality, route density and weather delays not fully modeled",
      "Crew utilization, travel between sites and supervision G&A excluded",
      "Irrigation, fertilization and specialty services not itemized",
    ],
    futureExtensions: [
      "Oracle for monthly contract floor vs calcLandscaping",
      "lawn-care-cost-check funnel integration",
    ],
  }),
  validationRules: [
    { id: "visits-positive", description: "visitsPerMonth must be ≥ 1", kind: "edge" },
    { id: "hours-non-negative", description: "crewHoursPerVisit must be ≥ 0", kind: "edge" },
    { id: "rate-positive", description: "laborRate must be > 0", kind: "edge" },
    { id: "margin-percent", description: "targetMargin is percent", kind: "dimensional" },
  ],
  scenarioSpecs: [
    { id: "normal-route", description: "Normal case: weekly visits with moderate crew hours" },
    { id: "edge-heavy-route", description: "Edge case: high monthly crew-hour load" },
    { id: "absurd-zero-visits", description: "Absurd input: zero visits per month rejected" },
    { id: "directional-fuel", description: "Directional: higher fuelCostPerVisit raises base cost" },
    { id: "sensitivity-wear", description: "Sensitivity: higher equipmentWearCost raises floor" },
  ],
  monotonicityRules: [
    {
      id: "visits-up-floor",
      description: "Higher visitsPerMonth must not decrease minimum safe price",
      inputKey: "visitsPerMonth",
      direction: "increase_should_increase",
      outputKey: "minimumSafePrice",
    },
    {
      id: "fuel-up-floor",
      description: "Higher fuelCostPerVisit must not decrease minimum safe price",
      inputKey: "fuelCostPerVisit",
      direction: "increase_should_increase",
      outputKey: "minimumSafePrice",
    },
    {
      id: "margin-up-floor",
      description: "Higher targetMargin must not decrease minimum safe price",
      inputKey: "targetMargin",
      direction: "increase_should_increase",
      outputKey: "minimumSafePrice",
    },
  ],
  decisionLanguageRules: [STANDARD_DECISION_LANGUAGE_RULE],
  mustNotClaim: [...STANDARD_MUST_NOT_CLAIM, "Guaranteed contract profitability"],
});

export const autoShopMarginLeakDetectorContract: FormulaContract = buildAssuredCriticalContract({
  toolId: "revenue-premium.auto-shop-margin-leak-detector",
  toolName: "Auto Shop Margin Leak Detector",
  slug: "auto-shop-margin-leak-detector",
  purpose:
    "Calculate true repair job profit with diagnostic time, parts markup, shop supplies and comeback risk.",
  userDecision: "Is this quoted repair actually profitable after diagnostic and comeback exposure?",
  decisionImpact: "pricing",
  requiredInputs: [
    "quotedPrice",
    "diagnosticHours",
    "repairHours",
    "laborRate",
    "partsCost",
    "comebackRiskPercent",
    "partsMarkupPercent",
  ],
  criticalInputs: [
    "quotedPrice",
    "diagnosticHours",
    "repairHours",
    "laborRate",
    "partsCost",
    "comebackRiskPercent",
    "partsMarkupPercent",
  ],
  outputs: ["recommendedPrice", "trueJobProfit", "quoteVerdict", "riskAdjustedCost", "baseCost"],
  assumptions: [
    PREMIUM_DECISION_DISCLAIMER,
    calculatorProductionAssumption(
      PREMIUM_DECISION_PRODUCTION_FILE,
      "calcAutoShop + MarginCore decision layer",
    ),
    "Base = diagnostic+repair labor + marked-up parts + shop supplies 5% + OEM gap 12%; comeback multiplier.",
    "quoteVerdict is a narrative verdict signal; trueJobProfit is the primary numeric margin target.",
  ],
  formulaSummary:
    "baseCost = (labor + parts×(1+markup%) + supplies + OEM gap) × (1 + comeback%); true profit = quotedPrice − risk-adjusted cost.",
  missingParameterWarnings: [],
  warningPolicy: createWarningPolicy({
    acceptedAssumptions: [
      "Shop supplies 5% of labor; OEM/aftermarket gap 12% of parts cost on base path.",
      GOVERNANCE_RECOMMENDED_PRICE_TARGET_NOTE,
      "recommendedPrice metadata alias equals true repair job profit (trueJobProfit).",
    ],
    modelLimitations: [
      "Diagnostic uncertainty and parts availability not fully modeled",
      "Warranty reimbursement delay and appointment no-shows excluded",
      "Vehicle-specific book time and comeback probability simplified",
    ],
    futureExtensions: [
      "Oracle for true job profit vs calcAutoShop",
      "repair-time-vs-price-check funnel integration",
    ],
  }),
  validationRules: [
    { id: "quote-positive", description: "quotedPrice must be > 0 for profit verdict", kind: "edge" },
    { id: "comeback-percent", description: "comebackRiskPercent within 0–100%", kind: "dimensional" },
    { id: "markup-percent", description: "partsMarkupPercent within 0–100%", kind: "dimensional" },
    {
      id: "job-profit-dimension",
      description: "trueJobProfit and recommendedPrice use currency semantics for governance target",
      kind: "purpose",
    },
  ],
  scenarioSpecs: [
    { id: "normal-brake-job", description: "Normal case: quoted job with visible profit headroom" },
    { id: "edge-thin-quote", description: "Edge case: burdened cost near quoted price" },
    { id: "absurd-zero-quote", description: "Absurd input: zero quoted price rejected" },
    { id: "directional-comeback", description: "Directional: higher comeback risk worsens profit" },
    { id: "sensitivity-diagnostic", description: "Sensitivity: unbilled diagnostic hours erode profit" },
  ],
  monotonicityRules: [
    {
      id: "parts-up-cost",
      description: "Higher partsCost must not decrease risk-adjusted cost",
      inputKey: "partsCost",
      direction: "increase_should_increase",
      outputKey: "baseCost",
    },
    {
      id: "comeback-up-cost",
      description: "Higher comebackRiskPercent must not decrease risk-adjusted cost",
      inputKey: "comebackRiskPercent",
      direction: "increase_should_increase",
      outputKey: "baseCost",
    },
    {
      id: "quote-up-profit",
      description: "Higher quotedPrice must not decrease true job profit",
      inputKey: "quotedPrice",
      direction: "increase_should_increase",
      outputKey: "trueJobProfit",
    },
  ],
  decisionLanguageRules: [STANDARD_DECISION_LANGUAGE_RULE],
  mustNotClaim: [...STANDARD_MUST_NOT_CLAIM, "Guaranteed shop profitability"],
});

export const signageBidSafePriceToolContract: FormulaContract = buildAssuredCriticalContract({
  toolId: "revenue-premium.signage-bid-safe-price-tool",
  toolName: "Signage Bid Safe Price Tool",
  slug: "signage-bid-safe-price-tool",
  purpose:
    "Find minimum safe signage price with design, install, ink, RIP/proofing and reprint risk included.",
  userDecision: "Is this signage bid priced safely given material, labor and reprint exposure?",
  decisionImpact: "pricing",
  requiredInputs: [
    "materialCost",
    "inkCost",
    "designHours",
    "laborRate",
    "installHours",
    "reprintRiskPercent",
    "targetMargin",
  ],
  criticalInputs: [
    "materialCost",
    "inkCost",
    "designHours",
    "laborRate",
    "installHours",
    "reprintRiskPercent",
    "targetMargin",
  ],
  outputs: ["minimumSafePrice", "quoteVerdict", "p90Cost", "baseCost"],
  assumptions: [
    PREMIUM_DECISION_DISCLAIMER,
    "Production: src/lib/tools/premium-decision-engine.ts → calcSignage + MarginCore decision layer.",
    "Base = material + ink + (design+install)×laborRate + RIP 4%; reprint risk multiplier.",
  ],
  formulaSummary:
    "baseCost = (material + ink + labor + RIP reserve) × (1 + reprintRisk%); safe price via hidden multipliers.",
  missingParameterWarnings: [],
  warningPolicy: createWarningPolicy({
    acceptedAssumptions: [
      "RIP/proofing reserve 4% of base; design and install hours at flat labor rate.",
    ],
    modelLimitations: [
      "Substrate type, install access and color calibration not fully modeled",
      "Permit, electrical hook-up and rework risk loaded via multipliers only",
      "Wide-format spoilage and finishing complexity may require override",
    ],
    futureExtensions: [
      "Oracle for minimum safe signage price vs calcSignage",
      "print-job-cost-check funnel integration",
    ],
  }),
  validationRules: [
    { id: "material-non-negative", description: "materialCost must be ≥ 0", kind: "edge" },
    { id: "rate-positive", description: "laborRate must be > 0", kind: "edge" },
    { id: "reprint-percent", description: "reprintRiskPercent within 0–100%", kind: "dimensional" },
    { id: "margin-percent", description: "targetMargin is percent", kind: "dimensional" },
  ],
  scenarioSpecs: [
    { id: "normal-signage-bid", description: "Normal case: balanced design and install load" },
    { id: "edge-reprint-risk", description: "Edge case: reprint risk above 10%" },
    { id: "absurd-negative-ink", description: "Absurd input: negative ink cost rejected" },
    { id: "directional-design", description: "Directional: more design hours raise base cost" },
    { id: "sensitivity-install", description: "Sensitivity: install hours increase labor exposure" },
  ],
  monotonicityRules: [
    {
      id: "material-up-floor",
      description: "Higher materialCost must not decrease minimum safe price",
      inputKey: "materialCost",
      direction: "increase_should_increase",
      outputKey: "minimumSafePrice",
    },
    {
      id: "reprint-up-floor",
      description: "Higher reprintRiskPercent must not decrease minimum safe price",
      inputKey: "reprintRiskPercent",
      direction: "increase_should_increase",
      outputKey: "minimumSafePrice",
    },
    {
      id: "margin-up-floor",
      description: "Higher targetMargin must not decrease minimum safe price",
      inputKey: "targetMargin",
      direction: "increase_should_increase",
      outputKey: "minimumSafePrice",
    },
  ],
  decisionLanguageRules: [STANDARD_DECISION_LANGUAGE_RULE],
  mustNotClaim: [...STANDARD_MUST_NOT_CLAIM, "Guaranteed signage margin"],
});

export const millworkBidRiskAnalyzerContract: FormulaContract = buildAssuredCriticalContract({
  toolId: "revenue-premium.millwork-bid-risk-analyzer",
  toolName: "Millwork Bid Risk Analyzer",
  slug: "millwork-bid-risk-analyzer",
  purpose:
    "Find minimum millwork bid with WWPA waste, finishing, install and schedule delay risk included.",
  userDecision: "Is this custom millwork bid priced safely given material, labor and waste exposure?",
  decisionImpact: "pricing",
  requiredInputs: [
    "sheetMaterialCost",
    "laborHours",
    "laborRate",
    "finishingCost",
    "installHours",
    "wasteRatePercent",
    "targetMargin",
  ],
  criticalInputs: [
    "sheetMaterialCost",
    "laborHours",
    "laborRate",
    "finishingCost",
    "installHours",
    "wasteRatePercent",
    "targetMargin",
  ],
  outputs: ["minimumSafePrice", "quoteVerdict", "p90Cost", "baseCost"],
  assumptions: [
    PREMIUM_DECISION_DISCLAIMER,
    "Production: src/lib/tools/premium-decision-engine.ts → calcMillwork + MarginCore decision layer.",
    "Material with waste%; labor = (shop+install)×rate + finishing + 10% finishing delay reserve.",
  ],
  formulaSummary:
    "baseCost = sheetMaterial×(1+waste%) + (laborHours+installHours)×laborRate + finishing + delay reserve; safe bid via hidden multipliers.",
  missingParameterWarnings: [],
  warningPolicy: createWarningPolicy({
    acceptedAssumptions: [
      "Waste rate minimum 10%; finishing delay reserve 10% of finishing cost.",
    ],
    modelLimitations: [
      "Finish grade, field measurement risk and custom hardware variation not fully modeled",
      "Install complexity, humidity delays and punch-list rework excluded",
      "Sheet yield and CNC programming time not itemized",
    ],
    futureExtensions: [
      "Oracle for minimum millwork bid vs calcMillwork",
      "cabinet-cost-estimator funnel integration",
    ],
  }),
  validationRules: [
    { id: "material-non-negative", description: "sheetMaterialCost must be ≥ 0", kind: "edge" },
    { id: "waste-percent", description: "wasteRatePercent within 0–100%", kind: "dimensional" },
    { id: "margin-percent", description: "targetMargin is percent", kind: "dimensional" },
  ],
  scenarioSpecs: [
    { id: "normal-millwork-bid", description: "Normal case: moderate shop and install hours" },
    { id: "edge-high-waste", description: "Edge case: waste rate above 15%" },
    { id: "absurd-negative-finishing", description: "Absurd input: negative finishing cost rejected" },
    { id: "directional-material", description: "Directional: higher sheet cost raises base cost" },
    { id: "sensitivity-install", description: "Sensitivity: install hours increase labor load" },
  ],
  monotonicityRules: [
    {
      id: "material-up-floor",
      description: "Higher sheetMaterialCost must not decrease minimum safe price",
      inputKey: "sheetMaterialCost",
      direction: "increase_should_increase",
      outputKey: "minimumSafePrice",
    },
    {
      id: "waste-up-floor",
      description: "Higher wasteRatePercent must not decrease minimum safe price",
      inputKey: "wasteRatePercent",
      direction: "increase_should_increase",
      outputKey: "minimumSafePrice",
    },
    {
      id: "margin-up-floor",
      description: "Higher targetMargin must not decrease minimum safe price",
      inputKey: "targetMargin",
      direction: "increase_should_increase",
      outputKey: "minimumSafePrice",
    },
  ],
  decisionLanguageRules: [STANDARD_DECISION_LANGUAGE_RULE],
  mustNotClaim: [...STANDARD_MUST_NOT_CLAIM, "Guaranteed millwork bid acceptance"],
});

export const roofingContractMarginGuardContract: FormulaContract = buildAssuredCriticalContract({
  toolId: "revenue-premium.roofing-contract-margin-guard",
  toolName: "Roofing Contract Margin Guard",
  slug: "roofing-contract-margin-guard",
  purpose:
    "Find minimum roofing bid with tear-off, dump fees, warranty reserve and weather delay risk included.",
  userDecision: "Is this roofing contract priced safely given material, labor and delay exposure?",
  decisionImpact: "pricing",
  requiredInputs: [
    "materialCost",
    "laborHours",
    "laborRate",
    "tearOffCost",
    "dumpFees",
    "weatherDelayRiskPercent",
    "targetMargin",
  ],
  criticalInputs: [
    "materialCost",
    "laborHours",
    "laborRate",
    "tearOffCost",
    "dumpFees",
    "weatherDelayRiskPercent",
    "targetMargin",
  ],
  outputs: ["minimumSafePrice", "quoteVerdict", "p90Cost", "baseCost"],
  assumptions: [
    PREMIUM_DECISION_DISCLAIMER,
    "Production: src/lib/tools/premium-decision-engine.ts → calcRoofing + MarginCore decision layer.",
    "Base = material + labor + tear-off + dump + 14% material reserves; weather delay multiplier.",
  ],
  formulaSummary:
    "baseCost = (material + labor + tearOff + dump + reserves) × (1 + weatherDelayRisk%); safe bid via hidden multipliers.",
  missingParameterWarnings: [],
  warningPolicy: createWarningPolicy({
    acceptedAssumptions: [
      "Warranty and underlayment reserves 14% of material; weather delay entered as percent.",
    ],
    modelLimitations: [
      "Pitch, tear-off layers, access and local code not fully modeled",
      "Ice-dam membrane, ventilation specs and weather standby excluded",
      "Warranty transferability and dump fee volatility simplified",
    ],
    futureExtensions: [
      "Oracle for minimum roofing bid vs calcRoofing",
      "roofing-square-cost-check funnel integration",
    ],
  }),
  validationRules: [
    { id: "material-non-negative", description: "materialCost must be ≥ 0", kind: "edge" },
    { id: "rate-positive", description: "laborRate must be > 0", kind: "edge" },
    { id: "weather-percent", description: "weatherDelayRiskPercent within 0–100%", kind: "dimensional" },
    { id: "margin-percent", description: "targetMargin is percent", kind: "dimensional" },
  ],
  scenarioSpecs: [
    { id: "normal-shingle-contract", description: "Normal case: tear-off job with balanced labor" },
    { id: "edge-weather-risk", description: "Edge case: weather delay risk above 12%" },
    { id: "absurd-negative-tearoff", description: "Absurd input: negative tear-off cost rejected" },
    { id: "directional-labor", description: "Directional: more labor hours raise base cost" },
    { id: "sensitivity-dump", description: "Sensitivity: dump fees increase direct cost" },
  ],
  monotonicityRules: [
    {
      id: "material-up-floor",
      description: "Higher materialCost must not decrease minimum safe price",
      inputKey: "materialCost",
      direction: "increase_should_increase",
      outputKey: "minimumSafePrice",
    },
    {
      id: "weather-up-floor",
      description: "Higher weatherDelayRiskPercent must not decrease minimum safe price",
      inputKey: "weatherDelayRiskPercent",
      direction: "increase_should_increase",
      outputKey: "minimumSafePrice",
    },
    {
      id: "margin-up-floor",
      description: "Higher targetMargin must not decrease minimum safe price",
      inputKey: "targetMargin",
      direction: "increase_should_increase",
      outputKey: "minimumSafePrice",
    },
  ],
  decisionLanguageRules: [STANDARD_DECISION_LANGUAGE_RULE],
  mustNotClaim: [...STANDARD_MUST_NOT_CLAIM, "NRCA-certified contract guarantee"],
});

export const paintingJobProfitVerdictContract: FormulaContract = buildAssuredCriticalContract({
  toolId: "revenue-premium.painting-job-profit-verdict",
  toolName: "Painting Job Profit Verdict",
  slug: "painting-job-profit-verdict",
  purpose:
    "Find minimum painting price with PDCA production model, scaffold, caulk/mask and touch-up risk included.",
  userDecision: "Is this painting job priced safely given prep, production and touch-up exposure?",
  decisionImpact: "pricing",
  requiredInputs: [
    "paintCost",
    "prepHours",
    "laborRate",
    "scaffoldCost",
    "touchUpRiskPercent",
    "areaSize",
    "targetMargin",
  ],
  criticalInputs: [
    "paintCost",
    "prepHours",
    "laborRate",
    "scaffoldCost",
    "touchUpRiskPercent",
    "areaSize",
    "targetMargin",
  ],
  outputs: ["minimumSafePrice", "quoteVerdict", "p90Cost", "baseCost"],
  assumptions: [
    PREMIUM_DECISION_DISCLAIMER,
    "Production: src/lib/tools/premium-decision-engine.ts → calcPainting + MarginCore decision layer.",
    "Production hours = area÷350 sqft/hr; base = paint + (prep+production)×rate + scaffold + caulk $0.08/sqft.",
  ],
  formulaSummary:
    "baseCost = (paint + labor + scaffold + caulk reserve) × (1 + touchUpRisk%); safe price via hidden multipliers.",
  missingParameterWarnings: [],
  warningPolicy: createWarningPolicy({
    acceptedAssumptions: [
      "PDCA 350 sqft/hr production rate; caulk/mask reserve $0.08 per sqft.",
    ],
    modelLimitations: [
      "Surface prep depth, coat count and access complexity not fully modeled",
      "Drying time, humidity and weather delays excluded",
      "Lead abatement and specialty coatings not itemized",
    ],
    futureExtensions: [
      "Oracle for minimum painting price vs calcPainting",
      "paint-coverage-cost-check funnel integration",
    ],
  }),
  validationRules: [
    { id: "area-positive", description: "areaSize must be > 0", kind: "edge" },
    { id: "rate-positive", description: "laborRate must be > 0", kind: "edge" },
    { id: "touchup-percent", description: "touchUpRiskPercent within 0–100%", kind: "dimensional" },
    { id: "margin-percent", description: "targetMargin is percent", kind: "dimensional" },
  ],
  scenarioSpecs: [
    { id: "normal-interior-job", description: "Normal case: moderate prep and area" },
    { id: "edge-heavy-prep", description: "Edge case: prep intensity above PDCA threshold" },
    { id: "absurd-zero-area", description: "Absurd input: zero area rejected" },
    { id: "directional-prep", description: "Directional: more prep hours raise base cost" },
    { id: "sensitivity-scaffold", description: "Sensitivity: scaffold cost increases floor" },
  ],
  monotonicityRules: [
    {
      id: "area-up-floor",
      description: "Higher areaSize must not decrease minimum safe price",
      inputKey: "areaSize",
      direction: "increase_should_increase",
      outputKey: "minimumSafePrice",
    },
    {
      id: "touchup-up-floor",
      description: "Higher touchUpRiskPercent must not decrease minimum safe price",
      inputKey: "touchUpRiskPercent",
      direction: "increase_should_increase",
      outputKey: "minimumSafePrice",
    },
    {
      id: "margin-up-floor",
      description: "Higher targetMargin must not decrease minimum safe price",
      inputKey: "targetMargin",
      direction: "increase_should_increase",
      outputKey: "minimumSafePrice",
    },
  ],
  decisionLanguageRules: [STANDARD_DECISION_LANGUAGE_RULE],
  mustNotClaim: [...STANDARD_MUST_NOT_CLAIM, "PDCA-certified job guarantee"],
});

export const sheetMetalQuoteRiskToolContract: FormulaContract = buildAssuredCriticalContract({
  toolId: "revenue-premium.sheet-metal-quote-risk-tool",
  toolName: "Sheet Metal Quote Risk Tool",
  slug: "sheet-metal-quote-risk-tool",
  purpose:
    "Find safe sheet metal quote with programming, setup, scrap, bend labor and finishing included.",
  userDecision: "Is this sheet metal quote priced safely given machine time and scrap exposure?",
  decisionImpact: "pricing",
  requiredInputs: [
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
  criticalInputs: [
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
  outputs: ["minimumSafePrice", "quoteVerdict", "p90Cost", "baseCost"],
  assumptions: [
    PREMIUM_DECISION_DISCLAIMER,
    "Production: src/lib/tools/premium-decision-engine.ts → calcSheetMetal + MarginCore decision layer.",
    "Labor minutes = programming + setup + cut + bends×2; material with scrap%; plus finishing.",
  ],
  formulaSummary:
    "baseCost = (totalMinutes÷60)×laborRate + material×(1+scrap%) + finishing; safe quote via hidden multipliers.",
  missingParameterWarnings: [],
  warningPolicy: createWarningPolicy({
    acceptedAssumptions: [
      "Bend allowance 2 min per bend; scrap rate minimum 8% on material.",
    ],
    modelLimitations: [
      "Nesting efficiency, setup amortization and material grade not fully modeled",
      "Assist gas, pierce count and programming complexity simplified",
      "Nest scrap volatility and rush-order premium excluded",
    ],
    futureExtensions: [
      "Oracle for safe sheet metal quote vs calcSheetMetal",
      "laser-cutting-time-check funnel integration",
    ],
  }),
  validationRules: [
    { id: "material-non-negative", description: "materialCost must be ≥ 0", kind: "edge" },
    { id: "rate-positive", description: "laborRate must be > 0", kind: "edge" },
    { id: "scrap-percent", description: "scrapRatePercent within 0–100%", kind: "dimensional" },
    { id: "margin-percent", description: "targetMargin is percent", kind: "dimensional" },
  ],
  scenarioSpecs: [
    { id: "normal-fab-quote", description: "Normal case: moderate programming and cut time" },
    { id: "edge-high-scrap", description: "Edge case: scrap rate above 12%" },
    { id: "absurd-zero-rate", description: "Absurd input: zero labor rate rejected" },
    { id: "directional-bends", description: "Directional: more bends increase labor minutes" },
    { id: "sensitivity-material", description: "Sensitivity: higher material cost raises base" },
  ],
  monotonicityRules: [
    {
      id: "material-up-floor",
      description: "Higher materialCost must not decrease minimum safe price",
      inputKey: "materialCost",
      direction: "increase_should_increase",
      outputKey: "minimumSafePrice",
    },
    {
      id: "scrap-up-floor",
      description: "Higher scrapRatePercent must not decrease minimum safe price",
      inputKey: "scrapRatePercent",
      direction: "increase_should_increase",
      outputKey: "minimumSafePrice",
    },
    {
      id: "margin-up-floor",
      description: "Higher targetMargin must not decrease minimum safe price",
      inputKey: "targetMargin",
      direction: "increase_should_increase",
      outputKey: "minimumSafePrice",
    },
  ],
  decisionLanguageRules: [STANDARD_DECISION_LANGUAGE_RULE],
  mustNotClaim: [...STANDARD_MUST_NOT_CLAIM, "Guaranteed fabrication quote"],
});

export const threeDPrintCostCheckContract: FormulaContract = buildAssuredCriticalContract({
  toolId: "free-traffic.3d-print-cost-check",
  toolName: "3D Print Cost Check",
  slug: "3d-print-cost-check",
  purpose:
    "Estimate visible 3D print job cost from material, machine time and post-processing before fail-rate modeling.",
  userDecision: "Does machine time exposure look reasonable before fail-rate and margin risk?",
  decisionImpact: "technical",
  requiredInputs: ["materialCost", "printHours", "machineRate", "postProcessHours", "laborRate"],
  criticalInputs: ["materialCost", "printHours", "machineRate", "postProcessHours", "laborRate"],
  outputs: ["recommendedPrice", "estimatedCost", "machineTimeCost", "riskLevel"],
  assumptions: [
    FINANCIAL_SIMULATION_DISCLAIMER,
    freeTrafficProductionAssumption(
      "3d-print-cost-check",
      "material + printHours×machineRate + postProcess×laborRate",
    ),
    "Revenue alternate: src/lib/tools/free-sector-calculations.ts → calculate3dPrintFreeResult (machine/material ratio risk).",
    "riskLevel is a narrative risk signal; estimatedCost is the primary numeric print job cost target.",
  ],
  formulaSummary:
    "Free-traffic: estimatedCost = material + printHours×machineRate + postProcessHours×laborRate; revenue-free uses fail-probability risk bands on long prints.",
  missingParameterWarnings: [],
  warningPolicy: createWarningPolicy({
    acceptedAssumptions: [
      "Flat machine and labor rates; post-process hours on free-traffic path.",
      GOVERNANCE_RECOMMENDED_PRICE_TARGET_NOTE,
      "recommendedPrice metadata alias equals visible 3D print job cost (estimatedCost).",
    ],
    modelLimitations: [
      "Machine calibration, support material and failed prints not fully modeled",
      "Post-processing complexity and material-specific fail curves simplified on revenue path",
      "Premium fail-rate and margin floor excluded on free tier",
    ],
    futureExtensions: [
      "Unified oracle across free-traffic and revenue-free 3D print paths",
      "3d-print-job-margin-tool integration",
    ],
  }),
  validationRules: [
    { id: "hours-non-negative", description: "printHours and postProcessHours must be ≥ 0", kind: "edge" },
    { id: "material-non-negative", description: "materialCost must be ≥ 0", kind: "edge" },
    { id: "rate-positive", description: "machineRate and laborRate must be > 0 when hours > 0", kind: "dimensional" },
    {
      id: "print-cost-dimension",
      description: "estimatedCost and recommendedPrice use currency semantics for governance target",
      kind: "purpose",
    },
  ],
  scenarioSpecs: [
    { id: "normal-print-job", description: "Normal case: short print with light post-process" },
    { id: "edge-long-print", description: "Edge case: print hours above 12 trigger fail-risk signal" },
    { id: "absurd-negative-material", description: "Absurd input: negative material cost rejected" },
    { id: "directional-hours", description: "Directional: longer print hours increase estimated cost" },
    { id: "sensitivity-post", description: "Sensitivity: post-process hours increase total cost" },
  ],
  monotonicityRules: [
    {
      id: "hours-up-cost",
      description: "Higher printHours must not decrease estimated cost",
      inputKey: "printHours",
      direction: "increase_should_increase",
      outputKey: "estimatedCost",
    },
    {
      id: "material-up-cost",
      description: "Higher materialCost must not decrease estimated cost",
      inputKey: "materialCost",
      direction: "increase_should_increase",
      outputKey: "estimatedCost",
    },
    {
      id: "post-up-cost",
      description: "Higher postProcessHours must not decrease estimated cost",
      inputKey: "postProcessHours",
      direction: "increase_should_increase",
      outputKey: "estimatedCost",
    },
  ],
  decisionLanguageRules: [STANDARD_DECISION_LANGUAGE_RULE],
  mustNotClaim: [...STANDARD_MUST_NOT_CLAIM, "Guaranteed print job success"],
});

export const BATCH_PREMIUM_BATCH3_CRITICAL_FORMULA_CONTRACTS: readonly FormulaContract[] = [
  hvacProjectMarginGuardContract,
  panelShopMarginVerdictContract,
  landscapingContractProfitToolContract,
  autoShopMarginLeakDetectorContract,
  signageBidSafePriceToolContract,
  millworkBidRiskAnalyzerContract,
  roofingContractMarginGuardContract,
  paintingJobProfitVerdictContract,
  sheetMetalQuoteRiskToolContract,
  threeDPrintCostCheckContract,
];

export const BATCH_FREE_BATCH2_CRITICAL_FORMULA_CONTRACTS: readonly FormulaContract[] = [
  sampleSizeCalculatorContract,
  hvacTonnageRuleCheckContract,
  electricalLaborEstimatorContract,
  lawnCareCostCheckContract,
  repairTimeVsPriceCheckContract,
  printJobCostCheckContract,
  plumbingJobMarginVerdictContract,
  cabinetCostEstimatorContract,
  roofingSquareCostCheckContract,
  laserCuttingTimeCheckContract,
];

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
  ...BATCH_FREE_BATCH2_CRITICAL_FORMULA_CONTRACTS,
  ...BATCH_PREMIUM_BATCH3_CRITICAL_FORMULA_CONTRACTS,
];

export const BATCH_FREE_BATCH2_ORACLE_WIRED_SLUGS = [
  ...BATCH_FREE_BATCH2_CRITICAL_SLUGS,
] as const;

export const BATCH_PREMIUM_BATCH3_ORACLE_WIRED_SLUGS = [
  ...BATCH_PREMIUM_BATCH3_CRITICAL_SLUGS,
] as const;

export const BATCH_EXPANSION_ORACLE_WIRED_SLUGS = [
  ...BATCH_FREE_ORACLE_WIRED_SLUGS,
  ...BATCH_PREMIUM_ORACLE_WIRED_SLUGS,
  ...BATCH_FREE_BATCH2_ORACLE_WIRED_SLUGS,
  ...BATCH_PREMIUM_BATCH3_ORACLE_WIRED_SLUGS,
] as const;

export const BATCH_EXPANSION_CRITICAL_SLUGS: readonly string[] =
  BATCH_EXPANSION_CRITICAL_FORMULA_CONTRACTS.map((contract) => contract.slug);
