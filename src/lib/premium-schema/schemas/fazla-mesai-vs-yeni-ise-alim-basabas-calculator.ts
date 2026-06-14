import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";

/** P7 nightrun — DeepSeek Chief Engineer schema (factory generated). */
export const FazlaMesaiVsYeniIseAlimBasabasCalculator_SCHEMA: PremiumCalculatorSchema = {
  id: "fazla-mesai-vs-yeni-ise-alim-basabas-calculator",
  name: "Fazla Mesai Vs Yeni Ise Alim Basabas",
  sectorSlug: "general-industrial",
  category: "time",
  painStatement: "Industrial engineering cost accounting and labor economics",

  inputs: [
    {
      id: "overtimeHoursPerMonth",
      label: "Overtime hours per month",
      type: "number",
      unit: "hours/month",
      required: true,
      smartDefault: 40,
      validation: { min: 0, max: 720 },
      helper: "Non-negative, max 720 (30 days * 24 hours)",
      expertMeaning: "Overtime hours per month",
    },
    {
      id: "overtimeRatePerHour",
      label: "Overtime rate per hour",
      type: "number",
      unit: "USD/hour",
      required: true,
      smartDefault: 25,
      validation: { min: 0, max: 1000 },
      helper: "Non-negative currency",
      expertMeaning: "Overtime rate per hour",
    },
    {
      id: "overtimePremiumPercent",
      label: "Overtime premium percentage",
      type: "number",
      unit: "%",
      required: true,
      smartDefault: 50,
      validation: { min: 0, max: 200, step: 0.1 },
      helper: "Percent between 0 and 200",
      expertMeaning: "Overtime premium percentage",
    },
    {
      id: "recruitmentCostPerHire",
      label: "Recruitment cost per hire",
      type: "number",
      unit: "USD",
      required: true,
      smartDefault: 2000,
      validation: { min: 0, max: 100000 },
      helper: "Non-negative currency",
      expertMeaning: "Recruitment cost per hire",
    },
    {
      id: "trainingCostPerHire",
      label: "Training cost per hire",
      type: "number",
      unit: "USD",
      required: true,
      smartDefault: 3000,
      validation: { min: 0, max: 100000 },
      helper: "Non-negative currency",
      expertMeaning: "Training cost per hire",
    },
    {
      id: "newHireMonthlySalary",
      label: "New hire monthly salary",
      type: "number",
      unit: "USD/month",
      required: true,
      smartDefault: 3000,
      validation: { min: 0, max: 100000 },
      helper: "Non-negative currency",
      expertMeaning: "New hire monthly salary",
    }
  ],

  formulaPipeline: [
    {
      formulaId: "cost.total_exposure",
      inputMap: {
        "a": "overtimeHoursPerMonth",
        "b": "overtimeRatePerHour",
        "c": "overtimePremiumPercent"
      },
      outputId: "totalExposure",
    },
    {
      formulaId: "benchmark.variance_percent",
      inputMap: {
        "actual": "overtimeHoursPerMonth",
        "target": "overtimeRatePerHour"
      },
      outputId: "variancePercent",
    }
  ],

  outputs: [
    {
      id: "totalExposure",
      label: "Total monthly overtime cost",
      unit: "USD",
      format: "currency",
      isBigNumber: true,
    },
    {
      id: "variancePercent",
      label: "Total hiring cost (one-time)",
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
      "Overtime hours are consistent each month",
      "Hiring cost is one-time and does not recur",
      "New hire reaches full productivity linearly over monthsToProductivity",
    ],
  },
};
