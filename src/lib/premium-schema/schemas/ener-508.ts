import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";

export const ENERGY_SAVINGS_PACKAGE_CALCULATOR_SCHEMA: PremiumCalculatorSchema = {
  id: "ener-508",
  name: "Energy Savings Package Calculator",
  sectorSlug: "energy-carbon",
  category: "energy",
  painStatement:
    "Efficiency projects move forward without a documented savings and payback baseline.",

  inputs: [
    {
      id: "baselineKwhMonthly",
      label: "Baseline monthly kWh",
      type: "number",
      unit: "kWh",
      required: true,
      smartDefault: 18500,
      validation: { min: 0 },
      helper: "Please enter a valid value.",
      expertMeaning: "Parameter value complies with industrial calculation standards.",
    },
    {
      id: "proposedKwhMonthly",
      label: "Proposed monthly kWh",
      type: "number",
      unit: "kWh",
      required: true,
      smartDefault: 15200,
      validation: { min: 0 },
      helper: "Please enter a valid value.",
      expertMeaning: "Parameter value complies with industrial calculation standards.",
    },
    {
      id: "energyRate",
      label: "Energy rate",
      type: "number",
      unit: "USD/kWh",
      required: true,
      smartDefault: 0.14,
      validation: { min: 0 },
      helper: "Please enter a valid value.",
      expertMeaning: "Parameter value complies with industrial calculation standards.",
    },
    {
      id: "projectCost",
      label: "Project cost",
      type: "number",
      unit: "USD",
      required: true,
      smartDefault: 42000,
      validation: { min: 0 },
      helper: "Please enter a valid value.",
      expertMeaning: "Parameter value complies with industrial calculation standards.",
    },
  ],

  formulaPipeline: [
    {
      formulaId: "energy.monthly_kwh_savings",
      inputMap: {
        baselineKwhMonthly: "baselineKwhMonthly",
        proposedKwhMonthly: "proposedKwhMonthly",
      },
      outputId: "monthlyKwhSavings",
    },
    {
      formulaId: "energy.kwh_cost",
      inputMap: { kwh: "monthlyKwhSavings", rate: "energyRate" },
      outputId: "monthlySavingsCost",
    },
    {
      formulaId: "cost.annualize",
      inputMap: { monthlyCost: "monthlySavingsCost" },
      outputId: "annualSavingsCost",
    },
    {
      formulaId: "finance.payback_years",
      inputMap: { initialInvestment: "projectCost", annualSavings: "annualSavingsCost" },
      outputId: "paybackYears",
    },
  ],

  outputs: [
    {
      id: "annualSavingsCost",
      label: "Annual savings",
      unit: "USD",
      format: "currency",
      isBigNumber: true,
    },
    {
      id: "monthlySavingsCost",
      label: "Monthly savings",
      unit: "USD",
      format: "currency",
    },
    {
      id: "paybackYears",
      label: "Simple payback",
      unit: "years",
      format: "number",
    },
  ],

  thresholds: [
    {
      fieldId: "paybackYears",
      warning: 4,
      critical: 7,
      direction: "higher_is_bad",
      warningMessage: "Payback exceeds four years — verify incentive and tariff assumptions.",
      criticalMessage: "Payback exceeds seven years — project economics need review.",
    },
  ],

  reportTemplate: {
    title: "Energy Savings Package Summary",
    sections: ["executive_summary", "thresholds", "assumptions", "action_plan"],
    exportFormats: ["pdf"],
  },

  assumptions: {
    hiddenLossMultiplier: 1,
    volatilityPercent: 5,
    targetMarginPercent: 0,
    assumptionNotes: [
      "Savings = (baseline − proposed) kWh × tariff, annualized.",
      "Payback = project cost ÷ annual savings.",
      "Informational screening only — excludes maintenance, incentives and demand charges.",
    ],
  },
};
