import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";

/** P7 nightrun — DeepSeek Chief Engineer schema (factory generated). */
export const KritikYolCpmGecikmeCezasiVeHizlandirmaOptimizasyonCalculator_SCHEMA: PremiumCalculatorSchema = {
  id: "kritik-yol-cpm-gecikme-cezasi-ve-hizlandirma-optimizasyon-calculator",
  name: "Kritik Yol Cpm Gecikme Cezasi Ve Hizlandirma Optimizasyon",
  sectorSlug: "general-industrial",
  category: "cost",
  painStatement: "Critical Path Method (CPM) project scheduling with time-cost trade-off analysis",

  inputs: [
    {
      id: "contractDurationDays",
      label: "Contract duration (days)",
      type: "number",
      unit: "days",
      required: true,
      smartDefault: 365,
      validation: { min: 1, max: 3650 },
      helper: "Must be positive integer",
      expertMeaning: "Contract duration (days)",
    },
    {
      id: "actualDurationDays",
      label: "Actual duration (days)",
      type: "number",
      unit: "days",
      required: true,
      smartDefault: 400,
      validation: { min: 0, max: 3650 },
      helper: "Non-negative integer",
      expertMeaning: "Actual duration (days)",
    },
    {
      id: "penaltyRatePerDay",
      label: "Penalty rate per day",
      type: "number",
      unit: "USD",
      required: true,
      smartDefault: 1000,
      validation: { min: 0, max: 1000000 },
      helper: "Non-negative currency",
      expertMeaning: "Penalty rate per day",
    },
    {
      id: "baselineCost",
      label: "Baseline project cost",
      type: "number",
      unit: "USD",
      required: true,
      smartDefault: 500000,
      validation: { min: 0, max: 1000000000 },
      helper: "Non-negative currency",
      expertMeaning: "Baseline project cost",
    },
    {
      id: "crashCostPerDay",
      label: "Crash cost per day",
      type: "number",
      unit: "USD",
      required: true,
      smartDefault: 2000,
      validation: { min: 0, max: 1000000 },
      helper: "Non-negative currency",
      expertMeaning: "Crash cost per day",
    },
    {
      id: "maxCrashDays",
      label: "Maximum crash days available",
      type: "number",
      unit: "days",
      required: true,
      smartDefault: 30,
      validation: { min: 0, max: 365 },
      helper: "Non-negative integer, cannot exceed contract duration",
      expertMeaning: "Maximum crash days available",
    }
  ],

  formulaPipeline: [
    {
      formulaId: "cost.total_exposure",
      inputMap: {
        "a": "contractDurationDays",
        "b": "actualDurationDays",
        "c": "penaltyRatePerDay"
      },
      outputId: "totalExposure",
    },
    {
      formulaId: "benchmark.variance_percent",
      inputMap: {
        "actual": "contractDurationDays",
        "target": "actualDurationDays"
      },
      outputId: "variancePercent",
    }
  ],

  outputs: [
    {
      id: "totalExposure",
      label: "Delay penalty",
      unit: "USD",
      format: "currency",
      isBigNumber: true,
    },
    {
      id: "variancePercent",
      label: "Crashing cost",
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
      "All critical path activities can be crashed independently",
      "Crash cost per day is constant",
      "Penalty applies only after contract duration exceeded",
    ],
  },
};
