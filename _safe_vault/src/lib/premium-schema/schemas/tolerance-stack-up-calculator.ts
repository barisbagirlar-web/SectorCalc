import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";

export const TOLERANCE_STACK_UP_CALCULATOR_SCHEMA: PremiumCalculatorSchema = {
  id: "tolerance-stack-up-calculator",
  name: "Tolerance Stack-Up Calculator",
  sectorSlug: "manufacturing",
  category: "calibration",
  painStatement:
    "Fit issues often come from stacked tolerances without a documented chain check.",

  inputs: [],

  outputs: [],

  thresholds: [
    {
      fieldId: "worstCaseClearance",
      warning: 0.05,
      critical: 0,
      direction: "lower_is_bad",
      warningMessage: "Worst-case stack is close to the assembly limit — review driving tolerances.",
      criticalMessage: "Worst-case stack exceeds assembly limit — adjust tolerances before build.",
    },
  ],

  reportTemplate: {
    title: "Tolerance Stack-Up Decision Report",
    sections: ["executive_summary", "thresholds", "sensitivity", "action_plan", "assumptions"],
    exportFormats: ["pdf", "csv"],
  },

  assumptions: {
    hiddenLossMultiplier: 1,
    volatilityPercent: 5,
    targetMarginPercent: 0,
    assumptionNotes: [
      "Worst-case stack = sum of four tolerance contributions.",
      "RSS stack = √(t1² + t2² + t3² + t4²).",
      "Worst-case clearance = assembly limit − worst-case stack.",
    ],
  },
};
