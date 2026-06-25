import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";

export const MATERIAL_WASTE_CALCULATOR_SCHEMA: PremiumCalculatorSchema = {
  id: "food-502",
  name: "Material Waste Calculator",
  sectorSlug: "food-retail",
  category: "scrap",
  legacyPaidSlug: "material-waste-calculator",
  painStatement:
    "Waste kg and percent from input vs good output.",

  inputs: [
    {
      id: "monthlyIngredientCost",
      label: "Monthly ingredient cost",
      type: "number",
      unit: "USD",
      required: true,
      smartDefault: 18000,
      validation: { min: 0 },
      helper: "Please enter a valid value.",
      expertMeaning: "Parameter value complies with industrial calculation standards.",
    },
    {
      id: "wasteRate",
      label: "Waste rate",
      type: "number",
      unit: "%",
      required: true,
      smartDefault: 7,
      validation: { min: 0, max: 100 },
      helper: "Please enter a valid value.",
      expertMeaning: "Parameter value complies with industrial calculation standards.",
    },
    {
      id: "targetWasteRate",
      label: "Target waste rate",
      type: "number",
      unit: "%",
      required: true,
      smartDefault: 3,
      validation: { min: 0, max: 100 },
      helper: "Please enter a valid value.",
      expertMeaning: "Parameter value complies with industrial calculation standards.",
    },
    {
      id: "monthlyRevenue",
      label: "Monthly revenue",
      type: "number",
      unit: "USD",
      required: true,
      smartDefault: 42000,
      validation: { min: 0 },
      helper: "Please enter a valid value.",
      expertMeaning: "Parameter value complies with industrial calculation standards.",
    },
    {
      id: "grossMargin",
      label: "Gross margin",
      type: "number",
      unit: "%",
      required: true,
      smartDefault: 62,
      validation: { min: 0, max: 100 },
      helper: "Please enter a valid value.",
      expertMeaning: "Parameter value complies with industrial calculation standards.",
    },
  ],

  formulaPipeline: [
    {
      formulaId: "loss.waste_exposure",
      inputMap: {
        monthlyIngredientCost: "monthlyIngredientCost",
        wasteRate: "wasteRate",
      },
      outputId: "wasteExposure",
    },
    {
      formulaId: "loss.excess_waste_cost",
      inputMap: {
        monthlyIngredientCost: "monthlyIngredientCost",
        wasteRate: "wasteRate",
        targetWasteRate: "targetWasteRate",
      },
      outputId: "excessWasteCost",
    },
    {
      formulaId: "cost.margin_pressure",
      inputMap: {
        excessCost: "excessWasteCost",
        monthlyRevenue: "monthlyRevenue",
      },
      outputId: "marginPressure",
    },
  ],

  outputs: [
    {
      id: "wasteExposure",
      label: "Waste exposure",
      unit: "$",
      format: "currency",
    },
    {
      id: "excessWasteCost",
      label: "Excess waste cost",
      unit: "$",
      format: "currency",
      isBigNumber: true,
    },
    {
      id: "marginPressure",
      label: "Margin pressure",
      unit: "%",
      format: "percentage",
    },
  ],

  thresholds: [
    {
      fieldId: "wasteRate",
      warning: 5,
      critical: 10,
      direction: "higher_is_bad",
      warningMessage:
        "Waste rate is above target — portion drift or spoilage may be eroding margin.",
      criticalMessage:
        "High waste band — stop treating spoilage as normal before repricing or rescheduling prep.",
    },
    {
      fieldId: "marginPressure",
      warning: 1,
      critical: 3,
      direction: "higher_is_bad",
      warningMessage:
        "Excess waste is pressuring revenue margin — track waste drivers next cycle.",
      criticalMessage:
        "Margin pressure is critical — review portion control and purchasing before accepting similar volume.",
    },
  ],

  reportTemplate: {
    title: "Food Waste Margin Loss Decision Report",
    sections: [
      "executive_summary",
      "loss_breakdown",
      "thresholds",
      "sensitivity",
      "action_plan",
      "assumptions",
    ],
    exportFormats: ["pdf", "excel"],
  },

  assumptions: {
    hiddenLossMultiplier: 1.06,
    volatilityPercent: 12,
    targetMarginPercent: 15,
    assumptionNotes: [
      "Excess waste = max(waste rate − target, 0) applied to ingredient cost.",
      "Margin pressure = excess waste cost ÷ monthly revenue.",
      "Gross margin input is contextual — not recalculated in this pilot.",
    ],
  },
};
