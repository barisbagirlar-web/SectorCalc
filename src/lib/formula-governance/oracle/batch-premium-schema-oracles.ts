/**
 * Premium-schema batch oracle baselines — independent reference implementations.
 * Mirrors premium-decision-engine calcRoute/calcCrop/calcWater/calcFeed/calcDairy/calcEnergy/
 * calcCbam/calcRenovation/calcTrip/calcMeal/calc3dPrint + MarginCore floor.
 */

import {
  calculateCbamComplianceResult,
  calculateCropYieldOptimizerResult,
  calculateFuelConsumptionResult,
  calculateLogisticsRouteOptimizationResult,
  calculateRenovationBudgetOptimizerResult,
  cbamCategoryFromProductionTons,
  cityFromTier,
} from "@/lib/tools/calculation-formulas";
import {
  OracleValidationError,
  type PremiumMarginOracleOutput,
} from "@/lib/formula-governance/oracle/oracle-types";

const Z_P90 = 1.2816;

const MARGIN_CORE_CONFIG = {
  "route-optimization-analyzer": {
    hiddenMultiplier: 1.12 * 1.08 * 1.05,
    toleranceMultiplier: 1.15,
    volatilityDefault: 0.13,
    targetMarginDefault: 0.18,
  },
  "energy-efficiency-report": {
    hiddenMultiplier: 1.1 * 1.05 * 1.04,
    toleranceMultiplier: 1.08,
    volatilityDefault: 0.1,
    targetMarginDefault: 0.1,
  },
  "meal-planning-verdict": {
    hiddenMultiplier: 1.15 * 1.08 * 1.05,
    toleranceMultiplier: 1.1,
    volatilityDefault: 0.09,
    targetMarginDefault: 0.1,
  },
  "trip-budget-optimizer": {
    hiddenMultiplier: 1.1 * 1.06 * 1.05,
    toleranceMultiplier: 1.08,
    volatilityDefault: 0.1,
    targetMarginDefault: 0.1,
  },
  "cbam-compliance-verdict": {
    hiddenMultiplier: 1.12 * 1.06 * 1.08,
    toleranceMultiplier: 1.15,
    volatilityDefault: 0.16,
    targetMarginDefault: 0.15,
  },
  "crop-yield-loss-analyzer": {
    hiddenMultiplier: 1.08 * 1.1 * 1.05,
    toleranceMultiplier: 1.12,
    volatilityDefault: 0.15,
    targetMarginDefault: 0.2,
  },
  "feed-efficiency-analyzer": {
    hiddenMultiplier: 1.08 * 1.05 * 1.04,
    toleranceMultiplier: 1.1,
    volatilityDefault: 0.12,
    targetMarginDefault: 0.15,
  },
  "dairy-profit-detector": {
    hiddenMultiplier: 1.06 * 1.08 * 1.05,
    toleranceMultiplier: 1.08,
    volatilityDefault: 0.13,
    targetMarginDefault: 0.12,
  },
  "water-optimization-verdict": {
    hiddenMultiplier: 1.12 * 1.06 * 1.04,
    toleranceMultiplier: 1.1,
    volatilityDefault: 0.11,
    targetMarginDefault: 0.18,
  },
  "renovation-budget-optimizer": {
    hiddenMultiplier: 1.1 * 1.12 * 1.08,
    toleranceMultiplier: 1.1,
    volatilityDefault: 0.14,
    targetMarginDefault: 0.1,
  },
  "3d-print-job-margin-tool": {
    hiddenMultiplier: 1.15 * 1.1 * 1.05,
    toleranceMultiplier: 1.1,
    volatilityDefault: 0.14,
    targetMarginDefault: 0.3,
  },
} as const;

type MarginCoreSlug = keyof typeof MARGIN_CORE_CONFIG;

export type PremiumSchemaOracleInputValues = Readonly<Record<string, number | string>>;

function assertNonNegative(value: number, label: string): void {
  if (!Number.isFinite(value) || value < 0) {
    throw new OracleValidationError("INVALID_COST", `${label} must be a non-negative finite number.`);
  }
}

function assertPositive(value: number, label: string): void {
  if (!Number.isFinite(value) || value <= 0) {
    throw new OracleValidationError("INVALID_PRICE", `${label} must be a positive finite number.`);
  }
}

