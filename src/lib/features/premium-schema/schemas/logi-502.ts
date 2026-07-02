import type { PremiumCalculatorSchema } from "@/lib/features/premium-schema/premium-calculator-schema";

export const LOGISTICS_FUEL_ROUTE_DRIFT_SCHEMA: PremiumCalculatorSchema = {
  id: "logi-502",
  name: "Fuel and Route Drift Calculator",
  sectorSlug: "logistics-transport",
  category: "route",
  legacyPaidSlug: "trip-budget-optimizer",
  painStatement:
    "Logistics routes lose money when fuel drift, idle time and route deviation are treated as normal cost.",

  inputs: [],

  outputs: [],

  thresholds: [
    {
      fieldId: "idleHours",
      warning: 3,
      critical: 8,
      direction: "higher_is_bad",
      warningMessage:
        "Idle hours are above plan — route sequencing or loading windows may need adjustment.",
      criticalMessage:
        "Critical idle exposure — fuel and labor drift may erase route margin.",
    },
  ],

  reportTemplate: {
    title: "Fuel and Route Drift Decision Report",
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
    hiddenLossMultiplier: 1.07,
    volatilityPercent: 15,
    targetMarginPercent: 14,
    assumptionNotes: [
      "Distance drift cost = max(actual km − planned km, 0) × fuel cost per km.",
      "Idle cost = idle hours × hourly cost.",
      "Total exposure sums distance drift and idle cost.",
    ],
  },
};
