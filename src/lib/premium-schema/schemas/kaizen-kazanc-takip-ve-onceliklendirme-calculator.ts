import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";

/** P7 nightrun — DeepSeek Chief Engineer schema (factory generated). */
export const KaizenKazancTakipVeOnceliklendirmeCalculator_SCHEMA: PremiumCalculatorSchema = {
  id: "kaizen-kazanc-takip-ve-onceliklendirme-calculator",
  name: "Kaizen Kazanc Takip Ve Onceliklendirme",
  sectorSlug: "general-industrial",
  category: "cost",
  painStatement: "Lean manufacturing and continuous improvement cost accounting",

  inputs: [
    {
      id: "currentCostPerUnit",
      label: "Current cost per unit",
      type: "number",
      unit: "USD",
      required: true,
      smartDefault: 10,
      validation: { min: 0.01, max: 100000 },
      helper: "Must be positive",
      expertMeaning: "Current cost per unit",
    },
    {
      id: "improvedCostPerUnit",
      label: "Improved cost per unit",
      type: "number",
      unit: "USD",
      required: true,
      smartDefault: 8,
      validation: { min: 0, max: 100000 },
      helper: "Must be less than current cost",
      expertMeaning: "Improved cost per unit",
    },
    {
      id: "annualProductionVolume",
      label: "Annual production volume",
      type: "number",
      unit: "units",
      required: true,
      smartDefault: 10000,
      validation: { min: 1, max: 100000000 },
      helper: "Must be positive integer",
      expertMeaning: "Annual production volume",
    },
    {
      id: "setupCost",
      label: "Setup cost",
      type: "number",
      unit: "USD",
      required: true,
      smartDefault: 500,
      validation: { min: 0, max: 1000000 },
      helper: "Non-negative",
      expertMeaning: "Setup cost",
    },
    {
      id: "trainingCost",
      label: "Training cost",
      type: "number",
      unit: "USD",
      required: true,
      smartDefault: 200,
      validation: { min: 0, max: 1000000 },
      helper: "Non-negative",
      expertMeaning: "Training cost",
    },
    {
      id: "downtimeCost",
      label: "Downtime cost",
      type: "number",
      unit: "USD",
      required: true,
      smartDefault: 300,
      validation: { min: 0, max: 1000000 },
      helper: "Non-negative",
      expertMeaning: "Downtime cost",
    }
  ],

  formulaPipeline: [
    {
      formulaId: "cost.total_exposure",
      inputMap: {
        "a": "currentCostPerUnit",
        "b": "improvedCostPerUnit",
        "c": "annualProductionVolume"
      },
      outputId: "totalExposure",
    },
    {
      formulaId: "benchmark.variance_percent",
      inputMap: {
        "actual": "currentCostPerUnit",
        "target": "improvedCostPerUnit"
      },
      outputId: "variancePercent",
    }
  ],

  outputs: [
    {
      id: "totalExposure",
      label: "Annualized savings",
      unit: "USD",
      format: "currency",
      isBigNumber: true,
    },
    {
      id: "variancePercent",
      label: "Implementation cost",
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
      "Cost savings are realized annually",
      "Implementation costs are one-time",
      "Production volume remains constant",
    ],
  },
};
