import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";

/** P7 nightrun — DeepSeek Chief Engineer schema (factory generated). */
export const DisliModulCapHesaplama_SCHEMA: PremiumCalculatorSchema = {
  id: "disli-modul-cap-hesaplama",
  name: "Dişli Modül — Çap Calculation",
  sectorSlug: "general-industrial",
  category: "cost",
  painStatement: "Makine mühendisliği dişli geometrisi standartları (ISO 53, DIN 780)",

  inputs: [
    {
      id: "module",
      label: "Module",
      type: "number",
      unit: "mm",
      required: true,
      smartDefault: 2,
      validation: { min: 0.1, max: 100 },
      helper: "Must be positive, typical range 0.1-100 mm",
      expertMeaning: "Module",
    },
    {
      id: "numberOfTeeth",
      label: "Number of teeth",
      type: "number",
      unit: "teeth",
      required: true,
      smartDefault: 20,
      validation: { min: 1, max: 1000 },
      helper: "Must be positive integer, typical range 1-1000",
      expertMeaning: "Number of teeth",
    },
    {
      id: "addendumCoefficient",
      label: "Addendum coefficient",
      type: "number",
      unit: "dimensionless",
      required: true,
      smartDefault: 1,
      validation: { min: 0.5, max: 1.5 },
      helper: "Typically 1 for standard gears, range 0.5-1.5",
      expertMeaning: "Addendum coefficient",
    },
    {
      id: "dedendumCoefficient",
      label: "Dedendum coefficient",
      type: "number",
      unit: "dimensionless",
      required: true,
      smartDefault: 1.25,
      validation: { min: 1, max: 2 },
      helper: "Typically 1.25 for standard gears, range 1-2",
      expertMeaning: "Dedendum coefficient",
    }
  ],

  formulaPipeline: [
    {
      formulaId: "cost.total_exposure",
      inputMap: {
        "a": "module",
        "b": "numberOfTeeth",
        "c": "addendumCoefficient"
      },
      outputId: "totalExposure",
    },
    {
      formulaId: "benchmark.variance_percent",
      inputMap: {
        "actual": "module",
        "target": "numberOfTeeth"
      },
      outputId: "variancePercent",
    }
  ],

  outputs: [
    {
      id: "totalExposure",
      label: "Pitch circle diameter",
      unit: "mm",
      format: "currency",
      isBigNumber: true,
    },
    {
      id: "variancePercent",
      label: "Outside diameter",
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
      "Standard involute spur gear geometry",
      "No profile shift (x=0)",
      "Full-depth teeth",
    ],
  },
};
