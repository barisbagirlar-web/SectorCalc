import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";

export const OEE_EQUIPMENT_EFFECTIVENESS_CALCULATOR_SCHEMA: PremiumCalculatorSchema = {
  id: "mfg-507",
  name: "OEE Calculator",
  sectorSlug: "manufacturing",
  category: "oee",
  painStatement:
    "Without OEE tracking, chronic downtime and quality loss stay invisible.",

  inputs: [],

  outputs: [],

  thresholds: [
    {
      fieldId: "oeeScore",
      warning: 65,
      critical: 50,
      direction: "lower_is_bad",
      warningMessage: "OEE is below world-class band — investigate downtime and quality losses.",
      criticalMessage: "OEE is critically low — margin may be lost before quotes are repriced.",
    },
  ],

  reportTemplate: {
    title: "OEE Equipment Effectiveness Decision Report",
    sections: ["executive_summary", "thresholds", "sensitivity", "action_plan", "assumptions"],
    exportFormats: ["pdf", "csv"],
  },

  assumptions: {
    hiddenLossMultiplier: 1.05,
    volatilityPercent: 8,
    targetMarginPercent: 15,
    assumptionNotes: [
      "OEE = availability × performance × quality.",
      "Availability loss cost uses machine rate and downtime hours.",
    ],
  },
};
