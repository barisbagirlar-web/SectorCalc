import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";

/** P7 nightrun — DeepSeek Chief Engineer schema (factory generated). */
export const PrefabrikKonteynerOfisMMaliyeti_SCHEMA: PremiumCalculatorSchema = {
  id: "prefabrik-konteyner-ofis-m-maliyeti",
  name: "Prefabrik — Konteyner Ofis m² Maliyeti",
  sectorSlug: "general-industrial",
  category: "cost",
  painStatement: "Endüstri mühendisliği maliyet muhasebesi ve prefabrik yapı sektörü standartları",

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
      id: "unitLaborCost",
      label: "Unit labor cost",
      type: "number",
      unit: "USD",
      required: true,
      smartDefault: 20,
      validation: { min: 0, max: 1000 },
      helper: "Non-negative currency",
      expertMeaning: "Unit labor cost",
    },
    {
      id: "fixedOverhead",
      label: "Fixed overhead",
      type: "number",
      unit: "USD",
      required: true,
      smartDefault: 500,
      validation: { min: 0, max: 1000000 },
      helper: "Non-negative currency",
      expertMeaning: "Fixed overhead",
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
      label: "Total cost",
      unit: "USD",
      format: "currency",
      isBigNumber: true,
    },
    {
      id: "variancePercent",
      label: "Cost per square meter",
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
