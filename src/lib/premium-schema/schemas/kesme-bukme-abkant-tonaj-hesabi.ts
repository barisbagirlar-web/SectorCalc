import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";

/** P7 nightrun — DeepSeek Chief Engineer schema (factory generated). */
export const KesmeBukmeAbkantTonajHesabi_SCHEMA: PremiumCalculatorSchema = {
  id: "kesme-bukme-abkant-tonaj-hesabi",
  name: "Kesme Bükme (Abkant) Tonaj Calculation",
  sectorSlug: "general-industrial",
  category: "cost",
  painStatement: "Sac metal bükme işlemlerinde gerekli tonajın hesaplanması için endüstri standardı formül (V-die yöntemi)",

  inputs: [
    {
      id: "tensileStrength",
      label: "Tensile strength of material",
      type: "number",
      unit: "N/mm²",
      required: true,
      smartDefault: 450,
      validation: { min: 100, max: 2000 },
      helper: "Must be between 100 and 2000 N/mm²",
      expertMeaning: "Tensile strength of material",
    },
    {
      id: "materialThickness",
      label: "Material thickness",
      type: "number",
      unit: "mm",
      required: true,
      smartDefault: 2,
      validation: { min: 0.5, max: 25 },
      helper: "Must be between 0.5 and 25 mm",
      expertMeaning: "Material thickness",
    },
    {
      id: "bendLength",
      label: "Bend length",
      type: "number",
      unit: "mm",
      required: true,
      smartDefault: 1000,
      validation: { min: 10, max: 6000 },
      helper: "Must be between 10 and 6000 mm",
      expertMeaning: "Bend length",
    },
    {
      id: "dieOpening",
      label: "Die opening (V-width)",
      type: "number",
      unit: "mm",
      required: true,
      smartDefault: 16,
      validation: { min: 6, max: 200 },
      helper: "Must be between 6 and 200 mm; typically 8x thickness",
      expertMeaning: "Die opening (V-width)",
    },
    {
      id: "materialFactor",
      label: "Material factor",
      type: "number",
      unit: "dimensionless",
      required: true,
      smartDefault: 1,
      validation: { min: 0.5, max: 2 },
      helper: "Typically 1 for mild steel; 1.2 for stainless; 0.8 for aluminum",
      expertMeaning: "Material factor",
    },
    {
      id: "safetyFactor",
      label: "Safety factor",
      type: "number",
      unit: "dimensionless",
      required: true,
      smartDefault: 1.1,
      validation: { min: 1, max: 2 },
      helper: "Between 1 and 2; recommended 1.1",
      expertMeaning: "Safety factor",
    }
  ],

  formulaPipeline: [
    {
      formulaId: "cost.total_exposure",
      inputMap: {
        "a": "tensileStrength",
        "b": "materialThickness",
        "c": "bendLength"
      },
      outputId: "totalExposure",
    },
    {
      formulaId: "benchmark.variance_percent",
      inputMap: {
        "actual": "tensileStrength",
        "target": "materialThickness"
      },
      outputId: "variancePercent",
    }
  ],

  outputs: [
    {
      id: "totalExposure",
      label: "Required tonnage",
      unit: "tons",
      format: "currency",
      isBigNumber: true,
    },
    {
      id: "variancePercent",
      label: "Bending force",
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
      "Material is homogeneous and isotropic",
      "Bending is air bending (V-die)",
      "Die opening is appropriate for thickness (typically 8x thickness)",
    ],
  },
};
