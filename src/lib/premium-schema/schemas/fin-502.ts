import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";

export const EMPLOYEE_TOTAL_COST_CALCULATOR_SCHEMA: PremiumCalculatorSchema = {
  id: "fin-502",
  name: "Employee Total Cost Calculator",
  sectorSlug: "finance",
  category: "cost",
  painStatement:
    "Hiring and pricing decisions often use net pay instead of loaded employer cost.",

  inputs: [
    {
      id: "grossSalary",
      label: "Gross salary",
      type: "number",
      unit: "USD/month",
      required: true,
      smartDefault: 4200,
      validation: { min: 0 },
      helper: "Please enter a valid value.",
      expertMeaning: "Parameter value complies with industrial calculation standards.",
    },
    {
      id: "employerRatePercent",
      label: "Employer burden rate",
      type: "number",
      unit: "%",
      required: true,
      smartDefault: 22,
      validation: { min: 0, max: 100 },
      helper: "Please enter a valid value.",
      expertMeaning: "Parameter value complies with industrial calculation standards.",
    },
    {
      id: "monthlyBenefits",
      label: "Monthly benefits",
      type: "number",
      unit: "USD",
      required: true,
      smartDefault: 380,
      validation: { min: 0 },
      helper: "Please enter a valid value.",
      expertMeaning: "Parameter value complies with industrial calculation standards.",
    },
  ],

  formulaPipeline: [
    {
      formulaId: "cost.percent_of_amount",
      inputMap: { amount: "grossSalary", percent: "employerRatePercent" },
      outputId: "employerLoad",
    },
    {
      formulaId: "cost.total_exposure",
      inputMap: { a: "grossSalary", b: "employerLoad", c: "monthlyBenefits" },
      outputId: "totalEmployerCost",
    },
  ],

  outputs: [
    {
      id: "totalEmployerCost",
      label: "Total employer cost",
      unit: "$",
      format: "currency",
      isBigNumber: true,
    },
    {
      id: "employerLoad",
      label: "Employer burden",
      unit: "$",
      format: "currency",
    },
  ],

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
