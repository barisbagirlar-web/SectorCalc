import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";

/** P7 nightrun — DeepSeek Chief Engineer schema (factory generated). */
export const KesmeParametreleriTakimOmruOptimizasyonCalculator_SCHEMA: PremiumCalculatorSchema = {
  id: "kesme-parametreleri-takim-omru-optimizasyon-calculator",
  name: "Kesme Parametreleri Takim Omru Optimizasyon",
  sectorSlug: "general-industrial",
  category: "cost",
  painStatement: "Taylor's tool life equation (VT^n = C) combined with cost per component model",

  inputs: [
    {
      id: "cuttingSpeed",
      label: "Cutting speed",
      type: "number",
      unit: "m/min",
      required: true,
      smartDefault: 150,
      validation: { min: 0.1, max: 1000 },
      helper: "Must be positive",
      expertMeaning: "Cutting speed",
    },
    {
      id: "toolLifeConstantC",
      label: "Tool-life constant C",
      type: "number",
      unit: "m/min",
      required: true,
      smartDefault: 300,
      validation: { min: 1, max: 10000 },
      helper: "Must be positive",
      expertMeaning: "Tool-life constant C",
    },
    {
      id: "toolLifeExponentN",
      label: "Tool-life exponent n",
      type: "number",
      unit: "dimensionless",
      required: true,
      smartDefault: 0.25,
      validation: { min: 0.01, max: 1 },
      helper: "Must be between 0.01 and 1",
      expertMeaning: "Tool-life exponent n",
    },
    {
      id: "toolChangeCost",
      label: "Tool change cost",
      type: "number",
      unit: "USD",
      required: true,
      smartDefault: 50,
      validation: { min: 0, max: 10000 },
      helper: "Non-negative",
      expertMeaning: "Tool change cost",
    },
    {
      id: "machineHourlyRate",
      label: "Machine hourly rate",
      type: "number",
      unit: "USD/h",
      required: true,
      smartDefault: 100,
      validation: { min: 0, max: 10000 },
      helper: "Non-negative",
      expertMeaning: "Machine hourly rate",
    },
    {
      id: "productionRate",
      label: "Production rate",
      type: "number",
      unit: "parts/h",
      required: true,
      smartDefault: 10,
      validation: { min: 0.1, max: 10000 },
      helper: "Must be positive",
      expertMeaning: "Production rate",
    }
  ],

  formulaPipeline: [
    {
      formulaId: "cost.total_exposure",
      inputMap: {
        "a": "cuttingSpeed",
        "b": "toolLifeConstantC",
        "c": "toolLifeExponentN"
      },
      outputId: "totalExposure",
    },
    {
      formulaId: "benchmark.variance_percent",
      inputMap: {
        "actual": "cuttingSpeed",
        "target": "toolLifeConstantC"
      },
      outputId: "variancePercent",
    }
  ],

  outputs: [
    {
      id: "totalExposure",
      label: "Tool life",
      unit: "min",
      format: "currency",
      isBigNumber: true,
    },
    {
      id: "variancePercent",
      label: "Cost per component",
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
      "Taylor's tool life equation is valid for the operation",
      "Constants C and n are known and accurate",
      "Tool change time is negligible or included in tool change cost",
    ],
  },
};
