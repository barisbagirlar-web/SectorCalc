import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";

/** P7 nightrun — DeepSeek Chief Engineer schema (factory generated). */
export const AtikYonetimiVeBertarafMaliyetOptimizasyonCalculator_SCHEMA: PremiumCalculatorSchema = {
  id: "atik-yonetimi-ve-bertaraf-maliyet-optimizasyon-calculator",
  name: "Atik Yonetimi Ve Bertaraf Maliyet Optimizasyon",
  sectorSlug: "general-industrial",
  category: "cost",
  painStatement: "Industrial engineering cost accounting and waste management standards",

  inputs: [
    {
      id: "wasteVolume",
      label: "Waste volume",
      type: "number",
      unit: "metric tons",
      required: true,
      smartDefault: 100,
      validation: { min: 0.001, max: 1000000 },
      helper: "Must be positive",
      expertMeaning: "Waste volume",
    },
    {
      id: "disposalUnitCost",
      label: "Disposal unit cost",
      type: "number",
      unit: "USD/ton",
      required: true,
      smartDefault: 50,
      validation: { min: 0, max: 10000 },
      helper: "Non-negative",
      expertMeaning: "Disposal unit cost",
    },
    {
      id: "transportCostPerTon",
      label: "Transport cost per ton",
      type: "number",
      unit: "USD/ton",
      required: true,
      smartDefault: 10,
      validation: { min: 0, max: 5000 },
      helper: "Non-negative",
      expertMeaning: "Transport cost per ton",
    },
    {
      id: "recyclingRatePercent",
      label: "Recycling rate",
      type: "number",
      unit: "%",
      required: true,
      smartDefault: 20,
      validation: { min: 0, max: 100, step: 0.1 },
      helper: "Percent between 0 and 100",
      expertMeaning: "Recycling rate",
    },
    {
      id: "recyclingRevenuePerTon",
      label: "Recycling revenue per ton",
      type: "number",
      unit: "USD/ton",
      required: true,
      smartDefault: 5,
      validation: { min: 0, max: 10000 },
      helper: "Non-negative",
      expertMeaning: "Recycling revenue per ton",
    },
    {
      id: "complianceCostPerTon",
      label: "Compliance cost per ton",
      type: "number",
      unit: "USD/ton",
      required: true,
      smartDefault: 2,
      validation: { min: 0, max: 5000 },
      helper: "Non-negative",
      expertMeaning: "Compliance cost per ton",
    }
  ],

  formulaPipeline: [
    {
      formulaId: "cost.total_exposure",
      inputMap: {
        "a": "wasteVolume",
        "b": "disposalUnitCost",
        "c": "transportCostPerTon"
      },
      outputId: "totalExposure",
    },
    {
      formulaId: "benchmark.variance_percent",
      inputMap: {
        "actual": "wasteVolume",
        "target": "disposalUnitCost"
      },
      outputId: "variancePercent",
    }
  ],

  outputs: [
    {
      id: "totalExposure",
      label: "Total disposal cost",
      unit: "USD",
      format: "currency",
      isBigNumber: true,
    },
    {
      id: "variancePercent",
      label: "Net cost per ton",
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
      "Waste composition is homogeneous",
      "Disposal unit cost is constant per ton",
      "Transport cost is linear with volume",
    ],
  },
};
