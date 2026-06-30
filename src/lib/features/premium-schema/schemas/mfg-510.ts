import type { PremiumCalculatorSchema } from "@/lib/features/premium-schema/premium-calculator-schema";

export const QUALITY_COST_PAF_CALCULATOR_SCHEMA: PremiumCalculatorSchema = {
  id: "mfg-510",
  name: "Quality Cost PAF Calculator",
  sectorSlug: "manufacturing",
  category: "cost",
  painStatement:
    "Quality budgets hide prevention and appraisal spend until failure costs spike.",

  inputs: [],

  outputs: [],

  thresholds: [
    {
      fieldId: "qualityCostPercent",
      warning: 4,
      critical: 8,
      direction: "higher_is_bad",
      warningMessage: "Quality cost ratio is elevated — review failure drivers.",
      criticalMessage: "Quality cost ratio is critical — prioritize failure reduction projects.",
    },
  ],

  reportTemplate: {
    title: "Quality Cost PAF Decision Report",
    sections: ["executive_summary", "loss_breakdown", "thresholds", "action_plan"],
    exportFormats: ["pdf", "csv"],
  },

  assumptions: {
    hiddenLossMultiplier: 1,
    volatilityPercent: 5,
    targetMarginPercent: 0,
    assumptionNotes: [
      "Total quality cost = prevention + appraisal + failure.",
      "Quality cost % = total quality cost ÷ revenue × 100.",
      "PAF classification is informational — align buckets with your finance policy.",
    ],
  },
};
