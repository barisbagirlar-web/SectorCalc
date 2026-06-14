import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";

/** P7 nightrun — DeepSeek Chief Engineer schema (factory generated). */
export const RecipeCostCheck_SCHEMA: PremiumCalculatorSchema = {
  id: "recipe-cost-check",
  name: "Recipe Cost Check",
  sectorSlug: "general-industrial",
  category: "cost",
  painStatement: "Industrial engineering cost accounting",

  inputs: [
    {
      id: "productionQuantity",
      label: "Production quantity",
      type: "number",
      unit: "units",
      required: true,
      smartDefault: 100,
      validation: { min: 1, max: 1000000 },
      helper: "Must be positive integer",
      expertMeaning: "Production quantity",
    },
    {
      id: "unitMaterialCost",
      label: "Unit material cost",
      type: "number",
      unit: "USD",
      required: true,
      smartDefault: 10,
      validation: { min: 0, max: 100000 },
      helper: "Non-negative currency",
      expertMeaning: "Unit material cost",
    },
    {
      id: "scrapRatePercent",
      label: "Scrap rate",
      type: "number",
      unit: "%",
      required: true,
      smartDefault: 5,
      validation: { min: 0, max: 100, step: 0.1 },
      helper: "Percent between 0 and 100",
      expertMeaning: "Scrap rate",
    },
    {
      id: "laborCostPerUnit",
      label: "Labor cost per unit",
      type: "number",
      unit: "USD",
      required: true,
      smartDefault: 2,
      validation: { min: 0, max: 1000 },
      helper: "Non-negative currency",
      expertMeaning: "Labor cost per unit",
    },
    {
      id: "overheadCostPerUnit",
      label: "Overhead cost per unit",
      type: "number",
      unit: "USD",
      required: true,
      smartDefault: 1,
      validation: { min: 0, max: 1000 },
      helper: "Non-negative currency",
      expertMeaning: "Overhead cost per unit",
    },
    {
      id: "sellingPricePerUnit",
      label: "Selling price per unit",
      type: "number",
      unit: "USD",
      required: true,
      smartDefault: 15,
      validation: { min: 0, max: 100000 },
      helper: "Non-negative currency",
      expertMeaning: "Selling price per unit",
    }
  ],

  formulaPipeline: [
    {
      formulaId: "cost.total_exposure",
      inputMap: {
        "a": "productionQuantity",
        "b": "unitMaterialCost",
        "c": "scrapRatePercent"
      },
      outputId: "totalExposure",
    },
    {
      formulaId: "benchmark.variance_percent",
      inputMap: {
        "actual": "productionQuantity",
        "target": "unitMaterialCost"
      },
      outputId: "variancePercent",
    }
  ],

  outputs: [
    {
      id: "totalExposure",
      label: "Total cost per unit",
      unit: "USD",
      format: "currency",
      isBigNumber: true,
    },
    {
      id: "variancePercent",
      label: "Gross profit per unit",
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
      "Stable unit costs",
      "Declared scrap rate is representative",
      "No FX volatility",
    ],
  },
};
