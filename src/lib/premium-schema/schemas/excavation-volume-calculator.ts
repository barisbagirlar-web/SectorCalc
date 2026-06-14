import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";

/** P7 nightrun — DeepSeek Chief Engineer schema (factory generated). */
export const ExcavationVolumeCalculator_SCHEMA: PremiumCalculatorSchema = {
  id: "excavation-volume-calculator",
  name: "Excavation Volume Calculator",
  sectorSlug: "general-industrial",
  category: "cost",
  painStatement: "Civil engineering earthwork standards (Caterpillar Performance Handbook, ASTM D698)",

  inputs: [
    {
      id: "excavationLength",
      label: "Excavation length",
      type: "number",
      unit: "m",
      required: true,
      smartDefault: 10,
      validation: { min: 0.01, max: 1000 },
      helper: "Must be positive length",
      expertMeaning: "Excavation length",
    },
    {
      id: "excavationWidth",
      label: "Excavation width",
      type: "number",
      unit: "m",
      required: true,
      smartDefault: 5,
      validation: { min: 0.01, max: 1000 },
      helper: "Must be positive width",
      expertMeaning: "Excavation width",
    },
    {
      id: "excavationDepth",
      label: "Excavation depth",
      type: "number",
      unit: "m",
      required: true,
      smartDefault: 3,
      validation: { min: 0.01, max: 100 },
      helper: "Must be positive depth",
      expertMeaning: "Excavation depth",
    },
    {
      id: "swellFactorPercent",
      label: "Swell factor",
      type: "number",
      unit: "%",
      required: true,
      smartDefault: 25,
      validation: { min: 0, max: 100, step: 0.1 },
      helper: "Percent between 0 and 100",
      expertMeaning: "Swell factor",
    },
    {
      id: "compactionFactorPercent",
      label: "Compaction factor",
      type: "number",
      unit: "%",
      required: true,
      smartDefault: 10,
      validation: { min: 0, max: 100, step: 0.1 },
      helper: "Percent between 0 and 100",
      expertMeaning: "Compaction factor",
    }
  ],

  formulaPipeline: [
    {
      formulaId: "cost.total_exposure",
      inputMap: {
        "a": "excavationLength",
        "b": "excavationWidth",
        "c": "excavationDepth"
      },
      outputId: "totalExposure",
    },
    {
      formulaId: "benchmark.variance_percent",
      inputMap: {
        "actual": "excavationLength",
        "target": "excavationWidth"
      },
      outputId: "variancePercent",
    }
  ],

  outputs: [
    {
      id: "totalExposure",
      label: "Bank volume",
      unit: "m³",
      format: "currency",
      isBigNumber: true,
    },
    {
      id: "variancePercent",
      label: "Loose volume (for hauling)",
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
      "Excavation area is rectangular with uniform depth",
      "Swell and compaction factors are representative for the soil type",
      "No slope or irregular geometry considered",
    ],
  },
};
