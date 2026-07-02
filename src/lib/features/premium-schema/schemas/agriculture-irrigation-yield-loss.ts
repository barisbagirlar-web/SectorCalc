import type { PremiumCalculatorSchema } from "@/lib/features/premium-schema/premium-calculator-schema";

export const AGRICULTURE_IRRIGATION_YIELD_LOSS_SCHEMA: PremiumCalculatorSchema = {
  id: "agriculture-irrigation-yield-loss",
  name: "Irrigation Yield Loss Calculator",
  sectorSlug: "agriculture-crops",
  category: "benchmark",
  legacyPaidSlug: "crop-yield-loss-analyzer",
  painStatement:
    "Farms lose yield when irrigation cost, water deficit and expected tonnage are not measured together.",

  inputs: [],

  outputs: [],

  thresholds: [
    {
      fieldId: "totalExposure",
      warning: 3000,
      critical: 8000,
      direction: "higher_is_bad",
      warningMessage:
        "Combined yield and irrigation exposure is building - review water schedule and crop forecast.",
      criticalMessage:
        "Critical yield loss exposure - irrigation spend may not be recovered at current tonnage.",
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
