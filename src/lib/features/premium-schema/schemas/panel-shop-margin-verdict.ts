import type { PremiumCalculatorSchema } from "@/lib/features/premium-schema/premium-calculator-schema";

export const PANEL_SHOP_MARGIN_VERDICT_SCHEMA: PremiumCalculatorSchema = {
  id: "panel-shop-margin-verdict",
  name: "Panel Shop Margin Verdict",
  sectorSlug: "electrical",
  category: "cost",
  legacyPaidSlug: "panel-shop-margin-verdict",
  painStatement:
    "Find safe electrical panel bid with testing hours, permit revision and inspection risk included.",

  inputs: [],

  outputs: [],

  thresholds: [
    {
      fieldId: "marginPressure",
      warning: 5,
      critical: 12,
      direction: "higher_is_bad",
      warningMessage: "Margin pressure is elevated - verify wiring and inspection assumptions.",
      criticalMessage: "Critical margin pressure - reprice panel work before accepting.",
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
