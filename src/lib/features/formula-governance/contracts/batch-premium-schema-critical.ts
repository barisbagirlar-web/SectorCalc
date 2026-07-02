/**
 * Phase 5H - premium-schema batch FormulaContracts (11 legacy paid slugs).
 */

import type { FormulaContract } from "@/lib/features/formula-governance/types";
import {
  GOVERNANCE_RECOMMENDED_PRICE_TARGET_NOTE,
  PREMIUM_DECISION_PRODUCTION_FILE,
  STANDARD_DECISION_LANGUAGE_RULE,
  STANDARD_MUST_NOT_CLAIM,
  buildAssuredCriticalContract,
  calculatorProductionAssumption,
} from "@/lib/features/formula-governance/contracts/shared";
import { createWarningPolicy } from "@/lib/features/formula-governance/warning-policy";
import { BATCH_PREMIUM_SCHEMA_CRITICAL_SLUGS } from "@/lib/features/formula-governance/premium-schema-governance/premium-schema-critical-slugs";

const PREMIUM_DECISION_DISCLAIMER =
  "Technical simulation only - not financial, legal, or engineering advice. Verify assumptions before bid, pricing or business decisions.";

function premiumSchemaContract(
  config: Parameters<typeof buildAssuredCriticalContract>[0],
): FormulaContract {
  return buildAssuredCriticalContract(config);
}

export const routeOptimizationAnalyzerContract: FormulaContract = premiumSchemaContract({
  toolId: "revenue-premium.route-optimization-analyzer",
  toolName: "Route & Freight Loss Analyzer",
  slug: "route-optimization-analyzer",
  purpose:
    "Model deadhead, tolls, driver rest risk and minimum safe freight price for logistics lanes.",
  userDecision: "Is this freight lane priced safely given distance, fuel and deadhead exposure?",
  decisionImpact: "pricing",
  requiredInputs: [
    "distanceKm",
    "fuelPricePerKm",
    "driverHourlyRate",
    "estimatedHours",
    "targetMargin",
  ],
  criticalInputs: [
    "distanceKm",
    "fuelPricePerKm",
    "driverHourlyRate",
    "estimatedHours",
    "targetMargin",
  ],
  outputs: ["minimumSafePrice", "quoteVerdict", "p90Cost", "baseCost"],
  assumptions: [
    PREMIUM_DECISION_DISCLAIMER,
    calculatorProductionAssumption(
      PREMIUM_DECISION_PRODUCTION_FILE,
      'BASE_COST_CALCULATORS["route-optimization-analyzer"] → calcRoute + MarginCore',
    ),
    "Yes/no selects returnEmpty, hasTolls and overweightRisk pass through to calcRoute unchanged.",
  ],
  formulaSummary:
    "baseCost from calculateLogisticsRouteOptimizationResult realTotalCost; safe price via hidden multipliers and volatility buffer.",
  missingParameterWarnings: [],
  warningPolicy: createWarningPolicy({
    acceptedAssumptions: [
      "Deadhead and toll flags applied in production route optimizer before MarginCore.",
      GOVERNANCE_RECOMMENDED_PRICE_TARGET_NOTE,
    ],
    modelLimitations: [
      "Driver hours-of-service and detention not fully itemized",
      "Lane-specific fuel surcharges simplified",
    ],
    futureExtensions: ["Schema route full-loop bridge via premium-schema-form-canonical"],
  }),
  validationRules: [
    { id: "distance-positive", description: "distanceKm must be > 0", kind: "edge" },
    { id: "rate-non-negative", description: "fuelPricePerKm and driverHourlyRate must be ≥ 0", kind: "edge" },
    { id: "margin-percent", description: "targetMargin within 0–100%", kind: "dimensional" },
  ],
  scenarioSpecs: [
    { id: "normal-lane", description: "Normal case: loaded lane with moderate distance" },
    { id: "edge-deadhead", description: "Edge case: empty return raises route cost" },
    { id: "absurd-zero-distance", description: "Absurd input: zero distance rejected" },
    { id: "directional-distance", description: "Directional: longer distance raises base cost" },
    { id: "sensitivity-margin", description: "Sensitivity: higher targetMargin raises minimum safe price" },
  ],
  monotonicityRules: [
    {
      id: "distance-up-floor",
      description: "Higher distanceKm must not decrease minimum safe price",
      inputKey: "distanceKm",
      direction: "increase_should_increase",
      outputKey: "minimumSafePrice",
    },
    {
      id: "fuel-up-floor",
      description: "Higher fuelPricePerKm must not decrease minimum safe price",
      inputKey: "fuelPricePerKm",
      direction: "increase_should_increase",
      outputKey: "minimumSafePrice",
    },
  ],
  decisionLanguageRules: [STANDARD_DECISION_LANGUAGE_RULE],
  mustNotClaim: ["dummy"],
});

