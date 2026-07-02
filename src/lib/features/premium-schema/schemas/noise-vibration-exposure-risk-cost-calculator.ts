import type { PremiumCalculatorSchema } from "@/lib/features/premium-schema/premium-calculator-schema";

export const GURULTU_VE_TITRESIM_MARUZIYET_RISK_MALIYET_CALCULATOR_SCHEMA: PremiumCalculatorSchema = {
  id: "noise-vibration-exposure-risk-cost-calculator",
  name: "Noise & Vibration Exposure Risk Cost Calculator",
  sectorSlug: "hse-ergonomics",
  category: "measurement",
  legacyPaidSlug: "noise-vibration-exposure-risk-cost-calculator",
  painStatement:
    "Evaluate the unmeasurable effects of high noise levels on employee productivity and health costs.",

  inputs: [],

  outputs: [],

  thresholds: [
    {
      fieldId: "noiseExposureIndex",
      warning: 680,
      critical: 720,
      direction: "higher_is_bad",
      warningMessage: "Exposure level is close to the limit. PPE usage and rotation are recommended.",
      criticalMessage: "Critical noise exposure! Immediate engineering controls and hearing protection required.",
    },
  ],

  reportTemplate: {
    title: "Noise and Vibration Exposure Risk Analysis Report",
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
    hiddenLossMultiplier: 1.0,
    volatilityPercent: 15,
    targetMarginPercent: 0,
    assumptionNotes: [
      "Exposure Index = (Sound Level) * (Exposure Duration).",
      "Risk Cost = Hearing Loss + Productivity Drop + Errors + PPE.",
    ],
  },
};
