import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";

export const PLUMBING_JOB_MARGIN_VERDICT_SCHEMA: PremiumCalculatorSchema = {
  id: "plumbing-job-margin-verdict",
  name: "Plumbing Job Margin Verdict",
  sectorSlug: "plumbing",
  category: "cost",
  legacyPaidSlug: "plumbing-job-margin-verdict",
  painStatement:
    "Find safe plumbing job price with callback risk, material runs and access difficulty included.",

  inputs: [
    {
      id: "partsCost",
      label: "Parts & Fixture Cost",
      type: "number",
      unit: "currency",
      required: true,
      validation: { min: 0 },
      helper: "Cost of plumbing parts, fixtures and accessories",
      expertMeaning: "Direct material cost including pipes, fittings, valves, fixtures, seals and mounting hardware",
    },
    {
      id: "laborHours",
      label: "Labor Hours",
      type: "number",
      unit: "hours",
      required: true,
      validation: { min: 0 },
      helper: "Estimated installation labor hours",
      expertMeaning: "Installation labor including rough-in, fixture mounting, connection testing and cleanup",
    },
    {
      id: "laborRate",
      label: "Hourly Labor Rate",
      type: "number",
      unit: "currency",
      required: true,
      validation: { min: 0 },
      helper: "Fully loaded hourly rate for plumbing technicians",
      expertMeaning: "Labor rate including wages, burden, license costs and truck overhead",
    },
    {
      id: "fixtureCount",
      label: "Fixture Count",
      type: "number",
      unit: "count",
      required: true,
      validation: { min: 1 },
      helper: "Number of plumbing fixtures to be installed or serviced",
      expertMeaning: "Fixture count affecting material runs, labor duration and potential callback risk",
    },
    {
      id: "materialRunCost",
      label: "Additional Material Run Cost",
      type: "number",
      unit: "currency",
      required: true,
      validation: { min: 0 },
      helper: "Cost of extra supply runs for forgotten or special-order parts",
      expertMeaning: "Cost from additional material runs including trip charges, rush fees and lost productivity",
    },
    {
      id: "callbackRiskPercent",
      label: "Callback Risk (%)",
      type: "number",
      unit: "percent",
      required: true,
      validation: { min: 0, max: 100 },
      helper: "Estimated probability of callback for adjustments or warranty issues",
      expertMeaning: "Historical or estimated callback rate for leaks, fitting issues or code violations",
    },
    {
      id: "targetMargin",
      label: "Target Margin (%)",
      type: "number",
      unit: "percent",
      required: true,
      validation: { min: 0, max: 100 },
      helper: "Minimum margin target for this plumbing job",
      expertMeaning: "Target gross margin used to compute minimum safe plumbing job price",
    },
  ],

  outputs: [
    { id: "minimumSafePrice", label: "Minimum Safe Price", unit: "currency", format: "currency", isBigNumber: true },
    { id: "quoteVerdict", label: "Quote Verdict", unit: "text", format: "number" },
    { id: "p90Cost", label: "P90 Cost Estimate", unit: "currency", format: "currency", isBigNumber: true },
    { id: "baseCost", label: "Base Cost", unit: "currency", format: "currency" },
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
