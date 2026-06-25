import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";

export const GURULTU_VE_TITRESIM_MARUZIYET_RISK_MALIYET_CALCULATOR_SCHEMA: PremiumCalculatorSchema = {
  id: "noise-vibration-exposure-risk-cost-calculator",
  name: "Noise & Vibration Exposure Risk Cost Calculator",
  sectorSlug: "hse-ergonomics",
  category: "measurement",
  legacyPaidSlug: "noise-vibration-exposure-risk-cost-calculator",
  painStatement:
    "Evaluate the unmeasurable effects of high noise levels on employee productivity and health costs.",

  inputs: [
    {
      id: "soundLevelDb",
      label: "Noise Level",
      type: "number",
      unit: "dB",
      required: true,
      smartDefault: 85,
      validation: { min: 40, max: 140 },
      helper: "Average noise level in the working environment.",
      expertMeaning: "Decibel rating of the industrial zone.",
    },
    {
      id: "exposureDuration",
      label: "Daily Exposure Duration",
      type: "number",
      unit: "hours",
      required: true,
      smartDefault: 8,
      validation: { min: 0.1, max: 24 },
      helper: "Time the employee is exposed to the noisy environment.",
      expertMeaning: "Total hours exposed per shift.",
    },
    {
      id: "hearingLossCost",
      label: "Hearing Loss & Health Cost",
      type: "number",
      unit: "USD",
      required: true,
      smartDefault: 1200,
      validation: { min: 0 },
      helper: "Cost of hearing loss treatment and compensation risk allowance.",
      expertMeaning: "Hearing damage and insurance risk liability.",
    },
    {
      id: "efficiencyLossCost",
      label: "Productivity Loss Cost",
      type: "number",
      unit: "USD",
      required: true,
      smartDefault: 800,
      validation: { min: 0 },
      helper: "Loss of efficiency due to noise-induced distraction.",
      expertMeaning: "Productivity drop due to noise fatigue.",
    },
    {
      id: "errorRateCost",
      label: "Error and Accident Cost",
      type: "number",
      unit: "USD",
      required: true,
      smartDefault: 450,
      validation: { min: 0 },
      helper: "Cost of errors and accidents resulting from loss of concentration.",
      expertMeaning: "Operational errors and safety hazard cost.",
    },
    {
      id: "ppeCost",
      label: "PPE & Prevention Cost",
      type: "number",
      unit: "USD",
      required: true,
      smartDefault: 150,
      validation: { min: 0 },
      helper: "Cost of personal protective equipment (earmuffs etc.).",
      expertMeaning: "Personal protective equipment acquisition.",
    },
  ],

  formulaPipeline: [
    {
      formulaId: "measurement.noise_exposure",
      formulaFamily: "measurement",
      inputMap: { soundLevelDb: "soundLevelDb", exposureDuration: "exposureDuration" },
      outputId: "noiseExposureIndex",
    },
    {
      formulaId: "cost.sum4",
      formulaFamily: "cost",
      inputMap: { a: "hearingLossCost", b: "efficiencyLossCost", c: "errorRateCost", d: "ppeCost" },
      outputId: "totalNoiseCost",
    },
  ],

  outputs: [
    {
      id: "noiseExposureIndex",
      label: "Noise Exposure Index",
      unit: "dB-hours",
      format: "number",
      isBigNumber: true,
    },
    { id: "totalNoiseCost", label: "Total Noise & Risk Cost", unit: "USD", format: "currency" },
  ],

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
