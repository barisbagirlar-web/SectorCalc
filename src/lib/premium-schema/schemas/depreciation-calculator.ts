import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";

/** P7 nightrun — DeepSeek Chief Engineer schema (factory generated). */
export const DepreciationCalculator_SCHEMA: PremiumCalculatorSchema = {
  id: "depreciation-calculator",
  name: "Straight-Line Depreciation",
  sectorSlug: "general-industrial",
  category: "cost",
  painStatement: "Standard accounting depreciation method per IAS 16 / GAAP",

  inputs: [
    {
      id: "assetCost",
      label: "Asset cost",
      type: "number",
      unit: "USD",
      required: true,
      smartDefault: 100000,
      validation: { min: 0, max: 1000000000 },
      helper: "Non-negative currency",
      expertMeaning: "Asset cost",
    },
    {
      id: "salvageValue",
      label: "Salvage value",
      type: "number",
      unit: "USD",
      required: true,
      smartDefault: 10000,
      validation: { min: 0, max: 1000000000 },
      helper: "Non-negative currency, must be less than asset cost",
      expertMeaning: "Salvage value",
    },
    {
      id: "usefulLifeYears",
      label: "Useful life (years)",
      type: "number",
      unit: "years",
      required: true,
      smartDefault: 10,
      validation: { min: 1, max: 100 },
      helper: "Positive integer",
      expertMeaning: "Useful life (years)",
    },
    {
      id: "yearsElapsed",
      label: "Years elapsed",
      type: "number",
      unit: "years",
      required: true,
      smartDefault: 0,
      validation: { min: 0, max: 100 },
      helper: "Non-negative integer, cannot exceed useful life",
      expertMeaning: "Years elapsed",
    }
  ],

  formulaPipeline: [
    {
      formulaId: "cost.total_exposure",
      inputMap: {
        "a": "assetCost",
        "b": "salvageValue",
        "c": "usefulLifeYears"
      },
      outputId: "totalExposure",
    },
    {
      formulaId: "benchmark.variance_percent",
      inputMap: {
        "actual": "assetCost",
        "target": "salvageValue"
      },
      outputId: "variancePercent",
    }
  ],

  outputs: [
    {
      id: "totalExposure",
      label: "Annual depreciation",
      unit: "USD",
      format: "currency",
      isBigNumber: true,
    },
    {
      id: "variancePercent",
      label: "Accumulated depreciation",
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
      "Straight-line method is appropriate for the asset",
      "Salvage value is reliably estimable",
      "Useful life is known and constant",
    ],
  },
};
