import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";

/** P7 nightrun — DeepSeek Chief Engineer schema (factory generated). */
export const LaserCuttingTimeCheck_SCHEMA: PremiumCalculatorSchema = {
  id: "laser-cutting-time-check",
  name: "Laser Cutting Time Check",
  sectorSlug: "general-industrial",
  category: "time",
  painStatement: "Industrial engineering time study and cost accounting",

  inputs: [
    {
      id: "cuttingLength",
      label: "Cutting length per part",
      type: "number",
      unit: "mm",
      required: true,
      smartDefault: 1000,
      validation: { min: 0.1, max: 100000 },
      helper: "Must be positive length",
      expertMeaning: "Cutting length per part",
    },
    {
      id: "feedRate",
      label: "Feed rate",
      type: "number",
      unit: "mm/min",
      required: true,
      smartDefault: 1000,
      validation: { min: 0.1, max: 10000 },
      helper: "Must be positive feed rate",
      expertMeaning: "Feed rate",
    },
    {
      id: "pierceTime",
      label: "Pierce time per part",
      type: "number",
      unit: "min",
      required: true,
      smartDefault: 0.5,
      validation: { min: 0, max: 60 },
      helper: "Non-negative time",
      expertMeaning: "Pierce time per part",
    },
    {
      id: "machineEfficiency",
      label: "Machine efficiency",
      type: "number",
      unit: "%",
      required: true,
      smartDefault: 85,
      validation: { min: 1, max: 100, step: 0.1 },
      helper: "Percent between 1 and 100",
      expertMeaning: "Machine efficiency",
    },
    {
      id: "productionQuantity",
      label: "Production quantity",
      type: "number",
      unit: "units",
      required: true,
      smartDefault: 100,
      validation: { min: 1, max: 1000000 },
      helper: "Must be positive integer",
      expertMeaning: "Production quantity",
    },
    {
      id: "unitMaterialCost",
      label: "Unit material cost",
      type: "number",
      unit: "USD",
      required: true,
      smartDefault: 10,
      validation: { min: 0, max: 100000 },
      helper: "Non-negative currency",
      expertMeaning: "Unit material cost",
    }
  ],

  formulaPipeline: [
    {
      formulaId: "cost.total_exposure",
      inputMap: {
        "a": "cuttingLength",
        "b": "feedRate",
        "c": "pierceTime"
      },
      outputId: "totalExposure",
    },
    {
      formulaId: "benchmark.variance_percent",
      inputMap: {
        "actual": "cuttingLength",
        "target": "feedRate"
      },
      outputId: "variancePercent",
    }
  ],

  outputs: [
    {
      id: "totalExposure",
      label: "Total cutting time",
      unit: "hours",
      format: "currency",
      isBigNumber: true,
    },
    {
      id: "variancePercent",
      label: "Cost per unit",
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
      "Cutting length is total path per part",
      "Feed rate is constant during cutting",
      "Pierce time is average per part",
    ],
  },
};
