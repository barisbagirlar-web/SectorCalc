import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";

/** P7 nightrun — DeepSeek Chief Engineer schema (factory generated). */
export const VakumSistemiKacakVeEnerjiKayipCalculator_SCHEMA: PremiumCalculatorSchema = {
  id: "vakum-sistemi-kacak-ve-enerji-kayip-calculator",
  name: "Vakum Sistemi Kacak Ve Enerji Kayip",
  sectorSlug: "general-industrial",
  category: "cost",
  painStatement: "Industrial energy efficiency analysis based on leakage flow and compressor power",

  inputs: [
    {
      id: "powerKw",
      label: "Vacuum pump power",
      type: "number",
      unit: "kW",
      required: true,
      smartDefault: 75,
      validation: { min: 0, max: 10000 },
      helper: "Non-negative power",
      expertMeaning: "Vacuum pump power",
    },
    {
      id: "runtimeHours",
      label: "Daily runtime",
      type: "number",
      unit: "hours",
      required: true,
      smartDefault: 16,
      validation: { min: 0, max: 24 },
      helper: "Between 0 and 24",
      expertMeaning: "Daily runtime",
    },
    {
      id: "operatingDays",
      label: "Operating days per year",
      type: "number",
      unit: "days",
      required: true,
      smartDefault: 300,
      validation: { min: 1, max: 365 },
      helper: "Between 1 and 365",
      expertMeaning: "Operating days per year",
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
      id: "leakagePercent",
      label: "Estimated leakage rate",
      type: "number",
      unit: "%",
      required: true,
      smartDefault: 20,
      validation: { min: 0, max: 100, step: 0.1 },
      helper: "Percent between 0 and 100",
      expertMeaning: "Estimated leakage rate",
    },
    {
      id: "investmentCost",
      label: "Investment cost for leak repair",
      type: "number",
      unit: "USD",
      required: false,
      smartDefault: 5000,
      validation: { min: 0, max: 1000000 },
      helper: "Non-negative cost",
      expertMeaning: "Investment cost for leak repair",
    }
  ],

  formulaPipeline: [
    {
      formulaId: "cost.total_exposure",
      inputMap: {
        "a": "powerKw",
        "b": "runtimeHours",
        "c": "operatingDays"
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
      label: "Baseline annual energy consumption",
      unit: "kWh",
      format: "currency",
      isBigNumber: true,
    },
    {
      id: "variancePercent",
      label: "Annual energy loss due to leakage",
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
      "Leakage rate is constant over time",
      "Electricity tariff is flat (no time-of-use)",
      "Vacuum pump operates at constant load",
    ],
  },
};
