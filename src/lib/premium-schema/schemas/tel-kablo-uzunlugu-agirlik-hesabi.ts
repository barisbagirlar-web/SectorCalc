import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";

/** P7 nightrun — DeepSeek Chief Engineer schema (factory generated). */
export const TelKabloUzunluguAgirlikHesabi_SCHEMA: PremiumCalculatorSchema = {
  id: "tel-kablo-uzunlugu-agirlik-hesabi",
  name: "Tel — Kablo Uzunluğu — Ağırlık Calculation",
  sectorSlug: "general-industrial",
  category: "cost",
  painStatement: "Standard material weight calculation using linear density (mass per unit length) and length, with optional adjustment for insulation or coating.",

  inputs: [
    {
      id: "length",
      label: "Cable length",
      type: "number",
      unit: "m",
      required: true,
      smartDefault: 100,
      validation: { min: 0.001, max: 100000 },
      helper: "Must be positive length",
      expertMeaning: "Cable length",
    },
    {
      id: "linearDensity",
      label: "Linear density (mass per unit length)",
      type: "number",
      unit: "kg/m",
      required: true,
      smartDefault: 0.5,
      validation: { min: 0.0001, max: 100 },
      helper: "Must be positive density",
      expertMeaning: "Linear density (mass per unit length)",
    },
    {
      id: "coatingFactor",
      label: "Coating / insulation weight addition",
      type: "number",
      unit: "%",
      required: true,
      smartDefault: 0,
      validation: { min: 0, max: 100, step: 0.1 },
      helper: "Percent between 0 and 100",
      expertMeaning: "Coating / insulation weight addition",
    },
    {
      id: "quantity",
      label: "Number of identical cables",
      type: "number",
      unit: "pieces",
      required: true,
      smartDefault: 1,
      validation: { min: 1, max: 1000000 },
      helper: "Must be positive integer",
      expertMeaning: "Number of identical cables",
    }
  ],

  formulaPipeline: [
    {
      formulaId: "cost.total_exposure",
      inputMap: {
        "a": "length",
        "b": "linearDensity",
        "c": "coatingFactor"
      },
      outputId: "totalExposure",
    },
    {
      formulaId: "benchmark.variance_percent",
      inputMap: {
        "actual": "length",
        "target": "linearDensity"
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
      label: "Weight per cable",
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
      "Linear density is constant along the cable length",
      "Coating factor is a uniform percentage addition to base weight",
      "All cables are identical",
    ],
  },
};
