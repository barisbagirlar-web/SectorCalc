import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";

/** P7 nightrun — DeepSeek Chief Engineer schema (factory generated). */
export const OtoServisIsEmriVeYedekParcaTeklifTutarlilikCalculator_SCHEMA: PremiumCalculatorSchema = {
  id: "oto-servis-is-emri-ve-yedek-parca-teklif-tutarlilik-calculator",
  name: "Oto Servis Is Emri Ve Yedek Parca Teklif Tutarlilik",
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
      id: "directLaborCost",
      label: "Direct labor cost",
      type: "number",
      unit: "USD",
      required: true,
      smartDefault: 20,
      validation: { min: 0, max: 100000 },
      helper: "Non-negative currency",
      expertMeaning: "Direct labor cost",
    },
    {
      id: "overheadPercent",
      label: "Overhead rate",
      type: "number",
      unit: "%",
      required: true,
      smartDefault: 30,
      validation: { min: 0, max: 100, step: 0.1 },
      helper: "Percent between 0 and 100",
      expertMeaning: "Overhead rate",
    },
    {
      id: "targetGrossMarginPercent",
      label: "Target gross margin",
      type: "number",
      unit: "%",
      required: true,
      smartDefault: 20,
      validation: { min: 1, max: 85, step: 0.1 },
      helper: "Percent between 1 and 85",
      expertMeaning: "Target gross margin",
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
      label: "Total cost per unit",
      unit: "USD",
      format: "currency",
      isBigNumber: true,
    },
    {
      id: "variancePercent",
      label: "Gross profit per unit",
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
      "All costs are in same currency",
      "Scrap rate applies to material cost only",
      "Overhead is applied as percentage of direct labor cost",
    ],
  },
};
