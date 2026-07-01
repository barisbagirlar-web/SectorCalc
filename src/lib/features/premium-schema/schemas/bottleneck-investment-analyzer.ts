/**
 * Tool #27 — Darboğaz Yatırım ROI
 */
import type { PremiumCalculatorSchema } from "@/lib/features/premium-schema/premium-calculator-schema";
export const BOTTLENECK_INVESTMENT_SCHEMA: PremiumCalculatorSchema = {
  id: "bottleneck-investment-analyzer", legacyPaidSlug: "bottleneck-investment-analyzer",
  name: "Darboğaz Yatırım ROI Analizi", name_i18n: {"en":"Bottleneck Investment ROI Analysis"}, sectorSlug: "cnc-manufacturing", category: "cost",
  painStatement: "Darboğazı tespit etmeden yapılan kapasite yatırımları beklenen getiriyi sağlamaz. Bu araç kısıt teorisi (TOC) ile yatırım ROI'sini hesaplar.", painStatement_i18n: {"en":"Darboğazı tespit etmeden yapılan kapasite yatırımları beklenen getiriyi sağlamaz. Bu araç kısıt teorisi (TOC) ile yatırım ROI'sini hesaplar."},
  inputs: [
    { id: "designCapacity", label: "Tasarım Kapasitesi", label_i18n: {"en":"Design Capacity"}, type: "number", unit: "birim/gün", required: true, smartDefault: 500, validation: { min: 1 }, helper: "", expertMeaning: "Design capacity", expertMeaning_i18n: {"en":"Design capacity"} },
    { id: "actualOutput", label: "Gerçek Çıktı", label_i18n: {"en":"Actual Output"}, type: "number", unit: "birim/gün", required: true, smartDefault: 350, validation: { min: 0 }, helper: "", expertMeaning: "Actual daily output", expertMeaning_i18n: {"en":"Actual daily output"} },
    { id: "demand", label: "Günlük Talep", label_i18n: {"en":"Daily Demand"}, type: "number", unit: "birim/gün", required: true, smartDefault: 450, validation: { min: 1 }, helper: "", expertMeaning: "Daily customer demand", expertMeaning_i18n: {"en":"Daily customer demand"} },
    { id: "defectRate", label: "Hata Oranı", label_i18n: {"en":"Defect Rate"}, type: "number", unit: "%", required: false, smartDefault: 5, validation: { min: 0, max: 100 }, helper: "", expertMeaning: "Defect rate", expertMeaning_i18n: {"en":"Defect rate"} },
    { id: "availableTime", label: "Mevcut Süre", label_i18n: {"en":"Available Time"}, type: "number", unit: "sn/gün", required: true, smartDefault: 28800, validation: { min: 1 }, helper: "", expertMeaning: "Available seconds per day", expertMeaning_i18n: {"en":"Available seconds per day"} },
    { id: "cycleTimeGap", label: "Darboğaz Süre Açığı", label_i18n: {"en":"Bottleneck Time Gap"}, type: "number", unit: "sn", required: true, smartDefault: 15, validation: { min: 0 }, helper: "", expertMeaning: "Bottleneck cycle - takt time", expertMeaning_i18n: {"en":"Bottleneck cycle - takt time"} },
    { id: "unitMargin", label: "Birim Kâr Marjı", label_i18n: {"en":"Unit Profit Margin"}, type: "number", unit: "USD", required: true, smartDefault: 3, validation: { min: 0 }, helper: "", expertMeaning: "Contribution margin per unit", expertMeaning_i18n: {"en":"Contribution margin per unit"} },
    { id: "throughputIncrease", label: "Beklenen Throughput Artışı", label_i18n: {"en":"Expected Throughput Increase"}, type: "number", unit: "birim/gün", required: false, smartDefault: 100, validation: { min: 0 }, helper: "", expertMeaning: "Expected throughput increase", expertMeaning_i18n: {"en":"Expected throughput increase"} },
    { id: "upgradeCost", label: "Yatırım Bedeli (Capex)", label_i18n: {"en":"Investment Cost (Capex)"}, type: "number", unit: "USD", required: true, smartDefault: 150000, validation: { min: 1 }, helper: "", expertMeaning: "Upgrade investment", expertMeaning_i18n: {"en":"Upgrade investment"} },
    { id: "operatingDays", label: "Yıllık Çalışma Günü", label_i18n: {"en":"Annual Operating Days"}, type: "number", unit: "gün", required: false, smartDefault: 250, validation: { min: 1 }, helper: "", expertMeaning: "Annual operating days", expertMeaning_i18n: {"en":"Annual operating days"} },
    { id: "monthlyGain", label: "Aylık Kâr Artışı", label_i18n: {"en":"Monthly Profit Increase"}, type: "number", unit: "USD", required: false, smartDefault: 8000, validation: { min: 0 }, helper: "", expertMeaning: "Expected monthly profit increase", expertMeaning_i18n: {"en":"Expected monthly profit increase"} },
  ],
  outputs: [
    { id: "utilization", label: "Kapasite Kullanımı", label_i18n: {"en":"Kapasite Kullanm"}, unit: "%", format: "percentage" },
    { id: "taktTime", label: "Takt Süresi", label_i18n: {"en":"Takt Suresi"}, unit: "sn", format: "number" },
    { id: "constraintCost", label: "Kısıt Maliyeti (Günlük)", label_i18n: {"en":"Kst Maliyeti (Gunluk)"}, unit: "USD/gün", format: "currency" },
    { id: "roi", label: "Yatırım ROI", label_i18n: {"en":"Yatrm ROI"}, unit: "%", format: "percentage" },
    { id: "paybackMonths", label: "Geri Ödeme Süresi", label_i18n: {"en":"Geri Odeme Suresi"}, unit: "ay", format: "number", isBigNumber: true },
  ],
  thresholds: [{ fieldId: "roi", warning: 50, critical: 20, direction: "lower_is_bad", warningMessage: "ROI < %50 — yatırım alternatifleri değerlendirilmeli.", warningMessage_i18n: {"en":"ROI < %50 — yatırım alternatifleri değerlendirilmeli."}, criticalMessage: "ROI < %20 — yatırım fizibilitesi zayıf.", criticalMessage_i18n: {"en":"ROI < %20 — yatırım fizibilitesi zayıf."} }],
  formulaPipeline: [
    { formulaId: "measurement.bottleneck_util", inputMap: { actualOutput: "actualOutput", designCapacity: "designCapacity" }, outputId: "utilization" },
    { formulaId: "measurement.bottleneck_takt_time", inputMap: { availableTime: "availableTime", demand: "demand" }, outputId: "taktTime" },
    { formulaId: "cost.bottleneck_cost", inputMap: {
        demand: "demand",
        unitMargin: "unitMargin",
        cycleGap: "cycleTimeGap"
      }, outputId: "constraintCost" },
    { formulaId: "cost.bottleneck_roi", inputMap: {
        throughputIncrease: "throughputIncrease",
        upgradeCost: "upgradeCost",
        margin: "unitMargin",
        days: "operatingDays"
      }, outputId: "roi" },
    { formulaId: "cost.bottleneck_payback", inputMap: { upgradeCost: "upgradeCost", monthlyGain: "monthlyGain" }, outputId: "paybackMonths" },
  ],
  reportTemplate: { title: "Bottleneck Investment Report", title_i18n: {"en":"Bottleneck Investment Report"}, sections: ["executive_summary", "thresholds", "action_plan", "assumptions"], exportFormats: ["pdf", "excel"] },
  assumptions: { hiddenLossMultiplier: 1.15, volatilityPercent: 15, targetMarginPercent: 20, assumptionNotes: ["Util = Actual/Design. Takt = Available/Demand.", "Constraint cost = Gap × Demand × Margin.", "ROI = (ThroughputInc×Margin×Days)/Capex × 100."],assumptionNotes_i18n:[{"en":"Util = Actual/Design. Takt = Available/Demand."},{"en":"Constraint cost = Gap × Demand × Margin."},{"en":"ROI = (ThroughputInc×Margin×Days)/Capex × 100."}]},
};
