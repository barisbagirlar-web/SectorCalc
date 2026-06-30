import type { PremiumCalculatorSchema } from "@/lib/features/premium-schema/premium-calculator-schema";

export const DAIRY_FEED_EFFICIENCY_LOSS_SCHEMA: PremiumCalculatorSchema = {
  id: "dair-501",
  name: "Dairy Feed Efficiency Loss Calculator",
  sectorSlug: "dairy",
  category: "benchmark",
  legacyPaidSlug: "feed-efficiency-analyzer",
  painStatement:
    "Dairy farms lose margin when feed cost rises faster than milk yield.",

  inputs: [],

  outputs: [],

  thresholds: [
    {
      fieldId: "milkLitersPerCowPerDay",
      warning: 22,
      critical: 18,
      direction: "lower_is_bad",
      warningMessage: "Milk yield is below target band — feed efficiency pressure is building.",
      criticalMessage: "Critical yield gap — feed cost may exceed milk revenue recovery.",
    },
  ],

  reportTemplate: {
    title: "Dairy Feed Efficiency Loss Decision Report",
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
    hiddenLossMultiplier: 1.07,
    volatilityPercent: 18,
    targetMarginPercent: 12,
    assumptionNotes: [
      "Feed cost = cows × daily feed × days.",
      "Milk revenue gap = yield shortfall × price × days × herd size.",
      "Total exposure combines feed spend and unrealized milk revenue.",
    ],
  },
};
