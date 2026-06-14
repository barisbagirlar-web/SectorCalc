import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";

/** P7 nightrun — DeepSeek Chief Engineer schema (factory generated). */
export const IsletmeSermayesiVeNakitDongusuOptimizasyonCalculator_SCHEMA: PremiumCalculatorSchema = {
  id: "isletme-sermayesi-ve-nakit-dongusu-optimizasyon-calculator",
  name: "Isletme Sermayesi Ve Nakit Dongusu Optimizasyon",
  sectorSlug: "general-industrial",
  category: "cost",
  painStatement: "Working capital management and cash conversion cycle (CCC) methodology",

  inputs: [
    {
      id: "averageInventory",
      label: "Average Inventory",
      type: "number",
      unit: "USD",
      required: true,
      smartDefault: 500000,
      validation: { min: 0, max: 1000000000 },
      helper: "Non-negative currency value",
      expertMeaning: "Average Inventory",
    },
    {
      id: "costOfGoodsSold",
      label: "Cost of Goods Sold (annual)",
      type: "number",
      unit: "USD",
      required: true,
      smartDefault: 2000000,
      validation: { min: 1, max: 10000000000 },
      helper: "Must be positive",
      expertMeaning: "Cost of Goods Sold (annual)",
    },
    {
      id: "averageAccountsReceivable",
      label: "Average Accounts Receivable",
      type: "number",
      unit: "USD",
      required: true,
      smartDefault: 400000,
      validation: { min: 0, max: 1000000000 },
      helper: "Non-negative currency value",
      expertMeaning: "Average Accounts Receivable",
    },
    {
      id: "netCreditSales",
      label: "Net Credit Sales (annual)",
      type: "number",
      unit: "USD",
      required: true,
      smartDefault: 2500000,
      validation: { min: 1, max: 10000000000 },
      helper: "Must be positive",
      expertMeaning: "Net Credit Sales (annual)",
    },
    {
      id: "averageAccountsPayable",
      label: "Average Accounts Payable",
      type: "number",
      unit: "USD",
      required: true,
      smartDefault: 300000,
      validation: { min: 0, max: 1000000000 },
      helper: "Non-negative currency value",
      expertMeaning: "Average Accounts Payable",
    },
    {
      id: "targetCCC",
      label: "Target Cash Conversion Cycle (days)",
      type: "number",
      unit: "days",
      required: true,
      smartDefault: 30,
      validation: { min: 0, max: 365 },
      helper: "Must be non-negative and less than current CCC",
      expertMeaning: "Target Cash Conversion Cycle (days)",
    }
  ],

  formulaPipeline: [
    {
      formulaId: "cost.total_exposure",
      inputMap: {
        "a": "averageInventory",
        "b": "costOfGoodsSold",
        "c": "averageAccountsReceivable"
      },
      outputId: "totalExposure",
    },
    {
      formulaId: "benchmark.variance_percent",
      inputMap: {
        "actual": "averageInventory",
        "target": "costOfGoodsSold"
      },
      outputId: "variancePercent",
    }
  ],

  outputs: [
    {
      id: "totalExposure",
      label: "Current Cash Conversion Cycle",
      unit: "days",
      format: "currency",
      isBigNumber: true,
    },
    {
      id: "variancePercent",
      label: "Working Capital Requirement",
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
      "All averages are calculated over the same period (e.g., annual)",
      "Cost of Goods Sold and Net Credit Sales are annual figures",
      "Target CCC is achievable through operational improvements",
    ],
  },
};
