/**
 * Tool #16 — Takt Süre Flexibility
 */
import type { PremiumCalculatorSchema } from "@/lib/features/premium-schema/premium-calculator-schema";
export const TAKT_TIME_FLEXIBILITY_SCHEMA: PremiumCalculatorSchema = {
  id: "takt-time-flexibility-analyzer", legacyPaidSlug: "takt-time-flexibility-analyzer",
  name: "Takt Süre Esneklik Analizi", name_i18n: {"en":"Takt Time Flexibility Analysis"}, sectorSlug: "cnc-manufacturing", category: "cost",
  painStatement: "Takt süresi ile çevrim süresi arasındaki uyumsuzluk gizli kapasite kaybına ve işçilik fazlasına yol açar.", painStatement_i18n: {"en":"Mismatch between takt time and cycle time causes hidden capacity loss and excess labor."},
  inputs: [
    { id: "availableTime", label: "Kullanılabilir Süre (Günlük)", label_i18n: {"en":"Available Time (Daily)"}, type: "number", unit: "dk/gün", required: true, smartDefault: 480, validation: { min: 1 }, helper: "", expertMeaning: "Daily available production time", expertMeaning_i18n: {"en":"Daily available production time"} },
    { id: "customerDemand", label: "Müşteri Talebi (Günlük)", label_i18n: {"en":"Customer Demand (Daily)"}, type: "number", unit: "adet/gün", required: true, smartDefault: 500, validation: { min: 1 }, helper: "", expertMeaning: "Daily customer demand", expertMeaning_i18n: {"en":"Daily customer demand"} },
    { id: "cycleTime", label: "Çevrim Süresi", label_i18n: {"en":"Cycle Time"}, type: "number", unit: "dk/adet", required: true, smartDefault: 1.2, validation: { min: 0.01 }, helper: "", expertMeaning: "Current cycle time per unit", expertMeaning_i18n: {"en":"Current cycle time per unit"} },
    { id: "numOperators", label: "Operatör Sayısı", label_i18n: {"en":"Number of Operators"}, type: "number", unit: "kişi", required: true, smartDefault: 3, validation: { min: 1 }, helper: "", expertMeaning: "Number of operators on line", expertMeaning_i18n: {"en":"Number of operators on line"} },
    { id: "targetEfficiency", label: "Hedef Verimlilik", label_i18n: {"en":"Target Efficiency"}, type: "number", unit: "%", required: false, smartDefault: 85, validation: { min: 1, max: 100 }, helper: "", expertMeaning: "Target line efficiency", expertMeaning_i18n: {"en":"Target line efficiency"} },
  ],
  outputs: [
    { id: "taktTime", label: "Takt Süresi", label_i18n: {"en":"Takt Time"}, unit: "dk/adet", format: "number" },
    { id: "cycleFlexibility", label: "Çevrim Esneklik Oranı", label_i18n: {"en":"Cycle Flexibility Rate"}, unit: "%", format: "percentage" },
    { id: "balanceLoss", label: "Denge Kaybı", label_i18n: {"en":"Balance Loss"}, unit: "USD/gün", format: "currency" },
    { id: "flexibilityPremium", label: "Esneklik Primi", label_i18n: {"en":"Flexibility Premium"}, unit: "USD/gün", format: "currency" },
  ],
  thresholds: [{ fieldId: "cycleFlexibility", warning: 15, critical: 30, direction: "higher_is_bad", warningMessage: "Esneklik farkı > %15 — hat dengeleme önerilir.", warningMessage_i18n: {"en":"Flexibility gap > 15% — line balancing recommended."}, criticalMessage: "Esneklik farkı > %30 — takt süresi revize edilmeli.", criticalMessage_i18n: {"en":"Flexibility gap > 30% — revise takt time."} }],
  formulaPipeline: [
    { formulaId: "measurement.takt_time", inputMap: { availableTime: "availableTime", customerDemand: "customerDemand" }, outputId: "taktTime" },
    { formulaId: "measurement.cycle_flexibility", inputMap: { cycleTime: "cycleTime", taktTime: "taktTime" ,
        actualCycleTime: "actualCycleTime"}, outputId: "cycleFlexibility" },
    { formulaId: "cost.balance_loss", inputMap: {
        balanceDelay: "cycleTime",
        laborRate: "taktTime",
        numOperators: "numOperators"
      }, outputId: "balanceLoss" },
    { formulaId: "cost.flexibility_premium", inputMap: {
        flexibilityHours: "cycleFlexibility",
        premiumRate: "targetEfficiency",
        balanceLoss: "balanceLoss"
      }, outputId: "flexibilityPremium" },
  ],
  reportTemplate: { title: "Takt Time Flexibility Report", title_i18n: {"en":"Takt Time Flexibility Report"}, sections: ["executive_summary", "thresholds", "action_plan", "assumptions"], exportFormats: ["pdf", "excel"] },
  assumptions: { hiddenLossMultiplier: 1.1, volatilityPercent: 5, targetMarginPercent: 15, assumptionNotes: ["Takt = Available / Demand.", "Flexibility = |Cycle − Takt| / Takt × 100.", "Balance loss = operator × cost variance."],assumptionNotes_i18n:[{"en":"Takt = Available / Demand."},{"en":"Flexibility = |Cycle − Takt| / Takt × 100."},{"en":"Balance loss = operator × cost variance."}] },
};
