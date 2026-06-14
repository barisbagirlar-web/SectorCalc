import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";

/** P7 nightrun — DeepSeek Chief Engineer schema (factory generated). */
export const KosebentLamaAgirlikHesaplama_SCHEMA: PremiumCalculatorSchema = {
  id: "kosebent-lama-agirlik-hesaplama",
  name: "Köşebent — Lama Ağırlık Calculation",
  sectorSlug: "general-industrial",
  category: "cost",
  painStatement: "Structural steel weight estimation based on cross-sectional area and density",

  inputs: [
    {
      id: "leg1",
      label: "Leg 1 length",
      type: "number",
      unit: "mm",
      required: true,
      smartDefault: 50,
      validation: { min: 1, max: 500 },
      helper: "Must be positive",
      expertMeaning: "Leg 1 length",
    },
    {
      id: "leg2",
      label: "Leg 2 length",
      type: "number",
      unit: "mm",
      required: true,
      smartDefault: 50,
      validation: { min: 1, max: 500 },
      helper: "Must be positive",
      expertMeaning: "Leg 2 length",
    },
    {
      id: "thickness",
      label: "Thickness",
      type: "number",
      unit: "mm",
      required: true,
      smartDefault: 5,
      validation: { min: 1, max: 50 },
      helper: "Must be positive and less than min(leg1, leg2)",
      expertMeaning: "Thickness",
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
      id: "tolerancePercent",
      label: "Tolerance (%)",
      type: "number",
      unit: "%",
      required: true,
      smartDefault: 2.5,
      validation: { min: 0, max: 10, step: 0.1 },
      helper: "Percent between 0 and 10",
      expertMeaning: "Tolerance (%)",
    }
  ],

  formulaPipeline: [
    {
      formulaId: "cost.total_exposure",
      inputMap: {
        "a": "leg1",
        "b": "leg2",
        "c": "thickness"
      },
      outputId: "totalExposure",
    },
    {
      formulaId: "benchmark.variance_percent",
      inputMap: {
        "actual": "leg1",
        "target": "leg2"
      },
      outputId: "variancePercent",
    }
  ],

  outputs: [
    {
      id: "totalExposure",
      label: "Total weight",
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
      "Material density is 7850 kg/m³ (carbon steel)",
      "Cross-section is assumed to be a perfect L-shape",
      "Tolerance accounts for manufacturing variations",
    ],
  },
};
