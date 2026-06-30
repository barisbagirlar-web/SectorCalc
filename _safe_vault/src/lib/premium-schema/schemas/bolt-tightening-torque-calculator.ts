import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";

export const BOLT_TIGHTENING_TORQUE_CALCULATOR_SCHEMA: PremiumCalculatorSchema = {
  id: "bolt-tightening-torque-calculator",
  name: "Bolt Tightening Torque Calculator",
  sectorSlug: "manufacturing",
  category: "measurement",
  painStatement:
    "Assembly teams guess torque without a documented clamp-force method.",

  inputs: [],

  outputs: [],

  thresholds: [
    {
      fieldId: "torqueNm",
      warning: 80,
      critical: 200,
      direction: "higher_is_bad",
      warningMessage: "Torque estimate is high — verify lubrication and tool calibration.",
      criticalMessage: "Torque estimate exceeds typical hand-tool range — use controlled tightening procedure.",
    },
  ],

  reportTemplate: {
    title: "Bolt Tightening Torque Decision Report",
    sections: ["executive_summary", "thresholds", "assumptions", "action_plan"],
    exportFormats: ["pdf", "csv"],
  },

  assumptions: {
    hiddenLossMultiplier: 1,
    volatilityPercent: 5,
    targetMarginPercent: 0,
    assumptionNotes: [
      "Torque ≈ clamp force × bolt diameter × friction factor (screening model).",
      "Verify against OEM torque tables and lubricant specification.",
      "Not a substitute for qualified fastening procedure or joint testing.",
    ],
  },
};
