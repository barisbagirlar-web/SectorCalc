import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";

/** P7 nightrun — DeepSeek Chief Engineer schema (factory generated). */
export const FazlaMesaiUcretiHesaplama_SCHEMA: PremiumCalculatorSchema = {
  id: "fazla-mesai-ucreti-hesaplama",
  name: "Fazla Mesai Ücreti Calculation",
  sectorSlug: "general-industrial",
  category: "time",
  painStatement: "Industrial engineering labor cost accounting",

  inputs: [
    {
      id: "monthlySalary",
      label: "Monthly gross salary",
      type: "number",
      unit: "USD",
      required: true,
      smartDefault: 3000,
      validation: { min: 0, max: 1000000 },
      helper: "Non-negative currency",
      expertMeaning: "Monthly gross salary",
    },
    {
      id: "weeklyHours",
      label: "Weekly working hours",
      type: "number",
      unit: "hours",
      required: true,
      smartDefault: 40,
      validation: { min: 1, max: 168 },
      helper: "Must be positive, typical range 1-168",
      expertMeaning: "Weekly working hours",
    },
    {
      id: "overtimeHours",
      label: "Overtime hours worked",
      type: "number",
      unit: "hours",
      required: true,
      smartDefault: 10,
      validation: { min: 0, max: 1000 },
      helper: "Non-negative, typical max 1000 per month",
      expertMeaning: "Overtime hours worked",
    },
    {
      id: "overtimeMultiplier",
      label: "Overtime pay multiplier",
      type: "number",
      unit: "ratio",
      required: true,
      smartDefault: 1.5,
      validation: { min: 1, max: 3 },
      helper: "Typically 1.5 for weekdays, 2 for weekends",
      expertMeaning: "Overtime pay multiplier",
    }
  ],

  formulaPipeline: [
    {
      formulaId: "cost.total_exposure",
      inputMap: {
        "a": "monthlySalary",
        "b": "weeklyHours",
        "c": "overtimeHours"
      },
      outputId: "totalExposure",
    },
    {
      formulaId: "benchmark.variance_percent",
      inputMap: {
        "actual": "monthlySalary",
        "target": "weeklyHours"
      },
      outputId: "variancePercent",
    }
  ],

  outputs: [
    {
      id: "totalExposure",
      label: "Regular hourly wage",
      unit: "USD/hour",
      format: "currency",
      isBigNumber: true,
    },
    {
      id: "variancePercent",
      label: "Overtime hourly rate",
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
      "Monthly salary is gross and includes no deductions",
      "Weekly hours are constant and represent regular hours",
      "Overtime multiplier is applied to regular hourly wage",
    ],
  },
};
