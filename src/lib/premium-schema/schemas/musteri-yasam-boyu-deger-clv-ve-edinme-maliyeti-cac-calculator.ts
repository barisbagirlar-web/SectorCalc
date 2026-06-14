import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";

/** P7 nightrun — DeepSeek Chief Engineer schema (factory generated). */
export const MusteriYasamBoyuDegerClvVeEdinmeMaliyetiCacCalculator_SCHEMA: PremiumCalculatorSchema = {
  id: "musteri-yasam-boyu-deger-clv-ve-edinme-maliyeti-cac-calculator",
  name: "Musteri Yasam Boyu Deger Clv Ve Edinme Maliyeti Cac",
  sectorSlug: "general-industrial",
  category: "cost",
  painStatement: "Marketing analytics and cost accounting",

  inputs: [
    {
      id: "totalRevenue",
      label: "Total revenue from customers",
      type: "number",
      unit: "USD",
      required: true,
      smartDefault: 100000,
      validation: { min: 0, max: 1000000000 },
      helper: "Non-negative currency amount",
      expertMeaning: "Total revenue from customers",
    },
    {
      id: "customerCount",
      label: "Number of customers",
      type: "number",
      unit: "customers",
      required: true,
      smartDefault: 1000,
      validation: { min: 1, max: 10000000 },
      helper: "Must be positive integer",
      expertMeaning: "Number of customers",
    },
    {
      id: "grossMarginPercent",
      label: "Gross margin percentage",
      type: "number",
      unit: "%",
      required: true,
      smartDefault: 40,
      validation: { min: 0, max: 100, step: 0.1 },
      helper: "Percentage between 0 and 100",
      expertMeaning: "Gross margin percentage",
    },
    {
      id: "discountRate",
      label: "Discount rate per period",
      type: "number",
      unit: "%",
      required: true,
      smartDefault: 10,
      validation: { min: 0, max: 100, step: 0.1 },
      helper: "Percentage between 0 and 100; if 0, simplified CLV used",
      expertMeaning: "Discount rate per period",
    },
    {
      id: "retentionPeriods",
      label: "Number of retention periods",
      type: "number",
      unit: "periods",
      required: true,
      smartDefault: 12,
      validation: { min: 1, max: 120 },
      helper: "Positive integer representing months or years",
      expertMeaning: "Number of retention periods",
    },
    {
      id: "totalAcquisitionCost",
      label: "Total customer acquisition cost",
      type: "number",
      unit: "USD",
      required: true,
      smartDefault: 50000,
      validation: { min: 0, max: 1000000000 },
      helper: "Non-negative currency amount",
      expertMeaning: "Total customer acquisition cost",
    }
  ],

  formulaPipeline: [
    {
      formulaId: "cost.total_exposure",
      inputMap: {
        "a": "totalRevenue",
        "b": "customerCount",
        "c": "grossMarginPercent"
      },
      outputId: "totalExposure",
    },
    {
      formulaId: "benchmark.variance_percent",
      inputMap: {
        "actual": "totalRevenue",
        "target": "customerCount"
      },
      outputId: "variancePercent",
    }
  ],

  outputs: [
    {
      id: "totalExposure",
      label: "Customer Lifetime Value (CLV)",
      unit: "USD",
      format: "currency",
      isBigNumber: true,
    },
    {
      id: "variancePercent",
      label: "Customer Acquisition Cost (CAC)",
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
      "Revenue and costs are constant over time",
      "Customer retention rate is 100% over the retention periods (no churn)",
      "Discount rate is constant per period",
    ],
  },
};
