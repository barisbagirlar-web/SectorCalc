import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";

/** P7 nightrun — DeepSeek Chief Engineer schema (factory generated). */
export const KwhCostCalculator_SCHEMA: PremiumCalculatorSchema = {
  id: "kwh-cost-calculator",
  name: "kWh Cost Calculator",
  sectorSlug: "general-industrial",
  category: "energy",
  painStatement: "Industrial engineering energy accounting",

  inputs: [
    {
      id: "powerKw",
      label: "Power rating",
      type: "number",
      unit: "kW",
      required: true,
      smartDefault: 100,
      validation: { min: 0, max: 1000000 },
      helper: "Non-negative power",
      expertMeaning: "Power rating",
    },
    {
      id: "runtimeHours",
      label: "Runtime per day",
      type: "number",
      unit: "hours",
      required: true,
      smartDefault: 8,
      validation: { min: 0, max: 24 },
      helper: "Hours between 0 and 24",
      expertMeaning: "Runtime per day",
    },
    {
      id: "energyConsumptionKwh",
      label: "Energy consumption",
      type: "number",
      unit: "kWh",
      required: true,
      smartDefault: 800,
      validation: { min: 0, max: 100000000 },
      helper: "Non-negative consumption",
      expertMeaning: "Energy consumption",
    },
    {
      id: "tariffPerKwh",
      label: "Electricity tariff",
      type: "number",
      unit: "USD/kWh",
      required: true,
      smartDefault: 0.12,
      validation: { min: 0, max: 10 },
      helper: "Non-negative tariff",
      expertMeaning: "Electricity tariff",
    },
    {
      id: "peakDemandKw",
      label: "Peak demand",
      type: "number",
      unit: "kW",
      required: true,
      smartDefault: 150,
      validation: { min: 0, max: 1000000 },
      helper: "Non-negative peak demand",
      expertMeaning: "Peak demand",
    },
    {
      id: "efficiencyPercent",
      label: "Efficiency",
      type: "number",
      unit: "%",
      required: true,
      smartDefault: 90,
      validation: { min: 1, max: 100, step: 0.1 },
      helper: "Efficiency between 1 and 100",
      expertMeaning: "Efficiency",
    }
  ],

  formulaPipeline: [
    {
      formulaId: "cost.total_exposure",
      inputMap: {
        "a": "powerKw",
        "b": "runtimeHours",
        "c": "energyConsumptionKwh"
      },
      outputId: "totalExposure",
    },
    {
      formulaId: "benchmark.variance_percent",
      inputMap: {
        "actual": "powerKw",
        "target": "runtimeHours"
      },
      outputId: "variancePercent",
    }
  ],

  outputs: [
    {
      id: "totalExposure",
      label: "Baseline energy cost",
      unit: "USD",
      format: "currency",
      isBigNumber: true,
    },
    {
      id: "variancePercent",
      label: "Adjusted energy consumption",
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
      "Stable tariff rates",
      "Linear relationship between consumption and cost",
      "Efficiency and loss percentages are representative",
    ],
  },
};
