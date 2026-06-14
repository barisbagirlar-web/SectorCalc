import type { SevenMudaEngineeringInputs } from "@/lib/premium-schema/calculators/seven-muda-waste-validation";

export type SevenMudaWasteCategoryKey =
  | "overproduction"
  | "waiting"
  | "transport"
  | "inventory"
  | "motion"
  | "overprocessing"
  | "defects";

export type SevenMudaWasteBreakdownItem = {
  readonly key: SevenMudaWasteCategoryKey;
  readonly label: string;
  readonly cost: number;
  readonly sharePct: number;
  readonly actionPriorityScore: number;
};

export type SevenMudaRecoveryScenario = {
  readonly reductionPct: number;
  readonly periodSavings: number;
  readonly annualSavings: number;
};

export type SevenMudaDecisionVerdictSummaryLevel =
  | "no_detected_waste"
  | "low"
  | "medium"
  | "high"
  | "critical";

export type SevenMudaConfidenceLevel = "high" | "medium" | "low";

export type SevenMudaDecisionVerdict = {
  readonly summaryLevel: SevenMudaDecisionVerdictSummaryLevel;
  readonly firstActionCategory: SevenMudaWasteCategoryKey | "none";
  readonly biggestCostCategory: SevenMudaWasteCategoryKey | "none";
  readonly dataConfidence: SevenMudaConfidenceLevel;
  readonly hasDoubleCountRisk: boolean;
};

export type SevenMudaCategoryCosts = {
  readonly overproductionCost: number;
  readonly waitingCost: number;
  readonly transportCost: number;
  readonly inventoryCost: number;
  readonly motionCost: number;
  readonly overprocessingCost: number;
  readonly defectCost: number;
};

export type SevenMudaWaitingCostParts = {
  readonly waitingLaborCost: number;
  readonly waitingMachineCost: number;
  readonly waitingOpportunityCost: number;
};

export type SevenMudaTransportCostParts = {
  readonly transportVehicleCost: number;
  readonly transportHandlingCost: number;
  readonly transportDamageCost: number;
};

export type SevenMudaInventoryCostParts = {
  readonly inventoryHoldingCost: number;
  readonly inventoryShrinkageCost: number;
};

const CATEGORY_LABELS: Record<SevenMudaWasteCategoryKey, string> = {
  overproduction: "Overproduction",
  waiting: "Waiting",
  transport: "Transport",
  inventory: "Inventory",
  motion: "Motion",
  overprocessing: "Overprocessing",
  defects: "Defects",
};

const NO_DATA_LABEL = "Veri girilmedi";

export function resolveConfidenceLevel(dataConfidencePct: number): SevenMudaConfidenceLevel {
  if (dataConfidencePct >= 80) {
    return "high";
  }
  if (dataConfidencePct >= 50) {
    return "medium";
  }
  return "low";
}

export function buildSevenMudaWasteBreakdown(input: {
  readonly input: SevenMudaEngineeringInputs;
  readonly costs: SevenMudaCategoryCosts;
  readonly totalWasteCost: number;
}): readonly SevenMudaWasteBreakdownItem[] {
  const safeDifficulty = input.input.implementationDifficulty;
  const safeConfidence = input.input.dataConfidencePercent / 100;
  const total = input.totalWasteCost;

  const entries: readonly { key: SevenMudaWasteCategoryKey; cost: number }[] = [
    { key: "overproduction", cost: input.costs.overproductionCost },
    { key: "waiting", cost: input.costs.waitingCost },
    { key: "transport", cost: input.costs.transportCost },
    { key: "inventory", cost: input.costs.inventoryCost },
    { key: "motion", cost: input.costs.motionCost },
    { key: "overprocessing", cost: input.costs.overprocessingCost },
    { key: "defects", cost: input.costs.defectCost },
  ];

  return entries.map((entry) => ({
    key: entry.key,
    label: CATEGORY_LABELS[entry.key],
    cost: entry.cost,
    sharePct: total > 0 ? (entry.cost / total) * 100 : 0,
    actionPriorityScore: (entry.cost * safeConfidence) / safeDifficulty,
  }));
}

export function buildRecommendedActionOrder(
  breakdown: readonly SevenMudaWasteBreakdownItem[],
): readonly SevenMudaWasteCategoryKey[] {
  return [...breakdown]
    .sort((left, right) => right.actionPriorityScore - left.actionPriorityScore)
    .map((item) => item.key);
}

export function resolveHighestWasteFromBreakdown(
  breakdown: readonly SevenMudaWasteBreakdownItem[],
): { readonly highestWasteCategory: SevenMudaWasteCategoryKey | "none"; readonly highestWasteCost: number } {
  const sorted = [...breakdown].sort((left, right) => right.cost - left.cost);
  const highest = sorted[0];
  if (!highest || highest.cost <= 0) {
    return { highestWasteCategory: "none", highestWasteCost: 0 };
  }
  return { highestWasteCategory: highest.key, highestWasteCost: highest.cost };
}

