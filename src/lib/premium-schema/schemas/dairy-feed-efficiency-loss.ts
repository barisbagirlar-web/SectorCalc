import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";

export const DAIRY_FEED_EFFICIENCY_LOSS_SCHEMA: PremiumCalculatorSchema = {
  id: "dairy-feed-efficiency-loss",
  name: "Dairy Feed Efficiency Loss Analyzer",
  sectorSlug: "dairy",
  category: "benchmark",
  legacyPaidSlug: "feed-efficiency-analyzer",
  painStatement:
    "Dairy farms lose margin when feed cost rises faster than milk yield.",

  inputs: [
    {
      id: "cows",
      label: "Cows",
      type: "number",
      unit: "count",
      required: true,
      smartDefault: 80,
      validation: { min: 1 },
      helper: "Milking herd size for the period.",
      expertMeaning: "Head count multiplier for feed and yield.",
    },
    {
      id: "feedCostPerCowPerDay",
      label: "Feed cost per cow per day",
      type: "number",
      unit: "USD",
      required: true,
      smartDefault: 6.5,
      validation: { min: 0 },
      helper: "Average daily feed spend per cow.",
      expertMeaning: "Feed envelope before yield comparison.",
    },
    {
      id: "milkLitersPerCowPerDay",
      label: "Milk liters per cow per day",
      type: "number",
      unit: "liters",
      required: true,
      smartDefault: 24,
      validation: { min: 0 },
      helper: "Observed milk yield per cow per day.",
      expertMeaning: "Actual production band for the herd.",
    },
    {
      id: "targetMilkLitersPerCowPerDay",
      label: "Target milk liters per cow per day",
      type: "number",
      unit: "liters",
      required: true,
      smartDefault: 28,
      validation: { min: 0 },
      helper: "Target or benchmark yield per cow per day.",
      expertMeaning: "Best-period or herd target for comparison.",
    },
    {
      id: "milkPricePerLiter",
      label: "Milk price per liter",
      type: "number",
      unit: "USD",
      required: true,
      smartDefault: 0.42,
      validation: { min: 0 },
      helper: "Net milk price received per liter.",
      expertMeaning: "Revenue rate applied to yield gap.",
    },
    {
      id: "days",
      label: "Days",
      type: "number",
      unit: "count",
      required: true,
      smartDefault: 30,
      validation: { min: 1 },
      helper: "Analysis period in days.",
      expertMeaning: "Time horizon for feed and yield stack.",
    },
  ],

  formulaPipeline: [
    {
      formulaId: "agriculture.feed_monthly_cost",
      inputMap: { cows: "cows", feedCostPerCowPerDay: "feedCostPerCowPerDay", days: "days" },
      outputId: "feedCost",
    },
    {
      formulaId: "agriculture.milk_yield_gap_revenue",
      inputMap: {
        cows: "cows",
        milkLitersPerCowPerDay: "milkLitersPerCowPerDay",
        targetMilkLitersPerCowPerDay: "targetMilkLitersPerCowPerDay",
        milkPricePerLiter: "milkPricePerLiter",
        days: "days",
      },
      outputId: "milkRevenueGap",
    },
    {
      formulaId: "cost.total2",
      inputMap: { a: "feedCost", b: "milkRevenueGap" },
      outputId: "totalExposure",
    },
  ],

  outputs: [
    {
      id: "totalExposure",
      label: "Total feed efficiency exposure",
      unit: "$",
      format: "currency",
      isBigNumber: true,
    },
    { id: "feedCost", label: "Feed cost", unit: "$", format: "currency" },
    { id: "milkRevenueGap", label: "Milk revenue gap", unit: "$", format: "currency" },
  ],

  thresholds: [
    {
      fieldId: "milkLitersPerCowPerDay",
      warning: 22,
      critical: 18,
      direction: "lower_is_bad",
      warningMessage: "Milk yield is below target band — feed efficiency pressure is building.",
      criticalMessage: "Critical yield gap — feed cost may exceed milk revenue recovery.",
    },
  ],

  reportTemplate: {
    title: "Dairy Feed Efficiency Loss Decision Report",
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
    hiddenLossMultiplier: 1.07,
    volatilityPercent: 18,
    targetMarginPercent: 12,
    assumptionNotes: [
      "Feed cost = cows × daily feed × days.",
      "Milk revenue gap = yield shortfall × price × days × herd size.",
      "Total exposure combines feed spend and unrealized milk revenue.",
    ],
  },
};
