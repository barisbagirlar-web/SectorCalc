import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";

export const RETURN_PROFIT_EROSION_TOOL_SCHEMA: PremiumCalculatorSchema = {
  id: "return-profit-erosion-tool",
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
      unit: "calls",
      required: true,
      smartDefault: 2500000,
      validation: { min: 0 },
      helper: "Total API requests billed in the period.",
      expertMeaning: "Call volume driving variable cloud cost.",
    },
    {
      id: "costPerThousandCalls",
      label: "Cost per 1k calls",
      type: "number",
      unit: "USD",
      required: true,
      smartDefault: 0.18,
      validation: { min: 0 },
      helper: "Blended cost per thousand API calls.",
      expertMeaning: "Unit economics for API variable cost.",
    },
    {
      id: "monthlyRevenue",
      label: "Monthly revenue",
      type: "number",
      unit: "USD",
      required: true,
      smartDefault: 12000,
      validation: { min: 0 },
      helper: "Product revenue for the same period.",
      expertMeaning: "Top-line revenue for unit economics pressure.",
    },
    {
      id: "computeCost",
      label: "Compute cost",
      type: "number",
      unit: "USD",
      required: true,
      smartDefault: 1800,
      validation: { min: 0 },
      helper: "Monthly compute and server spend.",
      expertMeaning: "Fixed and burstable compute stack.",
    },
    {
      id: "storageCost",
      label: "Storage cost",
      type: "number",
      unit: "USD",
      required: true,
      smartDefault: 420,
      validation: { min: 0 },
      helper: "Monthly storage and egress spend.",
      expertMeaning: "Object storage and data transfer cost.",
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
      unit: "$",
      format: "currency",
      isBigNumber: true,
    },
    {
      id: "apiCallCost",
      label: "API call cost",
      unit: "$",
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