export const energyEfficiencyReportContract: FormulaContract = premiumSchemaContract({
  toolId: "revenue-premium.energy-efficiency-report",
  toolName: "Energy Efficiency Report",
  slug: "energy-efficiency-report",
  purpose: "Model demand charges, power factor penalty and true monthly energy cost floor.",
  userDecision: "Does this facility's energy spend leave room for efficiency targets?",
  decisionImpact: "financial",
  requiredInputs: [
    "monthlyKwh",
    "tariffPerKwh",
    "demandCharge",
    "powerFactorPenalty",
    "efficiencyTargetPercent",
    "targetSavings",
  ],
  criticalInputs: ["monthlyKwh", "tariffPerKwh", "demandCharge", "powerFactorPenalty"],
  outputs: ["minimumSafePrice", "quoteVerdict", "p90Cost", "baseCost"],
  assumptions: [
    PREMIUM_DECISION_DISCLAIMER,
    calculatorProductionAssumption(
      PREMIUM_DECISION_PRODUCTION_FILE,
      'BASE_COST_CALCULATORS["energy-efficiency-report"] → calcEnergy + MarginCore',
    ),
  ],
  formulaSummary:
    "baseCost = monthlyKwh×tariff + demandCharge + power factor penalty; safe price via hidden multipliers.",
  missingParameterWarnings: [],
  warningPolicy: createWarningPolicy({
    acceptedAssumptions: [
      "targetSavings maps to target margin for MarginCore floor.",
      GOVERNANCE_RECOMMENDED_PRICE_TARGET_NOTE,
    ],
    modelLimitations: ["Time-of-use tariffs and seasonal ratchets simplified"],
    futureExtensions: ["Peak kW interval modeling"],
  }),
  validationRules: [
    { id: "kwh-positive", description: "monthlyKwh must be > 0", kind: "edge" },
    { id: "tariff-non-negative", description: "tariffPerKwh must be ≥ 0", kind: "edge" },
    {
      id: "pf-penalty-percent",
      description: "powerFactorPenalty and targetSavings use percent semantics",
      kind: "dimensional",
    },
  ],
  scenarioSpecs: [
    { id: "normal-facility", description: "Normal case: mid-size facility with demand charge" },
    { id: "edge-high-pf", description: "Edge case: elevated power factor penalty" },
    { id: "absurd-zero-kwh", description: "Absurd input: zero kWh rejected" },
    { id: "directional-demand", description: "Directional: higher demand charge raises base cost" },
    { id: "sensitivity-tariff", description: "Sensitivity: higher tariff raises minimum safe price" },
  ],
  monotonicityRules: [
    {
      id: "kwh-up-floor",
      description: "Higher monthlyKwh must not decrease minimum safe price",
      inputKey: "monthlyKwh",
      direction: "increase_should_increase",
      outputKey: "minimumSafePrice",
    },
  ],
  decisionLanguageRules: [STANDARD_DECISION_LANGUAGE_RULE],
  mustNotClaim: ["dummy"],
});

