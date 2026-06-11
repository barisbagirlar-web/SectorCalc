import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";

export const VALUE_STREAM_MAP_VSM_CALCULATOR_SCHEMA: PremiumCalculatorSchema = {
  id: "value-stream-map-vsm-calculator",
  name: "Value Stream Map VSM Calculator",
  sectorSlug: "manufacturing",
  category: "time",
  painStatement:
    "Lead time hides in queues and transport while teams only track processing time.",

  inputs: [
    {
      id: "processMinutes",
      label: "Process time",
      type: "number",
      unit: "minutes",
      required: true,
      smartDefault: 18,
      validation: { min: 0 },
      helper: "Total value-added processing minutes in the stream.",
      expertMeaning: "Touch time across process steps.",
    },
    {
      id: "waitMinutes",
      label: "Wait time",
      type: "number",
      unit: "minutes",
      required: true,
      smartDefault: 240,
      validation: { min: 0 },
      helper: "Queue and inventory wait minutes.",
      expertMeaning: "Non-value wait between process steps.",
    },
    {
      id: "transportMinutes",
      label: "Transport time",
      type: "number",
      unit: "minutes",
      required: true,
      smartDefault: 45,
      validation: { min: 0 },
      helper: "Material movement and transfer minutes.",
      expertMeaning: "Logistics time inside the value stream.",
    },
  ],

  formulaPipeline: [
    {
      formulaId: "time.vsm_total_lead_time",
      inputMap: {
        processMinutes: "processMinutes",
        waitMinutes: "waitMinutes",
        transportMinutes: "transportMinutes",
      },
      outputId: "totalLeadMinutes",
    },
    {
      formulaId: "benchmark.value_added_percent",
      inputMap: {
        valueAddedMinutes: "processMinutes",
        totalLeadMinutes: "totalLeadMinutes",
      },
      outputId: "valueAddedPercent",
    },
  ],

  outputs: [
    {
      id: "totalLeadMinutes",
      label: "Total lead time",
      unit: "minutes",
      format: "number",
      isBigNumber: true,
    },
    {
      id: "valueAddedPercent",
      label: "Value-added ratio",
      unit: "%",
      format: "percentage",
    },
  ],

  thresholds: [
    {
      fieldId: "valueAddedPercent",
      warning: 15,
      critical: 5,
      direction: "lower_is_bad",
      warningMessage: "Value-added ratio is low — prioritize queue and transport waste.",
      criticalMessage: "Value-added ratio is critically low — run kaizen on wait and transport steps.",
    },
  ],

  reportTemplate: {
    title: "Value Stream Lead Time Decision Report",
    sections: ["executive_summary", "thresholds", "sensitivity", "action_plan"],
    exportFormats: ["pdf", "csv"],
  },

  assumptions: {
    hiddenLossMultiplier: 1,
    volatilityPercent: 5,
    targetMarginPercent: 0,
    assumptionNotes: [
      "Total lead time = process + wait + transport minutes.",
      "Value-added % = process time ÷ total lead time × 100.",
      "Classic VSM screening — does not replace detailed cycle-time studies.",
    ],
  },
};
