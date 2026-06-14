import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";

/** P7 nightrun — DeepSeek Chief Engineer schema (factory generated). */
export const BoruAgirlikHesaplamaCelikPaslanmaz_SCHEMA: PremiumCalculatorSchema = {
  id: "boru-agirlik-hesaplama-celik-paslanmaz",
  name: "Boru Ağırlık Calculation (Çelik, Paslanmaz)",
  sectorSlug: "general-industrial",
  category: "cost",
  painStatement: "Standard engineering formula for cylindrical pipe weight",

  inputs: [
    {
      id: "outerDiameter",
      label: "Outer diameter",
      type: "number",
      unit: "mm",
      required: true,
      smartDefault: 100,
      validation: { min: 1, max: 5000 },
      helper: "Must be positive",
      expertMeaning: "Outer diameter",
    },
    {
      id: "wallThickness",
      label: "Wall thickness",
      type: "number",
      unit: "mm",
      required: true,
      smartDefault: 5,
      validation: { min: 0.1, max: 500 },
      helper: "Must be positive and less than outer diameter",
      expertMeaning: "Wall thickness",
    },
    {
      id: "length",
      label: "Length",
      type: "number",
      unit: "m",
      required: true,
      smartDefault: 6,
      validation: { min: 0.1, max: 100 },
      helper: "Must be positive",
      expertMeaning: "Length",
    },
    {
      id: "materialDensity",
      label: "Material density",
      type: "number",
      unit: "kg/m³",
      required: true,
      smartDefault: 7850,
      validation: { min: 1000, max: 20000 },
      helper: "Must be positive",
      expertMeaning: "Material density",
    }
  ],

  formulaPipeline: [
    {
      formulaId: "cost.total_exposure",
      inputMap: {
        "a": "outerDiameter",
        "b": "wallThickness",
        "c": "length"
      },
      outputId: "totalExposure",
    },
    {
      formulaId: "benchmark.variance_percent",
      inputMap: {
        "actual": "outerDiameter",
        "target": "wallThickness"
      },
      outputId: "variancePercent",
    }
  ],

  outputs: [
    {
      id: "totalExposure",
      label: "Pipe weight",
      unit: "kg",
      format: "currency",
      isBigNumber: true,
    },
    {
      id: "variancePercent",
      label: "Weight per meter",
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
      "Pipe is straight and uniform cross-section",
      "Density is constant throughout",
      "No internal or external coatings",
    ],
  },
};
