import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";

/** P7 nightrun — DeepSeek Chief Engineer schema (factory generated). */
export const BatchYieldCalculator_SCHEMA: PremiumCalculatorSchema = {
  id: "batch-yield-calculator",
  name: "Batch Yield Calculator",
  sectorSlug: "general-industrial",
  category: "cost",
  painStatement: "Food processing cost accounting and yield management",

  inputs: [
    {
      id: "inputQuantity",
      label: "Input quantity",
      type: "number",
      unit: "kg",
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
      unit: "kg",
      required: true,
      smartDefault: 90,
      validation: { min: 0, max: 1000000 },
      helper: "Non-negative quantity",
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
      helper: "Between 1 and 100",
      expertMeaning: "Yield percent",
    },
    {
      id: "rawMaterialCost",
      label: "Raw material cost per unit",
      type: "number",
      unit: "USD",
      required: true,
      smartDefault: 5,
      validation: { min: 0, max: 100000 },
      helper: "Non-negative cost",
      expertMeaning: "Raw material cost per unit",
    },
    {
      id: "laborCost",
      label: "Labor cost per batch",
      type: "number",
      unit: "USD",
      required: true,
      smartDefault: 50,
      validation: { min: 0, max: 100000 },
      helper: "Non-negative cost",
      expertMeaning: "Labor cost per batch",
    },
    {
      id: "processingCost",
      label: "Processing cost per batch",
      type: "number",
      unit: "USD",
      required: true,
      smartDefault: 30,
      validation: { min: 0, max: 100000 },
      helper: "Non-negative cost",
      expertMeaning: "Processing cost per batch",
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
      label: "Total batch cost",
      unit: "USD",
      format: "currency",
      isBigNumber: true,
    },
    {
      id: "variancePercent",
      label: "Cost per sellable unit",
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
      "All costs are in same currency",
      "Batch size is integer",
      "Yield percent is applied to output quantity",
    ],
  },
};
