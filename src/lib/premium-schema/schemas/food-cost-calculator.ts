import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";

/** P7 nightrun — DeepSeek Chief Engineer schema (factory generated). */
export const FoodCostCalculator_SCHEMA: PremiumCalculatorSchema = {
  id: "food-cost-calculator",
  name: "Food Cost Percentage",
  sectorSlug: "general-industrial",
  category: "cost",
  painStatement: "Industrial engineering cost accounting for food processing",

  inputs: [
    {
      id: "inputQuantity",
      label: "Input quantity",
      type: "number",
      unit: "units",
      required: true,
      smartDefault: 100,
      validation: { min: 0, max: 1000000 },
      helper: "Non-negative quantity",
      expertMeaning: "Input quantity",
    },
    {
      id: "outputQuantity",
      label: "Output quantity",
      type: "number",
      unit: "units",
      required: true,
      smartDefault: 90,
      validation: { min: 1, max: 1000000 },
      helper: "Positive quantity",
      expertMeaning: "Output quantity",
    },
    {
      id: "yieldPercent",
      label: "Yield percent",
      type: "number",
      unit: "%",
      required: true,
      smartDefault: 90,
      validation: { min: 1, max: 100, step: 0.1 },
      helper: "Percent between 1 and 100",
      expertMeaning: "Yield percent",
    },
    {
      id: "rawMaterialCost",
      label: "Raw material cost",
      type: "number",
      unit: "USD",
      required: true,
      smartDefault: 10,
      validation: { min: 0, max: 100000 },
      helper: "Non-negative cost",
      expertMeaning: "Raw material cost",
    },
    {
      id: "laborCost",
      label: "Labor cost",
      type: "number",
      unit: "USD",
      required: true,
      smartDefault: 5,
      validation: { min: 0, max: 100000 },
      helper: "Non-negative cost",
      expertMeaning: "Labor cost",
    },
    {
      id: "processingCost",
      label: "Processing cost",
      type: "number",
      unit: "USD",
      required: true,
      smartDefault: 3,
      validation: { min: 0, max: 100000 },
      helper: "Non-negative cost",
      expertMeaning: "Processing cost",
    }
  ],

  formulaPipeline: [
    {
      formulaId: "cost.total_exposure",
      inputMap: {
        "a": "inputQuantity",
        "b": "outputQuantity",
        "c": "yieldPercent"
      },
      outputId: "totalExposure",
    },
    {
      formulaId: "benchmark.variance_percent",
      inputMap: {
        "actual": "inputQuantity",
        "target": "outputQuantity"
      },
      outputId: "variancePercent",
    }
  ],

  outputs: [
    {
      id: "totalExposure",
      label: "Total raw material cost",
      unit: "USD",
      format: "currency",
      isBigNumber: true,
    },
    {
      id: "variancePercent",
      label: "Total processing cost",
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
      "All costs are in the same currency",
      "Yield percent is applied to output quantity to compute sellable units",
      "Waste cost is additive to processing cost",
    ],
  },
};
