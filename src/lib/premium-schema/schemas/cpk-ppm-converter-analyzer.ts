/**
 * Tool #24 — CPK → PPM Dönüşüm
 */
import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";
export const CPK_PPM_SCHEMA: PremiumCalculatorSchema = {
  id: "cpk-ppm-converter-analyzer", legacyPaidSlug: "cpk-ppm-converter-analyzer",
  name: "CPK → PPM & Sigma Seviye Dönüştürücü", sectorSlug: "cnc-manufacturing", category: "measurement",
  painStatement: "Cpk değerini PPM ve Sigma seviyesine dönüştüremeden proses performansını yönetmek imkansızdır. Bu araç Cpk, PPM, Yield ve Sigma seviyesini tek adımda hesaplar.",
  inputs: [
    { id: "usl", label: "Üst Spesifikasyon Limiti (USL)", type: "number", unit: "", required: true, smartDefault: 10.05, validation: { min: 0 }, helper: "", expertMeaning: "Upper specification limit" },
    { id: "lsl", label: "Alt Spesifikasyon Limiti (LSL)", type: "number", unit: "", required: true, smartDefault: 9.95, validation: { min: 0 }, helper: "", expertMeaning: "Lower specification limit" },
    { id: "mean", label: "Proses Ortalaması", type: "number", unit: "", required: true, smartDefault: 10.0, validation: { min: 0 }, helper: "", expertMeaning: "Process mean" },
    { id: "stdDev", label: "Standart Sapma", type: "number", unit: "", required: true, smartDefault: 0.015, validation: { min: 0.0001 }, helper: "", expertMeaning: "Process standard deviation" },
    { id: "targetCpk", label: "Hedef Cpk", type: "number", unit: "", required: false, smartDefault: 1.67, validation: { min: 0 }, helper: "", expertMeaning: "Target Cpk level" },
    { id: "dailyVolume", label: "Günlük Üretim Hacmi", type: "number", unit: "adet", required: false, smartDefault: 1000, validation: { min: 0 }, helper: "", expertMeaning: "Daily production volume" },
  ],
  outputs: [
    { id: "zUsl", label: "Z_USL", unit: "", format: "number" },
    { id: "zLsl", label: "Z_LSL", unit: "", format: "number" },
    { id: "cpk", label: "Cpk", unit: "", format: "number" },
    { id: "totalPpm", label: "Toplam PPM", unit: "", format: "number" },
    { id: "sigmaShort", label: "Sigma Seviyesi (Kısa Dönem)", unit: "", format: "number" },
    { id: "expectedDefectsDaily", label: "Tahmini Günlük Hata", unit: "adet/gün", format: "number", isBigNumber: true },
  ],
  thresholds: [
    { fieldId: "cpk", warning: 1.33, critical: 1.0, direction: "lower_is_bad", warningMessage: "Cpk < 1.33 — proses iyileştirme gerekiyor.", criticalMessage: "Cpk < 1.0 — proses yetersiz, acil aksiyon." },
  ],
  formulaPipeline: [
    { formulaId: "measurement.cpk_z_usl", inputMap: { usl: "usl", mean: "mean", stdDev: "stdDev" }, outputId: "zUsl" },
    { formulaId: "measurement.cpk_z_lsl", inputMap: { mean: "mean", lsl: "lsl", stdDev: "stdDev" }, outputId: "zLsl" },
    { formulaId: "measurement.cpk_index", inputMap: { zUsl: "zUsl", zLsl: "zLsl" }, outputId: "cpk" },
    { formulaId: "measurement.cpk_ppm_total", inputMap: { zUsl: "zUsl", zLsl: "zLsl" }, outputId: "totalPpm" },
    { formulaId: "measurement.cpk_sigma_short", inputMap: { cpk: "cpk" }, outputId: "sigmaShort" },
  ],
  reportTemplate: { title: "Cpk & PPM Report", sections: ["executive_summary", "thresholds", "action_plan", "assumptions"], exportFormats: ["pdf", "excel"] },
  assumptions: { hiddenLossMultiplier: 1.1, volatilityPercent: 10, targetMarginPercent: 15, assumptionNotes: ["Z = (USL-Mean)/StdDev. Cpk = MIN(Z_USL,Z_LSL)/3.", "PPM uses normal CDF approximation.", "Sigma short = (Cpk×3)+1.5 (long-term shift)."] },
};