function num(values: PremiumSchemaOracleInputValues, key: string, fallback = 0): number {
  const raw = values[key];
  if (raw === undefined || raw === null || raw === "") {
    return fallback;
  }
  const parsed = typeof raw === "number" ? raw : Number(String(raw).trim());
  return Number.isFinite(parsed) ? parsed : fallback;
}

function yes(values: PremiumSchemaOracleInputValues, key: string): boolean {
  return values[key] === "yes";
}

function pct(values: PremiumSchemaOracleInputValues, key: string, fallback: number): number {
  const raw = num(values, key, fallback);
  if (!Number.isFinite(raw) || raw <= 0) {
    return fallback;
  }
  return Math.min(Math.max(raw, 0), 100);
}

function marginToDecimal(raw: number, fallback: number): number {
  if (!Number.isFinite(raw) || raw <= 0) {
    return fallback;
  }
  return raw > 1 ? Math.min(raw, 95) / 100 : Math.min(raw, 0.95);
}

function round(value: number, digits = 2): number {
  if (!Number.isFinite(value)) {
    return 0;
  }
  const factor = 10 ** digits;
  return Math.round(value * factor) / factor;
}

function applyMarginCoreFloor(
  slug: MarginCoreSlug,
  baseCost: number,
  targetMarginRaw: number,
): PremiumMarginOracleOutput {
  const config = MARGIN_CORE_CONFIG[slug];
  const target = marginToDecimal(targetMarginRaw, config.targetMarginDefault);
  const adjustedCost = baseCost * config.hiddenMultiplier * config.toleranceMultiplier;
  const volatilityBuffer = adjustedCost * config.volatilityDefault * Z_P90;
  const p90Cost = adjustedCost + volatilityBuffer;
  const marginDenom = Math.max(0.05, 1 - target);
  const minimumSafePrice = p90Cost / marginDenom;

  return {
    baseCost: round(baseCost),
    p90Cost: round(p90Cost),
    minimumSafePrice: round(minimumSafePrice),
  };
}

function calcRouteBase(values: PremiumSchemaOracleInputValues): number {
  const route = calculateLogisticsRouteOptimizationResult({
    distanceKm: num(values, "distanceKm"),
    fuelPricePerKm: num(values, "fuelPricePerKm"),
    driverHourlyRate: num(values, "driverHourlyRate"),
    estimatedHours: num(values, "estimatedHours"),
    returnEmpty: yes(values, "returnEmpty"),
    hasTolls: yes(values, "hasTolls"),
    overweightRisk: yes(values, "overweightRisk"),
  });
  return "error" in route ? 0 : route.realTotalCost;
}

function calcCropBase(values: PremiumSchemaOracleInputValues): number {
  const area = num(values, "areaHectares");
  const yieldResult = calculateCropYieldOptimizerResult({
    cropType: "wheat",
    areaHectares: area,
    expectedYield: num(values, "expectedYieldTonnes"),
    fertilizerCost: num(values, "fertilizerCost"),
    irrigationCost: num(values, "irrigationCost"),
    laborCost: 0,
    marketPricePerTon: 250,
    soilMoisturePercent: num(values, "soilMoisturePercent") || 18,
    weatherRiskIndex: num(values, "weatherRiskIndex") || 3,
    pestPressureIndex: 3,
  });
  if ("error" in yieldResult) {
    return num(values, "fertilizerCost") + num(values, "irrigationCost");
  }
  return Math.max(0, yieldResult.baseRevenue - yieldResult.realProfit);
}

function calcWaterBase(values: PremiumSchemaOracleInputValues): number {
  const pumping =
    num(values, "areaHectares") * num(values, "pumpingHours") * num(values, "electricityRate");
  const rights = num(values, "waterRightsFee");
  const evap = pumping * (pct(values, "evaporationLossPercent", 12) / 100);
  return pumping + rights + evap;
}

function calcFeedBase(values: PremiumSchemaOracleInputValues): number {
  const baseFeed =
    num(values, "animalCount") * num(values, "dailyFeedKg") * 30 * num(values, "feedPricePerKg");
  const waste = baseFeed * (pct(values, "feedWastePercent", 8) / 100);
  return baseFeed + waste;
}

