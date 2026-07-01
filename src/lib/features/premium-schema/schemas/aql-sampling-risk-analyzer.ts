/**
 * Tool #3 — AQL Sampling Risk & Cost
 * ATI, TotalRiskCost, Alpha, Beta
 */
import type { PremiumCalculatorSchema } from "@/lib/features/premium-schema/premium-calculator-schema";

const INSPECTION_LEVEL_OPTIONS = [
  { value: "S1", label: "S1 (special)", label_i18n: {"en":"S1 (special)"} }, { value: "S2", label: "S2 (special)", label_i18n: {"en":"S2 (special)"} },
  { value: "S3", label: "S3 (special)", label_i18n: {"en":"S3 (special)"} }, { value: "S4", label: "S4 (special)", label_i18n: {"en":"S4 (special)"} },
  { value: "I", label: "I (normal)", label_i18n: {"en":"I (normal)"} }, { value: "II", label: "II (normal)", label_i18n: {"en":"II (normal)"} },
  { value: "III", label: "III (tightened)", label_i18n: {"en":"III (tightened)"} },
] as const;

export const AQL_SAMPLING_SCHEMA: PremiumCalculatorSchema = {
  id: "aql-sampling-risk-analyzer", legacyPaidSlug: "aql-sampling-risk-analyzer",
  name: "AQL Sampling Risk & Maliyet Analizi", name_i18n: {"en":"AQL Sampling Risk & Cost Analysis"}, sectorSlug: "sheet-metal", category: "scrap",
  painStatement: "Muayene planı seçiminde AQL ve LTPD arasındaki risk dengesini bilmeden yapılan örnekleme, ya gereksiz maliyet ya da kaçan hata riski doğurur.", painStatement_i18n: {"en":"Inspection planı seçiminde AQL ve LTPD arasındaki risk dengesini bilmeden yapılan sampling, ya gereksiz Cost ya da kaçan Error riski doğurur."},
  inputs: [
    { id: "lotSize", label: "Lot Size (N)", label_i18n: {"en":"Lot Size (N)"}, type: "number", unit: "adet", required: true, smartDefault: 1000, validation: { min: 1 }, helper: "Toplam parti büyüklüğü.", helper_i18n: {"en":"Toplam parti büyüklüğü."}, expertMeaning: "Lot size", expertMeaning_i18n: {"en":"Lot size"} },
    { id: "inspectionLevel", label: "Muayene Seviyesi", label_i18n: {"en":"Inspection Level"}, type: "select", unit: "", required: true, smartDefault: "II", options: [...INSPECTION_LEVEL_OPTIONS], helper: "ANSI/ASQ Z1.4 muayene seviyesi.", helper_i18n: {"en":"ANSI/ASQ Z1.4 muayene seviyesi."}, expertMeaning: "ANSI/ASQ Z1.4 inspection level", expertMeaning_i18n: {"en":"ANSI/ASQ Z1.4 inspection level"} },
    { id: "aqlPercent", label: "AQL (%)", label_i18n: {"en":"AQL (%)"}, type: "number", unit: "%", required: true, smartDefault: 1, validation: { min: 0.01, max: 10 }, helper: "Kabul edilebilir kalite seviyesi.", helper_i18n: {"en":"Kabul edilebilir kalite seviyesi."}, expertMeaning: "Acceptable Quality Level", expertMeaning_i18n: {"en":"Acceptable Quality Level"} },
    { id: "ltpdPercent", label: "LTPD (%)", label_i18n: {"en":"LTPD (%)"}, type: "number", unit: "%", required: true, smartDefault: 5, validation: { min: 0.01, max: 20 }, helper: "Parti tolerans kusur yüzdesi.", helper_i18n: {"en":"Parti tolerans kusur yüzdesi."}, expertMeaning: "Lot Tolerance Percent Defective", expertMeaning_i18n: {"en":"Lot Tolerance Percent Defective"} },
    { id: "sampleSize", label: "Sample Size (n)", label_i18n: {"en":"Sample Size (n)"}, type: "number", unit: "adet", required: true, smartDefault: 80, validation: { min: 1 }, helper: "Muayene edilecek örnek sayısı.", helper_i18n: {"en":"Muayene edilecek örnek sayısı."}, expertMeaning: "Sample size per ANSI/ASQ Z1.4", expertMeaning_i18n: {"en":"Sample size per ANSI/ASQ Z1.4"} },
    { id: "acceptanceNumber", label: "Accept Number (Ac)", label_i18n: {"en":"Accept Number (Ac)"}, type: "number", unit: "adet", required: true, smartDefault: 2, validation: { min: 0 }, helper: "Maksimum kabul edilebilir hatalı sayısı.", helper_i18n: {"en":"Maksimum kabul edilebilir hatalı sayısı."}, expertMeaning: "Accept number per code letter", expertMeaning_i18n: {"en":"Accept number per code letter"} },
    { id: "unitInspectionCost", label: "Birim Muayene Maliyeti", label_i18n: {"en":"Inspection Cost per Unit"}, type: "number", unit: "USD", required: true, smartDefault: 2, validation: { min: 0.01 }, helper: "", expertMeaning: "Cost per unit inspected", expertMeaning_i18n: {"en":"Cost per unit inspected"} },
    { id: "costPerDefectEscaped", label: "Escaped Defect Cost", label_i18n: {"en":"Escaped Defect Cost"}, type: "number", unit: "USD", required: true, smartDefault: 100, validation: { min: 0.01 }, helper: "", expertMeaning: "Cost per defect that escapes", expertMeaning_i18n: {"en":"Cost per defect that escapes"} },
    { id: "actualDefectRate", label: "Avg Defect Rate (p)", label_i18n: {"en":"Avg Defect Rate (p)"}, type: "number", unit: "%", required: true, smartDefault: 1.5, validation: { min: 0, max: 100 }, helper: "", expertMeaning: "Actual process defect rate", expertMeaning_i18n: {"en":"Actual process defect rate"} },
    { id: "detectionRate", label: "Detection Rate", label_i18n: {"en":"Detection Rate"}, type: "number", unit: "%", required: false, smartDefault: 80, validation: { min: 0, max: 100 }, helper: "", expertMeaning: "Inspection detection effectiveness", expertMeaning_i18n: {"en":"Inspection detection effectiveness"} },
  ],
  outputs: [
    { id: "alphaRisk", label: "Üretici Riski (α)", label_i18n: {"en":"Uretici Riski ()"}, unit: "%", format: "percentage" },
    { id: "betaRisk", label: "Tüketici Riski (β)", label_i18n: {"en":"Tuketici Riski ()"}, unit: "%", format: "percentage" },
    { id: "ati", label: "ATI (Avg. Total Inspection)", label_i18n: {"en":"ATI (Avg. Total Inspection)"}, unit: "", format: "number" },
    { id: "totalRiskCost", label: "Total Risk Cost", label_i18n: {"en":"Total Risk Cost"}, unit: "USD", format: "currency", isBigNumber: true },
  ],
  thresholds: [
    { fieldId: "alphaRisk", warning: 5, critical: 10, direction: "higher_is_bad", warningMessage: "Üretici riski > %5 — iyi parti reddedilebilir.", warningMessage_i18n: {"en":"Üretici riski > %5 — iyi parti reddedilebilir."}, criticalMessage: "Üretici riski > %10 — kabul planı çok sıkı.", criticalMessage_i18n: {"en":"Üretici riski > %10 — kabul planı çok sıkı."} },
    { fieldId: "betaRisk", warning: 10, critical: 20, direction: "higher_is_bad", warningMessage: "Tüketici riski > %10 — kötü parti kaçabilir.", warningMessage_i18n: {"en":"Tüketici riski > %10 — kötü parti kaçabilir."}, criticalMessage: "Tüketici riski > %20 — kabul planı yetersiz.", criticalMessage_i18n: {"en":"Tüketici riski > %20 — kabul planı yetersiz."} },
  ],
  formulaPipeline: [
    { formulaId: "quality.ati", inputMap: { sampleSize: "sampleSize", lotSize: "lotSize", acceptanceProb: "acceptanceNumber" }, outputId: "ati" },
    { formulaId: "quality.total_risk_cost", inputMap: { lotSize: "lotSize", defectRate: "actualDefectRate", acceptanceProb: "acceptanceNumber", detectionRate: "detectionRate", costPerDefect: "costPerDefectEscaped" }, outputId: "totalRiskCost" },
    { formulaId: "quality.alpha_risk", inputMap: { acceptanceProb: "acceptanceNumber" }, outputId: "alphaRisk" },
    { formulaId: "quality.beta_risk", inputMap: { acceptanceProbLTPD: "acceptanceNumber" }, outputId: "betaRisk" },
  ],
  reportTemplate: { title: "AQL Sampling Risk Report", title_i18n: {"en":"AQL Sampling Risk Report"}, sections: ["executive_summary", "thresholds", "action_plan", "assumptions"], exportFormats: ["pdf", "excel"] },
  assumptions: { hiddenLossMultiplier: 1.1, volatilityPercent: 10, targetMarginPercent: 15, assumptionNotes: ["Sample size and acceptance number are simplified per MIL-STD-1916.", "Alpha = 1 - Pa at AQL. Beta = Pa at LTPD (simplified).", "Actual binomial OC curve requires full lookup table for exact values."],assumptionNotes_i18n:[{"en":"Sample size and acceptance number are simplified per MIL-STD-1916."},{"en":"Alpha = 1 - Pa at AQL. Beta = Pa at LTPD (simplified)."},{"en":"Actual binomial OC curve requires full lookup table for exact values."}]},
};
