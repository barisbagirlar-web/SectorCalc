import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";

/** P7 nightrun — DeepSeek Chief Engineer schema (factory generated). */
export const HafriyatVeDolguDengesiOptimizasyonCalculator_SCHEMA: PremiumCalculatorSchema = {
  id: "hafriyat-ve-dolgu-dengesi-optimizasyon-calculator",
  name: "Hafriyat Ve Dolgu Dengesi Optimizasyon",
  sectorSlug: "general-industrial",
  category: "cost",
  painStatement: "Earthwork mass haul analysis based on average end-area method",

  inputs: [
    {
      id: "cutVolume",
      label: "Cut volume",
      type: "number",
      unit: "m³",
      required: true,
      smartDefault: 10000,
      validation: { min: 0, max: 10000000 },
      helper: "Non-negative volume",
      expertMeaning: "Cut volume",
    },
    {
      id: "fillVolume",
      label: "Fill volume",
      type: "number",
      unit: "m³",
      required: true,
      smartDefault: 8000,
      validation: { min: 0, max: 10000000 },
      helper: "Non-negative volume",
      expertMeaning: "Fill volume",
    },
    {
      id: "swellPercent",
      label: "Swell percentage",
      type: "number",
      unit: "%",
      required: true,
      smartDefault: 25,
      validation: { min: 0, max: 100, step: 0.1 },
      helper: "Percent between 0 and 100",
      expertMeaning: "Swell percentage",
    },
    {
      id: "shrinkPercent",
      label: "Shrinkage percentage",
      type: "number",
      unit: "%",
      required: true,
      smartDefault: 10,
      validation: { min: 0, max: 100, step: 0.1 },
      helper: "Percent between 0 and 100",
      expertMeaning: "Shrinkage percentage",
    },
    {
      id: "cutUnitCost",
      label: "Cut unit cost",
      type: "number",
      unit: "USD/m³",
      required: true,
      smartDefault: 5,
      validation: { min: 0, max: 1000 },
      helper: "Non-negative cost",
      expertMeaning: "Cut unit cost",
    },
    {
      id: "fillUnitCost",
      label: "Fill unit cost",
      type: "number",
      unit: "USD/m³",
      required: true,
      smartDefault: 8,
      validation: { min: 0, max: 1000 },
      helper: "Non-negative cost",
      expertMeaning: "Fill unit cost",
    }
  ],

  formulaPipeline: [
    {
      formulaId: "cost.total_exposure",
      inputMap: {
        "a": "cutVolume",
        "b": "fillVolume",
        "c": "swellPercent"
      },
      outputId: "totalExposure",
    },
    {
      formulaId: "benchmark.variance_percent",
      inputMap: {
        "actual": "cutVolume",
        "target": "fillVolume"
      },
      outputId: "variancePercent",
    }
  ],

  outputs: [
    {
      id: "totalExposure",
      label: "Net volume balance",
      unit: "m³",
      format: "currency",
      isBigNumber: true,
    },
    {
      id: "variancePercent",
      label: "Balance status",
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
      "Swell and shrinkage percentages are constant across the site",
      "Haul distance is average weighted distance",
      "Unit costs are linear and do not include overhead or profit",
    ],
  },
};