function calcDairyBase(values: PremiumSchemaOracleInputValues): number {
  return (
    num(values, "monthlyFeedCost") + num(values, "laborCost") + num(values, "vetAndHealth")
  );
}

function calcEnergyBase(values: PremiumSchemaOracleInputValues): number {
  const base = num(values, "monthlyKwh") * num(values, "tariffPerKwh");
  const demand = num(values, "demandCharge");
  const pf = base * (pct(values, "powerFactorPenalty", 5) / 100);
  return base + demand + pf;
}

function calcCbamBase(values: PremiumSchemaOracleInputValues): number {
  const source = (values.energySource as string) || "electricity";
  const prod = num(values, "productionTons");
  const cbam = calculateCbamComplianceResult({
    productionTons: prod,
    productCategory: cbamCategoryFromProductionTons(prod),
    energySource: source as "coal" | "gas" | "electricity" | "renewable",
    euImportValueEur: num(values, "euImportValue") || 1,
    processEfficiency: Math.max(0, 100 - (num(values, "processEmissionsFactor") || 0.2) * 10),
    transportDistanceKm: yes(values, "includesTransport") ? 800 : 0,
  });
  return "error" in cbam ? prod * 50 : cbam.cbamCostCurrent;
}

function calcRenovationBase(values: PremiumSchemaOracleInputValues): number {
  const quality = (values.materialQuality as string) || "standard";
  const season = (values.season as string) || "summer";
  const budget = calculateRenovationBudgetOptimizerResult({
    areaM2: num(values, "areaM2"),
    materialQuality: quality as "basic" | "standard" | "premium",
    includeLabor: yes(values, "includeLabor"),
    city: cityFromTier((values.cityTier as string) || "standard"),
    season: season as "summer" | "winter",
    buildingAge: season === "winter" ? 25 : 12,
    floorCount: 3,
  });
  if ("error" in budget) {
    return num(values, "areaM2") * 450;
  }
  const contingency = pct(values, "contingencyPercent", 10);
  return budget.realTotal * (1 + contingency / 100);
}

function calcTripBase(values: PremiumSchemaOracleInputValues): number {
  const distance = yes(values, "returnTrip")
    ? num(values, "distanceKm") * 2
    : num(values, "distanceKm");
  const fuel = calculateFuelConsumptionResult({
    distanceKm: distance,
    fuelPricePerLiter: num(values, "fuelPricePerLiter"),
    vehicleConsumption: num(values, "consumptionPer100Km"),
    drivingStyle: "normal",
  });
  const fuelCost = "error" in fuel ? 0 : fuel.totalCost;
  const subtotal = fuelCost + num(values, "tollEstimate") + num(values, "parkingPerDay");
  const buffer = pct(values, "bufferPercent", 12);
  return subtotal * (1 + buffer / 100);
}

function calcMealBase(values: PremiumSchemaOracleInputValues): number {
  const budget = num(values, "weeklyGroceryBudget");
  const waste = budget * (pct(values, "foodWastePercent", 15) / 100);
  const inflation = budget * (pct(values, "inflationBuffer", 8) / 100);
  return budget + waste + inflation;
}

function calc3dPrintBase(values: PremiumSchemaOracleInputValues): number {
  const machine = num(values, "printHours") * num(values, "machineRate");
  const post = num(values, "postProcessHours") * num(values, "laborRate");
  const support = num(values, "materialCost") * 0.15;
  const fail = pct(values, "failRatePercent", 10);
  const base = num(values, "materialCost") + machine + post + support;
  return base * (1 + fail / 100);
}

function resolveTargetMargin(values: PremiumSchemaOracleInputValues, slug: MarginCoreSlug): number {
  for (const key of ["targetMargin", "marginTarget", "riskMargin", "targetSavings"] as const) {
    const raw = num(values, key, 0);
    if (raw > 0) {
      return raw;
    }
  }
  return MARGIN_CORE_CONFIG[slug].targetMarginDefault * 100;
}

export function calculateRouteOptimizationAnalyzerOracle(
  values: PremiumSchemaOracleInputValues,
): PremiumMarginOracleOutput {
  assertPositive(num(values, "distanceKm"), "Distance");
  assertNonNegative(num(values, "fuelPricePerKm"), "Fuel price per km");
  assertNonNegative(num(values, "driverHourlyRate"), "Driver hourly rate");
  return applyMarginCoreFloor(
    "route-optimization-analyzer",
    calcRouteBase(values),
    resolveTargetMargin(values, "route-optimization-analyzer"),
  );
}

