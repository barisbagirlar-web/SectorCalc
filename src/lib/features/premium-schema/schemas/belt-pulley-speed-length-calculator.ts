import type { PremiumCalculatorSchema } from "@/lib/features/premium-schema/premium-calculator-schema";

export const BELT_PULLEY_SPEED_LENGTH_CALCULATOR_SCHEMA: PremiumCalculatorSchema = {
  id: "belt-pulley-speed-length-calculator",
  name: "Belt Pulley Speed and Length Calculator",
  sectorSlug: "manufacturing",
  category: "measurement",
  painStatement:
    "Drive changes are sized from memory instead of documented speed and belt length.",

  inputs: [],

  outputs: [],

  thresholds: [
    {
      fieldId: "drivenRpm",
      warning: 3600,
      critical: 6000,
      direction: "higher_is_bad",
      warningMessage: "Driven speed is high — verify pulley rating and belt type.",
      criticalMessage: "Driven speed exceeds typical belt drive range — engineering review required.",
    },
  ],

  reportTemplate: {
    title: "Belt Drive Screening Summary",
    sections: ["executive_summary", "thresholds", "assumptions", "action_plan"],
    exportFormats: ["pdf"],
  },

  assumptions: {
    hiddenLossMultiplier: 1,
    volatilityPercent: 3,
    targetMarginPercent: 0,
    assumptionNotes: [
      "Open belt length uses standard center-distance approximation.",
      "Does not replace manufacturer belt selection or tension specs.",
      "Verify slip, wrap angle and service factors before installation.",
    ],
  },
};
