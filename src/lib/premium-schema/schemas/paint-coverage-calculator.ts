import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";

/** P7 nightrun — DeepSeek Chief Engineer schema (factory generated). */
export const PaintCoverageCalculator_SCHEMA: PremiumCalculatorSchema = {
  id: "paint-coverage-calculator",
  name: "Paint Coverage Calculator",
  sectorSlug: "general-industrial",
  category: "cost",
  painStatement: "Industrial engineering and construction cost estimation",

  inputs: [
    {
      id: "totalArea",
      label: "Total surface area to paint",
      type: "number",
      unit: "m²",
      required: true,
      smartDefault: 100,
      validation: { min: 0.01, max: 1000000 },
      helper: "Must be positive",
      expertMeaning: "Total surface area to paint",
    },
    {
      id: "dryFilmThicknessMicrons",
      label: "Dry film thickness",
      type: "number",
      unit: "µm",
      required: true,
      smartDefault: 100,
      validation: { min: 1, max: 1000 },
      helper: "Must be between 1 and 1000 microns",
      expertMeaning: "Dry film thickness",
    },
    {
      id: "volumeSolidsPercent",
      label: "Volume solids percentage",
      type: "number",
      unit: "%",
      required: true,
      smartDefault: 60,
      validation: { min: 1, max: 100, step: 0.1 },
      helper: "Must be between 1 and 100",
      expertMeaning: "Volume solids percentage",
    },
    {
      id: "applicationEfficiencyPercent",
      label: "Application efficiency",
      type: "number",
      unit: "%",
      required: true,
      smartDefault: 85,
      validation: { min: 1, max: 100, step: 0.1 },
      helper: "Must be between 1 and 100",
      expertMeaning: "Application efficiency",
    },
    {
      id: "unitCostPerLiter",
      label: "Paint cost per liter",
      type: "number",
      unit: "USD",
      required: true,
      smartDefault: 20,
      validation: { min: 0, max: 10000 },
      helper: "Non-negative",
      expertMeaning: "Paint cost per liter",
    },
    {
      id: "wastePercent",
      label: "Waste and contingency percentage",
      type: "number",
      unit: "%",
      required: true,
      smartDefault: 10,
      validation: { min: 0, max: 100, step: 0.1 },
      helper: "Between 0 and 100",
      expertMeaning: "Waste and contingency percentage",
    }
  ],

  formulaPipeline: [
    {
      formulaId: "cost.total_exposure",
      inputMap: {
        "a": "totalArea",
        "b": "dryFilmThicknessMicrons",
        "c": "volumeSolidsPercent"
      },
      outputId: "totalExposure",
    },
    {
      formulaId: "benchmark.variance_percent",
      inputMap: {
        "actual": "totalArea",
        "target": "dryFilmThicknessMicrons"
      },
      outputId: "variancePercent",
    }
  ],

  outputs: [
    {
      id: "totalExposure",
      label: "Total liters of paint required",
      unit: "L",
      format: "currency",
      isBigNumber: true,
    },
    {
      id: "variancePercent",
      label: "Total material cost (without waste)",
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
      "Surface is smooth and non-porous; no primer or additional coats considered",
      "Application efficiency is constant across entire area",
      "Paint cost per liter is constant (no bulk discounts)",
    ],
  },
};
