/**
 * Tool #13 — Kalibrasyon Sapma Riski
 * DriftRate → CurrentUncertainty → RiskScore → OptimalInterval → GuardBand
 */
import type { PremiumCalculatorSchema } from "@/lib/features/premium-schema/premium-calculator-schema";
export const CALIBRATION_DRIFT_SCHEMA: PremiumCalculatorSchema = {
  id: "calibration-drift-risk-analyzer", legacyPaidSlug: "calibration-drift-risk-analyzer",
  name: "Kalibrasyon Sapma Riski Analizi", name_i18n: {"en":"Calibration Drift Risk Analysis"}, sectorSlug: "sheet-metal", category: "calibration",
  painStatement: "Kalibrasyon sapması zamanla büyür ve ölçüm belirsizliği artar. Tolerans aşıldığında ürün kalitesi riske girer. Bu araç drift profili, güncel belirsizlik ve optimal kalibrasyon aralığını hesaplar.", painStatement_i18n: {"en":"Calibration drift grows over time, increasing measurement uncertainty. When tolerance is exceeded, product quality is at risk. This tool calculates drift profile, current uncertainty, and optimal calibration interval."},
  inputs: [
    { id: "lastCalibrationError", label: "Son Kalibrasyon Hatası", label_i18n: {"en":"Last Calibration Error"}, type: "number", unit: "", required: true, smartDefault: 0.5, validation: { min: 0 }, helper: "", expertMeaning: "Last calibration deviation", expertMeaning_i18n: {"en":"Last calibration deviation"} },
    { id: "previousCalibrationError", label: "Önceki Kalibrasyon Hatası", label_i18n: {"en":"Previous Calibration Error"}, type: "number", unit: "", required: true, smartDefault: 0.2, validation: { min: 0 }, helper: "", expertMeaning: "Previous calibration deviation", expertMeaning_i18n: {"en":"Previous calibration deviation"} },
    { id: "timeBetweenCalibrations", label: "Kalibrasyonlar Arası Süre", label_i18n: {"en":"Time Between Calibrations"}, type: "number", unit: "gün", required: true, smartDefault: 180, validation: { min: 1 }, helper: "", expertMeaning: "Days between calibrations", expertMeaning_i18n: {"en":"Days between calibrations"} },
    { id: "timeSinceLastCalibration", label: "Son Kalibrasyon Üzerinden Geçen Süre", label_i18n: {"en":"Time Since Last Calibration"}, type: "number", unit: "gün", required: false, smartDefault: 90, validation: { min: 0 }, helper: "", expertMeaning: "Days since last calibration", expertMeaning_i18n: {"en":"Days since last calibration"} },
    { id: "baseUncertainty", label: "Temel Belirsizlik", label_i18n: {"en":"Base Uncertainty"}, type: "number", unit: "", required: true, smartDefault: 0.3, validation: { min: 0 }, helper: "", expertMeaning: "Base measurement uncertainty", expertMeaning_i18n: {"en":"Base measurement uncertainty"} },
    { id: "toleranceLimit", label: "Tolerans Limiti", label_i18n: {"en":"Tolerance Limit"}, type: "number", unit: "", required: true, smartDefault: 1.0, validation: { min: 0.001 }, helper: "", expertMeaning: "Specification tolerance", expertMeaning_i18n: {"en":"Specification tolerance"} },
    { id: "criticalityLevel", label: "Kritiklik Seviyesi (1-5)", label_i18n: {"en":"Criticality Level (1-5)"}, type: "number", unit: "", required: true, smartDefault: 3, validation: { min: 1, max: 5 }, helper: "", expertMeaning: "Criticality rating", expertMeaning_i18n: {"en":"Criticality rating"} },
    { id: "usageFrequency", label: "Kullanım Sıklığı (1-5)", label_i18n: {"en":"Usage Frequency (1-5)"}, type: "number", unit: "", required: false, smartDefault: 4, validation: { min: 1, max: 5 }, helper: "", expertMeaning: "Frequency of use", expertMeaning_i18n: {"en":"Frequency of use"} },
    { id: "standardCalibrationInterval", label: "Standart Kalibrasyon Aralığı", label_i18n: {"en":"Standard Calibration Interval"}, type: "number", unit: "gün", required: false, smartDefault: 365, validation: { min: 1 }, helper: "", expertMeaning: "Manufacturer recommended interval", expertMeaning_i18n: {"en":"Manufacturer recommended interval"} },
    { id: "environmentalFactor", label: "Çevresel Faktör", label_i18n: {"en":"Environmental Factor"}, type: "number", unit: "", required: false, smartDefault: 0.1, validation: { min: 0 }, helper: "", expertMeaning: "Environmental contribution", expertMeaning_i18n: {"en":"Environmental contribution"} },
    { id: "impactPerUnitError", label: "Birim Hata Başına Etki", label_i18n: {"en":"Impact Per Unit Error"}, type: "number", unit: "USD", required: false, smartDefault: 50, validation: { min: 0 }, helper: "", expertMeaning: "Cost impact per unit error", expertMeaning_i18n: {"en":"Cost impact per unit error"} },
  ],
  outputs: [
    { id: "driftRate", label: "Günlük Drift Oranı", label_i18n: {"en":"Gunluk Drift Oran"}, unit: "birim/gün", format: "number" },
    { id: "currentUncertainty", label: "Güncel Ölçüm Belirsizliği", label_i18n: {"en":"Guncel Olcum Belirsizligi"}, unit: "", format: "number" },
    { id: "riskScore", label: "Kalibrasyon Risk Skoru", label_i18n: {"en":"Kalibrasyon Risk Skoru"}, unit: "", format: "score" },
    { id: "optimalInterval", label: "Optimal Kalibrasyon Aralığı", label_i18n: {"en":"Optimal Kalibrasyon Aralg"}, unit: "gün", format: "number" },
    { id: "calibrationVerdict", label: "Kalibrasyon Durumu", label_i18n: {"en":"Kalibrasyon Durumu"}, unit: "", format: "score", isBigNumber: true },
  ],
  thresholds: [
    { fieldId: "riskScore", warning: 3, critical: 5, direction: "higher_is_bad", warningMessage: "Risk skoru > 3 — kalibrasyon aralığı kısaltılmalı.", warningMessage_i18n: {"en":"Risk score > 3 — shorten calibration interval."}, criticalMessage: "Risk skoru > 5 — acil kalibrasyon gerekiyor.", criticalMessage_i18n: {"en":"Risk score > 5 — urgent calibration required."} },
  ],
  formulaPipeline: [
    { formulaId: "measurement.drift_rate", inputMap: { lastError: "lastCalibrationError", prevError: "previousCalibrationError", timeBetweenDays: "timeBetweenCalibrations" }, outputId: "driftRate" },
    { formulaId: "measurement.current_uncertainty", inputMap: { baseUncertainty: "baseUncertainty", predictedDrift: "driftRate", environmentalFactor: "environmentalFactor" }, outputId: "currentUncertainty" },
    { formulaId: "measurement.calibration_risk_score", inputMap: { currentUncertainty: "currentUncertainty", toleranceLimit: "toleranceLimit", criticality: "criticalityLevel", usageFrequency: "usageFrequency" }, outputId: "riskScore" },
  ],
  reportTemplate: { title: "Calibration Drift Risk Report", title_i18n: {"en":"Calibration Drift Risk Report"}, sections: ["executive_summary", "thresholds", "action_plan", "assumptions"], exportFormats: ["pdf", "excel"] },
  assumptions: { hiddenLossMultiplier: 1.1, volatilityPercent: 10, targetMarginPercent: 15, assumptionNotes: ["Drift rate = (Last error - Previous error) / Days between.", "Current uncertainty = SQRT(Base² + PredictedDrift² + Env²).", "Risk score = (Uncertainty/Tolerance) × Criticality × Frequency.", "Optimal interval = Standard × (Tolerance / Current uncertainty)."],assumptionNotes_i18n:[{"en":"Drift rate = (Last error - Previous error) / Days between."},{"en":"Current uncertainty = SQRT(Base² + PredictedDrift² + Env²)."},{"en":"Risk score = (Uncertainty/Tolerance) × Criticality × Frequency."},{"en":"Optimal interval = Standard × (Tolerance / Current uncertainty)."}]},
};