export const mealPlanningVerdictContract: FormulaContract = premiumSchemaContract({
  toolId: "revenue-premium.meal-planning-verdict",
  toolName: "Weekly Meal Planning Verdict",
  slug: "meal-planning-verdict",
  purpose: "Model weekly grocery budget with waste and inflation buffer.",
  userDecision: "Is this weekly grocery budget realistic after waste and inflation?",
  decisionImpact: "financial",
  requiredInputs: [
    "mealsPerWeek",
    "weeklyGroceryBudget",
    "foodWastePercent",
    "inflationBuffer",
    "householdSize",
    "targetSavings",
  ],
  criticalInputs: ["weeklyGroceryBudget", "foodWastePercent", "inflationBuffer"],
  outputs: ["minimumSafePrice", "quoteVerdict", "p90Cost", "baseCost"],
  assumptions: [
    PREMIUM_DECISION_DISCLAIMER,
    calculatorProductionAssumption(
      PREMIUM_DECISION_PRODUCTION_FILE,
      'BASE_COST_CALCULATORS["meal-planning-verdict"] → calcMeal + MarginCore',
    ),
  ],
  formulaSummary:
    "baseCost = weeklyGroceryBudget + waste allowance + inflation buffer; safe price via hidden multipliers.",
  missingParameterWarnings: [],
  warningPolicy: createWarningPolicy({
    acceptedAssumptions: [GOVERNANCE_RECOMMENDED_PRICE_TARGET_NOTE],
    modelLimitations: ["Regional grocery prices and dietary restrictions not modeled"],
    futureExtensions: ["Per-meal scaling from household size"],
  }),
  validationRules: [
    { id: "budget-positive", description: "weeklyGroceryBudget must be > 0", kind: "edge" },
    { id: "waste-percent", description: "foodWastePercent within 0–100%", kind: "dimensional" },
  ],
  scenarioSpecs: [
    { id: "normal-household", description: "Normal case: typical weekly grocery budget" },
    { id: "edge-high-waste", description: "Edge case: elevated food waste percent" },
    { id: "absurd-zero-budget", description: "Absurd input: zero budget rejected" },
    { id: "directional-waste", description: "Directional: higher waste raises base cost" },
    { id: "sensitivity-inflation", description: "Sensitivity: inflation buffer raises adjusted budget" },
  ],
  monotonicityRules: [
    {
      id: "budget-up-floor",
      description: "Higher weeklyGroceryBudget must not decrease minimum safe price",
      inputKey: "weeklyGroceryBudget",
      direction: "increase_should_increase",
      outputKey: "minimumSafePrice",
    },
  ],
  decisionLanguageRules: [STANDARD_DECISION_LANGUAGE_RULE],
  mustNotClaim: ["dummy"],
});

export const tripBudgetOptimizerContract: FormulaContract = premiumSchemaContract({
  toolId: "revenue-premium.trip-budget-optimizer",
  toolName: "Trip Budget Optimizer",
  slug: "trip-budget-optimizer",
  purpose: "Add tolls, return leg and buffer for realistic trip budget.",
  userDecision: "Is this trip budget sufficient for fuel, tolls and return leg?",
  decisionImpact: "financial",
  requiredInputs: [
    "distanceKm",
    "consumptionPer100Km",
    "fuelPricePerLiter",
    "tollEstimate",
    "parkingPerDay",
    "bufferPercent",
  ],
  criticalInputs: ["distanceKm", "consumptionPer100Km", "fuelPricePerLiter", "bufferPercent"],
  outputs: ["minimumSafePrice", "quoteVerdict", "p90Cost", "baseCost"],
  assumptions: [
    PREMIUM_DECISION_DISCLAIMER,
    calculatorProductionAssumption(
      PREMIUM_DECISION_PRODUCTION_FILE,
      'BASE_COST_CALCULATORS["trip-budget-optimizer"] → calcTrip + MarginCore',
    ),
    "returnTrip yes/no select passes through to calcTrip unchanged.",
  ],
  formulaSummary:
    "baseCost = fuel + tolls + parking with buffer percent; safe price via hidden multipliers.",
  missingParameterWarnings: [],
  warningPolicy: createWarningPolicy({
    acceptedAssumptions: [GOVERNANCE_RECOMMENDED_PRICE_TARGET_NOTE],
    modelLimitations: ["Hotel and meal stops not itemized"],
    futureExtensions: ["Multi-day parking scaling"],
  }),
  validationRules: [
    { id: "distance-positive", description: "distanceKm must be > 0", kind: "edge" },
    { id: "consumption-positive", description: "consumptionPer100Km must be > 0", kind: "edge" },
    {
      id: "buffer-percent",
      description: "bufferPercent uses percent semantics for trip budget buffer",
      kind: "dimensional",
    },
  ],
  scenarioSpecs: [
    { id: "normal-trip", description: "Normal case: one-way trip with tolls" },
    { id: "edge-return-trip", description: "Edge case: return trip doubles distance" },
    { id: "absurd-zero-distance", description: "Absurd input: zero distance rejected" },
    { id: "directional-tolls", description: "Directional: higher tolls raise base cost" },
    { id: "sensitivity-buffer", description: "Sensitivity: buffer percent raises budget floor" },
  ],
  monotonicityRules: [
    {
      id: "distance-up-floor",
      description: "Higher distanceKm must not decrease minimum safe price",
      inputKey: "distanceKm",
      direction: "increase_should_increase",
      outputKey: "minimumSafePrice",
    },
  ],
  decisionLanguageRules: [STANDARD_DECISION_LANGUAGE_RULE],
  mustNotClaim: ["dummy"],
});

