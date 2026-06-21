/**
 * Tool #34 — Poka-Yoke ROI Analizi
 */
import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";
export const POKA_YOKE_ROI_ANALYZER_SCHEMA: PremiumCalculatorSchema = {
  id: "poka-yoke-roi-analyzer", legacyPaidSlug: "poka-yoke-roi-analyzer",
  name: "Poka-Yoke Yatırım Getirisi", name_i18n: {"en":"Poka-Yoke Yatırım Getirisi","tr":"Poka-Yoke Yatırım Getirisi"}, sectorSlug: "quality", category: "cost",
  painStatement: "Hata önleme (Poka-Yoke) yatırımının geri dönüşü hesaplanmazsa kalite iyileştirme bütçesi verimsiz kullanılabilir.", painStatement_i18n: {"en":"Hata önleme (Poka-Yoke) yatırımının geri dönüşü hesaplanmazsa kalite iyileştirme bütçesi verimsiz kullanılabilir.","tr":"Hata önleme (Poka-Yoke) yatırımının geri dönüşü hesaplanmazsa kalite iyileştirme bütçesi verimsiz kullanılabilir."},
  inputs: [
    { id: "currentDefectRate", label: "Mevcut Hata Oranı", label_i18n: {"en":"Mevcut Hata Oranı","tr":"Mevcut Hata Oranı"}, type: "number", unit: "%", required: true, smartDefault: 5, validation: { min: 0.01 }, helper: "", expertMeaning: "Current defect rate percentage", expertMeaning_i18n: {"en":"Current defect rate percentage","tr":"Current defect rate percentage"} },
    { id: "productionVolume", label: "Üretim Hacmi", label_i18n: {"en":"Üretim Hacmi","tr":"Üretim Hacmi"}, type: "number", unit: "adet/yıl", required: true, smartDefault: 100000, validation: { min: 1 }, helper: "", expertMeaning: "Annual production volume", expertMeaning_i18n: {"en":"Annual production volume","tr":"Annual production volume"} },
    { id: "defectCostPerUnit", label: "Birim Hata Maliyeti", label_i18n: {"en":"Birim Hata Maliyeti","tr":"Birim Hata Maliyeti"}, type: "number", unit: "USD", required: true, smartDefault: 15, validation: { min: 0.01 }, helper: "", expertMeaning: "Cost per defective unit", expertMeaning_i18n: {"en":"Cost per defective unit","tr":"Cost per defective unit"} },
    { id: "pokaYokeInvestment", label: "Poka-Yoke Yatırımı", label_i18n: {"en":"Poka-Yoke Yatırımı","tr":"Poka-Yoke Yatırımı"}, type: "number", unit: "USD", required: true, smartDefault: 25000, validation: { min: 1 }, helper: "", expertMeaning: "Total Poka-Yoke implementation cost", expertMeaning_i18n: {"en":"Total Poka-Yoke implementation cost","tr":"Total Poka-Yoke implementation cost"} },
    { id: "newDefectRate", label: "Hedef Hata Oranı", label_i18n: {"en":"Hedef Hata Oranı","tr":"Hedef Hata Oranı"}, type: "number", unit: "%", required: true, smartDefault: 1, validation: { min: 0 }, helper: "", expertMeaning: "Target defect rate after Poka-Yoke", expertMeaning_i18n: {"en":"Target defect rate after Poka-Yoke","tr":"Target defect rate after Poka-Yoke"} },
    { id: "usefulLife", label: "Faydalı Ömür", label_i18n: {"en":"Faydalı Ömür","tr":"Faydalı Ömür"}, type: "number", unit: "yıl", required: false, smartDefault: 5, validation: { min: 1 }, helper: "", expertMeaning: "Expected useful life of solution", expertMeaning_i18n: {"en":"Expected useful life of solution","tr":"Expected useful life of solution"} },
  ],
  outputs: [
    { id: "currentDefectRate", label: "Mevcut Hata Oranı", label_i18n: {"en":"Mevcut Hata Oranı","tr":"Mevcut Hata Oranı"}, unit: "%", format: "number" },
    { id: "defectCostAnnual", label: "Yıllık Hata Maliyeti", label_i18n: {"en":"Yıllık Hata Maliyeti","tr":"Yıllık Hata Maliyeti"}, unit: "USD/yıl", format: "currency", isBigNumber: true },
    { id: "pokaYokeCost", label: "Poka-Yoke Maliyeti", label_i18n: {"en":"Poka-Yoke Maliyeti","tr":"Poka-Yoke Maliyeti"}, unit: "USD", format: "currency" },
    { id: "newDefectRate", label: "Yeni Hata Oranı", label_i18n: {"en":"Yeni Hata Oranı","tr":"Yeni Hata Oranı"}, unit: "%", format: "number" },
    { id: "pokaYokeSavings", label: "Yıllık Tasarruf", label_i18n: {"en":"Yıllık Tasarruf","tr":"Yıllık Tasarruf"}, unit: "USD/yıl", format: "currency", isBigNumber: true },
    { id: "pokaYokeRoi", label: "Yatırım Getirisi (ROI)", label_i18n: {"en":"Yatırım Getirisi (ROI)","tr":"Yatırım Getirisi (ROI)"}, unit: "%", format: "number" },
    { id: "pokaYokePayback", label: "Geri Ödeme Süresi", label_i18n: {"en":"Geri Ödeme Süresi","tr":"Geri Ödeme Süresi"}, unit: "ay", format: "number" },
  ],
  thresholds: [{ fieldId: "pokaYokeRoi", warning: 50, critical: 20, direction: "lower_is_bad", warningMessage: "ROI < %50 — yatırım fizibilitesi sorgulanmalı.", warningMessage_i18n: {"en":"ROI < %50 — yatırım fizibilitesi sorgulanmalı.","tr":"ROI < %50 — yatırım fizibilitesi sorgulanmalı."}, criticalMessage: "ROI < %20 — Poka-Yoke yatırımı önerilmez.", criticalMessage_i18n: {"en":"ROI < %20 — Poka-Yoke yatırımı önerilmez.","tr":"ROI < %20 — Poka-Yoke yatırımı önerilmez."} }],
  formulaPipeline: [
    { formulaId: "measurement.current_defect_rate", inputMap: { currentDefectRate: "currentDefectRate" }, outputId: "currentDefectRate" },
    { formulaId: "cost.defect_cost_annual", inputMap: { productionVolume: "productionVolume", currentDefectRate: "currentDefectRate", defectCostPerUnit: "defectCostPerUnit" }, outputId: "defectCostAnnual" },
    { formulaId: "cost.poka_yoke_cost", inputMap: { pokaYokeInvestment: "pokaYokeInvestment" }, outputId: "pokaYokeCost" },
    { formulaId: "measurement.new_defect_rate", inputMap: { newDefectRate: "newDefectRate" }, outputId: "newDefectRate" },
    { formulaId: "cost.poka_yoke_savings", inputMap: { defectCostAnnual: "defectCostAnnual", currentDefectRate: "currentDefectRate", newDefectRate: "newDefectRate" }, outputId: "pokaYokeSavings" },
    { formulaId: "cost.poka_yoke_roi", inputMap: { pokaYokeSavings: "pokaYokeSavings", pokaYokeCost: "pokaYokeCost", usefulLife: "usefulLife" }, outputId: "pokaYokeRoi" },
    { formulaId: "cost.poka_yoke_payback", inputMap: { pokaYokeCost: "pokaYokeCost", pokaYokeSavings: "pokaYokeSavings" }, outputId: "pokaYokePayback" },
  ],
  reportTemplate: { title: "Poka-Yoke ROI Analysis Report", title_i18n: {"en":"Poka-Yoke ROI Analysis Report","tr":"Poka-Yoke ROI Analysis Report"}, sections: ["executive_summary", "thresholds", "action_plan", "assumptions"], exportFormats: ["pdf", "excel"] },
  assumptions: { hiddenLossMultiplier: 1.0, volatilityPercent: 10, targetMarginPercent: 15, assumptionNotes: ["Hata maliyeti = hacim × hata oranı × birim maliyet.", "Tasarruf = eski hata - yeni hata maliyeti.", "ROI = (yıllık tasarruf × ömür - yatırım) / yatırım × 100.", "Geri ödeme = yatırım / aylık tasarruf."],assumptionNotes_i18n:[{"en":"Hata maliyeti = hacim × hata oranı × birim maliyet.","tr":"Hata maliyeti = hacim × hata oranı × birim maliyet."},{"en":"Tasarruf = eski hata - yeni hata maliyeti.","tr":"Tasarruf = eski hata - yeni hata maliyeti."},{"en":"ROI = (yıllık tasarruf × ömür - yatırım) / yatırım × 100.","tr":"ROI = (yıllık tasarruf × ömür - yatırım) / yatırım × 100."},{"en":"Geri ödeme = yatırım / aylık tasarruf.","tr":"Geri ödeme = yatırım / aylık tasarruf."}] },
};
