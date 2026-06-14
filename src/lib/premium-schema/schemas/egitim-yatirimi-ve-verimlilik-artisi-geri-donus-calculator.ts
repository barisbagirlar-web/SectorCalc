import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";

/** P7 nightrun — DeepSeek Chief Engineer schema (factory generated). */
export const EgitimYatirimiVeVerimlilikArtisiGeriDonusCalculator_SCHEMA: PremiumCalculatorSchema = {
  id: "egitim-yatirimi-ve-verimlilik-artisi-geri-donus-calculator",
  name: "Egitim Yatirimi Ve Verimlilik Artisi Geri Donus",
  sectorSlug: "general-industrial",
  category: "cost",
  painStatement: "Human capital cost-benefit analysis (Phillips ROI methodology)",

  inputs: [
    {
      id: "numberOfEmployeesTrained",
      label: "Number of employees trained",
      type: "number",
      unit: "employees",
      required: true,
      smartDefault: 50,
      validation: { min: 1, max: 100000 },
      helper: "Must be positive integer",
      expertMeaning: "Number of employees trained",
    },
    {
      id: "trainingCostPerEmployee",
      label: "Training cost per employee",
      type: "number",
      unit: "USD",
      required: true,
      smartDefault: 500,
      validation: { min: 0, max: 100000 },
      helper: "Non-negative currency",
      expertMeaning: "Training cost per employee",
    },
    {
      id: "fixedTrainingCost",
      label: "Fixed training cost (materials, venue, etc.)",
      type: "number",
      unit: "USD",
      required: true,
      smartDefault: 2000,
      validation: { min: 0, max: 1000000 },
      helper: "Non-negative currency",
      expertMeaning: "Fixed training cost (materials, venue, etc.)",
    },
    {
      id: "baselineProductivityPerEmployee",
      label: "Baseline productivity per employee (units/month)",
      type: "number",
      unit: "units/month",
      required: true,
      smartDefault: 100,
      validation: { min: 0.001, max: 1000000 },
      helper: "Must be positive",
      expertMeaning: "Baseline productivity per employee (units/month)",
    },
    {
      id: "productivityImprovementPercent",
      label: "Productivity improvement after training (%)",
      type: "number",
      unit: "%",
      required: true,
      smartDefault: 10,
      validation: { min: 0, max: 100, step: 0.1 },
      helper: "Percent between 0 and 100",
      expertMeaning: "Productivity improvement after training (%)",
    },
    {
      id: "numberOfMonthsProductive",
      label: "Number of months productivity gain is realized per year",
      type: "number",
      unit: "months",
      required: true,
      smartDefault: 12,
      validation: { min: 1, max: 12 },
      helper: "Between 1 and 12",
      expertMeaning: "Number of months productivity gain is realized per year",
    }
  ],

  formulaPipeline: [
    {
      formulaId: "cost.total_exposure",
      inputMap: {
        "a": "numberOfEmployeesTrained",
        "b": "trainingCostPerEmployee",
        "c": "fixedTrainingCost"
      },
      outputId: "totalExposure",
    },
    {
      formulaId: "benchmark.variance_percent",
      inputMap: {
        "actual": "numberOfEmployeesTrained",
        "target": "trainingCostPerEmployee"
      },
      outputId: "variancePercent",
    }
  ],

  outputs: [
    {
      id: "totalExposure",
      label: "Total training cost",
      unit: "USD",
      format: "currency",
      isBigNumber: true,
    },
    {
      id: "variancePercent",
      label: "Total annual productivity gain (units)",
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
      "Productivity gain is linear and sustained over the productive months",
      "Training cost is incurred upfront",
      "No additional costs (e.g., opportunity cost of time) are considered",
    ],
  },
};
