import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";

/** P7 nightrun — DeepSeek Chief Engineer schema (factory generated). */
export const AracAmortismanHesaplama_SCHEMA: PremiumCalculatorSchema = {
  id: "arac-amortisman-hesaplama",
  name: "Araç Amortisman Calculation",
  sectorSlug: "general-industrial",
  category: "cost",
  painStatement: "Standard accounting and industrial asset management",

  inputs: [
    {
      id: "initialCost",
      label: "Initial cost of vehicle",
      type: "number",
      unit: "USD",
      required: true,
      smartDefault: 50000,
      validation: { min: 0.01, max: 10000000 },
      helper: "Must be positive currency amount",
      expertMeaning: "Initial cost of vehicle",
    },
    {
      id: "salvageValue",
      label: "Salvage value at end of life",
      type: "number",
      unit: "USD",
      required: true,
      smartDefault: 5000,
      validation: { min: 0, max: 10000000 },
      helper: "Non-negative and less than initial cost",
      expertMeaning: "Salvage value at end of life",
    },
    {
      id: "usefulLifeYears",
      label: "Useful life in years",
      type: "number",
      unit: "years",
      required: true,
      smartDefault: 10,
      validation: { min: 1, max: 50 },
      helper: "Must be positive integer",
      expertMeaning: "Useful life in years",
    },
    {
      id: "yearsUsed",
      label: "Years already used",
      type: "number",
      unit: "years",
      required: true,
      smartDefault: 3,
      validation: { min: 0, max: 50 },
      helper: "Must be non-negative and less than or equal to useful life",
      expertMeaning: "Years already used",
    }
  ],

  formulaPipeline: [
    {
      formulaId: "cost.total_exposure",
      inputMap: {
        "a": "initialCost",
        "b": "salvageValue",
        "c": "usefulLifeYears"
      },
      outputId: "totalExposure",
    },
    {
      formulaId: "benchmark.variance_percent",
      inputMap: {
        "actual": "initialCost",
        "target": "salvageValue"
      },
      outputId: "variancePercent",
    }
  ],

  outputs: [
    {
      id: "totalExposure",
      label: "Annual depreciation amount",
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
      "Straight-line depreciation method is used",
      "Salvage value is estimated at end of useful life",
      "No mid-year or partial year adjustments",
    ],
  },
};
