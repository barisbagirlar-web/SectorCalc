import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";

/** P7 nightrun — DeepSeek Chief Engineer schema (factory generated). */
export const DrywallCalculator_SCHEMA: PremiumCalculatorSchema = {
  id: "drywall-calculator",
  name: "Drywall Calculator",
  sectorSlug: "general-industrial",
  category: "cost",
  painStatement: "Standard construction cost estimating practice (RSMeans, ASTM E1804)",

  inputs: [
    {
      id: "wallLength",
      label: "Wall length",
      type: "number",
      unit: "ft",
      required: true,
      smartDefault: 10,
      validation: { min: 0.1, max: 1000 },
      helper: "Must be positive",
      expertMeaning: "Wall length",
    },
    {
      id: "wallHeight",
      label: "Wall height",
      type: "number",
      unit: "ft",
      required: true,
      smartDefault: 8,
      validation: { min: 0.1, max: 100 },
      helper: "Must be positive",
      expertMeaning: "Wall height",
    },
    {
      id: "boardWidth",
      label: "Board width",
      type: "number",
      unit: "ft",
      required: true,
      smartDefault: 4,
      validation: { min: 0.1, max: 10 },
      helper: "Must be positive",
      expertMeaning: "Board width",
    },
    {
      id: "boardHeight",
      label: "Board height",
      type: "number",
      unit: "ft",
      required: true,
      smartDefault: 8,
      validation: { min: 0.1, max: 20 },
      helper: "Must be positive",
      expertMeaning: "Board height",
    },
    {
      id: "unitBoardCost",
      label: "Unit board cost",
      type: "number",
      unit: "USD",
      required: true,
      smartDefault: 12,
      validation: { min: 0, max: 1000 },
      helper: "Non-negative currency",
      expertMeaning: "Unit board cost",
    },
    {
      id: "wasteRatePercent",
      label: "Waste rate",
      type: "number",
      unit: "%",
      required: true,
      smartDefault: 10,
      validation: { min: 0, max: 100, step: 0.1 },
      helper: "Percent between 0 and 100",
      expertMeaning: "Waste rate",
    }
  ],

  formulaPipeline: [
    {
      formulaId: "cost.total_exposure",
      inputMap: {
        "a": "wallLength",
        "b": "wallHeight",
        "c": "boardWidth"
      },
      outputId: "totalExposure",
    },
    {
      formulaId: "benchmark.variance_percent",
      inputMap: {
        "actual": "wallLength",
        "target": "wallHeight"
      },
      outputId: "variancePercent",
    }
  ],

  outputs: [
    {
      id: "totalExposure",
      label: "Total board area",
      unit: "sqft",
      format: "currency",
      isBigNumber: true,
    },
    {
      id: "variancePercent",
      label: "Number of boards needed",
      unit: "%",
      format: "percentage",
      isBigNumber: false,
    }
  ],

  thresholds: [
    {
      fieldId: "totalExposure",
      warning: 1,
      critical: 3,
      direction: "higher_is_bad",
      warningMessage: "Exposure is entering warning band — review drivers.",
      criticalMessage: "Exposure is critical — immediate operational review required.",
    },
  ],

  reportTemplate: {
    title: "[object Object] Decision Report",
    sections: ["executive_summary", "thresholds", "sensitivity", "action_plan", "assumptions"],
    exportFormats: ["pdf", "csv"],
  },

  assumptions: {
    hiddenLossMultiplier: 1.05,
    volatilityPercent: 8,
    targetMarginPercent: 15,
    assumptionNotes: [
      "Boards are rectangular and standard sizes",
      "Waste rate includes cutting and breakage",
      "Labor rate is constant per sqft",
    ],
  },
};
