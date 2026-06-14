import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";

/** P7 nightrun — DeepSeek Chief Engineer schema (factory generated). */
export const BoruCapiAkisHiziHesaplama_SCHEMA: PremiumCalculatorSchema = {
  id: "boru-capi-akis-hizi-hesaplama",
  name: "Boru Çapı — Akış Hızı Calculation",
  sectorSlug: "general-industrial",
  category: "cost",
  painStatement: "Fluid mechanics, Bernoulli's principle",

  inputs: [
    {
      id: "pipeInnerDiameter",
      label: "Pipe inner diameter",
      type: "number",
      unit: "mm",
      required: true,
      smartDefault: 100,
      validation: { min: 1, max: 5000 },
      helper: "Must be positive",
      expertMeaning: "Pipe inner diameter",
    },
    {
      id: "flowVelocity",
      label: "Flow velocity",
      type: "number",
      unit: "m/s",
      required: true,
      smartDefault: 2,
      validation: { min: 0, max: 50 },
      helper: "Non-negative",
      expertMeaning: "Flow velocity",
    },
    {
      id: "fluidDensity",
      label: "Fluid density",
      type: "number",
      unit: "kg/m³",
      required: false,
      smartDefault: 1000,
      validation: { min: 0.1, max: 20000 },
      helper: "Positive, used for Reynolds number",
      expertMeaning: "Fluid density",
    },
    {
      id: "dynamicViscosity",
      label: "Dynamic viscosity",
      type: "number",
      unit: "Pa·s",
      required: false,
      smartDefault: 0.001,
      validation: { min: 0.000001, max: 100 },
      helper: "Positive, used for Reynolds number",
      expertMeaning: "Dynamic viscosity",
    }
  ],

  formulaPipeline: [
    {
      formulaId: "cost.total_exposure",
      inputMap: {
        "a": "pipeInnerDiameter",
        "b": "flowVelocity",
        "c": "fluidDensity"
      },
      outputId: "totalExposure",
    },
    {
      formulaId: "benchmark.variance_percent",
      inputMap: {
        "actual": "pipeInnerDiameter",
        "target": "flowVelocity"
      },
      outputId: "variancePercent",
    }
  ],

  outputs: [
    {
      id: "totalExposure",
      label: "Volumetric flow rate",
      unit: "m³/h",
      format: "currency",
      isBigNumber: true,
    },
    {
      id: "variancePercent",
      label: "Cross-sectional area",
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
      "Uniform velocity profile (plug flow)",
      "Newtonian fluid",
    ],
  },
};
