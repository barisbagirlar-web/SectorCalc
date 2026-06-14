import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";

/** P7 nightrun — DeepSeek Chief Engineer schema (factory generated). */
export const TakimTutucuVeBaglamaAparatiSetupSuresiCalculator_SCHEMA: PremiumCalculatorSchema = {
  id: "takim-tutucu-ve-baglama-aparati-setup-suresi-calculator",
  name: "Takim Tutucu Ve Baglama Aparati Setup Suresi",
  sectorSlug: "general-industrial",
  category: "cost",
  painStatement: "Industrial engineering time study and MTM (Methods-Time Measurement)",

  inputs: [
    {
      id: "numberOfTools",
      label: "Number of tools",
      type: "number",
      unit: "units",
      required: true,
      smartDefault: 5,
      validation: { min: 1, max: 100 },
      helper: "Must be positive integer",
      expertMeaning: "Number of tools",
    },
    {
      id: "numberOfFixtureChanges",
      label: "Number of fixture changes",
      type: "number",
      unit: "units",
      required: true,
      smartDefault: 2,
      validation: { min: 0, max: 50 },
      helper: "Non-negative integer",
      expertMeaning: "Number of fixture changes",
    },
    {
      id: "baseTimePerTool",
      label: "Base time per tool",
      type: "number",
      unit: "minutes",
      required: true,
      smartDefault: 5,
      validation: { min: 0.5, max: 60 },
      helper: "Positive time in minutes",
      expertMeaning: "Base time per tool",
    },
    {
      id: "baseTimePerFixtureChange",
      label: "Base time per fixture change",
      type: "number",
      unit: "minutes",
      required: true,
      smartDefault: 10,
      validation: { min: 0.5, max: 120 },
      helper: "Positive time in minutes",
      expertMeaning: "Base time per fixture change",
    },
    {
      id: "complexityFactor",
      label: "Complexity factor",
      type: "number",
      unit: "dimensionless",
      required: true,
      smartDefault: 1,
      validation: { min: 0.5, max: 3 },
      helper: "Factor between 0.5 and 3",
      expertMeaning: "Complexity factor",
    },
    {
      id: "operatorSkillFactor",
      label: "Operator skill factor",
      type: "number",
      unit: "dimensionless",
      required: true,
      smartDefault: 1,
      validation: { min: 0.8, max: 1.2 },
      helper: "Factor between 0.8 and 1.2",
      expertMeaning: "Operator skill factor",
    }
  ],

  formulaPipeline: [
    {
      formulaId: "cost.total_exposure",
      inputMap: {
        "a": "numberOfTools",
        "b": "numberOfFixtureChanges",
        "c": "baseTimePerTool"
      },
      outputId: "totalExposure",
    },
    {
      formulaId: "benchmark.variance_percent",
      inputMap: {
        "actual": "numberOfTools",
        "target": "numberOfFixtureChanges"
      },
      outputId: "variancePercent",
    }
  ],

  outputs: [
    {
      id: "totalExposure",
      label: "Total setup time",
      unit: "minutes",
      format: "currency",
      isBigNumber: true,
    },
    {
      id: "variancePercent",
      label: "Setup cost",
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
      "Standard element times are representative of typical operations",
      "Complexity factor accounts for tool variety and fixture complexity",
      "Operator skill factor reflects experience level",
    ],
  },
};
