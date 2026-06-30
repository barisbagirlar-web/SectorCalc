/**
 * Tool #24 — Noise & Vibration Maliyet
 */
import type { PremiumCalculatorSchema } from "@/lib/features/premium-schema/premium-calculator-schema";
export const NOISE_VIBRATION_COST_SCHEMA: PremiumCalculatorSchema = {
  id: "noise-vibration-cost-analyzer", legacyPaidSlug: "noise-vibration-cost-analyzer",
  name: "Noise & Vibration Maliyet Analizi", name_i18n: {"en":"Noise & Vibration Maliyet Analizi","tr":"Noise & Vibration Maliyet Analizi"}, sectorSlug: "quality", category: "cost",
  painStatement: "Gürültü ve titreşim maruziyetinin sağlık, verimlilik ve kalite maliyeti hesaplanmazsa iyileştirme yatırımı için fizibilite kurulamaz.", painStatement_i18n: {"en":"Gürültü ve titreşim maruziyetinin sağlık, verimlilik ve kalite maliyeti hesaplanmazsa iyileştirme yatırımı için fizibilite kurulamaz.","tr":"Gürültü ve titreşim maruziyetinin sağlık, verimlilik ve kalite maliyeti hesaplanmazsa iyileştirme yatırımı için fizibilite kurulamaz."},
  inputs: [
    { id: "noiseLevelDb", label: "Gürültü Seviyesi", label_i18n: {"en":"Noise exposure level","tr":"Gürültü Seviyesi"}, type: "number", unit: "dB(A)", required: true, smartDefault: 88, validation: { min: 30, max: 130 }, helper: "", expertMeaning: "Noise exposure level", expertMeaning_i18n: {"en":"Noise exposure level","tr":"gürültü seviyesi"} },
    { id: "exposureHours", label: "Günlük Maruziyet Süresi", label_i18n: {"en":"Daily exposure hours","tr":"Günlük Maruziyet Süresi"}, type: "number", unit: "saat/gün", required: true, smartDefault: 8, validation: { min: 0.5, max: 16 }, helper: "", expertMeaning: "Daily exposure hours", expertMeaning_i18n: {"en":"Daily exposure hours","tr":"günlük maruziyet süresi"} },
    { id: "numWorkers", label: "Maruz Kalan Çalışan Sayısı", label_i18n: {"en":"Number of exposed workers","tr":"Maruz Kalan Çalışan Sayısı"}, type: "number", unit: "kişi", required: true, smartDefault: 15, validation: { min: 1 }, helper: "", expertMeaning: "Number of exposed workers", expertMeaning_i18n: {"en":"Number of exposed workers","tr":"maruz kalan çalışan sayısı"} },
    { id: "vibrationRms", label: "Titreşim RMS Değeri", label_i18n: {"en":"Vibration RMS level","tr":"Titreşim RMS Değeri"}, type: "number", unit: "m/s²", required: true, smartDefault: 2.5, validation: { min: 0, max: 50 }, helper: "", expertMeaning: "Vibration RMS level", expertMeaning_i18n: {"en":"Vibration RMS level","tr":"titreşim rms değeri"} },
    { id: "vibrationDailyHours", label: "Titreşim Günlük Süre", label_i18n: {"en":"Daily vibration exposure hours","tr":"Titreşim Günlük Süre"}, type: "number", unit: "saat/gün", required: false, smartDefault: 4, validation: { min: 0.1, max: 16 }, helper: "", expertMeaning: "Daily vibration exposure hours", expertMeaning_i18n: {"en":"Daily vibration exposure hours","tr":"titreşim günlük süre"} },
    { id: "avgWorkerSalary", label: "Ortalama Çalışan Maaşı", label_i18n: {"en":"Average annual salary","tr":"Ortalama Çalışan Maaşı"}, type: "number", unit: "USD/yıl", required: true, smartDefault: 35000, validation: { min: 1 }, helper: "", expertMeaning: "Average annual salary", expertMeaning_i18n: {"en":"Average annual salary","tr":"ortalama çalışan maaşı"} },
    { id: "mitigationInvestment", label: "Azaltma Yatırımı", label_i18n: {"en":"Noise/vibration mitigation cost","tr":"Azaltma Yatırımı"}, type: "number", unit: "USD", required: false, smartDefault: 40000, validation: { min: 0 }, helper: "", expertMeaning: "Noise/vibration mitigation cost", expertMeaning_i18n: {"en":"Noise/vibration mitigation cost","tr":"azaltma yatırımı"} },
  ],
  outputs: [
    { id: "noiseExposure", label: "Gürültü Maruziyet Skoru", label_i18n: {"en":"Gurultu Maruziyet Skoru","tr":"Gürültü Maruziyet Skoru"}, unit: "dB(A)×saat", format: "number" },
    { id: "vibrationLevel", label: "Titreşim Seviyesi", label_i18n: {"en":"Titresim Seviyesi","tr":"Titreşim Seviyesi"}, unit: "m/s²", format: "number" },
    { id: "healthCost", label: "Sağlık Maliyeti (Gürültü)", label_i18n: {"en":"Saglk Maliyeti (Gurultu)","tr":"Sağlık Maliyeti (Gürültü)"}, unit: "USD/yıl", format: "currency" },
    { id: "productivityLoss", label: "Verimlilik Kaybı", label_i18n: {"en":"Verimlilik Kayb","tr":"Verimlilik Kaybı"}, unit: "USD/yıl", format: "currency" },
    { id: "reworkCost", label: "Hata/Revizyon Maliyeti", label_i18n: {"en":"Hata/Revizyon Maliyeti","tr":"Hata/Revizyon Maliyeti"}, unit: "USD/yıl", format: "currency" },
    { id: "mitigationRoi", label: "Azaltma ROI", label_i18n: {"en":"Azaltma ROI","tr":"Azaltma ROI"}, unit: "%", format: "number", isBigNumber: true },
  ],
  thresholds: [{ fieldId: "mitigationRoi", warning: 50, critical: 20, direction: "lower_is_bad", warningMessage: "ROI < %50 — yatırım fizibilitesi riskli.", warningMessage_i18n: {"en":"ROI < %50 — yatırım fizibilitesi riskli.","tr":"ROI < %50 — yatırım fizibilitesi riskli."}, criticalMessage: "ROI < %20 — azaltma yatırımı önerilmez.", criticalMessage_i18n: {"en":"ROI < %20 — azaltma yatırımı önerilmez.","tr":"ROI < %20 — azaltma yatırımı önerilmez."} }],
  formulaPipeline: [
    { formulaId: "measurement.noise_exposure", inputMap: { noiseLevelDb: "noiseLevelDb", exposureHours: "exposureHours" }, outputId: "noiseExposure" },
    { formulaId: "measurement.vibration_rms", inputMap: { vibrationRms: "vibrationRms", vibrationDailyHours: "vibrationDailyHours" }, outputId: "vibrationLevel" },
    { formulaId: "cost.noise_health_cost", inputMap: { noiseExposure: "noiseExposure", numWorkers: "numWorkers", avgWorkerSalary: "avgWorkerSalary" }, outputId: "healthCost" },
    { formulaId: "cost.noise_productivity_loss", inputMap: { noiseLevelDb: "noiseLevelDb", numWorkers: "numWorkers", avgWorkerSalary: "avgWorkerSalary" }, outputId: "productivityLoss" },
    { formulaId: "cost.noise_rework_cost", inputMap: { noiseLevelDb: "noiseLevelDb", vibrationLevel: "vibrationLevel", avgWorkerSalary: "avgWorkerSalary", numWorkers: "numWorkers" }, outputId: "reworkCost" },
    { formulaId: "cost.noise_mitigation_roi", inputMap: {
        healthCost: "healthCost",
        productivityLoss: "productivityLoss",
        reworkCost: "reworkCost",
        mitigationInvestment: "mitigationInvestment"
      }, outputId: "mitigationRoi" },
  ],
  reportTemplate: { title: "Noise & Vibration Cost Report", title_i18n: {"en":"Noise & Vibration Cost Report","tr":"Noise & Vibration Cost Report"}, sections: ["executive_summary", "thresholds", "action_plan", "assumptions"], exportFormats: ["pdf", "excel"] },
  assumptions: { hiddenLossMultiplier: 1.1, volatilityPercent: 10, targetMarginPercent: 15, assumptionNotes: ["85 dB(A) üzeri gürültü sağlık riski oluşturur.", "Titreşim RMS > 2.5 m/s² el-kol vibrasyon riski.", "Sağlık maliyeti = işitme kaybı + tazminat riski."],assumptionNotes_i18n:[{"en":"85 dB(A) üzeri gürültü sağlık riski oluşturur.","tr":"85 dB(A) üzeri gürültü sağlık riski oluşturur."},{"en":"Titreşim RMS > 2.5 m/s² el-kol vibrasyon riski.","tr":"Titreşim RMS > 2.5 m/s² el-kol vibrasyon riski."},{"en":"Sağlık maliyeti = işitme kaybı + tazminat riski.","tr":"Sağlık maliyeti = işitme kaybı + tazminat riski."}] },
};
