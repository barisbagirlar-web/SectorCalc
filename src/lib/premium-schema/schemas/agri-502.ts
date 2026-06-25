import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";

export const CROP_YIELD_LOSS_ANALYZER_SCHEMA: PremiumCalculatorSchema = {
  id: "agri-502",
  name: "Crop Yield Loss Analyzer",
  sectorSlug: "agriculture-crops",
  category: "benchmark",
  legacyPaidSlug: "crop-yield-loss-analyzer",
  painStatement:
    "Model moisture, weather and input cost leaks with yield verdict.",

  inputs: [
    {
      id: "areaHa",
      label: "Area",
      type: "number",
      unit: "hectare",
      required: true,
      smartDefault: 18,
      validation: { min: 0 },
      helper: "Please enter a valid value.",
      expertMeaning: "Parameter value complies with industrial calculation standards.",
    },
    {
      id: "expectedYieldTonPerHa",
      label: "Expected yield",
      type: "number",
      unit: "ton/ha",
      required: true,
      smartDefault: 7,
      validation: { min: 0 },
      helper: "Please enter a valid value.",
      expertMeaning: "Parameter value complies with industrial calculation standards.",
    },
    {
      id: "actualYieldTonPerHa",
      label: "Actual yield",
      type: "number",
      unit: "ton/ha",
      required: true,
      smartDefault: 6.2,
      validation: { min: 0 },
      helper: "Please enter a valid value.",
      expertMeaning: "Parameter value complies with industrial calculation standards.",
    },
    {
      id: "pricePerTon",
      label: "Price per ton",
      type: "number",
      unit: "USD",
      required: true,
      smartDefault: 230,
      validation: { min: 0 },
      helper: "Please enter a valid value.",
      expertMeaning: "Parameter value complies with industrial calculation standards.",
    },
    {
      id: "irrigationCost",
      label: "Irrigation cost",
      type: "number",
      unit: "USD",
      required: true,
      smartDefault: 3400,
      validation: { min: 0 },
      helper: "Please enter a valid value.",
      expertMeaning: "Parameter value complies with industrial calculation standards.",
    },
  ],

  formulaPipeline: [
    {
      formulaId: "agriculture.yield_loss_revenue",
      inputMap: {
        areaHa: "areaHa",
        expectedYieldTonPerHa: "expectedYieldTonPerHa",
        actualYieldTonPerHa: "actualYieldTonPerHa",
        pricePerTon: "pricePerTon",
      },
      outputId: "yieldLossRevenue",
    },
    {
      formulaId: "cost.total2",
      inputMap: {
        a: "yieldLossRevenue",
        b: "irrigationCost",
      },
      outputId: "totalExposure",
    },
    {
      formulaId: "cost.value",
      inputMap: { value: "irrigationCost" },
      outputId: "irrigationCost",
    },
  ],

  outputs: [
    {
      id: "totalExposure",
      label: "Total yield loss exposure",
      unit: "USD",
      format: "currency",
      isBigNumber: true,
    },
    {
      id: "yieldLossRevenue",
      label: "Yield loss revenue",
      unit: "USD",
      format: "currency",
    },
    {
      id: "irrigationCost",
      label: "Irrigation cost",
      unit: "USD",
      format: "currency",
    },
  ],

  thresholds: [
    {
      fieldId: "totalExposure",
      warning: 3000,
      critical: 8000,
      direction: "higher_is_bad",
      warningMessage:
        "Combined yield and irrigation exposure is building — review water schedule and crop forecast.",
      criticalMessage:
        "Critical yield loss exposure — irrigation spend may not be recovered at current tonnage.",
    },
  ],

  reportTemplate: {
    title: "Irrigation Yield Loss Decision Report",
    sections: [
      "executive_summary",
      "loss_breakdown",
      "thresholds",
      "sensitivity",
      "action_plan",
      "assumptions",
    ],
    exportFormats: ["pdf", "csv"],
  },

  assumptions: {
    hiddenLossMultiplier: 1.09,
    volatilityPercent: 16,
    targetMarginPercent: 12,
    assumptionNotes: [
      "Yield loss revenue = area × max(expected − actual yield, 0) × price per ton.",
      "Total exposure sums yield loss revenue and irrigation cost.",
      "Irrigation cost is not double-counted in yield gap calculation.",
    ],
  },
};
