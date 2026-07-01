/**
 * Tool #34 — Poka-Yoke ROI Analizi
 */
import type { PremiumCalculatorSchema } from "@/lib/features/premium-schema/premium-calculator-schema";
export const POKA_YOKE_ROI_ANALYZER_SCHEMA: PremiumCalculatorSchema = {
  id: "poka-yoke-roi-analyzer", legacyPaidSlug: "poka-yoke-roi-analyzer",
  name: "Poka-Yoke Yatirim Getirisi", name_i18n: {"en":"Poka-Yoke Investment Return"}, sectorSlug: "quality", category: "cost",
  painStatement: "Hata önleme (Poka-Yoke) yatırımının geri dönüşü hesaplanmazsa kalite iyileştirme bütçesi verimsiz kullanılabilir.", painStatement_i18n: {"en":"If the return on error prevention (Poka-Yoke) investment is not calculated, the quality improvement budget may be used inefficiently."},
  inputs: [
    { id: "currentDefectRate", label: "Current defect rate percentage", label_i18n: {"en":"Current defect rate percentage"}, type: "number", unit: "%", required: true, smartDefault: 5, validation: { min: 0.01 }, helper: "", expertMeaning: "Current defect rate percentage", expertMeaning_i18n: {"en":"Current defect rate percentage"} },
    { id: "productionVolume", label: "Üretim Hacmi", label_i18n: {"en":"Annual production volume"}, type: "number", unit: "adet/yıl", required: true, smartDefault: 100000, validation: { min: 1 }, helper: "", expertMeaning: "Annual production volume", expertMeaning_i18n: {"en":"Annual production volume"} },
    { id: "defectCostPerUnit", label: "Birim Hata Maliyeti", label_i18n: {"en":"Unit Error Cost"}, type: "number", unit: "USD", required: true, smartDefault: 15, validation: { min: 0.01 }, helper: "", expertMeaning: "Cost per defective unit", expertMeaning_i18n: {"en":"Cost per defective unit"} },
    { id: "pokaYokeInvestment", label: "Total Poka-Yoke implementation cost", label_i18n: {"en":"Total Poka-Yoke implementation cost"}, type: "number", unit: "USD", required: true, smartDefault: 25000, validation: { min: 1 }, helper: "", expertMeaning: "Total Poka-Yoke implementation cost", expertMeaning_i18n: {"en":"Total Poka-Yoke implementation cost"} },
    { id: "newDefectRate", label: "Target defect rate after Poka-Yoke", label_i18n: {"en":"Target defect rate after Poka-Yoke"}, type: "number", unit: "%", required: true, smartDefault: 1, validation: { min: 0 }, helper: "", expertMeaning: "Target defect rate after Poka-Yoke", expertMeaning_i18n: {"en":"Target defect rate after Poka-Yoke"} },
    { id: "usefulLife", label: "Expected useful life of solution", label_i18n: {"en":"Expected useful life of solution"}, type: "number", unit: "yıl", required: false, smartDefault: 5, validation: { min: 1 }, helper: "", expertMeaning: "Expected useful life of solution", expertMeaning_i18n: {"en":"Expected useful life of solution"} },
  ],
  outputs: [
    { id: "currentDefectRate", label: "Mevcut Hata Oran", label_i18n: {"en":"Current Error Rate"}, unit: "%", format: "number" },
    { id: "defectCostAnnual", label: "Yllk Hata Maliyeti", label_i18n: {"en":"Annual Error Cost"}, unit: "USD/yıl", format: "currency", isBigNumber: true },
    { id: "pokaYokeCost", label: "Poka-Yoke Maliyeti", label_i18n: {"en":"Poka-Yoke Cost"}, unit: "USD", format: "currency" },
    { id: "newDefectRate", label: "Yeni Hata Oran", label_i18n: {"en":"Yeni Error Rate"}, unit: "%", format: "number" },
    { id: "pokaYokeSavings", label: "Yllk Tasarruf", label_i18n: {"en":"Annual Tasarruf"}, unit: "USD/yıl", format: "currency", isBigNumber: true },
    { id: "pokaYokeRoi", label: "Yatrm Getirisi (ROI)", label_i18n: {"en":"Yatrm Return (ROI)"}, unit: "%", format: "number" },
    { id: "pokaYokePayback", label: "Geri Ödeme Süresi", label_i18n: {"en":"Payback Period"}, unit: "ay", format: "number" },
  ],
  thresholds: [{ fieldId: "pokaYokeRoi", warning: 50, critical: 20, direction: "lower_is_bad", warningMessage: "ROI < %50 — yatırım fizibilitesi sorgulanmalı.", warningMessage_i18n: {"en":"ROI < %50 — investment feasibility should be questioned."}, criticalMessage: "ROI < %20 — Poka-Yoke yatırımı önerilmez.", criticalMessage_i18n: {"en":"ROI < %20 — Poka-Yoke investment is not recommended."} }],
  formulaPipeline: [
    { formulaId: "measurement.current_defect_rate", inputMap: {
        defects: "currentDefectRate"
      ,
        totalInspected: "totalInspected"}, outputId: "currentDefectRate" },
    { formulaId: "cost.defect_cost_annual", inputMap: {
        currentDefectRate: "currentDefectRate",
        annualVolume: "productionVolume",
        costPerDefect: "defectCostPerUnit"
      }, outputId: "defectCostAnnual" },
    { formulaId: "cost.poka_yoke_cost", inputMap: {
        deviceCost: "pokaYokeInvestment"
      ,
        installationCost: "installationCost",
        trainingCost: "trainingCost"}, outputId: "pokaYokeCost" },
    { formulaId: "measurement.new_defect_rate", inputMap: {
        currentDefectRate: "newDefectRate"
      ,
        reductionFactor: "reductionFactor"}, outputId: "newDefectRate" },
    { formulaId: "cost.poka_yoke_savings", inputMap: {
        currentDefectRate: "currentDefectRate",
        newDefectRate: "newDefectRate",
        annualVolume: "defectCostAnnual"
      ,
        costPerDefect: "costPerDefect"}, outputId: "pokaYokeSavings" },
    { formulaId: "cost.poka_yoke_roi", inputMap: { pokaYokeSavings: "pokaYokeSavings", pokaYokeCost: "pokaYokeCost", usefulLife: "usefulLife" }, outputId: "pokaYokeRoi" },
    { formulaId: "cost.poka_yoke_payback", inputMap: { pokaYokeCost: "pokaYokeCost", pokaYokeSavings: "pokaYokeSavings" }, outputId: "pokaYokePayback" },
  ],
  reportTemplate: { title: "Poka-Yoke ROI Analysis Report", title_i18n: {"en":"Poka-Yoke ROI Analysis Report"}, sections: ["executive_summary", "thresholds", "action_plan", "assumptions"], exportFormats: ["pdf", "excel"] },
  assumptions: { hiddenLossMultiplier: 1.0, volatilityPercent: 10, targetMarginPercent: 15, assumptionNotes: ["Hata maliyeti = hacim × hata oranı × birim maliyet.", "Tasarruf = eski hata - yeni hata maliyeti.", "ROI = (yıllık tasarruf × ömür - yatırım) / yatırım × 100.", "Geri ödeme = yatırım / aylık tasarruf."],assumptionNotes_i18n:[{"en":"Error cost = volume × error rate × unit cost."},{"en":"Tasarruf = eski hata - yeni hata maliyeti."},{"en":"ROI = (annual savings × life - investment) / investment × 100."},{"en":"Payback = investment / monthly savings."}] },
};
