import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";

/** P7 nightrun — DeepSeek Chief Engineer schema (factory generated). */
export const LpgBenzinTasarrufKarsilastirma_SCHEMA: PremiumCalculatorSchema = {
  id: "lpg-benzin-tasarruf-karsilastirma",
  name: "LPG — Benzin Tasarruf Karşılaştırma",
  sectorSlug: "general-industrial",
  category: "cost",
  painStatement: "Operational cost analysis for dual-fuel vehicles",

  inputs: [
    {
      id: "monthlyDistanceKm",
      label: "Monthly distance driven",
      type: "number",
      unit: "km",
      required: true,
      smartDefault: 1000,
      validation: { min: 1, max: 100000 },
      helper: "Must be positive distance",
      expertMeaning: "Monthly distance driven",
    },
    {
      id: "gasolineFuelEfficiency",
      label: "Gasoline fuel efficiency",
      type: "number",
      unit: "km/L",
      required: true,
      smartDefault: 12,
      validation: { min: 1, max: 50 },
      helper: "Must be positive km/L",
      expertMeaning: "Gasoline fuel efficiency",
    },
    {
      id: "lpgFuelEfficiency",
      label: "LPG fuel efficiency",
      type: "number",
      unit: "km/L",
      required: true,
      smartDefault: 10,
      validation: { min: 1, max: 50 },
      helper: "Must be positive km/L",
      expertMeaning: "LPG fuel efficiency",
    },
    {
      id: "gasolinePricePerLiter",
      label: "Gasoline price per liter",
      type: "number",
      unit: "currency",
      required: true,
      smartDefault: 1.5,
      validation: { min: 0, max: 100 },
      helper: "Non-negative price",
      expertMeaning: "Gasoline price per liter",
    },
    {
      id: "lpgPricePerLiter",
      label: "LPG price per liter",
      type: "number",
      unit: "currency",
      required: true,
      smartDefault: 0.8,
      validation: { min: 0, max: 100 },
      helper: "Non-negative price",
      expertMeaning: "LPG price per liter",
    }
  ],

  formulaPipeline: [
    {
      formulaId: "cost.total_exposure",
      inputMap: {
        "a": "monthlyDistanceKm",
        "b": "gasolineFuelEfficiency",
        "c": "lpgFuelEfficiency"
      },
      outputId: "totalExposure",
    },
    {
      formulaId: "benchmark.variance_percent",
      inputMap: {
        "actual": "monthlyDistanceKm",
        "target": "gasolineFuelEfficiency"
      },
      outputId: "variancePercent",
    }
  ],

  outputs: [
    {
      id: "totalExposure",
      label: "Monthly savings",
      unit: "currency",
      format: "currency",
      isBigNumber: true,
    },
    {
      id: "variancePercent",
      label: "Annual savings",
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
      "Fuel efficiencies are constant under typical driving conditions",
      "Fuel prices are per liter and include all taxes",
      "No maintenance or conversion costs considered",
    ],
  },
};
