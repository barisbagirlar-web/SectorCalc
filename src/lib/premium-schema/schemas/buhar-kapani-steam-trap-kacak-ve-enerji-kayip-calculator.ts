import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";

/** P7 nightrun — DeepSeek Chief Engineer schema (factory generated). */
export const BuharKapaniSteamTrapKacakVeEnerjiKayipCalculator_SCHEMA: PremiumCalculatorSchema = {
  id: "buhar-kapani-steam-trap-kacak-ve-enerji-kayip-calculator",
  name: "Buhar Kapani Steam Trap Kacak Ve Enerji Kayip",
  sectorSlug: "general-industrial",
  category: "energy",
  painStatement: "Industrial energy efficiency assessment based on steam properties and orifice flow",

  inputs: [
    {
      id: "powerKw",
      label: "Power rating of steam trap",
      type: "number",
      unit: "kW",
      required: true,
      smartDefault: 100,
      validation: { min: 0, max: 10000 },
      helper: "Non-negative power",
      expertMeaning: "Power rating of steam trap",
    },
    {
      id: "runtimeHours",
      label: "Operating hours per day",
      type: "number",
      unit: "hours",
      required: true,
      smartDefault: 8,
      validation: { min: 0, max: 24 },
      helper: "Hours between 0 and 24",
      expertMeaning: "Operating hours per day",
    },
    {
      id: "energyConsumptionKwh",
      label: "Measured energy consumption",
      type: "number",
      unit: "kWh",
      required: true,
      smartDefault: 800,
      validation: { min: 0, max: 1000000 },
      helper: "Non-negative consumption",
      expertMeaning: "Measured energy consumption",
    },
    {
      id: "tariffPerKwh",
      label: "Energy tariff per kWh",
      type: "number",
      unit: "USD/kWh",
      required: true,
      smartDefault: 0.12,
      validation: { min: 0, max: 10 },
      helper: "Non-negative tariff",
      expertMeaning: "Energy tariff per kWh",
    },
    {
      id: "peakDemandKw",
      label: "Peak demand",
      type: "number",
      unit: "kW",
      required: true,
      smartDefault: 150,
      validation: { min: 0, max: 10000 },
      helper: "Non-negative peak demand",
      expertMeaning: "Peak demand",
    },
    {
      id: "efficiencyPercent",
      label: "Steam trap efficiency",
      type: "number",
      unit: "%",
      required: true,
      smartDefault: 85,
      validation: { min: 1, max: 100, step: 0.1 },
      helper: "Efficiency between 1 and 100",
      expertMeaning: "Steam trap efficiency",
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
      "Steam properties are constant",
      "Leakage rate is representative",
      "No seasonal variation in tariff",
    ],
  },
};
