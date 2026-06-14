import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";

/** P7 nightrun — DeepSeek Chief Engineer schema (factory generated). */
export const IstatistikselProsesKontrolSpcLimitHesabi_SCHEMA: PremiumCalculatorSchema = {
  id: "istatistiksel-proses-kontrol-spc-limit-hesabi",
  name: "İstatistiksel Proses Kontrol (SPC) Limit Calculation",
  sectorSlug: "general-industrial",
  category: "cost",
  painStatement: "Shewhart control chart methodology for variable data",

  inputs: [
    {
      id: "subgroupAverages",
      label: "Subgroup averages",
      type: "number",
      unit: "measurement unit",
      required: true,
      smartDefault: 1,
      validation: { min: 0, max: 1000000 },
      helper: "Array of at least 2 positive numbers",
      expertMeaning: "Subgroup averages",
    },
    {
      id: "subgroupRanges",
      label: "Subgroup ranges",
      type: "number",
      unit: "measurement unit",
      required: true,
      smartDefault: 1,
      validation: { min: 0, max: 1000000 },
      helper: "Array of same length as averages, non-negative",
      expertMeaning: "Subgroup ranges",
    },
    {
      id: "sampleSize",
      label: "Sample size per subgroup",
      type: "number",
      unit: "units",
      required: true,
      smartDefault: 5,
      validation: { min: 2, max: 25 },
      helper: "Integer between 2 and 25",
      expertMeaning: "Sample size per subgroup",
    }
  ],

  formulaPipeline: [
    {
      formulaId: "cost.total_exposure",
      inputMap: {
        "a": "subgroupAverages",
        "b": "subgroupRanges",
        "c": "sampleSize"
      },
      outputId: "totalExposure",
    },
    {
      formulaId: "benchmark.variance_percent",
      inputMap: {
        "actual": "subgroupAverages",
        "target": "subgroupRanges"
      },
      outputId: "variancePercent",
    }
  ],

  outputs: [
    {
      id: "totalExposure",
      label: "Center line (CL)",
      unit: "measurement unit",
      format: "currency",
      isBigNumber: true,
    },
    {
      id: "variancePercent",
      label: "Upper control limit (UCL)",
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
      "Process is in statistical control",
      "Data is normally distributed",
      "Subgroup size is constant",
    ],
  },
};
