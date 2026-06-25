import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";

export const CBAM_UNIT_PRODUCT_CARBON_FOOTPRINT_CALCULATOR_SCHEMA: PremiumCalculatorSchema = {
  id: "cbam-unit-product-carbon-footprint-calculator",
  name: "CBAM Unit Product Carbon Footprint Calculator",
  sectorSlug: "energy-carbon",
  category: "carbon",
  painStatement:
    "Exporters need product-level carbon evidence but lack affordable tooling.",

  inputs: [],

  outputs: [],

  thresholds: [
    {
      fieldId: "unitEmissionsTon",
      warning: 0.05,
      critical: 0.12,
      direction: "higher_is_bad",
      warningMessage: "Unit carbon intensity is elevated — verify energy and yield assumptions.",
      criticalMessage: "Unit carbon intensity is very high — review process before export filing.",
    },
  ],

  reportTemplate: {
    title: "CBAM Unit Carbon Footprint Decision Report",
    sections: ["executive_summary", "thresholds", "assumptions", "action_plan"],
    exportFormats: ["pdf", "csv"],
  },

  assumptions: {
    hiddenLossMultiplier: 1.02,
    volatilityPercent: 12,
    targetMarginPercent: 0,
    assumptionNotes: [
      "Unit emissions = total batch emissions ÷ production units.",
      "Unit carbon cost = unit emissions × reference carbon price.",
      "Informational simulation only — not legal or compliance certification.",
    ],
  },
};
