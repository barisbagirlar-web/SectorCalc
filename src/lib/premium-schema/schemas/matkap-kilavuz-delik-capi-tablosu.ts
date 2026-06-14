import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";

/** P7 nightrun — DeepSeek Chief Engineer schema (factory generated). */
export const MatkapKilavuzDelikCapiTablosu_SCHEMA: PremiumCalculatorSchema = {
  id: "matkap-kilavuz-delik-capi-tablosu",
  name: "Matkap — Kılavuz Delik Çapı Tablosu",
  sectorSlug: "general-industrial",
  category: "cost",
  painStatement: "ISO 724 metric thread standard and tap drill size formula",

  inputs: [
    {
      id: "nominalThreadDiameter",
      label: "Nominal thread diameter",
      type: "number",
      unit: "mm",
      required: true,
      smartDefault: 10,
      validation: { min: 1, max: 100 },
      helper: "Must be positive and within standard metric thread range",
      expertMeaning: "Nominal thread diameter",
    },
    {
      id: "threadPitch",
      label: "Thread pitch",
      type: "number",
      unit: "mm",
      required: true,
      smartDefault: 1.5,
      validation: { min: 0.1, max: 10 },
      helper: "Must be positive and less than nominal diameter",
      expertMeaning: "Thread pitch",
    },
    {
      id: "materialType",
      label: "Material type",
      type: "number",
      unit: "",
      required: true,
      smartDefault: 1,
      validation: { min: 0 },
      helper: "Select from predefined list: steel, stainless, aluminum, cast_iron, brass",
      expertMeaning: "Material type",
    }
  ],

  formulaPipeline: [
    {
      formulaId: "cost.total_exposure",
      inputMap: {
        "a": "nominalThreadDiameter",
        "b": "threadPitch",
        "c": "materialType"
      },
      outputId: "totalExposure",
    },
    {
      formulaId: "benchmark.variance_percent",
      inputMap: {
        "actual": "nominalThreadDiameter",
        "target": "threadPitch"
      },
      outputId: "variancePercent",
    }
  ],

  outputs: [
    {
      id: "totalExposure",
      label: "Recommended drill diameter",
      unit: "mm",
      format: "currency",
      isBigNumber: true,
    },
    {
      id: "variancePercent",
      label: "Tolerance range",
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
      "Standard metric thread profile per ISO 724",
      "Material adjustment factors based on common machining practice",
      "Thread engagement calculated for 75% nominal depth",
    ],
  },
};
