import type { PremiumCalculatorSchema } from "@/lib/features/premium-schema/premium-calculator-schema";

export const ROOFING_WEATHER_DELAY_RISK_SCHEMA: PremiumCalculatorSchema = {
  id: "roof-502",
  name: "Roofing Weather Delay Risk Calculator",
  sectorSlug: "roofing",
  category: "time",
  legacyPaidSlug: "landscaping-contract-profit-tool",
  painStatement:
    "Roofing jobs lose margin when weather delay, dump fees and warranty reserve are not included in the contract price.",

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
