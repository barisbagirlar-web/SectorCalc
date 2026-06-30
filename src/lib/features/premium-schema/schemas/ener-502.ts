import type { PremiumCalculatorSchema } from "@/lib/features/premium-schema/premium-calculator-schema";

export const CBAM_COMPLIANCE_VERDICT_SCHEMA: PremiumCalculatorSchema = {
  id: "ener-502",
  name: "CBAM Compliance Readiness Verdict",
  sectorSlug: "energy-carbon",
  category: "carbon",
  painStatement:
    "Exporters can miss CBAM data gaps until certificate coverage, declared emissions and completeness are compared.",

  inputs: [],

  outputs: [],

  thresholds: [
    {
      fieldId: "riskScore",
      warning: 20,
      critical: 50,
      direction: "higher_is_bad",
      warningMessage: "Medium CBAM readiness risk — review data completeness and coverage.",
      criticalMessage: "High CBAM readiness risk — close emission and certificate gaps before filing.",
    },
  ],

  reportTemplate: {
    title: "CBAM Compliance Readiness Report",
    sections: ["executive_summary", "thresholds", "sensitivity", "assumptions"],
    exportFormats: ["pdf", "csv"],
  },

  assumptions: {
    hiddenLossMultiplier: 1.08,
    volatilityPercent: 15,
    targetMarginPercent: 0,
    assumptionNotes: [
      "Emission gap = max(embedded − declared, 0).",
      "Risk score combines emission, coverage and data gaps — not a regulatory approval.",
      "Financial exposure = emission gap × certificate price × FX rate.",
    ],
  },
};
