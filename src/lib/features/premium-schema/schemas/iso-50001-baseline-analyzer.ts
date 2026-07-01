/**
 * Tool #54 — ISO 50001 Baseline
 */
import type { PremiumCalculatorSchema } from "@/lib/features/premium-schema/premium-calculator-schema";
export const ISO50001_BASELINE_SCHEMA: PremiumCalculatorSchema = {
  id: "iso-50001-baseline-analyzer", legacyPaidSlug: "iso-50001-baseline-analyzer",
  name: "ISO 50001 Enerji Baz Çizgisi & CUSUM Analizi", name_i18n: {"en":"ISO 50001 Energy Baseline & CUSUM Analyzer","tr":"ISO 50001 Enerji Baz Çizgisi & CUSUM Analizi"}, sectorSlug: "sheet-metal", category: "energy",
  painStatement: "ISO 50001 kapsamında EnPI ve CUSUM analizi yapılmadan enerji performansı izlenemez ve iyileştirme kanıtlanamaz.", painStatement_i18n: {"en":"ISO 50001 kapsamında EnPI ve CUSUM analizi yapılmadan enerji performansı izlenemez ve iyileştirme kanıtlanamaz.","tr":"ISO 50001 kapsamında EnPI ve CUSUM analizi yapılmadan enerji performansı izlenemez ve iyileştirme kanıtlanamaz."},
  inputs: [
    { id: "totalEnergy", label: "Toplam Enerji Tüketimi", label_i18n: {"en":"Total energy consumption","tr":"Toplam Enerji Tüketimi"}, type: "number", unit: "kWh", required: true, smartDefault: 5000000, validation: { min: 0 }, helper: "", expertMeaning: "Total energy consumption", expertMeaning_i18n: {"en":"Total energy consumption","tr":"toplam enerji tüketimi"} },
    { id: "productionVolume", label: "Üretim Hacmi", label_i18n: {"en":"Production volume","tr":"Üretim Hacmi"}, type: "number", unit: "ton", required: true, smartDefault: 10000, validation: { min: 0.1 }, helper: "", expertMeaning: "Production volume", expertMeaning_i18n: {"en":"Production volume","tr":"üretim hacmi"} },
    { id: "intercept", label: "Baz Çizgi Intercept", label_i18n: {"en":"Baseline intercept","tr":"Baz Çizgi Intercept"}, type: "number", unit: "kWh", required: false, smartDefault: 500000, validation: { min: 0 }, helper: "", expertMeaning: "Baseline intercept", expertMeaning_i18n: {"en":"Baseline intercept","tr":"baz çizgi intercept"} },
    { id: "slopeProd", label: "Üretim Katsayısı", label_i18n: {"en":"Production coefficient","tr":"Üretim Katsayısı"}, type: "number", unit: "kWh/ton", required: false, smartDefault: 400, validation: { min: 0 }, helper: "", expertMeaning: "Production coefficient", expertMeaning_i18n: {"en":"Production coefficient","tr":"üretim katsayısı"} },
    { id: "slopeDegreeDay", label: "Derece Gün Katsayısı", label_i18n: {"en":"Degree day coefficient","tr":"Derece Gün Katsayısı"}, type: "number", unit: "kWh/DD", required: false, smartDefault: 1000, validation: { min: 0 }, helper: "", expertMeaning: "Degree day coefficient", expertMeaning_i18n: {"en":"Degree day coefficient","tr":"derece gün katsayısı"} },
    { id: "degreeDays", label: "Derece Gün (DD)", label_i18n: {"en":"Degree days","tr":"Derece Gün (DD)"}, type: "number", unit: "DD", required: false, smartDefault: 2000, validation: { min: 0 }, helper: "", expertMeaning: "Degree days", expertMeaning_i18n: {"en":"Degree days","tr":"derece gün (dd)"} },
    { id: "actualConsumption", label: "Gerçek Tüketim", label_i18n: {"en":"Actual consumption","tr":"Gerçek Tüketim"}, type: "number", unit: "kWh", required: false, smartDefault: 4800000, validation: { min: 0 }, helper: "", expertMeaning: "Actual consumption", expertMeaning_i18n: {"en":"Actual consumption","tr":"gerçek tüketim"} },
    { id: "predictedConsumption", label: "Tahmini Tüketim", label_i18n: {"en":"Predicted consumption","tr":"Tahmini Tüketim"}, type: "number", unit: "kWh", required: false, smartDefault: 5100000, validation: { min: 0 }, helper: "", expertMeaning: "Predicted consumption", expertMeaning_i18n: {"en":"Predicted consumption","tr":"tahmini tüketim"} },
    { id: "targetReduction", label: "Hedef Azaltım", label_i18n: {"en":"Target reduction percentage","tr":"Hedef Azaltım"}, type: "number", unit: "%", required: false, smartDefault: 10, validation: { min: 0, max: 100 }, helper: "", expertMeaning: "Target reduction percentage", expertMeaning_i18n: {"en":"Target reduction percentage","tr":"hedef azaltım"} },
  ],
  outputs: [
    { id: "enpi", label: "EnPI (Enerji Yoğunluğu)", label_i18n: {"en":"EnPI (Enerji Yogunlugu)","tr":"EnPI (Enerji Yoğunluğu)"}, unit: "kWh/ton", format: "number" },
    { id: "cusum", label: "CUSUM (Gerçek-Tahmin)", label_i18n: {"en":"CUSUM (Gercek-Tahmin)","tr":"CUSUM (Gerçek-Tahmin)"}, unit: "kWh", format: "number" },
    { id: "savings", label: "Enerji Tasarrufu", label_i18n: {"en":"Enerji Tasarrufu","tr":"Enerji Tasarrufu"}, unit: "kWh/yıl", format: "number", isBigNumber: true },
  ],
  thresholds: [{ fieldId: "enpi", warning: 550, critical: 650, direction: "higher_is_bad", warningMessage: "EnPI > 550 — enerji yoğunluğu yüksek, iyileştirme fırsatı var.", warningMessage_i18n: {"en":"EnPI > 550 — enerji yoğunluğu yüksek, iyileştirme fırsatı var.","tr":"EnPI > 550 — enerji yoğunluğu yüksek, iyileştirme fırsatı var."}, criticalMessage: "EnPI > 650 — enerji verimliliği kritik seviyede.", criticalMessage_i18n: {"en":"EnPI > 650 — enerji verimliliği kritik seviyede.","tr":"EnPI > 650 — enerji verimliliği kritik seviyede."} }],
  formulaPipeline: [
    { formulaId: "energy.enpi", inputMap: { totalEnergy: "totalEnergy", productionVolume: "productionVolume" ,
        energy: "energy",
        volume: "volume"}, outputId: "enpi" },
    { formulaId: "energy.cusum", inputMap: { actualConsumption: "actualConsumption", predictedConsumption: "predictedConsumption" ,
        predicted: "predicted",
        actual: "actual"}, outputId: "cusum" },
    { formulaId: "energy.energy_savings", inputMap: { predictedConsumption: "predictedConsumption", actualConsumption: "actualConsumption" ,
        predicted: "predicted",
        actual: "actual"}, outputId: "savings" },
  ],
  reportTemplate: { title: "ISO 50001 Baseline Report", title_i18n: {"en":"ISO 50001 Baseline Report","tr":"ISO 50001 Baseline Report"}, sections: ["executive_summary", "thresholds", "action_plan", "assumptions"], exportFormats: ["pdf", "excel"] },
  assumptions: { hiddenLossMultiplier: 1.15, volatilityPercent: 15, targetMarginPercent: 20, assumptionNotes: ["EnPI = Energy/Volume.", "Baseline = Intercept + Slope₁×Prod + Slope₂×DD.", "CUSUM = Actual - Predicted. Savings = Predicted - Actual."],assumptionNotes_i18n:[{"en":"EnPI = Energy/Volume.","tr":"EnPI = Energy/Volume."},{"en":"Baseline = Intercept + Slope₁×Prod + Slope₂×DD.","tr":"Baseline = Intercept + Slope₁×Prod + Slope₂×DD."},{"en":"CUSUM = Actual - Predicted. Savings = Predicted - Actual.","tr":"CUSUM = Actual - Predicted. Savings = Predicted - Actual."}] },
};
