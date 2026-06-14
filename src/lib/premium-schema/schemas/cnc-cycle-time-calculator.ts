import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";

/** P7 nightrun — DeepSeek Chief Engineer schema (factory generated). */
export const CncCycleTimeCalculator_SCHEMA: PremiumCalculatorSchema = {
  id: "cnc-cycle-time-calculator",
  name: "CNC Cycle Time Calculator",
  sectorSlug: "general-industrial",
  category: "time",
  painStatement: "Industrial engineering time study and cost accounting",

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
      id: "machineTimeMinutes",
      label: "Machine cycle time per part",
      type: "number",
      unit: "minutes",
      required: true,
      smartDefault: 5,
      validation: { min: 0.01, max: 1440 },
      helper: "Must be positive",
      expertMeaning: "Machine cycle time per part",
    },
    {
      id: "setupTimeMinutes",
      label: "Setup time per batch",
      type: "number",
      unit: "minutes",
      required: true,
      smartDefault: 30,
      validation: { min: 0, max: 1440 },
      helper: "Non-negative",
      expertMeaning: "Setup time per batch",
    },
    {
      id: "laborTimeMinutes",
      label: "Direct labor time per part",
      type: "number",
      unit: "minutes",
      required: true,
      smartDefault: 2,
      validation: { min: 0, max: 1440 },
      helper: "Non-negative",
      expertMeaning: "Direct labor time per part",
    },
    {
      id: "machineHourlyRate",
      label: "Machine hourly rate",
      type: "number",
      unit: "USD",
      required: true,
      smartDefault: 80,
      validation: { min: 0, max: 10000 },
      helper: "Non-negative currency",
      expertMeaning: "Machine hourly rate",
    },
    {
      id: "laborHourlyRate",
      label: "Labor hourly rate",
      type: "number",
      unit: "USD",
      required: true,
      smartDefault: 30,
      validation: { min: 0, max: 10000 },
      helper: "Non-negative currency",
      expertMeaning: "Labor hourly rate",
    }
  ],

  formulaPipeline: [
    {
      formulaId: "cost.total_exposure",
      inputMap: {
        "a": "batchSize",
        "b": "machineTimeMinutes",
        "c": "setupTimeMinutes"
      },
      outputId: "totalExposure",
    },
    {
      formulaId: "benchmark.variance_percent",
      inputMap: {
        "actual": "batchSize",
        "target": "machineTimeMinutes"
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
      "Setup time is allocated evenly across batch",
      "Labor time includes only direct labor",
      "Machine and labor rates are constant",
    ],
  },
};
