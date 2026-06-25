import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";

export const DAIRY_PROFIT_DETECTOR_SCHEMA: PremiumCalculatorSchema = {
  id: "dair-502",
  name: "Dairy Profit Detector",
  sectorSlug: "dairy",
  category: "benchmark",
  legacyPaidSlug: "dairy-profit-detector",
  painStatement:
    "Detect dairy profit leaks with full cost stack verdict.",

  inputs: [
    {
      id: "cows",
      label: "Cows",
      type: "number",
      unit: "count",
      required: true,
      smartDefault: 80,
      validation: { min: 1 },
      helper: "Please enter a valid value.",
      expertMeaning: "Parameter value complies with industrial calculation standards.",
    },
    {
      id: "feedCostPerCowPerDay",
      label: "Feed cost per cow per day",
      type: "number",
      unit: "USD",
      required: true,
      smartDefault: 6.5,
      validation: { min: 0 },
      helper: "Please enter a valid value.",
      expertMeaning: "Parameter value complies with industrial calculation standards.",
    },
    {
      id: "milkLitersPerCowPerDay",
      label: "Milk liters per cow per day",
      type: "number",
      unit: "L",
      required: true,
      smartDefault: 24,
      validation: { min: 0 },
      helper: "Please enter a valid value.",
      expertMeaning: "Parameter value complies with industrial calculation standards.",
    },
    {
      id: "targetMilkLitersPerCowPerDay",
      label: "Target milk liters per cow per day",
      type: "number",
      unit: "L",
      required: true,
      smartDefault: 28,
      validation: { min: 0 },
      helper: "Please enter a valid value.",
      expertMeaning: "Parameter value complies with industrial calculation standards.",
    },
    {
      id: "milkPricePerLiter",
      label: "Milk price per liter",
      type: "number",
      unit: "USD",
      required: true,
      smartDefault: 0.42,
      validation: { min: 0 },
      helper: "Please enter a valid value.",
      expertMeaning: "Parameter value complies with industrial calculation standards.",
    },
    {
      id: "days",
      label: "Days",
      type: "number",
      unit: "count",
      required: true,
      smartDefault: 30,
      validation: { min: 1 },
      helper: "Please enter a valid value.",
      expertMeaning: "Parameter value complies with industrial calculation standards.",
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
      unit: "USD",
      format: "currency",
      isBigNumber: true,
    },
    { id: "feedCost", label: "Feed cost", unit: "USD", format: "currency" },
    { id: "milkRevenueGap", label: "Milk revenue gap", unit: "USD", format: "currency" },
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
