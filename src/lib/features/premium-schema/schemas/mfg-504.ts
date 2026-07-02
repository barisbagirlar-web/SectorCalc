import type { PremiumCalculatorSchema } from "@/lib/features/premium-schema/premium-calculator-schema";

export const CNC_TOOL_WEAR_COST_SCHEMA: PremiumCalculatorSchema = {
  id: "mfg-504",
  name: "CNC Tool Wear Cost Calculator",
  sectorSlug: "manufacturing",
  category: "cost",
  legacyPaidSlug: "welding-bid-risk-analyzer",
  painStatement:
    "CNC jobs lose margin when tool wear, inserts, coolant and tool change downtime are not allocated per part.",

  inputs: [],

  outputs: [],

  thresholds: [
    {
      fieldId: "toolCostPerPart",
      warning: 0.5,
      critical: 1.5,
      direction: "higher_is_bad",
      warningMessage: "Per-part tool cost is elevated - verify insert life and quoting allowance.",
      criticalMessage: "Tool cost per part is critical - reprice repeat jobs before accepting.",
    },
    {
      fieldId: "toolChangeMinutes",
      warning: 15,
      critical: 30,
      direction: "higher_is_bad",
      warningMessage: "Tool change time is above typical band - schedule and setup buffers may be tight.",
      criticalMessage: "Changeover time is critical - hidden spindle loss may erase margin.",
    },
  ],

  reportTemplate: {
    title: "CNC Tool Wear Cost Decision Report",
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
    volatilityPercent: 16,
    targetMarginPercent: 18,
    assumptionNotes: [
      "Tool cost per part = monthly tool spend ÷ parts produced.",
      "Changeover cost = minutes × changes × hourly rate.",
      "Total exposure sums tool spend, changeover and coolant.",
    ],
  },
};
