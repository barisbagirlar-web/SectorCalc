import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";

export const PRODUCT_CUSTOMER_PROFITABILITY_CALCULATOR_SCHEMA: PremiumCalculatorSchema = {
  id: "product-customer-profitability-calculator",
  name: "Product and Customer Profitability Calculator",
  sectorSlug: "retail",
  category: "cost",
  painStatement:
    "High-revenue customers can destroy margin through returns, delays and rework.",

  inputs: [
    {
      id: "revenue",
      label: "Revenue",
      type: "number",
      unit: "USD",
      required: true,
      smartDefault: 85000,
      validation: { min: 0 },
      helper: "Customer or SKU revenue in the period.",
      expertMeaning: "Invoice revenue before hidden service costs.",
    },
    {
      id: "directCost",
      label: "Direct cost",
      type: "number",
      unit: "USD",
      required: true,
      smartDefault: 52000,
      validation: { min: 0 },
      helper: "COGS and direct fulfillment cost.",
      expertMeaning: "Variable cost tied to volume.",
    },
    {
      id: "serviceCost",
      label: "Service cost",
      type: "number",
      unit: "USD",
      required: true,
      smartDefault: 6800,
      validation: { min: 0 },
      helper: "Support, delivery rework and account service load.",
      expertMeaning: "Hidden service burden on the customer or SKU.",
    },
    {
      id: "returnsCost",
      label: "Returns cost",
      type: "number",
      unit: "USD",
      required: true,
      smartDefault: 4200,
      validation: { min: 0 },
      helper: "Returns, credits and rework tied to the account.",
      expertMeaning: "Reverse logistics and credit memo load.",
    },
  ],

  formulaPipeline: [
    {
      formulaId: "cost.total_exposure",
      inputMap: { a: "directCost", b: "serviceCost", c: "returnsCost" },
      outputId: "loadedCost",
    },
    {
      formulaId: "cost.difference",
      inputMap: { a: "revenue", b: "loadedCost" },
      outputId: "contributionAmount",
    },
    {
      formulaId: "cost.margin_rate_on_price",
      inputMap: { price: "revenue", cost: "loadedCost" },
      outputId: "contributionMarginRate",
    },
  ],

  outputs: [
    {
      id: "contributionMarginRate",
      label: "Contribution margin rate",
      unit: "%",
      format: "percentage",
      isBigNumber: true,
    },
    {
      id: "contributionAmount",
      label: "Contribution amount",
      unit: "$",
      format: "currency",
    },
    {
      id: "loadedCost",
      label: "Loaded cost",
      unit: "$",
      format: "currency",
    },
  ],

  thresholds: [
    {
      fieldId: "contributionMarginRate",
      warning: 12,
      critical: 5,
      direction: "lower_is_bad",
      warningMessage: "Contribution margin is thin after service and returns — review account terms.",
      criticalMessage: "Customer or SKU may be margin-negative — reprice or reduce service load.",
    },
  ],

  reportTemplate: {
    title: "Product and Customer Profitability Decision Report",
    sections: ["executive_summary", "loss_breakdown", "thresholds", "action_plan", "assumptions"],
    exportFormats: ["pdf", "csv"],
  },

  assumptions: {
    hiddenLossMultiplier: 1.04,
    volatilityPercent: 9,
    targetMarginPercent: 15,
    assumptionNotes: [
      "Loaded cost = direct cost + service cost + returns cost.",
      "Contribution = revenue − loaded cost.",
      "Margin rate = contribution ÷ revenue.",
    ],
  },
};