export const cbamComplianceVerdictContract: FormulaContract = premiumSchemaContract({
  toolId: "revenue-premium.cbam-compliance-verdict",
  toolName: "CBAM Compliance Verdict",
  slug: "cbam-compliance-verdict",
  purpose: "Model process emissions, transport and CBAM cost exposure on EU exports.",
  userDecision: "Does export pricing cover CBAM carbon border cost at target margin?",
  decisionImpact: "financial",
  requiredInputs: [
    "productionTons",
    "euImportValue",
    "processEmissionsFactor",
    "targetMargin",
  ],
  criticalInputs: ["productionTons", "euImportValue", "processEmissionsFactor", "targetMargin"],
  outputs: ["minimumSafePrice", "quoteVerdict", "p90Cost", "baseCost"],
  assumptions: [
    PREMIUM_DECISION_DISCLAIMER,
    calculatorProductionAssumption(
      PREMIUM_DECISION_PRODUCTION_FILE,
      'BASE_COST_CALCULATORS["cbam-compliance-verdict"] → calcCbam + MarginCore',
    ),
    "energySource and includesTransport selects pass through to calcCbam unchanged.",
  ],
  formulaSummary:
    "baseCost from calculateCbamComplianceResult cbamCostCurrent; safe price via hidden multipliers.",
  missingParameterWarnings: [],
  warningPolicy: createWarningPolicy({
    acceptedAssumptions: [GOVERNANCE_RECOMMENDED_PRICE_TARGET_NOTE],
    modelLimitations: ["EU ETS price volatility simplified", "Product-specific benchmarks approximated"],
    futureExtensions: ["Country-specific CBAM factor tables"],
  }),
  validationRules: [
    { id: "tons-positive", description: "productionTons must be > 0", kind: "edge" },
    { id: "import-positive", description: "euImportValue must be > 0", kind: "edge" },
    {
      id: "margin-percent",
      description: "targetMargin uses percent semantics for export price floor",
      kind: "dimensional",
    },
  ],
  scenarioSpecs: [
    { id: "normal-export", description: "Normal case: moderate production volume and import value" },
    { id: "edge-coal-energy", description: "Edge case: coal energy source raises CBAM cost" },
    { id: "absurd-zero-tons", description: "Absurd input: zero production tons rejected" },
    { id: "directional-tons", description: "Directional: higher production tons raises base cost" },
    { id: "sensitivity-margin", description: "Sensitivity: higher targetMargin raises minimum safe price" },
  ],
  monotonicityRules: [
    {
      id: "tons-up-floor",
      description: "Higher productionTons must not decrease minimum safe price",
      inputKey: "productionTons",
      direction: "increase_should_increase",
      outputKey: "minimumSafePrice",
    },
  ],
  decisionLanguageRules: [STANDARD_DECISION_LANGUAGE_RULE],
  mustNotClaim: [...STANDARD_MUST_NOT_CLAIM, "EU compliance certification"],
});

