import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";

export const ANNUAL_LEAVE_SEVERANCE_NOTICE_CALCULATOR_SCHEMA: PremiumCalculatorSchema = {
  id: "annual-leave-severance-notice-calculator",
  name: "Annual Leave, Severance and Notice Calculator",
  sectorSlug: "finance-hr",
  category: "cost",
  painStatement:
    "Workforce exit costs are often underestimated until payroll and legal review.",

  inputs: [],

  outputs: [],

  thresholds: [
    {
      fieldId: "totalExitExposure",
      warning: 25000,
      critical: 60000,
      direction: "higher_is_bad",
      warningMessage: "Exit exposure is elevated — confirm policy and statutory rules.",
      criticalMessage: "Exit exposure is high — legal and HR review recommended.",
    },
  ],

  reportTemplate: {
    title: "Workforce Exit Cost Summary",
    sections: ["executive_summary", "thresholds", "assumptions", "action_plan"],
    exportFormats: ["pdf"],
  },

  assumptions: {
    hiddenLossMultiplier: 1,
    volatilityPercent: 5,
    targetMarginPercent: 0,
    assumptionNotes: [
      "Screening model only — not legal or payroll advice.",
      "Statutory severance, unused leave and local labor law may differ.",
      "Verify rates and tenure rules with qualified counsel before decisions.",
    ],
  },
};
