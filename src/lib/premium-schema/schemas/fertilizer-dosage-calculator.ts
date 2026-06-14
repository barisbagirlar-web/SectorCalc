import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";

/** P7 nightrun — DeepSeek Chief Engineer schema (factory generated). */
export const FertilizerDosageCalculator_SCHEMA: PremiumCalculatorSchema = {
  id: "fertilizer-dosage-calculator",
  name: "Fertilizer Dosage Calculator",
  sectorSlug: "general-industrial",
  category: "cost",
  painStatement: "Agronomic recommendation based on soil test and crop requirement",

  inputs: [
    {
      id: "targetYield",
      label: "Target yield",
      type: "number",
      unit: "kg/ha",
      required: true,
      smartDefault: 8000,
      validation: { min: 0, max: 50000 },
      helper: "Non-negative, typical range 0-50000",
      expertMeaning: "Target yield",
    },
    {
      id: "nutrientUptakePerUnit",
      label: "Nutrient uptake per unit yield",
      type: "number",
      unit: "kg/kg",
      required: true,
      smartDefault: 0.02,
      validation: { min: 0, max: 1 },
      helper: "Non-negative, typical 0-1",
      expertMeaning: "Nutrient uptake per unit yield",
    },
    {
      id: "soilAvailableNutrient",
      label: "Soil available nutrient",
      type: "number",
      unit: "kg/ha",
      required: true,
      smartDefault: 50,
      validation: { min: 0, max: 1000 },
      helper: "Non-negative",
      expertMeaning: "Soil available nutrient",
    },
    {
      id: "applicationEfficiency",
      label: "Application efficiency",
      type: "number",
      unit: "%",
      required: true,
      smartDefault: 70,
      validation: { min: 0, max: 100, step: 0.1 },
      helper: "Between 0 and 100, non-zero",
      expertMeaning: "Application efficiency",
    },
    {
      id: "nutrientContent",
      label: "Nutrient content in fertilizer",
      type: "number",
      unit: "%",
      required: true,
      smartDefault: 46,
      validation: { min: 0, max: 100, step: 0.1 },
      helper: "Between 0 and 100, non-zero",
      expertMeaning: "Nutrient content in fertilizer",
    },
    {
      id: "unitCost",
      label: "Unit cost of fertilizer",
      type: "number",
      unit: "USD/kg",
      required: true,
      smartDefault: 0.5,
      validation: { min: 0, max: 1000 },
      helper: "Non-negative",
      expertMeaning: "Unit cost of fertilizer",
    }
  ],

  formulaPipeline: [
    {
      formulaId: "cost.total_exposure",
      inputMap: {
        "a": "targetYield",
        "b": "nutrientUptakePerUnit",
        "c": "soilAvailableNutrient"
      },
      outputId: "totalExposure",
    },
    {
      formulaId: "benchmark.variance_percent",
      inputMap: {
        "actual": "targetYield",
        "target": "nutrientUptakePerUnit"
      },
      outputId: "variancePercent",
    }
  ],

  outputs: [
    {
      id: "totalExposure",
      label: "Required nutrient amount",
      unit: "kg/ha",
      format: "currency",
      isBigNumber: true,
    },
    {
      id: "variancePercent",
      label: "Fertilizer product amount",
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
      "Soil test results are accurate",
      "Crop nutrient uptake coefficients are representative",
      "Fertilizer nutrient content is as labeled",
    ],
  },
};
