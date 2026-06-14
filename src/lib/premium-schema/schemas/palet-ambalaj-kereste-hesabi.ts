import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";

/** P7 nightrun — DeepSeek Chief Engineer schema (factory generated). */
export const PaletAmbalajKeresteHesabi_SCHEMA: PremiumCalculatorSchema = {
  id: "palet-ambalaj-kereste-hesabi",
  name: "Palet — Ambalaj Kereste Calculation",
  sectorSlug: "general-industrial",
  category: "cost",
  painStatement: "Industrial engineering cost accounting for wood packaging",

  inputs: [
    {
      id: "productionQuantity",
      label: "Production quantity",
      type: "number",
      unit: "pallets",
      required: true,
      smartDefault: 100,
      validation: { min: 1, max: 1000000 },
      helper: "Must be positive integer",
      expertMeaning: "Production quantity",
    },
    {
      id: "lumberVolumePerPallet",
      label: "Lumber volume per pallet",
      type: "number",
      unit: "m³",
      required: true,
      smartDefault: 0.05,
      validation: { min: 0.001, max: 10 },
      helper: "Must be positive volume",
      expertMeaning: "Lumber volume per pallet",
    },
    {
      id: "lumberPricePerUnitVolume",
      label: "Lumber price per unit volume",
      type: "number",
      unit: "USD/m³",
      required: true,
      smartDefault: 300,
      validation: { min: 0, max: 10000 },
      helper: "Non-negative currency",
      expertMeaning: "Lumber price per unit volume",
    },
    {
      id: "yieldFactor",
      label: "Lumber yield factor",
      type: "number",
      unit: "%",
      required: true,
      smartDefault: 85,
      validation: { min: 1, max: 100, step: 0.1 },
      helper: "Percent between 1 and 100",
      expertMeaning: "Lumber yield factor",
    },
    {
      id: "processingCostPerPallet",
      label: "Processing cost per pallet",
      type: "number",
      unit: "USD",
      required: true,
      smartDefault: 5,
      validation: { min: 0, max: 1000 },
      helper: "Non-negative currency",
      expertMeaning: "Processing cost per pallet",
    },
    {
      id: "fastenersCostPerPallet",
      label: "Fasteners and consumables cost per pallet",
      type: "number",
      unit: "USD",
      required: true,
      smartDefault: 1.5,
      validation: { min: 0, max: 100 },
      helper: "Non-negative currency",
      expertMeaning: "Fasteners and consumables cost per pallet",
    }
  ],

  formulaPipeline: [
    {
      formulaId: "cost.total_exposure",
      inputMap: {
        "a": "productionQuantity",
        "b": "lumberVolumePerPallet",
        "c": "lumberPricePerUnitVolume"
      },
      outputId: "totalExposure",
    },
    {
      formulaId: "benchmark.variance_percent",
      inputMap: {
        "actual": "productionQuantity",
        "target": "lumberVolumePerPallet"
      },
      outputId: "variancePercent",
    }
  ],

  outputs: [
    {
      id: "totalExposure",
      label: "Total manufacturing cost per pallet",
      unit: "USD",
      format: "currency",
      isBigNumber: true,
    },
    {
      id: "variancePercent",
      label: "Selling price per pallet",
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
      "Lumber price is per unit volume and stable",
      "Yield factor accounts for typical saw kerf and defects",
      "Processing cost includes labor and overhead",
    ],
  },
};
