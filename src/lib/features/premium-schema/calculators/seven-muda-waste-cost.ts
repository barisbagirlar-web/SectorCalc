import type { SchemaInputValues } from "@/lib/features/premium-schema/premium-calculator-schema";
import {
  buildDecisionVerdict,
  buildDoubleCountWarnings,
  buildRecommendedActionOrder,
  buildRecoveryScenarios,
  buildSevenMudaWasteBreakdown,
  resolveConfidenceLevel,
  resolveHighestWasteCategoryIndex,
  resolveHighestWasteCategoryKeyFromIndex,
  resolveHighestWasteFromBreakdown,
  type SevenMudaCategoryCosts,
  type SevenMudaConfidenceLevel,
  type SevenMudaDecisionVerdict,
  type SevenMudaInventoryCostParts,
  type SevenMudaLegacyCategoryCostKey,
  type SevenMudaRecoveryScenario,
  type SevenMudaWaitingCostParts,
  type SevenMudaWasteBreakdownItem,
  type SevenMudaWasteCategoryKey,
  type SevenMudaTransportCostParts,
} from "@/lib/features/premium-schema/calculators/seven-muda-waste-decision";
import {
  hasSevenMudaWasteDriverInput,
  resolveSevenMudaEngineeringInputs,
  validateSevenMudaEngineeringInputs,
  type SevenMudaEngineeringInputs,
  type SevenMudaValidationResult,
} from "@/lib/features/premium-schema/calculators/seven-muda-waste-validation";

export type SevenMudaEngineeringResult = {
  readonly overproductionCost: number;
  readonly waitingCost: number;
  readonly transportCost: number;
  readonly inventoryCost: number;
  readonly motionCost: number;
  readonly overprocessingCost: number;
  readonly defectCost: number;
  readonly totalWasteCost: number;
  readonly annualizedWasteCost: number;
  readonly wasteCostPerUnit: number;
  readonly periodRevenue: number;
  readonly periodGrossMarginValue: number;
  readonly wasteToRevenueRatioPct: number;
  readonly wasteToGrossMarginRatioPct: number;
  readonly highestWasteCategory: SevenMudaWasteCategoryKey | "none";
  readonly highestWasteCost: number;
  readonly wasteBreakdown: readonly SevenMudaWasteBreakdownItem[];
  readonly recommendedActionOrder: readonly SevenMudaWasteCategoryKey[];
  readonly riskAdjustedPriorityScore: number;
  readonly confidenceLevel: SevenMudaConfidenceLevel;
  readonly doubleCountWarnings: readonly string[];
  readonly recoveryScenarios: readonly SevenMudaRecoveryScenario[];
  readonly decisionVerdict: SevenMudaDecisionVerdict;
  readonly validation: SevenMudaValidationResult;
};

export type SevenMudaLegacyInputs = {
  excessUnits?: number;
  unitProductionCost?: number;
  inventoryHoldingRatePct?: number;
  waitingMinutes?: number;
  resourceMinuteCost?: number;
  transportDistanceKm?: number;
  transportTrips?: number;
  transportCostPerKm?: number;
  averageExcessInventoryValue?: number;
  unnecessaryMotionMinutes?: number;
  laborMinuteCost?: number;
  overprocessingMinutes?: number;
  extraMaterialCost?: number;
  scrapUnits?: number;
  reworkMinutes?: number;
};

export type SevenMudaLegacyResult = {
  overproductionCost: number;
  waitingCost: number;
  transportCost: number;
  inventoryCost: number;
  motionCost: number;
  overprocessingCost: number;
  defectCost: number;
  totalWasteCost: number;
  highestWasteCategory: SevenMudaLegacyCategoryCostKey;
  wasteBreakdown: Record<SevenMudaLegacyCategoryCostKey, number>;
};

export {
  resolveHighestWasteCategoryIndex,
  resolveHighestWasteCategoryKeyFromIndex,
};

export const SEVEN_MUDA_WASTE_CATEGORY_KEYS: readonly SevenMudaLegacyCategoryCostKey[] = [
  "overproductionCost",
  "waitingCost",
  "transportCost",
  "inventoryCost",
  "motionCost",
  "overprocessingCost",
  "defectCost",
];

