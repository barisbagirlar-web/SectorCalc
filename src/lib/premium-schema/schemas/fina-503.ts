import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";

export const INVESTMENT_PAYBACK_NPV_CALCULATOR_SCHEMA: PremiumCalculatorSchema = {
  id: "fina-503",
  name: "Investment Payback and NPV Calculator",
  sectorSlug: "finance-hr",
  category: "cost",
  painStatement:
    "Capital requests often show payback without discount rate or horizon context.",

  inputs: [
    {
      id: "initialInvestment",
      label: "Initial investment",
      type: "number",
      unit: "USD",
      required: true,
      smartDefault: 120000,
      validation: { min: 0 },
      helper: "Please enter a valid value.",
      expertMeaning: "Parameter value complies with industrial calculation standards.",
    },
    {
      id: "annualCashFlow",
      label: "Annual cash flow",
      type: "number",
      unit: "USD/year",
      required: true,
      smartDefault: 28000,
      validation: { min: 0 },
      helper: "Please enter a valid value.",
      expertMeaning: "Parameter value complies with industrial calculation standards.",
    },
    {
      id: "discountRatePercent",
      label: "Discount rate",
      type: "number",
      unit: "%",
      required: true,
      smartDefault: 10,
      validation: { min: 0, max: 100 },
      helper: "Please enter a valid value.",
      expertMeaning: "Parameter value complies with industrial calculation standards.",
    },
    {
      id: "horizonYears",
      label: "Horizon",
      type: "number",
      unit: "years",
      required: true,
      smartDefault: 5,
      validation: { min: 1, max: 30 },
      helper: "Please enter a valid value.",
      expertMeaning: "Parameter value complies with industrial calculation standards.",
    },
  ],

  formulaPipeline: [
    {
      formulaId: "finance.simple_npv",
      inputMap: {
        initialInvestment: "initialInvestment",
        annualCashFlow: "annualCashFlow",
        discountRatePercent: "discountRatePercent",
        horizonYears: "horizonYears",
      },
      outputId: "npv",
    },
    {
      formulaId: "finance.payback_years",
      inputMap: { initialInvestment: "initialInvestment", annualSavings: "annualCashFlow" },
      outputId: "paybackYears",
    },
    {
      formulaId: "finance.annual_yield_percent",
      inputMap: {
        initialInvestment: "initialInvestment",
        annualCashFlow: "annualCashFlow",
      },
      outputId: "firstYearYieldPercent",
    },
  ],

  outputs: [
    {
      id: "npv",
      label: "NPV",
      unit: "USD",
      format: "currency",
      isBigNumber: true,
    },
    {
      id: "paybackYears",
      label: "Simple payback",
      unit: "years",
      format: "number",
    },
    {
      id: "firstYearYieldPercent",
      label: "First-year yield",
      unit: "%",
      format: "percentage",
    },
  ],

  thresholds: [
    {
      fieldId: "npv",
      warning: 0,
      critical: -25000,
      direction: "lower_is_bad",
      warningMessage: "NPV is near zero — sensitivity to cash flow and rate is high.",
      criticalMessage: "NPV is deeply negative — investment case is weak under these inputs.",
    },
  ],

  reportTemplate: {
    title: "Investment Screening Summary",
    sections: ["executive_summary", "thresholds", "assumptions", "action_plan"],
    exportFormats: ["pdf"],
  },

  assumptions: {
    hiddenLossMultiplier: 1,
    volatilityPercent: 8,
    targetMarginPercent: 0,
    assumptionNotes: [
      "NPV uses equal annual cash flows and a fixed discount rate.",
      "Payback ignores discounting.",
      "Not financial advice — verify tax, salvage and ramp-up effects separately.",
    ],
  },
};
