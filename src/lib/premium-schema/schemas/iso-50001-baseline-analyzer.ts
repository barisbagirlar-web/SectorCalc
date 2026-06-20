/**
 * Tool #54 — ISO 50001 Baseline
 */
import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";
export const ISO50001_BASELINE_SCHEMA: PremiumCalculatorSchema = {
  id: "iso-50001-baseline-analyzer", legacyPaidSlug: "iso-50001-baseline-analyzer",
  name: "ISO 50001 Enerji Baz Çizgisi & CUSUM Analizi", sectorSlug: "sheet-metal", category: "energy",
  painStatement: "ISO 50001 kapsamında EnPI ve CUSUM analizi yapılmadan enerji performansı izlenemez ve iyileştirme kanıtlanamaz.",
  inputs: [
    { id: "totalEnergy", label: "Toplam Enerji Tüketimi", type: "number", unit: "kWh", required: true, smartDefault: 5000000, validation: { min: 0 }, helper: "", expertMeaning: "Total energy consumption" },
    { id: "productionVolume", label: "Üretim Hacmi", type: "number", unit: "ton", required: true, smartDefault: 10000, validation: { min: 0.1 }, helper: "", expertMeaning: "Production volume" },
    { id: "intercept", label: "Baz Çizgi Intercept", type: "number", unit: "kWh", required: false, smartDefault: 500000, validation: { min: 0 }, helper: "", expertMeaning: "Baseline intercept" },
    { id: "slopeProd", label: "Üretim Katsayısı", type: "number", unit: "kWh/ton", required: false, smartDefault: 400, validation: { min: 0 }, helper: "", expertMeaning: "Production coefficient" },
    { id: "slopeDegreeDay", label: "Derece Gün Katsayısı", type: "number", unit: "kWh/DD", required: false, smartDefault: 1000, validation: { min: 0 }, helper: "", expertMeaning: "Degree day coefficient" },
    { id: "degreeDays", label: "Derece Gün (DD)", type: "number", unit: "DD", required: false, smartDefault: 2000, validation: { min: 0 }, helper: "", expertMeaning: "Degree days" },
    { id: "actualConsumption", label: "Gerçek Tüketim", type: "number", unit: "kWh", required: false, smartDefault: 4800000, validation: { min: 0 }, helper: "", expertMeaning: "Actual consumption" },
    { id: "predictedConsumption", label: "Tahmini Tüketim", type: "number", unit: "kWh", required: false, smartDefault: 5100000, validation: { min: 0 }, helper: "", expertMeaning: "Predicted consumption" },
    { id: "targetReduction", label: "Hedef Azaltım", type: "number", unit: "%", required: false, smartDefault: 10, validation: { min: 0, max: 100 }, helper: "", expertMeaning: "Target reduction percentage" },
  ],
  outputs: [
    { id: "enpi", label: "EnPI (Enerji Yoğunluğu)", unit: "kWh/ton", format: "number" },
    { id: "cusum", label: "CUSUM (Gerçek-Tahmin)", unit: "kWh", format: "number" },
    { id: "savings", label: "Enerji Tasarrufu", unit: "kWh/yıl", format: "number", isBigNumber: true },
  ],
  thresholds: [{ fieldId: "enpi", warning: 550, critical: 650, direction: "higher_is_bad", warningMessage: "EnPI > 550 — enerji yoğunluğu yüksek, iyileştirme fırsatı var.", criticalMessage: "EnPI > 650 — enerji verimliliği kritik seviyede." }],
  formulaPipeline: [
    { formulaId: "energy.enpi", inputMap: { totalEnergy: "totalEnergy", productionVolume: "productionVolume" }, outputId: "enpi" },
    { formulaId: "energy.cusum", inputMap: { actualConsumption: "actualConsumption", predictedConsumption: "predictedConsumption" }, outputId: "cusum" },
    { formulaId: "energy.energy_savings", inputMap: { predictedConsumption: "predictedConsumption", actualConsumption: "actualConsumption" }, outputId: "savings" },
  ],
  reportTemplate: { title: "ISO 50001 Baseline Report", sections: ["executive_summary", "thresholds", "action_plan", "assumptions"], exportFormats: ["pdf", "excel"] },
  assumptions: { hiddenLossMultiplier: 1.15, volatilityPercent: 15, targetMarginPercent: 20, assumptionNotes: ["EnPI = Energy/Volume.", "Baseline = Intercept + Slope₁×Prod + Slope₂×DD.", "CUSUM = Actual - Predicted. Savings = Predicted - Actual."] },
};