export const cropYieldLossAnalyzerContract: FormulaContract = premiumSchemaContract({
  toolId: "revenue-premium.crop-yield-loss-analyzer",
  toolName: "Crop Yield Loss Analyzer",
  slug: "crop-yield-loss-analyzer",
  purpose: "Model moisture, weather and input cost leaks with yield verdict.",
  userDecision: "Does expected yield cover fertilizer and irrigation cost at target margin?",
  decisionImpact: "financial",
  requiredInputs: [
    "areaHectares",
    "expectedYieldTonnes",
    "fertilizerCost",
    "irrigationCost",
    "soilMoisturePercent",
    "weatherRiskIndex",
    "targetMargin",
  ],
  criticalInputs: [
    "areaHectares",
    "expectedYieldTonnes",
    "fertilizerCost",
    "irrigationCost",
    "targetMargin",
  ],
  outputs: ["minimumSafePrice", "quoteVerdict", "p90Cost", "baseCost"],
  assumptions: [
    PREMIUM_DECISION_DISCLAIMER,
    calculatorProductionAssumption(
      PREMIUM_DECISION_PRODUCTION_FILE,
      'BASE_COST_CALCULATORS["crop-yield-loss-analyzer"] → calcCrop + MarginCore',
    ),
  ],
  formulaSummary:
    "baseCost = max(0, baseRevenue − realProfit) from crop yield optimizer; safe price via MarginCore.",
  missingParameterWarnings: [],
  warningPolicy: createWarningPolicy({
    acceptedAssumptions: [GOVERNANCE_RECOMMENDED_PRICE_TARGET_NOTE],
    modelLimitations: ["Crop type fixed to wheat in production calcCrop path"],
    futureExtensions: ["Multi-crop selector in contract inputs"],
  }),
  validationRules: [
    { id: "area-positive", description: "areaHectares must be > 0", kind: "edge" },
    { id: "yield-non-negative", description: "expectedYieldTonnes must be ≥ 0", kind: "edge" },
    {
      id: "margin-percent",
      description: "targetMargin and soilMoisturePercent use percent semantics",
      kind: "dimensional",
    },
  ],
  scenarioSpecs: [
    { id: "normal-field", description: "Normal case: moderate field with standard inputs" },
    { id: "edge-weather", description: "Edge case: elevated weather risk index" },
    { id: "absurd-zero-area", description: "Absurd input: zero area rejected" },
    { id: "directional-fertilizer", description: "Directional: higher fertilizer cost raises base cost" },
    { id: "sensitivity-margin", description: "Sensitivity: higher targetMargin raises minimum safe price" },
  ],
  monotonicityRules: [
    {
      id: "fertilizer-up-floor",
      description: "Higher fertilizerCost must not decrease minimum safe price",
      inputKey: "fertilizerCost",
      direction: "increase_should_increase",
      outputKey: "minimumSafePrice",
    },
  ],
  decisionLanguageRules: [STANDARD_DECISION_LANGUAGE_RULE],
  mustNotClaim: ["dummy"],
});

export const feedEfficiencyAnalyzerContract: FormulaContract = premiumSchemaContract({
  toolId: "revenue-premium.feed-efficiency-analyzer",
  toolName: "Feed Efficiency Analyzer",
  slug: "feed-efficiency-analyzer",
  purpose: "Model waste, water quality and feed-to-output efficiency.",
  userDecision: "Is monthly feed spend efficient after waste and spoilage?",
  decisionImpact: "financial",
  requiredInputs: [
    "animalCount",
    "dailyFeedKg",
    "feedPricePerKg",
    "feedWastePercent",
    "waterQualityIndex",
    "targetMargin",
  ],
  criticalInputs: ["animalCount", "dailyFeedKg", "feedPricePerKg", "feedWastePercent"],
  outputs: ["minimumSafePrice", "quoteVerdict", "p90Cost", "baseCost"],
  assumptions: [
    PREMIUM_DECISION_DISCLAIMER,
    calculatorProductionAssumption(
      PREMIUM_DECISION_PRODUCTION_FILE,
      'BASE_COST_CALCULATORS["feed-efficiency-analyzer"] → calcFeed + MarginCore',
    ),
  ],
  formulaSummary:
    "baseCost = monthly feed + waste allowance; safe price via hidden multipliers.",
  missingParameterWarnings: [],
  warningPolicy: createWarningPolicy({
    acceptedAssumptions: [GOVERNANCE_RECOMMENDED_PRICE_TARGET_NOTE],
    modelLimitations: ["Milk yield per head not in base cost path"],
    futureExtensions: ["Output efficiency ratio in validation loop"],
  }),
  validationRules: [
    { id: "herd-positive", description: "animalCount must be > 0", kind: "edge" },
    { id: "feed-positive", description: "dailyFeedKg and feedPricePerKg must be > 0", kind: "edge" },
    {
      id: "waste-percent",
      description: "feedWastePercent and targetMargin use percent semantics",
      kind: "dimensional",
    },
  ],
  scenarioSpecs: [
    { id: "normal-herd", description: "Normal case: moderate herd with standard ration" },
    { id: "edge-high-waste", description: "Edge case: elevated feed waste percent" },
    { id: "absurd-zero-herd", description: "Absurd input: zero animal count rejected" },
    { id: "directional-price", description: "Directional: higher feed price raises base cost" },
    { id: "sensitivity-waste", description: "Sensitivity: waste percent raises minimum safe price" },
  ],
  monotonicityRules: [
    {
      id: "price-up-floor",
      description: "Higher feedPricePerKg must not decrease minimum safe price",
      inputKey: "feedPricePerKg",
      direction: "increase_should_increase",
      outputKey: "minimumSafePrice",
    },
  ],
  decisionLanguageRules: [STANDARD_DECISION_LANGUAGE_RULE],
  mustNotClaim: ["dummy"],
});

