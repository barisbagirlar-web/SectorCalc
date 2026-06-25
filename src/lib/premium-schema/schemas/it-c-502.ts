import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";

export const RETURN_PROFIT_EROSION_TOOL_SCHEMA: PremiumCalculatorSchema = {
  id: "it-c-502",
  name: "Return Profit Erosion Tool",
  sectorSlug: "it-cloud",
  category: "cost",
  legacyPaidSlug: "return-profit-erosion-tool",
  painStatement:
    "Measure net profit after returns, shipping, payment fees and ad cost per sale.",

  inputs: [
    {
      id: "monthlyApiCalls",
      label: "Monthly API calls",
      type: "number",
      unit: "count",
      required: true,
      smartDefault: 2500000,
      validation: { min: 0 },
      helper: "Please enter a valid value.",
      expertMeaning: "Parameter value complies with industrial calculation standards.",
    },
    {
      id: "costPerThousandCalls",
      label: "Cost per 1k calls",
      type: "number",
      unit: "USD",
      required: true,
      smartDefault: 0.18,
      validation: { min: 0 },
      helper: "Please enter a valid value.",
      expertMeaning: "Parameter value complies with industrial calculation standards.",
    },
    {
      id: "monthlyRevenue",
      label: "Monthly revenue",
      type: "number",
      unit: "USD",
      required: true,
      smartDefault: 12000,
      validation: { min: 0 },
      helper: "Please enter a valid value.",
      expertMeaning: "Parameter value complies with industrial calculation standards.",
    },
    {
      id: "computeCost",
      label: "Compute cost",
      type: "number",
      unit: "USD",
      required: true,
      smartDefault: 1800,
      validation: { min: 0 },
      helper: "Please enter a valid value.",
      expertMeaning: "Parameter value complies with industrial calculation standards.",
    },
    {
      id: "storageCost",
      label: "Storage cost",
      type: "number",
      unit: "USD",
      required: true,
      smartDefault: 420,
      validation: { min: 0 },
      helper: "Please enter a valid value.",
      expertMeaning: "Parameter value complies with industrial calculation standards.",
    },
  ],

  formulaPipeline: [
    {
      formulaId: "cloud.api_call_cost",
      inputMap: {
        monthlyApiCalls: "monthlyApiCalls",
        costPerThousandCalls: "costPerThousandCalls",
      },
      outputId: "apiCallCost",
    },
    {
      formulaId: "cost.total_exposure",
      inputMap: {
        a: "apiCallCost",
        b: "computeCost",
        c: "storageCost",
      },
      outputId: "totalCloudCost",
    },
    {
      formulaId: "cost.margin_pressure",
      inputMap: {
        excessCost: "totalCloudCost",
        monthlyRevenue: "monthlyRevenue",
      },
      outputId: "revenuePressure",
    },
  ],

  outputs: [
    {
      id: "totalCloudCost",
      label: "Total cloud cost",
      unit: "USD",
      format: "currency",
      isBigNumber: true,
    },
    {
      id: "apiCallCost",
      label: "API call cost",
      unit: "USD",
      format: "currency",
    },
    {
      id: "revenuePressure",
      label: "Revenue pressure",
      unit: "%",
      format: "percentage",
    },
  ],

  thresholds: [
    {
      fieldId: "revenuePressure",
      warning: 15,
      critical: 30,
      direction: "higher_is_bad",
      warningMessage:
        "Cloud stack is consuming a rising share of revenue — review API unit economics.",
      criticalMessage:
        "Critical cost pressure — scale may be eroding product margin faster than revenue grows.",
    },
  ],

  reportTemplate: {
    title: "Cloud API Cost Overrun Decision Report",
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
    hiddenLossMultiplier: 1.06,
    volatilityPercent: 22,
    targetMarginPercent: 20,
    assumptionNotes: [
      "API call cost = monthly calls ÷ 1000 × cost per thousand.",
      "Total cloud cost sums API, compute and storage spend.",
      "Revenue pressure = total cloud cost ÷ monthly revenue.",
    ],
  },
};
