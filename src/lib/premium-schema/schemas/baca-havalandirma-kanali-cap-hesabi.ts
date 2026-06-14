import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";

/** P7 nightrun — DeepSeek Chief Engineer schema (factory generated). */
export const BacaHavalandirmaKanaliCapHesabi_SCHEMA: PremiumCalculatorSchema = {
  id: "baca-havalandirma-kanali-cap-hesabi",
  name: "Baca — Havalandırma Kanalı Çap Calculation",
  sectorSlug: "general-industrial",
  category: "cost",
  painStatement: "ASHRAE Fundamentals – Duct Design, equal friction method",

  inputs: [
    {
      id: "airflowRate",
      label: "Airflow rate",
      type: "number",
      unit: "m³/s",
      required: true,
      smartDefault: 1,
      validation: { min: 0.01, max: 1000 },
      helper: "Must be positive, typical range 0.01–1000 m³/s",
      expertMeaning: "Airflow rate",
    },
    {
      id: "airVelocity",
      label: "Air velocity",
      type: "number",
      unit: "m/s",
      required: true,
      smartDefault: 8,
      validation: { min: 1, max: 30 },
      helper: "Typical duct velocity 1–30 m/s",
      expertMeaning: "Air velocity",
    },
    {
      id: "ductLength",
      label: "Duct length",
      type: "number",
      unit: "m",
      required: true,
      smartDefault: 10,
      validation: { min: 0.1, max: 1000 },
      helper: "Positive length",
      expertMeaning: "Duct length",
    },
    {
      id: "frictionFactor",
      label: "Friction factor (Darcy)",
      type: "number",
      unit: "dimensionless",
      required: true,
      smartDefault: 0.02,
      validation: { min: 0.01, max: 0.1 },
      helper: "Typical range 0.01–0.1 for smooth to rough ducts",
      expertMeaning: "Friction factor (Darcy)",
    },
    {
      id: "airDensity",
      label: "Air density",
      type: "number",
      unit: "kg/m³",
      required: true,
      smartDefault: 1.2,
      validation: { min: 0.9, max: 1.3 },
      helper: "Standard air density ~1.2 kg/m³ at 20°C",
      expertMeaning: "Air density",
    },
    {
      id: "localLossCoefficient",
      label: "Local loss coefficient (sum of K)",
      type: "number",
      unit: "dimensionless",
      required: true,
      smartDefault: 2,
      validation: { min: 0, max: 100 },
      helper: "Sum of K factors for fittings; typical 0–100",
      expertMeaning: "Local loss coefficient (sum of K)",
    }
  ],

  formulaPipeline: [
    {
      formulaId: "cost.total_exposure",
      inputMap: {
        "a": "airflowRate",
        "b": "airVelocity",
        "c": "ductLength"
      },
      outputId: "totalExposure",
    },
    {
      formulaId: "benchmark.variance_percent",
      inputMap: {
        "actual": "airflowRate",
        "target": "airVelocity"
      },
      outputId: "variancePercent",
    }
  ],

  outputs: [
    {
      id: "totalExposure",
      label: "Duct diameter (circular equivalent)",
      unit: "m",
      format: "currency",
      isBigNumber: true,
    },
    {
      id: "variancePercent",
      label: "Cross-sectional area",
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
      "Incompressible flow (Mach < 0.3)",
      "Fully developed turbulent flow",
      "Constant air density",
    ],
  },
};
