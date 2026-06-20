/**
 * Tool — Taguchi Kalite
 */
import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";
export const TAGUCHI_QUALITY_LOSS_ANALYZER: PremiumCalculatorSchema = {
  id: "taguchi-quality-loss-analyzer", legacyPaidSlug: "taguchi-quality-loss-analyzer",
  name: "Taguchi Kalite Kaybı Analizi", sectorSlug: "quality", category: "cost",
  painStatement: "Ürün toleranslarından sapmaların maliyeti Taguchi kayıp fonksiyonu ile ölçülmezse gizli kalite kayıpları fark edilmez ve iyileştirme önceliklendirilemez.",
  inputs: [
    { id: "targetValue", label: "Hedef Değer", type: "number", unit: "", required: true, smartDefault: 10, validation: { min: 0.01 }, helper: "", expertMeaning: "Nominal target value" },
    { id: "tolerance", label: "Tolerans", type: "number", unit: "", required: true, smartDefault: 1, validation: { min: 0.01 }, helper: "", expertMeaning: "Specification tolerance (±)" },
    { id: "lossAtTolerance", label: "Tolerans Sınırında Kayıp", type: "number", unit: "USD", required: true, smartDefault: 5, validation: { min: 0.01 }, helper: "", expertMeaning: "Loss at tolerance limit" },
    { id: "processMean", label: "Süreç Ortalaması", type: "number", unit: "", required: true, smartDefault: 10.3, validation: { min: 0.01 }, helper: "", expertMeaning: "Actual process mean" },
    { id: "processStdDev", label: "Süreç Standart Sapması", type: "number", unit: "", required: true, smartDefault: 0.4, validation: { min: 0.001 }, helper: "", expertMeaning: "Process standard deviation" },
    { id: "annualProductionVolume", label: "Yıllık Üretim Miktarı", type: "number", unit: "adet", required: true, smartDefault: 100000, validation: { min: 1 }, helper: "", expertMeaning: "Annual production volume" },
    { id: "specLower", label: "Alt Spesifikasyon Limiti", type: "number", unit: "", required: false, smartDefault: 9, validation: { min: 0.01 }, helper: "", expertMeaning: "Lower specification limit" },
    { id: "specUpper", label: "Üst Spesifikasyon Limiti", type: "number", unit: "", required: false, smartDefault: 11, validation: { min: 0.01 }, helper: "", expertMeaning: "Upper specification limit" },
  ],
  outputs: [
    { id: "taguchiLossPerUnit", label: "Birim Başına Taguchi Kaybı", unit: "USD/adet", format: "currency" },
  ],
  thresholds: [{ fieldId: "taguchiLossPerUnit", warning: 0.5, critical: 1, direction: "higher_is_bad", warningMessage: "Birim kayıp >$0.50 — süreç iyileştirme fırsatı var.", criticalMessage: "Birim kayıp >$1.00 — tolerans veya süç parametreleri gözden geçirilmeli." }],
  formulaPipeline: [
    { formulaId: "cost.taguchi_loss_per_unit", inputMap: { targetValue: "targetValue", tolerance: "tolerance", lossAtTolerance: "lossAtTolerance", processMean: "processMean", processStdDev: "processStdDev", annualProductionVolume: "annualProductionVolume" }, outputId: "taguchiLossPerUnit" },
  ],
  reportTemplate: { title: "Taguchi Kalite Kaybı Raporu", sections: ["executive_summary", "loss_breakdown", "thresholds", "action_plan", "assumptions"], exportFormats: ["pdf", "excel"] },
  assumptions: { hiddenLossMultiplier: 1.1, volatilityPercent: 10, targetMarginPercent: 15, assumptionNotes: ["Taguchi kayıp = k × (MSD), MSD = σ² + (μ − T)².", "k = kayıp_tolerans / tolerans² — kalite kaybı katsayısı.", "Nominal-en iyi (NTB) tipi Taguchi fonksiyonu kullanılır.", "Süreç normal dağılım varsayımı altında hesaplanır."] },
};
