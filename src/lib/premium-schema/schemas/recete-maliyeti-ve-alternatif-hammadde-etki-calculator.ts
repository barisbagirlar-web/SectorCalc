import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";

/** P7 nightrun — DeepSeek Chief Engineer schema (factory generated). */
export const ReceteMaliyetiVeAlternatifHammaddeEtkiCalculator_SCHEMA: PremiumCalculatorSchema = {
  id: "recete-maliyeti-ve-alternatif-hammadde-etki-calculator",
  name: "Recete Maliyeti Ve Alternatif Hammadde Etki",
  sectorSlug: "general-industrial",
  category: "cost",
  painStatement: "Industrial engineering cost accounting and material substitution analysis",

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
      id: "baseMaterialPrice",
      label: "Base material price per unit",
      type: "number",
      unit: "USD",
      required: true,
      smartDefault: 10,
      validation: { min: 0.01, max: 100000 },
      helper: "Non-negative currency, must be >0",
      expertMeaning: "Base material price per unit",
    },
    {
      id: "scrapRate",
      label: "Base material scrap rate",
      type: "number",
      unit: "%",
      required: true,
      smartDefault: 5,
      validation: { min: 0, max: 100, step: 0.1 },
      helper: "Percent between 0 and 100",
      expertMeaning: "Base material scrap rate",
    },
    {
      id: "yieldFactor",
      label: "Base material yield factor",
      type: "number",
      unit: "ratio",
      required: true,
      smartDefault: 0.95,
      validation: { min: 0.01, max: 1 },
      helper: "Must be between 0 and 1",
      expertMeaning: "Base material yield factor",
    },
    {
      id: "altMaterialPrice",
      label: "Alternative material price per unit",
      type: "number",
      unit: "USD",
      required: true,
      smartDefault: 12,
      validation: { min: 0.01, max: 100000 },
      helper: "Non-negative currency, must be >0",
      expertMeaning: "Alternative material price per unit",
    },
    {
      id: "altScrapRate",
      label: "Alternative material scrap rate",
      type: "number",
      unit: "%",
      required: true,
      smartDefault: 3,
      validation: { min: 0, max: 100, step: 0.1 },
      helper: "Percent between 0 and 100",
      expertMeaning: "Alternative material scrap rate",
    }
  ],

  formulaPipeline: [
    {
      formulaId: "cost.total_exposure",
      inputMap: {
        "a": "productionQuantity",
        "b": "baseMaterialPrice",
        "c": "scrapRate"
      },
      outputId: "totalExposure",
    },
    {
      formulaId: "benchmark.variance_percent",
      inputMap: {
        "actual": "productionQuantity",
        "target": "baseMaterialPrice"
      },
      outputId: "variancePercent",
    }
  ],

  outputs: [
    {
      id: "totalExposure",
      label: "Total base material cost",
      unit: "USD",
      format: "currency",
      isBigNumber: true,
    },
    {
      id: "variancePercent",
      label: "Total alternative material cost",
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
      "Declared scrap rates are representative",
      "Yield factors are constant",
    ],
  },
};
