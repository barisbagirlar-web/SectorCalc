import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";

/** P7 nightrun — DeepSeek Chief Engineer schema (factory generated). */
export const MakineEkonomikOmruHurdaDegerHesabi_SCHEMA: PremiumCalculatorSchema = {
  id: "makine-ekonomik-omru-hurda-deger-hesabi",
  name: "Makine Ekonomik Ömrü — Hurda Değer Calculation",
  sectorSlug: "general-industrial",
  category: "cost",
  painStatement: "Industrial engineering and accounting standard (ISO 15686-5, IAS 16)",

  inputs: [
    {
      id: "initialCost",
      label: "Initial purchase cost",
      type: "number",
      unit: "USD",
      required: true,
      smartDefault: 100000,
      validation: { min: 1, max: 100000000 },
      helper: "Must be positive currency amount",
      expertMeaning: "Initial purchase cost",
    },
    {
      id: "salvageValue",
      label: "Estimated salvage value",
      type: "number",
      unit: "USD",
      required: true,
      smartDefault: 5000,
      validation: { min: 0, max: 100000000 },
      helper: "Non-negative, must be less than initial cost",
      expertMeaning: "Estimated salvage value",
    },
    {
      id: "usefulLife",
      label: "Useful life in years",
      type: "number",
      unit: "years",
      required: true,
      smartDefault: 10,
      validation: { min: 1, max: 100 },
      helper: "Must be positive integer",
      expertMeaning: "Useful life in years",
    },
    {
      id: "currentYear",
      label: "Current year of operation",
      type: "number",
      unit: "years",
      required: true,
      smartDefault: 5,
      validation: { min: 0, max: 100 },
      helper: "Must be between 0 and useful life",
      expertMeaning: "Current year of operation",
    }
  ],

  formulaPipeline: [
    {
      formulaId: "cost.total_exposure",
      inputMap: {
        "a": "initialCost",
        "b": "salvageValue",
        "c": "usefulLife"
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
      "Straight-line depreciation method is appropriate",
      "Salvage value is estimated at end of useful life",
      "No mid-year adjustments (full year depreciation)",
    ],
  },
};
