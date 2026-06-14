import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";

/** P7 nightrun — DeepSeek Chief Engineer schema (factory generated). */
export const TopolojiOptimizasyonuHafiflikVeYakitTasarrufuCalculator_SCHEMA: PremiumCalculatorSchema = {
  id: "topoloji-optimizasyonu-hafiflik-ve-yakit-tasarrufu-calculator",
  name: "Topoloji Optimizasyonu Hafiflik Ve Yakit Tasarrufu",
  sectorSlug: "general-industrial",
  category: "cost",
  painStatement: "Automotive and aerospace lightweighting cost-benefit analysis based on mass reduction and fuel consumption correlation",

  inputs: [
    {
      id: "originalWeight",
      label: "Original component weight",
      type: "number",
      unit: "kg",
      required: true,
      smartDefault: 100,
      validation: { min: 0.1, max: 10000 },
      helper: "Must be positive",
      expertMeaning: "Original component weight",
    },
    {
      id: "optimizedWeight",
      label: "Optimized component weight",
      type: "number",
      unit: "kg",
      required: true,
      smartDefault: 80,
      validation: { min: 0, max: 10000 },
      helper: "Must be non-negative and less than original weight",
      expertMeaning: "Optimized component weight",
    },
    {
      id: "annualDistanceKm",
      label: "Annual distance traveled",
      type: "number",
      unit: "km",
      required: true,
      smartDefault: 20000,
      validation: { min: 1, max: 500000 },
      helper: "Must be positive",
      expertMeaning: "Annual distance traveled",
    },
    {
      id: "fuelPricePerLiter",
      label: "Fuel price per liter",
      type: "number",
      unit: "USD",
      required: true,
      smartDefault: 1.5,
      validation: { min: 0.01, max: 10 },
      helper: "Must be positive",
      expertMeaning: "Fuel price per liter",
    },
    {
      id: "additionalCost",
      label: "Additional cost for optimization",
      type: "number",
      unit: "USD",
      required: true,
      smartDefault: 500,
      validation: { min: 0, max: 1000000 },
      helper: "Non-negative",
      expertMeaning: "Additional cost for optimization",
    },
    {
      id: "lifetimeYears",
      label: "Vehicle lifetime in years",
      type: "number",
      unit: "years",
      required: true,
      smartDefault: 10,
      validation: { min: 1, max: 50 },
      helper: "Must be positive integer",
      expertMeaning: "Vehicle lifetime in years",
    }
  ],

  formulaPipeline: [
    {
      formulaId: "cost.total_exposure",
      inputMap: {
        "a": "originalWeight",
        "b": "optimizedWeight",
        "c": "annualDistanceKm"
      },
      outputId: "totalExposure",
    },
    {
      formulaId: "benchmark.variance_percent",
      inputMap: {
        "actual": "originalWeight",
        "target": "optimizedWeight"
      },
      outputId: "variancePercent",
    }
  ],

  outputs: [
    {
      id: "totalExposure",
      label: "Weight reduction",
      unit: "kg",
      format: "currency",
      isBigNumber: true,
    },
    {
      id: "variancePercent",
      label: "Annual fuel savings",
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
      "Fuel reduction factor is 0.35 L/100km per 100kg (typical for passenger vehicles)",
      "Fuel price and discount rate constant over lifetime",
      "No inflation or maintenance cost changes",
    ],
  },
};
