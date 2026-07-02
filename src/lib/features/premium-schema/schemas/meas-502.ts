import type { PremiumCalculatorSchema } from "@/lib/features/premium-schema/premium-calculator-schema";

export const CALIBRATION_DRIFT_RISK_SCHEMA: PremiumCalculatorSchema = {
  id: "meas-502",
  name: "Calibration Drift Risk Calculator",
  sectorSlug: "measurement-calibration",
  category: "calibration",
  legacyPaidSlug: "3d-print-job-margin-tool",
  painStatement:
    "Measurement drift creates scrap, rejection and compliance risk before the issue is visible in production.",

  inputs: [],

  outputs: [],

  thresholds: [
    {
      fieldId: "toleranceUsage",
      warning: 70,
      critical: 100,
      direction: "higher_is_bad",
      warningMessage: "Tolerance band usage is elevated - drift may trigger scrap or rework.",
      criticalMessage: "Critical tolerance usage - recalibrate before production rejection.",
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
      "Outputs are technical measurement estimates - verify before compliance decisions.",
    ],
  },
};
