import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";

export const INVENTORY_CARRYING_COST_EOQ_CALCULATOR_SCHEMA: PremiumCalculatorSchema = {
  id: "logi-501",
  name: "Inventory Carrying Cost and EOQ Calculator",
  sectorSlug: "logistics-transport",
  category: "benchmark",
  painStatement:
    "Inventory cost is underestimated when only warehouse rent is counted.",

  inputs: [],

  outputs: [],

  thresholds: [
    {
      fieldId: "annualCarryingCost",
      warning: 8000,
      critical: 20000,
      direction: "higher_is_bad",
      warningMessage: "Carrying cost is elevated — review order size and slow movers.",
      criticalMessage: "Carrying cost is very high — reduce average inventory before reordering.",
    },
  ],

  reportTemplate: {
    title: "Inventory EOQ and Carrying Cost Decision Report",
    sections: ["executive_summary", "thresholds", "sensitivity", "action_plan", "assumptions"],
    exportFormats: ["pdf", "csv"],
  },

  assumptions: {
    hiddenLossMultiplier: 1.03,
    volatilityPercent: 8,
    targetMarginPercent: 0,
    assumptionNotes: [
      "EOQ = √(2 × annual demand × order cost ÷ holding cost per unit).",
      "Holding cost per unit = unit cost × carrying cost rate.",
      "Average inventory assumed at EOQ ÷ 2 for carrying cost estimate.",
    ],
  },
};
