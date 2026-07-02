import type { PremiumCalculatorSchema } from "@/lib/features/premium-schema/premium-calculator-schema";

export const SCRAP_RATE_CALCULATOR_SCHEMA: PremiumCalculatorSchema = {
  id: "shee-501",
  name: "Scrap Rate Calculator",
  sectorSlug: "sheet-metal",
  category: "scrap",
  legacyPaidSlug: "scrap-rate-calculator",
  painStatement:
    "Scrap rate percent from scrapped vs total units.",

  inputs: [],

  outputs: [],

  thresholds: [
    {
      fieldId: "scrapRate",
      warning: 5,
      critical: 10,
      direction: "higher_is_bad",
      warningMessage:
        "Scrap rate is above target — nesting or bend tolerance may be eroding quote margin.",
      criticalMessage:
        "Critical scrap band — reprice material and rework before accepting similar fabrication.",
    },
    {
      fieldId: "reworkHours",
      warning: 8,
      critical: 20,
      direction: "higher_is_bad",
      warningMessage: "Rework hours are elevated — verify setup and bend sequence assumptions.",
      criticalMessage:
        "Rework exposure is critical — stop treating bend errors as normal shop time.",
    },
  ],

  reportTemplate: {
    title: "Sheet Metal Scrap Risk Decision Report",
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
    hiddenLossMultiplier: 1.08,
    volatilityPercent: 14,
    targetMarginPercent: 18,
    assumptionNotes: [
      "Excess scrap = max(scrap rate − target, 0) applied to material cost.",
      "Rework cost = rework hours × labor rate.",
      "Total exposure sums excess scrap, rework and finishing cost.",
    ],
  },
};
