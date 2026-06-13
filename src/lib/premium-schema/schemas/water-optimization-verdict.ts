import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";

export const WATER_OPTIMIZATION_VERDICT_SCHEMA: PremiumCalculatorSchema = {
  id: "water-optimization-verdict",
  name: "Water Efficiency Verdict",
  sectorSlug: "retail",
  category: "benchmark",
  legacyPaidSlug: "water-optimization-verdict",
  painStatement:
    "Find minimum viable irrigation spend with efficiency verdict.",

  inputs: [
    {
      id: "averageInventory",
      label: "Average inventory",
      type: "number",
      unit: "USD",
      required: true,
      smartDefault: 42000,
      validation: { min: 0 },
      helper: "Average inventory value on hand.",
      expertMeaning: "Inventory base for carrying and markdown exposure.",
    },
    {
      id: "annualCOGS",
      label: "Annual COGS",
      type: "number",
      unit: "USD",
      required: true,
      smartDefault: 180000,
      validation: { min: 0 },
      helper: "Cost of goods sold over twelve months.",
      expertMeaning: "Velocity numerator for turnover ratio.",
    },
    {
      id: "carryingCostPercent",
      label: "Carrying cost",
      type: "number",
      unit: "%",
      required: true,
      smartDefault: 18,
      validation: { min: 0, max: 100 },
      helper: "Annual carrying cost as percent of inventory.",
      expertMeaning: "Storage, insurance and capital cost band.",
    },
    {
      id: "markdownPercent",
      label: "Markdown",
      type: "number",
      unit: "%",
      required: true,
      smartDefault: 12,
      validation: { min: 0, max: 100 },
      helper: "Expected markdown as percent of inventory.",
      expertMeaning: "Slow-stock clearance exposure.",
    },
  ],

  formulaPipeline: [
    {
      formulaId: "retail.inventory_turnover",
      inputMap: { annualCOGS: "annualCOGS", averageInventory: "averageInventory" },
      outputId: "turnover",
    },
    {
      formulaId: "cost.percent_of_amount",
      inputMap: { amount: "averageInventory", percent: "carryingCostPercent" },
      outputId: "carryingCost",
    },
    {
      formulaId: "cost.percent_of_amount",
      inputMap: { amount: "averageInventory", percent: "markdownPercent" },
      outputId: "markdownExposure",
    },
    {
      formulaId: "cost.total2",
      inputMap: { a: "carryingCost", b: "markdownExposure" },
      outputId: "totalExposure",
    },
  ],

  outputs: [
    {
      id: "totalExposure",
      label: "Total inventory risk exposure",
      unit: "$",
      format: "currency",
      isBigNumber: true,
    },
    { id: "turnover", label: "Inventory turnover", unit: "×", format: "score" },
    { id: "carryingCost", label: "Carrying cost", unit: "$", format: "currency" },
    { id: "markdownExposure", label: "Markdown exposure", unit: "$", format: "currency" },
  ],

  thresholds: [
    {
      fieldId: "turnover",
      warning: 3,
      critical: 1,
      direction: "lower_is_bad",
      warningMessage: "Turnover is below healthy band — carrying cost pressure is building.",
      criticalMessage: "Critical slow inventory — markdown and cash tie-up risk is high.",
    },
  ],

  reportTemplate: {
    title: "Retail Inventory Turnover Risk Decision Report",
    sections: [
      "executive_summary",
      "loss_breakdown",
      "thresholds",
      "sensitivity",
      "action_plan",
      "assumptions",
    ],
    exportFormats: ["pdf", "csv"],
  },

  assumptions: {
    hiddenLossMultiplier: 1.06,
    volatilityPercent: 12,
    targetMarginPercent: 25,
    assumptionNotes: [
      "Turnover = annual COGS ÷ average inventory.",
      "Carrying and markdown exposure apply percent to inventory value.",
      "Total exposure sums carrying cost and markdown exposure.",
    ],
  },
};
