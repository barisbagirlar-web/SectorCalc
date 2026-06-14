import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";

/** P7 nightrun — DeepSeek Chief Engineer schema (factory generated). */
export const EsnekUretimHucresiYatirimVeGeriDonusCalculator_SCHEMA: PremiumCalculatorSchema = {
  id: "esnek-uretim-hucresi-yatirim-ve-geri-donus-calculator",
  name: "Esnek Uretim Hucresi Yatirim Ve Geri Donus",
  sectorSlug: "general-industrial",
  category: "cost",
  painStatement: "Engineering economics and capital budgeting",

  inputs: [
    {
      id: "equipmentCost",
      label: "Equipment cost",
      type: "number",
      unit: "USD",
      required: true,
      smartDefault: 500000,
      validation: { min: 0, max: 10000000 },
      helper: "Non-negative currency",
      expertMeaning: "Equipment cost",
    },
    {
      id: "installationCost",
      label: "Installation cost",
      type: "number",
      unit: "USD",
      required: true,
      smartDefault: 50000,
      validation: { min: 0, max: 2000000 },
      helper: "Non-negative currency",
      expertMeaning: "Installation cost",
    },
    {
      id: "trainingCost",
      label: "Training cost",
      type: "number",
      unit: "USD",
      required: true,
      smartDefault: 20000,
      validation: { min: 0, max: 500000 },
      helper: "Non-negative currency",
      expertMeaning: "Training cost",
    },
    {
      id: "annualLaborSavings",
      label: "Annual labor savings",
      type: "number",
      unit: "USD",
      required: true,
      smartDefault: 150000,
      validation: { min: 0, max: 5000000 },
      helper: "Non-negative currency",
      expertMeaning: "Annual labor savings",
    },
    {
      id: "annualScrapReductionSavings",
      label: "Annual scrap reduction savings",
      type: "number",
      unit: "USD",
      required: true,
      smartDefault: 20000,
      validation: { min: 0, max: 500000 },
      helper: "Non-negative currency",
      expertMeaning: "Annual scrap reduction savings",
    },
    {
      id: "annualThroughputIncreaseSavings",
      label: "Annual throughput increase savings",
      type: "number",
      unit: "USD",
      required: true,
      smartDefault: 30000,
      validation: { min: 0, max: 500000 },
      helper: "Non-negative currency",
      expertMeaning: "Annual throughput increase savings",
    }
  ],

  formulaPipeline: [
    {
      formulaId: "cost.total_exposure",
      inputMap: {
        "a": "equipmentCost",
        "b": "installationCost",
        "c": "trainingCost"
      },
      outputId: "totalExposure",
    },
    {
      formulaId: "benchmark.variance_percent",
      inputMap: {
        "actual": "equipmentCost",
        "target": "installationCost"
      },
      outputId: "variancePercent",
    }
  ],

  outputs: [
    {
      id: "totalExposure",
      label: "Total investment",
      unit: "USD",
      format: "currency",
      isBigNumber: true,
    },
    {
      id: "variancePercent",
      label: "Net annual cash flow",
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
      "All savings and costs are constant over project life",
      "No inflation or currency fluctuation",
      "Tax effects are ignored",
    ],
  },
};
