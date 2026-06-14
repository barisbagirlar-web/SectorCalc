import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";

/** P7 nightrun — DeepSeek Chief Engineer schema (factory generated). */
export const IskeleVeKalipKullanimSuresiOptimizasyonCalculator_SCHEMA: PremiumCalculatorSchema = {
  id: "iskele-ve-kalip-kullanim-suresi-optimizasyon-calculator",
  name: "Iskele Ve Kalip Kullanim Suresi Optimizasyon",
  sectorSlug: "general-industrial",
  category: "cost",
  painStatement: "Construction engineering and project management cost optimization",

  inputs: [
    {
      id: "dailyRentalRate",
      label: "Daily rental rate per unit",
      type: "number",
      unit: "USD",
      required: true,
      smartDefault: 50,
      validation: { min: 0.01, max: 10000 },
      helper: "Must be positive currency amount",
      expertMeaning: "Daily rental rate per unit",
    },
    {
      id: "totalRentalDays",
      label: "Total rental days",
      type: "number",
      unit: "days",
      required: true,
      smartDefault: 30,
      validation: { min: 1, max: 3650 },
      helper: "Must be positive integer",
      expertMeaning: "Total rental days",
    },
    {
      id: "setupCostPerCycle",
      label: "Setup/teardown cost per cycle",
      type: "number",
      unit: "USD",
      required: true,
      smartDefault: 500,
      validation: { min: 0, max: 100000 },
      helper: "Non-negative currency",
      expertMeaning: "Setup/teardown cost per cycle",
    },
    {
      id: "numberOfCycles",
      label: "Number of cycles (reuses)",
      type: "number",
      unit: "cycles",
      required: true,
      smartDefault: 1,
      validation: { min: 1, max: 100 },
      helper: "Must be positive integer",
      expertMeaning: "Number of cycles (reuses)",
    },
    {
      id: "maintenanceCostPerDay",
      label: "Maintenance cost per day",
      type: "number",
      unit: "USD",
      required: true,
      smartDefault: 10,
      validation: { min: 0, max: 1000 },
      helper: "Non-negative currency",
      expertMeaning: "Maintenance cost per day",
    },
    {
      id: "totalDemand",
      label: "Total demand (unit-days)",
      type: "number",
      unit: "unit-days",
      required: true,
      smartDefault: 1000,
      validation: { min: 1, max: 1000000 },
      helper: "Must be positive integer",
      expertMeaning: "Total demand (unit-days)",
    }
  ],

  formulaPipeline: [
    {
      formulaId: "cost.total_exposure",
      inputMap: {
        "a": "dailyRentalRate",
        "b": "totalRentalDays",
        "c": "setupCostPerCycle"
      },
      outputId: "totalExposure",
    },
    {
      formulaId: "benchmark.variance_percent",
      inputMap: {
        "actual": "dailyRentalRate",
        "target": "totalRentalDays"
      },
      outputId: "variancePercent",
    }
  ],

  outputs: [
    {
      id: "totalExposure",
      label: "Total cost",
      unit: "USD",
      format: "currency",
      isBigNumber: true,
    },
    {
      id: "variancePercent",
      label: "Cost per day",
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
      "Daily rental rate is constant over the rental period",
      "Setup/teardown cost per cycle is fixed",
      "Maintenance cost is linear per day",
    ],
  },
};
