import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";

/** P7 nightrun — DeepSeek Chief Engineer schema (factory generated). */
export const SalaryCostCalculator_SCHEMA: PremiumCalculatorSchema = {
  id: "salary-cost-calculator",
  name: "Employer Salary Cost Calculator",
  sectorSlug: "general-industrial",
  category: "cost",
  painStatement: "Cost accounting and labor economics",

  inputs: [
    {
      id: "baseSalary",
      label: "Base salary (monthly)",
      type: "number",
      unit: "USD",
      required: true,
      smartDefault: 3000,
      validation: { min: 0, max: 1000000 },
      helper: "Must be non-negative",
      expertMeaning: "Base salary (monthly)",
    },
    {
      id: "bonuses",
      label: "Monthly bonuses and allowances",
      type: "number",
      unit: "USD",
      required: true,
      smartDefault: 0,
      validation: { min: 0, max: 1000000 },
      helper: "Must be non-negative",
      expertMeaning: "Monthly bonuses and allowances",
    },
    {
      id: "socialSecurityRate",
      label: "Employer social security contribution rate",
      type: "number",
      unit: "%",
      required: true,
      smartDefault: 20.5,
      validation: { min: 0, max: 100, step: 0.1 },
      helper: "Percent between 0 and 100",
      expertMeaning: "Employer social security contribution rate",
    },
    {
      id: "otherEmployerCosts",
      label: "Other monthly employer costs (insurance, pension, etc.)",
      type: "number",
      unit: "USD",
      required: true,
      smartDefault: 200,
      validation: { min: 0, max: 1000000 },
      helper: "Must be non-negative",
      expertMeaning: "Other monthly employer costs (insurance, pension, etc.)",
    },
    {
      id: "workingDaysPerMonth",
      label: "Working days per month",
      type: "number",
      unit: "days",
      required: true,
      smartDefault: 22,
      validation: { min: 1, max: 31 },
      helper: "Must be between 1 and 31",
      expertMeaning: "Working days per month",
    },
    {
      id: "dailyHours",
      label: "Daily working hours",
      type: "number",
      unit: "hours",
      required: true,
      smartDefault: 8,
      validation: { min: 1, max: 24 },
      helper: "Must be between 1 and 24",
      expertMeaning: "Daily working hours",
    }
  ],

  formulaPipeline: [
    {
      formulaId: "cost.total_exposure",
      inputMap: {
        "a": "baseSalary",
        "b": "bonuses",
        "c": "socialSecurityRate"
      },
      outputId: "totalExposure",
    },
    {
      formulaId: "benchmark.variance_percent",
      inputMap: {
        "actual": "baseSalary",
        "target": "bonuses"
      },
      outputId: "variancePercent",
    }
  ],

  outputs: [
    {
      id: "totalExposure",
      label: "Total monthly employer cost",
      unit: "USD",
      format: "currency",
      isBigNumber: true,
    },
    {
      id: "variancePercent",
      label: "Cost per hour",
      unit: "%",
      format: "percentage",
      isBigNumber: false,
    }
  ],

  thresholds: [
    {
      fieldId: "totalExposure",
      warning: 1,
      critical: 3,
      direction: "higher_is_bad",
      warningMessage: "Exposure is entering warning band — review drivers.",
      criticalMessage: "Exposure is critical — immediate operational review required.",
    },
  ],

  reportTemplate: {
    title: "[object Object] Decision Report",
    sections: ["executive_summary", "thresholds", "sensitivity", "action_plan", "assumptions"],
    exportFormats: ["pdf", "csv"],
  },

  assumptions: {
    hiddenLossMultiplier: 1.05,
    volatilityPercent: 8,
    targetMarginPercent: 15,
    assumptionNotes: [
      "All monetary values in same currency",
      "Social security rate is applied to gross salary (base + bonuses)",
      "Other costs are fixed monthly amounts",
    ],
  },
};
