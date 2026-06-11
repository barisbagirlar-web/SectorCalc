import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";

export const HYDRAULIC_PNEUMATIC_CYLINDER_FORCE_CALCULATOR_SCHEMA: PremiumCalculatorSchema = {
  id: "hydraulic-pneumatic-cylinder-force-calculator",
  name: "Hydraulic and Pneumatic Cylinder Force Calculator",
  sectorSlug: "manufacturing",
  category: "measurement",
  painStatement:
    "Cylinder selection often skips force checks before actuator purchase.",

  inputs: [
    {
      id: "pressureBar",
      label: "System pressure",
      type: "number",
      unit: "bar",
      required: true,
      smartDefault: 160,
      validation: { min: 0.1 },
      helper: "Working pressure at the cylinder port.",
      expertMeaning: "Gauge pressure applied to bore area.",
    },
    {
      id: "boreMm",
      label: "Bore diameter",
      type: "number",
      unit: "mm",
      required: true,
      smartDefault: 63,
      validation: { min: 1 },
      helper: "Cylinder bore inner diameter.",
      expertMeaning: "Effective piston diameter for force estimate.",
    },
    {
      id: "rodMm",
      label: "Rod diameter",
      type: "number",
      unit: "mm",
      required: true,
      smartDefault: 36,
      validation: { min: 0 },
      helper: "Rod diameter for retract force (optional screening).",
      expertMeaning: "Annulus area on retract stroke.",
    },
  ],

  formulaPipeline: [
    {
      formulaId: "measurement.cylinder_force",
      inputMap: { pressureBar: "pressureBar", boreMm: "boreMm" },
      outputId: "extendForceN",
    },
    {
      formulaId: "measurement.cylinder_retract_force",
      inputMap: {
        pressureBar: "pressureBar",
        boreMm: "boreMm",
        rodMm: "rodMm",
      },
      outputId: "retractForceN",
    },
  ],

  outputs: [
    {
      id: "extendForceN",
      label: "Extend force",
      unit: "N",
      format: "number",
      isBigNumber: true,
    },
    {
      id: "retractForceN",
      label: "Retract force (rod side)",
      unit: "N",
      format: "number",
    },
  ],

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
