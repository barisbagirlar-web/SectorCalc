import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";

/** P7 nightrun — DeepSeek Chief Engineer schema (factory generated). */
export const AkuKapasitesiCalismaSuresiHesabi_SCHEMA: PremiumCalculatorSchema = {
  id: "aku-kapasitesi-calisma-suresi-hesabi",
  name: "Akü Kapasitesi — Çalışma Süresi Calculation",
  sectorSlug: "general-industrial",
  category: "cost",
  painStatement: "IEEE 485 / IEC 60896 lead-acid battery sizing standard adapted for runtime",

  inputs: [
    {
      id: "nominalCapacityAh",
      label: "Nominal battery capacity",
      type: "number",
      unit: "Ah",
      required: true,
      smartDefault: 100,
      validation: { min: 1, max: 10000 },
      helper: "Must be positive integer",
      expertMeaning: "Nominal battery capacity",
    },
    {
      id: "depthOfDischargePercent",
      label: "Depth of discharge",
      type: "number",
      unit: "%",
      required: true,
      smartDefault: 80,
      validation: { min: 0, max: 100, step: 0.1 },
      helper: "Percent between 0 and 100",
      expertMeaning: "Depth of discharge",
    },
    {
      id: "loadCurrentA",
      label: "Load current",
      type: "number",
      unit: "A",
      required: true,
      smartDefault: 10,
      validation: { min: 0.1, max: 10000 },
      helper: "Must be positive",
      expertMeaning: "Load current",
    },
    {
      id: "loadFactor",
      label: "Load factor (duty cycle)",
      type: "number",
      unit: "ratio",
      required: true,
      smartDefault: 1,
      validation: { min: 0.1, max: 1 },
      helper: "Between 0.1 and 1",
      expertMeaning: "Load factor (duty cycle)",
    },
    {
      id: "temperatureC",
      label: "Ambient temperature",
      type: "number",
      unit: "°C",
      required: true,
      smartDefault: 25,
      validation: { min: -20, max: 60 },
      helper: "Between -20 and 60",
      expertMeaning: "Ambient temperature",
    },
    {
      id: "agingFactor",
      label: "Aging factor (end-of-life derating)",
      type: "number",
      unit: "ratio",
      required: true,
      smartDefault: 0.8,
      validation: { min: 0.5, max: 1 },
      helper: "Between 0.5 and 1",
      expertMeaning: "Aging factor (end-of-life derating)",
    }
  ],

  formulaPipeline: [
    {
      formulaId: "cost.total_exposure",
      inputMap: {
        "a": "nominalCapacityAh",
        "b": "depthOfDischargePercent",
        "c": "loadCurrentA"
      },
      outputId: "totalExposure",
    },
    {
      formulaId: "benchmark.variance_percent",
      inputMap: {
        "actual": "nominalCapacityAh",
        "target": "depthOfDischargePercent"
      },
      outputId: "variancePercent",
    }
  ],

  outputs: [
    {
      id: "totalExposure",
      label: "Estimated runtime",
      unit: "hours",
      format: "currency",
      isBigNumber: true,
    },
    {
      id: "variancePercent",
      label: "Usable capacity",
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
      "Battery is lead-acid type; derating curve based on IEEE 485",
      "Load is constant; pulsed loads not modeled",
      "Aging factor represents 80% of initial capacity at end of life",
    ],
  },
};
