import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";

/** P7 nightrun — DeepSeek Chief Engineer schema (factory generated). */
export const OgrenmeEgrisiVePartiSureTahminCalculator_SCHEMA: PremiumCalculatorSchema = {
  id: "ogrenme-egrisi-ve-parti-sure-tahmin-calculator",
  name: "Ogrenme Egrisi Ve Parti Sure Tahmin",
  sectorSlug: "general-industrial",
  category: "cost",
  painStatement: "Industrial engineering learning curve theory (Wright's model)",

  inputs: [
    {
      id: "firstUnitTimeHours",
      label: "First unit time",
      type: "number",
      unit: "hours",
      required: true,
      smartDefault: 10,
      validation: { min: 0.01, max: 10000 },
      helper: "Must be positive hours",
      expertMeaning: "First unit time",
    },
    {
      id: "learningRatePercent",
      label: "Learning rate",
      type: "number",
      unit: "%",
      required: true,
      smartDefault: 80,
      validation: { min: 1, max: 99, step: 0.1 },
      helper: "Percent between 1 and 99",
      expertMeaning: "Learning rate",
    },
    {
      id: "batchQuantity",
      label: "Batch quantity",
      type: "number",
      unit: "units",
      required: true,
      smartDefault: 100,
      validation: { min: 1, max: 1000000 },
      helper: "Must be positive integer",
      expertMeaning: "Batch quantity",
    },
    {
      id: "hourlyLaborRate",
      label: "Hourly labor rate",
      type: "number",
      unit: "USD",
      required: true,
      smartDefault: 25,
      validation: { min: 0, max: 1000 },
      helper: "Non-negative currency",
      expertMeaning: "Hourly labor rate",
    },
    {
      id: "unitMaterialCost",
      label: "Unit material cost",
      type: "number",
      unit: "USD",
      required: true,
      smartDefault: 5,
      validation: { min: 0, max: 100000 },
      helper: "Non-negative currency",
      expertMeaning: "Unit material cost",
    },
    {
      id: "overheadRatePercent",
      label: "Overhead rate",
      type: "number",
      unit: "%",
      required: true,
      smartDefault: 50,
      validation: { min: 0, max: 200, step: 0.1 },
      helper: "Percent between 0 and 200",
      expertMeaning: "Overhead rate",
    }
  ],

  formulaPipeline: [
    {
      formulaId: "cost.total_exposure",
      inputMap: {
        "a": "firstUnitTimeHours",
        "b": "learningRatePercent",
        "c": "batchQuantity"
      },
      outputId: "totalExposure",
    },
    {
      formulaId: "benchmark.variance_percent",
      inputMap: {
        "actual": "firstUnitTimeHours",
        "target": "learningRatePercent"
      },
      outputId: "variancePercent",
    }
  ],

  outputs: [
    {
      id: "totalExposure",
      label: "Total batch time",
      unit: "hours",
      format: "currency",
      isBigNumber: true,
    },
    {
      id: "variancePercent",
      label: "Average time per unit",
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
      "Learning follows Wright's cumulative average model",
      "Learning rate is constant across the batch",
      "Labor rate, material cost, and overhead rate are constant",
    ],
  },
};
