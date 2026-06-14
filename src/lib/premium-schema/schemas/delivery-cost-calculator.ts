import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";

/** P7 nightrun — DeepSeek Chief Engineer schema (factory generated). */
export const DeliveryCostCalculator_SCHEMA: PremiumCalculatorSchema = {
  id: "delivery-cost-calculator",
  name: "Delivery Cost Calculator",
  sectorSlug: "general-industrial",
  category: "cost",
  painStatement: "Industrial engineering cost accounting for logistics operations",

  inputs: [
    {
      id: "distanceKm",
      label: "Route distance",
      type: "number",
      unit: "km",
      required: true,
      smartDefault: 100,
      validation: { min: 0, max: 10000 },
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
      validation: { min: 1, max: 1000 },
      helper: "Positive integer",
      expertMeaning: "Number of trips",
    },
    {
      id: "vehicleLoadCapacity",
      label: "Vehicle load capacity",
      type: "number",
      unit: "kg",
      required: true,
      smartDefault: 10000,
      validation: { min: 1, max: 50000 },
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
      validation: { min: 0, max: 10 },
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
      "Average speed is constant and includes traffic delays",
      "Fuel consumption is linear with distance",
      "Handling cost per shipment is fixed regardless of load",
    ],
  },
};
