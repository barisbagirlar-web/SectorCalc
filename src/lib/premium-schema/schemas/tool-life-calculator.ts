import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";

/** P7 nightrun — DeepSeek Chief Engineer schema (factory generated). */
export const ToolLifeCalculator_SCHEMA: PremiumCalculatorSchema = {
  id: "tool-life-calculator",
  name: "Tool Life Cost Calculator",
  sectorSlug: "general-industrial",
  category: "cost",
  painStatement: "Industrial engineering cost accounting for consumable tooling",

  inputs: [
    {
      id: "toolPurchasePrice",
      label: "Tool purchase price",
      type: "number",
      unit: "USD",
      required: true,
      smartDefault: 500,
      validation: { min: 0, max: 100000 },
      helper: "Non-negative currency",
      expertMeaning: "Tool purchase price",
    },
    {
      id: "expectedToolLifeUnits",
      label: "Expected tool life (units)",
      type: "number",
      unit: "units",
      required: true,
      smartDefault: 1000,
      validation: { min: 1, max: 1000000 },
      helper: "Must be positive integer",
      expertMeaning: "Expected tool life (units)",
    },
    {
      id: "materialHardnessFactor",
      label: "Material hardness factor",
      type: "number",
      unit: "dimensionless",
      required: true,
      smartDefault: 1,
      validation: { min: 0.5, max: 3 },
      helper: "Between 0.5 and 3",
      expertMeaning: "Material hardness factor",
    },
    {
      id: "cuttingSpeedFactor",
      label: "Cutting speed factor",
      type: "number",
      unit: "dimensionless",
      required: true,
      smartDefault: 1,
      validation: { min: 0.5, max: 2 },
      helper: "Between 0.5 and 2",
      expertMeaning: "Cutting speed factor",
    },
    {
      id: "toolChangeTimeHours",
      label: "Tool change time (hours)",
      type: "number",
      unit: "hours",
      required: true,
      smartDefault: 0.5,
      validation: { min: 0, max: 8 },
      helper: "Non-negative hours",
      expertMeaning: "Tool change time (hours)",
    },
    {
      id: "laborRatePerHour",
      label: "Labor rate per hour",
      type: "number",
      unit: "USD/hour",
      required: true,
      smartDefault: 50,
      validation: { min: 0, max: 500 },
      helper: "Non-negative currency",
      expertMeaning: "Labor rate per hour",
    }
  ],

  formulaPipeline: [
    {
      formulaId: "cost.total_exposure",
      inputMap: {
        "a": "toolPurchasePrice",
        "b": "expectedToolLifeUnits",
        "c": "materialHardnessFactor"
      },
      outputId: "totalExposure",
    },
    {
      formulaId: "benchmark.variance_percent",
      inputMap: {
        "actual": "toolPurchasePrice",
        "target": "expectedToolLifeUnits"
      },
      outputId: "variancePercent",
    }
  ],

  outputs: [
    {
      id: "totalExposure",
      label: "Total tool cost per unit",
      unit: "USD",
      format: "currency",
      isBigNumber: true,
    },
    {
      id: "variancePercent",
      label: "Total cost exposure",
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
      "Tool wear is linear with hardness and speed factors",
      "Tool change time is constant per change",
      "Labor rate includes all overhead",
    ],
  },
};
