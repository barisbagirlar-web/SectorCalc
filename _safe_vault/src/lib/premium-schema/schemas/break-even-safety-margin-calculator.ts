import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";

export const BREAK_EVEN_SAFETY_MARGIN_CALCULATOR_SCHEMA: PremiumCalculatorSchema = {
  id: "break-even-safety-margin-calculator",
  name: "Break-Even and Safety Margin Calculator",
  sectorSlug: "finance",
  category: "cost",
  painStatement:
    "Owners often learn profit or loss only after month-end statements arrive.",

  inputs: [],

  outputs: [],

  thresholds: [
    {
      fieldId: "safetyMarginRate",
      warning: 10,
      critical: 0,
      direction: "lower_is_bad",
      warningMessage: "Safety margin is thin — volume drop could erase profit quickly.",
      criticalMessage: "Volume is at or below break-even — review pricing or cost stack.",
    },
  ],

  reportTemplate: {
    title: "Break-Even and Safety Margin Decision Report",
    sections: ["executive_summary", "thresholds", "sensitivity", "action_plan", "assumptions"],
    exportFormats: ["pdf", "csv"],
  },

  assumptions: {
    hiddenLossMultiplier: 1.02,
    volatilityPercent: 10,
    targetMarginPercent: 12,
    assumptionNotes: [
      "Break-even units = fixed cost ÷ (unit price − variable cost per unit).",
      "Safety margin = (current volume − break-even units) ÷ current volume.",
      "Informational simulation only — not financial advice.",
    ],
  },
};
