import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";

/** P7 nightrun — DeepSeek Chief Engineer schema (factory generated). */
export const BreakEvenCalculator_SCHEMA: PremiumCalculatorSchema = {
  id: "break-even-calculator",
  name: "Break-Even Calculator",
  sectorSlug: "general-industrial",
  category: "cost",
  painStatement: "Cost-volume-profit (CVP) analysis from managerial accounting",

  inputs: [
    {
      id: "sellingPricePerUnit",
      label: "Selling price per unit",
      type: "number",
      unit: "USD",
      required: true,
      smartDefault: 50,
      validation: { min: 0.01, max: 1000000 },
      helper: "Must be positive currency amount",
      expertMeaning: "Selling price per unit",
    },
    {
      id: "variableCostPerUnit",
      label: "Variable cost per unit",
      type: "number",
      unit: "USD",
      required: true,
      smartDefault: 30,
      validation: { min: 0, max: 1000000 },
      helper: "Non-negative currency",
      expertMeaning: "Variable cost per unit",
    },
    {
      id: "fixedCosts",
      label: "Total fixed costs",
      type: "number",
      unit: "USD",
      required: true,
      smartDefault: 10000,
      validation: { min: 0, max: 100000000 },
      helper: "Non-negative currency",
      expertMeaning: "Total fixed costs",
    },
    {
      id: "actualSales",
      label: "Actual sales revenue",
      type: "number",
      unit: "USD",
      required: true,
      smartDefault: 20000,
      validation: { min: 0, max: 100000000 },
      helper: "Non-negative currency",
      expertMeaning: "Actual sales revenue",
    }
  ],

  formulaPipeline: [
    {
      formulaId: "cost.total_exposure",
      inputMap: {
        "a": "sellingPricePerUnit",
        "b": "variableCostPerUnit",
        "c": "fixedCosts"
      },
      outputId: "totalExposure",
    },
    {
      formulaId: "benchmark.variance_percent",
      inputMap: {
        "actual": "sellingPricePerUnit",
        "target": "variableCostPerUnit"
      },
      outputId: "variancePercent",
    }
  ],

  outputs: [
    {
      id: "totalExposure",
      label: "Break-even quantity",
      unit: "units",
      format: "currency",
      isBigNumber: true,
    },
    {
      id: "variancePercent",
      label: "Break-even revenue",
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
      "All costs are linear within relevant range",
      "Selling price per unit is constant",
      "Variable cost per unit is constant",
    ],
  },
};
