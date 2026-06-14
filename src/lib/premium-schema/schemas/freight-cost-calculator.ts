import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";

/** P7 nightrun — DeepSeek Chief Engineer schema (factory generated). */
export const FreightCostCalculator_SCHEMA: PremiumCalculatorSchema = {
  id: "freight-cost-calculator",
  name: "Freight Cost Calculator",
  sectorSlug: "general-industrial",
  category: "route",
  painStatement: "Industrial engineering cost accounting for logistics",

  inputs: [
    {
      id: "distanceKm",
      label: "Route distance",
      type: "number",
      unit: "km",
      required: true,
      smartDefault: 500,
      validation: { min: 0, max: 100000 },
      helper: "Non-negative distance",
      expertMeaning: "Route distance",
    },
    {
      id: "tripCount",
      label: "Number of trips",
      type: "number",
      unit: "trips",
      required: true,
      smartDefault: 1,
      validation: { min: 1, max: 10000 },
      helper: "Positive integer",
      expertMeaning: "Number of trips",
    },
    {
      id: "vehicleLoadCapacity",
      label: "Vehicle load capacity",
      type: "number",
      unit: "kg",
      required: true,
      smartDefault: 20000,
      validation: { min: 1, max: 100000 },
      helper: "Positive capacity",
      expertMeaning: "Vehicle load capacity",
    },
    {
      id: "loadFactorPercent",
      label: "Load factor",
      type: "number",
      unit: "%",
      required: true,
      smartDefault: 80,
      validation: { min: 1, max: 100, step: 0.1 },
      helper: "Percent between 1 and 100",
      expertMeaning: "Load factor",
    },
    {
      id: "fuelConsumptionPer100Km",
      label: "Fuel consumption per 100 km",
      type: "number",
      unit: "L/100km",
      required: true,
      smartDefault: 30,
      validation: { min: 0, max: 100 },
      helper: "Non-negative consumption",
      expertMeaning: "Fuel consumption per 100 km",
    },
    {
      id: "fuelOrEnergyUnitCost",
      label: "Fuel or energy unit cost",
      type: "number",
      unit: "USD/L",
      required: true,
      smartDefault: 1.5,
      validation: { min: 0, max: 100 },
      helper: "Non-negative cost",
      expertMeaning: "Fuel or energy unit cost",
    }
  ],

  formulaPipeline: [
    {
      formulaId: "cost.total_exposure",
      inputMap: {
        "a": "distanceKm",
        "b": "tripCount",
        "c": "vehicleLoadCapacity"
      },
      outputId: "totalExposure",
    },
    {
      formulaId: "benchmark.variance_percent",
      inputMap: {
        "actual": "distanceKm",
        "target": "tripCount"
      },
      outputId: "variancePercent",
    }
  ],

  outputs: [
    {
      id: "totalExposure",
      label: "Total logistics cost",
      unit: "USD",
      format: "currency",
      isBigNumber: true,
    },
    {
      id: "variancePercent",
      label: "Cost per delivery",
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
      "Average speed assumed 60 km/h for driver time calculation",
      "Fuel consumption linear with distance",
      "Handling cost per shipment constant",
    ],
  },
};
