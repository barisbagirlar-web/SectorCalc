import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";

/** P7 nightrun — DeepSeek Chief Engineer schema (factory generated). */
export const SquareFootageCalculator_SCHEMA: PremiumCalculatorSchema = {
  id: "square-footage-calculator",
  name: "Square Footage Calculator",
  sectorSlug: "general-industrial",
  category: "cost",
  painStatement: "Standard geometric area measurement for industrial floor space estimation",

  inputs: [
    {
      id: "lengthFeet",
      label: "Length (feet)",
      type: "number",
      unit: "ft",
      required: true,
      smartDefault: 10,
      validation: { min: 0.01, max: 100000 },
      helper: "Must be positive length",
      expertMeaning: "Length (feet)",
    },
    {
      id: "widthFeet",
      label: "Width (feet)",
      type: "number",
      unit: "ft",
      required: true,
      smartDefault: 10,
      validation: { min: 0.01, max: 100000 },
      helper: "Must be positive width",
      expertMeaning: "Width (feet)",
    },
    {
      id: "wasteFactorPercent",
      label: "Waste factor",
      type: "number",
      unit: "%",
      required: true,
      smartDefault: 5,
      validation: { min: 0, max: 100, step: 0.1 },
      helper: "Percent between 0 and 100",
      expertMeaning: "Waste factor",
    },
    {
      id: "unitCostPerSquareFoot",
      label: "Unit cost per square foot",
      type: "number",
      unit: "USD/sqft",
      required: true,
      smartDefault: 5,
      validation: { min: 0, max: 10000 },
      helper: "Non-negative cost",
      expertMeaning: "Unit cost per square foot",
    }
  ],

  formulaPipeline: [
    {
      formulaId: "cost.total_exposure",
      inputMap: {
        "a": "lengthFeet",
        "b": "widthFeet",
        "c": "wasteFactorPercent"
      },
      outputId: "totalExposure",
    },
    {
      formulaId: "benchmark.variance_percent",
      inputMap: {
        "actual": "lengthFeet",
        "target": "widthFeet"
      },
      outputId: "variancePercent",
    }
  ],

  outputs: [
    {
      id: "totalExposure",
      label: "Base area",
      unit: "sqft",
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
      "Area is rectangular",
      "Waste factor is applied uniformly",
      "Unit cost is constant per square foot",
    ],
  },
};
