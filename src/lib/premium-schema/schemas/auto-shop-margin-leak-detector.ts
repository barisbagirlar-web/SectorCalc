import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";

export const AUTO_SHOP_MARGIN_LEAK_DETECTOR_SCHEMA: PremiumCalculatorSchema = {
  id: "auto-shop-margin-leak-detector",
  name: "Auto Shop Margin Leak Detector",
  sectorSlug: "auto-repair",
  category: "cost",
  legacyPaidSlug: "auto-shop-margin-leak-detector",
  painStatement:
    "Calculate true repair job profit with diagnostic time, parts markup, shop supplies and comeback risk.",

  inputs: [
    {
      id: "monthlyRepairRevenue",
      label: "Monthly repair revenue",
      type: "number",
      unit: "USD",
      required: true,
      smartDefault: 52000,
      validation: { min: 0 },
      helper: "Total shop revenue for the period.",
      expertMeaning: "Revenue base for comeback percent calculation.",
    },
    {
      id: "comebackRatePercent",
      label: "Comeback rate",
      type: "number",
      unit: "%",
      required: true,
      smartDefault: 5,
      validation: { min: 0, max: 100 },
      helper: "Comeback jobs as percent of revenue.",
      expertMeaning: "Historical comeback frequency band.",
    },
    {
      id: "averageJobCost",
      label: "Average job cost",
      type: "number",
      unit: "USD",
      required: true,
      smartDefault: 280,
      validation: { min: 0 },
      helper: "Average internal cost per comeback job.",
      expertMeaning: "Reference cost per return visit (informational).",
    },
    {
      id: "diagnosticHours",
      label: "Diagnostic hours",
      type: "number",
      unit: "hours",
      required: true,
      smartDefault: 38,
      validation: { min: 0 },
      helper: "Unbilled diagnostic labor hours per month.",
      expertMeaning: "Flat-rate diagnostic leakage.",
    },
    {
      id: "laborRate",
      label: "Labor rate",
      type: "number",
      unit: "USD/hour",
      required: true,
      smartDefault: 65,
      validation: { min: 0 },
      helper: "Fully loaded technician rate.",
      expertMeaning: "Hourly burden on diagnostic time.",
    },
    {
      id: "partsHandlingCost",
      label: "Parts handling cost",
      type: "number",
      unit: "USD",
      required: true,
      smartDefault: 900,
      validation: { min: 0 },
      helper: "Core handling, returns and parts admin spend.",
      expertMeaning: "Parts overhead not in flat-rate pricing.",
    },
  ],

  formulaPipeline: [
    {
      formulaId: "cost.percent_of_amount",
      inputMap: { amount: "monthlyRepairRevenue", percent: "comebackRatePercent" },
      outputId: "comebackCost",
    },
    {
      formulaId: "time.rework_cost",
      inputMap: { reworkHours: "diagnosticHours", laborRate: "laborRate" },
      outputId: "diagnosticLeak",
    },
    {
      formulaId: "cost.total_exposure",
      inputMap: { a: "comebackCost", b: "diagnosticLeak", c: "partsHandlingCost" },
      outputId: "totalExposure",
    },
  ],

  outputs: [
    {
      id: "totalExposure",
      label: "Total comeback exposure",
      unit: "$",
      format: "currency",
      isBigNumber: true,
    },
    { id: "comebackCost", label: "Comeback cost", unit: "$", format: "currency" },
    { id: "diagnosticLeak", label: "Diagnostic leak", unit: "$", format: "currency" },
    { id: "partsHandlingCost", label: "Parts handling cost", unit: "$", format: "currency" },
  ],

  thresholds: [
    {
      fieldId: "comebackRatePercent",
      warning: 4,
      critical: 8,
      direction: "higher_is_bad",
      warningMessage: "Comeback rate is elevated — verify diagnostic and QC assumptions.",
      criticalMessage: "Critical comeback band — reprice flat-rate work before scaling.",
    },
  ],

  reportTemplate: {
    title: "Auto Repair Comeback Cost Decision Report",
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
    hiddenLossMultiplier: 1.09,
    volatilityPercent: 13,
    targetMarginPercent: 22,
    assumptionNotes: [
      "Comeback cost = monthly revenue × comeback rate.",
      "Diagnostic leak = unbilled diagnostic hours × labor rate.",
      "Total exposure sums comeback, diagnostic and parts handling.",
    ],
  },
};
