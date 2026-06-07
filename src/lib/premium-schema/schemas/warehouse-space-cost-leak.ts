import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";

export const WAREHOUSE_SPACE_COST_LEAK_SCHEMA: PremiumCalculatorSchema = {
  id: "warehouse-space-cost-leak",
  name: "Warehouse Space Cost Leak Analyzer",
  sectorSlug: "warehouse",
  category: "cost",
  legacyPaidSlug: "office-cleaning-bid-optimizer",
  painStatement:
    "Warehouse operations lose money when unused space, slow pallets and handling drift are treated as normal overhead.",

  inputs: [
    {
      id: "monthlyRent",
      label: "Monthly rent",
      type: "number",
      unit: "USD",
      required: true,
      smartDefault: 24000,
      validation: { min: 0 },
      helper: "Monthly facility rent or occupancy cost.",
      expertMeaning: "Rent envelope before utilization split.",
    },
    {
      id: "totalSqm",
      label: "Total floor area",
      type: "number",
      unit: "m²",
      required: true,
      smartDefault: 2400,
      validation: { min: 1 },
      helper: "Total warehouse floor area (reference).",
      expertMeaning: "Capacity denominator for space planning.",
    },
    {
      id: "unusedSpacePercent",
      label: "Unused space",
      type: "number",
      unit: "%",
      required: true,
      smartDefault: 14,
      validation: { min: 0, max: 100 },
      helper: "Unused or under-utilized space as percent of rent.",
      expertMeaning: "Dead space band eating rent.",
    },
    {
      id: "handlingOverrunHours",
      label: "Handling overrun hours",
      type: "number",
      unit: "hours",
      required: true,
      smartDefault: 60,
      validation: { min: 0 },
      helper: "Extra picking and handling hours per month.",
      expertMeaning: "Labor drift from slow pallet flow.",
    },
    {
      id: "hourlyCost",
      label: "Hourly cost",
      type: "number",
      unit: "USD/hour",
      required: true,
      smartDefault: 24,
      validation: { min: 0 },
      helper: "Loaded warehouse labor rate.",
      expertMeaning: "Hourly burden on handling overrun.",
    },
  ],

  formulaPipeline: [
    {
      formulaId: "warehouse.unused_space_cost",
      inputMap: { monthlyRent: "monthlyRent", unusedSpacePercent: "unusedSpacePercent" },
      outputId: "unusedSpaceCost",
    },
    {
      formulaId: "loss.time_cost",
      inputMap: { lossHours: "handlingOverrunHours", hourlyCost: "hourlyCost" },
      outputId: "handlingOverrunCost",
    },
    {
      formulaId: "cost.total2",
      inputMap: { a: "unusedSpaceCost", b: "handlingOverrunCost" },
      outputId: "totalExposure",
    },
  ],

  outputs: [
    {
      id: "totalExposure",
      label: "Total space cost leak",
      unit: "$",
      format: "currency",
      isBigNumber: true,
    },
    { id: "unusedSpaceCost", label: "Unused space cost", unit: "$", format: "currency" },
    { id: "handlingOverrunCost", label: "Handling overrun cost", unit: "$", format: "currency" },
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
