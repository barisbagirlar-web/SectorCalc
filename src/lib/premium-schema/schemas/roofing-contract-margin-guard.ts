import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";

export const ROOFING_CONTRACT_MARGIN_GUARD_SCHEMA: PremiumCalculatorSchema = {
  id: "roofing-contract-margin-guard",
  name: "Roofing Contract Margin Guard",
  sectorSlug: "construction",
  category: "cost",
  legacyPaidSlug: "roofing-contract-margin-guard",
  painStatement:
    "Find minimum roofing bid with tear-off, dump fees, warranty reserve and weather delay risk included.",

  inputs: [
    {
      id: "contractValue",
      label: "Contract value",
      type: "number",
      unit: "USD",
      required: true,
      smartDefault: 185000,
      validation: { min: 0 },
      helper: "Total contract or project revenue.",
      expertMeaning: "Top-line value for margin pressure calculation.",
    },
    {
      id: "plannedSubcontractorCost",
      label: "Planned subcontractor cost",
      type: "number",
      unit: "USD",
      required: true,
      smartDefault: 72000,
      validation: { min: 0 },
      helper: "Budgeted subcontractor spend.",
      expertMeaning: "Baseline sub cost envelope before variance.",
    },
    {
      id: "actualSubcontractorCost",
      label: "Actual subcontractor cost",
      type: "number",
      unit: "USD",
      required: true,
      smartDefault: 81500,
      validation: { min: 0 },
      helper: "Actual or projected subcontractor spend.",
      expertMeaning: "Observed sub cost including change orders.",
    },
    {
      id: "delayCost",
      label: "Delay cost",
      type: "number",
      unit: "USD",
      required: true,
      smartDefault: 6500,
      validation: { min: 0 },
      helper: "Schedule slip and delay claim exposure.",
      expertMeaning: "Cost of subcontractor-related schedule drift.",
    },
    {
      id: "materialVariance",
      label: "Material variance",
      type: "number",
      unit: "USD",
      required: true,
      smartDefault: 4200,
      validation: { min: 0 },
      helper: "Material cost drift above plan.",
      expertMeaning: "Unplanned material spend on subcontracted scope.",
    },
  ],

  formulaPipeline: [
    {
      formulaId: "cost.variance",
      inputMap: {
        actual: "actualSubcontractorCost",
        planned: "plannedSubcontractorCost",
      },
      outputId: "subcontractorVariance",
    },
    {
      formulaId: "cost.total_exposure",
      inputMap: {
        a: "subcontractorVariance",
        b: "delayCost",
        c: "materialVariance",
      },
      outputId: "totalExposure",
    },
    {
      formulaId: "cost.margin_pressure",
      inputMap: {
        excessCost: "totalExposure",
        monthlyRevenue: "contractValue",
      },
      outputId: "marginPressure",
    },
  ],

  outputs: [
    {
      id: "totalExposure",
      label: "Total subcontractor leak",
      unit: "$",
      format: "currency",
      isBigNumber: true,
    },
    {
      id: "subcontractorVariance",
      label: "Subcontractor variance",
      unit: "$",
      format: "currency",
    },
    {
      id: "marginPressure",
      label: "Margin pressure",
      unit: "%",
      format: "percentage",
    },
  ],

  thresholds: [
    {
      fieldId: "marginPressure",
      warning: 3,
      critical: 7,
      direction: "higher_is_bad",
      warningMessage:
        "Subcontractor leak is pressuring project margin — audit change orders and delay claims.",
      criticalMessage:
        "Critical margin leak — renegotiate subs or reprice before accepting similar contract scope.",
    },
  ],

  reportTemplate: {
    title: "Subcontractor Margin Leak Decision Report",
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
    hiddenLossMultiplier: 1.1,
    volatilityPercent: 18,
    targetMarginPercent: 12,
    assumptionNotes: [
      "Subcontractor variance = max(actual − planned, 0).",
      "Total exposure sums variance, delay cost and material variance.",
      "Margin pressure = total exposure ÷ contract value.",
    ],
  },
};