export const dairyProfitDetectorContract: FormulaContract = premiumSchemaContract({
  toolId: "revenue-premium.dairy-profit-detector",
  toolName: "Dairy Profit Detector",
  slug: "dairy-profit-detector",
  purpose: "Detect dairy profit leaks with full cost stack verdict.",
  userDecision: "Does milk revenue cover feed, labor and health costs at target margin?",
  decisionImpact: "financial",
  requiredInputs: [
    "cowCount",
    "litersPerCowPerDay",
    "milkPricePerLiter",
    "monthlyFeedCost",
    "laborCost",
    "vetAndHealth",
    "targetMargin",
  ],
  criticalInputs: ["monthlyFeedCost", "laborCost", "vetAndHealth", "targetMargin"],
  outputs: ["minimumSafePrice", "quoteVerdict", "p90Cost", "baseCost"],
  assumptions: [
    PREMIUM_DECISION_DISCLAIMER,
    calculatorProductionAssumption(
      PREMIUM_DECISION_PRODUCTION_FILE,
      'BASE_COST_CALCULATORS["dairy-profit-detector"] → calcDairy + MarginCore',
    ),
  ],
  formulaSummary:
    "baseCost = monthlyFeedCost + laborCost + vetAndHealth; safe price via hidden multipliers.",
  missingParameterWarnings: [],
  warningPolicy: createWarningPolicy({
    acceptedAssumptions: [GOVERNANCE_RECOMMENDED_PRICE_TARGET_NOTE],
    modelLimitations: ["Cull replacement capital not in visible base cost"],
    futureExtensions: ["Revenue-side milk yield cross-check"],
  }),
  validationRules: [
    { id: "costs-non-negative", description: "monthly cost inputs must be ≥ 0", kind: "edge" },
    { id: "margin-percent", description: "targetMargin within 0–100%", kind: "dimensional" },
  ],
  scenarioSpecs: [
    { id: "normal-dairy", description: "Normal case: mid-size dairy with standard costs" },
    { id: "edge-high-feed", description: "Edge case: elevated monthly feed cost" },
    { id: "absurd-negative-cost", description: "Absurd input: negative labor cost rejected" },
    { id: "directional-feed", description: "Directional: higher feed cost raises base cost" },
    { id: "sensitivity-margin", description: "Sensitivity: higher targetMargin raises minimum safe price" },
  ],
  monotonicityRules: [
    {
      id: "feed-up-floor",
      description: "Higher monthlyFeedCost must not decrease minimum safe price",
      inputKey: "monthlyFeedCost",
      direction: "increase_should_increase",
      outputKey: "minimumSafePrice",
    },
  ],
  decisionLanguageRules: [STANDARD_DECISION_LANGUAGE_RULE],
  mustNotClaim: ["dummy"],
});

