import type { PremiumCalculatorSchema } from "@/lib/features/premium-schema/premium-calculator-schema";

export const ROUTE_OPTIMIZATION_ANALYZER_SCHEMA: PremiumCalculatorSchema = {
  id: "logi-504",
  name: "Route & Freight Loss Analyzer",
  sectorSlug: "logistics-transport",
  category: "route",
  legacyPaidSlug: "route-optimization-analyzer",
  painStatement:
    "Model deadhead, tolls, driver rest risk and minimum safe freight price for logistics lanes.",

  inputs: [],

  outputs: [],

  thresholds: [
    {
      fieldId: "deadheadCost",
      warning: 80,
      critical: 150,
      direction: "higher_is_bad",
      warningMessage: "Energy and delay exposure are the main risk drivers on this lane.",
      criticalMessage: "High risk - hidden cost may erase the margin. Reprice before accepting this load.",
    },
    {
      fieldId: "totalFreightCost",
      warning: 900,
      critical: 1200,
      direction: "higher_is_bad",
      warningMessage: "Visible cost is approaching typical quote band - check fuel variance.",
      criticalMessage: "Freight cost exceeds safe band - raise price or cut deadhead.",
    },
  ],

  reportTemplate: {
    title: "Route Loss Decision Report",
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
    volatilityPercent: 23,
    targetMarginPercent: 18,
    assumptionNotes: [
      "Deadhead assumes unpaid return as percent of loaded km.",
      "Delay and fuel variance buffers included in hidden multiplier.",
      "Verify lane-specific detention and toll changes before dispatch.",
    ],
  },
};
