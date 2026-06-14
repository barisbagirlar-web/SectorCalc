import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";

/** P7 nightrun — DeepSeek Chief Engineer schema (factory generated). */
export const LaboratuvarAnalizMaliyetiVeNumuneAlmaOptimizasyonCalculator_SCHEMA: PremiumCalculatorSchema = {
  id: "laboratuvar-analiz-maliyeti-ve-numune-alma-optimizasyon-calculator",
  name: "Laboratuvar Analiz Maliyeti Ve Numune Alma Optimizasyon",
  sectorSlug: "general-industrial",
  category: "time",
  painStatement: "Activity-based costing and statistical sampling theory",

  inputs: [
    {
      id: "monthlyTestDemand",
      label: "Monthly test demand",
      type: "number",
      unit: "tests",
      required: true,
      smartDefault: 500,
      validation: { min: 1, max: 100000 },
      helper: "Must be positive integer",
      expertMeaning: "Monthly test demand",
    },
    {
      id: "fixedCostPerMonth",
      label: "Fixed cost per month",
      type: "number",
      unit: "USD",
      required: true,
      smartDefault: 10000,
      validation: { min: 0, max: 1000000 },
      helper: "Non-negative currency",
      expertMeaning: "Fixed cost per month",
    },
    {
      id: "variableCostPerTest",
      label: "Variable cost per test",
      type: "number",
      unit: "USD",
      required: true,
      smartDefault: 50,
      validation: { min: 0, max: 10000 },
      helper: "Non-negative currency",
      expertMeaning: "Variable cost per test",
    },
    {
      id: "currentSamplingRate",
      label: "Current sampling rate (tests per batch)",
      type: "number",
      unit: "tests/batch",
      required: true,
      smartDefault: 10,
      validation: { min: 1, max: 1000 },
      helper: "Must be positive integer",
      expertMeaning: "Current sampling rate (tests per batch)",
    },
    {
      id: "setupCostPerBatch",
      label: "Setup cost per batch",
      type: "number",
      unit: "USD",
      required: true,
      smartDefault: 200,
      validation: { min: 0, max: 10000 },
      helper: "Non-negative currency",
      expertMeaning: "Setup cost per batch",
    },
    {
      id: "holdingCostPerTest",
      label: "Holding cost per test per month",
      type: "number",
      unit: "USD",
      required: true,
      smartDefault: 5,
      validation: { min: 0, max: 1000 },
      helper: "Non-negative currency",
      expertMeaning: "Holding cost per test per month",
    }
  ],

  formulaPipeline: [
    {
      formulaId: "cost.total_exposure",
      inputMap: {
        "a": "monthlyTestDemand",
        "b": "fixedCostPerMonth",
        "c": "variableCostPerTest"
      },
      outputId: "totalExposure",
    },
    {
      formulaId: "benchmark.variance_percent",
      inputMap: {
        "actual": "monthlyTestDemand",
        "target": "fixedCostPerMonth"
      },
      outputId: "variancePercent",
    }
  ],

  outputs: [
    {
      id: "totalExposure",
      label: "Cost per test",
      unit: "USD",
      format: "currency",
      isBigNumber: true,
    },
    {
      id: "variancePercent",
      label: "Optimal sampling rate (tests per batch)",
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
      "All costs are in USD and stable over the month",
      "Demand is deterministic and constant",
      "Setup cost and holding cost are linear",
    ],
  },
};
