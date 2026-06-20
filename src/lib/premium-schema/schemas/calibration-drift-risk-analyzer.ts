/**
 * Tool #13 — Kalibrasyon Sapma Riski
 * DriftRate → CurrentUncertainty → RiskScore → OptimalInterval → GuardBand
 */
import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";
export const CALIBRATION_DRIFT_SCHEMA: PremiumCalculatorSchema = {
  id: "calibration-drift-risk-analyzer", legacyPaidSlug: "calibration-drift-risk-analyzer",
  name: "Kalibrasyon Sapma Riski Analizi", sectorSlug: "sheet-metal", category: "calibration",
  painStatement: "Kalibrasyon sapması zamanla büyür ve ölçüm belirsizliği artar. Tolerans aşıldığında ürün kalitesi riske girer. Bu araç drift profili, güncel belirsizlik ve optimal kalibrasyon aralığını hesaplar.",
  inputs: [
    { id: "lastCalibrationError", label: "Son Kalibrasyon Hatası", type: "number", unit: "", required: true, smartDefault: 0.5, validation: { min: 0 }, helper: "", expertMeaning: "Last calibration deviation" },
    { id: "previousCalibrationError", label: "Önceki Kalibrasyon Hatası", type: "number", unit: "", required: true, smartDefault: 0.2, validation: { min: 0 }, helper: "", expertMeaning: "Previous calibration deviation" },
    { id: "timeBetweenCalibrations", label: "Kalibrasyonlar Arası Süre", type: "number", unit: "gün", required: true, smartDefault: 180, validation: { min: 1 }, helper: "", expertMeaning: "Days between calibrations" },
    { id: "timeSinceLastCalibration", label: "Son Kalibrasyon Üzerinden Geçen Süre", type: "number", unit: "gün", required: false, smartDefault: 90, validation: { min: 0 }, helper: "", expertMeaning: "Days since last calibration" },
    { id: "baseUncertainty", label: "Temel Belirsizlik", type: "number", unit: "", required: true, smartDefault: 0.3, validation: { min: 0 }, helper: "", expertMeaning: "Base measurement uncertainty" },
    { id: "toleranceLimit", label: "Tolerans Limiti", type: "number", unit: "", required: true, smartDefault: 1.0, validation: { min: 0.001 }, helper: "", expertMeaning: "Specification tolerance" },
    { id: "criticalityLevel", label: "Kritiklik Seviyesi (1-5)", type: "number", unit: "", required: true, smartDefault: 3, validation: { min: 1, max: 5 }, helper: "", expertMeaning: "Criticality rating" },
    { id: "usageFrequency", label: "Kullanım Sıklığı (1-5)", type: "number", unit: "", required: false, smartDefault: 4, validation: { min: 1, max: 5 }, helper: "", expertMeaning: "Frequency of use" },
    { id: "standardCalibrationInterval", label: "Standart Kalibrasyon Aralığı", type: "number", unit: "gün", required: false, smartDefault: 365, validation: { min: 1 }, helper: "", expertMeaning: "Manufacturer recommended interval" },
    { id: "environmentalFactor", label: "Çevresel Faktör", type: "number", unit: "", required: false, smartDefault: 0.1, validation: { min: 0 }, helper: "", expertMeaning: "Environmental contribution" },
    { id: "impactPerUnitError", label: "Birim Hata Başına Etki", type: "number", unit: "USD", required: false, smartDefault: 50, validation: { min: 0 }, helper: "", expertMeaning: "Cost impact per unit error" },
  ],
  outputs: [
    { id: "driftRate", label: "Günlük Drift Oranı", unit: "birim/gün", format: "number" },
    { id: "currentUncertainty", label: "Güncel Ölçüm Belirsizliği", unit: "", format: "number" },
    { id: "riskScore", label: "Kalibrasyon Risk Skoru", unit: "", format: "score" },
    { id: "optimalInterval", label: "Optimal Kalibrasyon Aralığı", unit: "gün", format: "number" },
    { id: "calibrationVerdict", label: "Kalibrasyon Durumu", unit: "", format: "score", isBigNumber: true },
  ],
  thresholds: [
    { fieldId: "riskScore", warning: 3, critical: 5, direction: "higher_is_bad", warningMessage: "Risk skoru > 3 — kalibrasyon aralığı kısaltılmalı.", criticalMessage: "Risk skoru > 5 — acil kalibrasyon gerekiyor." },
  ],
  formulaPipeline: [
    { formulaId: "measurement.drift_rate", inputMap: { lastError: "lastCalibrationError", prevError: "previousCalibrationError", timeBetweenDays: "timeBetweenCalibrations" }, outputId: "driftRate" },
    { formulaId: "measurement.current_uncertainty", inputMap: { baseUncertainty: "baseUncertainty", predictedDrift: "driftRate", environmentalFactor: "environmentalFactor" }, outputId: "currentUncertainty" },
    { formulaId: "measurement.calibration_risk_score", inputMap: { currentUncertainty: "currentUncertainty", toleranceLimit: "toleranceLimit", criticality: "criticalityLevel", usageFrequency: "usageFrequency" }, outputId: "riskScore" },
  ],
  reportTemplate: { title: "Calibration Drift Risk Report", sections: ["executive_summary", "thresholds", "action_plan", "assumptions"], exportFormats: ["pdf", "excel"] },
  assumptions: { hiddenLossMultiplier: 1.1, volatilityPercent: 10, targetMarginPercent: 15, assumptionNotes: ["Drift rate = (Last error - Previous error) / Days between.", "Current uncertainty = SQRT(Base² + PredictedDrift² + Env²).", "Risk score = (Uncertainty/Tolerance) × Criticality × Frequency.", "Optimal interval = Standard × (Tolerance / Current uncertainty)."] },
};
