/**
 * Tool #31 — Digital Twin Maliyet
 */
import type { PremiumCalculatorSchema } from "@/lib/features/premium-schema/premium-calculator-schema";
export const DIGITAL_TWIN_COST_SCHEMA: PremiumCalculatorSchema = {
  id: "digital-twin-cost-analyzer", legacyPaidSlug: "digital-twin-cost-analyzer",
  name: "Digital Twin Cost & ROI Analyzer", name_i18n: {"en":"Digital Twin Cost & ROI Analyzer"}, sectorSlug: "cnc-manufacturing", category: "cost",
  painStatement: "Digital twin yatırımının geleneksel yönteme göre maliyet avantajını ROI olarak hesaplamadan karar vermek risklidir.", painStatement_i18n: {"en":"Digital twin yatırımının geleneksel yönteme göre maliyet avantajını ROI olarak hesaplamadan karar vermek risklidir."},
  inputs: [
    { id: "traditionalCost", label: "Geleneksel Yöntem Maliyeti", label_i18n: {"en":"Prototyping+FieldTest+Downtime+Travel"}, type: "number", unit: "USD", required: true, smartDefault: 200000, validation: { min: 0 }, helper: "", expertMeaning: "Prototyping+FieldTest+Downtime+Travel", expertMeaning_i18n: {"en":"Prototyping+FieldTest+Downtime+Travel"} },
    { id: "dtCost", label: "Digital Twin Maliyeti", label_i18n: {"en":"Digital Twin Maliyeti"}, type: "number", unit: "USD", required: true, smartDefault: 80000, validation: { min: 0 }, helper: "", expertMeaning: "License+Compute+Sensor+Modeling", expertMeaning_i18n: {"en":"License+Compute+Sensor+Modeling"} },
    { id: "physicalCycle", label: "Fiziksel Çevrim Süresi", label_i18n: {"en":"Physical prototyping cycle (days)"}, type: "number", unit: "gün", required: false, smartDefault: 30, validation: { min: 0 }, helper: "", expertMeaning: "Physical prototyping cycle (days)", expertMeaning_i18n: {"en":"Physical prototyping cycle (days)"} },
    { id: "digitalCycle", label: "Dijital Çevrim Süresi", label_i18n: {"en":"Digital simulation cycle (days)"}, type: "number", unit: "gün", required: false, smartDefault: 10, validation: { min: 0 }, helper: "", expertMeaning: "Digital simulation cycle (days)", expertMeaning_i18n: {"en":"Digital simulation cycle (days)"} },
    { id: "iterations", label: "İterasyon Sayısı", label_i18n: {"en":"Number of design iterations"}, type: "number", unit: "", required: false, smartDefault: 5, validation: { min: 0 }, helper: "", expertMeaning: "Number of design iterations", expertMeaning_i18n: {"en":"Number of design iterations"} },
    { id: "dailyRevenue", label: "Günlük Gelir Kaybı", label_i18n: {"en":"Revenue loss per day delay"}, type: "number", unit: "USD", required: false, smartDefault: 5000, validation: { min: 0 }, helper: "", expertMeaning: "Revenue loss per day delay", expertMeaning_i18n: {"en":"Revenue loss per day delay"} },
    { id: "defectReductionPct", label: "Hata Azaltma Oranı", label_i18n: {"en":"Defect reduction through DT"}, type: "number", unit: "%", required: false, smartDefault: 30, validation: { min: 0, max: 100 }, helper: "", expertMeaning: "Defect reduction through DT", expertMeaning_i18n: {"en":"Defect reduction through DT"} },
    { id: "warrantyCost", label: "Garanti Maliyeti/Adet", label_i18n: {"en":"Garanti Maliyeti/Adet"}, type: "number", unit: "USD", required: false, smartDefault: 50, validation: { min: 0 }, helper: "", expertMeaning: "Average warranty cost per unit", expertMeaning_i18n: {"en":"Average warranty cost per unit"} },
    { id: "productionVolume", label: "Yıllık Üretim Hacmi", label_i18n: {"en":"Annual production volume"}, type: "number", unit: "adet", required: false, smartDefault: 10000, validation: { min: 0 }, helper: "", expertMeaning: "Annual production volume", expertMeaning_i18n: {"en":"Annual production volume"} },
  ],
  outputs: [
    { id: "totalSavings", label: "Toplam Tasarruf", label_i18n: {"en":"Toplam Tasarruf"}, unit: "USD", format: "currency" },
    { id: "roi", label: "Digital Twin ROI", label_i18n: {"en":"Digital Twin ROI"}, unit: "%", format: "percentage" },
    { id: "paybackMonths", label: "Geri Ödeme Süresi", label_i18n: {"en":"Geri Odeme Suresi"}, unit: "ay", format: "number", isBigNumber: true },
  ],
  thresholds: [{ fieldId: "roi", warning: 100, critical: 50, direction: "lower_is_bad", warningMessage: "ROI < %100 — fizibilite tekrar değerlendirilmeli.", warningMessage_i18n: {"en":"ROI < %100 — fizibilite tekrar değerlendirilmeli."}, criticalMessage: "ROI < %50 — yatırım önerilmez.", criticalMessage_i18n: {"en":"ROI < %50 — yatırım önerilmez."} }],
  formulaPipeline: [
    { formulaId: "cost.digital_twin_time_gain", inputMap: {
        iterations: "iterations",
        physCycle: "physicalCycle",
        digCycle: "digitalCycle"
      }, outputId: "timeGain" },
    { formulaId: "cost.digital_twin_revenue_gain", inputMap: {
        timeGain: "timeGain",
        dailyRev: "dailyRevenue"
      }, outputId: "revenueGain" },
    { formulaId: "cost.digital_twin_quality_savings", inputMap: {
        warrantyCost: "warrantyCost",
        defectReduction: "defectReductionPct",
        volume: "productionVolume"
      }, outputId: "qualitySavings" },
    { formulaId: "cost.digital_twin_total_savings", inputMap: { traditionalCost: "traditionalCost", dtCost: "dtCost", revenueGain: "revenueGain", qualitySavings: "qualitySavings" }, outputId: "totalSavings" },
    { formulaId: "cost.digital_twin_roi", inputMap: {
        costTrad: "totalSavings",
        costDt: "dtCost"
      ,
        revenueGain: "revenueGain",
        qualitySavings: "qualitySavings"}, outputId: "roi" },
  ],
  reportTemplate: { title: "Digital Twin Cost & ROI Report", title_i18n: {"en":"Digital Twin Cost & ROI Report"}, sections: ["executive_summary", "thresholds", "action_plan", "assumptions"], exportFormats: ["pdf", "excel"] },
  assumptions: { hiddenLossMultiplier: 1.15, volatilityPercent: 15, targetMarginPercent: 20, assumptionNotes: ["Time gain = (Physical-Digital)×Iterations.", "Quality savings = DefectRed%×Warranty×Volume.", "ROI = (TradCost-DTCost+RevGain+QualSav)/DTCost."],assumptionNotes_i18n:[{"en":"Time gain = (Physical-Digital)×Iterations."},{"en":"Quality savings = DefectRed%×Warranty×Volume."},{"en":"ROI = (TradCost-DTCost+RevGain+QualSav)/DTCost."}] },
};
