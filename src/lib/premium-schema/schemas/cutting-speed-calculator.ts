import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";

/** P7 nightrun — DeepSeek Chief Engineer schema (factory generated). */
export const CuttingSpeedCalculator_SCHEMA: PremiumCalculatorSchema = {
  id: "cutting-speed-calculator",
  name: "Cutting Speed Calculator",
  sectorSlug: "general-industrial",
  category: "cost",
  painStatement: "Standard machining practice (ISO 8688-1)",

  inputs: [
    {
      id: "toolDiameter",
      label: "Tool diameter",
      type: "number",
      unit: "mm",
      required: true,
      smartDefault: 10,
      validation: { min: 0.1, max: 500 },
      helper: "Must be positive",
      expertMeaning: "Tool diameter",
    },
    {
      id: "spindleSpeed",
      label: "Spindle speed",
      type: "number",
      unit: "rpm",
      required: true,
      smartDefault: 1000,
      validation: { min: 1, max: 50000 },
      helper: "Must be positive integer",
      expertMeaning: "Spindle speed",
    },
    {
      id: "toolMaterialFactor",
      label: "Tool material factor",
      type: "number",
      unit: "dimensionless",
      required: true,
      smartDefault: 1,
      validation: { min: 0.1, max: 5 },
      helper: "Between 0.1 and 5",
      expertMeaning: "Tool material factor",
    },
    {
      id: "workpieceMaterialFactor",
      label: "Workpiece material factor",
      type: "number",
      unit: "dimensionless",
      required: true,
      smartDefault: 1,
      validation: { min: 0.1, max: 5 },
      helper: "Between 0.1 and 5",
      expertMeaning: "Workpiece material factor",
    },
    {
      id: "maxSafeSpeed",
      label: "Maximum safe cutting speed",
      type: "number",
      unit: "m/min",
      required: true,
      smartDefault: 500,
      validation: { min: 1, max: 10000 },
      helper: "Must be positive",
      expertMeaning: "Maximum safe cutting speed",
    }
  ],

  formulaPipeline: [
    {
      formulaId: "cost.total_exposure",
      inputMap: {
        "a": "toolDiameter",
        "b": "spindleSpeed",
        "c": "toolMaterialFactor"
      },
      outputId: "totalExposure",
    },
    {
      formulaId: "benchmark.variance_percent",
      inputMap: {
        "actual": "toolDiameter",
        "target": "spindleSpeed"
      },
      outputId: "variancePercent",
    }
  ],

  outputs: [
    {
      id: "totalExposure",
      label: "Cutting speed",
      unit: "m/min",
      format: "currency",
      isBigNumber: true,
    },
    {
      id: "variancePercent",
      label: "Speed warning flag",
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
      "Tool and workpiece material factors are dimensionless and provided by user",
      "Maximum safe speed is based on tool manufacturer recommendations",
      "No coolant or vibration effects considered",
    ],
  },
};
