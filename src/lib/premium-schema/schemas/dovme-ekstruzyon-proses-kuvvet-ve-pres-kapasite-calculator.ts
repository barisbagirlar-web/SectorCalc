import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";

/** P7 nightrun — DeepSeek Chief Engineer schema (factory generated). */
export const DovmeEkstruzyonProsesKuvvetVePresKapasiteCalculator_SCHEMA: PremiumCalculatorSchema = {
  id: "dovme-ekstruzyon-proses-kuvvet-ve-pres-kapasite-calculator",
  name: "Dovme Ekstruzyon Proses Kuvvet Ve Pres Kapasite",
  sectorSlug: "general-industrial",
  category: "cost",
  painStatement: "Metal forming mechanics and press sizing standards (e.g., ASM Metals Handbook, DIN 8583)",

  inputs: [
    {
      id: "partLength",
      label: "Part length (for projected area)",
      type: "number",
      unit: "mm",
      required: true,
      smartDefault: 100,
      validation: { min: 1, max: 10000 },
      helper: "Must be positive length",
      expertMeaning: "Part length (for projected area)",
    },
    {
      id: "partWidth",
      label: "Part width (for projected area)",
      type: "number",
      unit: "mm",
      required: true,
      smartDefault: 50,
      validation: { min: 1, max: 10000 },
      helper: "Must be positive width",
      expertMeaning: "Part width (for projected area)",
    },
    {
      id: "flowStress",
      label: "Flow stress of material at forming temperature",
      type: "number",
      unit: "MPa",
      required: true,
      smartDefault: 200,
      validation: { min: 1, max: 2000 },
      helper: "Must be positive stress value typical for forging/extrusion",
      expertMeaning: "Flow stress of material at forming temperature",
    },
    {
      id: "shapeComplexityFactor",
      label: "Shape complexity factor",
      type: "number",
      unit: "dimensionless",
      required: true,
      smartDefault: 1.5,
      validation: { min: 1, max: 3 },
      helper: "Typically between 1.2 and 3.0; higher for complex geometries",
      expertMeaning: "Shape complexity factor",
    },
    {
      id: "safetyFactor",
      label: "Safety factor for press capacity",
      type: "number",
      unit: "dimensionless",
      required: true,
      smartDefault: 1.2,
      validation: { min: 1, max: 1.5 },
      helper: "Typically 1.1 to 1.3; higher for critical parts",
      expertMeaning: "Safety factor for press capacity",
    },
    {
      id: "pressNominalCapacity",
      label: "Press nominal capacity",
      type: "number",
      unit: "kN",
      required: true,
      smartDefault: 5000,
      validation: { min: 100, max: 1000000 },
      helper: "Must be positive and within typical press range",
      expertMeaning: "Press nominal capacity",
    }
  ],

  formulaPipeline: [
    {
      formulaId: "cost.total_exposure",
      inputMap: {
        "a": "partLength",
        "b": "partWidth",
        "c": "flowStress"
      },
      outputId: "totalExposure",
    },
    {
      formulaId: "benchmark.variance_percent",
      inputMap: {
        "actual": "partLength",
        "target": "partWidth"
      },
      outputId: "variancePercent",
    }
  ],

  outputs: [
    {
      id: "totalExposure",
      label: "Required forging/extrusion force",
      unit: "kN",
      format: "currency",
      isBigNumber: true,
    },
    {
      id: "variancePercent",
      label: "Press capacity utilization",
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
      "Projected area approximated as rectangle (length * width); for complex shapes, use equivalent projected area.",
      "Flow stress is constant and representative of the forming process (temperature, strain rate effects ignored).",
      "Shape complexity factor accounts for friction, die geometry, and redundant work; typical values from literature.",
    ],
  },
};
