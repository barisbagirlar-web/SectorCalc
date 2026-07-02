import type { PremiumCalculatorSchema } from "@/lib/features/premium-schema/premium-calculator-schema";

export const WATER_OPTIMIZATION_VERDICT_SCHEMA: PremiumCalculatorSchema = {
  id: "reta-503",
  name: "Water Efficiency Verdict",
  sectorSlug: "retail",
  category: "benchmark",
  legacyPaidSlug: "water-optimization-verdict",
  painStatement:
    "Find minimum viable irrigation spend with efficiency verdict.",

  inputs: [],

  outputs: [],

  thresholds: [
    {
      fieldId: "turnover",
      warning: 3,
      critical: 1,
      direction: "lower_is_bad",
      warningMessage: "Turnover is below healthy band — carrying cost pressure is building.",
      criticalMessage: "Critical slow inventory — markdown and cash tie-up risk is high.",
    },
  ],

  reportTemplate: {
    title: "Retail Inventory Turnover Risk Decision Report",
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
    hiddenLossMultiplier: 1.06,
    volatilityPercent: 12,
    targetMarginPercent: 25,
    assumptionNotes: [
      "Turnover = annual COGS ÷ average inventory.",
      "Carrying and markdown exposure apply percent to inventory value.",
      "Total exposure sums carrying cost and markdown exposure.",
    ],
  },
};
