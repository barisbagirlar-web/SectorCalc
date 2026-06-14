import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";

/** P7 nightrun — DeepSeek Chief Engineer schema (factory generated). */
export const FiyatArtisiVeTalepEsnekligiKarlilikSimulasyonCalculator_SCHEMA: PremiumCalculatorSchema = {
  id: "fiyat-artisi-ve-talep-esnekligi-karlilik-simulasyon-calculator",
  name: "Fiyat Artisi Ve Talep Esnekligi Karlilik Simulasyon",
  sectorSlug: "general-industrial",
  category: "cost",
  painStatement: "Microeconomic pricing theory and cost accounting",

  inputs: [
    {
      id: "currentPrice",
      label: "Current price per unit",
      type: "number",
      unit: "USD",
      required: true,
      smartDefault: 100,
      validation: { min: 0.01, max: 1000000 },
      helper: "Must be positive",
      expertMeaning: "Current price per unit",
    },
    {
      id: "currentQuantity",
      label: "Current quantity sold",
      type: "number",
      unit: "units",
      required: true,
      smartDefault: 1000,
      validation: { min: 1, max: 100000000 },
      helper: "Must be positive integer",
      expertMeaning: "Current quantity sold",
    },
    {
      id: "priceElasticity",
      label: "Price elasticity of demand",
      type: "number",
      unit: "dimensionless",
      required: true,
      smartDefault: -1.5,
      validation: { min: -10, max: 0 },
      helper: "Must be negative (typically between -5 and 0)",
      expertMeaning: "Price elasticity of demand",
    },
    {
      id: "newPrice",
      label: "New price per unit",
      type: "number",
      unit: "USD",
      required: true,
      smartDefault: 110,
      validation: { min: 0.01, max: 1000000 },
      helper: "Must be positive",
      expertMeaning: "New price per unit",
    },
    {
      id: "directMaterialCost",
      label: "Direct material cost per unit",
      type: "number",
      unit: "USD",
      required: true,
      smartDefault: 30,
      validation: { min: 0, max: 100000 },
      helper: "Non-negative",
      expertMeaning: "Direct material cost per unit",
    },
    {
      id: "directLaborCost",
      label: "Direct labor cost per unit",
      type: "number",
      unit: "USD",
      required: true,
      smartDefault: 20,
      validation: { min: 0, max: 100000 },
      helper: "Non-negative",
      expertMeaning: "Direct labor cost per unit",
    }
  ],

  formulaPipeline: [
    {
      formulaId: "cost.total_exposure",
      inputMap: {
        "a": "currentPrice",
        "b": "currentQuantity",
        "c": "priceElasticity"
      },
      outputId: "totalExposure",
    },
    {
      formulaId: "benchmark.variance_percent",
      inputMap: {
        "actual": "currentPrice",
        "target": "currentQuantity"
      },
      outputId: "variancePercent",
    }
  ],

  outputs: [
    {
      id: "totalExposure",
      label: "Current profit",
      unit: "USD",
      format: "currency",
      isBigNumber: true,
    },
    {
      id: "variancePercent",
      label: "Current gross margin",
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
      "Linear demand response within the price change range",
      "Constant unit variable costs (no economies of scale)",
      "Fixed overhead and contingency remain unchanged",
    ],
  },
};
