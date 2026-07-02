import type { PremiumCalculatorSchema } from "@/lib/features/premium-schema/premium-calculator-schema";

export const LEGAL_INTEREST_FEE_CALCULATOR_PRO_SCHEMA: PremiumCalculatorSchema = {
  id: "legal-interest-fee-calculator-pro",
  name: "Legal Interest and Fee Exposure Calculator",
  sectorSlug: "legal-tax",
  category: "cost",
  legacyPaidSlug: "renovation-budget-optimizer",
  painStatement:
    "Legal and collection cases lose decision clarity when interest, delay and fee exposure are not summarized together.",

  inputs: [],

  outputs: [],

  thresholds: [
    {
      fieldId: "days",
      warning: 90,
      critical: 365,
      direction: "higher_is_bad",
      warningMessage: "Accrual period is extended — interest exposure is building.",
      criticalMessage: "Critical delay horizon — total exposure may exceed recovery assumptions.",
    },
  ],

  reportTemplate: {
    title: "Legal Interest and Fee Exposure Decision Report",
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
    hiddenLossMultiplier: 1.05,
    volatilityPercent: 8,
    targetMarginPercent: 0,
    assumptionNotes: [
      "Simple interest = principal × annual rate × days ÷ 365.",
      "Fee cost = principal × fee percent.",
      "This is a technical exposure simulation, not legal advice.",
    ],
  },
};
