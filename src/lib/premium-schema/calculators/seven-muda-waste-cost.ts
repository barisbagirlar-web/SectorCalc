import type { SchemaInputValues } from "@/lib/premium-schema/premium-calculator-schema";
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
} from "@/lib/premium-schema/calculators/seven-muda-waste-decision";
import {
  resolveSevenMudaEngineeringInputs,
  validateSevenMudaEngineeringInputs,
  type SevenMudaEngineeringInputs,
  type SevenMudaValidationResult,
} from "@/lib/premium-schema/calculators/seven-muda-waste-validation";

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
  "workingDaysPerYear",
  "productionUnitsInPeriod",
  "currencyCode",
  "unitVariableCost",
  "unitSellingPrice",
  "grossMarginPct",
  "excessUnits",
  "excessInventoryHoldingDays",
  "excessWriteDownCostPerUnit",
  "waitingMinutes",
  "affectedOperators",
  "hourlyLaborCost",
  "affectedMachines",
  "hourlyMachineCost",
  "waitingOpportunityMode",
  "hourlyOpportunityCost",
  "plannedUnitsPerHour",
  "transportDistanceKm",
  "transportTrips",
  "transportCostPerKm",
  "handlingMinutesPerTrip",
  "handlingHourlyLaborCost",
  "transportDamageRatePct",
  "averageLoadValue",
  "averageExcessInventoryValue",
  "inventoryHoldingRatePct",
  "inventoryObsolescenceValue",
  "inventoryShrinkageRatePct",
  "unnecessaryMotionMinutes",
  "motionAffectedOperators",
  "motionHourlyLaborCost",
  "overprocessingMinutes",
  "overprocessingHourlyResourceCost",
  "extraMaterialCost",
  "extraEnergyCost",
  "extraInspectionCost",
  "scrapUnits",
  "scrapDisposalCostPerUnit",
  "reworkMinutes",
  "reworkHourlyLaborCost",
  "reworkHourlyMachineCost",
  "customerReturnCost",
  "warrantyCost",
  "expediteCost",
  "dataConfidencePct",
  "implementationDifficultyScore",
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

function computeMinuteRates(input: SevenMudaEngineeringInputs): {
  readonly laborMinuteCost: number;
  readonly machineMinuteCost: number;
  readonly handlingMinuteCost: number;
  readonly motionMinuteCost: number;
  readonly overprocessingMinuteCost: number;
  readonly reworkMinuteLaborCost: number;
  readonly reworkMinuteMachineCost: number;
  readonly unitGrossMargin: number;
} {
  return {
    laborMinuteCost: input.hourlyLaborCost / 60,
    machineMinuteCost: input.hourlyMachineCost / 60,
    handlingMinuteCost: input.handlingHourlyLaborCost / 60,
    motionMinuteCost: input.motionHourlyLaborCost / 60,
    overprocessingMinuteCost: input.overprocessingHourlyResourceCost / 60,
    reworkMinuteLaborCost: input.reworkHourlyLaborCost / 60,
    reworkMinuteMachineCost: input.reworkHourlyMachineCost / 60,
    unitGrossMargin: input.unitSellingPrice * (input.grossMarginPct / 100),
  };
}

