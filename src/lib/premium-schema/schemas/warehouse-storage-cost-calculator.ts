import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";

/** P7 nightrun — DeepSeek Chief Engineer schema (factory generated). */
export const WarehouseStorageCostCalculator_SCHEMA: PremiumCalculatorSchema = {
  id: "warehouse-storage-cost-calculator",
  name: "Warehouse Storage Cost",
  sectorSlug: "general-industrial",
  category: "cost",
  painStatement: "Industrial engineering cost accounting for logistics",

  inputs: [
    {
      id: "storageAreaUsed",
      label: "Storage area used",
      type: "number",
      unit: "sqm",
      required: true,
      smartDefault: 1000,
      validation: { min: 0, max: 100000 },
      helper: "Non-negative area",
      expertMeaning: "Storage area used",
    },
    {
      id: "storageCostPerSqMeterPerDay",
      label: "Storage cost per sq meter per day",
      type: "number",
      unit: "USD",
      required: true,
      smartDefault: 0.5,
      validation: { min: 0, max: 100 },
      helper: "Non-negative cost",
      expertMeaning: "Storage cost per sq meter per day",
    },
    {
      id: "storageDays",
      label: "Storage days",
      type: "number",
      unit: "days",
      required: true,
      smartDefault: 30,
      validation: { min: 1, max: 365 },
      helper: "Positive integer",
      expertMeaning: "Storage days",
    },
    {
      id: "handlingCostPerShipment",
      label: "Handling cost per shipment",
      type: "number",
      unit: "USD",
      required: true,
      smartDefault: 50,
      validation: { min: 0, max: 10000 },
      helper: "Non-negative cost",
      expertMeaning: "Handling cost per shipment",
    },
    {
      id: "shipmentCount",
      label: "Shipment count",
      type: "number",
      unit: "shipments",
      required: true,
      smartDefault: 10,
      validation: { min: 1, max: 100000 },
      helper: "Positive integer",
      expertMeaning: "Shipment count",
    },
    {
      id: "driverHourlyRate",
      label: "Driver hourly rate",
      type: "number",
      unit: "USD/hour",
      required: true,
      smartDefault: 25,
      validation: { min: 0, max: 200 },
      helper: "Non-negative rate",
      expertMeaning: "Driver hourly rate",
    }
  ],

  formulaPipeline: [
    {
      formulaId: "cost.total_exposure",
      inputMap: {
        "a": "storageAreaUsed",
        "b": "storageCostPerSqMeterPerDay",
        "c": "storageDays"
      },
      outputId: "totalExposure",
    },
    {
      formulaId: "benchmark.variance_percent",
      inputMap: {
        "actual": "storageAreaUsed",
        "target": "storageCostPerSqMeterPerDay"
      },
      outputId: "variancePercent",
    }
  ],

  outputs: [
    {
      id: "totalExposure",
      label: "Base storage cost",
      unit: "USD",
      format: "currency",
      isBigNumber: true,
    },
    {
      id: "variancePercent",
      label: "Handling cost",
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
      "Storage cost per sq meter per day is constant",
      "Handling cost per shipment is constant",
      "Driver works 8 hours per storage day",
    ],
  },
};
