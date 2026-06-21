/**
 * Tool #16 — Takt Süre Flexibility
 */
import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";
export const TAKT_TIME_FLEXIBILITY_SCHEMA: PremiumCalculatorSchema = {
  id: "takt-time-flexibility-analyzer", legacyPaidSlug: "takt-time-flexibility-analyzer",
  name: "Takt Süre Esneklik Analizi", name_i18n: {"en":"Takt Süre Esneklik Analizi","tr":"Takt Süre Esneklik Analizi"}, sectorSlug: "cnc-manufacturing", category: "cost",
  painStatement: "Takt süresi ile çevrim süresi arasındaki uyumsuzluk gizli kapasite kaybına ve işçilik fazlasına yol açar.", painStatement_i18n: {"en":"Takt süresi ile çevrim süresi arasındaki uyumsuzluk gizli kapasite kaybına ve işçilik fazlasına yol açar.","tr":"Takt süresi ile çevrim süresi arasındaki uyumsuzluk gizli kapasite kaybına ve işçilik fazlasına yol açar."},
  inputs: [
    { id: "availableTime", label: "Kullanılabilir Süre (Günlük)", label_i18n: {"en":"Kullanılabilir Süre (Günlük)","tr":"Kullanılabilir Süre (Günlük)"}, type: "number", unit: "dk/gün", required: true, smartDefault: 480, validation: { min: 1 }, helper: "", expertMeaning: "Daily available production time", expertMeaning_i18n: {"en":"Daily available production time","tr":"Daily available production time"} },
    { id: "customerDemand", label: "Müşteri Talebi (Günlük)", label_i18n: {"en":"Müşteri Talebi (Günlük)","tr":"Müşteri Talebi (Günlük)"}, type: "number", unit: "adet/gün", required: true, smartDefault: 500, validation: { min: 1 }, helper: "", expertMeaning: "Daily customer demand", expertMeaning_i18n: {"en":"Daily customer demand","tr":"Daily customer demand"} },
    { id: "cycleTime", label: "Çevrim Süresi", label_i18n: {"en":"Çevrim Süresi","tr":"Çevrim Süresi"}, type: "number", unit: "dk/adet", required: true, smartDefault: 1.2, validation: { min: 0.01 }, helper: "", expertMeaning: "Current cycle time per unit", expertMeaning_i18n: {"en":"Current cycle time per unit","tr":"Current cycle time per unit"} },
    { id: "numOperators", label: "Operatör Sayısı", label_i18n: {"en":"Operatör Sayısı","tr":"Operatör Sayısı"}, type: "number", unit: "kişi", required: true, smartDefault: 3, validation: { min: 1 }, helper: "", expertMeaning: "Number of operators on line", expertMeaning_i18n: {"en":"Number of operators on line","tr":"Number of operators on line"} },
    { id: "targetEfficiency", label: "Hedef Verimlilik", label_i18n: {"en":"Hedef Verimlilik","tr":"Hedef Verimlilik"}, type: "number", unit: "%", required: false, smartDefault: 85, validation: { min: 1, max: 100 }, helper: "", expertMeaning: "Target line efficiency", expertMeaning_i18n: {"en":"Target line efficiency","tr":"Target line efficiency"} },
  ],
  outputs: [
    { id: "taktTime", label: "Takt Süresi", label_i18n: {"en":"Takt Süresi","tr":"Takt Süresi"}, unit: "dk/adet", format: "number" },
    { id: "cycleFlexibility", label: "Çevrim Esneklik Oranı", label_i18n: {"en":"Çevrim Esneklik Oranı","tr":"Çevrim Esneklik Oranı"}, unit: "%", format: "percentage" },
    { id: "balanceLoss", label: "Denge Kaybı", label_i18n: {"en":"Denge Kaybı","tr":"Denge Kaybı"}, unit: "USD/gün", format: "currency" },
    { id: "flexibilityPremium", label: "Esneklik Primi", label_i18n: {"en":"Esneklik Primi","tr":"Esneklik Primi"}, unit: "USD/gün", format: "currency" },
  ],
  thresholds: [{ fieldId: "cycleFlexibility", warning: 15, critical: 30, direction: "higher_is_bad", warningMessage: "Esneklik farkı > %15 — hat dengeleme önerilir.", warningMessage_i18n: {"en":"Esneklik farkı > %15 — hat dengeleme önerilir.","tr":"Esneklik farkı > %15 — hat dengeleme önerilir."}, criticalMessage: "Esneklik farkı > %30 — takt süresi revize edilmeli.", criticalMessage_i18n: {"en":"Esneklik farkı > %30 — takt süresi revize edilmeli.","tr":"Esneklik farkı > %30 — takt süresi revize edilmeli."} }],
  formulaPipeline: [
    { formulaId: "measurement.takt_time", inputMap: { availableTime: "availableTime", customerDemand: "customerDemand" }, outputId: "taktTime" },
    { formulaId: "measurement.cycle_flexibility", inputMap: { cycleTime: "cycleTime", taktTime: "taktTime" }, outputId: "cycleFlexibility" },
    { formulaId: "cost.balance_loss", inputMap: { cycleTime: "cycleTime", taktTime: "taktTime", numOperators: "numOperators" }, outputId: "balanceLoss" },
    { formulaId: "cost.flexibility_premium", inputMap: { cycleFlexibility: "cycleFlexibility", targetEfficiency: "targetEfficiency", balanceLoss: "balanceLoss" }, outputId: "flexibilityPremium" },
  ],
  reportTemplate: { title: "Takt Time Flexibility Report", title_i18n: {"en":"Takt Time Flexibility Report","tr":"Takt Time Flexibility Report"}, sections: ["executive_summary", "thresholds", "action_plan", "assumptions"], exportFormats: ["pdf", "excel"] },
  assumptions: { hiddenLossMultiplier: 1.1, volatilityPercent: 5, targetMarginPercent: 15, assumptionNotes: ["Takt = Available / Demand.", "Flexibility = |Cycle − Takt| / Takt × 100.", "Balance loss = operator × cost variance."],assumptionNotes_i18n:[{"en":"Takt = Available / Demand.","tr":"Takt = Available / Demand."},{"en":"Flexibility = |Cycle − Takt| / Takt × 100.","tr":"Flexibility = |Cycle − Takt| / Takt × 100."},{"en":"Balance loss = operator × cost variance.","tr":"Balance loss = operator × cost variance."}] },
};
