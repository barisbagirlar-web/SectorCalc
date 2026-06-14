import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";

/** P7 nightrun — DeepSeek Chief Engineer schema (factory generated). */
export const DizelBenzinMaliyetKarsilastirma_SCHEMA: PremiumCalculatorSchema = {
  id: "dizel-benzin-maliyet-karsilastirma",
  name: "Dizel — Benzin Maliyet Karşılaştırma",
  sectorSlug: "general-industrial",
  category: "cost",
  painStatement: "Standard cost accounting for fuel alternatives",

  inputs: [
    {
      id: "annualMileage",
      label: "Annual mileage",
      type: "number",
      unit: "km",
      required: true,
      smartDefault: 20000,
      validation: { min: 1, max: 1000000 },
      helper: "Must be positive",
      expertMeaning: "Annual mileage",
    },
    {
      id: "fuelEfficiencyDiesel",
      label: "Diesel fuel efficiency",
      type: "number",
      unit: "km/L",
      required: true,
      smartDefault: 20,
      validation: { min: 0.1, max: 50 },
      helper: "Must be positive",
      expertMeaning: "Diesel fuel efficiency",
    },
    {
      id: "fuelEfficiencyGasoline",
      label: "Gasoline fuel efficiency",
      type: "number",
      unit: "km/L",
      required: true,
      smartDefault: 15,
      validation: { min: 0.1, max: 50 },
      helper: "Must be positive",
      expertMeaning: "Gasoline fuel efficiency",
    },
    {
      id: "fuelPriceDiesel",
      label: "Diesel fuel price per liter",
      type: "number",
      unit: "USD/L",
      required: true,
      smartDefault: 1.5,
      validation: { min: 0.001, max: 100 },
      helper: "Must be positive",
      expertMeaning: "Diesel fuel price per liter",
    },
    {
      id: "fuelPriceGasoline",
      label: "Gasoline fuel price per liter",
      type: "number",
      unit: "USD/L",
      required: true,
      smartDefault: 1.6,
      validation: { min: 0.001, max: 100 },
      helper: "Must be positive",
      expertMeaning: "Gasoline fuel price per liter",
    }
  ],

  formulaPipeline: [
    {
      formulaId: "cost.total_exposure",
      inputMap: {
        "a": "annualMileage",
        "b": "fuelEfficiencyDiesel",
        "c": "fuelEfficiencyGasoline"
      },
      outputId: "totalExposure",
    },
    {
      formulaId: "benchmark.variance_percent",
      inputMap: {
        "actual": "annualMileage",
        "target": "fuelEfficiencyDiesel"
      },
      outputId: "variancePercent",
    }
  ],

  outputs: [
    {
      id: "totalExposure",
      label: "Total annual diesel cost",
      unit: "USD",
      format: "currency",
      isBigNumber: true,
    },
    {
      id: "variancePercent",
      label: "Total annual gasoline cost",
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
      "Fuel prices are constant over the year",
      "Driving conditions are consistent",
      "Vehicle maintenance costs are not considered",
    ],
  },
};
