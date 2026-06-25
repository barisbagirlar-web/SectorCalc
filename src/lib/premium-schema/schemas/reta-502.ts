import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";

export const RETAIL_INVENTORY_TURNOVER_RISK_SCHEMA: PremiumCalculatorSchema = {
  id: "reta-502",
  name: "Retail Inventory Turnover Risk Calculator",
  sectorSlug: "retail",
  category: "benchmark",
  legacyPaidSlug: "water-optimization-verdict",
  painStatement:
    "Retailers lose cash when slow inventory, markdowns and carrying cost are not measured together.",

  inputs: [
    {
      id: "averageInventory",
      label: "Average inventory",
      type: "number",
      unit: "USD",
      required: true,
      smartDefault: 42000,
      validation: { min: 0 },
      helper: "Please enter a valid value.",
      expertMeaning: "Parameter value complies with industrial calculation standards.",
    },
    {
      id: "annualCOGS",
      label: "Annual COGS",
      type: "number",
      unit: "USD",
      required: true,
      smartDefault: 180000,
      validation: { min: 0 },
      helper: "Please enter a valid value.",
      expertMeaning: "Parameter value complies with industrial calculation standards.",
    },
    {
      id: "carryingCostPercent",
      label: "Carrying cost",
      type: "number",
      unit: "%",
      required: true,
      smartDefault: 18,
      validation: { min: 0, max: 100 },
      helper: "Please enter a valid value.",
      expertMeaning: "Parameter value complies with industrial calculation standards.",
    },
    {
      id: "markdownPercent",
      label: "Markdown",
      type: "number",
      unit: "%",
      required: true,
      smartDefault: 12,
      validation: { min: 0, max: 100 },
      helper: "Please enter a valid value.",
      expertMeaning: "Parameter value complies with industrial calculation standards.",
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