function computeCategoryCosts(input: SevenMudaEngineeringInputs): {
  readonly costs: SevenMudaCategoryCosts;
  readonly waitingParts: SevenMudaWaitingCostParts;
  readonly transportParts: SevenMudaTransportCostParts;
  readonly inventoryParts: SevenMudaInventoryCostParts;
} {
  const rates = computeMinuteRates(input);

  const overproductionBaseCost = input.excessUnits * input.unitVariableCost;
  const overproductionHoldingCost =
    overproductionBaseCost *
    (input.inventoryHoldingRatePct / 100) *
    (input.excessInventoryHoldingDays / 365);
  const overproductionWriteDownCost = input.excessUnits * input.excessWriteDownCostPerUnit;
  const overproductionCost =
    overproductionBaseCost + overproductionHoldingCost + overproductionWriteDownCost;

  const waitingLaborCost = input.waitingMinutes * input.affectedOperators * rates.laborMinuteCost;
  const waitingMachineCost = input.waitingMinutes * input.affectedMachines * rates.machineMinuteCost;

  let waitingOpportunityCost = 0;
  if (input.waitingOpportunityMode === "manualHourly") {
    waitingOpportunityCost = input.waitingMinutes * (input.hourlyOpportunityCost / 60);
  } else if (
    input.waitingOpportunityMode === "derivedThroughput" &&
    input.plannedUnitsPerHour > 0
  ) {
    waitingOpportunityCost =
      (input.waitingMinutes / 60) * input.plannedUnitsPerHour * rates.unitGrossMargin;
  }

  const waitingCost = waitingLaborCost + waitingMachineCost + waitingOpportunityCost;

  const transportVehicleCost =
    input.transportDistanceKm * input.transportTrips * input.transportCostPerKm;
  const transportHandlingCost =
    input.transportTrips * input.handlingMinutesPerTrip * rates.handlingMinuteCost;
  const transportDamageCost =
    input.averageLoadValue * (input.transportDamageRatePct / 100) * input.transportTrips;
  const transportCost = transportVehicleCost + transportHandlingCost + transportDamageCost;

  const inventoryHoldingCost =
    input.averageExcessInventoryValue *
    (input.inventoryHoldingRatePct / 100) *
    (input.analysisPeriodDays / 365);
  const inventoryShrinkageCost =
    input.averageExcessInventoryValue * (input.inventoryShrinkageRatePct / 100);
  const inventoryCost =
    inventoryHoldingCost + input.inventoryObsolescenceValue + inventoryShrinkageCost;

  const motionCost =
    input.unnecessaryMotionMinutes * input.motionAffectedOperators * rates.motionMinuteCost;

  const overprocessingTimeCost = input.overprocessingMinutes * rates.overprocessingMinuteCost;
  const overprocessingCost =
    overprocessingTimeCost +
    input.extraMaterialCost +
    input.extraEnergyCost +
    input.extraInspectionCost;

  const scrapMaterialCost = input.scrapUnits * input.unitVariableCost;
  const scrapDisposalCost = input.scrapUnits * input.scrapDisposalCostPerUnit;
  const reworkLaborCost = input.reworkMinutes * rates.reworkMinuteLaborCost;
  const reworkMachineCost = input.reworkMinutes * rates.reworkMinuteMachineCost;
  const defectCost =
    scrapMaterialCost +
    scrapDisposalCost +
    reworkLaborCost +
    reworkMachineCost +
    input.customerReturnCost +
    input.warrantyCost +
    input.expediteCost;

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
      waitingLaborCost,
      waitingMachineCost,
      waitingOpportunityCost,
    },
    transportParts: {
      transportVehicleCost,
      transportHandlingCost,
      transportDamageCost,
    },
    inventoryParts: {
      inventoryHoldingCost,
      inventoryShrinkageCost,
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
    totalWasteCost * (input.workingDaysPerYear / input.analysisPeriodDays);
  const wasteCostPerUnit =
    input.productionUnitsInPeriod > 0 ? totalWasteCost / input.productionUnitsInPeriod : 0;
  const periodRevenue = input.productionUnitsInPeriod * input.unitSellingPrice;
  const periodGrossMarginValue =
    input.productionUnitsInPeriod * input.unitSellingPrice * (input.grossMarginPct / 100);
  const wasteToRevenueRatioPct = periodRevenue > 0 ? (totalWasteCost / periodRevenue) * 100 : 0;
  const wasteToGrossMarginRatioPct =
    periodGrossMarginValue > 0 ? (totalWasteCost / periodGrossMarginValue) * 100 : 0;

  const safeDifficulty = input.implementationDifficultyScore;
  const safeConfidence = input.dataConfidencePct / 100;
  const riskAdjustedPriorityScore = (totalWasteCost * safeConfidence) / safeDifficulty;
  const confidenceLevel = resolveConfidenceLevel(input.dataConfidencePct);

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
