import type { PremiumCalculatorSchema } from "@/lib/features/premium-schema/premium-calculator-schema";

export const AUTO_REPAIR_COMEBACK_COST_SCHEMA: PremiumCalculatorSchema = {
  id: "auto-repair-comeback-cost",
  name: "Auto Repair Comeback Cost Calculator",
  sectorSlug: "auto-repair",
  category: "cost",
  legacyPaidSlug: "auto-shop-margin-leak-detector",
  painStatement:
    "Auto repair shops lose margin when diagnostic time, parts handling and comeback jobs are not priced into flat-rate work.",

  inputs: [],

  outputs: [],

  thresholds: [
    {
      fieldId: "comebackRatePercent",
      warning: 4,
      critical: 8,
      direction: "higher_is_bad",
      warningMessage: "Comeback rate is elevated - verify diagnostic and QC assumptions.",
      criticalMessage: "Critical comeback band - reprice flat-rate work before scaling.",
    },
  ],

  reportTemplate: {
    title: "Auto Repair Comeback Cost Decision Report",
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
    hiddenLossMultiplier: 1.09,
    volatilityPercent: 13,
    targetMarginPercent: 22,
    assumptionNotes: [
      "Comeback cost = monthly revenue × comeback rate.",
      "Diagnostic leak = unbilled diagnostic hours × labor rate.",
      "Total exposure sums comeback, diagnostic and parts handling.",
    ],
  },
};
