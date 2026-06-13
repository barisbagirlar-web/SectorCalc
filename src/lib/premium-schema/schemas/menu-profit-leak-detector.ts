import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";

export const MENU_PROFIT_LEAK_DETECTOR_SCHEMA: PremiumCalculatorSchema = {
  id: "menu-profit-leak-detector",
  name: "Menu Profit Leak Detector",
  sectorSlug: "restaurant",
  category: "cost",
  legacyPaidSlug: "menu-profit-leak-detector",
  painStatement:
    "Detect real menu margin after waste, delivery commission and labor cost per item.",

  inputs: [
    {
      id: "monthlyRevenue",
      label: "Monthly revenue",
      type: "number",
      unit: "USD",
      required: true,
      smartDefault: 38000,
      validation: { min: 0 },
      helper: "Food sales for the period.",
      expertMeaning: "Top-line revenue for margin pressure calculation.",
    },
    {
      id: "ingredientCost",
      label: "Ingredient cost",
      type: "number",
      unit: "USD",
      required: true,
      smartDefault: 14500,
      validation: { min: 0 },
      helper: "Total ingredient spend before waste adjustment.",
      expertMeaning: "Purchased food cost for the menu mix.",
    },
    {
      id: "deliveryAppFeePercent",
      label: "Delivery app fee",
      type: "number",
      unit: "%",
      required: true,
      smartDefault: 22,
      validation: { min: 0, max: 100 },
      helper: "Platform commission on delivery revenue.",
      expertMeaning: "Aggregator fee drag on menu margin.",
    },
    {
      id: "wasteRate",
      label: "Waste rate",
      type: "number",
      unit: "%",
      required: true,
      smartDefault: 6,
      validation: { min: 0, max: 100 },
      helper: "Spoilage and portion drift as percent of ingredient cost.",
      expertMeaning: "Observed waste band versus purchases.",
    },
    {
      id: "targetFoodCostPercent",
      label: "Target food cost",
      type: "number",
      unit: "%",
      required: true,
      smartDefault: 32,
      validation: { min: 0, max: 100 },
      helper: "Target food cost percent for this menu mix.",
      expertMeaning: "Operational food cost ceiling for margin protection.",
    },
  ],

  formulaPipeline: [
    {
      formulaId: "cost.food_cost_percent",
      inputMap: {
        ingredientCost: "ingredientCost",
        monthlyRevenue: "monthlyRevenue",
      },
      outputId: "foodCostPercent",
    },
    {
      formulaId: "cost.delivery_fee_cost",
      inputMap: {
        monthlyRevenue: "monthlyRevenue",
        deliveryAppFeePercent: "deliveryAppFeePercent",
      },
      outputId: "deliveryFeeCost",
    },
    {
      formulaId: "loss.waste_exposure",
      inputMap: {
        monthlyIngredientCost: "ingredientCost",
        wasteRate: "wasteRate",
      },
      outputId: "wasteExposure",
    },
    {
      formulaId: "cost.restaurant_margin_pressure",
      inputMap: {
        ingredientCost: "ingredientCost",
        deliveryFeeCost: "deliveryFeeCost",
        wasteExposure: "wasteExposure",
        monthlyRevenue: "monthlyRevenue",
      },
      outputId: "totalMarginPressure",
    },
  ],

  outputs: [
    {
      id: "totalMarginPressure",
      label: "Total margin pressure",
      unit: "%",
      format: "percentage",
      isBigNumber: true,
    },
    {
      id: "foodCostPercent",
      label: "Food cost percent",
      unit: "%",
      format: "percentage",
    },
    {
      id: "deliveryFeeCost",
      label: "Delivery fee cost",
      unit: "$",
      format: "currency",
    },
    {
      id: "wasteExposure",
      label: "Waste exposure",
      unit: "$",
      format: "currency",
    },
  ],

  thresholds: [
    {
      fieldId: "foodCostPercent",
      warning: 35,
      critical: 42,
      direction: "higher_is_bad",
      warningMessage:
        "Food cost percent is above target — review menu mix and portion control.",
      criticalMessage:
        "Critical food cost band — reprice or reformulate before scaling delivery volume.",
    },
    {
      fieldId: "wasteRate",
      warning: 5,
      critical: 10,
      direction: "higher_is_bad",
      warningMessage: "Waste rate is elevated — track prep and spoilage by shift.",
      criticalMessage: "High waste band — margin leak may exceed delivery fee recovery.",
    },
    {
      fieldId: "totalMarginPressure",
      warning: 45,
      critical: 55,
      direction: "higher_is_bad",
      warningMessage:
        "Combined cost pressure is building — ingredient, fee and waste stack needs review.",
      criticalMessage:
        "Critical margin pressure — menu economics may not support current channel mix.",
    },
  ],

  reportTemplate: {
    title: "Restaurant Menu Margin Leak Decision Report",
    sections: [
      "executive_summary",
      "loss_breakdown",
      "thresholds",
      "sensitivity",
      "action_plan",
      "assumptions",
    ],
    exportFormats: ["pdf", "csv"],
  },

  assumptions: {
    hiddenLossMultiplier: 1.05,
    volatilityPercent: 10,
    targetMarginPercent: 15,
    assumptionNotes: [
      "Food cost percent = ingredient cost ÷ monthly revenue.",
      "Delivery fee cost = revenue × delivery app fee percent.",
      "Margin pressure stacks ingredient, delivery fee and waste over revenue.",
      "Target food cost input is contextual — not recalculated in this analyzer.",
    ],
  },
};
