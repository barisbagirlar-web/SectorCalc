import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";

/** P7 nightrun — DeepSeek Chief Engineer schema (factory generated). */
export const YayHeliselKuvvetUzamaHesabi_SCHEMA: PremiumCalculatorSchema = {
  id: "yay-helisel-kuvvet-uzama-hesabi",
  name: "Yay (Helisel) Kuvvet — Uzama Calculation",
  sectorSlug: "general-industrial",
  category: "cost",
  painStatement: "Hooke yasası ve yay sabiti formülü (k = G*d^4/(8*D^3*n))",

  inputs: [
    {
      id: "shearModulus",
      label: "Shear modulus (G)",
      type: "number",
      unit: "MPa",
      required: true,
      smartDefault: 80000,
      validation: { min: 1000, max: 100000 },
      helper: "Typical steel 80000 MPa, stainless 77000 MPa",
      expertMeaning: "Shear modulus (G)",
    },
    {
      id: "wireDiameter",
      label: "Wire diameter (d)",
      type: "number",
      unit: "mm",
      required: true,
      smartDefault: 5,
      validation: { min: 0.1, max: 100 },
      helper: "Must be positive",
      expertMeaning: "Wire diameter (d)",
    },
    {
      id: "meanCoilDiameter",
      label: "Mean coil diameter (D)",
      type: "number",
      unit: "mm",
      required: true,
      smartDefault: 40,
      validation: { min: 1, max: 500 },
      helper: "Must be greater than wire diameter",
      expertMeaning: "Mean coil diameter (D)",
    },
    {
      id: "activeCoils",
      label: "Number of active coils (n)",
      type: "number",
      unit: "dimensionless",
      required: true,
      smartDefault: 10,
      validation: { min: 1, max: 100 },
      helper: "Must be positive integer",
      expertMeaning: "Number of active coils (n)",
    },
    {
      id: "deflection",
      label: "Deflection (x)",
      type: "number",
      unit: "mm",
      required: true,
      smartDefault: 10,
      validation: { min: 0, max: 1000 },
      helper: "Non-negative",
      expertMeaning: "Deflection (x)",
    },
    {
      id: "yieldShearStress",
      label: "Yield shear stress (τ_akma)",
      type: "number",
      unit: "MPa",
      required: true,
      smartDefault: 600,
      validation: { min: 100, max: 2000 },
      helper: "Typical spring steel 600-1200 MPa",
      expertMeaning: "Yield shear stress (τ_akma)",
    }
  ],

  formulaPipeline: [
    {
      formulaId: "cost.total_exposure",
      inputMap: {
        "a": "shearModulus",
        "b": "wireDiameter",
        "c": "meanCoilDiameter"
      },
      outputId: "totalExposure",
    },
    {
      formulaId: "benchmark.variance_percent",
      inputMap: {
        "actual": "shearModulus",
        "target": "wireDiameter"
      },
      outputId: "variancePercent",
    }
  ],

  outputs: [
    {
      id: "totalExposure",
      label: "Spring force (F)",
      unit: "N",
      format: "currency",
      isBigNumber: true,
    },
    {
      id: "variancePercent",
      label: "Maximum shear stress (τ_max)",
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
      "Material is isotropic and homogeneous",
      "Spring is cylindrical and close-coiled",
      "No residual stresses",
    ],
  },
};
