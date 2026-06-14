import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";

/** P7 nightrun — DeepSeek Chief Engineer schema (factory generated). */
export const DepoYerlesimiVeToplamaRotasiOptimizasyonCalculator_SCHEMA: PremiumCalculatorSchema = {
  id: "depo-yerlesimi-ve-toplama-rotasi-optimizasyon-calculator",
  name: "Depo Yerlesimi Ve Toplama Rotasi Optimizasyon",
  sectorSlug: "general-industrial",
  category: "cost",
  painStatement: "Industrial engineering warehouse design and material handling principles",

  inputs: [
    {
      id: "pickQuantity",
      label: "Pick quantity per cycle",
      type: "number",
      unit: "units",
      required: true,
      smartDefault: 100,
      validation: { min: 1, max: 10000 },
      helper: "Must be positive integer",
      expertMeaning: "Pick quantity per cycle",
    },
    {
      id: "averageTravelDistancePerPick",
      label: "Average travel distance per pick",
      type: "number",
      unit: "m",
      required: true,
      smartDefault: 50,
      validation: { min: 0.1, max: 1000 },
      helper: "Must be positive distance",
      expertMeaning: "Average travel distance per pick",
    },
    {
      id: "optimalRouteDistance",
      label: "Optimal route distance",
      type: "number",
      unit: "m",
      required: true,
      smartDefault: 30,
      validation: { min: 0.1, max: 1000 },
      helper: "Must be less than or equal to actual distance",
      expertMeaning: "Optimal route distance",
    },
    {
      id: "laborRatePerHour",
      label: "Labor rate per hour",
      type: "number",
      unit: "USD",
      required: true,
      smartDefault: 25,
      validation: { min: 0, max: 200 },
      helper: "Non-negative currency",
      expertMeaning: "Labor rate per hour",
    },
    {
      id: "averageTravelSpeed",
      label: "Average travel speed",
      type: "number",
      unit: "m/min",
      required: true,
      smartDefault: 60,
      validation: { min: 0.1, max: 200 },
      helper: "Must be positive",
      expertMeaning: "Average travel speed",
    },
    {
      id: "slottingScore",
      label: "Slotting score (0-100)",
      type: "number",
      unit: "%",
      required: true,
      smartDefault: 70,
      validation: { min: 0, max: 100, step: 0.1 },
      helper: "Percent between 0 and 100",
      expertMeaning: "Slotting score (0-100)",
    }
  ],

  formulaPipeline: [
    {
      formulaId: "cost.total_exposure",
      inputMap: {
        "a": "pickQuantity",
        "b": "averageTravelDistancePerPick",
        "c": "optimalRouteDistance"
      },
      outputId: "totalExposure",
    },
    {
      formulaId: "benchmark.variance_percent",
      inputMap: {
        "actual": "pickQuantity",
        "target": "averageTravelDistancePerPick"
      },
      outputId: "variancePercent",
    }
  ],

  outputs: [
    {
      id: "totalExposure",
      label: "Total travel distance per cycle",
      unit: "m",
      format: "currency",
      isBigNumber: true,
    },
    {
      id: "variancePercent",
      label: "Pick path efficiency",
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
      "All picks are performed in a single cycle",
      "Travel speed is constant and includes no delays",
      "Optimal route distance is achievable",
    ],
  },
};