const ENGINEERING_SCHEMA_FIELD_IDS: readonly (keyof SevenMudaEngineeringInputs)[] = [
  "analysisPeriodDays",
  "annualWorkingDays",
  "productionUnits",
  "currency",
  "unitVariableCost",
  "unitSellingPrice",
  "grossMarginPercent",
  "overproductionUnits",
  "waitingHours",
  "waitingOpportunityCostMode",
  "manualHourlyOpportunityCost",
  "unnecessaryTransportCost",
  "excessInventoryValue",
  "inventoryCarryingRatePercent",
  "unnecessaryMotionHours",
  "motionHourlyCost",
  "defectUnits",
  "reworkCostPerDefect",
  "overprocessingHours",
  "overprocessingHourlyCost",
  "dataConfidencePercent",
  "implementationDifficulty",
];

let boundSchemaInputs: SchemaInputValues | null = null;
let cachedEngineeringResult: SevenMudaEngineeringResult | null = null;

function resetSevenMudaEngineeringPrimingState(): void {
  boundSchemaInputs = null;
  cachedEngineeringResult = null;
}

export function bindSevenMudaEngineeringSchemaInputs(values: SchemaInputValues | null): void {
  if (values === null) {
    resetSevenMudaEngineeringPrimingState();
    return;
  }
  boundSchemaInputs = values;
  cachedEngineeringResult = null;
}

export function clearSevenMudaEngineeringCache(): void {
  resetSevenMudaEngineeringPrimingState();
}

export function schemaInputValuesToEngineeringRaw(
  values: SchemaInputValues,
): Partial<Record<keyof SevenMudaEngineeringInputs, unknown>> {
  const raw: Partial<Record<keyof SevenMudaEngineeringInputs, unknown>> = {};
  for (const field of ENGINEERING_SCHEMA_FIELD_IDS) {
    if (Object.prototype.hasOwnProperty.call(values, field)) {
      raw[field] = values[field];
    }
  }
  return raw;
}

export function getPrimedSevenMudaEngineeringResult(): SevenMudaEngineeringResult {
  const activeBoundInputs = boundSchemaInputs;
  if (!activeBoundInputs) {
    throw new Error(
      "Seven muda engineering inputs are not bound for the current schema run. bindSevenMudaEngineeringSchemaInputs() must run before lean.muda formulas execute.",
    );
  }

  if (!cachedEngineeringResult) {
    cachedEngineeringResult = calculateSevenMudaEngineeringWasteCost(
      schemaInputValuesToEngineeringRaw(activeBoundInputs),
    );
  }

  return cachedEngineeringResult;
}

function computeContributionMarginPerUnit(input: SevenMudaEngineeringInputs): number {
  return input.unitSellingPrice * (input.grossMarginPercent / 100);
}

function computeCategoryCosts(input: SevenMudaEngineeringInputs): {
  readonly costs: SevenMudaCategoryCosts;
  readonly waitingParts: SevenMudaWaitingCostParts;
  readonly transportParts: SevenMudaTransportCostParts;
  readonly inventoryParts: SevenMudaInventoryCostParts;
} {
  const contributionMarginPerUnit = computeContributionMarginPerUnit(input);

  const overproductionCost = input.overproductionUnits * input.unitVariableCost;

  let waitingOpportunityCost = 0;
  if (input.waitingOpportunityCostMode === "manual") {
    waitingOpportunityCost = input.waitingHours * input.manualHourlyOpportunityCost;
  } else {
    waitingOpportunityCost = input.waitingHours * Math.max(contributionMarginPerUnit, 0);
  }
  const waitingCost = waitingOpportunityCost;

  const transportCost = input.unnecessaryTransportCost;

  const inventoryHoldingCost =
    input.excessInventoryValue *
    (input.inventoryCarryingRatePercent / 100) *
    (input.analysisPeriodDays / input.annualWorkingDays);
  const inventoryCost = inventoryHoldingCost;

  const motionCost = input.unnecessaryMotionHours * input.motionHourlyCost;

  const overprocessingCost = input.overprocessingHours * input.overprocessingHourlyCost;

  const defectCost = input.defectUnits * (input.unitVariableCost + input.reworkCostPerDefect);

  return {
    costs: {
      overproductionCost,
      waitingCost,
      transportCost,
      inventoryCost,
      motionCost,
      overprocessingCost,
      defectCost,
    },
    waitingParts: {
      waitingLaborCost: 0,
      waitingMachineCost: 0,
      waitingOpportunityCost,
    },
    transportParts: {
      transportVehicleCost: transportCost,
      transportHandlingCost: 0,
      transportDamageCost: 0,
    },
    inventoryParts: {
      inventoryHoldingCost,
      inventoryShrinkageCost: 0,
    },
  };
}

