import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";

export const WAREHOUSE_SPACE_COST_LEAK_SCHEMA: PremiumCalculatorSchema = {
  id: "ware-502",
  name: "Warehouse Space Cost Leak Calculator",
  sectorSlug: "warehouse",
  category: "cost",
  legacyPaidSlug: "office-cleaning-bid-optimizer",
  painStatement:
    "Warehouse operations lose money when unused space, slow pallets and handling drift are treated as normal overhead.",

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
