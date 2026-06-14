import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";

/** P7 nightrun — DeepSeek Chief Engineer schema (factory generated). */
export const AqlKabulOrneklemesiRiskVeMaliyetCalculator_SCHEMA: PremiumCalculatorSchema = {
  id: "aql-kabul-orneklemesi-risk-ve-maliyet-calculator",
  name: "Aql Kabul Orneklemesi Risk Ve Maliyet",
  sectorSlug: "general-industrial",
  category: "cost",
  painStatement: "Acceptance sampling theory (ANSI/ASQ Z1.4) combined with cost accounting",

  inputs: [
    {
      id: "lotSize",
      label: "Lot size",
      type: "number",
      unit: "units",
      required: true,
      smartDefault: 1000,
      validation: { min: 1, max: 1000000 },
      helper: "Must be positive integer",
      expertMeaning: "Lot size",
    },
    {
      id: "aqlLevel",
      label: "AQL level (percent)",
      type: "number",
      unit: "%",
      required: true,
      smartDefault: 1,
      validation: { min: 0.01, max: 10, step: 0.1 },
      helper: "Between 0.01 and 10",
      expertMeaning: "AQL level (percent)",
    },
    {
      id: "inspectionCostPerUnit",
      label: "Inspection cost per unit",
      type: "number",
      unit: "USD",
      required: true,
      smartDefault: 5,
      validation: { min: 0, max: 1000 },
      helper: "Non-negative",
      expertMeaning: "Inspection cost per unit",
    },
    {
      id: "defectCostPerUnit",
      label: "Cost per defective unit",
      type: "number",
      unit: "USD",
      required: true,
      smartDefault: 100,
      validation: { min: 0, max: 100000 },
      helper: "Non-negative",
      expertMeaning: "Cost per defective unit",
    },
    {
      id: "unitCost",
      label: "Unit cost of product",
      type: "number",
      unit: "USD",
      required: true,
      smartDefault: 50,
      validation: { min: 0.01, max: 100000 },
      helper: "Positive",
      expertMeaning: "Unit cost of product",
    }
  ],

  formulaPipeline: [
    {
      formulaId: "cost.total_exposure",
      inputMap: {
        "a": "lotSize",
        "b": "aqlLevel",
        "c": "inspectionCostPerUnit"
      },
      outputId: "totalExposure",
    },
    {
      formulaId: "benchmark.variance_percent",
      inputMap: {
        "actual": "lotSize",
        "target": "aqlLevel"
      },
      outputId: "variancePercent",
    }
  ],

  outputs: [
    {
      id: "totalExposure",
      label: "Sample size",
      unit: "units",
      format: "currency",
      isBigNumber: true,
    },
    {
      id: "variancePercent",
      label: "Total inspection cost",
      unit: "%",
      format: "percentage",
      isBigNumber: false,
    }
  ],

  thresholds: [
    {
      fieldId: "totalExposure",
      warning: 1,
      critical: 3,
      direction: "higher_is_bad",
      warningMessage: "Exposure is entering warning band — review drivers.",
      criticalMessage: "Exposure is critical — immediate operational review required.",
    },
  ],

  reportTemplate: {
    title: "[object Object] Decision Report",
    sections: ["executive_summary", "thresholds", "sensitivity", "action_plan", "assumptions"],
    exportFormats: ["pdf", "csv"],
  },

  assumptions: {
    hiddenLossMultiplier: 1.05,
    volatilityPercent: 8,
    targetMarginPercent: 15,
    assumptionNotes: [
      "Defect rate equals AQL level for exposure calculation",
      "Inspection is 100% effective",
      "Cost per defect includes all downstream costs",
    ],
  },
};
