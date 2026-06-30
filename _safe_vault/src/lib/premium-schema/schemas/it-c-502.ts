import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";

export const RETURN_PROFIT_EROSION_TOOL_SCHEMA: PremiumCalculatorSchema = {
  id: "it-c-502",
  name: "Return Profit Erosion Tool",
  sectorSlug: "it-cloud",
  category: "cost",
  legacyPaidSlug: "return-profit-erosion-tool",
  painStatement:
    "Measure net profit after returns, shipping, payment fees and ad cost per sale.",

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
