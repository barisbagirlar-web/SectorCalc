import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";

export const DAIRY_PROFIT_DETECTOR_SCHEMA: PremiumCalculatorSchema = {
  id: "dair-502",
  name: "Dairy Profit Detector",
  sectorSlug: "dairy",
  category: "benchmark",
  legacyPaidSlug: "dairy-profit-detector",
  painStatement:
    "Detect dairy profit leaks with full cost stack verdict.",

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
