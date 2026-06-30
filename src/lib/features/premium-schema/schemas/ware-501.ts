import type { PremiumCalculatorSchema } from "@/lib/features/premium-schema/premium-calculator-schema";

export const OFFICE_CLEANING_BID_OPTIMIZER_SCHEMA: PremiumCalculatorSchema = {
  id: "ware-501",
  name: "Office Cleaning Bid Optimizer",
  sectorSlug: "warehouse",
  category: "cost",
  legacyPaidSlug: "office-cleaning-bid-optimizer",
  painStatement:
    "Find minimum monthly bid with labor, supplies, visit frequency and target margin for office cleaning contracts.",

  inputs: [],

  outputs: [],

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
