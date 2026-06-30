import type { PremiumCalculatorSchema } from "@/lib/features/premium-schema/premium-calculator-schema";

export const MATERIAL_WASTE_CALCULATOR_SCHEMA: PremiumCalculatorSchema = {
  id: "material-waste-calculator",
  name: "Material Waste Calculator",
  sectorSlug: "food-retail",
  category: "scrap",
  legacyPaidSlug: "material-waste-calculator",
  painStatement:
    "Waste kg and percent from input vs good output.",

  inputs: [],

  outputs: [],

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
