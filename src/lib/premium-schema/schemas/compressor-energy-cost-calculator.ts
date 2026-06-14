import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";

/** P7 nightrun — DeepSeek Chief Engineer schema (factory generated). */
export const CompressorEnergyCostCalculator_SCHEMA: PremiumCalculatorSchema = {
  id: "compressor-energy-cost-calculator",
  name: "Compressor Energy Cost",
  sectorSlug: "general-industrial",
  category: "energy",
  painStatement: "Industrial engineering energy accounting and cost analysis",

  inputs: [
    {
      id: "powerKw",
      label: "Compressor power",
      type: "number",
      unit: "kW",
      required: true,
      smartDefault: 100,
      validation: { min: 0.1, max: 10000 },
      helper: "Must be positive power rating",
      expertMeaning: "Compressor power",
    },
    {
      id: "runtimeHours",
      label: "Daily runtime",
      type: "number",
      unit: "hours",
      required: true,
      smartDefault: 8,
      validation: { min: 0, max: 24 },
      helper: "Hours per day between 0 and 24",
      expertMeaning: "Daily runtime",
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
      id: "efficiencyPercent",
      label: "Compressor efficiency",
      type: "number",
      unit: "%",
      required: true,
      smartDefault: 85,
      validation: { min: 1, max: 100, step: 0.1 },
      helper: "Efficiency between 1 and 100",
      expertMeaning: "Compressor efficiency",
    },
    {
      id: "lossPercent",
      label: "System loss percentage",
      type: "number",
      unit: "%",
      required: true,
      smartDefault: 5,
      validation: { min: 0, max: 100, step: 0.1 },
      helper: "Loss between 0 and 100",
      expertMeaning: "System loss percentage",
    },
    {
      id: "operatingDays",
      label: "Operating days per year",
      type: "number",
      unit: "days",
      required: true,
      smartDefault: 250,
      validation: { min: 1, max: 365 },
      helper: "Days between 1 and 365",
      expertMeaning: "Operating days per year",
    }
  ],

  formulaPipeline: [
    {
      formulaId: "cost.total_exposure",
      inputMap: {
        "a": "powerKw",
        "b": "runtimeHours",
        "c": "tariffPerKwh"
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
      label: "Total annual energy cost",
      unit: "USD",
      format: "currency",
      isBigNumber: true,
    },
    {
      id: "variancePercent",
      label: "Annual cost saving (if improved)",
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
      "Compressor operates at constant power during runtime",
      "Tariff is flat rate (no time-of-use variation)",
      "Loss percentage includes all system losses (leaks, friction, etc.)",
    ],
  },
};
