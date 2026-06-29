import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";

export const ELECTRICAL_PANEL_REWORK_COST_SCHEMA: PremiumCalculatorSchema = {
  id: "electrical-panel-rework-cost",
  name: "Electrical Panel Rework Cost Calculator",
  sectorSlug: "electrical",
  category: "cost",
  legacyPaidSlug: "panel-shop-margin-verdict",
  painStatement:
    "Electrical contractors lose money when panel wiring, testing, inspection fail and rework hours are not priced.",

  inputs: [],

  outputs: [],

  thresholds: [
    {
      fieldId: "marginPressure",
      warning: 5,
      critical: 12,
      direction: "higher_is_bad",
      warningMessage: "Margin pressure is elevated — verify wiring and inspection assumptions.",
      criticalMessage: "Critical margin pressure — reprice panel work before accepting.",
    },
  ],

  reportTemplate: {
    title: "Electrical Panel Rework Cost Decision Report",
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
    hiddenLossMultiplier: 1.1,
    volatilityPercent: 15,
    targetMarginPercent: 20,
    assumptionNotes: [
      "Wiring overrun = max(actual − planned hours, 0) × labor rate.",
      "Total exposure sums overrun, inspection fail and test equipment.",
      "Margin pressure = total exposure ÷ panel revenue.",
    ],
  },
};
