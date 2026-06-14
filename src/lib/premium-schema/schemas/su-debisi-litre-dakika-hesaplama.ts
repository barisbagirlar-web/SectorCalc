import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";

/** P7 nightrun — DeepSeek Chief Engineer schema (factory generated). */
export const SuDebisiLitreDakikaHesaplama_SCHEMA: PremiumCalculatorSchema = {
  id: "su-debisi-litre-dakika-hesaplama",
  name: "Su Debisi (Litre/Dakika) Calculation",
  sectorSlug: "general-industrial",
  category: "cost",
  painStatement: "Fluid mechanics - continuity equation",

  inputs: [
    {
      id: "pipeDiameter",
      label: "Pipe inner diameter",
      type: "number",
      unit: "m",
      required: true,
      smartDefault: 0.1,
      validation: { min: 0.001, max: 10 },
      helper: "Must be positive and at least 0.001 m",
      expertMeaning: "Pipe inner diameter",
    },
    {
      id: "flowVelocity",
      label: "Flow velocity",
      type: "number",
      unit: "m/s",
      required: true,
      smartDefault: 2,
      validation: { min: 0.01, max: 50 },
      helper: "Must be positive and at least 0.01 m/s",
      expertMeaning: "Flow velocity",
    },
    {
      id: "correctionFactor",
      label: "Correction factor (roughness, fittings)",
      type: "number",
      unit: "dimensionless",
      required: false,
      smartDefault: 1,
      validation: { min: 0.8, max: 1.2 },
      helper: "Between 0.8 and 1.2, default 1 if not provided",
      expertMeaning: "Correction factor (roughness, fittings)",
    }
  ],

  formulaPipeline: [
    {
      formulaId: "cost.total_exposure",
      inputMap: {
        "a": "pipeDiameter",
        "b": "flowVelocity",
        "c": "correctionFactor"
      },
      outputId: "totalExposure",
    },
    {
      formulaId: "benchmark.variance_percent",
      inputMap: {
        "actual": "pipeDiameter",
        "target": "flowVelocity"
      },
      outputId: "variancePercent",
    }
  ],

  outputs: [
    {
      id: "totalExposure",
      label: "Flow rate (L/min)",
      unit: "L/min",
      format: "currency",
      isBigNumber: true,
    },
    {
      id: "variancePercent",
      label: "Flow rate (m³/h)",
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
      "Steady, incompressible flow",
      "Circular pipe cross-section",
      "Uniform velocity profile (bulk average velocity)",
    ],
  },
};
