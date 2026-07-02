import type { PremiumCalculatorSchema } from "@/lib/features/premium-schema/premium-calculator-schema";

export const LANDSCAPING_CONTRACT_PROFIT_TOOL_SCHEMA: PremiumCalculatorSchema = {
  id: "roof-501",
  name: "Landscaping Contract Profit Tool",
  sectorSlug: "roofing",
  category: "time",
  legacyPaidSlug: "landscaping-contract-profit-tool",
  painStatement:
    "Find minimum monthly landscaping contract price with fuel, supplies and equipment wear included.",

  inputs: [],

  outputs: [],

  thresholds: [
    {
      fieldId: "weatherDelayDays",
      warning: 3,
      critical: 8,
      direction: "higher_is_bad",
      warningMessage: "Weather delay exposure is elevated — verify schedule buffer.",
      criticalMessage: "Critical delay band — reprice before accepting roofing work.",
    },
  ],

  reportTemplate: {
    title: "Roofing Weather Delay Risk Decision Report",
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
    hiddenLossMultiplier: 1.12,
    volatilityPercent: 20,
    targetMarginPercent: 15,
    assumptionNotes: [
      "Delay cost = daily crew cost × weather delay days.",
      "Total exposure sums delay, dump fees and warranty reserve.",
      "Seasonal volatility assumed at 20% unless shop history overrides.",
    ],
  },
};
