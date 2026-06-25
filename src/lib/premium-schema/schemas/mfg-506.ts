import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";

export const HYDRAULIC_PNEUMATIC_CYLINDER_FORCE_CALCULATOR_SCHEMA: PremiumCalculatorSchema = {
  id: "mfg-506",
  name: "Hydraulic and Pneumatic Cylinder Force Calculator",
  sectorSlug: "manufacturing",
  category: "measurement",
  painStatement:
    "Cylinder selection often skips force checks before actuator purchase.",

  inputs: [],

  outputs: [],

  thresholds: [
    {
      fieldId: "extendForceN",
      warning: 15000,
      critical: 40000,
      direction: "higher_is_bad",
      warningMessage: "Extend force is high — verify mountings and safety margins.",
      criticalMessage: "Extend force is very high — confirm cylinder rating and plumbing.",
    },
  ],

  reportTemplate: {
    title: "Cylinder Force Screening Report",
    sections: ["executive_summary", "thresholds", "assumptions", "action_plan"],
    exportFormats: ["pdf", "csv"],
  },

  assumptions: {
    hiddenLossMultiplier: 1,
    volatilityPercent: 5,
    targetMarginPercent: 0,
    assumptionNotes: [
      "Extend force ≈ pressure × piston area (1 bar ≈ 0.1 N/mm²).",
      "Retreat uses rod diameter as annulus proxy — screening only.",
      "Friction, seal drag and pressure drop are not modeled.",
    ],
  },
};
