import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";

/** P7 nightrun — DeepSeek Chief Engineer schema (factory generated). */
export const ZamanEtuduVeStandartSureCalculator_SCHEMA: PremiumCalculatorSchema = {
  id: "zaman-etudu-ve-standart-sure-calculator",
  name: "Zaman Etudu Ve Standart Sure",
  sectorSlug: "general-industrial",
  category: "cost",
  painStatement: "Industrial engineering work measurement (MTM-1 / MOST / stopwatch time study)",

  inputs: [
    {
      id: "observedTimeMinutes",
      label: "Observed time per cycle",
      type: "number",
      unit: "minutes",
      required: true,
      smartDefault: 5,
      validation: { min: 0.01, max: 1440 },
      helper: "Must be positive, max 1440 min (24h)",
      expertMeaning: "Observed time per cycle",
    },
    {
      id: "performanceRatingPercent",
      label: "Performance rating",
      type: "number",
      unit: "%",
      required: true,
      smartDefault: 100,
      validation: { min: 50, max: 150, step: 0.1 },
      helper: "Typical range 50-150%",
      expertMeaning: "Performance rating",
    },
    {
      id: "allowancePercent",
      label: "Allowance factor",
      type: "number",
      unit: "%",
      required: true,
      smartDefault: 15,
      validation: { min: 0, max: 50, step: 0.1 },
      helper: "Typically 5-30%",
      expertMeaning: "Allowance factor",
    },
    {
      id: "batchQuantity",
      label: "Batch quantity",
      type: "number",
      unit: "units",
      required: true,
      smartDefault: 100,
      validation: { min: 1, max: 1000000 },
      helper: "Must be positive integer",
      expertMeaning: "Batch quantity",
    },
    {
      id: "actualTimeMinutes",
      label: "Actual total time for batch",
      type: "number",
      unit: "minutes",
      required: true,
      smartDefault: 600,
      validation: { min: 0.01, max: 1000000 },
      helper: "Must be positive",
      expertMeaning: "Actual total time for batch",
    }
  ],

  formulaPipeline: [
    {
      formulaId: "cost.total_exposure",
      inputMap: {
        "a": "observedTimeMinutes",
        "b": "performanceRatingPercent",
        "c": "allowancePercent"
      },
      outputId: "totalExposure",
    },
    {
      formulaId: "benchmark.variance_percent",
      inputMap: {
        "actual": "observedTimeMinutes",
        "target": "performanceRatingPercent"
      },
      outputId: "variancePercent",
    }
  ],

  outputs: [
    {
      id: "totalExposure",
      label: "Standard time per unit",
      unit: "minutes",
      format: "currency",
      isBigNumber: true,
    },
    {
      id: "variancePercent",
      label: "Total standard time for batch",
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
      "Observed time is representative of typical cycle",
      "Performance rating is accurate and unbiased",
      "Allowance factor covers all standard allowances",
    ],
  },
};
