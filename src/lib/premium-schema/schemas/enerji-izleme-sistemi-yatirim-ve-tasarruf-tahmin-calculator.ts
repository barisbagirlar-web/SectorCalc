import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";

/** P7 nightrun — DeepSeek Chief Engineer schema (factory generated). */
export const EnerjiIzlemeSistemiYatirimVeTasarrufTahminCalculator_SCHEMA: PremiumCalculatorSchema = {
  id: "enerji-izleme-sistemi-yatirim-ve-tasarruf-tahmin-calculator",
  name: "Enerji Izleme Sistemi Yatirim Ve Tasarruf Tahmin",
  sectorSlug: "general-industrial",
  category: "cost",
  painStatement: "Industrial energy management accounting (ISO 50001, ASHRAE)",

  inputs: [
    {
      id: "powerKw",
      label: "Power rating",
      type: "number",
      unit: "kW",
      required: true,
      smartDefault: 100,
      validation: { min: 0, max: 100000 },
      helper: "Non-negative power",
      expertMeaning: "Power rating",
    },
    {
      id: "runtimeHours",
      label: "Daily runtime",
      type: "number",
      unit: "hours",
      required: true,
      smartDefault: 8,
      validation: { min: 0, max: 24 },
      helper: "Hours between 0 and 24",
      expertMeaning: "Daily runtime",
    },
    {
      id: "energyConsumptionKwh",
      label: "Daily energy consumption",
      type: "number",
      unit: "kWh",
      required: true,
      smartDefault: 800,
      validation: { min: 0, max: 1000000 },
      helper: "Non-negative energy",
      expertMeaning: "Daily energy consumption",
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
      validation: { min: 0, max: 100000 },
      helper: "Non-negative peak demand",
      expertMeaning: "Peak demand",
    },
    {
      id: "efficiencyPercent",
      label: "System efficiency",
      type: "number",
      unit: "%",
      required: true,
      smartDefault: 85,
      validation: { min: 1, max: 100, step: 0.1 },
      helper: "Efficiency between 1 and 100",
      expertMeaning: "System efficiency",
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
      label: "Baseline annual energy cost",
      unit: "USD",
      format: "currency",
      isBigNumber: true,
    },
    {
      id: "variancePercent",
      label: "Improved annual energy cost",
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
      "Constant tariff throughout the year",
      "Linear relationship between consumption and cost",
      "No demand charges or time-of-use rates",
    ],
  },
};
