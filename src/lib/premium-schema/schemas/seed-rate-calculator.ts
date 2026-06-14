import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";

/** P7 nightrun — DeepSeek Chief Engineer schema (factory generated). */
export const SeedRateCalculator_SCHEMA: PremiumCalculatorSchema = {
  id: "seed-rate-calculator",
  name: "Seed Rate Calculator",
  sectorSlug: "general-industrial",
  category: "cost",
  painStatement: "Agronomic seeding rate standards (FAO, ISTA)",

  inputs: [
    {
      id: "targetPlantPopulation",
      label: "Target plant population",
      type: "number",
      unit: "plants/ha",
      required: true,
      smartDefault: 50000,
      validation: { min: 1, max: 10000000 },
      helper: "Must be positive integer",
      expertMeaning: "Target plant population",
    },
    {
      id: "germinationRate",
      label: "Germination rate",
      type: "number",
      unit: "%",
      required: true,
      smartDefault: 90,
      validation: { min: 0.1, max: 100, step: 0.1 },
      helper: "Percent between 0.1 and 100",
      expertMeaning: "Germination rate",
    },
    {
      id: "emergenceFactor",
      label: "Emergence factor",
      type: "number",
      unit: "%",
      required: true,
      smartDefault: 85,
      validation: { min: 0.1, max: 100, step: 0.1 },
      helper: "Percent between 0.1 and 100",
      expertMeaning: "Emergence factor",
    },
    {
      id: "thousandSeedWeight",
      label: "Thousand seed weight",
      type: "number",
      unit: "g",
      required: true,
      smartDefault: 40,
      validation: { min: 0.1, max: 10000 },
      helper: "Must be positive",
      expertMeaning: "Thousand seed weight",
    },
    {
      id: "fieldLossPercent",
      label: "Field loss percentage",
      type: "number",
      unit: "%",
      required: true,
      smartDefault: 5,
      validation: { min: 0, max: 50, step: 0.1 },
      helper: "Percent between 0 and 50",
      expertMeaning: "Field loss percentage",
    }
  ],

  formulaPipeline: [
    {
      formulaId: "cost.total_exposure",
      inputMap: {
        "a": "targetPlantPopulation",
        "b": "germinationRate",
        "c": "emergenceFactor"
      },
      outputId: "totalExposure",
    },
    {
      formulaId: "benchmark.variance_percent",
      inputMap: {
        "actual": "targetPlantPopulation",
        "target": "germinationRate"
      },
      outputId: "variancePercent",
    }
  ],

  outputs: [
    {
      id: "totalExposure",
      label: "Seed rate",
      unit: "kg/ha",
      format: "currency",
      isBigNumber: true,
    },
    {
      id: "variancePercent",
      label: "Seeds per meter row",
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
      "Uniform seed distribution",
      "Stable field conditions",
      "Seed weight is constant",
    ],
  },
};
