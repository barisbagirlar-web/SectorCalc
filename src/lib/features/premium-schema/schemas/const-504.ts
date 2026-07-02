import type { PremiumCalculatorSchema } from "@/lib/features/premium-schema/premium-calculator-schema";

export const FIRE_SYSTEM_FLOW_HYDRANT_CALCULATOR_SCHEMA: PremiumCalculatorSchema = {
  id: "const-504",
  name: "Fire System Flow and Hydrant Calculator",
  sectorSlug: "construction",
  category: "measurement",
  painStatement:
    "Fire protection bids miss flow demand before hydrant and pipe sizing.",

  inputs: [],

  outputs: [],

  thresholds: [
    {
      fieldId: "flowDemandLpm",
      warning: 8000,
      critical: 15000,
      direction: "higher_is_bad",
      warningMessage: "Flow demand is material — confirm pipe sizing and pump head.",
      criticalMessage: "Flow demand is very high — escalate hydraulic study before bid.",
    },
  ],

  reportTemplate: {
    title: "Fire Flow and Hydrant Decision Report",
    sections: ["executive_summary", "thresholds", "assumptions", "action_plan"],
    exportFormats: ["pdf", "csv"],
  },

  assumptions: {
    hiddenLossMultiplier: 1,
    volatilityPercent: 5,
    targetMarginPercent: 0,
    assumptionNotes: [
      "Flow demand = protected area × design density.",
      "Hydrant count = ceil(flow demand ÷ hydrant capacity).",
      "Informational screening only — verify with local fire code and hydraulic calculations.",
    ],
  },
};
