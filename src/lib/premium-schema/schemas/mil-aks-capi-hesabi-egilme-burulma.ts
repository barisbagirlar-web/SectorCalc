import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";

/** P7 nightrun — DeepSeek Chief Engineer schema (factory generated). */
export const MilAksCapiHesabiEgilmeBurulma_SCHEMA: PremiumCalculatorSchema = {
  id: "mil-aks-capi-hesabi-egilme-burulma",
  name: "Mil — Aks Çapı Calculation (Eğilme — Burulma)",
  sectorSlug: "general-industrial",
  category: "cost",
  painStatement: "Distortion energy theory (von Mises) for combined stress, with fatigue and safety factors",

  inputs: [
    {
      id: "bendingMoment",
      label: "Bending moment",
      type: "number",
      unit: "N·mm",
      required: true,
      smartDefault: 100000,
      validation: { min: 0, max: 1000000000 },
      helper: "Non-negative, up to 1e9 N·mm",
      expertMeaning: "Bending moment",
    },
    {
      id: "torsionMoment",
      label: "Torsion moment",
      type: "number",
      unit: "N·mm",
      required: true,
      smartDefault: 50000,
      validation: { min: 0, max: 1000000000 },
      helper: "Non-negative, up to 1e9 N·mm",
      expertMeaning: "Torsion moment",
    },
    {
      id: "yieldStrength",
      label: "Yield strength of material",
      type: "number",
      unit: "MPa",
      required: true,
      smartDefault: 250,
      validation: { min: 1, max: 3000 },
      helper: "Positive, typical steel range 200-2000 MPa",
      expertMeaning: "Yield strength of material",
    },
    {
      id: "safetyFactor",
      label: "Safety factor",
      type: "number",
      unit: "dimensionless",
      required: true,
      smartDefault: 2,
      validation: { min: 1, max: 10 },
      helper: "Between 1 and 10",
      expertMeaning: "Safety factor",
    },
    {
      id: "fatigueStressConcentrationFactor",
      label: "Fatigue stress concentration factor (Kf)",
      type: "number",
      unit: "dimensionless",
      required: true,
      smartDefault: 1.5,
      validation: { min: 1, max: 5 },
      helper: "Typically 1.0 to 3.0 for keyways/notches",
      expertMeaning: "Fatigue stress concentration factor (Kf)",
    },
    {
      id: "hasKeyway",
      label: "Keyway present",
      type: "number",
      unit: "",
      required: true,
      smartDefault: 1,
      validation: { min: 0 },
      helper: "Boolean flag",
      expertMeaning: "Keyway present",
    }
  ],

  formulaPipeline: [
    {
      formulaId: "cost.total_exposure",
      inputMap: {
        "a": "bendingMoment",
        "b": "torsionMoment",
        "c": "yieldStrength"
      },
      outputId: "totalExposure",
    },
    {
      formulaId: "benchmark.variance_percent",
      inputMap: {
        "actual": "bendingMoment",
        "target": "torsionMoment"
      },
      outputId: "variancePercent",
    }
  ],

  outputs: [
    {
      id: "totalExposure",
      label: "Required shaft diameter (minimum)",
      unit: "mm",
      format: "currency",
      isBigNumber: true,
    },
    {
      id: "variancePercent",
      label: "Equivalent bending moment (Me)",
      unit: "%",
      format: "percentage",
      isBigNumber: false,
    }
  ],

  thresholds: [
    {
      fieldId: "totalExposure",
      warning: 1,
      critical: 3,
      direction: "higher_is_bad",
      warningMessage: "Exposure is entering warning band — review drivers.",
      criticalMessage: "Exposure is critical — immediate operational review required.",
    },
  ],

  reportTemplate: {
    title: "[object Object] Decision Report",
    sections: ["executive_summary", "thresholds", "sensitivity", "action_plan", "assumptions"],
    exportFormats: ["pdf", "csv"],
  },

  assumptions: {
    hiddenLossMultiplier: 1.05,
    volatilityPercent: 8,
    targetMarginPercent: 15,
    assumptionNotes: [
      "Solid circular shaft cross-section",
      "Steady-state loading (no impact or shock)",
      "Material is homogeneous and isotropic",
    ],
  },
};
