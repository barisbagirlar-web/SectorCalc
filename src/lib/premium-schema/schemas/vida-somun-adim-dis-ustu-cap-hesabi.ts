import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";

/** P7 nightrun — DeepSeek Chief Engineer schema (factory generated). */
export const VidaSomunAdimDisUstuCapHesabi_SCHEMA: PremiumCalculatorSchema = {
  id: "vida-somun-adim-dis-ustu-cap-hesabi",
  name: "Vida — Somun Adım — Diş Üstü Çap Calculation",
  sectorSlug: "general-industrial",
  category: "cost",
  painStatement: "ISO 68-1 and ISO 724 metric screw thread profiles",

  inputs: [
    {
      id: "nominalDiameter",
      label: "Nominal diameter (d)",
      type: "number",
      unit: "mm",
      required: true,
      smartDefault: 10,
      validation: { min: 1, max: 1000 },
      helper: "Must be positive and within typical screw thread range",
      expertMeaning: "Nominal diameter (d)",
    },
    {
      id: "pitch",
      label: "Thread pitch (P)",
      type: "number",
      unit: "mm",
      required: true,
      smartDefault: 1.5,
      validation: { min: 0.1, max: 100 },
      helper: "Must be positive and less than nominal diameter",
      expertMeaning: "Thread pitch (P)",
    },
    {
      id: "threadClass",
      label: "Thread tolerance class",
      type: "number",
      unit: "",
      required: true,
      smartDefault: 1,
      validation: { min: 0 },
      helper: "Select from standard ISO tolerance classes",
      expertMeaning: "Thread tolerance class",
    }
  ],

  formulaPipeline: [
    {
      formulaId: "cost.total_exposure",
      inputMap: {
        "a": "nominalDiameter",
        "b": "pitch",
        "c": "threadClass"
      },
      outputId: "totalExposure",
    },
    {
      formulaId: "benchmark.variance_percent",
      inputMap: {
        "actual": "nominalDiameter",
        "target": "pitch"
      },
      outputId: "variancePercent",
    }
  ],

  outputs: [
    {
      id: "totalExposure",
      label: "Pitch diameter (d2)",
      unit: "mm",
      format: "currency",
      isBigNumber: true,
    },
    {
      id: "variancePercent",
      label: "Minor diameter (d3)",
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
      "Thread profile is ISO metric 60° V-thread",
      "No thread runout or chamfer considered",
      "Material is homogeneous and isotropic",
    ],
  },
};
