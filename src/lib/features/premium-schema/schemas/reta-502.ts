import type { PremiumCalculatorSchema } from "@/lib/features/premium-schema/premium-calculator-schema";

export const RETAIL_INVENTORY_TURNOVER_RISK_SCHEMA: PremiumCalculatorSchema = {
  id: "reta-502",
  name: "Retail Inventory Turnover Risk Calculator",
  sectorSlug: "retail",
  category: "benchmark",
  legacyPaidSlug: "water-optimization-verdict",
  painStatement:
    "Retailers lose cash when slow inventory, markdowns and carrying cost are not measured together.",

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
