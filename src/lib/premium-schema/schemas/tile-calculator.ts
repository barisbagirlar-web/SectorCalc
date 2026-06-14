import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";

/** P7 nightrun — DeepSeek Chief Engineer schema (factory generated). */
export const TileCalculator_SCHEMA: PremiumCalculatorSchema = {
  id: "tile-calculator",
  name: "Tile Calculator",
  sectorSlug: "general-industrial",
  category: "cost",
  painStatement: "Construction cost estimation standard",

  inputs: [
    {
      id: "length",
      label: "Room length",
      type: "number",
      unit: "m",
      required: true,
      smartDefault: 5,
      validation: { min: 0.01, max: 100 },
      helper: "Must be positive length",
      expertMeaning: "Room length",
    },
    {
      id: "width",
      label: "Room width",
      type: "number",
      unit: "m",
      required: true,
      smartDefault: 4,
      validation: { min: 0.01, max: 100 },
      helper: "Must be positive width",
      expertMeaning: "Room width",
    },
    {
      id: "wasteRate",
      label: "Waste rate",
      type: "number",
      unit: "%",
      required: true,
      smartDefault: 10,
      validation: { min: 0, max: 50, step: 0.1 },
      helper: "Percent between 0 and 50",
      expertMeaning: "Waste rate",
    },
    {
      id: "tileCoveragePerUnit",
      label: "Tile coverage per unit",
      type: "number",
      unit: "m²",
      required: true,
      smartDefault: 0.25,
      validation: { min: 0.01, max: 10 },
      helper: "Must be positive area",
      expertMeaning: "Tile coverage per unit",
    },
    {
      id: "unitTileCost",
      label: "Unit tile cost",
      type: "number",
      unit: "USD",
      required: true,
      smartDefault: 5,
      validation: { min: 0, max: 1000 },
      helper: "Non-negative currency",
      expertMeaning: "Unit tile cost",
    },
    {
      id: "laborCost",
      label: "Labor cost",
      type: "number",
      unit: "USD",
      required: true,
      smartDefault: 200,
      validation: { min: 0, max: 100000 },
      helper: "Non-negative currency",
      expertMeaning: "Labor cost",
    }
  ],

  formulaPipeline: [
    {
      formulaId: "cost.total_exposure",
      inputMap: {
        "a": "length",
        "b": "width",
        "c": "wasteRate"
      },
      outputId: "totalExposure",
    },
    {
      formulaId: "benchmark.variance_percent",
      inputMap: {
        "actual": "length",
        "target": "width"
      },
      outputId: "variancePercent",
    }
  ],

  outputs: [
    {
      id: "totalExposure",
      label: "Total cost",
      unit: "USD",
      format: "currency",
      isBigNumber: true,
    },
    {
      id: "variancePercent",
      label: "Cost per square meter",
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
      "Room is rectangular",
      "Tile coverage per unit is constant",
      "Waste rate includes breakage and cutting losses",
    ],
  },
};