export function calculateEnergyEfficiencyReportOracle(
  values: PremiumSchemaOracleInputValues,
): PremiumMarginOracleOutput {
  assertPositive(num(values, "monthlyKwh"), "Monthly kWh");
  assertNonNegative(num(values, "tariffPerKwh"), "Tariff");
  return applyMarginCoreFloor(
    "energy-efficiency-report",
    calcEnergyBase(values),
    resolveTargetMargin(values, "energy-efficiency-report"),
  );
}

export function calculateMealPlanningVerdictOracle(
  values: PremiumSchemaOracleInputValues,
): PremiumMarginOracleOutput {
  assertPositive(num(values, "weeklyGroceryBudget"), "Weekly grocery budget");
  return applyMarginCoreFloor(
    "meal-planning-verdict",
    calcMealBase(values),
    resolveTargetMargin(values, "meal-planning-verdict"),
  );
}

export function calculateTripBudgetOptimizerOracle(
  values: PremiumSchemaOracleInputValues,
): PremiumMarginOracleOutput {
  assertPositive(num(values, "distanceKm"), "Distance");
  assertPositive(num(values, "consumptionPer100Km"), "Consumption");
  return applyMarginCoreFloor(
    "trip-budget-optimizer",
    calcTripBase(values),
    resolveTargetMargin(values, "trip-budget-optimizer"),
  );
}

export function calculateCbamComplianceVerdictOracle(
  values: PremiumSchemaOracleInputValues,
): PremiumMarginOracleOutput {
  assertPositive(num(values, "productionTons"), "Production tons");
  assertPositive(num(values, "euImportValue"), "EU import value");
  return applyMarginCoreFloor(
    "cbam-compliance-verdict",
    calcCbamBase(values),
    resolveTargetMargin(values, "cbam-compliance-verdict"),
  );
}

export function calculateCropYieldLossAnalyzerOracle(
  values: PremiumSchemaOracleInputValues,
): PremiumMarginOracleOutput {
  assertPositive(num(values, "areaHectares"), "Area hectares");
  return applyMarginCoreFloor(
    "crop-yield-loss-analyzer",
    calcCropBase(values),
    resolveTargetMargin(values, "crop-yield-loss-analyzer"),
  );
}

export function calculateFeedEfficiencyAnalyzerOracle(
  values: PremiumSchemaOracleInputValues,
): PremiumMarginOracleOutput {
  assertPositive(num(values, "animalCount"), "Animal count");
  assertPositive(num(values, "dailyFeedKg"), "Daily feed");
  assertPositive(num(values, "feedPricePerKg"), "Feed price");
  return applyMarginCoreFloor(
    "feed-efficiency-analyzer",
    calcFeedBase(values),
    resolveTargetMargin(values, "feed-efficiency-analyzer"),
  );
}

export function calculateDairyProfitDetectorOracle(
  values: PremiumSchemaOracleInputValues,
): PremiumMarginOracleOutput {
  assertNonNegative(num(values, "monthlyFeedCost"), "Monthly feed cost");
  assertNonNegative(num(values, "laborCost"), "Labor cost");
  assertNonNegative(num(values, "vetAndHealth"), "Vet and health");
  return applyMarginCoreFloor(
    "dairy-profit-detector",
    calcDairyBase(values),
    resolveTargetMargin(values, "dairy-profit-detector"),
  );
}

export function calculateWaterOptimizationVerdictOracle(
  values: PremiumSchemaOracleInputValues,
): PremiumMarginOracleOutput {
  assertPositive(num(values, "areaHectares"), "Area hectares");
  return applyMarginCoreFloor(
    "water-optimization-verdict",
    calcWaterBase(values),
    resolveTargetMargin(values, "water-optimization-verdict"),
  );
}

export function calculateRenovationBudgetOptimizerOracle(
  values: PremiumSchemaOracleInputValues,
): PremiumMarginOracleOutput {
  assertPositive(num(values, "areaM2"), "Area m²");
  return applyMarginCoreFloor(
    "renovation-budget-optimizer",
    calcRenovationBase(values),
    resolveTargetMargin(values, "renovation-budget-optimizer"),
  );
}

