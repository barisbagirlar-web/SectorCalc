import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";

export const BOLT_TIGHTENING_TORQUE_CALCULATOR_SCHEMA: PremiumCalculatorSchema = {
  id: "bolt-tightening-torque-calculator",
  name: "Bolt Tightening Torque Calculator",
  sectorSlug: "manufacturing",
  category: "measurement",
  painStatement:
    "Assembly teams guess torque without a documented clamp-force method.",

  inputs: [
    {
      id: "clampForceKn",
      label: "Clamp force",
      type: "number",
      unit: "kN",
      required: true,
      smartDefault: 45,
      validation: { min: 0.01 },
      helper: "Target clamp or preload force for the joint.",
      expertMeaning: "Axial load the bolt must maintain in service.",
    },
    {
      id: "boltDiameterMm",
      label: "Bolt diameter",
      type: "number",
      unit: "mm",
      required: true,
      smartDefault: 16,
      validation: { min: 1 },
      helper: "Nominal bolt diameter.",
      expertMeaning: "Effective diameter for torque conversion.",
    },
    {
      id: "frictionFactor",
      label: "Friction factor",
      type: "number",
      unit: "×",
      required: true,
      smartDefault: 0.2,
      validation: { min: 0.05, max: 1 },
      helper: "Nut factor K for dry steel (typical 0.15–0.25).",
      expertMeaning: "Lubrication and surface condition multiplier.",
    },
  ],

  formulaPipeline: [
    {
      formulaId: "measurement.bolt_tightening_torque",
      inputMap: {
        clampForceKn: "clampForceKn",
        boltDiameterMm: "boltDiameterMm",
        frictionFactor: "frictionFactor",
      },
      outputId: "torqueNm",
    },
  ],

  outputs: [
    {
      id: "torqueNm",
      label: "Estimated torque",
      unit: "N·m",
      format: "number",
      isBigNumber: true,
    },
  ],

  thresholds: [
    {
      fieldId: "torqueNm",
      warning: 80,
      critical: 200,
      direction: "higher_is_bad",
      warningMessage: "Torque estimate is high — verify lubrication and tool calibration.",
      criticalMessage: "Torque estimate exceeds typical hand-tool range — use controlled tightening procedure.",
    },
  ],

  reportTemplate: {
    title: "Bolt Tightening Torque Decision Report",
    sections: ["executive_summary", "thresholds", "assumptions", "action_plan"],
    exportFormats: ["pdf", "csv"],
  },

  assumptions: {
    hiddenLossMultiplier: 1,
    volatilityPercent: 5,
    targetMarginPercent: 0,
    assumptionNotes: [
      "Torque ≈ clamp force × bolt diameter × friction factor (screening model).",
      "Verify against OEM torque tables and lubricant specification.",
      "Not a substitute for qualified fastening procedure or joint testing.",
    ],
  },
};
