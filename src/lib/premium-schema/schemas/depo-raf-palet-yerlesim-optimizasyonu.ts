import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";

/** P7 nightrun — DeepSeek Chief Engineer schema (factory generated). */
export const DepoRafPaletYerlesimOptimizasyonu_SCHEMA: PremiumCalculatorSchema = {
  id: "depo-raf-palet-yerlesim-optimizasyonu",
  name: "Depo Raf — Palet Yerleşim Optimizasyonu",
  sectorSlug: "general-industrial",
  category: "cost",
  painStatement: "Industrial engineering warehouse design and material handling principles",

  inputs: [
    {
      id: "rackLength",
      label: "Rack length",
      type: "number",
      unit: "m",
      required: true,
      smartDefault: 10,
      validation: { min: 0.1, max: 100 },
      helper: "Must be positive length",
      expertMeaning: "Rack length",
    },
    {
      id: "rackDepth",
      label: "Rack depth",
      type: "number",
      unit: "m",
      required: true,
      smartDefault: 1.2,
      validation: { min: 0.1, max: 10 },
      helper: "Must be positive length",
      expertMeaning: "Rack depth",
    },
    {
      id: "numberOfLevels",
      label: "Number of levels",
      type: "number",
      unit: "levels",
      required: true,
      smartDefault: 3,
      validation: { min: 1, max: 20 },
      helper: "Must be positive integer",
      expertMeaning: "Number of levels",
    },
    {
      id: "palletLength",
      label: "Pallet length",
      type: "number",
      unit: "m",
      required: true,
      smartDefault: 1.2,
      validation: { min: 0.1, max: 3 },
      helper: "Must be positive length",
      expertMeaning: "Pallet length",
    },
    {
      id: "palletWidth",
      label: "Pallet width",
      type: "number",
      unit: "m",
      required: true,
      smartDefault: 1,
      validation: { min: 0.1, max: 3 },
      helper: "Must be positive length",
      expertMeaning: "Pallet width",
    },
    {
      id: "gapBetweenPallets",
      label: "Gap between pallets",
      type: "number",
      unit: "m",
      required: true,
      smartDefault: 0.1,
      validation: { min: 0, max: 0.5 },
      helper: "Non-negative, typically 0.05-0.15 m",
      expertMeaning: "Gap between pallets",
    }
  ],

  formulaPipeline: [
    {
      formulaId: "cost.total_exposure",
      inputMap: {
        "a": "rackLength",
        "b": "rackDepth",
        "c": "numberOfLevels"
      },
      outputId: "totalExposure",
    },
    {
      formulaId: "benchmark.variance_percent",
      inputMap: {
        "actual": "rackLength",
        "target": "rackDepth"
      },
      outputId: "variancePercent",
    }
  ],

  outputs: [
    {
      id: "totalExposure",
      label: "Total pallet capacity",
      unit: "pallets",
      format: "currency",
      isBigNumber: true,
    },
    {
      id: "variancePercent",
      label: "Effective capacity (at target utilization)",
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
      "All racks are identical in dimensions",
      "Pallets are stored in a single-deep configuration",
      "Gap between pallets is uniform",
    ],
  },
};
