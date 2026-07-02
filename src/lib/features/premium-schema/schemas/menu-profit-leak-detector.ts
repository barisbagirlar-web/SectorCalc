import type { PremiumCalculatorSchema } from "@/lib/features/premium-schema/premium-calculator-schema";

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
      id: "menuPrice",
      label: "Menu Item Price",
      type: "number",
      unit: "currency",
      required: true,
      validation: { min: 0.01 },
      helper: "Selling price of the menu item",
      expertMeaning: "Gross revenue per unit before any deductions",
    },
    {
      id: "ingredientCost",
      label: "Ingredient Cost per Item",
      type: "number",
      unit: "currency",
      required: true,
      validation: { min: 0 },
      helper: "Total ingredient cost for one serving",
      expertMeaning: "Direct material cost per unit - recipe cost including trim and prep loss",
    },
    {
      id: "wasteRate",
      label: "Waste Rate (%)",
      type: "number",
      unit: "percent",
      required: true,
      validation: { min: 0, max: 100 },
      helper: "Estimated waste as percentage of ingredient cost",
      expertMeaning: "Spoilage, over-portion and prep loss as percentage of raw ingredient cost",
    },
    {
      id: "deliveryCommission",
      label: "Delivery Commission (%)",
      type: "number",
      unit: "percent",
      required: true,
      validation: { min: 0, max: 100 },
      helper: "Third-party delivery app commission rate",
      expertMeaning: "Platform fee percentage applied to menu price for delivery orders",
    },
    {
      id: "laborCostPerItem",
      label: "Labor Cost per Item",
      type: "number",
      unit: "currency",
      required: true,
      validation: { min: 0 },
      helper: "Direct labor cost allocated to this menu item",
      expertMeaning: "Labor cost per unit including prep, cooking and packaging labor",
    },
    {
      id: "targetMargin",
      label: "Target Margin (%)",
      type: "number",
      unit: "percent",
      required: true,
      validation: { min: 0, max: 100 },
      helper: "Minimum gross margin you want to maintain",
      expertMeaning: "Target margin used to calculate minimum safe price and margin gap",
    },
  ],

  outputs: [
    { id: "minimumSafePrice", label: "Minimum Safe Price", unit: "currency", format: "currency", isBigNumber: true },
    { id: "quoteVerdict", label: "Quote Verdict", unit: "text", format: "number" },
    { id: "p90Cost", label: "P90 Cost Estimate", unit: "currency", format: "currency", isBigNumber: true },
    { id: "suggestedAction", label: "Suggested Action", unit: "text", format: "number" },
  ],

  thresholds: [
    {
      fieldId: "foodCostPercent",
      warning: 35,
      critical: 42,
      direction: "higher_is_bad",
      warningMessage:
        "Food cost percent is above target - review menu mix and portion control.",
      criticalMessage:
        "Critical food cost band - reprice or reformulate before scaling delivery volume.",
    },
    {
      fieldId: "wasteRate",
      warning: 5,
      critical: 10,
      direction: "higher_is_bad",
      warningMessage: "Waste rate is elevated - track prep and spoilage by shift.",
      criticalMessage: "High waste band - margin leak may exceed delivery fee recovery.",
    },
    {
      fieldId: "totalMarginPressure",
      warning: 45,
      critical: 55,
      direction: "higher_is_bad",
      warningMessage:
        "Combined cost pressure is building - ingredient, fee and waste stack needs review.",
      criticalMessage:
        "Critical margin pressure - menu economics may not support current channel mix.",
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
      "Target food cost input is contextual - not recalculated in this analyzer.",
    ],
  },
};
