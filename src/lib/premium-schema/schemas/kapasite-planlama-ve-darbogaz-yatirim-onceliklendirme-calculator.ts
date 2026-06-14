import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";

/** P7 nightrun — DeepSeek Chief Engineer schema (factory generated). */
export const KapasitePlanlamaVeDarbogazYatirimOnceliklendirmeCalculator_SCHEMA: PremiumCalculatorSchema = {
  id: "kapasite-planlama-ve-darbogaz-yatirim-onceliklendirme-calculator",
  name: "Kapasite Planlama Ve Darbogaz Yatirim Onceliklendirme",
  sectorSlug: "general-industrial",
  category: "cost",
  painStatement: "Theory of Constraints (TOC) and capacity planning principles",

  inputs: [
    {
      id: "availableHours",
      label: "Available hours per period",
      type: "number",
      unit: "hours",
      required: true,
      smartDefault: 2000,
      validation: { min: 1, max: 8760 },
      helper: "Must be positive hours",
      expertMeaning: "Available hours per period",
    },
    {
      id: "utilizationRate",
      label: "Utilization rate",
      type: "number",
      unit: "%",
      required: true,
      smartDefault: 85,
      validation: { min: 0, max: 100, step: 0.1 },
      helper: "Percent between 0 and 100",
      expertMeaning: "Utilization rate",
    },
    {
      id: "efficiencyRate",
      label: "Efficiency rate",
      type: "number",
      unit: "%",
      required: true,
      smartDefault: 90,
      validation: { min: 0, max: 100, step: 0.1 },
      helper: "Percent between 0 and 100",
      expertMeaning: "Efficiency rate",
    },
    {
      id: "demandQuantity",
      label: "Demand quantity per period",
      type: "number",
      unit: "units",
      required: true,
      smartDefault: 1000,
      validation: { min: 1, max: 1000000 },
      helper: "Must be positive integer",
      expertMeaning: "Demand quantity per period",
    },
    {
      id: "bottleneckTimePerUnit",
      label: "Bottleneck time per unit",
      type: "number",
      unit: "hours",
      required: true,
      smartDefault: 0.5,
      validation: { min: 0.001, max: 100 },
      helper: "Must be positive hours",
      expertMeaning: "Bottleneck time per unit",
    },
    {
      id: "sellingPrice",
      label: "Selling price per unit",
      type: "number",
      unit: "USD",
      required: true,
      smartDefault: 100,
      validation: { min: 0, max: 100000 },
      helper: "Non-negative currency",
      expertMeaning: "Selling price per unit",
    }
  ],

  formulaPipeline: [
    {
      formulaId: "cost.total_exposure",
      inputMap: {
        "a": "availableHours",
        "b": "utilizationRate",
        "c": "efficiencyRate"
      },
      outputId: "totalExposure",
    },
    {
      formulaId: "benchmark.variance_percent",
      inputMap: {
        "actual": "availableHours",
        "target": "utilizationRate"
      },
      outputId: "variancePercent",
    }
  ],

  outputs: [
    {
      id: "totalExposure",
      label: "Effective capacity",
      unit: "units",
      format: "currency",
      isBigNumber: true,
    },
    {
      id: "variancePercent",
      label: "Capacity gap",
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
      "Single bottleneck resource considered",
      "Constant demand and cost structure",
      "No setup time or changeover losses",
    ],
  },
};
