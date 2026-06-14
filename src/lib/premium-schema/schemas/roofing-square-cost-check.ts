import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";

/** P7 nightrun — DeepSeek Chief Engineer schema (factory generated). */
export const RoofingSquareCostCheck_SCHEMA: PremiumCalculatorSchema = {
  id: "roofing-square-cost-check",
  name: "Roofing Square Cost Check",
  sectorSlug: "general-industrial",
  category: "cost",
  painStatement: "Construction cost accounting and field service estimating",

  inputs: [
    {
      id: "jobArea",
      label: "Job area (sq ft)",
      type: "number",
      unit: "sq ft",
      required: true,
      smartDefault: 1000,
      validation: { min: 1, max: 1000000 },
      helper: "Must be positive integer",
      expertMeaning: "Job area (sq ft)",
    },
    {
      id: "materialCost",
      label: "Material cost",
      type: "number",
      unit: "USD",
      required: true,
      smartDefault: 5000,
      validation: { min: 0, max: 1000000 },
      helper: "Non-negative currency",
      expertMeaning: "Material cost",
    },
    {
      id: "laborHours",
      label: "Labor hours",
      type: "number",
      unit: "hours",
      required: true,
      smartDefault: 80,
      validation: { min: 0, max: 10000 },
      helper: "Non-negative hours",
      expertMeaning: "Labor hours",
    },
    {
      id: "laborHourlyRate",
      label: "Labor hourly rate",
      type: "number",
      unit: "USD/hour",
      required: true,
      smartDefault: 50,
      validation: { min: 0, max: 500 },
      helper: "Non-negative rate",
      expertMeaning: "Labor hourly rate",
    },
    {
      id: "equipmentCost",
      label: "Equipment cost",
      type: "number",
      unit: "USD",
      required: true,
      smartDefault: 1000,
      validation: { min: 0, max: 1000000 },
      helper: "Non-negative currency",
      expertMeaning: "Equipment cost",
    },
    {
      id: "travelCost",
      label: "Travel cost",
      type: "number",
      unit: "USD",
      required: true,
      smartDefault: 200,
      validation: { min: 0, max: 100000 },
      helper: "Non-negative currency",
      expertMeaning: "Travel cost",
    }
  ],

  formulaPipeline: [
    {
      formulaId: "cost.total_exposure",
      inputMap: {
        "a": "jobArea",
        "b": "materialCost",
        "c": "laborHours"
      },
      outputId: "totalExposure",
    },
    {
      formulaId: "benchmark.variance_percent",
      inputMap: {
        "actual": "jobArea",
        "target": "materialCost"
      },
      outputId: "variancePercent",
    }
  ],

  outputs: [
    {
      id: "totalExposure",
      label: "Direct job cost",
      unit: "USD",
      format: "currency",
      isBigNumber: true,
    },
    {
      id: "variancePercent",
      label: "Overhead amount",
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
      "Labor hours include all direct labor",
      "Overhead is applied as percentage of direct job cost",
    ],
  },
};
