import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";

/** P7 nightrun — DeepSeek Chief Engineer schema (factory generated). */
export const AsgariSiparisMiktariMoqVeStokTasimaMaliyetDengeCalculator_SCHEMA: PremiumCalculatorSchema = {
  id: "asgari-siparis-miktari-moq-ve-stok-tasima-maliyet-denge-calculator",
  name: "Asgari Siparis Miktari Moq Ve Stok Tasima Maliyet Denge",
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
      validation: { min: 0, max: 1000000000 },
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
      validation: { min: 0, max: 1000000 },
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
      validation: { min: 0, max: 1000000000 },
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
      label: "Total stock cost",
      unit: "USD",
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
      "All monetary values are in the same currency",
      "Holding cost rate is annual",
      "Obsolescence rate is annual",
    ],
  },
};
