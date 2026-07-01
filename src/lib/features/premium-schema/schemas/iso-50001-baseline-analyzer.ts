/**
 * Tool #54 — ISO 50001 Baseline
 */
import type { PremiumCalculatorSchema } from "@/lib/features/premium-schema/premium-calculator-schema";
export const ISO50001_BASELINE_SCHEMA: PremiumCalculatorSchema = {
  id: "iso-50001-baseline-analyzer", legacyPaidSlug: "iso-50001-baseline-analyzer",
  name: "ISO 50001 Energy Baseline & CUSUM Analyzer", name_i18n: {"en":"ISO 50001 Energy Baseline & CUSUM Analyzer"}, sectorSlug: "sheet-metal", category: "energy",
  painStatement: "ISO 50001 kapsamında EnPI ve CUSUM analizi yapılmadan enerji performansı izlenemez ve iyileştirme kanıtlanamaz.", painStatement_i18n: {"en":"ISO 50001 kapsamında EnPI ve CUSUM analizi without energy performansı izlenemez ve improvement kanıtlanamaz."},
  inputs: [
    { id: "totalEnergy", label: "Toplam Enerji Tüketimi", label_i18n: {"en":"Total energy consumption"}, type: "number", unit: "kWh", required: true, smartDefault: 5000000, validation: { min: 0 }, helper: "", expertMeaning: "Total energy consumption", expertMeaning_i18n: {"en":"Total energy consumption"} },
    { id: "productionVolume", label: "Üretim Hacmi", label_i18n: {"en":"Production volume"}, type: "number", unit: "ton", required: true, smartDefault: 10000, validation: { min: 0.1 }, helper: "", expertMeaning: "Production volume", expertMeaning_i18n: {"en":"Production volume"} },
    { id: "intercept", label: "Baseline intercept", label_i18n: {"en":"Baseline intercept"}, type: "number", unit: "kWh", required: false, smartDefault: 500000, validation: { min: 0 }, helper: "", expertMeaning: "Baseline intercept", expertMeaning_i18n: {"en":"Baseline intercept"} },
    { id: "slopeProd", label: "Production coefficient", label_i18n: {"en":"Production coefficient"}, type: "number", unit: "kWh/ton", required: false, smartDefault: 400, validation: { min: 0 }, helper: "", expertMeaning: "Production coefficient", expertMeaning_i18n: {"en":"Production coefficient"} },
    { id: "slopeDegreeDay", label: "Degree day coefficient", label_i18n: {"en":"Degree day coefficient"}, type: "number", unit: "kWh/DD", required: false, smartDefault: 1000, validation: { min: 0 }, helper: "", expertMeaning: "Degree day coefficient", expertMeaning_i18n: {"en":"Degree day coefficient"} },
    { id: "degreeDays", label: "Derece Gün (DD)", label_i18n: {"en":"Degree days"}, type: "number", unit: "DD", required: false, smartDefault: 2000, validation: { min: 0 }, helper: "", expertMeaning: "Degree days", expertMeaning_i18n: {"en":"Degree days"} },
    { id: "actualConsumption", label: "Actual consumption", label_i18n: {"en":"Actual consumption"}, type: "number", unit: "kWh", required: false, smartDefault: 4800000, validation: { min: 0 }, helper: "", expertMeaning: "Actual consumption", expertMeaning_i18n: {"en":"Actual consumption"} },
    { id: "predictedConsumption", label: "Tahmini Tüketim", label_i18n: {"en":"Predicted consumption"}, type: "number", unit: "kWh", required: false, smartDefault: 5100000, validation: { min: 0 }, helper: "", expertMeaning: "Predicted consumption", expertMeaning_i18n: {"en":"Predicted consumption"} },
    { id: "targetReduction", label: "Target reduction percentage", label_i18n: {"en":"Target reduction percentage"}, type: "number", unit: "%", required: false, smartDefault: 10, validation: { min: 0, max: 100 }, helper: "", expertMeaning: "Target reduction percentage", expertMeaning_i18n: {"en":"Target reduction percentage"} },
  ],
  outputs: [
    { id: "enpi", label: "EnPI (Energy Intensity)", label_i18n: {"en":"EnPI (Energy Intensity)"}, unit: "kWh/ton", format: "number" },
    { id: "cusum", label: "CUSUM (Actual-Predicted)", label_i18n: {"en":"CUSUM (Actual-Predicted)"}, unit: "kWh", format: "number" },
    { id: "savings", label: "Enerji Tasarrufu", label_i18n: {"en":"Energy Savings"}, unit: "kWh/yıl", format: "number", isBigNumber: true },
  ],
  thresholds: [{ fieldId: "enpi", warning: 550, critical: 650, direction: "higher_is_bad", warningMessage: "EnPI > 550 — enerji yoğunluğu yüksek, iyileştirme fırsatı var.", warningMessage_i18n: {"en":"EnPI > 550 — energy yoğunluğu high, improvement fırsatı var."}, criticalMessage: "EnPI > 650 — enerji verimliliği kritik seviyede.", criticalMessage_i18n: {"en":"EnPI > 650 — energy verimliliği kritik seviyede."} }],
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
  reportTemplate: { title: "ISO 50001 Baseline Report", title_i18n: {"en":"ISO 50001 Baseline Report"}, sections: ["executive_summary", "thresholds", "action_plan", "assumptions"], exportFormats: ["pdf", "excel"] },
  assumptions: { hiddenLossMultiplier: 1.15, volatilityPercent: 15, targetMarginPercent: 20, assumptionNotes: ["EnPI = Energy/Volume.", "Baseline = Intercept + Slope₁×Prod + Slope₂×DD.", "CUSUM = Actual - Predicted. Savings = Predicted - Actual."],assumptionNotes_i18n:[{"en":"EnPI = Energy/Volume."},{"en":"Baseline = Intercept + Slope₁×Prod + Slope₂×DD."},{"en":"CUSUM = Actual - Predicted. Savings = Predicted - Actual."}] },
};
