import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";

/** P7 nightrun — DeepSeek Chief Engineer schema (factory generated). */
export const BoyaKaplamaSarfiyatiMBasinaHesabi_SCHEMA: PremiumCalculatorSchema = {
  id: "boya-kaplama-sarfiyati-m-basina-hesabi",
  name: "Boya — Kaplama Sarfiyatı (m² Başına) Calculation",
  sectorSlug: "general-industrial",
  category: "cost",
  painStatement: "Industrial engineering and construction cost estimation standards",

  inputs: [
    {
      id: "jobArea",
      label: "Job area",
      type: "number",
      unit: "m²",
      required: true,
      smartDefault: 100,
      validation: { min: 0.01, max: 100000 },
      helper: "Must be positive",
      expertMeaning: "Job area",
    },
    {
      id: "dryFilmThickness",
      label: "Dry film thickness",
      type: "number",
      unit: "µm",
      required: true,
      smartDefault: 100,
      validation: { min: 1, max: 1000 },
      helper: "Must be between 1 and 1000",
      expertMeaning: "Dry film thickness",
    },
    {
      id: "volumeSolidsPercent",
      label: "Volume solids percentage",
      type: "number",
      unit: "%",
      required: true,
      smartDefault: 60,
      validation: { min: 1, max: 100, step: 0.1 },
      helper: "Must be between 1 and 100",
      expertMeaning: "Volume solids percentage",
    },
    {
      id: "applicationLossFactor",
      label: "Application loss factor",
      type: "number",
      unit: "dimensionless",
      required: true,
      smartDefault: 1.2,
      validation: { min: 1, max: 2 },
      helper: "Must be between 1.0 and 2.0",
      expertMeaning: "Application loss factor",
    },
    {
      id: "unitPaintCost",
      label: "Unit paint cost",
      type: "number",
      unit: "USD/L",
      required: true,
      smartDefault: 20,
      validation: { min: 0, max: 1000 },
      helper: "Non-negative",
      expertMeaning: "Unit paint cost",
    },
    {
      id: "laborHours",
      label: "Labor hours",
      type: "number",
      unit: "hours",
      required: true,
      smartDefault: 8,
      validation: { min: 0, max: 1000 },
      helper: "Non-negative",
      expertMeaning: "Labor hours",
    }
  ],

  formulaPipeline: [
    {
      formulaId: "cost.total_exposure",
      inputMap: {
        "a": "jobArea",
        "b": "dryFilmThickness",
        "c": "volumeSolidsPercent"
      },
      outputId: "totalExposure",
    },
    {
      formulaId: "benchmark.variance_percent",
      inputMap: {
        "actual": "jobArea",
        "target": "dryFilmThickness"
      },
      outputId: "variancePercent",
    }
  ],

  outputs: [
    {
      id: "totalExposure",
      label: "Practical paint consumption per m²",
      unit: "L/m²",
      format: "currency",
      isBigNumber: true,
    },
    {
      id: "variancePercent",
      label: "Total paint material cost",
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
      "Application loss factor includes typical overspray and waste",
      "Volume solids percentage is as per manufacturer datasheet",
      "Labor hours include preparation and cleanup",
    ],
  },
};
