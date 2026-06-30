import type { PremiumCalculatorSchema } from "@/lib/features/premium-schema/premium-calculator-schema";

export const TEXTILE_FABRIC_WASTE_RISK_SCHEMA: PremiumCalculatorSchema = {
  id: "textile-fabric-waste-risk",
  name: "Textile Fabric Waste Risk Calculator",
  sectorSlug: "textile",
  category: "scrap",
  legacyPaidSlug: "millwork-bid-risk-analyzer",
  painStatement:
    "Textile production loses margin through cutting waste, shrinkage, dye loss and fabric consumption drift.",

  inputs: [],

  outputs: [],

  thresholds: [
    {
      fieldId: "cuttingWastePercent",
      warning: 5,
      critical: 9,
      direction: "higher_is_bad",
      warningMessage: "Cutting waste is above target — verify nesting and marker efficiency.",
      criticalMessage: "Critical cutting waste — reprice before scaling similar production.",
    },
    {
      fieldId: "shrinkagePercent",
      warning: 3,
      critical: 7,
      direction: "higher_is_bad",
      warningMessage: "Shrinkage band is elevated — check fabric spec and finish process.",
      criticalMessage: "Shrinkage exposure is critical — yield assumptions may be wrong.",
    },
  ],

  reportTemplate: {
    title: "Textile Fabric Waste Risk Decision Report",
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
    volatilityPercent: 14,
    targetMarginPercent: 16,
    assumptionNotes: [
      "Excess cutting waste = max(cutting waste − target, 0) on fabric cost.",
      "Shrinkage cost applies shrinkage percent to fabric spend.",
      "Total exposure sums excess cutting, shrinkage and dye rework.",
    ],
  },
};