export const waterOptimizationVerdictContract: FormulaContract = premiumSchemaContract({
  toolId: "revenue-premium.water-optimization-verdict",
  toolName: "Water Efficiency Verdict",
  slug: "water-optimization-verdict",
  purpose: "Find minimum viable irrigation spend with efficiency verdict.",
  userDecision: "Is irrigation spend efficient after pumping, rights and evaporation loss?",
  decisionImpact: "financial",
  requiredInputs: [
    "areaHectares",
    "pumpingHours",
    "electricityRate",
    "waterRightsFee",
    "evaporationLossPercent",
    "targetMargin",
  ],
  criticalInputs: [
    "areaHectares",
    "pumpingHours",
    "electricityRate",
    "evaporationLossPercent",
    "targetMargin",
  ],
  outputs: ["minimumSafePrice", "quoteVerdict", "p90Cost", "baseCost"],
  assumptions: [
    PREMIUM_DECISION_DISCLAIMER,
    calculatorProductionAssumption(
      PREMIUM_DECISION_PRODUCTION_FILE,
      'BASE_COST_CALCULATORS["water-optimization-verdict"] → calcWater + MarginCore',
    ),
  ],
  formulaSummary:
    "baseCost = pumping + water rights + evaporation allowance; safe price via hidden multipliers.",
  missingParameterWarnings: [],
  warningPolicy: createWarningPolicy({
    acceptedAssumptions: [GOVERNANCE_RECOMMENDED_PRICE_TARGET_NOTE],
    modelLimitations: ["Canal seepage and district allocation rules simplified"],
    futureExtensions: ["Crop ET requirement cross-check"],
  }),
  validationRules: [
    { id: "area-positive", description: "areaHectares must be > 0", kind: "edge" },
    { id: "pumping-non-negative", description: "pumpingHours must be ≥ 0", kind: "edge" },
    {
      id: "evap-percent",
      description: "evaporationLossPercent and targetMargin use percent semantics",
      kind: "dimensional",
    },
  ],
  scenarioSpecs: [
    { id: "normal-irrigation", description: "Normal case: standard irrigated acreage" },
    { id: "edge-high-evap", description: "Edge case: elevated evaporation loss percent" },
    { id: "absurd-zero-area", description: "Absurd input: zero area rejected" },
    { id: "directional-pumping", description: "Directional: more pumping hours raise base cost" },
    { id: "sensitivity-rights", description: "Sensitivity: water rights fee raises minimum safe price" },
  ],
  monotonicityRules: [
    {
      id: "pumping-up-floor",
      description: "Higher pumpingHours must not decrease minimum safe price",
      inputKey: "pumpingHours",
      direction: "increase_should_increase",
      outputKey: "minimumSafePrice",
    },
  ],
  decisionLanguageRules: [STANDARD_DECISION_LANGUAGE_RULE],
  mustNotClaim: ["dummy"],
});

export const renovationBudgetOptimizerContract: FormulaContract = premiumSchemaContract({
  toolId: "revenue-premium.renovation-budget-optimizer",
  toolName: "Renovation Budget Optimizer",
  slug: "renovation-budget-optimizer",
  purpose: "Add seasonal delay, regional multiplier and realistic renovation total.",
  userDecision: "Is this renovation budget realistic after contingency and regional premiums?",
  decisionImpact: "financial",
  requiredInputs: ["areaM2", "contingencyPercent"],
  criticalInputs: ["areaM2", "contingencyPercent"],
  outputs: ["minimumSafePrice", "quoteVerdict", "p90Cost", "baseCost"],
  assumptions: [
    PREMIUM_DECISION_DISCLAIMER,
    calculatorProductionAssumption(
      PREMIUM_DECISION_PRODUCTION_FILE,
      'BASE_COST_CALCULATORS["renovation-budget-optimizer"] → calcRenovation + MarginCore',
    ),
    "materialQuality, season, cityTier and includeLabor selects pass through to calcRenovation.",
  ],
  formulaSummary:
    "baseCost from calculateRenovationBudgetOptimizerResult realTotal with contingency; safe price via MarginCore.",
  missingParameterWarnings: [],
  warningPolicy: createWarningPolicy({
    acceptedAssumptions: [GOVERNANCE_RECOMMENDED_PRICE_TARGET_NOTE],
    modelLimitations: ["Permit and inspection fees not itemized"],
    futureExtensions: ["City-tier lookup table expansion"],
  }),
  validationRules: [
    { id: "area-positive", description: "areaM2 must be > 0", kind: "edge" },
    { id: "contingency-percent", description: "contingencyPercent within 0–100%", kind: "dimensional" },
  ],
  scenarioSpecs: [
    { id: "normal-renovation", description: "Normal case: standard summer renovation" },
    { id: "edge-winter", description: "Edge case: winter season raises delay buffer" },
    { id: "absurd-zero-area", description: "Absurd input: zero area rejected" },
    { id: "directional-area", description: "Directional: larger area raises base cost" },
    { id: "sensitivity-contingency", description: "Sensitivity: contingency percent raises budget floor" },
  ],
  monotonicityRules: [
    {
      id: "area-up-floor",
      description: "Higher areaM2 must not decrease minimum safe price",
      inputKey: "areaM2",
      direction: "increase_should_increase",
      outputKey: "minimumSafePrice",
    },
  ],
  decisionLanguageRules: [STANDARD_DECISION_LANGUAGE_RULE],
  mustNotClaim: ["dummy"],
});

