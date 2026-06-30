import type { PremiumCalculatorSchema } from "@/lib/features/premium-schema/premium-calculator-schema";

export const PRESSURE_VESSEL_WALL_THICKNESS_CALCULATOR_SCHEMA: PremiumCalculatorSchema = {
  id: "pressure-vessel-wall-thickness-calculator",
  name: "Pressure Vessel Wall Thickness Calculator",
  sectorSlug: "manufacturing",
  category: "measurement",
  painStatement:
    "Fabricators need a quick thickness screen before detailed ASME calculations.",

  inputs: [],

  outputs: [],

  thresholds: [
    {
      fieldId: "wallThicknessMm",
      warning: 8,
      critical: 3,
      direction: "lower_is_bad",
      warningMessage: "Wall thickness is thin for the entered pressure — review material and joint efficiency.",
      criticalMessage: "Wall thickness is critically thin — obtain qualified pressure vessel design review.",
    },
  ],

  reportTemplate: {
    title: "Pressure Vessel Wall Thickness Screening Report",
    sections: ["executive_summary", "thresholds", "assumptions", "action_plan"],
    exportFormats: ["pdf", "csv"],
  },

  assumptions: {
    hiddenLossMultiplier: 1,
    volatilityPercent: 5,
    targetMarginPercent: 0,
    assumptionNotes: [
      "Screening thickness ≈ P × D ÷ (2 × S × E) with unit conversion proxy.",
      "Corrosion allowance, nozzle reinforcement and code editions are not modeled.",
      "Not ASME/API compliance output — engineering sign-off required.",
    ],
  },
};
