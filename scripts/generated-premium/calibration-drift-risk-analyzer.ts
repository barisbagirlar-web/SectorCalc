/**
 * CALIBRATION SAPMA — Premium Calculator Schema
 * Auto-generated from user-provided formulas
 */
import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";

export const CALIBRATIONDRIFTRISK_SCHEMA: PremiumCalculatorSchema = {
  id: "calibration-drift-risk-analyzer",
  legacyPaidSlug: "calibration-drift-risk-analyzer",
  name: "CALIBRATION SAPMA",
  sectorSlug: "general",
  category: "cost",
  painStatement: "CALIBRATION SAPMA — premium analysis tool.",
  inputs: [
    { id: "sononceki_hata", label: "Son/Önceki Hata", type: "number", required: true },
    { id: "kalibrasyonlar_arasi_sure", label: "Kalibrasyonlar Arası Süre", type: "number", required: true },
    { id: "tolerans", label: "Tolerans", type: "number", required: true },
    { id: "kritiklik", label: "Kritiklik", type: "text", required: true },
    { id: "baz_aralik", label: "Baz Aralık", type: "number", required: true },
    { id: "birim_hata_etkisi", label: "Birim Hata Etkisi", type: "number", required: true },
  ],
  outputs: [
    { id: "drift_rate", label: "Drift Rate", unit: "currency", format: "currency" },
    { id: "predicted_drift", label: "Predicted Drift", unit: "currency", format: "currency" },
    { id: "current_uncertainty", label: "Current Uncertainty", unit: "currency", format: "currency" },
    { id: "risk_score", label: "Risk Score", unit: "currency", format: "currency" },
    { id: "optimal_interval", label: "Optimal Interval", unit: "currency", format: "currency" },
    { id: "guard_band", label: "Guard Band", unit: "currency", format: "currency" },
  ],
  thresholds: [],
  formulaPipeline: [
    { formulaId: "custom.calibration_sapma_analyzer_0", inputMap: { LastError: "last_error", PrevError: "prev_error", TimeBetween: "time_between" }, outputId: "drift_rate" },
    { formulaId: "custom.calibration_sapma_analyzer_1", inputMap: { DriftRate: "drift_rate", TimeSinceLast: "time_since_last" }, outputId: "predicted_drift" },
    { formulaId: "custom.calibration_sapma_analyzer_2", inputMap: { BaseUncertainty: "base_uncertainty", PredictedDrift: "predicted_drift", EnvFactor: "env_factor" }, outputId: "current_uncertainty" },
    { formulaId: "custom.calibration_sapma_analyzer_3", inputMap: { CurrentUncertainty: "current_uncertainty", Tolerance: "tolerance", Criticality: "criticality", UsageFreq: "usage_freq" }, outputId: "risk_score" },
    { formulaId: "custom.calibration_sapma_analyzer_4", inputMap: { BaseInterval: "base_interval", Tolerance: "tolerance", CurrentUncertainty: "current_uncertainty" }, outputId: "optimal_interval" },
    { formulaId: "custom.calibration_sapma_analyzer_5", inputMap: { ExpandedUncertainty: "expanded_uncertainty" }, outputId: "guard_band" },
  ],
  reportTemplate: {
    title: "CALIBRATION SAPMA Report",
    sections: ["executive_summary", "loss_breakdown", "thresholds", "action_plan"],
    exportFormats: ["pdf"],
  },
  assumptions: {
    hiddenLossMultiplier: 1.0,
    volatilityPercent: 10,
    targetMarginPercent: 20,
    assumptionNotes: ["Based on user-provided formulas.", "Verify constants periodically."],
  },
};