export const threeDPrintJobMarginToolContract: FormulaContract = premiumSchemaContract({
  toolId: "revenue-premium.3d-print-job-margin-tool",
  toolName: "3D Print Job Margin Tool",
  slug: "3d-print-job-margin-tool",
  purpose: "Find minimum print price with fail rate and post-processing included.",
  userDecision: "Is this print job quoted safely given material, machine time and fail rate?",
  decisionImpact: "pricing",
  requiredInputs: [
    "materialCost",
    "printHours",
    "machineRate",
    "postProcessHours",
    "laborRate",
    "failRatePercent",
    "targetMargin",
  ],
  criticalInputs: [
    "materialCost",
    "printHours",
    "machineRate",
    "failRatePercent",
    "targetMargin",
  ],
  outputs: ["minimumSafePrice", "quoteVerdict", "p90Cost", "baseCost"],
  assumptions: [
    PREMIUM_DECISION_DISCLAIMER,
    calculatorProductionAssumption(
      PREMIUM_DECISION_PRODUCTION_FILE,
      'BASE_COST_CALCULATORS["3d-print-job-margin-tool"] → calc3dPrint + MarginCore',
    ),
    "Distinct from free-traffic 3d-print-cost-check - paid slug uses fail-rate margin path.",
  ],
  formulaSummary:
    "baseCost = material + machine + post-process + support with fail-rate multiplier; safe price via MarginCore.",
  missingParameterWarnings: [],
  warningPolicy: createWarningPolicy({
    acceptedAssumptions: [GOVERNANCE_RECOMMENDED_PRICE_TARGET_NOTE],
    modelLimitations: ["Support material and machine calibration drift simplified"],
    futureExtensions: ["Unified oracle with free-traffic 3D print path"],
  }),
  validationRules: [
    { id: "hours-non-negative", description: "printHours and postProcessHours must be ≥ 0", kind: "edge" },
    { id: "rate-positive", description: "machineRate must be > 0 when printHours > 0", kind: "edge" },
    {
      id: "fail-rate-percent",
      description: "failRatePercent and targetMargin use percent semantics",
      kind: "dimensional",
    },
  ],
  scenarioSpecs: [
    { id: "normal-print-job", description: "Normal case: short print with light post-process" },
    { id: "edge-high-fail", description: "Edge case: elevated fail rate percent" },
    { id: "absurd-negative-material", description: "Absurd input: negative material cost rejected" },
    { id: "directional-hours", description: "Directional: longer print hours increase base cost" },
    { id: "sensitivity-margin", description: "Sensitivity: higher targetMargin raises minimum safe price" },
  ],
  monotonicityRules: [
    {
      id: "hours-up-floor",
      description: "Higher printHours must not decrease minimum safe price",
      inputKey: "printHours",
      direction: "increase_should_increase",
      outputKey: "minimumSafePrice",
    },
  ],
  decisionLanguageRules: [STANDARD_DECISION_LANGUAGE_RULE],
  mustNotClaim: ["dummy"],
});

export const BATCH_PREMIUM_SCHEMA_CRITICAL_FORMULA_CONTRACTS: readonly FormulaContract[] = [
  routeOptimizationAnalyzerContract,
  energyEfficiencyReportContract,
  mealPlanningVerdictContract,
  tripBudgetOptimizerContract,
  cropYieldLossAnalyzerContract,
  feedEfficiencyAnalyzerContract,
  dairyProfitDetectorContract,
  waterOptimizationVerdictContract,
  renovationBudgetOptimizerContract,
  threeDPrintJobMarginToolContract,
];

export const BATCH_PREMIUM_SCHEMA_ORACLE_WIRED_SLUGS = [
  ...BATCH_PREMIUM_SCHEMA_CRITICAL_SLUGS,
] as const;
