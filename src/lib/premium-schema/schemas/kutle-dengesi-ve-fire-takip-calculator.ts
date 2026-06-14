import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";

/** P7 nightrun — DeepSeek Chief Engineer schema (factory generated). */
export const KutleDengesiVeFireTakipCalculator_SCHEMA: PremiumCalculatorSchema = {
  id: "kutle-dengesi-ve-fire-takip-calculator",
  name: "Kutle Dengesi Ve Fire Takip",
  sectorSlug: "general-industrial",
  category: "scrap",
  painStatement: "Industrial engineering cost accounting and lean waste quantification",

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
      id: "reworkLaborCost",
      label: "Rework labor cost",
      type: "number",
      unit: "USD",
      required: false,
      smartDefault: 0,
      validation: { min: 0, max: 100000 },
      helper: "Non-negative currency",
      expertMeaning: "Rework labor cost",
    },
    {
      id: "inventoryHoldingCost",
      label: "Inventory holding cost",
      type: "number",
      unit: "USD",
      required: false,
      smartDefault: 0,
      validation: { min: 0, max: 100000 },
      helper: "Non-negative currency",
      expertMeaning: "Inventory holding cost",
    },
    {
      id: "periodRevenue",
      label: "Period revenue",
      type: "number",
      unit: "USD",
      required: false,
      smartDefault: 10000,
      validation: { min: 0, max: 100000000 },
      helper: "Non-negative currency; if zero, waste percent of revenue is not calculated",
      expertMeaning: "Period revenue",
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
      label: "Total material input",
      unit: "units",
      format: "currency",
      isBigNumber: true,
    },
    {
      id: "variancePercent",
      label: "Total material cost",
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
