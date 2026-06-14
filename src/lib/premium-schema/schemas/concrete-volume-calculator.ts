import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";

/** P7 nightrun — DeepSeek Chief Engineer schema (factory generated). */
export const ConcreteVolumeCalculator_SCHEMA: PremiumCalculatorSchema = {
  id: "concrete-volume-calculator",
  name: "Concrete Volume Calculator",
  sectorSlug: "general-industrial",
  category: "cost",
  painStatement: "ACI 211.1 and ASTM C138 standard practice for concrete proportioning and volume measurement",

  inputs: [
    {
      id: "length",
      label: "Length",
      type: "number",
      unit: "m",
      required: true,
      smartDefault: 10,
      validation: { min: 0.01, max: 1000 },
      helper: "Must be positive length",
      expertMeaning: "Length",
    },
    {
      id: "width",
      label: "Width",
      type: "number",
      unit: "m",
      required: true,
      smartDefault: 5,
      validation: { min: 0.01, max: 1000 },
      helper: "Must be positive width",
      expertMeaning: "Width",
    },
    {
      id: "height",
      label: "Height (thickness)",
      type: "number",
      unit: "m",
      required: true,
      smartDefault: 0.2,
      validation: { min: 0.01, max: 100 },
      helper: "Must be positive height",
      expertMeaning: "Height (thickness)",
    },
    {
      id: "wasteRate",
      label: "Waste rate",
      type: "number",
      unit: "%",
      required: true,
      smartDefault: 5,
      validation: { min: 0, max: 50, step: 0.1 },
      helper: "Percent between 0 and 50",
      expertMeaning: "Waste rate",
    },
    {
      id: "compactionFactor",
      label: "Compaction factor",
      type: "number",
      unit: "ratio",
      required: true,
      smartDefault: 1,
      validation: { min: 0.8, max: 1.2 },
      helper: "Must be between 0.8 and 1.2",
      expertMeaning: "Compaction factor",
    },
    {
      id: "unitCost",
      label: "Unit cost per cubic meter",
      type: "number",
      unit: "USD",
      required: false,
      smartDefault: 100,
      validation: { min: 0, max: 10000 },
      helper: "Non-negative currency",
      expertMeaning: "Unit cost per cubic meter",
    }
  ],

  formulaPipeline: [
    {
      formulaId: "cost.total_exposure",
      inputMap: {
        "a": "length",
        "b": "width",
        "c": "height"
      },
      outputId: "totalExposure",
    },
    {
      formulaId: "benchmark.variance_percent",
      inputMap: {
        "actual": "length",
        "target": "width"
      },
      outputId: "variancePercent",
    }
  ],

  outputs: [
    {
      id: "totalExposure",
      label: "Net volume",
      unit: "m³",
      format: "currency",
      isBigNumber: true,
    },
    {
      id: "variancePercent",
      label: "Adjusted volume (with waste)",
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
      "All dimensions are in meters",
      "Waste rate is a percentage of net volume",
      "Compaction factor accounts for settlement and formwork deflection",
    ],
  },
};
