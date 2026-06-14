import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";

/** P7 nightrun — DeepSeek Chief Engineer schema (factory generated). */
export const CitKorkulukMalzemeHesabi_SCHEMA: PremiumCalculatorSchema = {
  id: "cit-korkuluk-malzeme-hesabi",
  name: "Çit — Korkuluk Malzeme Calculation",
  sectorSlug: "general-industrial",
  category: "cost",
  painStatement: "Standard construction quantity surveying (QS) practice",

  inputs: [
    {
      id: "totalLength",
      label: "Total fence length",
      type: "number",
      unit: "m",
      required: true,
      smartDefault: 100,
      validation: { min: 0.1, max: 10000 },
      helper: "Must be positive length",
      expertMeaning: "Total fence length",
    },
    {
      id: "postSpacing",
      label: "Post spacing (center to center)",
      type: "number",
      unit: "m",
      required: true,
      smartDefault: 2.5,
      validation: { min: 0.5, max: 10 },
      helper: "Must be between 0.5 and 10 m",
      expertMeaning: "Post spacing (center to center)",
    },
    {
      id: "numberOfRails",
      label: "Number of horizontal rails per section",
      type: "number",
      unit: "pieces",
      required: true,
      smartDefault: 2,
      validation: { min: 1, max: 10 },
      helper: "Must be integer between 1 and 10",
      expertMeaning: "Number of horizontal rails per section",
    },
    {
      id: "panelWidth",
      label: "Panel or picket width",
      type: "number",
      unit: "m",
      required: true,
      smartDefault: 0.1,
      validation: { min: 0.01, max: 5 },
      helper: "Must be positive width",
      expertMeaning: "Panel or picket width",
    },
    {
      id: "wasteFactorPercent",
      label: "Waste factor",
      type: "number",
      unit: "%",
      required: true,
      smartDefault: 5,
      validation: { min: 0, max: 20, step: 0.1 },
      helper: "Percent between 0 and 20",
      expertMeaning: "Waste factor",
    },
    {
      id: "materialDensity",
      label: "Material density (optional, for weight estimate)",
      type: "number",
      unit: "kg/m³",
      required: false,
      smartDefault: 7850,
      validation: { min: 0, max: 100000 },
      helper: "Non-negative density",
      expertMeaning: "Material density (optional, for weight estimate)",
    }
  ],

  formulaPipeline: [
    {
      formulaId: "cost.total_exposure",
      inputMap: {
        "a": "totalLength",
        "b": "postSpacing",
        "c": "numberOfRails"
      },
      outputId: "totalExposure",
    },
    {
      formulaId: "benchmark.variance_percent",
      inputMap: {
        "actual": "totalLength",
        "target": "postSpacing"
      },
      outputId: "variancePercent",
    }
  ],

  outputs: [
    {
      id: "totalExposure",
      label: "Number of posts",
      unit: "pieces",
      format: "currency",
      isBigNumber: true,
    },
    {
      id: "variancePercent",
      label: "Total rail length",
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
      "Fence is straight line; corners and gates not accounted",
      "Post spacing is uniform",
      "Panels/pickets are continuous without gaps",
    ],
  },
};
