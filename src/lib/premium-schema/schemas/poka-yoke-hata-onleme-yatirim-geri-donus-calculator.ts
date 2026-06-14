import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";

/** P7 nightrun — DeepSeek Chief Engineer schema (factory generated). */
export const PokaYokeHataOnlemeYatirimGeriDonusCalculator_SCHEMA: PremiumCalculatorSchema = {
  id: "poka-yoke-hata-onleme-yatirim-geri-donus-calculator",
  name: "Poka Yoke Hata Onleme Yatirim Geri Donus",
  sectorSlug: "general-industrial",
  category: "cost",
  painStatement: "Quality cost accounting and lean manufacturing principles",

  inputs: [
    {
      id: "productionVolume",
      label: "Annual production volume",
      type: "number",
      unit: "units/year",
      required: true,
      smartDefault: 100000,
      validation: { min: 1, max: 100000000 },
      helper: "Must be positive integer",
      expertMeaning: "Annual production volume",
    },
    {
      id: "defectRateBefore",
      label: "Defect rate before Poka-Yoke",
      type: "number",
      unit: "%",
      required: true,
      smartDefault: 5,
      validation: { min: 0, max: 100, step: 0.1 },
      helper: "Percent between 0 and 100",
      expertMeaning: "Defect rate before Poka-Yoke",
    },
    {
      id: "defectRateAfter",
      label: "Defect rate after Poka-Yoke",
      type: "number",
      unit: "%",
      required: true,
      smartDefault: 0.5,
      validation: { min: 0, max: 100, step: 0.1 },
      helper: "Percent between 0 and 100, must be less than or equal to defectRateBefore",
      expertMeaning: "Defect rate after Poka-Yoke",
    },
    {
      id: "unitCostOfDefect",
      label: "Unit cost of defect",
      type: "number",
      unit: "USD",
      required: true,
      smartDefault: 50,
      validation: { min: 0, max: 100000 },
      helper: "Non-negative currency",
      expertMeaning: "Unit cost of defect",
    },
    {
      id: "investmentCost",
      label: "Total investment cost for Poka-Yoke",
      type: "number",
      unit: "USD",
      required: true,
      smartDefault: 50000,
      validation: { min: 0, max: 10000000 },
      helper: "Non-negative currency",
      expertMeaning: "Total investment cost for Poka-Yoke",
    },
    {
      id: "usefulLifeYears",
      label: "Useful life of investment (years)",
      type: "number",
      unit: "years",
      required: true,
      smartDefault: 5,
      validation: { min: 1, max: 50 },
      helper: "Positive integer",
      expertMeaning: "Useful life of investment (years)",
    }
  ],

  formulaPipeline: [
    {
      formulaId: "cost.total_exposure",
      inputMap: {
        "a": "productionVolume",
        "b": "defectRateBefore",
        "c": "defectRateAfter"
      },
      outputId: "totalExposure",
    },
    {
      formulaId: "benchmark.variance_percent",
      inputMap: {
        "actual": "productionVolume",
        "target": "defectRateBefore"
      },
      outputId: "variancePercent",
    }
  ],

  outputs: [
    {
      id: "totalExposure",
      label: "Annual savings from defect reduction",
      unit: "USD",
      format: "currency",
      isBigNumber: true,
    },
    {
      id: "variancePercent",
      label: "Net present value of investment",
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
      "Defect rates are stable and representative of annual averages.",
      "Unit cost of defect includes all internal and external failure costs.",
      "Investment cost is incurred upfront in year 0.",
    ],
  },
};
