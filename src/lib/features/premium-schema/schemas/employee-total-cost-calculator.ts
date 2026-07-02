import type { PremiumCalculatorSchema } from "@/lib/features/premium-schema/premium-calculator-schema";

export const EMPLOYEE_TOTAL_COST_CALCULATOR_SCHEMA: PremiumCalculatorSchema = {
  id: "employee-total-cost-calculator",
  name: "Employee Total Cost Calculator",
  sectorSlug: "finance",
  category: "cost",
  painStatement:
    "Hiring and pricing decisions often use net pay instead of loaded employer cost.",

  inputs: [],

  outputs: [],

  thresholds: [
    {
      fieldId: "totalEmployerCost",
      warning: 6000,
      critical: 9000,
      direction: "higher_is_bad",
      warningMessage: "Loaded headcount cost is elevated — verify quote labor rates.",
      criticalMessage: "Loaded cost is very high — review hiring plan before committing.",
    },
  ],

  reportTemplate: {
    title: "Employee Total Cost Decision Report",
    sections: ["executive_summary", "loss_breakdown", "thresholds", "action_plan", "assumptions"],
    exportFormats: ["pdf", "csv"],
  },

  assumptions: {
    hiddenLossMultiplier: 1.02,
    volatilityPercent: 6,
    targetMarginPercent: 0,
    assumptionNotes: [
      "Total employer cost = gross salary + employer burden + monthly benefits.",
      "Employer burden = gross salary × burden rate.",
      "Informational simulation only — not payroll or legal advice.",
    ],
  },
};
