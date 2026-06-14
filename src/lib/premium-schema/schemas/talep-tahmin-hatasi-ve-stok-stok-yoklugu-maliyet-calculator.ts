import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";

/** P7 nightrun — DeepSeek Chief Engineer schema (factory generated). */
export const TalepTahminHatasiVeStokStokYokluguMaliyetCalculator_SCHEMA: PremiumCalculatorSchema = {
  id: "talep-tahmin-hatasi-ve-stok-stok-yoklugu-maliyet-calculator",
  name: "Talep Tahmin Hatasi Ve Stok Stok Yoklugu Maliyet",
  sectorSlug: "general-industrial",
  category: "cost",
  painStatement: "Industrial engineering and supply chain cost accounting",

  inputs: [
    {
      id: "averageInventoryValue",
      label: "Average inventory value",
      type: "number",
      unit: "USD",
      required: true,
      smartDefault: 100000,
      validation: { min: 0, max: 1000000000 },
      helper: "Non-negative currency",
      expertMeaning: "Average inventory value",
    },
    {
      id: "inventoryUnits",
      label: "Inventory units",
      type: "number",
      unit: "units",
      required: true,
      smartDefault: 1000,
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
      smartDefault: 100,
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
      smartDefault: 100,
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
      label: "Carrying cost",
      unit: "USD",
      format: "currency",
      isBigNumber: true,
    },
    {
      id: "variancePercent",
      label: "Obsolescence exposure",
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
      "Holding cost rate includes capital cost, storage, insurance, and taxes",
      "Obsolescence rate is based on historical write-downs",
      "Excess units are valued at unit cost",
    ],
  },
};
