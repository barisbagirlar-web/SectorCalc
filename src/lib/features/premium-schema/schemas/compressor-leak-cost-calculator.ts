import type { PremiumCalculatorSchema } from "@/lib/features/premium-schema/premium-calculator-schema";

export const COMPRESSOR_LEAK_COST_CALCULATOR_SCHEMA: PremiumCalculatorSchema = {
  id: "compressor-leak-cost-calculator",
  name: "Compressor Leak Cost Calculator",
  sectorSlug: "energy-carbon",
  category: "energy",
  painStatement:
    "Compressed air leaks turn electricity into invisible production cost.",

  inputs: [],

  outputs: [],

  thresholds: [
    {
      fieldId: "annualLeakCost",
      warning: 6000,
      critical: 15000,
      direction: "higher_is_bad",
      warningMessage: "Leak cost is material — schedule ultrasonic leak survey.",
      criticalMessage: "Leak cost is severe — prioritize maintenance before next budget cycle.",
    },
  ],

  reportTemplate: {
    title: "Compressor Leak Cost Decision Report",
    sections: ["executive_summary", "loss_breakdown", "thresholds", "action_plan", "assumptions"],
    exportFormats: ["pdf", "csv"],
  },

  assumptions: {
    hiddenLossMultiplier: 1.08,
    volatilityPercent: 10,
    targetMarginPercent: 0,
    assumptionNotes: [
      "Leak kWh = compressor kW × leak percent × operating hours.",
      "Monthly cost = leak kWh × energy rate; annual = monthly × 12.",
    ],
  },
};
