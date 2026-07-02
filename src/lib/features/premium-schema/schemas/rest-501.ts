import type { PremiumCalculatorSchema } from "@/lib/features/premium-schema/premium-calculator-schema";

export const MENU_PROFIT_LEAK_DETECTOR_SCHEMA: PremiumCalculatorSchema = {
  id: "rest-501",
  name: "Menu Profit Leak Detector",
  sectorSlug: "restaurant",
  category: "cost",
  legacyPaidSlug: "menu-profit-leak-detector",
  painStatement:
    "Detect real menu margin after waste, delivery commission and labor cost per item.",

  inputs: [],

  outputs: [],

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
