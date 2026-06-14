import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";

/** P7 nightrun — DeepSeek Chief Engineer schema (factory generated). */
export const TesisYerlesimiVeMalzemeAkisMesafeOptimizasyonCalculator_SCHEMA: PremiumCalculatorSchema = {
  id: "tesis-yerlesimi-ve-malzeme-akis-mesafe-optimizasyon-calculator",
  name: "Tesis Yerlesimi Ve Malzeme Akis Mesafe Optimizasyon",
  sectorSlug: "general-industrial",
  category: "cost",
  painStatement: "Industrial engineering facility layout and material handling analysis",

  inputs: [
    {
      id: "departmentCount",
      label: "Number of departments",
      type: "number",
      unit: "departments",
      required: true,
      smartDefault: 5,
      validation: { min: 2, max: 100 },
      helper: "Must be integer >= 2",
      expertMeaning: "Number of departments",
    },
    {
      id: "flowMatrix",
      label: "Flow volume matrix (from-to)",
      type: "number",
      unit: "units/time",
      required: true,
      smartDefault: 1,
      validation: { min: 0, max: 1000000 },
      helper: "Square matrix of size departmentCount x departmentCount, non-negative entries, diagonal zero",
      expertMeaning: "Flow volume matrix (from-to)",
    },
    {
      id: "distanceMatrix",
      label: "Distance matrix between departments",
      type: "number",
      unit: "meters",
      required: true,
      smartDefault: 1,
      validation: { min: 0, max: 10000 },
      helper: "Square matrix of size departmentCount x departmentCount, non-negative entries, diagonal zero",
      expertMeaning: "Distance matrix between departments",
    },
    {
      id: "unitHandlingCost",
      label: "Unit material handling cost",
      type: "number",
      unit: "USD/(unit*meter)",
      required: true,
      smartDefault: 0.01,
      validation: { min: 0.0001, max: 1000 },
      helper: "Must be positive",
      expertMeaning: "Unit material handling cost",
    },
    {
      id: "optimalDistanceMatrix",
      label: "Optimal distance matrix (theoretical minimum)",
      type: "number",
      unit: "meters",
      required: true,
      smartDefault: 1,
      validation: { min: 0, max: 10000 },
      helper: "Square matrix of size departmentCount x departmentCount, non-negative entries, diagonal zero, each entry <= corresponding entry in distanceMatrix",
      expertMeaning: "Optimal distance matrix (theoretical minimum)",
    }
  ],

  formulaPipeline: [
    {
      formulaId: "cost.total_exposure",
      inputMap: {
        "a": "departmentCount",
        "b": "flowMatrix",
        "c": "distanceMatrix"
      },
      outputId: "totalExposure",
    },
    {
      formulaId: "benchmark.variance_percent",
      inputMap: {
        "actual": "departmentCount",
        "target": "flowMatrix"
      },
      outputId: "variancePercent",
    }
  ],

  outputs: [
    {
      id: "totalExposure",
      label: "Total material handling cost",
      unit: "USD",
      format: "currency",
      isBigNumber: true,
    },
    {
      id: "variancePercent",
      label: "Average distance per flow unit",
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
      "Flow volumes are constant over the analysis period",
      "Distances are measured as straight-line or rectilinear between centroids",
      "Unit handling cost is uniform across all moves",
    ],
  },
};
