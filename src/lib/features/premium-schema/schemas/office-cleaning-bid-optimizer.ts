import type { PremiumCalculatorSchema } from "@/lib/features/premium-schema/premium-calculator-schema";

export const OFFICE_CLEANING_BID_OPTIMIZER_SCHEMA: PremiumCalculatorSchema = {
  id: "office-cleaning-bid-optimizer",
  name: "Office Cleaning Bid Optimizer",
  sectorSlug: "warehouse",
  category: "cost",
  legacyPaidSlug: "office-cleaning-bid-optimizer",
  painStatement:
    "Find minimum monthly bid with labor, supplies, visit frequency and target margin for office cleaning contracts.",

  inputs: [
    {
      id: "areaSize",
      label: "Office Area Size",
      type: "number",
      unit: "square_meters",
      required: true,
      validation: { min: 1 },
      helper: "Total square meters of office space to be cleaned",
      expertMeaning: "Cleaning area used to estimate labor hours and supply consumption per visit",
    },
    {
      id: "laborRate",
      label: "Hourly Labor Rate",
      type: "number",
      unit: "currency",
      required: true,
      validation: { min: 0 },
      helper: "Hourly wage for cleaning staff including payroll burden",
      expertMeaning: "Fully loaded labor rate including payroll taxes, insurance and benefits",
    },
    {
      id: "hoursPerVisit",
      label: "Hours per Visit",
      type: "number",
      unit: "hours",
      required: true,
      validation: { min: 0.25 },
      helper: "Estimated cleaning hours per service visit",
      expertMeaning: "Direct labor hours per cleaning shift before travel and setup",
    },
    {
      id: "supplyCost",
      label: "Monthly Supply Cost",
      type: "number",
      unit: "currency",
      required: true,
      validation: { min: 0 },
      helper: "Monthly cost for cleaning chemicals, paper goods and consumables",
      expertMeaning: "Consumable supply cost including janitorial chemicals, paper products and PPE",
    },
    {
      id: "visitFrequency",
      label: "Visits per Month",
      type: "number",
      unit: "count",
      required: true,
      validation: { min: 1 },
      helper: "Number of cleaning visits per month (e.g. 4 for weekly)",
      expertMeaning: "Service frequency determines monthly labor hours and supply consumption rate",
    },
    {
      id: "targetMargin",
      label: "Target Margin (%)",
      type: "number",
      unit: "percent",
      required: true,
      validation: { min: 0, max: 100 },
      helper: "Minimum profit margin target for this contract",
      expertMeaning: "Gross margin target used to compute minimum safe monthly bid price",
    },
  ],

  outputs: [
    { id: "minimumSafePrice", label: "Minimum Safe Price", unit: "currency", format: "currency", isBigNumber: true },
    { id: "quoteVerdict", label: "Quote Verdict", unit: "text", format: "number" },
    { id: "p90Cost", label: "P90 Cost Estimate", unit: "currency", format: "currency", isBigNumber: true },
    { id: "suggestedAction", label: "Suggested Action", unit: "text", format: "number" },
  ],

  thresholds: [
    {
      fieldId: "unusedSpacePercent",
      warning: 10,
      critical: 20,
      direction: "higher_is_bad",
      warningMessage: "Unused space is above typical band — rent leak is building.",
      criticalMessage: "Critical unused space — expand utilization before adding capacity.",
    },
  ],

  reportTemplate: {
    title: "Warehouse Space Cost Leak Decision Report",
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
    hiddenLossMultiplier: 1.05,
    volatilityPercent: 10,
    targetMarginPercent: 15,
    assumptionNotes: [
      "Unused space cost = monthly rent × unused space percent.",
      "Handling overrun = extra hours × hourly cost.",
      "Total exposure sums space leak and handling drift.",
    ],
  },
};
