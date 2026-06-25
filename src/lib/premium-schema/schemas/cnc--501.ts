import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";

export const CNC_OEE_LOSS_SCHEMA: PremiumCalculatorSchema = {
  id: "cnc--501",
  name: "CNC OEE & Time Loss Report",
  sectorSlug: "cnc-manufacturing",
  category: "oee",
  legacyPaidSlug: "cnc-quote-risk-analyzer",
  painStatement:
    "Machine downtime, scrap and cycle stretch erase margin before the quote is accepted.",

  inputs: [],

  outputs: [],

  thresholds: [
    {
      fieldId: "oeeScore",
      warning: 65,
      critical: 50,
      direction: "lower_is_bad",
      warningMessage: "OEE is below typical job-shop band — schedule and scrap buffers are tight.",
      criticalMessage: "High risk — hidden cost may erase the margin. Reprice before accepting this job.",
    },
    {
      fieldId: "scrapCost",
      warning: 50,
      critical: 120,
      direction: "higher_is_bad",
      warningMessage: "Scrap exposure is elevated — verify material yield and first-off plan.",
      criticalMessage: "Material fire cost is critical — raise quote or reduce scrap allowance.",
    },
  ],

  reportTemplate: {
    title: "CNC OEE & Loss Decision Report",
    sections: [
      "executive_summary",
      "loss_breakdown",
      "thresholds",
      "sensitivity",
      "action_plan",
      "assumptions",
    ],
    exportFormats: ["pdf"],
  },

  assumptions: {
    hiddenLossMultiplier: 1.12,
    volatilityPercent: 22,
    targetMarginPercent: 15,
    assumptionNotes: [
      "Hidden buffers include setup overrun, tool wear and inspection load.",
      "P90 uses sector volatility 22% unless you override shop history.",
      "Outputs are estimates — verify before signing the job.",
    ],
  },
};
