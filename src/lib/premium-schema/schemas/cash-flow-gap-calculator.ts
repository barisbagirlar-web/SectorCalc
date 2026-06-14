import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";

/** P7 nightrun — DeepSeek Chief Engineer schema (factory generated). */
export const CashFlowGapCalculator_SCHEMA: PremiumCalculatorSchema = {
  id: "cash-flow-gap-calculator",
  name: "Cash Flow Gap Calculator",
  sectorSlug: "general-industrial",
  category: "cost",
  painStatement: "Industrial engineering cost accounting and working capital management",

  inputs: [
    {
      id: "totalSalesRevenue",
      label: "Total sales revenue",
      type: "number",
      unit: "USD",
      required: true,
      smartDefault: 100000,
      validation: { min: 0, max: 1000000000 },
      helper: "Non-negative currency",
      expertMeaning: "Total sales revenue",
    },
    {
      id: "accountsReceivableIncrease",
      label: "Accounts receivable increase",
      type: "number",
      unit: "USD",
      required: true,
      smartDefault: 20000,
      validation: { min: 0, max: 1000000000 },
      helper: "Non-negative currency",
      expertMeaning: "Accounts receivable increase",
    },
    {
      id: "totalOperatingCosts",
      label: "Total operating costs",
      type: "number",
      unit: "USD",
      required: true,
      smartDefault: 80000,
      validation: { min: 0, max: 1000000000 },
      helper: "Non-negative currency",
      expertMeaning: "Total operating costs",
    },
    {
      id: "inventoryIncrease",
      label: "Inventory increase",
      type: "number",
      unit: "USD",
      required: true,
      smartDefault: 10000,
      validation: { min: 0, max: 1000000000 },
      helper: "Non-negative currency",
      expertMeaning: "Inventory increase",
    },
    {
      id: "accountsPayableIncrease",
      label: "Accounts payable increase",
      type: "number",
      unit: "USD",
      required: true,
      smartDefault: 15000,
      validation: { min: 0, max: 1000000000 },
      helper: "Non-negative currency",
      expertMeaning: "Accounts payable increase",
    },
    {
      id: "daysPayableOutstanding",
      label: "Days payable outstanding",
      type: "number",
      unit: "days",
      required: true,
      smartDefault: 30,
      validation: { min: 0, max: 365 },
      helper: "Days between 0 and 365",
      expertMeaning: "Days payable outstanding",
    }
  ],

  formulaPipeline: [
    {
      formulaId: "cost.total_exposure",
      inputMap: {
        "a": "totalSalesRevenue",
        "b": "accountsReceivableIncrease",
        "c": "totalOperatingCosts"
      },
      outputId: "totalExposure",
    },
    {
      formulaId: "benchmark.variance_percent",
      inputMap: {
        "actual": "totalSalesRevenue",
        "target": "accountsReceivableIncrease"
      },
      outputId: "variancePercent",
    }
  ],

  outputs: [
    {
      id: "totalExposure",
      label: "Cash flow gap",
      unit: "USD",
      format: "currency",
      isBigNumber: true,
    },
    {
      id: "variancePercent",
      label: "Gap as percentage of sales",
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
      "All figures are for the same accounting period",
      "No extraordinary items or non-operating cash flows",
      "DPO and DSO are representative of payment/receipt patterns",
    ],
  },
};
