import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";

export const PLUMBING_LEAK_CALLBACK_COST_SCHEMA: PremiumCalculatorSchema = {
  id: "plumbing-leak-callback-cost",
  name: "Plumbing Leak Callback Cost Analyzer",
  sectorSlug: "plumbing",
  category: "cost",
  legacyPaidSlug: "plumbing-job-margin-verdict",
  painStatement:
    "Plumbing jobs lose margin when leak callback, material runs and warranty visits are not priced.",

  inputs: [
    {
      id: "jobRevenue",
      label: "Job revenue",
      type: "number",
      unit: "USD",
      required: true,
      smartDefault: 12500,
      validation: { min: 0 },
      helper: "Fixed-price or contract revenue for the job.",
      expertMeaning: "Revenue base for warranty reserve.",
    },
    {
      id: "callbackVisits",
      label: "Callback visits",
      type: "number",
      unit: "count",
      required: true,
      smartDefault: 3,
      validation: { min: 0 },
      helper: "Expected leak or warranty return visits.",
      expertMeaning: "Return trip frequency on similar jobs.",
    },
    {
      id: "visitCost",
      label: "Visit cost",
      type: "number",
      unit: "USD",
      required: true,
      smartDefault: 220,
      validation: { min: 0 },
      helper: "Average cost per callback visit.",
      expertMeaning: "Loaded cost per return trip.",
    },
    {
      id: "materialRunCost",
      label: "Material run cost",
      type: "number",
      unit: "USD",
      required: true,
      smartDefault: 850,
      validation: { min: 0 },
      helper: "Extra fittings, pipe and supply runs.",
      expertMeaning: "Material overruns not in the bid.",
    },
    {
      id: "warrantyReservePercent",
      label: "Warranty reserve",
      type: "number",
      unit: "%",
      required: true,
      smartDefault: 4,
      validation: { min: 0, max: 100 },
      helper: "Warranty reserve as percent of job revenue.",
      expertMeaning: "Expected warranty callback envelope.",
    },
  ],

  formulaPipeline: [
    {
      formulaId: "cost.count_cost",
      inputMap: { count: "callbackVisits", costEach: "visitCost" },
      outputId: "callbackCost",
    },
    {
      formulaId: "cost.percent_of_amount",
      inputMap: { amount: "jobRevenue", percent: "warrantyReservePercent" },
      outputId: "warrantyReserve",
    },
    {
      formulaId: "cost.total_exposure",
      inputMap: { a: "callbackCost", b: "materialRunCost", c: "warrantyReserve" },
      outputId: "totalExposure",
    },
  ],

  outputs: [
    {
      id: "totalExposure",
      label: "Total callback exposure",
      unit: "$",
      format: "currency",
      isBigNumber: true,
    },
    { id: "callbackCost", label: "Callback cost", unit: "$", format: "currency" },
    { id: "warrantyReserve", label: "Warranty reserve", unit: "$", format: "currency" },
  ],

  thresholds: [
    {
      fieldId: "callbackVisits",
      warning: 2,
      critical: 5,
      direction: "higher_is_bad",
      warningMessage: "Callback visits are elevated — verify leak risk and warranty terms.",
      criticalMessage: "Critical callback count — reprice fixed-price plumbing work.",
    },
    {
      fieldId: "warrantyReservePercent",
      warning: 3,
      critical: 8,
      direction: "higher_is_bad",
      warningMessage: "Warranty reserve is above typical band.",
      criticalMessage: "Critical warranty exposure — margin may not cover return visits.",
    },
  ],

  reportTemplate: {
    title: "Plumbing Leak Callback Cost Decision Report",
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
    hiddenLossMultiplier: 1.08,
    volatilityPercent: 12,
    targetMarginPercent: 25,
    assumptionNotes: [
      "Callback cost = visits × cost per visit.",
      "Warranty reserve = job revenue × warranty percent.",
      "Total exposure sums callbacks, material runs and warranty reserve.",
    ],
  },
};
