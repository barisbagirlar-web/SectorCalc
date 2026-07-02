import type { PremiumCalculatorSchema } from "@/lib/features/premium-schema/premium-calculator-schema";

export const ENERGY_COMPRESSOR_LEAK_COST_SCHEMA: PremiumCalculatorSchema = {
  id: "ener-506",
  name: "Compressor Leak Cost Calculator",
  sectorSlug: "energy-carbon",
  category: "energy",
  legacyPaidSlug: "cbam-compliance-verdict",
  painStatement:
    "Compressed air leaks turn electricity into invisible production cost.",

  inputs: [],

  outputs: [],

  thresholds: [
    {
      fieldId: "leakPercent",
      warning: 8,
      critical: 15,
      direction: "higher_is_bad",
      warningMessage:
        "Leak percent is above typical industrial band - schedule ultrasonic audit.",
      criticalMessage:
        "Critical leak band - compressed air waste may exceed maintenance budget.",
    },
    {
      fieldId: "monthlyLeakCost",
      warning: 500,
      critical: 1500,
      direction: "higher_is_bad",
      warningMessage: "Monthly leak cost is material - prioritize valve and fitting repairs.",
      criticalMessage:
        "Critical leak cost - stop treating compressed air loss as fixed overhead.",
    },
  ],

  reportTemplate: {
    title: "Compressor Leak Cost Decision Report",
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
    hiddenLossMultiplier: 1.04,
    volatilityPercent: 8,
    targetMarginPercent: 10,
    assumptionNotes: [
      "Leak kWh = compressor kW × operating hours × leak percent.",
      "Monthly leak cost = leak kWh × energy rate.",
      "Annual leak cost = monthly leak cost × 12.",
    ],
  },
};
