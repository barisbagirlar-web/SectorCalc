import type { PremiumCalculatorSchema } from "@/lib/features/premium-schema/premium-calculator-schema";

export const INVESTMENT_PAYBACK_NPV_CALCULATOR_SCHEMA: PremiumCalculatorSchema = {
  id: "investment-payback-npv-calculator",
  name: "Investment Payback and NPV Calculator",
  sectorSlug: "finance-hr",
  category: "cost",
  painStatement:
    "Capital requests often show payback without discount rate or horizon context.",

  inputs: [],

  outputs: [],

  thresholds: [
    {
      fieldId: "npv",
      warning: 0,
      critical: -25000,
      direction: "lower_is_bad",
      warningMessage: "NPV is near zero - sensitivity to cash flow and rate is high.",
      criticalMessage: "NPV is deeply negative - investment case is weak under these inputs.",
    },
  ],

  reportTemplate: {
    title: "Investment Screening Summary",
    sections: ["executive_summary", "thresholds", "assumptions", "action_plan"],
    exportFormats: ["pdf"],
  },

  assumptions: {
    hiddenLossMultiplier: 1,
    volatilityPercent: 8,
    targetMarginPercent: 0,
    assumptionNotes: [
      "NPV uses equal annual cash flows and a fixed discount rate.",
      "Payback ignores discounting.",
      "Not financial advice - verify tax, salvage and ramp-up effects separately.",
    ],
  },
};
