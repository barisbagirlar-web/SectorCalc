import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";

/** P7 nightrun — DeepSeek Chief Engineer schema (factory generated). */
export const MachineHourRateCalculator_SCHEMA: PremiumCalculatorSchema = {
  id: "machine-hour-rate-calculator",
  name: "Machine Hour Rate Calculator",
  sectorSlug: "general-industrial",
  category: "time",
  painStatement: "Standard cost accounting for manufacturing overhead",

  inputs: [
    {
      id: "machineCost",
      label: "Machine purchase cost",
      type: "number",
      unit: "USD",
      required: true,
      smartDefault: 500000,
      validation: { min: 0, max: 10000000 },
      helper: "Non-negative currency",
      expertMeaning: "Machine purchase cost",
    },
    {
      id: "salvageValue",
      label: "Salvage value at end of life",
      type: "number",
      unit: "USD",
      required: true,
      smartDefault: 50000,
      validation: { min: 0, max: 10000000 },
      helper: "Non-negative, less than machine cost",
      expertMeaning: "Salvage value at end of life",
    },
    {
      id: "usefulLifeYears",
      label: "Useful life in years",
      type: "number",
      unit: "years",
      required: true,
      smartDefault: 10,
      validation: { min: 1, max: 50 },
      helper: "Positive integer",
      expertMeaning: "Useful life in years",
    },
    {
      id: "maintenanceCostPerYear",
      label: "Annual maintenance cost",
      type: "number",
      unit: "USD",
      required: true,
      smartDefault: 10000,
      validation: { min: 0, max: 1000000 },
      helper: "Non-negative currency",
      expertMeaning: "Annual maintenance cost",
    },
    {
      id: "powerConsumptionKW",
      label: "Power consumption in kW",
      type: "number",
      unit: "kW",
      required: true,
      smartDefault: 50,
      validation: { min: 0, max: 10000 },
      helper: "Non-negative",
      expertMeaning: "Power consumption in kW",
    },
    {
      id: "powerCostPerKWH",
      label: "Power cost per kWh",
      type: "number",
      unit: "USD/kWh",
      required: true,
      smartDefault: 0.12,
      validation: { min: 0, max: 10 },
      helper: "Non-negative currency",
      expertMeaning: "Power cost per kWh",
    }
  ],

  formulaPipeline: [
    {
      formulaId: "cost.total_exposure",
      inputMap: {
        "a": "machineCost",
        "b": "salvageValue",
        "c": "usefulLifeYears"
      },
      outputId: "totalExposure",
    },
    {
      formulaId: "benchmark.variance_percent",
      inputMap: {
        "actual": "machineCost",
        "target": "salvageValue"
      },
      outputId: "variancePercent",
    }
  ],

  outputs: [
    {
      id: "totalExposure",
      label: "Machine hour rate",
      unit: "USD/hour",
      format: "currency",
      isBigNumber: true,
    },
    {
      id: "variancePercent",
      label: "Total annual cost",
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
      "Straight-line depreciation method",
      "Maintenance cost is constant each year",
      "Power consumption is constant during operation",
    ],
  },
};
