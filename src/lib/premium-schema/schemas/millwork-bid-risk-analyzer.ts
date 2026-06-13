import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";

export const MILLWORK_BID_RISK_ANALYZER_SCHEMA: PremiumCalculatorSchema = {
  id: "millwork-bid-risk-analyzer",
  name: "Millwork Bid Risk Analyzer",
  sectorSlug: "textile",
  category: "scrap",
  legacyPaidSlug: "millwork-bid-risk-analyzer",
  painStatement:
    "Find minimum millwork bid with WWPA waste, finishing, install and schedule delay risk included.",

  inputs: [
    {
      id: "fabricCost",
      label: "Fabric cost",
      type: "number",
      unit: "USD",
      required: true,
      smartDefault: 22000,
      validation: { min: 0 },
      helper: "Fabric purchase spend for the production run or month.",
      expertMeaning: "Material envelope before waste adjustments.",
    },
    {
      id: "cuttingWastePercent",
      label: "Cutting waste",
      type: "number",
      unit: "%",
      required: true,
      smartDefault: 6,
      validation: { min: 0, max: 100 },
      helper: "Cutting and offcut loss as percent of fabric cost.",
      expertMeaning: "Observed cutting waste versus purchased fabric.",
    },
    {
      id: "targetWastePercent",
      label: "Target waste",
      type: "number",
      unit: "%",
      required: true,
      smartDefault: 3,
      validation: { min: 0, max: 100 },
      helper: "Acceptable waste target for similar production.",
      expertMeaning: "Best-period nesting or cutting target.",
    },
    {
      id: "shrinkagePercent",
      label: "Shrinkage",
      type: "number",
      unit: "%",
      required: true,
      smartDefault: 4,
      validation: { min: 0, max: 100 },
      helper: "Shrinkage loss after wash or finish.",
      expertMeaning: "Fabric yield loss from shrinkage band.",
    },
    {
      id: "dyeReworkCost",
      label: "Dye rework cost",
      type: "number",
      unit: "USD",
      required: true,
      smartDefault: 1500,
      validation: { min: 0 },
      helper: "Dye batch rework and shade correction spend.",
      expertMeaning: "Color rework not recovered in base pricing.",
    },
  ],

  formulaPipeline: [
    {
      formulaId: "loss.excess_waste_cost",
      inputMap: {
        monthlyIngredientCost: "fabricCost",
        wasteRate: "cuttingWastePercent",
        targetWasteRate: "targetWastePercent",
      },
      outputId: "excessCuttingWaste",
    },
    {
      formulaId: "loss.waste_exposure",
      inputMap: { monthlyIngredientCost: "fabricCost", wasteRate: "shrinkagePercent" },
      outputId: "shrinkageCost",
    },
    {
      formulaId: "cost.total_exposure",
      inputMap: { a: "excessCuttingWaste", b: "shrinkageCost", c: "dyeReworkCost" },
      outputId: "totalExposure",
    },
  ],

  outputs: [
    {
      id: "totalExposure",
      label: "Total fabric waste exposure",
      unit: "$",
      format: "currency",
      isBigNumber: true,
    },
    { id: "excessCuttingWaste", label: "Excess cutting waste", unit: "$", format: "currency" },
    { id: "shrinkageCost", label: "Shrinkage cost", unit: "$", format: "currency" },
    { id: "dyeReworkCost", label: "Dye rework cost", unit: "$", format: "currency" },
  ],

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
