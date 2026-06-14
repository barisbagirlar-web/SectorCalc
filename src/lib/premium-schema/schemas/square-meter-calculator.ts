import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";

/** P7 nightrun — DeepSeek Chief Engineer schema (factory generated). */
export const SquareMeterCalculator_SCHEMA: PremiumCalculatorSchema = {
  id: "square-meter-calculator",
  name: "Square Meter Calculator",
  sectorSlug: "general-industrial",
  category: "cost",
  painStatement: "Industrial engineering area measurement and cost estimation",

  inputs: [
    {
      id: "length",
      label: "Length",
      type: "number",
      unit: "m",
      required: true,
      smartDefault: 10,
      validation: { min: 0.001, max: 10000 },
      helper: "Must be positive length",
      expertMeaning: "Length",
    },
    {
      id: "width",
      label: "Width",
      type: "number",
      unit: "m",
      required: true,
      smartDefault: 5,
      validation: { min: 0.001, max: 10000 },
      helper: "Must be positive width",
      expertMeaning: "Width",
    },
    {
      id: "wastePercent",
      label: "Waste percentage",
      type: "number",
      unit: "%",
      required: true,
      smartDefault: 5,
      validation: { min: 0, max: 100, step: 0.1 },
      helper: "Percent between 0 and 100",
      expertMeaning: "Waste percentage",
    },
    {
      id: "unitCost",
      label: "Unit cost per square meter",
      type: "number",
      unit: "USD",
      required: true,
      smartDefault: 50,
      validation: { min: 0, max: 100000 },
      helper: "Non-negative currency",
      expertMeaning: "Unit cost per square meter",
    }
  ],

  formulaPipeline: [
    {
      formulaId: "cost.total_exposure",
      inputMap: {
        "a": "length",
        "b": "width",
        "c": "wastePercent"
      },
      outputId: "totalExposure",
    },
    {
      formulaId: "benchmark.variance_percent",
      inputMap: {
        "actual": "length",
        "target": "width"
      },
      outputId: "variancePercent",
    }
  ],

  outputs: [
    {
      id: "totalExposure",
      label: "Base area",
      unit: "m²",
      format: "currency",
      isBigNumber: true,
    },
    {
      id: "variancePercent",
      label: "Adjusted area (with waste)",
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
      "Length and width are measured in meters",
      "Waste percentage is applied linearly",
      "Unit cost is constant per square meter",
    ],
  },
};
