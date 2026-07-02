import type { PremiumCalculatorSchema } from "@/lib/features/premium-schema/premium-calculator-schema";

export const PRODUCT_CUSTOMER_PROFITABILITY_CALCULATOR_SCHEMA: PremiumCalculatorSchema = {
  id: "product-customer-profitability-calculator",
  name: "Product and Customer Profitability Calculator",
  sectorSlug: "retail",
  category: "cost",
  painStatement:
    "High-revenue customers can destroy margin through returns, delays and rework.",

  inputs: [],

  outputs: [],

  thresholds: [
    {
      fieldId: "contributionMarginRate",
      warning: 12,
      critical: 5,
      direction: "lower_is_bad",
      warningMessage: "Contribution margin is thin after service and returns - review account terms.",
      criticalMessage: "Customer or SKU may be margin-negative - reprice or reduce service load.",
    },
  ],

  reportTemplate: {
    title: "Product and Customer Profitability Decision Report",
    sections: ["executive_summary", "loss_breakdown", "thresholds", "action_plan", "assumptions"],
    exportFormats: ["pdf", "csv"],
  },

  assumptions: {
    hiddenLossMultiplier: 1.04,
    volatilityPercent: 9,
    targetMarginPercent: 15,
    assumptionNotes: [
      "Loaded cost = direct cost + service cost + returns cost.",
      "Contribution = revenue − loaded cost.",
      "Margin rate = contribution ÷ revenue.",
    ],
  },
};
