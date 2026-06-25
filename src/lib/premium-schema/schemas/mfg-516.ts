import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";

export const WELDED_BOLTED_CONNECTION_CALCULATOR_SCHEMA: PremiumCalculatorSchema = {
  id: "mfg-516",
  name: "Welded and Bolted Connection Calculator",
  sectorSlug: "manufacturing",
  category: "measurement",
  painStatement:
    "Connection sizing relies on guesswork without quick structural checks.",

  inputs: [
    {
      id: "throatMm",
      label: "Weld throat",
      type: "number",
      unit: "mm",
      required: true,
      smartDefault: 6,
      validation: { min: 0.1 },
      helper: "Please enter a valid value.",
      expertMeaning: "Parameter value complies with industrial calculation standards.",
    },
    {
      id: "weldLengthMm",
      label: "Weld length",
      type: "number",
      unit: "mm",
      required: true,
      smartDefault: 120,
      validation: { min: 1 },
      helper: "Please enter a valid value.",
      expertMeaning: "Parameter value complies with industrial calculation standards.",
    },
    {
      id: "boltDiameterMm",
      label: "Bolt diameter",
      type: "number",
      unit: "mm",
      required: true,
      smartDefault: 12,
      validation: { min: 1 },
      helper: "Please enter a valid value.",
      expertMeaning: "Parameter value complies with industrial calculation standards.",
    },
    {
      id: "boltCount",
      label: "Bolt count",
      type: "number",
      unit: "bolts",
      required: true,
      smartDefault: 4,
      validation: { min: 1 },
      helper: "Please enter a valid value.",
      expertMeaning: "Parameter value complies with industrial calculation standards.",
    },
    {
      id: "allowableStressMpa",
      label: "Allowable stress",
      type: "number",
      unit: "MPa",
      required: true,
      smartDefault: 140,
      validation: { min: 1 },
      helper: "Please enter a valid value.",
      expertMeaning: "Parameter value complies with industrial calculation standards.",
    },
    {
      id: "safetyFactor",
      label: "Safety factor",
      type: "number",
      unit: "×",
      required: true,
      smartDefault: 2.5,
      validation: { min: 1 },
      helper: "Please enter a valid value.",
      expertMeaning: "Parameter value complies with industrial calculation standards.",
    },
  ],

  formulaPipeline: [
    {
      formulaId: "measurement.weld_throat_capacity",
      inputMap: {
        throatMm: "throatMm",
        weldLengthMm: "weldLengthMm",
        allowableStressMpa: "allowableStressMpa",
        safetyFactor: "safetyFactor",
      },
      outputId: "weldCapacity",
    },
    {
      formulaId: "measurement.bolt_shear_capacity",
      inputMap: {
        boltDiameterMm: "boltDiameterMm",
        boltCount: "boltCount",
        allowableStressMpa: "allowableStressMpa",
        safetyFactor: "safetyFactor",
      },
      outputId: "boltCapacity",
    },
  ],

  outputs: [
    {
      id: "weldCapacity",
      label: "Weld capacity index",
      unit: "N",
      format: "number",
      isBigNumber: true,
    },
    {
      id: "boltCapacity",
      label: "Bolt shear capacity index",
      unit: "N",
      format: "number",
    },
  ],

  thresholds: [
    {
      fieldId: "weldCapacity",
      warning: 50000,
      critical: 25000,
      direction: "lower_is_bad",
      warningMessage: "Weld capacity index is low for the entered geometry — review throat and length.",
      criticalMessage: "Weld capacity index is critically low — obtain qualified engineering review.",
    },
  ],

  reportTemplate: {
    title: "Welded and Bolted Connection Screening Report",
    sections: ["executive_summary", "thresholds", "assumptions", "action_plan"],
    exportFormats: ["pdf", "csv"],
  },

  assumptions: {
    hiddenLossMultiplier: 1,
    volatilityPercent: 5,
    targetMarginPercent: 0,
    assumptionNotes: [
      "Weld capacity index = throat × length × allowable stress ÷ safety factor.",
      "Bolt capacity index uses circular area × bolt count × allowable stress ÷ safety factor.",
      "Screening calculation only — not structural code compliance or engineering sign-off.",
    ],
  },
};
