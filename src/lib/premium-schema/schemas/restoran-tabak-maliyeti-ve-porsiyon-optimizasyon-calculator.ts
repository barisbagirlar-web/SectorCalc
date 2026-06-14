import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";

/** P7 nightrun — DeepSeek Chief Engineer schema (factory generated). */
export const RestoranTabakMaliyetiVePorsiyonOptimizasyonCalculator_SCHEMA: PremiumCalculatorSchema = {
  id: "restoran-tabak-maliyeti-ve-porsiyon-optimizasyon-calculator",
  name: "Restoran Tabak Maliyeti Ve Porsiyon Optimizasyon",
  sectorSlug: "general-industrial",
  category: "cost",
  painStatement: "Standard food cost accounting and yield management",

  inputs: [
    {
      id: "ingredientCostPerPortion",
      label: "Ingredient cost per portion",
      type: "number",
      unit: "USD",
      required: true,
      smartDefault: 5,
      validation: { min: 0, max: 1000 },
      helper: "Non-negative currency value",
      expertMeaning: "Ingredient cost per portion",
    },
    {
      id: "yieldLossRate",
      label: "Yield loss rate",
      type: "number",
      unit: "%",
      required: true,
      smartDefault: 10,
      validation: { min: 0, max: 100, step: 0.1 },
      helper: "Percent between 0 and 100",
      expertMeaning: "Yield loss rate",
    },
    {
      id: "laborCostPerHour",
      label: "Labor cost per hour",
      type: "number",
      unit: "USD",
      required: true,
      smartDefault: 20,
      validation: { min: 0, max: 500 },
      helper: "Non-negative currency value",
      expertMeaning: "Labor cost per hour",
    },
    {
      id: "portionsPerHour",
      label: "Portions produced per hour",
      type: "number",
      unit: "portions",
      required: true,
      smartDefault: 30,
      validation: { min: 1, max: 1000 },
      helper: "Positive integer",
      expertMeaning: "Portions produced per hour",
    },
    {
      id: "overheadRate",
      label: "Overhead rate",
      type: "number",
      unit: "%",
      required: true,
      smartDefault: 15,
      validation: { min: 0, max: 100, step: 0.1 },
      helper: "Percent between 0 and 100",
      expertMeaning: "Overhead rate",
    },
    {
      id: "sellingPrice",
      label: "Selling price per portion",
      type: "number",
      unit: "USD",
      required: true,
      smartDefault: 15,
      validation: { min: 0.01, max: 10000 },
      helper: "Positive currency value",
      expertMeaning: "Selling price per portion",
    }
  ],

  formulaPipeline: [
    {
      formulaId: "cost.total_exposure",
      inputMap: {
        "a": "ingredientCostPerPortion",
        "b": "yieldLossRate",
        "c": "laborCostPerHour"
      },
      outputId: "totalExposure",
    },
    {
      formulaId: "benchmark.variance_percent",
      inputMap: {
        "actual": "ingredientCostPerPortion",
        "target": "yieldLossRate"
      },
      outputId: "variancePercent",
    }
  ],

  outputs: [
    {
      id: "totalExposure",
      label: "Total plate cost",
      unit: "USD",
      format: "currency",
      isBigNumber: true,
    },
    {
      id: "variancePercent",
      label: "Actual margin percent",
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
      "Ingredient costs are stable and per portion",
      "Yield loss rate is representative of kitchen waste",
      "Labor cost per hour includes all wages and benefits",
    ],
  },
};
