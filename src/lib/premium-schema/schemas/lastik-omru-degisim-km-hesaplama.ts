import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";

/** P7 nightrun — DeepSeek Chief Engineer schema (factory generated). */
export const LastikOmruDegisimKmHesaplama_SCHEMA: PremiumCalculatorSchema = {
  id: "lastik-omru-degisim-km-hesaplama",
  name: "Lastik Ömrü — Değişim Km Calculation",
  sectorSlug: "general-industrial",
  category: "cost",
  painStatement: "Industrial engineering and fleet management practice",

  inputs: [
    {
      id: "initialTreadDepth",
      label: "Initial tread depth",
      type: "number",
      unit: "mm",
      required: true,
      smartDefault: 8,
      validation: { min: 1, max: 20 },
      helper: "Must be between 1 and 20 mm",
      expertMeaning: "Initial tread depth",
    },
    {
      id: "currentTreadDepth",
      label: "Current tread depth",
      type: "number",
      unit: "mm",
      required: true,
      smartDefault: 5,
      validation: { min: 0, max: 20 },
      helper: "Must be between 0 and initial tread depth",
      expertMeaning: "Current tread depth",
    },
    {
      id: "replacementThreshold",
      label: "Replacement threshold",
      type: "number",
      unit: "mm",
      required: true,
      smartDefault: 1.6,
      validation: { min: 0, max: 5 },
      helper: "Must be between 0 and 5 mm, typically 1.6 mm legal minimum",
      expertMeaning: "Replacement threshold",
    },
    {
      id: "wearRatePer10kKm",
      label: "Wear rate per 10,000 km",
      type: "number",
      unit: "mm/10kkm",
      required: true,
      smartDefault: 1,
      validation: { min: 0.1, max: 5 },
      helper: "Must be positive, typical range 0.1-5 mm/10kkm",
      expertMeaning: "Wear rate per 10,000 km",
    },
    {
      id: "loadFactor",
      label: "Load factor",
      type: "number",
      unit: "dimensionless",
      required: true,
      smartDefault: 1,
      validation: { min: 0.5, max: 1.5 },
      helper: "Between 0.5 and 1.5; 1.0 = nominal load",
      expertMeaning: "Load factor",
    },
    {
      id: "roadConditionFactor",
      label: "Road condition factor",
      type: "number",
      unit: "dimensionless",
      required: true,
      smartDefault: 1,
      validation: { min: 0.5, max: 1.5 },
      helper: "Between 0.5 and 1.5; 1.0 = good paved road",
      expertMeaning: "Road condition factor",
    }
  ],

  formulaPipeline: [
    {
      formulaId: "cost.total_exposure",
      inputMap: {
        "a": "initialTreadDepth",
        "b": "currentTreadDepth",
        "c": "replacementThreshold"
      },
      outputId: "totalExposure",
    },
    {
      formulaId: "benchmark.variance_percent",
      inputMap: {
        "actual": "initialTreadDepth",
        "target": "currentTreadDepth"
      },
      outputId: "variancePercent",
    }
  ],

  outputs: [
    {
      id: "totalExposure",
      label: "Estimated total tire life",
      unit: "km",
      format: "currency",
      isBigNumber: true,
    },
    {
      id: "variancePercent",
      label: "Remaining kilometers",
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
      "Linear wear rate over mileage",
      "Load and road condition factors are multiplicative and independent",
      "Tire wear is uniform across tread",
    ],
  },
};
