import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";

/** P7 nightrun — DeepSeek Chief Engineer schema (factory generated). */
export const HourlyRateCalculator_SCHEMA: PremiumCalculatorSchema = {
  id: "hourly-rate-calculator",
  name: "Hourly Rate Calculator",
  sectorSlug: "general-industrial",
  category: "time",
  painStatement: "Industrial engineering cost accounting and labor costing standards",

  inputs: [
    {
      id: "baseHourlyWage",
      label: "Base hourly wage",
      type: "number",
      unit: "USD",
      required: true,
      smartDefault: 25,
      validation: { min: 0, max: 10000 },
      helper: "Non-negative currency",
      expertMeaning: "Base hourly wage",
    },
    {
      id: "laborBurdenRate",
      label: "Labor burden rate",
      type: "number",
      unit: "%",
      required: true,
      smartDefault: 30,
      validation: { min: 0, max: 100, step: 0.1 },
      helper: "Percent between 0 and 100",
      expertMeaning: "Labor burden rate",
    },
    {
      id: "totalMonthlyOverhead",
      label: "Total monthly overhead",
      type: "number",
      unit: "USD",
      required: true,
      smartDefault: 50000,
      validation: { min: 0, max: 10000000 },
      helper: "Non-negative currency",
      expertMeaning: "Total monthly overhead",
    },
    {
      id: "totalMonthlyBillableHours",
      label: "Total monthly billable hours",
      type: "number",
      unit: "hours",
      required: true,
      smartDefault: 1600,
      validation: { min: 1, max: 100000 },
      helper: "Must be positive integer",
      expertMeaning: "Total monthly billable hours",
    },
    {
      id: "profitMarginPercent",
      label: "Profit margin",
      type: "number",
      unit: "%",
      required: true,
      smartDefault: 20,
      validation: { min: 0, max: 100, step: 0.1 },
      helper: "Percent between 0 and 100",
      expertMeaning: "Profit margin",
    }
  ],

  formulaPipeline: [
    {
      formulaId: "cost.total_exposure",
      inputMap: {
        "a": "baseHourlyWage",
        "b": "laborBurdenRate",
        "c": "totalMonthlyOverhead"
      },
      outputId: "totalExposure",
    },
    {
      formulaId: "benchmark.variance_percent",
      inputMap: {
        "actual": "baseHourlyWage",
        "target": "laborBurdenRate"
      },
      outputId: "variancePercent",
    }
  ],

  outputs: [
    {
      id: "totalExposure",
      label: "Hourly rate",
      unit: "USD/hour",
      format: "currency",
      isBigNumber: true,
    },
    {
      id: "variancePercent",
      label: "Base labor cost per hour",
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
      "Overhead is fixed and evenly distributed across billable hours",
      "Labor burden includes payroll taxes, insurance, benefits",
    ],
  },
};
