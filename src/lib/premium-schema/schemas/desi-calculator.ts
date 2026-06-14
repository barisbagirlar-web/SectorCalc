import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";

/** P7 nightrun — DeepSeek Chief Engineer schema (factory generated). */
export const DesiCalculator_SCHEMA: PremiumCalculatorSchema = {
  id: "desi-calculator",
  name: "Desi Calculator",
  sectorSlug: "general-industrial",
  category: "cost",
  painStatement: "Logistics and freight industry standard (desi = (length × width × height) / 5000 for domestic, /6000 for international)",

  inputs: [
    {
      id: "lengthCm",
      label: "Length (cm)",
      type: "number",
      unit: "cm",
      required: true,
      smartDefault: 30,
      validation: { min: 0.1, max: 1000 },
      helper: "Must be positive length",
      expertMeaning: "Length (cm)",
    },
    {
      id: "widthCm",
      label: "Width (cm)",
      type: "number",
      unit: "cm",
      required: true,
      smartDefault: 20,
      validation: { min: 0.1, max: 1000 },
      helper: "Must be positive width",
      expertMeaning: "Width (cm)",
    },
    {
      id: "heightCm",
      label: "Height (cm)",
      type: "number",
      unit: "cm",
      required: true,
      smartDefault: 15,
      validation: { min: 0.1, max: 1000 },
      helper: "Must be positive height",
      expertMeaning: "Height (cm)",
    },
    {
      id: "routeType",
      label: "Route type",
      type: "number",
      unit: "",
      required: true,
      smartDefault: 1,
      validation: { min: 0 },
      helper: "Select domestic (divisor 5000) or international (divisor 6000)",
      expertMeaning: "Route type",
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
      label: "Desi (volumetric weight)",
      unit: "kg",
      format: "currency",
      isBigNumber: true,
    },
    {
      id: "variancePercent",
      label: "Chargeable weight (if actual weight provided)",
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
      "Dimensions are in centimeters",
      "Divisor is 5000 for domestic, 6000 for international (common standard)",
      "Desi is rounded to one decimal place for display",
    ],
  },
};