export function buildRecoveryScenarios(input: {
  readonly totalWasteCost: number;
  readonly annualizedWasteCost: number;
}): readonly SevenMudaRecoveryScenario[] {
  return [
    {
      reductionPct: 10,
      periodSavings: input.totalWasteCost * 0.1,
      annualSavings: input.annualizedWasteCost * 0.1,
    },
    {
      reductionPct: 25,
      periodSavings: input.totalWasteCost * 0.25,
      annualSavings: input.annualizedWasteCost * 0.25,
    },
    {
      reductionPct: 50,
      periodSavings: input.totalWasteCost * 0.5,
      annualSavings: input.annualizedWasteCost * 0.5,
    },
  ];
}

export function buildDoubleCountWarnings(input: {
  readonly validationWarnings: readonly string[];
  readonly waitingParts: SevenMudaWaitingCostParts;
  readonly transportParts: SevenMudaTransportCostParts;
  readonly inventoryParts: SevenMudaInventoryCostParts;
  readonly engineeringInput: SevenMudaEngineeringInputs;
  readonly defectCost: number;
}): readonly string[] {
  return [...input.validationWarnings];
}

export function buildDecisionVerdict(input: {
  readonly totalWasteCost: number;
  readonly hasWasteDriverInput: boolean;
  readonly wasteToGrossMarginRatioPct: number;
  readonly recommendedActionOrder: readonly SevenMudaWasteCategoryKey[];
  readonly highestWasteCategory: SevenMudaWasteCategoryKey | "none";
  readonly confidenceLevel: SevenMudaConfidenceLevel;
  readonly doubleCountWarnings: readonly string[];
}): SevenMudaDecisionVerdict {
  const noDetectedWaste = input.totalWasteCost <= 0 || !input.hasWasteDriverInput;

  const summaryLevel: SevenMudaDecisionVerdictSummaryLevel = noDetectedWaste
    ? "no_detected_waste"
    : input.wasteToGrossMarginRatioPct >= 50
      ? "critical"
      : input.wasteToGrossMarginRatioPct >= 20
        ? "high"
        : input.wasteToGrossMarginRatioPct >= 10
          ? "medium"
          : "low";

  const firstActionCategory = noDetectedWaste
    ? "none"
    : (input.recommendedActionOrder[0] ?? "none");

  const biggestCostCategory = noDetectedWaste ? "none" : input.highestWasteCategory;

  return {
    summaryLevel,
    firstActionCategory,
    biggestCostCategory,
    dataConfidence: input.confidenceLevel,
    hasDoubleCountRisk: input.doubleCountWarnings.length > 0,
  };
}

export function resolveHighestWasteCategoryIndex(
  costs: SevenMudaCategoryCosts,
): number {
  const ordered: readonly { index: number; cost: number }[] = [
    { index: 1, cost: costs.overproductionCost },
    { index: 2, cost: costs.waitingCost },
    { index: 3, cost: costs.transportCost },
    { index: 4, cost: costs.inventoryCost },
    { index: 5, cost: costs.motionCost },
    { index: 6, cost: costs.overprocessingCost },
    { index: 7, cost: costs.defectCost },
  ];

  let highestIndex = 0;
  let highestValue = 0;
  for (const entry of ordered) {
    if (entry.cost > highestValue) {
      highestValue = entry.cost;
      highestIndex = entry.index;
    }
  }
  return highestIndex;
}

export type SevenMudaLegacyCategoryCostKey =
  | "overproductionCost"
  | "waitingCost"
  | "transportCost"
  | "inventoryCost"
  | "motionCost"
  | "overprocessingCost"
  | "defectCost";

const LEGACY_CATEGORY_INDEX_TO_KEY: Record<number, SevenMudaLegacyCategoryCostKey> = {
  1: "overproductionCost",
  2: "waitingCost",
  3: "transportCost",
  4: "inventoryCost",
  5: "motionCost",
  6: "overprocessingCost",
  7: "defectCost",
};

export function resolveHighestWasteCategoryKeyFromIndex(index: number): SevenMudaLegacyCategoryCostKey {
  if (index <= 0) {
    return "overproductionCost";
  }
  return LEGACY_CATEGORY_INDEX_TO_KEY[index] ?? "overproductionCost";
}

export function resolveSevenMudaCategoryDisplayLabel(
  key: SevenMudaWasteCategoryKey | "none",
  totalWasteCost: number,
): string {
  if (totalWasteCost <= 0 || key === "none") {
    return NO_DATA_LABEL;
  }
  return CATEGORY_LABELS[key];
}
