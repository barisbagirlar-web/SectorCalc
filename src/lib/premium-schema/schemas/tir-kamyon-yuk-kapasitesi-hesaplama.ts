import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";

/** P7 nightrun — DeepSeek Chief Engineer schema (factory generated). */
export const TirKamyonYukKapasitesiHesaplama_SCHEMA: PremiumCalculatorSchema = {
  id: "tir-kamyon-yuk-kapasitesi-hesaplama",
  name: "Tır — Kamyon Yük Kapasitesi Calculation",
  sectorSlug: "general-industrial",
  category: "cost",
  painStatement: "Vehicle engineering and transport logistics",

  inputs: [
    {
      id: "grossVehicleWeight",
      label: "Gross vehicle weight (GVW)",
      type: "number",
      unit: "kg",
      required: true,
      smartDefault: 40000,
      validation: { min: 1000, max: 60000 },
      helper: "Must be greater than tare weight",
      expertMeaning: "Gross vehicle weight (GVW)",
    },
    {
      id: "tareWeight",
      label: "Tare weight (empty vehicle)",
      type: "number",
      unit: "kg",
      required: true,
      smartDefault: 15000,
      validation: { min: 1000, max: 30000 },
      helper: "Must be less than GVW",
      expertMeaning: "Tare weight (empty vehicle)",
    },
    {
      id: "fuelWeight",
      label: "Fuel weight (full tank)",
      type: "number",
      unit: "kg",
      required: true,
      smartDefault: 200,
      validation: { min: 0, max: 1000 },
      helper: "Non-negative, typical 0-1000 kg",
      expertMeaning: "Fuel weight (full tank)",
    },
    {
      id: "crewWeight",
      label: "Driver and crew weight",
      type: "number",
      unit: "kg",
      required: true,
      smartDefault: 150,
      validation: { min: 0, max: 500 },
      helper: "Non-negative, typical 0-500 kg",
      expertMeaning: "Driver and crew weight",
    },
    {
      id: "safetyMarginPercent",
      label: "Safety margin",
      type: "number",
      unit: "%",
      required: true,
      smartDefault: 10,
      validation: { min: 0, max: 50, step: 0.1 },
      helper: "Percent between 0 and 50",
      expertMeaning: "Safety margin",
    },
    {
      id: "actualLoad",
      label: "Actual load weight",
      type: "number",
      unit: "kg",
      required: true,
      smartDefault: 20000,
      validation: { min: 0, max: 60000 },
      helper: "Non-negative, must not exceed safe payload",
      expertMeaning: "Actual load weight",
    }
  ],

  formulaPipeline: [
    {
      formulaId: "cost.total_exposure",
      inputMap: {
        "a": "grossVehicleWeight",
        "b": "tareWeight",
        "c": "fuelWeight"
      },
      outputId: "totalExposure",
    },
    {
      formulaId: "benchmark.variance_percent",
      inputMap: {
        "actual": "grossVehicleWeight",
        "target": "tareWeight"
      },
      outputId: "variancePercent",
    }
  ],

  outputs: [
    {
      id: "totalExposure",
      label: "Safe payload capacity",
      unit: "kg",
      format: "currency",
      isBigNumber: true,
    },
    {
      id: "variancePercent",
      label: "Load utilization",
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
      "Vehicle is on level ground",
      "Weight distribution is uniform",
      "Fuel tank is full",
    ],
  },
};
