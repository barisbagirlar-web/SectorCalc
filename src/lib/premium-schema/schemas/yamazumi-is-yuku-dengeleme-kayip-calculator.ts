import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";

/** P7 nightrun — DeepSeek Chief Engineer schema (factory generated). */
export const YamazumiIsYukuDengelemeKayipCalculator_SCHEMA: PremiumCalculatorSchema = {
  id: "yamazumi-is-yuku-dengeleme-kayip-calculator",
  name: "Yamazumi Is Yuku Dengeleme Kayip",
  sectorSlug: "general-industrial",
  category: "cost",
  painStatement: "Lean manufacturing / Takt time balancing",

  inputs: [
    {
      id: "availableWorkTimePerShift",
      label: "Available work time per shift",
      type: "number",
      unit: "minutes",
      required: true,
      smartDefault: 480,
      validation: { min: 1, max: 1440 },
      helper: "Must be positive, typical shift 480 min",
      expertMeaning: "Available work time per shift",
    },
    {
      id: "requiredQuantityPerShift",
      label: "Required quantity per shift",
      type: "number",
      unit: "units",
      required: true,
      smartDefault: 100,
      validation: { min: 1, max: 100000 },
      helper: "Must be positive integer",
      expertMeaning: "Required quantity per shift",
    },
    {
      id: "numberOfStations",
      label: "Number of stations",
      type: "number",
      unit: "stations",
      required: true,
      smartDefault: 5,
      validation: { min: 1, max: 100 },
      helper: "Must be positive integer",
      expertMeaning: "Number of stations",
    },
    {
      id: "stationCycleTimes",
      label: "Station cycle times (comma-separated)",
      type: "number",
      unit: "seconds",
      required: true,
      smartDefault: 1,
      validation: { min: 0, max: 3600 },
      helper: "Comma-separated list of positive numbers, count equals number of stations",
      expertMeaning: "Station cycle times (comma-separated)",
    }
  ],

  formulaPipeline: [
    {
      formulaId: "cost.total_exposure",
      inputMap: {
        "a": "availableWorkTimePerShift",
        "b": "requiredQuantityPerShift",
        "c": "numberOfStations"
      },
      outputId: "totalExposure",
    },
    {
      formulaId: "benchmark.variance_percent",
      inputMap: {
        "actual": "availableWorkTimePerShift",
        "target": "requiredQuantityPerShift"
      },
      outputId: "variancePercent",
    }
  ],

  outputs: [
    {
      id: "totalExposure",
      label: "Balance loss",
      unit: "%",
      format: "percentage",
      isBigNumber: true,
    },
    {
      id: "variancePercent",
      label: "Line efficiency",
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
      "All stations operate in sequence without parallel processing",
      "Cycle times are deterministic and stable",
      "No rework or quality losses considered",
    ],
  },
};
