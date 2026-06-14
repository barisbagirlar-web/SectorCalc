import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";

/** P7 nightrun — DeepSeek Chief Engineer schema (factory generated). */
export const SoforOperatorGunlukYevmiyeMaliyeti_SCHEMA: PremiumCalculatorSchema = {
  id: "sofor-operator-gunluk-yevmiye-maliyeti",
  name: "Şoför — Operatör Günlük Yevmiye Maliyeti",
  sectorSlug: "general-industrial",
  category: "cost",
  painStatement: "Industrial engineering labor cost accounting",

  inputs: [
    {
      id: "dailyWage",
      label: "Daily base wage",
      type: "number",
      unit: "USD",
      required: true,
      smartDefault: 100,
      validation: { min: 0, max: 10000 },
      helper: "Non-negative currency amount",
      expertMeaning: "Daily base wage",
    },
    {
      id: "overtimeRatePercent",
      label: "Overtime rate (percentage of base wage)",
      type: "number",
      unit: "%",
      required: true,
      smartDefault: 50,
      validation: { min: 0, max: 200, step: 0.1 },
      helper: "Percent between 0 and 200",
      expertMeaning: "Overtime rate (percentage of base wage)",
    },
    {
      id: "overtimeHours",
      label: "Overtime hours per day",
      type: "number",
      unit: "hours",
      required: true,
      smartDefault: 0,
      validation: { min: 0, max: 12 },
      helper: "Non-negative hours",
      expertMeaning: "Overtime hours per day",
    },
    {
      id: "standardHours",
      label: "Standard working hours per day",
      type: "number",
      unit: "hours",
      required: true,
      smartDefault: 8,
      validation: { min: 1, max: 24 },
      helper: "Must be positive",
      expertMeaning: "Standard working hours per day",
    },
    {
      id: "socialSecurityRatePercent",
      label: "Social security contribution rate",
      type: "number",
      unit: "%",
      required: true,
      smartDefault: 20,
      validation: { min: 0, max: 100, step: 0.1 },
      helper: "Percent between 0 and 100",
      expertMeaning: "Social security contribution rate",
    },
    {
      id: "mealAllowance",
      label: "Daily meal allowance",
      type: "number",
      unit: "USD",
      required: true,
      smartDefault: 10,
      validation: { min: 0, max: 100 },
      helper: "Non-negative currency amount",
      expertMeaning: "Daily meal allowance",
    }
  ],

  formulaPipeline: [
    {
      formulaId: "cost.total_exposure",
      inputMap: {
        "a": "dailyWage",
        "b": "overtimeRatePercent",
        "c": "overtimeHours"
      },
      outputId: "totalExposure",
    },
    {
      formulaId: "benchmark.variance_percent",
      inputMap: {
        "actual": "dailyWage",
        "target": "overtimeRatePercent"
      },
      outputId: "variancePercent",
    }
  ],

  outputs: [
    {
      id: "totalExposure",
      label: "Total daily cost per driver/operator",
      unit: "USD",
      format: "currency",
      isBigNumber: true,
    },
    {
      id: "variancePercent",
      label: "Annualized cost per driver/operator",
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
      "Overtime rate is applied to base wage only",
      "Social security contribution is based on base wage plus overtime",
    ],
  },
};
