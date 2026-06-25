import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";

export const DOWNTIME_MINUTE_COST_CALCULATOR_SCHEMA: PremiumCalculatorSchema = {
  id: "downtime-minute-cost-calculator",
  name: "Downtime Minute Cost Calculator",
  sectorSlug: "manufacturing",
  category: "time",
  painStatement:
    "Maintenance budgets ignore opportunity cost of machines not producing.",

  inputs: [],

  outputs: [],

  thresholds: [
    {
      fieldId: "totalExposure",
      warning: 180,
      critical: 450,
      direction: "higher_is_bad",
      warningMessage: "Downtime exposure is material — prioritize root-cause maintenance.",
      criticalMessage: "Downtime exposure is severe — escalate preventive maintenance budget.",
    },
  ],

  reportTemplate: {
    title: "Downtime Minute Cost Decision Report",
    sections: ["executive_summary", "loss_breakdown", "thresholds", "action_plan", "assumptions"],
    exportFormats: ["pdf", "csv"],
  },

  assumptions: {
    hiddenLossMultiplier: 1.06,
    volatilityPercent: 10,
    targetMarginPercent: 0,
    assumptionNotes: [
      "Shop downtime cost = downtime minutes ÷ 60 × hourly rate.",
      "Output loss = lost units × contribution per unit.",
      "Total exposure sums shop rate cost and output opportunity loss.",
    ],
  },
};
