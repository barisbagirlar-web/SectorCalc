import type { PremiumCalculatorSchema } from "@/lib/features/premium-schema/premium-calculator-schema";

export const HEAT_LOSS_CALCULATOR_SCHEMA: PremiumCalculatorSchema = {
  id: "ener-509",
  name: "Heat Loss Calculator",
  sectorSlug: "energy-consumption",
  category: "energy",
  legacyPaidSlug: "heat-loss-calculator",
  painStatement:
    "Steady-state heat loss in watts.",

  inputs: [],

  outputs: [],

  thresholds: [
    {
      fieldId: "kwhVariancePercent",
      warning: 10,
      critical: 20,
      direction: "higher_is_bad",
      warningMessage: "Consumption is above target - peak and idle load may be driving cost.",
      criticalMessage: "Energy and delay exposure are the main risk drivers - audit peak demand now.",
    },
    {
      fieldId: "totalEnergyCost",
      warning: 1800,
      critical: 2500,
      direction: "higher_is_bad",
      warningMessage: "Total energy cost is elevated versus typical efficiency band.",
      criticalMessage: "High risk - hidden cost may erase the margin on this budget period.",
    },
  ],

  reportTemplate: {
    title: "Energy Peak Loss Decision Report",
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
    hiddenLossMultiplier: 1.08,
    volatilityPercent: 18,
    targetMarginPercent: 10,
    assumptionNotes: [
      "Excess kWh = max(current − target, 0).",
      "Peak demand and tariff risk included in hidden multiplier.",
      "Tariff changes and power factor penalties not modeled unless you add inputs.",
    ],
  },
};
