import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";

export const CALIBRATION_DRIFT_RISK_SCHEMA: PremiumCalculatorSchema = {
  id: "meas-502",
  name: "Calibration Drift Risk Calculator",
  sectorSlug: "measurement-calibration",
  category: "calibration",
  legacyPaidSlug: "3d-print-job-margin-tool",
  painStatement:
    "Measurement drift creates scrap, rejection and compliance risk before the issue is visible in production.",

  inputs: [
    {
      id: "targetValue",
      label: "Target value",
      type: "number",
      unit: "value",
      required: true,
      smartDefault: 100,
      helper: "Please enter a valid value.",
      expertMeaning: "Parameter value complies with industrial calculation standards.",
    },
    {
      id: "actualValue",
      label: "Actual value",
      type: "number",
      unit: "value",
      required: true,
      smartDefault: 101.8,
      helper: "Please enter a valid value.",
      expertMeaning: "Parameter value complies with industrial calculation standards.",
    },
    {
      id: "tolerance",
      label: "Tolerance",
      type: "number",
      unit: "value",
      required: true,
      smartDefault: 2,
      validation: { min: 0.0001 },
      helper: "Please enter a valid value.",
      expertMeaning: "Parameter value complies with industrial calculation standards.",
    },
    {
      id: "batchValue",
      label: "Batch value",
      type: "number",
      unit: "USD",
      required: true,
      smartDefault: 18000,
      validation: { min: 0 },
      helper: "Please enter a valid value.",
      expertMeaning: "Parameter value complies with industrial calculation standards.",
    },
    {
      id: "rejectionRiskPercent",
      label: "Rejection risk",
      type: "number",
      unit: "%",
      required: true,
      smartDefault: 12,
      validation: { min: 0, max: 100 },
      helper: "Please enter a valid value.",
      expertMeaning: "Parameter value complies with industrial calculation standards.",
    },
  ],

  formulaPipeline: [
    {
      formulaId: "calibration.tolerance_status",
      inputMap: { target: "targetValue", actual: "actualValue", tolerance: "tolerance" },
      outputId: "toleranceUsage",
    },
    {
      formulaId: "cost.percent_of_amount",
      inputMap: { amount: "batchValue", percent: "rejectionRiskPercent" },
      outputId: "rejectionExposure",
    },
  ],

  outputs: [
    {
      id: "toleranceUsage",
      label: "Tolerance usage",
      unit: "%",
      format: "percentage",
      isBigNumber: true,
    },
    { id: "rejectionExposure", label: "Rejection exposure", unit: "USD", format: "currency" },
  ],

  thresholds: [
    {
      fieldId: "toleranceUsage",
      warning: 70,
      critical: 100,
      direction: "higher_is_bad",
      warningMessage: "Tolerance band usage is elevated — drift may trigger scrap or rework.",
      criticalMessage: "Critical tolerance usage — recalibrate before production rejection.",
    },
  ],

  reportTemplate: {
    title: "Calibration Drift Risk Decision Report",
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
    hiddenLossMultiplier: 1.15,
    volatilityPercent: 20,
    targetMarginPercent: 10,
    assumptionNotes: [
      "Tolerance usage = |actual − target| ÷ tolerance × 100.",
      "Rejection exposure = batch value × rejection risk percent.",
      "Outputs are technical measurement estimates — verify before compliance decisions.",
    ],
  },
};
