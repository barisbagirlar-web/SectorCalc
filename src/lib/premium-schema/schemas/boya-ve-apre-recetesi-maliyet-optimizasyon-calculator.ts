import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";

/** P7 nightrun — DeepSeek Chief Engineer schema (factory generated). */
export const BoyaVeApreRecetesiMaliyetOptimizasyonCalculator_SCHEMA: PremiumCalculatorSchema = {
  id: "boya-ve-apre-recetesi-maliyet-optimizasyon-calculator",
  name: "Boya Ve Apre Recetesi Maliyet Optimizasyon",
  sectorSlug: "general-industrial",
  category: "cost",
  painStatement: "Industrial engineering cost accounting",

  inputs: [
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
    },
    {
      id: "scrapRatePercent",
      label: "Scrap rate",
      type: "number",
      unit: "%",
      required: true,
      smartDefault: 5,
      validation: { min: 0, max: 100, step: 0.1 },
      helper: "Percent between 0 and 100",
      expertMeaning: "Scrap rate",
    },
    {
      id: "laborHours",
      label: "Labor hours",
      type: "number",
      unit: "hours",
      required: true,
      smartDefault: 10,
      validation: { min: 0, max: 10000 },
      helper: "Non-negative hours",
      expertMeaning: "Labor hours",
    },
    {
      id: "laborHourlyRate",
      label: "Labor hourly rate",
      type: "number",
      unit: "USD/hour",
      required: true,
      smartDefault: 25,
      validation: { min: 0, max: 500 },
      helper: "Non-negative rate",
      expertMeaning: "Labor hourly rate",
    },
    {
      id: "equipmentCost",
      label: "Equipment cost",
      type: "number",
      unit: "USD",
      required: true,
      smartDefault: 0,
      validation: { min: 0, max: 100000 },
      helper: "Non-negative cost",
      expertMeaning: "Equipment cost",
    }
  ],

  formulaPipeline: [
    {
      formulaId: "cost.total_exposure",
      inputMap: {
        "a": "productionQuantity",
        "b": "unitMaterialCost",
        "c": "scrapRatePercent"
      },
      outputId: "totalExposure",
    },
    {
      formulaId: "benchmark.variance_percent",
      inputMap: {
        "actual": "productionQuantity",
        "target": "unitMaterialCost"
      },
      outputId: "variancePercent",
    }
  ],

  outputs: [
    {
      id: "totalExposure",
      label: "Direct job cost",
      unit: "USD",
      format: "currency",
      isBigNumber: true,
    },
    {
      id: "variancePercent",
      label: "Total job cost",
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
      "Stable unit costs",
      "Declared scrap rate is representative",
      "No FX volatility",
    ],
  },
};
