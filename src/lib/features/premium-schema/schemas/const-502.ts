import type { PremiumCalculatorSchema } from "@/lib/features/premium-schema/premium-calculator-schema";

export const CONSTRUCTION_PROJECT_OVERRUN_SCHEMA: PremiumCalculatorSchema = {
  id: "const-502",
  name: "Construction Project Overrun Calculator",
  sectorSlug: "construction",
  category: "time",
  legacyPaidSlug: "change-order-impact-analyzer",
  painStatement:
    "Construction projects lose money when labor drift, delay days and material overrun are not priced before execution.",

  inputs: [],

  outputs: [],

  thresholds: [
    {
      fieldId: "delayDays",
      warning: 3,
      critical: 10,
      direction: "higher_is_bad",
      warningMessage:
        "Schedule slip is building - delay cost may erase contingency before closeout.",
      criticalMessage:
        "Critical delay exposure - reprice or resequence before accepting similar change scope.",
    },
    {
      fieldId: "laborOverrunPercent",
      warning: 5,
      critical: 15,
      direction: "higher_is_bad",
      warningMessage: "Labor drift is above typical band - verify crew productivity assumptions.",
      criticalMessage:
        "Labor overrun is critical - margin may disappear before project completion.",
    },
    {
      fieldId: "materialOverrunPercent",
      warning: 4,
      critical: 12,
      direction: "higher_is_bad",
      warningMessage: "Material variance is elevated - check lead times and substitution risk.",
      criticalMessage:
        "Material overrun is critical - audit procurement before signing similar work.",
    },
  ],

  reportTemplate: {
    title: "Construction Overrun Decision Report",
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
    targetMarginPercent: 12,
    assumptionNotes: [
      "Delay cost = daily site cost × delay days.",
      "Overrun costs apply percent drift to labor and material budgets separately.",
      "Total exposure sums delay, labor overrun and material overrun - no double-count with change-order fees.",
    ],
  },
};
