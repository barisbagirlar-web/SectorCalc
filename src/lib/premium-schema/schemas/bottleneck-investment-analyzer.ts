/**
 * Tool #27 — Darboğaz Yatırım ROI
 */
import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";
export const BOTTLENECK_INVESTMENT_SCHEMA: PremiumCalculatorSchema = {
  id: "bottleneck-investment-analyzer", legacyPaidSlug: "bottleneck-investment-analyzer",
  name: "Darboğaz Yatırım ROI Analizi", sectorSlug: "cnc-manufacturing", category: "cost",
  painStatement: "Darboğazı tespit etmeden yapılan kapasite yatırımları beklenen getiriyi sağlamaz. Bu araç kısıt teorisi (TOC) ile yatırım ROI'sini hesaplar.",
  inputs: [
    { id: "designCapacity", label: "Tasarım Kapasitesi", type: "number", unit: "birim/gün", required: true, smartDefault: 500, validation: { min: 1 }, helper: "", expertMeaning: "Design capacity" },
    { id: "actualOutput", label: "Gerçek Çıktı", type: "number", unit: "birim/gün", required: true, smartDefault: 350, validation: { min: 0 }, helper: "", expertMeaning: "Actual daily output" },
    { id: "demand", label: "Günlük Talep", type: "number", unit: "birim/gün", required: true, smartDefault: 450, validation: { min: 1 }, helper: "", expertMeaning: "Daily customer demand" },
    { id: "defectRate", label: "Hata Oranı", type: "number", unit: "%", required: false, smartDefault: 5, validation: { min: 0, max: 100 }, helper: "", expertMeaning: "Defect rate" },
    { id: "availableTime", label: "Mevcut Süre", type: "number", unit: "sn/gün", required: true, smartDefault: 28800, validation: { min: 1 }, helper: "", expertMeaning: "Available seconds per day" },
    { id: "cycleTimeGap", label: "Darboğaz Süre Açığı", type: "number", unit: "sn", required: true, smartDefault: 15, validation: { min: 0 }, helper: "", expertMeaning: "Bottleneck cycle - takt time" },
    { id: "unitMargin", label: "Birim Kâr Marjı", type: "number", unit: "USD", required: true, smartDefault: 3, validation: { min: 0 }, helper: "", expertMeaning: "Contribution margin per unit" },
    { id: "throughputIncrease", label: "Beklenen Throughput Artışı", type: "number", unit: "birim/gün", required: false, smartDefault: 100, validation: { min: 0 }, helper: "", expertMeaning: "Expected throughput increase" },
    { id: "upgradeCost", label: "Yatırım Bedeli (Capex)", type: "number", unit: "USD", required: true, smartDefault: 150000, validation: { min: 1 }, helper: "", expertMeaning: "Upgrade investment" },
    { id: "operatingDays", label: "Yıllık Çalışma Günü", type: "number", unit: "gün", required: false, smartDefault: 250, validation: { min: 1 }, helper: "", expertMeaning: "Annual operating days" },
    { id: "monthlyGain", label: "Aylık Kâr Artışı", type: "number", unit: "USD", required: false, smartDefault: 8000, validation: { min: 0 }, helper: "", expertMeaning: "Expected monthly profit increase" },
  ],
  outputs: [
    { id: "utilization", label: "Kapasite Kullanımı", unit: "%", format: "percentage" },
    { id: "taktTime", label: "Takt Süresi", unit: "sn", format: "number" },
    { id: "constraintCost", label: "Kısıt Maliyeti (Günlük)", unit: "USD/gün", format: "currency" },
    { id: "roi", label: "Yatırım ROI", unit: "%", format: "percentage" },
    { id: "paybackMonths", label: "Geri Ödeme Süresi", unit: "ay", format: "number", isBigNumber: true },
  ],
  thresholds: [{ fieldId: "roi", warning: 50, critical: 20, direction: "lower_is_bad", warningMessage: "ROI < %50 — yatırım alternatifleri değerlendirilmeli.", criticalMessage: "ROI < %20 — yatırım fizibilitesi zayıf." }],
  formulaPipeline: [
    { formulaId: "measurement.bottleneck_util", inputMap: { actualOutput: "actualOutput", designCapacity: "designCapacity" }, outputId: "utilization" },
    { formulaId: "measurement.bottleneck_takt_time", inputMap: { availableTime: "availableTime", demand: "demand" }, outputId: "taktTime" },
    { formulaId: "cost.bottleneck_cost", inputMap: { cycleTimeGap: "cycleTimeGap", demand: "demand", unitMargin: "unitMargin" }, outputId: "constraintCost" },
    { formulaId: "cost.bottleneck_roi", inputMap: { throughputIncrease: "throughputIncrease", unitMargin: "unitMargin", operatingDays: "operatingDays", upgradeCost: "upgradeCost" }, outputId: "roi" },
    { formulaId: "cost.bottleneck_payback", inputMap: { upgradeCost: "upgradeCost", monthlyGain: "monthlyGain" }, outputId: "paybackMonths" },
  ],
  reportTemplate: { title: "Bottleneck Investment Report", sections: ["executive_summary", "thresholds", "action_plan", "assumptions"], exportFormats: ["pdf", "excel"] },
  assumptions: { hiddenLossMultiplier: 1.15, volatilityPercent: 15, targetMarginPercent: 20, assumptionNotes: ["Util = Actual/Design. Takt = Available/Demand.", "Constraint cost = Gap × Demand × Margin.", "ROI = (ThroughputInc×Margin×Days)/Capex × 100."] },
};
