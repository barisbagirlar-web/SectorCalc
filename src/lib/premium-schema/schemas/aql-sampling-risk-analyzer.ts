/**
 * Tool #3 — AQL Sampling Risk & Cost
 * ATI, TotalRiskCost, Alpha, Beta
 */
import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";

const INSPECTION_LEVEL_OPTIONS = [
  { value: "S1", label: "S1 (special)" }, { value: "S2", label: "S2 (special)" },
  { value: "S3", label: "S3 (special)" }, { value: "S4", label: "S4 (special)" },
  { value: "I", label: "I (normal)" }, { value: "II", label: "II (normal)" },
  { value: "III", label: "III (tightened)" },
] as const;

export const AQL_SAMPLING_SCHEMA: PremiumCalculatorSchema = {
  id: "aql-sampling-risk-analyzer", legacyPaidSlug: "aql-sampling-risk-analyzer",
  name: "AQL Sampling Risk & Maliyet Analizi", sectorSlug: "sheet-metal", category: "scrap",
  painStatement: "Muayene planı seçiminde AQL ve LTPD arasındaki risk dengesini bilmeden yapılan örnekleme, ya gereksiz maliyet ya da kaçan hata riski doğurur.",
  inputs: [
    { id: "lotSize", label: "Parti Büyüklüğü (N)", type: "number", unit: "adet", required: true, smartDefault: 1000, validation: { min: 1 }, helper: "Toplam parti büyüklüğü.", expertMeaning: "Lot size" },
    { id: "inspectionLevel", label: "Muayene Seviyesi", type: "select", unit: "", required: true, smartDefault: "II", options: [...INSPECTION_LEVEL_OPTIONS], helper: "ANSI/ASQ Z1.4 muayene seviyesi.", expertMeaning: "ANSI/ASQ Z1.4 inspection level" },
    { id: "aqlPercent", label: "AQL (%)", type: "number", unit: "%", required: true, smartDefault: 1, validation: { min: 0.01, max: 10 }, helper: "Kabul edilebilir kalite seviyesi.", expertMeaning: "Acceptable Quality Level" },
    { id: "ltpdPercent", label: "LTPD (%)", type: "number", unit: "%", required: true, smartDefault: 5, validation: { min: 0.01, max: 20 }, helper: "Parti tolerans kusur yüzdesi.", expertMeaning: "Lot Tolerance Percent Defective" },
    { id: "sampleSize", label: "Örneklem Büyüklüğü (n)", type: "number", unit: "adet", required: true, smartDefault: 80, validation: { min: 1 }, helper: "Muayene edilecek örnek sayısı.", expertMeaning: "Sample size per ANSI/ASQ Z1.4" },
    { id: "acceptanceNumber", label: "Kabul Sayısı (Ac)", type: "number", unit: "adet", required: true, smartDefault: 2, validation: { min: 0 }, helper: "Maksimum kabul edilebilir hatalı sayısı.", expertMeaning: "Accept number per code letter" },
    { id: "unitInspectionCost", label: "Birim Muayene Maliyeti", type: "number", unit: "USD", required: true, smartDefault: 2, validation: { min: 0.01 }, helper: "", expertMeaning: "Cost per unit inspected" },
    { id: "costPerDefectEscaped", label: "Kaçan Hata Maliyeti", type: "number", unit: "USD", required: true, smartDefault: 100, validation: { min: 0.01 }, helper: "", expertMeaning: "Cost per defect that escapes" },
    { id: "actualDefectRate", label: "Ortalama Kusur Oranı (p)", type: "number", unit: "%", required: true, smartDefault: 1.5, validation: { min: 0, max: 100 }, helper: "", expertMeaning: "Actual process defect rate" },
    { id: "detectionRate", label: "Tespit Oranı", type: "number", unit: "%", required: false, smartDefault: 80, validation: { min: 0, max: 100 }, helper: "", expertMeaning: "Inspection detection effectiveness" },
  ],
  outputs: [
    { id: "alphaRisk", label: "Üretici Riski (α)", unit: "%", format: "percentage" },
    { id: "betaRisk", label: "Tüketici Riski (β)", unit: "%", format: "percentage" },
    { id: "ati", label: "ATI (Ort. Toplam Muayene)", unit: "", format: "number" },
    { id: "totalRiskCost", label: "Toplam Risk Maliyeti", unit: "USD", format: "currency", isBigNumber: true },
  ],
  thresholds: [
    { fieldId: "alphaRisk", warning: 5, critical: 10, direction: "higher_is_bad", warningMessage: "Üretici riski > %5 — iyi parti reddedilebilir.", criticalMessage: "Üretici riski > %10 — kabul planı çok sıkı." },
    { fieldId: "betaRisk", warning: 10, critical: 20, direction: "higher_is_bad", warningMessage: "Tüketici riski > %10 — kötü parti kaçabilir.", criticalMessage: "Tüketici riski > %20 — kabul planı yetersiz." },
  ],
  formulaPipeline: [
    { formulaId: "quality.ati", inputMap: { sampleSize: "sampleSize", lotSize: "lotSize", acceptanceProb: "acceptanceNumber" }, outputId: "ati" },
    { formulaId: "quality.total_risk_cost", inputMap: { lotSize: "lotSize", defectRate: "actualDefectRate", acceptanceProb: "acceptanceNumber", detectionRate: "detectionRate", costPerDefect: "costPerDefectEscaped" }, outputId: "totalRiskCost" },
    { formulaId: "quality.alpha_risk", inputMap: { acceptanceProb: "acceptanceNumber" }, outputId: "alphaRisk" },
    { formulaId: "quality.beta_risk", inputMap: { acceptanceProbLTPD: "acceptanceNumber" }, outputId: "betaRisk" },
  ],
  reportTemplate: { title: "AQL Sampling Risk Report", sections: ["executive_summary", "thresholds", "action_plan", "assumptions"], exportFormats: ["pdf", "excel"] },
  assumptions: { hiddenLossMultiplier: 1.1, volatilityPercent: 10, targetMarginPercent: 15, assumptionNotes: ["Sample size and acceptance number are simplified per MIL-STD-1916.", "Alpha = 1 - Pa at AQL. Beta = Pa at LTPD (simplified).", "Actual binomial OC curve requires full lookup table for exact values."] },
};
