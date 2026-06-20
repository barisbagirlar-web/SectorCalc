/**
 * Tool #24 — Noise & Vibration Maliyet
 */
import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";
export const NOISE_VIBRATION_COST_SCHEMA: PremiumCalculatorSchema = {
  id: "noise-vibration-cost-analyzer", legacyPaidSlug: "noise-vibration-cost-analyzer",
  name: "Noise & Vibration Maliyet Analizi", sectorSlug: "quality", category: "cost",
  painStatement: "Gürültü ve titreşim maruziyetinin sağlık, verimlilik ve kalite maliyeti hesaplanmazsa iyileştirme yatırımı için fizibilite kurulamaz.",
  inputs: [
    { id: "noiseLevelDb", label: "Gürültü Seviyesi", type: "number", unit: "dB(A)", required: true, smartDefault: 88, validation: { min: 30, max: 130 }, helper: "", expertMeaning: "Noise exposure level" },
    { id: "exposureHours", label: "Günlük Maruziyet Süresi", type: "number", unit: "saat/gün", required: true, smartDefault: 8, validation: { min: 0.5, max: 16 }, helper: "", expertMeaning: "Daily exposure hours" },
    { id: "numWorkers", label: "Maruz Kalan Çalışan Sayısı", type: "number", unit: "kişi", required: true, smartDefault: 15, validation: { min: 1 }, helper: "", expertMeaning: "Number of exposed workers" },
    { id: "vibrationRms", label: "Titreşim RMS Değeri", type: "number", unit: "m/s²", required: true, smartDefault: 2.5, validation: { min: 0, max: 50 }, helper: "", expertMeaning: "Vibration RMS level" },
    { id: "vibrationDailyHours", label: "Titreşim Günlük Süre", type: "number", unit: "saat/gün", required: false, smartDefault: 4, validation: { min: 0.1, max: 16 }, helper: "", expertMeaning: "Daily vibration exposure hours" },
    { id: "avgWorkerSalary", label: "Ortalama Çalışan Maaşı", type: "number", unit: "USD/yıl", required: true, smartDefault: 35000, validation: { min: 1 }, helper: "", expertMeaning: "Average annual salary" },
    { id: "mitigationInvestment", label: "Azaltma Yatırımı", type: "number", unit: "USD", required: false, smartDefault: 40000, validation: { min: 0 }, helper: "", expertMeaning: "Noise/vibration mitigation cost" },
  ],
  outputs: [
    { id: "noiseExposure", label: "Gürültü Maruziyet Skoru", unit: "dB(A)×saat", format: "number" },
    { id: "vibrationLevel", label: "Titreşim Seviyesi", unit: "m/s²", format: "number" },
    { id: "healthCost", label: "Sağlık Maliyeti (Gürültü)", unit: "USD/yıl", format: "currency" },
    { id: "productivityLoss", label: "Verimlilik Kaybı", unit: "USD/yıl", format: "currency" },
    { id: "reworkCost", label: "Hata/Revizyon Maliyeti", unit: "USD/yıl", format: "currency" },
    { id: "mitigationRoi", label: "Azaltma ROI", unit: "%", format: "number", isBigNumber: true },
  ],
  thresholds: [{ fieldId: "mitigationRoi", warning: 50, critical: 20, direction: "lower_is_bad", warningMessage: "ROI < %50 — yatırım fizibilitesi riskli.", criticalMessage: "ROI < %20 — azaltma yatırımı önerilmez." }],
  formulaPipeline: [
    { formulaId: "measurement.noise_exposure", inputMap: { noiseLevelDb: "noiseLevelDb", exposureHours: "exposureHours" }, outputId: "noiseExposure" },
    { formulaId: "measurement.vibration_rms", inputMap: { vibrationRms: "vibrationRms", vibrationDailyHours: "vibrationDailyHours" }, outputId: "vibrationLevel" },
    { formulaId: "cost.noise_health_cost", inputMap: { noiseExposure: "noiseExposure", numWorkers: "numWorkers", avgWorkerSalary: "avgWorkerSalary" }, outputId: "healthCost" },
    { formulaId: "cost.noise_productivity_loss", inputMap: { noiseLevelDb: "noiseLevelDb", numWorkers: "numWorkers", avgWorkerSalary: "avgWorkerSalary" }, outputId: "productivityLoss" },
    { formulaId: "cost.noise_rework_cost", inputMap: { noiseLevelDb: "noiseLevelDb", vibrationLevel: "vibrationLevel", avgWorkerSalary: "avgWorkerSalary", numWorkers: "numWorkers" }, outputId: "reworkCost" },
    { formulaId: "cost.noise_mitigation_roi", inputMap: { healthCost: "healthCost", productivityLoss: "productivityLoss", reworkCost: "reworkCost", mitigationInvestment: "mitigationInvestment" }, outputId: "mitigationRoi" },
  ],
  reportTemplate: { title: "Noise & Vibration Cost Report", sections: ["executive_summary", "thresholds", "action_plan", "assumptions"], exportFormats: ["pdf", "excel"] },
  assumptions: { hiddenLossMultiplier: 1.1, volatilityPercent: 10, targetMarginPercent: 15, assumptionNotes: ["85 dB(A) üzeri gürültü sağlık riski oluşturur.", "Titreşim RMS > 2.5 m/s² el-kol vibrasyon riski.", "Sağlık maliyeti = işitme kaybı + tazminat riski."] },
};
