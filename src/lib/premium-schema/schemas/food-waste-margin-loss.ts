import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";

export const FOOD_WASTE_MARGIN_LOSS_SCHEMA: PremiumCalculatorSchema = {
  id: "food-waste-margin-loss",
  name: "Food Waste Margin Loss Analyzer",
  sectorSlug: "food-retail",
  category: "scrap",
  legacyPaidSlug: "meal-planning-verdict",
  painStatement:
    "Food operations can lose margin through waste, overportioning and spoilage before the loss appears in sales reports.",

  inputs: [
    {
      id: "monthlyIngredientCost",
      label: "Monthly ingredient cost",
      type: "number",
      unit: "USD",
      required: true,
      smartDefault: 18000,
      validation: { min: 0 },
      helper: "Total ingredient spend for the period.",
      expertMeaning: "Purchased food cost before waste adjustment.",
    },
    {
      id: "wasteRate",
      label: "Waste rate",
      type: "number",
      unit: "%",
      required: true,
      smartDefault: 7,
      validation: { min: 0, max: 100 },
      helper: "Spoilage, trim and overportion loss as percent of ingredient cost.",
      expertMeaning: "Observed waste band versus purchases.",
    },
    {
      id: "targetWasteRate",
      label: "Target waste rate",
      type: "number",
      unit: "%",
      required: true,
      smartDefault: 3,
      validation: { min: 0, max: 100 },
      helper: "Operational target or prior best period.",
      expertMeaning: "Acceptable waste ceiling for margin protection.",
    },
    {
      id: "monthlyRevenue",
      label: "Monthly revenue",
      type: "number",
      unit: "USD",
      required: true,
      smartDefault: 42000,
      validation: { min: 0 },
      helper: "Food sales for the same period.",
      expertMeaning: "Top-line revenue used for margin pressure.",
    },
    {
      id: "grossMargin",
      label: "Gross margin",
      type: "number",
      unit: "%",
      required: true,
      smartDefault: 62,
      validation: { min: 0, max: 100 },
      helper: "Current gross margin before waste adjustment.",
      expertMeaning: "Menu-level margin context for the verdict.",
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
