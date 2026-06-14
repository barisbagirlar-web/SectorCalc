import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";

/** P7 nightrun — DeepSeek Chief Engineer schema (factory generated). */
export const VolumetricWeightCalculator_SCHEMA: PremiumCalculatorSchema = {
  id: "volumetric-weight-calculator",
  name: "Volumetric Weight Calculator",
  sectorSlug: "general-industrial",
  category: "cost",
  painStatement: "IATA volumetric weight standard (air freight) and common carrier practice",

  inputs: [
    {
      id: "lengthCm",
      label: "Length",
      type: "number",
      unit: "cm",
      required: true,
      smartDefault: 50,
      validation: { min: 0.1, max: 10000 },
      helper: "Must be positive length",
      expertMeaning: "Length",
    },
    {
      id: "widthCm",
      label: "Width",
      type: "number",
      unit: "cm",
      required: true,
      smartDefault: 40,
      validation: { min: 0.1, max: 10000 },
      helper: "Must be positive width",
      expertMeaning: "Width",
    },
    {
      id: "heightCm",
      label: "Height",
      type: "number",
      unit: "cm",
      required: true,
      smartDefault: 30,
      validation: { min: 0.1, max: 10000 },
      helper: "Must be positive height",
      expertMeaning: "Height",
    },
    {
      id: "actualWeightKg",
      label: "Actual weight",
      type: "number",
      unit: "kg",
      required: true,
      smartDefault: 10,
      validation: { min: 0.001, max: 100000 },
      helper: "Must be positive weight",
      expertMeaning: "Actual weight",
    },
    {
      id: "volumetricDivisor",
      label: "Volumetric divisor",
      type: "number",
      unit: "cm³/kg",
      required: true,
      smartDefault: 6000,
      validation: { min: 1, max: 10000 },
      helper: "Must be positive integer, typical values: 6000 (air), 5000 (courier), 4000 (truck)",
      expertMeaning: "Volumetric divisor",
    },
    {
      id: "ratePerKg",
      label: "Rate per kg",
      type: "number",
      unit: "USD",
      required: true,
      smartDefault: 5,
      validation: { min: 0, max: 1000 },
      helper: "Non-negative currency",
      expertMeaning: "Rate per kg",
    }
  ],

  formulaPipeline: [
    {
      formulaId: "cost.total_exposure",
      inputMap: {
        "a": "lengthCm",
        "b": "widthCm",
        "c": "heightCm"
      },
      outputId: "totalExposure",
    },
    {
      formulaId: "benchmark.variance_percent",
      inputMap: {
        "actual": "lengthCm",
        "target": "widthCm"
      },
      outputId: "variancePercent",
    }
  ],

  outputs: [
    {
      id: "totalExposure",
      label: "Volumetric weight",
      unit: "kg",
      format: "currency",
      isBigNumber: true,
    },
    {
      id: "variancePercent",
      label: "Chargeable weight",
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
      "Dimensions are for a single rectangular parcel",
      "Volumetric divisor is constant for the entire shipment",
      "Rate per kg is all-inclusive (no additional surcharges)",
    ],
  },
};
