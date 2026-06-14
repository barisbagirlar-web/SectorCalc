import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";

/** P7 nightrun — DeepSeek Chief Engineer schema (factory generated). */
export const SilindirHacmiHesaplama_SCHEMA: PremiumCalculatorSchema = {
  id: "silindir-hacmi-hesaplama",
  name: "Silindir Hacmi Calculation",
  sectorSlug: "general-industrial",
  category: "cost",
  painStatement: "Temel geometri ve hacim hesabı",

  inputs: [
    {
      id: "diameter",
      label: "Cylinder diameter",
      type: "number",
      unit: "mm",
      required: true,
      smartDefault: 100,
      validation: { min: 0.1, max: 10000 },
      helper: "Must be positive",
      expertMeaning: "Cylinder diameter",
    },
    {
      id: "height",
      label: "Cylinder height",
      type: "number",
      unit: "mm",
      required: true,
      smartDefault: 200,
      validation: { min: 0.1, max: 10000 },
      helper: "Must be positive",
      expertMeaning: "Cylinder height",
    },
    {
      id: "outputUnit",
      label: "Output unit",
      type: "number",
      unit: "",
      required: true,
      smartDefault: 1,
      validation: { min: 0 },
      helper: "Select one of cm3, L, m3",
      expertMeaning: "Output unit",
    }
  ],

  formulaPipeline: [
    {
      formulaId: "cost.total_exposure",
      inputMap: {
        "a": "diameter",
        "b": "height",
        "c": "outputUnit"
      },
      outputId: "totalExposure",
    },
    {
      formulaId: "benchmark.variance_percent",
      inputMap: {
        "actual": "diameter",
        "target": "height"
      },
      outputId: "variancePercent",
    }
  ],

  outputs: [
    {
      id: "totalExposure",
      label: "Cylinder volume",
      unit: "cm³",
      format: "currency",
      isBigNumber: true,
    },
    {
      id: "variancePercent",
      label: "Volume in liters",
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
      "Cylinder is right circular",
      "Dimensions are internal",
      "No wall thickness considered",
    ],
  },
};
