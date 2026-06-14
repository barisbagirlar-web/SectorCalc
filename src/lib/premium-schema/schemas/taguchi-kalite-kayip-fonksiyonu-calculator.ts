import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";

/** P7 nightrun — DeepSeek Chief Engineer schema (factory generated). */
export const TaguchiKaliteKayipFonksiyonuCalculator_SCHEMA: PremiumCalculatorSchema = {
  id: "taguchi-kalite-kayip-fonksiyonu-calculator",
  name: "Taguchi Kalite Kayip Fonksiyonu",
  sectorSlug: "general-industrial",
  category: "cost",
  painStatement: "Taguchi's quadratic loss function for quality engineering",

  inputs: [
    {
      id: "targetValue",
      label: "Target value",
      type: "number",
      unit: "measurement unit (e.g., mm, g)",
      required: true,
      smartDefault: 10,
      validation: { min: 0, max: 1000000 },
      helper: "Must be non-negative",
      expertMeaning: "Target value",
    },
    {
      id: "actualValue",
      label: "Actual measured value",
      type: "number",
      unit: "measurement unit (e.g., mm, g)",
      required: true,
      smartDefault: 10.5,
      validation: { min: 0, max: 1000000 },
      helper: "Must be non-negative",
      expertMeaning: "Actual measured value",
    },
    {
      id: "lossCoefficientK",
      label: "Loss coefficient k",
      type: "number",
      unit: "USD per squared unit",
      required: true,
      smartDefault: 5,
      validation: { min: 0, max: 1000000 },
      helper: "Non-negative currency per squared unit",
      expertMeaning: "Loss coefficient k",
    },
    {
      id: "productionQuantity",
      label: "Production quantity",
      type: "number",
      unit: "units",
      required: true,
      smartDefault: 100,
      validation: { min: 1, max: 1000000 },
      helper: "Must be positive integer",
      expertMeaning: "Production quantity",
    },
    {
      id: "unitCost",
      label: "Unit cost",
      type: "number",
      unit: "USD",
      required: true,
      smartDefault: 10,
      validation: { min: 0.01, max: 100000 },
      helper: "Must be positive for loss percent calculation",
      expertMeaning: "Unit cost",
    }
  ],

  formulaPipeline: [
    {
      formulaId: "cost.total_exposure",
      inputMap: {
        "a": "targetValue",
        "b": "actualValue",
        "c": "lossCoefficientK"
      },
      outputId: "totalExposure",
    },
    {
      formulaId: "benchmark.variance_percent",
      inputMap: {
        "actual": "targetValue",
        "target": "actualValue"
      },
      outputId: "variancePercent",
    }
  ],

  outputs: [
    {
      id: "totalExposure",
      label: "Deviation from target",
      unit: "measurement unit",
      format: "currency",
      isBigNumber: true,
    },
    {
      id: "variancePercent",
      label: "Loss per unit",
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
      "Loss function is quadratic and symmetric around target",
      "Loss coefficient k is constant and known",
      "All units produced are independent and identically distributed",
    ],
  },
};
