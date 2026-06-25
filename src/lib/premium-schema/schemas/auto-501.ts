import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";

export const AUTO_REPAIR_COMEBACK_COST_SCHEMA: PremiumCalculatorSchema = {
  id: "auto-501",
  name: "Auto Repair Comeback Cost Calculator",
  sectorSlug: "auto-repair",
  category: "cost",
  legacyPaidSlug: "auto-shop-margin-leak-detector",
  painStatement:
    "Auto repair shops lose margin when diagnostic time, parts handling and comeback jobs are not priced into flat-rate work.",

  inputs: [
    {
      id: "monthlyRepairRevenue",
      label: "Monthly repair revenue",
      type: "number",
      unit: "USD",
      required: true,
      smartDefault: 52000,
      validation: { min: 0 },
      helper: "Please enter a valid value.",
      expertMeaning: "Parameter value complies with industrial calculation standards.",
    },
    {
      id: "comebackRatePercent",
      label: "Comeback rate",
      type: "number",
      unit: "%",
      required: true,
      smartDefault: 5,
      validation: { min: 0, max: 100 },
      helper: "Please enter a valid value.",
      expertMeaning: "Parameter value complies with industrial calculation standards.",
    },
    {
      id: "averageJobCost",
      label: "Average job cost",
      type: "number",
      unit: "USD",
      required: true,
      smartDefault: 280,
      validation: { min: 0 },
      helper: "Please enter a valid value.",
      expertMeaning: "Parameter value complies with industrial calculation standards.",
    },
    {
      id: "diagnosticHours",
      label: "Diagnostic hours",
      type: "number",
      unit: "hours",
      required: true,
      smartDefault: 38,
      validation: { min: 0 },
      helper: "Please enter a valid value.",
      expertMeaning: "Parameter value complies with industrial calculation standards.",
    },
    {
      id: "laborRate",
      label: "Labor rate",
      type: "number",
      unit: "USD/hour",
      required: true,
      smartDefault: 65,
      validation: { min: 0 },
      helper: "Please enter a valid value.",
      expertMeaning: "Parameter value complies with industrial calculation standards.",
    },
    {
      id: "partsHandlingCost",
      label: "Parts handling cost",
      type: "number",
      unit: "USD",
      required: true,
      smartDefault: 900,
      validation: { min: 0 },
      helper: "Please enter a valid value.",
      expertMeaning: "Parameter value complies with industrial calculation standards.",
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
      unit: "USD",
      format: "currency",
      isBigNumber: true,
    },
    { id: "comebackCost", label: "Comeback cost", unit: "USD", format: "currency" },
    { id: "diagnosticLeak", label: "Diagnostic leak", unit: "USD", format: "currency" },
    { id: "partsHandlingCost", label: "Parts handling cost", unit: "USD", format: "currency" },
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
