import type { PremiumCalculatorSchema } from "@/lib/features/premium-schema/premium-calculator-schema";

export const WELDED_BOLTED_CONNECTION_CALCULATOR_SCHEMA: PremiumCalculatorSchema = {
  id: "mfg-516",
  name: "Welded and Bolted Connection Calculator",
  sectorSlug: "manufacturing",
  category: "measurement",
  painStatement:
    "Connection sizing relies on guesswork without quick structural checks.",

  inputs: [],

  outputs: [],

  thresholds: [
    {
      fieldId: "weldCapacity",
      warning: 50000,
      critical: 25000,
      direction: "lower_is_bad",
      warningMessage: "Weld capacity index is low for the entered geometry - review throat and length.",
      criticalMessage: "Weld capacity index is critically low - obtain qualified engineering review.",
    },
  ],

  reportTemplate: {
    title: "Welded and Bolted Connection Screening Report",
    sections: ["executive_summary", "thresholds", "assumptions", "action_plan"],
    exportFormats: ["pdf", "csv"],
  },

  assumptions: {
    hiddenLossMultiplier: 1,
    volatilityPercent: 5,
    targetMarginPercent: 0,
    assumptionNotes: [
      "Weld capacity index = throat × length × allowable stress ÷ safety factor.",
      "Bolt capacity index uses circular area × bolt count × allowable stress ÷ safety factor.",
      "Screening calculation only - not structural code compliance or engineering sign-off.",
    ],
  },
};
