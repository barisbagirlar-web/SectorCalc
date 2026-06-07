import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";

export const LEGAL_INTEREST_FEE_CALCULATOR_PRO_SCHEMA: PremiumCalculatorSchema = {
  id: "legal-interest-fee-calculator-pro",
  name: "Legal Interest and Fee Exposure Analyzer",
  sectorSlug: "legal-tax",
  category: "cost",
  legacyPaidSlug: "renovation-budget-optimizer",
  painStatement:
    "Legal and collection cases lose decision clarity when interest, delay and fee exposure are not summarized together.",

  inputs: [
    {
      id: "principal",
      label: "Principal",
      type: "number",
      unit: "USD",
      required: true,
      smartDefault: 15000,
      validation: { min: 0 },
      helper: "Outstanding principal or claim amount.",
      expertMeaning: "Base amount for interest and fee calculation.",
    },
    {
      id: "annualInterestPercent",
      label: "Annual interest",
      type: "number",
      unit: "%",
      required: true,
      smartDefault: 12,
      validation: { min: 0, max: 100 },
      helper: "Annual simple interest rate assumption.",
      expertMeaning: "Statutory or contractual rate for simulation.",
    },
    {
      id: "days",
      label: "Days",
      type: "number",
      unit: "days",
      required: true,
      smartDefault: 180,
      validation: { min: 0 },
      helper: "Interest accrual period in days.",
      expertMeaning: "Delay or collection period horizon.",
    },
    {
      id: "feePercent",
      label: "Fee percent",
      type: "number",
      unit: "%",
      required: true,
      smartDefault: 8,
      validation: { min: 0, max: 100 },
      helper: "Fee stack as percent of principal.",
      expertMeaning: "Collection or legal fee envelope.",
    },
    {
      id: "fixedCost",
      label: "Fixed cost",
      type: "number",
      unit: "USD",
      required: true,
      smartDefault: 650,
      validation: { min: 0 },
      helper: "Fixed filing, service or admin costs.",
      expertMeaning: "Flat cost not captured in percent fees.",
    },
  ],

  formulaPipeline: [
    {
      formulaId: "legal.simple_interest_days",
      inputMap: {
        principal: "principal",
        annualInterestPercent: "annualInterestPercent",
        days: "days",
      },
      outputId: "interestCost",
    },
    {
      formulaId: "cost.percent_of_amount",
      inputMap: { amount: "principal", percent: "feePercent" },
      outputId: "feeCost",
    },
    {
      formulaId: "cost.total_exposure",
      inputMap: { a: "interestCost", b: "feeCost", c: "fixedCost" },
      outputId: "totalExposure",
    },
  ],

  outputs: [
    {
      id: "totalExposure",
      label: "Total claim exposure",
      unit: "$",
      format: "currency",
      isBigNumber: true,
    },
    { id: "interestCost", label: "Interest cost", unit: "$", format: "currency" },
    { id: "feeCost", label: "Fee cost", unit: "$", format: "currency" },
    { id: "fixedCost", label: "Fixed cost", unit: "$", format: "currency" },
  ],

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
