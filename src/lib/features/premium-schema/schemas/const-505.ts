import type { PremiumCalculatorSchema } from "@/lib/features/premium-schema/premium-calculator-schema";

export const ROOFING_CONTRACT_MARGIN_GUARD_SCHEMA: PremiumCalculatorSchema = {
  id: "const-505",
  name: "Roofing Contract Margin Guard",
  sectorSlug: "construction",
  category: "cost",
  legacyPaidSlug: "roofing-contract-margin-guard",
  painStatement:
    "Find minimum roofing bid with tear-off, dump fees, warranty reserve and weather delay risk included.",

  inputs: [],

  outputs: [],

  thresholds: [
    {
      fieldId: "marginPressure",
      warning: 3,
      critical: 7,
      direction: "higher_is_bad",
      warningMessage:
        "Subcontractor leak is pressuring project margin — audit change orders and delay claims.",
      criticalMessage:
        "Critical margin leak — renegotiate subs or reprice before accepting similar contract scope.",
    },
  ],

  reportTemplate: {
    title: "Subcontractor Margin Leak Decision Report",
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
    hiddenLossMultiplier: 1.1,
    volatilityPercent: 18,
    targetMarginPercent: 12,
    assumptionNotes: [
      "Subcontractor variance = max(actual − planned, 0).",
      "Total exposure sums variance, delay cost and material variance.",
      "Margin pressure = total exposure ÷ contract value.",
    ],
  },
};
