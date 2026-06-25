import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";

export const ANNUAL_LEAVE_SEVERANCE_NOTICE_CALCULATOR_SCHEMA: PremiumCalculatorSchema = {
  id: "fina-501",
  name: "Annual Leave, Severance and Notice Calculator",
  sectorSlug: "finance-hr",
  category: "cost",
  painStatement:
    "Workforce exit costs are often underestimated until payroll and legal review.",

  inputs: [
    {
      id: "grossMonthlySalary",
      label: "Gross monthly salary",
      type: "number",
      unit: "USD",
      required: true,
      smartDefault: 4200,
      validation: { min: 0 },
      helper: "Please enter a valid value.",
      expertMeaning: "Parameter value complies with industrial calculation standards.",
    },
    {
      id: "employerBurdenPercent",
      label: "Employer burden",
      type: "number",
      unit: "%",
      required: true,
      smartDefault: 22,
      validation: { min: 0, max: 100 },
      helper: "Please enter a valid value.",
      expertMeaning: "Parameter value complies with industrial calculation standards.",
    },
    {
      id: "yearsOfService",
      label: "Years of service",
      type: "number",
      unit: "years",
      required: true,
      smartDefault: 6,
      validation: { min: 0, max: 40 },
      helper: "Please enter a valid value.",
      expertMeaning: "Parameter value complies with industrial calculation standards.",
    },
    {
      id: "severanceWeeksPerYear",
      label: "Severance weeks per year",
      type: "number",
      unit: "weeks",
      required: true,
      smartDefault: 4,
      validation: { min: 0, max: 52 },
      helper: "Please enter a valid value.",
      expertMeaning: "Parameter value complies with industrial calculation standards.",
    },
    {
      id: "noticeWeeks",
      label: "Notice weeks",
      type: "number",
      unit: "weeks",
      required: true,
      smartDefault: 4,
      validation: { min: 0, max: 52 },
      helper: "Please enter a valid value.",
      expertMeaning: "Parameter value complies with industrial calculation standards.",
    },
  ],

  formulaPipeline: [
    {
      formulaId: "cost.employer_burden_total",
      inputMap: {
        grossMonthlySalary: "grossMonthlySalary",
        employerBurdenPercent: "employerBurdenPercent",
      },
      outputId: "employerMonthlyCost",
    },
    {
      formulaId: "cost.severance_screening",
      inputMap: {
        grossMonthlySalary: "grossMonthlySalary",
        yearsOfService: "yearsOfService",
        severanceWeeksPerYear: "severanceWeeksPerYear",
      },
      outputId: "severanceEstimate",
    },
    {
      formulaId: "cost.notice_screening",
      inputMap: { grossMonthlySalary: "grossMonthlySalary", noticeWeeks: "noticeWeeks" },
      outputId: "noticeEstimate",
    },
    {
      formulaId: "cost.sum2",
      inputMap: { a: "severanceEstimate", b: "noticeEstimate" },
      outputId: "totalExitExposure",
    },
  ],

  outputs: [
    {
      id: "totalExitExposure",
      label: "Total exit exposure",
      unit: "USD",
      format: "currency",
      isBigNumber: true,
    },
    {
      id: "severanceEstimate",
      label: "Severance estimate",
      unit: "USD",
      format: "currency",
    },
    {
      id: "noticeEstimate",
      label: "Notice estimate",
      unit: "USD",
      format: "currency",
    },
  ],

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
