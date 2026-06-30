import type { PremiumCalculatorSchema } from "@/lib/features/premium-schema/premium-calculator-schema";

export const VALUE_STREAM_MAP_VSM_CALCULATOR_SCHEMA: PremiumCalculatorSchema = {
  id: "value-stream-map-vsm-calculator",
  name: "Value Stream Map VSM Calculator",
  sectorSlug: "manufacturing",
  category: "time",
  painStatement:
    "Lead time hides in queues and transport while teams only track processing time.",

  inputs: [],

  outputs: [],

  thresholds: [
    {
      fieldId: "valueAddedPercent",
      warning: 15,
      critical: 5,
      direction: "lower_is_bad",
      warningMessage: "Value-added ratio is low — prioritize queue and transport waste.",
      criticalMessage: "Value-added ratio is critically low — run kaizen on wait and transport steps.",
    },
  ],

  reportTemplate: {
    title: "Value Stream Lead Time Decision Report",
    sections: ["executive_summary", "thresholds", "sensitivity", "action_plan"],
    exportFormats: ["pdf", "csv"],
  },

  assumptions: {
    hiddenLossMultiplier: 1,
    volatilityPercent: 5,
    targetMarginPercent: 0,
    assumptionNotes: [
      "Total lead time = process + wait + transport minutes.",
      "Value-added % = process time ÷ total lead time × 100.",
      "Classic VSM screening — does not replace detailed cycle-time studies.",
    ],
  },
};
