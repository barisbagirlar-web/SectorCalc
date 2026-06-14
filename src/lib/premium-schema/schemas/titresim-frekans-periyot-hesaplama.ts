import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";

/** P7 nightrun — DeepSeek Chief Engineer schema (factory generated). */
export const TitresimFrekansPeriyotHesaplama_SCHEMA: PremiumCalculatorSchema = {
  id: "titresim-frekans-periyot-hesaplama",
  name: "Titreşim — Frekans — Periyot Calculation",
  sectorSlug: "general-industrial",
  category: "cost",
  painStatement: "Classical mechanics: f = 1/T, T = 1/f",

  inputs: [
    {
      id: "periodSeconds",
      label: "Period (T)",
      type: "number",
      unit: "s",
      required: true,
      smartDefault: 1,
      validation: { min: 0.0001, max: 100000 },
      helper: "Must be positive and non-zero",
      expertMeaning: "Period (T)",
    },
    {
      id: "frequencyHz",
      label: "Frequency (f)",
      type: "number",
      unit: "Hz",
      required: true,
      smartDefault: 1,
      validation: { min: 0.0001, max: 100000 },
      helper: "Must be positive and non-zero",
      expertMeaning: "Frequency (f)",
    },
    {
      id: "displacementMeters",
      label: "Displacement amplitude (x)",
      type: "number",
      unit: "m",
      required: false,
      smartDefault: 0.01,
      validation: { min: 0, max: 1000 },
      helper: "Non-negative",
      expertMeaning: "Displacement amplitude (x)",
    },
    {
      id: "timeSeconds",
      label: "Time (t)",
      type: "number",
      unit: "s",
      required: false,
      smartDefault: 0,
      validation: { min: 0, max: 100000 },
      helper: "Non-negative",
      expertMeaning: "Time (t)",
    }
  ],

  formulaPipeline: [
    {
      formulaId: "cost.total_exposure",
      inputMap: {
        "a": "periodSeconds",
        "b": "frequencyHz",
        "c": "displacementMeters"
      },
      outputId: "totalExposure",
    },
    {
      formulaId: "benchmark.variance_percent",
      inputMap: {
        "actual": "periodSeconds",
        "target": "frequencyHz"
      },
      outputId: "variancePercent",
    }
  ],

  outputs: [
    {
      id: "totalExposure",
      label: "Frequency from period",
      unit: "Hz",
      format: "currency",
      isBigNumber: true,
    },
    {
      id: "variancePercent",
      label: "Period from frequency",
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
      "Simple harmonic motion",
      "Linear elastic behavior",
      "No damping",
    ],
  },
};
