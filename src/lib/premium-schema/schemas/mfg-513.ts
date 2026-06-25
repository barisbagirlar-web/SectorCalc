import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";

export const SIX_SIGMA_PROJECT_PRIORITIZER_SCHEMA: PremiumCalculatorSchema = {
  id: "mfg-513",
  name: "Six Sigma Project Selection and Investment Prioritization Calculator",
  sectorSlug: "manufacturing",
  category: "oee",
  legacyPaidSlug: "alti-sigma-proje-secimi-ve-yatirim-onceliklendirme-calculator",
  painStatement:
    "Evaluate and prioritize Six Sigma projects based on estimated return, success probability, duration, and cost.",

  inputs: [],

  outputs: [],

  thresholds: [
    {
      fieldId: "projectScore",
      warning: 20,
      critical: 10,
      direction: "lower_is_bad",
      warningMessage: "Project score is low. Consider focusing on quick wins instead of high-cost or long-duration projects.",
      criticalMessage: "Critically low score! Project cost and duration are too high relative to expected return. Reduce scope or cancel the project.",
    },
  ],

  reportTemplate: {
    title: "Six Sigma Project Prioritization Report",
    sections: [
      "executive_summary",
      "thresholds",
      "action_plan",
      "assumptions",
    ],
    exportFormats: ["pdf"],
  },

  assumptions: {
    hiddenLossMultiplier: 1.0,
    volatilityPercent: 0,
    targetMarginPercent: 0,
    assumptionNotes: [
      "Score = (Estimated Annual Savings x Success Probability) / (Duration x Resource Cost).",
      "Success probability is entered as a percentage but used as a decimal (e.g., 0.75) in calculations.",
      "Higher score indicates higher project priority.",
    ],
  },
};
