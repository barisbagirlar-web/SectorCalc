import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";

/** P7 nightrun — DeepSeek Chief Engineer schema (factory generated). */
export const YalitimMalzemesiMHesaplama_SCHEMA: PremiumCalculatorSchema = {
  id: "yalitim-malzemesi-m-hesaplama",
  name: "Yalıtım Malzemesi (m²) Calculation",
  sectorSlug: "general-industrial",
  category: "cost",
  painStatement: "Standard construction/industrial insulation takeoff and cost estimation",

  inputs: [
    {
      id: "length",
      label: "Length of surface to insulate",
      type: "number",
      unit: "m",
      required: true,
      smartDefault: 10,
      validation: { min: 0.01, max: 1000 },
      helper: "Must be positive length",
      expertMeaning: "Length of surface to insulate",
    },
    {
      id: "width",
      label: "Width of surface to insulate",
      type: "number",
      unit: "m",
      required: true,
      smartDefault: 5,
      validation: { min: 0.01, max: 1000 },
      helper: "Must be positive width",
      expertMeaning: "Width of surface to insulate",
    },
    {
      id: "wasteRatePercent",
      label: "Waste rate",
      type: "number",
      unit: "%",
      required: true,
      smartDefault: 10,
      validation: { min: 0, max: 50, step: 0.1 },
      helper: "Percent between 0 and 50",
      expertMeaning: "Waste rate",
    },
    {
      id: "unitCostPerSqm",
      label: "Material cost per m²",
      type: "number",
      unit: "USD",
      required: true,
      smartDefault: 25,
      validation: { min: 0, max: 1000 },
      helper: "Non-negative currency",
      expertMeaning: "Material cost per m²",
    },
    {
      id: "laborRatePerSqm",
      label: "Labor rate per m²",
      type: "number",
      unit: "USD",
      required: true,
      smartDefault: 15,
      validation: { min: 0, max: 500 },
      helper: "Non-negative currency",
      expertMeaning: "Labor rate per m²",
    }
  ],

  formulaPipeline: [
    {
      formulaId: "cost.total_exposure",
      inputMap: {
        "a": "length",
        "b": "width",
        "c": "wasteRatePercent"
      },
      outputId: "totalExposure",
    },
    {
      formulaId: "benchmark.variance_percent",
      inputMap: {
        "actual": "length",
        "target": "width"
      },
      outputId: "variancePercent",
    }
  ],

  outputs: [
    {
      id: "totalExposure",
      label: "Net insulation area",
      unit: "m²",
      format: "currency",
      isBigNumber: true,
    },
    {
      id: "variancePercent",
      label: "Gross insulation area (including waste)",
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
      "Surface is rectangular and flat",
      "Waste rate includes cutting and fitting losses",
      "Labor rate is uniform per m²",
    ],
  },
};
