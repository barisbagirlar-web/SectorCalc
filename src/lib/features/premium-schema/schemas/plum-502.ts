import type { PremiumCalculatorSchema } from "@/lib/features/premium-schema/premium-calculator-schema";

export const PLUMBING_LEAK_CALLBACK_COST_SCHEMA: PremiumCalculatorSchema = {
  id: "plum-502",
  name: "Plumbing Leak Callback Cost Calculator",
  sectorSlug: "plumbing",
  category: "cost",
  legacyPaidSlug: "plumbing-job-margin-verdict",
  painStatement:
    "Plumbing jobs lose margin when leak callback, material runs and warranty visits are not priced.",

  inputs: [],

  outputs: [],

  thresholds: [
    {
      fieldId: "callbackVisits",
      warning: 2,
      critical: 5,
      direction: "higher_is_bad",
      warningMessage: "Callback visits are elevated - verify leak risk and warranty terms.",
      criticalMessage: "Critical callback count - reprice fixed-price plumbing work.",
    },
    {
      fieldId: "warrantyReservePercent",
      warning: 3,
      critical: 8,
      direction: "higher_is_bad",
      warningMessage: "Warranty reserve is above typical band.",
      criticalMessage: "Critical warranty exposure - margin may not cover return visits.",
    },
  ],

  reportTemplate: {
    title: "Plumbing Leak Callback Cost Decision Report",
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
    hiddenLossMultiplier: 1.08,
    volatilityPercent: 12,
    targetMarginPercent: 25,
    assumptionNotes: [
      "Callback cost = visits × cost per visit.",
      "Warranty reserve = job revenue × warranty percent.",
      "Total exposure sums callbacks, material runs and warranty reserve.",
    ],
  },
};