export function calculate3dPrintJobMarginToolOracle(
  values: PremiumSchemaOracleInputValues,
): PremiumMarginOracleOutput {
  assertNonNegative(num(values, "materialCost"), "Material cost");
  assertNonNegative(num(values, "printHours"), "Print hours");
  return applyMarginCoreFloor(
    "3d-print-job-margin-tool",
    calc3dPrintBase(values),
    resolveTargetMargin(values, "3d-print-job-margin-tool"),
  );
}

export const BATCH_PREMIUM_SCHEMA_ORACLE_SLUGS = [
  "route-optimization-analyzer",
  "energy-efficiency-report",
  "meal-planning-verdict",
  "trip-budget-optimizer",
  "cbam-compliance-verdict",
  "crop-yield-loss-analyzer",
  "feed-efficiency-analyzer",
  "dairy-profit-detector",
  "water-optimization-verdict",
  "renovation-budget-optimizer",
  "3d-print-job-margin-tool",
] as const;

export type BatchPremiumSchemaOracleSlug = (typeof BATCH_PREMIUM_SCHEMA_ORACLE_SLUGS)[number];

export const BATCH_PREMIUM_SCHEMA_ORACLE_TOOL_IDS: Record<BatchPremiumSchemaOracleSlug, string> = {
  "route-optimization-analyzer": "revenue-premium.route-optimization-analyzer",
  "energy-efficiency-report": "revenue-premium.energy-efficiency-report",
  "meal-planning-verdict": "revenue-premium.meal-planning-verdict",
  "trip-budget-optimizer": "revenue-premium.trip-budget-optimizer",
  "cbam-compliance-verdict": "revenue-premium.cbam-compliance-verdict",
  "crop-yield-loss-analyzer": "revenue-premium.crop-yield-loss-analyzer",
  "feed-efficiency-analyzer": "revenue-premium.feed-efficiency-analyzer",
  "dairy-profit-detector": "revenue-premium.dairy-profit-detector",
  "water-optimization-verdict": "revenue-premium.water-optimization-verdict",
  "renovation-budget-optimizer": "revenue-premium.renovation-budget-optimizer",
  "3d-print-job-margin-tool": "revenue-premium.3d-print-job-margin-tool",
};

export function isBatchPremiumSchemaOracleSlug(
  slug: string,
): slug is BatchPremiumSchemaOracleSlug {
  return (BATCH_PREMIUM_SCHEMA_ORACLE_SLUGS as readonly string[]).includes(slug);
}

export function getBatchPremiumSchemaOracleToolId(slug: BatchPremiumSchemaOracleSlug): string {
  return BATCH_PREMIUM_SCHEMA_ORACLE_TOOL_IDS[slug];
}

const ORACLE_BY_SLUG: Record<
  BatchPremiumSchemaOracleSlug,
  (values: PremiumSchemaOracleInputValues) => PremiumMarginOracleOutput
> = {
  "route-optimization-analyzer": calculateRouteOptimizationAnalyzerOracle,
  "energy-efficiency-report": calculateEnergyEfficiencyReportOracle,
  "meal-planning-verdict": calculateMealPlanningVerdictOracle,
  "trip-budget-optimizer": calculateTripBudgetOptimizerOracle,
  "cbam-compliance-verdict": calculateCbamComplianceVerdictOracle,
  "crop-yield-loss-analyzer": calculateCropYieldLossAnalyzerOracle,
  "feed-efficiency-analyzer": calculateFeedEfficiencyAnalyzerOracle,
  "dairy-profit-detector": calculateDairyProfitDetectorOracle,
  "water-optimization-verdict": calculateWaterOptimizationVerdictOracle,
  "renovation-budget-optimizer": calculateRenovationBudgetOptimizerOracle,
  "3d-print-job-margin-tool": calculate3dPrintJobMarginToolOracle,
};

export function calculateBatchPremiumSchemaOracle(
  slug: BatchPremiumSchemaOracleSlug,
  values: PremiumSchemaOracleInputValues,
): PremiumMarginOracleOutput {
  return ORACLE_BY_SLUG[slug](values);
}
