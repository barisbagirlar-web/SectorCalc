import type { PremiumCalculatorSchema } from "@/lib/features/premium-schema/premium-calculator-schema";

export const QUOTE_PRICE_PROFIT_MARGIN_CALCULATOR_SCHEMA: PremiumCalculatorSchema = {
  id: "quote-price-profit-margin-calculator",
  name: "Quote Price and Profit Margin Calculator",
  sectorSlug: "manufacturing",
  category: "cost",
  painStatement:
    "Quotes often omit scrap, setup, payment-term cost and utility load before margin is locked.",

  inputs: [],

  outputs: [],

  thresholds: [
    {
      fieldId: "grossMarginRate",
      warning: 12,
      critical: 8,
      direction: "lower_is_bad",
      warningMessage:
        "Achieved margin is below a typical shop band - review waste, setup and payment-term lines before sending the quote.",
      criticalMessage:
        "Quoted margin is critically thin - reprice or remove discount before committing.",
    },
    {
      fieldId: "wasteRate",
      warning: 6,
      critical: 10,
      direction: "higher_is_bad",
      warningMessage: "Waste rate is elevated - confirm nesting, scrap and rework allowance.",
      criticalMessage: "Waste rate is very high - margin may be lost before production starts.",
    },
  ],

  reportTemplate: {
    title: "Quote Price and Margin Decision Report",
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
    hiddenLossMultiplier: 1.05,
    volatilityPercent: 8,
    targetMarginPercent: 18,
    assumptionNotes: [
      "Direct subtotal sums material, labor, machine, energy, overhead, setup, shipping and payment-term cost.",
      "Waste cost = direct subtotal × waste rate.",
      "Target sales price = total cost ÷ (1 − target margin rate).",
      "Minimum safe price adds the safety margin uplift to the target margin rate.",
      "Tax-included flag is informational only in this release.",
    ],
  },
};
