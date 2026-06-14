import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";

/** P7 nightrun — DeepSeek Chief Engineer schema (factory generated). */
export const MusteriKaybiChurnVeKaybedilenGelirCalculator_SCHEMA: PremiumCalculatorSchema = {
  id: "musteri-kaybi-churn-ve-kaybedilen-gelir-calculator",
  name: "Musteri Kaybi Churn Ve Kaybedilen Gelir",
  sectorSlug: "general-industrial",
  category: "cost",
  painStatement: "Customer churn analysis and revenue impact estimation",

  inputs: [
    {
      id: "totalCustomersStart",
      label: "Total customers at start of period",
      type: "number",
      unit: "customers",
      required: true,
      smartDefault: 1000,
      validation: { min: 1, max: 10000000 },
      helper: "Must be positive integer",
      expertMeaning: "Total customers at start of period",
    },
    {
      id: "customersLost",
      label: "Customers lost in period",
      type: "number",
      unit: "customers",
      required: true,
      smartDefault: 50,
      validation: { min: 0, max: 10000000 },
      helper: "Must be non-negative and ≤ totalCustomersStart",
      expertMeaning: "Customers lost in period",
    },
    {
      id: "totalRecurringRevenue",
      label: "Total recurring revenue in period",
      type: "number",
      unit: "USD",
      required: true,
      smartDefault: 500000,
      validation: { min: 0, max: 1000000000 },
      helper: "Non-negative currency",
      expertMeaning: "Total recurring revenue in period",
    },
    {
      id: "variableCostRatio",
      label: "Variable cost ratio (as decimal, e.g., 0.4 for 40%)",
      type: "number",
      unit: "decimal",
      required: true,
      smartDefault: 0.4,
      validation: { min: 0, max: 1 },
      helper: "Must be between 0 and 1",
      expertMeaning: "Variable cost ratio (as decimal, e.g., 0.4 for 40%)",
    },
    {
      id: "averageCustomerLifespan",
      label: "Average customer lifespan (in periods)",
      type: "number",
      unit: "periods",
      required: true,
      smartDefault: 36,
      validation: { min: 1, max: 120 },
      helper: "Must be positive integer",
      expertMeaning: "Average customer lifespan (in periods)",
    }
  ],

  formulaPipeline: [
    {
      formulaId: "cost.total_exposure",
      inputMap: {
        "a": "totalCustomersStart",
        "b": "customersLost",
        "c": "totalRecurringRevenue"
      },
      outputId: "totalExposure",
    },
    {
      formulaId: "benchmark.variance_percent",
      inputMap: {
        "actual": "totalCustomersStart",
        "target": "customersLost"
      },
      outputId: "variancePercent",
    }
  ],

  outputs: [
    {
      id: "totalExposure",
      label: "Churn rate",
      unit: "%",
      format: "percentage",
      isBigNumber: true,
    },
    {
      id: "variancePercent",
      label: "Average revenue per customer (ARPC)",
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
      "Revenue is recurring and uniform across customers",
      "Variable cost ratio is constant across customers",
      "Customer lifespan is average and constant",
    ],
  },
};
