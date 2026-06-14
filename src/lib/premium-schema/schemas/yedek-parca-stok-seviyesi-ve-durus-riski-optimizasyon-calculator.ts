import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";

/** P7 nightrun — DeepSeek Chief Engineer schema (factory generated). */
export const YedekParcaStokSeviyesiVeDurusRiskiOptimizasyonCalculator_SCHEMA: PremiumCalculatorSchema = {
  id: "yedek-parca-stok-seviyesi-ve-durus-riski-optimizasyon-calculator",
  name: "Yedek Parca Stok Seviyesi Ve Durus Riski Optimizasyon",
  sectorSlug: "general-industrial",
  category: "cost",
  painStatement: "Industrial engineering and inventory management standards (APICS, ISO 9001)",

  inputs: [
    {
      id: "averageInventoryValue",
      label: "Average inventory value",
      type: "number",
      unit: "USD",
      required: true,
      smartDefault: 500000,
      validation: { min: 0, max: 1000000000 },
      helper: "Non-negative currency value",
      expertMeaning: "Average inventory value",
    },
    {
      id: "inventoryUnits",
      label: "Inventory units",
      type: "number",
      unit: "units",
      required: true,
      smartDefault: 10000,
      validation: { min: 0, max: 100000000 },
      helper: "Non-negative integer",
      expertMeaning: "Inventory units",
    },
    {
      id: "unitCost",
      label: "Unit cost",
      type: "number",
      unit: "USD",
      required: true,
      smartDefault: 50,
      validation: { min: 0, max: 100000 },
      helper: "Non-negative currency",
      expertMeaning: "Unit cost",
    },
    {
      id: "holdingCostRatePercent",
      label: "Holding cost rate",
      type: "number",
      unit: "%",
      required: true,
      smartDefault: 20,
      validation: { min: 0, max: 100, step: 0.1 },
      helper: "Percent between 0 and 100",
      expertMeaning: "Holding cost rate",
    },
    {
      id: "obsolescenceRatePercent",
      label: "Obsolescence rate",
      type: "number",
      unit: "%",
      required: true,
      smartDefault: 5,
      validation: { min: 0, max: 100, step: 0.1 },
      helper: "Percent between 0 and 100",
      expertMeaning: "Obsolescence rate",
    },
    {
      id: "excessUnits",
      label: "Excess units",
      type: "number",
      unit: "units",
      required: true,
      smartDefault: 500,
      validation: { min: 0, max: 100000000 },
      helper: "Non-negative integer",
      expertMeaning: "Excess units",
    }
  ],

  formulaPipeline: [
    {
      formulaId: "cost.total_exposure",
      inputMap: {
        "a": "averageInventoryValue",
        "b": "inventoryUnits",
        "c": "unitCost"
      },
      outputId: "totalExposure",
    },
    {
      formulaId: "benchmark.variance_percent",
      inputMap: {
        "actual": "averageInventoryValue",
        "target": "inventoryUnits"
      },
      outputId: "variancePercent",
    }
  ],

  outputs: [
    {
      id: "totalExposure",
      label: "Total stock cost (annual)",
      unit: "USD",
      format: "currency",
      isBigNumber: true,
    },
    {
      id: "variancePercent",
      label: "Inventory carrying cost",
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
      "All costs are in USD and stable over the analysis period",
      "Holding cost rate includes storage, insurance, and opportunity cost",
      "Obsolescence rate is based on historical write-downs",
    ],
  },
};
