import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";

/** P7 nightrun — DeepSeek Chief Engineer schema (factory generated). */
export const BrickCalculator_SCHEMA: PremiumCalculatorSchema = {
  id: "brick-calculator",
  name: "Brick Calculator",
  sectorSlug: "general-industrial",
  category: "cost",
  painStatement: "Construction quantity surveying and cost engineering",

  inputs: [
    {
      id: "wallLength",
      label: "Wall length",
      type: "number",
      unit: "m",
      required: true,
      smartDefault: 10,
      validation: { min: 0.01, max: 1000 },
      helper: "Must be positive length",
      expertMeaning: "Wall length",
    },
    {
      id: "wallHeight",
      label: "Wall height",
      type: "number",
      unit: "m",
      required: true,
      smartDefault: 3,
      validation: { min: 0.01, max: 100 },
      helper: "Must be positive height",
      expertMeaning: "Wall height",
    },
    {
      id: "wallThickness",
      label: "Wall thickness",
      type: "number",
      unit: "m",
      required: true,
      smartDefault: 0.2,
      validation: { min: 0.01, max: 5 },
      helper: "Must be positive thickness",
      expertMeaning: "Wall thickness",
    },
    {
      id: "brickLength",
      label: "Brick length",
      type: "number",
      unit: "m",
      required: true,
      smartDefault: 0.2,
      validation: { min: 0.01, max: 1 },
      helper: "Must be positive length",
      expertMeaning: "Brick length",
    },
    {
      id: "brickHeight",
      label: "Brick height",
      type: "number",
      unit: "m",
      required: true,
      smartDefault: 0.1,
      validation: { min: 0.01, max: 1 },
      helper: "Must be positive height",
      expertMeaning: "Brick height",
    },
    {
      id: "brickThickness",
      label: "Brick thickness",
      type: "number",
      unit: "m",
      required: true,
      smartDefault: 0.1,
      validation: { min: 0.01, max: 1 },
      helper: "Must be positive thickness",
      expertMeaning: "Brick thickness",
    }
  ],

  formulaPipeline: [
    {
      formulaId: "cost.total_exposure",
      inputMap: {
        "a": "wallLength",
        "b": "wallHeight",
        "c": "wallThickness"
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
      label: "Total bricks needed",
      unit: "units",
      format: "currency",
      isBigNumber: true,
    },
    {
      id: "variancePercent",
      label: "Total brick cost",
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
      "Bricks are laid in a standard running bond pattern",
      "Mortar joint thickness is uniform",
      "Waste rate includes breakage and cutting losses",
    ],
  },
};
