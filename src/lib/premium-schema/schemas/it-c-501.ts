import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";

export const CLOUD_API_COST_OVERRUN_SCHEMA: PremiumCalculatorSchema = {
  id: "it-c-501",
  name: "Cloud API Cost Overrun Calculator",
  sectorSlug: "it-cloud",
  category: "cost",
  legacyPaidSlug: "return-profit-erosion-tool",
  painStatement:
    "Cloud and API products lose margin when calls, tokens, storage and compute scale faster than revenue.",

  inputs: [],

  outputs: [],

  thresholds: [
    {
      fieldId: "revenuePressure",
      warning: 15,
      critical: 30,
      direction: "higher_is_bad",
      warningMessage:
        "Cloud stack is consuming a rising share of revenue — review API unit economics.",
      criticalMessage:
        "Critical cost pressure — scale may be eroding product margin faster than revenue grows.",
    },
  ],

  reportTemplate: {
    title: "Cloud API Cost Overrun Decision Report",
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
    hiddenLossMultiplier: 1.06,
    volatilityPercent: 22,
    targetMarginPercent: 20,
    assumptionNotes: [
      "API call cost = monthly calls ÷ 1000 × cost per thousand.",
      "Total cloud cost sums API, compute and storage spend.",
      "Revenue pressure = total cloud cost ÷ monthly revenue.",
    ],
  },
};
