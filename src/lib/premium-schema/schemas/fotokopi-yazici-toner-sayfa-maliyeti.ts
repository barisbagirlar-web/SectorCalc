import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";

/** P7 nightrun — DeepSeek Chief Engineer schema (factory generated). */
export const FotokopiYaziciTonerSayfaMaliyeti_SCHEMA: PremiumCalculatorSchema = {
  id: "fotokopi-yazici-toner-sayfa-maliyeti",
  name: "Fotokopi — Yazıcı Toner Sayfa Maliyeti",
  sectorSlug: "general-industrial",
  category: "cost",
  painStatement: "Industrial cost accounting for consumables",

  inputs: [
    {
      id: "tonerPrice",
      label: "Toner cartridge price",
      type: "number",
      unit: "USD",
      required: true,
      smartDefault: 80,
      validation: { min: 0, max: 10000 },
      helper: "Non-negative currency",
      expertMeaning: "Toner cartridge price",
    },
    {
      id: "tonerYield",
      label: "Toner yield (pages)",
      type: "number",
      unit: "pages",
      required: true,
      smartDefault: 3000,
      validation: { min: 1, max: 100000 },
      helper: "Must be positive integer",
      expertMeaning: "Toner yield (pages)",
    },
    {
      id: "drumPrice",
      label: "Drum unit price",
      type: "number",
      unit: "USD",
      required: true,
      smartDefault: 40,
      validation: { min: 0, max: 10000 },
      helper: "Non-negative currency",
      expertMeaning: "Drum unit price",
    },
    {
      id: "drumYield",
      label: "Drum yield (pages)",
      type: "number",
      unit: "pages",
      required: true,
      smartDefault: 20000,
      validation: { min: 1, max: 100000 },
      helper: "Must be positive integer",
      expertMeaning: "Drum yield (pages)",
    },
    {
      id: "paperCostPerSheet",
      label: "Paper cost per sheet",
      type: "number",
      unit: "USD",
      required: true,
      smartDefault: 0.01,
      validation: { min: 0, max: 10 },
      helper: "Non-negative currency",
      expertMeaning: "Paper cost per sheet",
    },
    {
      id: "wasteRate",
      label: "Waste rate (misprints, etc.)",
      type: "number",
      unit: "%",
      required: true,
      smartDefault: 5,
      validation: { min: 0, max: 100, step: 0.1 },
      helper: "Percent between 0 and 100",
      expertMeaning: "Waste rate (misprints, etc.)",
    }
  ],

  formulaPipeline: [
    {
      formulaId: "cost.total_exposure",
      inputMap: {
        "a": "tonerPrice",
        "b": "tonerYield",
        "c": "drumPrice"
      },
      outputId: "totalExposure",
    },
    {
      formulaId: "benchmark.variance_percent",
      inputMap: {
        "actual": "tonerPrice",
        "target": "tonerYield"
      },
      outputId: "variancePercent",
    }
  ],

  outputs: [
    {
      id: "totalExposure",
      label: "Cost per page",
      unit: "USD",
      format: "currency",
      isBigNumber: true,
    },
    {
      id: "variancePercent",
      label: "Toner cost per page",
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
      "Toner and drum yields are based on manufacturer specifications under standard conditions",
      "Paper cost is per sheet and constant",
      "Waste rate includes misprints, test pages, and calibration waste",
    ],
  },
};
