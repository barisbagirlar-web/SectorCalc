/**
 * Tool #24 — CPK → PPM Dönüşüm
 */
import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";
export const CPK_PPM_SCHEMA: PremiumCalculatorSchema = {
  id: "cpk-ppm-converter-analyzer", legacyPaidSlug: "cpk-ppm-converter-analyzer",
  name: "CPK → PPM & Sigma Seviye Dönüştürücü", name_i18n: {"en":"CPK → PPM & Sigma Seviye Donusturucu","tr":"CPK → PPM & Sigma Seviye Dönüştürücü"}, sectorSlug: "cnc-manufacturing", category: "measurement",
  painStatement: "Cpk değerini PPM ve Sigma seviyesine dönüştüremeden proses performansını yönetmek imkansızdır. Bu araç Cpk, PPM, Yield ve Sigma seviyesini tek adımda hesaplar.", painStatement_i18n: {"en":"Cpk değerini PPM ve Sigma seviyesine dönüştüremeden proses performansını yönetmek imkansızdır. Bu araç Cpk, PPM, Yield ve Sigma seviyesini tek adımda hesaplar.","tr":"Cpk değerini PPM ve Sigma seviyesine dönüştüremeden proses performansını yönetmek imkansızdır. Bu araç Cpk, PPM, Yield ve Sigma seviyesini tek adımda hesaplar."},
  inputs: [
    { id: "usl", label: "Üst Spesifikasyon Limiti (USL)", label_i18n: {"en":"Upper specification limit","tr":"Üst Spesifikasyon Limiti (USL)"}, type: "number", unit: "", required: true, smartDefault: 10.05, validation: { min: 0 }, helper: "", expertMeaning: "Upper specification limit", expertMeaning_i18n: {"en":"Upper specification limit","tr":"üst spesifikasyon limiti (usl)"} },
    { id: "lsl", label: "Alt Spesifikasyon Limiti (LSL)", label_i18n: {"en":"Alt Spesifikasyon Limiti (LSL)","tr":"Alt Spesifikasyon Limiti (LSL)"}, type: "number", unit: "", required: true, smartDefault: 9.95, validation: { min: 0 }, helper: "", expertMeaning: "Lower specification limit", expertMeaning_i18n: {"en":"Lower specification limit","tr":"Lower specification limit"} },
    { id: "mean", label: "Proses Ortalaması", label_i18n: {"en":"Process mean","tr":"Proses Ortalaması"}, type: "number", unit: "", required: true, smartDefault: 10.0, validation: { min: 0 }, helper: "", expertMeaning: "Process mean", expertMeaning_i18n: {"en":"Process mean","tr":"proses ortalaması"} },
    { id: "stdDev", label: "Standart Sapma", label_i18n: {"en":"Standart Sapma","tr":"Standart Sapma"}, type: "number", unit: "", required: true, smartDefault: 0.015, validation: { min: 0.0001 }, helper: "", expertMeaning: "Process standard deviation", expertMeaning_i18n: {"en":"Process standard deviation","tr":"Process standard deviation"} },
    { id: "targetCpk", label: "Hedef Cpk", label_i18n: {"en":"Hedef Cpk","tr":"Hedef Cpk"}, type: "number", unit: "", required: false, smartDefault: 1.67, validation: { min: 0 }, helper: "", expertMeaning: "Target Cpk level", expertMeaning_i18n: {"en":"Target Cpk level","tr":"Target Cpk level"} },
    { id: "dailyVolume", label: "Günlük Üretim Hacmi", label_i18n: {"en":"Daily production volume","tr":"Günlük Üretim Hacmi"}, type: "number", unit: "adet", required: false, smartDefault: 1000, validation: { min: 0 }, helper: "", expertMeaning: "Daily production volume", expertMeaning_i18n: {"en":"Daily production volume","tr":"günlük üretim hacmi"} },
  ],
  outputs: [
    { id: "zUsl", label: "Z_USL", label_i18n: {"en":"Z_USL","tr":"Z_USL"}, unit: "", format: "number" },
    { id: "zLsl", label: "Z_LSL", label_i18n: {"en":"Z_LSL","tr":"Z_LSL"}, unit: "", format: "number" },
    { id: "cpk", label: "Cpk", label_i18n: {"en":"Cpk","tr":"Cpk"}, unit: "", format: "number" },
    { id: "totalPpm", label: "Toplam PPM", label_i18n: {"en":"Toplam PPM","tr":"Toplam PPM"}, unit: "", format: "number" },
    { id: "sigmaShort", label: "Sigma Seviyesi (Kısa Dönem)", label_i18n: {"en":"Sigma Seviyesi (Ksa Donem)","tr":"Sigma Seviyesi (Kısa Dönem)"}, unit: "", format: "number" },
    { id: "expectedDefectsDaily", label: "Tahmini Günlük Hata", label_i18n: {"en":"Tahmini Gunluk Hata","tr":"Tahmini Günlük Hata"}, unit: "adet/gün", format: "number", isBigNumber: true },
  ],
  thresholds: [
    { fieldId: "cpk", warning: 1.33, critical: 1.0, direction: "lower_is_bad", warningMessage: "Cpk < 1.33 — proses iyileştirme gerekiyor.", warningMessage_i18n: {"en":"Cpk < 1.33 — proses iyileştirme gerekiyor.","tr":"Cpk < 1.33 — proses iyileştirme gerekiyor."}, criticalMessage: "Cpk < 1.0 — proses yetersiz, acil aksiyon.", criticalMessage_i18n: {"en":"Cpk < 1.0 — proses yetersiz, acil aksiyon.","tr":"Cpk < 1.0 — proses yetersiz, acil aksiyon."} },
  ],
  formulaPipeline: [
    { formulaId: "measurement.cpk_z_usl", inputMap: { usl: "usl", mean: "mean", stdDev: "stdDev" }, outputId: "zUsl" },
    { formulaId: "measurement.cpk_z_lsl", inputMap: { mean: "mean", lsl: "lsl", stdDev: "stdDev" }, outputId: "zLsl" },
    { formulaId: "measurement.cpk_index", inputMap: { zUsl: "zUsl", zLsl: "zLsl" }, outputId: "cpk" },
    { formulaId: "measurement.cpk_ppm_total", inputMap: { zUsl: "zUsl", zLsl: "zLsl" }, outputId: "totalPpm" },
    { formulaId: "measurement.cpk_sigma_short", inputMap: { cpk: "cpk" }, outputId: "sigmaShort" },
  ],
  reportTemplate: { title: "Cpk & PPM Report", title_i18n: {"en":"Cpk & PPM Report","tr":"Cpk & PPM Report"}, sections: ["executive_summary", "thresholds", "action_plan", "assumptions"], exportFormats: ["pdf", "excel"] },
  assumptions: { hiddenLossMultiplier: 1.1, volatilityPercent: 10, targetMarginPercent: 15, assumptionNotes: ["Z = (USL-Mean)/StdDev. Cpk = MIN(Z_USL,Z_LSL)/3.", "PPM uses normal CDF approximation.", "Sigma short = (Cpk×3)+1.5 (long-term shift)."],assumptionNotes_i18n:[{"en":"Z = (USL-Mean)/StdDev. Cpk = MIN(Z_USL,Z_LSL)/3.","tr":"Z = (USL-Mean)/StdDev. Cpk = MIN(Z_USL,Z_LSL)/3."},{"en":"PPM uses normal CDF approximation.","tr":"PPM uses normal CDF approximation."},{"en":"Sigma short = (Cpk×3)+1.5 (long-term shift).","tr":"Sigma short = (Cpk×3)+1.5 (long-term shift)."}] },
};