export function computeSevenMudaEngineeringCosts(input: SevenMudaEngineeringInputs): SevenMudaCategoryCosts {
  return computeCategoryCosts(input).costs;
}

export function calculateSevenMudaEngineeringWasteCost(
  rawInput: Partial<Record<keyof SevenMudaEngineeringInputs, unknown>>,
): SevenMudaEngineeringResult {
  const validation = validateSevenMudaEngineeringInputs(rawInput);
  if (!validation.ok) {
    throw new Error(validation.errors.join("; "));
  }

  const input = resolveSevenMudaEngineeringInputs(rawInput);
  const { costs, waitingParts, transportParts, inventoryParts } = computeCategoryCosts(input);

  const totalWasteCost =
    costs.overproductionCost +
    costs.waitingCost +
    costs.transportCost +
    costs.inventoryCost +
    costs.motionCost +
    costs.overprocessingCost +
    costs.defectCost;

  const annualizedWasteCost =
    totalWasteCost * (input.annualWorkingDays / input.analysisPeriodDays);
  const wasteCostPerUnit =
    input.productionUnits > 0 ? totalWasteCost / input.productionUnits : 0;
  const periodRevenue = input.productionUnits * input.unitSellingPrice;
  const periodGrossMarginValue =
    input.productionUnits * input.unitSellingPrice * (input.grossMarginPercent / 100);
  const wasteToRevenueRatioPct = periodRevenue > 0 ? (totalWasteCost / periodRevenue) * 100 : 0;
  const wasteToGrossMarginRatioPct =
    periodGrossMarginValue > 0 ? (totalWasteCost / periodGrossMarginValue) * 100 : 0;

  const safeDifficulty = input.implementationDifficulty;
  const safeConfidence = input.dataConfidencePercent / 100;
  const riskAdjustedPriorityScore = (totalWasteCost * safeConfidence) / safeDifficulty;
  const confidenceLevel = resolveConfidenceLevel(input.dataConfidencePercent);

  const wasteBreakdown = buildSevenMudaWasteBreakdown({
    input,
    costs,
    totalWasteCost,
  });
  const recommendedActionOrder = buildRecommendedActionOrder(wasteBreakdown);
  const { highestWasteCategory, highestWasteCost } = resolveHighestWasteFromBreakdown(wasteBreakdown);
  const recoveryScenarios = buildRecoveryScenarios({ totalWasteCost, annualizedWasteCost });
  const doubleCountWarnings = buildDoubleCountWarnings({
    validationWarnings: validation.warnings,
    waitingParts,
    transportParts,
    inventoryParts,
    engineeringInput: input,
    defectCost: costs.defectCost,
  });
  const decisionVerdict = buildDecisionVerdict({
    totalWasteCost,
    hasWasteDriverInput: hasSevenMudaWasteDriverInput(input),
    wasteToGrossMarginRatioPct,
    recommendedActionOrder,
    highestWasteCategory,
    confidenceLevel,
    doubleCountWarnings,
  });

  return {
    ...costs,
    totalWasteCost,
    annualizedWasteCost,
    wasteCostPerUnit,
    periodRevenue,
    periodGrossMarginValue,
    wasteToRevenueRatioPct,
    wasteToGrossMarginRatioPct,
    highestWasteCategory,
    highestWasteCost,
    wasteBreakdown,
    recommendedActionOrder,
    riskAdjustedPriorityScore,
    confidenceLevel,
    doubleCountWarnings,
    recoveryScenarios,
    decisionVerdict,
    validation,
  };
}

export function calculateSevenMudaWasteCost(_raw: Partial<SevenMudaLegacyInputs>): SevenMudaLegacyResult {
  throw new Error(
    "calculateSevenMudaWasteCost was removed with the P54 15-field engine. Use calculateSevenMudaEngineeringWasteCost with full REV5 inputs.",
  );
}
