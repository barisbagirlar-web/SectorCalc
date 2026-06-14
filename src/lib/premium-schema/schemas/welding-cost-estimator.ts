import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";

/** P7 nightrun — DeepSeek Chief Engineer schema (factory generated). */
export const WeldingCostEstimator_SCHEMA: PremiumCalculatorSchema = {
  id: "welding-cost-estimator",
  name: "Welding Cost Estimator",
  sectorSlug: "general-industrial",
  category: "cost",
  painStatement: "Industrial engineering cost accounting for welding operations",

  inputs: [
    {
      id: "batchSize",
      label: "Batch size",
      type: "number",
      unit: "units",
      required: true,
      smartDefault: 100,
      validation: { min: 1, max: 1000000 },
      helper: "Must be positive integer",
      expertMeaning: "Batch size",
    },
    {
      id: "machineTimeHours",
      label: "Machine time per unit",
      type: "number",
      unit: "hours",
      required: true,
      smartDefault: 0.5,
      validation: { min: 0, max: 1000 },
      helper: "Non-negative hours",
      expertMeaning: "Machine time per unit",
    },
    {
      id: "setupTimeMinutes",
      label: "Setup time per batch",
      type: "number",
      unit: "minutes",
      required: true,
      smartDefault: 30,
      validation: { min: 0, max: 10000 },
      helper: "Non-negative minutes",
      expertMeaning: "Setup time per batch",
    },
    {
      id: "laborTimeHours",
      label: "Labor time per unit",
      type: "number",
      unit: "hours",
      required: true,
      smartDefault: 0.3,
      validation: { min: 0, max: 1000 },
      helper: "Non-negative hours",
      expertMeaning: "Labor time per unit",
    },
    {
      id: "machineHourlyRate",
      label: "Machine hourly rate",
      type: "number",
      unit: "USD/hour",
      required: true,
      smartDefault: 50,
      validation: { min: 0, max: 10000 },
      helper: "Non-negative rate",
      expertMeaning: "Machine hourly rate",
    },
    {
      id: "laborHourlyRate",
      label: "Labor hourly rate",
      type: "number",
      unit: "USD/hour",
      required: true,
      smartDefault: 30,
      validation: { min: 0, max: 10000 },
      helper: "Non-negative rate",
      expertMeaning: "Labor hourly rate",
    }
  ],

  formulaPipeline: [
    {
      formulaId: "cost.total_exposure",
      inputMap: {
        "a": "batchSize",
        "b": "machineTimeHours",
        "c": "setupTimeMinutes"
      },
      outputId: "totalExposure",
    },
    {
      formulaId: "benchmark.variance_percent",
      inputMap: {
        "actual": "batchSize",
        "target": "machineTimeHours"
      },
      outputId: "variancePercent",
    }
  ],

  outputs: [
    {
      id: "totalExposure",
      label: "Unit cost",
      unit: "USD",
      format: "currency",
      isBigNumber: true,
    },
    {
      id: "variancePercent",
      label: "Batch cost",
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
      "All costs are in same currency (USD)",
      "Setup time is per batch and allocated equally",
      "Scrap rate is applied to material cost only",
    ],
  },
};
