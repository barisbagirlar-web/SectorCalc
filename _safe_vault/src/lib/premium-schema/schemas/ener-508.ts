import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";

export const ENERGY_SAVINGS_PACKAGE_CALCULATOR_SCHEMA: PremiumCalculatorSchema = {
  id: "ener-508",
  name: "Energy Savings Package Calculator",
  sectorSlug: "energy-carbon",
  category: "energy",
  painStatement:
    "Efficiency projects move forward without a documented savings and payback baseline.",

  inputs: [],

  outputs: [],

  thresholds: [
    {
      fieldId: "paybackYears",
      warning: 4,
      critical: 7,
      direction: "higher_is_bad",
      warningMessage: "Payback exceeds four years — verify incentive and tariff assumptions.",
      criticalMessage: "Payback exceeds seven years — project economics need review.",
    },
  ],

  reportTemplate: {
    title: "Energy Savings Package Summary",
    sections: ["executive_summary", "thresholds", "assumptions", "action_plan"],
    exportFormats: ["pdf"],
  },

  assumptions: {
    hiddenLossMultiplier: 1,
    volatilityPercent: 5,
    targetMarginPercent: 0,
    assumptionNotes: [
      "Savings = (baseline − proposed) kWh × tariff, annualized.",
      "Payback = project cost ÷ annual savings.",
      "Informational screening only — excludes maintenance, incentives and demand charges.",
    ],
  },
};
