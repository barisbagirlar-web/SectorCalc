import type { PremiumCalculatorSchema } from "@/lib/features/premium-schema/premium-calculator-schema";

export const SHOP_RATE_HOURLY_COST_CALCULATOR_SCHEMA: PremiumCalculatorSchema = {
  id: "shop-rate-hourly-cost-calculator",
  name: "Machine Hour Rate Calculator",
  sectorSlug: "manufacturing",
  category: "cost",
  painStatement:
    "Most shops estimate shop rate from labor and power only, understating true hourly burden.",

  inputs: [],

  outputs: [],

  thresholds: [
    {
      fieldId: "hourlyRate",
      warning: 45,
      critical: 30,
      direction: "lower_is_bad",
      warningMessage: "Shop rate may be below loaded cost — verify fixed allocation and hours.",
      criticalMessage: "Hourly rate is critically low — reprice jobs before quoting.",
    },
  ],

  reportTemplate: {
    title: "Machine Hour Rate Decision Report",
    sections: ["executive_summary", "loss_breakdown", "thresholds", "action_plan", "assumptions"],
    exportFormats: ["pdf", "csv"],
  },

  assumptions: {
    hiddenLossMultiplier: 1.03,
    volatilityPercent: 6,
    targetMarginPercent: 15,
    assumptionNotes: [
      "Hourly rate = fixed monthly cost ÷ machine hours + variable cost per hour.",
      "Fixed envelope should include depreciation and floor-space share.",
    ],
  },
};
