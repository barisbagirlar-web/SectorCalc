import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";

/** P7 nightrun — DeepSeek Chief Engineer schema (factory generated). */
export const KumasSerimVeKesimOptimizasyonFireCalculator_SCHEMA: PremiumCalculatorSchema = {
  id: "kumas-serim-ve-kesim-optimizasyon-fire-calculator",
  name: "Kumas Serim Ve Kesim Optimizasyon Fire",
  sectorSlug: "general-industrial",
  category: "scrap",
  painStatement: "Industrial engineering cost accounting and lean manufacturing principles (7 Muda)",

  inputs: [
    {
      id: "productionQuantity",
      label: "Production quantity",
      type: "number",
      unit: "units",
      required: true,
      smartDefault: 1000,
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
      id: "unitReworkCost",
      label: "Unit rework cost",
      type: "number",
      unit: "USD",
      required: true,
      smartDefault: 5,
      validation: { min: 0, max: 100000 },
      helper: "Non-negative currency",
      expertMeaning: "Unit rework cost",
    },
    {
      id: "reworkRatePercent",
      label: "Rework rate",
      type: "number",
      unit: "%",
      required: true,
      smartDefault: 3,
      validation: { min: 0, max: 100, step: 0.1 },
      helper: "Percent between 0 and 100",
      expertMeaning: "Rework rate",
    },
    {
      id: "waitingHours",
      label: "Waiting hours",
      type: "number",
      unit: "hours",
      required: true,
      smartDefault: 10,
      validation: { min: 0, max: 10000 },
      helper: "Non-negative hours",
      expertMeaning: "Waiting hours",
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
      label: "Total waste cost",
      unit: "USD",
      format: "currency",
      isBigNumber: true,
    },
    {
      id: "variancePercent",
      label: "Waste cost per unit",
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
      "All monetary values in same currency (USD)",
      "Scrap and rework rates are representative of the period",
      "Waiting cost includes labor and machine overhead",
    ],
  },
};
