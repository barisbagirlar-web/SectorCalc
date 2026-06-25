/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck — Imports SevenMudaEngineeringResult from stub

import { normalizeLocale } from "@/lib/format/localization";
import type { SevenMudaEngineeringResult } from "@/lib/premium-schema/calculators/seven-muda-waste-cost";
import type { SevenMudaWasteCategoryKey } from "@/lib/premium-schema/calculators/seven-muda-waste-decision";

export type SevenMudaRev5Labels = {
  readonly quickSummaryTitle: string;
  readonly executiveSummary: string;
  readonly totalWasteCost: string;
  readonly annualizedWasteCost: string;
  readonly wasteCostPerUnit: string;
  readonly periodRevenue: string;
  readonly periodGrossMarginValue: string;
  readonly wasteToRevenueRatio: string;
  readonly wasteToGrossMarginRatio: string;
  readonly highestWasteCategory: string;
  readonly firstActionCategory: string;
  readonly confidenceLevel: string;
  readonly riskAdjustedPriorityScore: string;
  readonly doubleCountRisk: string;
  readonly doubleCountDetected: string;
  readonly doubleCountNone: string;
  readonly decisionVerdict: string;
  readonly summaryLevel: string;
  readonly biggestCostCategory: string;
  readonly dataConfidence: string;
  readonly wasteBreakdown: string;
  readonly category: string;
  readonly cost: string;
  readonly share: string;
  readonly actionPriority: string;
  readonly recommendedActionOrder: string;
  readonly recoveryScenarios: string;
  readonly reduction: string;
  readonly periodSavings: string;
  readonly annualSavings: string;
  readonly warnings: string;
  readonly noWarnings: string;
  readonly categoryName: (key: SevenMudaWasteCategoryKey | "none") => string;
  readonly summaryLevelText: (
    level: SevenMudaEngineeringResult["decisionVerdict"]["summaryLevel"],
  ) => string;
  readonly confidenceText: (level: SevenMudaEngineeringResult["confidenceLevel"]) => string;
  readonly resolveWarningMessage: (rawWarning: string) => string;
};

type SevenMudaRev5LabelCore = Omit<SevenMudaRev5Labels, "resolveWarningMessage">;

const EN_LABELS: SevenMudaRev5LabelCore = {
  quickSummaryTitle: "Decision summary",
  executiveSummary: "Executive summary",
  totalWasteCost: "Total waste cost",
  annualizedWasteCost: "Annualized waste cost",
  wasteCostPerUnit: "Waste cost per unit",
  periodRevenue: "Period revenue",
  periodGrossMarginValue: "Period gross margin value",
  wasteToRevenueRatio: "Waste to revenue ratio",
  wasteToGrossMarginRatio: "Waste to gross margin ratio",
  highestWasteCategory: "Biggest waste category",
  firstActionCategory: "First action category",
  confidenceLevel: "Data confidence level",
  riskAdjustedPriorityScore: "Risk-adjusted priority score",
  doubleCountRisk: "Double-count risk",
  doubleCountDetected: "Detected",
  doubleCountNone: "None detected",
  decisionVerdict: "Decision verdict",
  summaryLevel: "Summary level",
  biggestCostCategory: "Biggest cost category",
  dataConfidence: "Data confidence",
  wasteBreakdown: "Waste breakdown",
  category: "Category",
  cost: "Cost",
  share: "Share",
  actionPriority: "Action priority",
  recommendedActionOrder: "Recommended action order",
  recoveryScenarios: "Recovery scenarios",
  reduction: "Reduction",
  periodSavings: "Period savings",
  annualSavings: "Annual savings",
  warnings: "Warnings",
  noWarnings: "No warnings",
  categoryName: (key) => EN_CATEGORY_NAMES[key],
  summaryLevelText: (level) => EN_SUMMARY_LEVELS[level],
  confidenceText: (level) => EN_CONFIDENCE[level],
};

const EN_CATEGORY_NAMES: Record<SevenMudaWasteCategoryKey | "none", string> = {
  none: "None",
  overproduction: "Overproduction",
  waiting: "Waiting",
  transport: "Transport",
  inventory: "Inventory",
  motion: "Motion",
  overprocessing: "Overprocessing",
  defects: "Defects",
};

const EN_SUMMARY_LEVELS: Record<
  SevenMudaEngineeringResult["decisionVerdict"]["summaryLevel"],
  string
> = {
  no_detected_waste: "No detected waste",
  low: "Low exposure",
  medium: "Medium exposure",
  high: "High exposure",
  critical: "Critical exposure",
};

const EN_CONFIDENCE: Record<SevenMudaEngineeringResult["confidenceLevel"], string> = {
  high: "High",
  medium: "Medium",
  low: "Low",
};

const SEVEN_MUDA_WARNING_MESSAGES: ReadonlyArray<{
  readonly en: string;
}> = [
  {
    en: "Waiting cost includes both direct labor/machine cost and opportunity cost. Confirm this is intentional.",
  },
  {
    en: "Inventory cost includes both obsolescence and shrinkage. Confirm these are separate losses.",
  },
  {
    en: "Overproduction write-down and inventory obsolescence are both entered. Confirm the same stock loss is not counted twice.",
  },
  {
    en: "Transport damage and defect/rework costs are both present. Confirm transport-related defects are not duplicated.",
  },
  {
    en: "plannedUnitsPerHour must be greater than zero when waitingOpportunityMode is derivedThroughput; waiting opportunity cost will be treated as zero.",
  },
];

function createResolveWarningMessage(): (rawWarning: string) => string {
  return (rawWarning) => rawWarning;
}

function withWarningResolver(labels: SevenMudaRev5LabelCore): SevenMudaRev5Labels {
  return {
    ...labels,
    resolveWarningMessage: createResolveWarningMessage(),
  };
}

export function resolveSevenMudaRev5WarningMessage(_locale: string, rawWarning: string): string {
  return rawWarning;
}

export function resolveSevenMudaRev5Labels(_locale?: string): SevenMudaRev5Labels {
  return withWarningResolver(EN_LABELS);
}
