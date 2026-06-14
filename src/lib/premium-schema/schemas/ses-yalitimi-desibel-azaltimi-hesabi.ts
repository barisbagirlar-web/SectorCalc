import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";

/** P7 nightrun — DeepSeek Chief Engineer schema (factory generated). */
export const SesYalitimiDesibelAzaltimiHesabi_SCHEMA: PremiumCalculatorSchema = {
  id: "ses-yalitimi-desibel-azaltimi-hesabi",
  name: "Ses Yalıtımı (Desibel Azaltımı) Calculation",
  sectorSlug: "general-industrial",
  category: "cost",
  painStatement: "Acoustical engineering standard using mass law and material absorption coefficients",

  inputs: [
    {
      id: "surfaceMass",
      label: "Surface mass of partition",
      type: "number",
      unit: "kg/m²",
      required: true,
      smartDefault: 10,
      validation: { min: 1, max: 1000 },
      helper: "Must be positive",
      expertMeaning: "Surface mass of partition",
    },
    {
      id: "frequency",
      label: "Frequency",
      type: "number",
      unit: "Hz",
      required: true,
      smartDefault: 500,
      validation: { min: 100, max: 5000 },
      helper: "Typically 100-5000 Hz",
      expertMeaning: "Frequency",
    },
    {
      id: "absorptionCoefficient",
      label: "Average absorption coefficient of receiving room",
      type: "number",
      unit: "dimensionless",
      required: true,
      smartDefault: 0.2,
      validation: { min: 0.01, max: 0.99 },
      helper: "Between 0 and 1",
      expertMeaning: "Average absorption coefficient of receiving room",
    },
    {
      id: "partitionArea",
      label: "Partition area",
      type: "number",
      unit: "m²",
      required: true,
      smartDefault: 10,
      validation: { min: 1, max: 1000 },
      helper: "Must be positive",
      expertMeaning: "Partition area",
    },
    {
      id: "roomAbsorption",
      label: "Total room absorption (sabins)",
      type: "number",
      unit: "sabins",
      required: true,
      smartDefault: 50,
      validation: { min: 0.1, max: 10000 },
      helper: "Must be positive",
      expertMeaning: "Total room absorption (sabins)",
    },
    {
      id: "sealLoss",
      label: "Seal loss (if any)",
      type: "number",
      unit: "dB",
      required: false,
      smartDefault: 0,
      validation: { min: 0, max: 10 },
      helper: "Non-negative, typically 0-5 dB",
      expertMeaning: "Seal loss (if any)",
    }
  ],

  formulaPipeline: [
    {
      formulaId: "cost.total_exposure",
      inputMap: {
        "a": "surfaceMass",
        "b": "frequency",
        "c": "absorptionCoefficient"
      },
      outputId: "totalExposure",
    },
    {
      formulaId: "benchmark.variance_percent",
      inputMap: {
        "actual": "surfaceMass",
        "target": "frequency"
      },
      outputId: "variancePercent",
    }
  ],

  outputs: [
    {
      id: "totalExposure",
      label: "Noise reduction (dB)",
      unit: "dB",
      format: "currency",
      isBigNumber: true,
    },
    {
      id: "variancePercent",
      label: "Transmission loss (dB)",
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
      "Partition is homogeneous and infinite in extent (mass law approximation)",
      "Diffuse sound field in both rooms",
      "Absorption coefficient is averaged over frequency bands",
    ],
  },
};
