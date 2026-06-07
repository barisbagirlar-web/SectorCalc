import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";

export const AGRICULTURE_IRRIGATION_YIELD_LOSS_SCHEMA: PremiumCalculatorSchema = {
  id: "agriculture-irrigation-yield-loss",
  name: "Irrigation Yield Loss Analyzer",
  sectorSlug: "agriculture-crops",
  category: "benchmark",
  legacyPaidSlug: "crop-yield-loss-analyzer",
  painStatement:
    "Farms lose yield when irrigation cost, water deficit and expected tonnage are not measured together.",

  inputs: [
    {
      id: "areaHa",
      label: "Area",
      type: "number",
      unit: "ha",
      required: true,
      smartDefault: 18,
      validation: { min: 0 },
      helper: "Cultivated area in hectares.",
      expertMeaning: "Field area for yield loss calculation.",
    },
    {
      id: "expectedYieldTonPerHa",
      label: "Expected yield",
      type: "number",
      unit: "ton/ha",
      required: true,
      smartDefault: 7,
      validation: { min: 0 },
      helper: "Target yield per hectare for the season.",
      expertMeaning: "Plan or benchmark tonnage per hectare.",
    },
    {
      id: "actualYieldTonPerHa",
      label: "Actual yield",
      type: "number",
      unit: "ton/ha",
      required: true,
      smartDefault: 6.2,
      validation: { min: 0 },
      helper: "Observed or projected yield per hectare.",
      expertMeaning: "Current yield band before season close.",
    },
    {
      id: "pricePerTon",
      label: "Price per ton",
      type: "number",
      unit: "USD",
      required: true,
      smartDefault: 230,
      validation: { min: 0 },
      helper: "Market or contract price per ton.",
      expertMeaning: "Revenue rate applied to yield gap.",
    },
    {
      id: "irrigationCost",
      label: "Irrigation cost",
      type: "number",
      unit: "USD",
      required: true,
      smartDefault: 3400,
      validation: { min: 0 },
      helper: "Season irrigation energy and water spend.",
      expertMeaning: "Irrigation cost stacked with yield loss.",
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
      unit: "$",
      format: "currency",
      isBigNumber: true,
    },
    {
      id: "yieldLossRevenue",
      label: "Yield loss revenue",
      unit: "$",
      format: "currency",
    },
    {
      id: "irrigationCost",
      label: "Irrigation cost",
      unit: "$",
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
