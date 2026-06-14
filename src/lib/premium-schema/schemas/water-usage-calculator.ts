import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";

/** P7 nightrun — DeepSeek Chief Engineer schema (factory generated). */
export const WaterUsageCalculator_SCHEMA: PremiumCalculatorSchema = {
  id: "water-usage-calculator",
  name: "Water Usage Calculator",
  sectorSlug: "general-industrial",
  category: "cost",
  painStatement: "Industrial water usage accounting and cost allocation",

  inputs: [
    {
      id: "dailyUsage",
      label: "Daily water usage",
      type: "number",
      unit: "m³/day",
      required: true,
      smartDefault: 100,
      validation: { min: 0.001, max: 1000000 },
      helper: "Must be positive volume",
      expertMeaning: "Daily water usage",
    },
    {
      id: "operatingDays",
      label: "Operating days per period",
      type: "number",
      unit: "days",
      required: true,
      smartDefault: 250,
      validation: { min: 1, max: 365 },
      helper: "Must be positive integer",
      expertMeaning: "Operating days per period",
    },
    {
      id: "unitWaterCost",
      label: "Unit water cost",
      type: "number",
      unit: "USD/m³",
      required: true,
      smartDefault: 1.5,
      validation: { min: 0, max: 1000 },
      helper: "Non-negative currency per volume",
      expertMeaning: "Unit water cost",
    },
    {
      id: "wasteVolume",
      label: "Waste water volume",
      type: "number",
      unit: "m³",
      required: true,
      smartDefault: 10,
      validation: { min: 0, max: 1000000 },
      helper: "Non-negative, must be less than total volume",
      expertMeaning: "Waste water volume",
    },
    {
      id: "productionOutput",
      label: "Production output",
      type: "number",
      unit: "units",
      required: true,
      smartDefault: 1000,
      validation: { min: 1, max: 10000000 },
      helper: "Must be positive integer",
      expertMeaning: "Production output",
    }
  ],

  formulaPipeline: [
    {
      formulaId: "cost.total_exposure",
      inputMap: {
        "a": "dailyUsage",
        "b": "operatingDays",
        "c": "unitWaterCost"
      },
      outputId: "totalExposure",
    },
    {
      formulaId: "benchmark.variance_percent",
      inputMap: {
        "actual": "dailyUsage",
        "target": "operatingDays"
      },
      outputId: "variancePercent",
    }
  ],

  outputs: [
    {
      id: "totalExposure",
      label: "Total water volume used",
      unit: "m³",
      format: "currency",
      isBigNumber: true,
    },
    {
      id: "variancePercent",
      label: "Total water cost",
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
      "Water usage is metered and accurate",
      "Waste volume is measured or estimated reliably",
      "Unit water cost includes all supply and treatment charges",
    ],
  },
};
