/**
 * Tool #32 — Dikiş Hattı Dengeleyici
 */
import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";
export const SEWING_LINE_BALANCE_SCHEMA: PremiumCalculatorSchema = {
  id: "sewing-line-balance-analyzer-pro", legacyPaidSlug: "sewing-line-balance-analyzer-pro",
  name: "Dikiş Hattı Dengeleyici (Pro)", name_i18n: {"en":"Dikiş Hattı Dengeleyici (Pro)","tr":"Dikiş Hattı Dengeleyici (Pro)"}, sectorSlug: "textile", category: "measurement",
  painStatement: "Dikiş hattında SMV dağılımı dengelenmezse hat verimliliği düşer, WIP birikir ve teslimat gecikir.", painStatement_i18n: {"en":"Dikiş hattında SMV dağılımı dengelenmezse hat verimliliği düşer, WIP birikir ve teslimat gecikir.","tr":"Dikiş hattında SMV dağılımı dengelenmezse hat verimliliği düşer, WIP birikir ve teslimat gecikir."},
  inputs: [
    { id: "smvTimes", label: "SMV Süreleri (virgülle ayır)", label_i18n: {"en":"SMV Süreleri (virgülle ayır)","tr":"SMV Süreleri (virgülle ayır)"}, type: "number", unit: "dak", array: true, required: true, validation: { min: 0 }, helper: "", expertMeaning: "Array of SMV times per operation", expertMeaning_i18n: {"en":"Array of SMV times per operation","tr":"Array of SMV times per operation"} },
    { id: "availableTime", label: "Vardiya Süresi", label_i18n: {"en":"Vardiya Süresi","tr":"Vardiya Süresi"}, type: "number", unit: "dak", required: true, smartDefault: 450, validation: { min: 1 }, helper: "", expertMeaning: "Available shift minutes", expertMeaning_i18n: {"en":"Available shift minutes","tr":"Available shift minutes"} },
    { id: "downtime", label: "Planlı Duruş", label_i18n: {"en":"Planlı Duruş","tr":"Planlı Duruş"}, type: "number", unit: "dak", required: false, smartDefault: 30, validation: { min: 0 }, helper: "", expertMeaning: "Planned breaks & meetings", expertMeaning_i18n: {"en":"Planned breaks & meetings","tr":"Planned breaks & meetings"} },
    { id: "demand", label: "Günlük Hedef Adet", label_i18n: {"en":"Günlük Hedef Adet","tr":"Günlük Hedef Adet"}, type: "number", unit: "adet/gün", required: true, smartDefault: 500, validation: { min: 1 }, helper: "", expertMeaning: "Daily production target", expertMeaning_i18n: {"en":"Daily production target","tr":"Daily production target"} },
    { id: "operatorCount", label: "Operatör Sayısı", label_i18n: {"en":"Operatör Sayısı","tr":"Operatör Sayısı"}, type: "number", unit: "", required: false, smartDefault: 5, validation: { min: 1 }, helper: "", expertMeaning: "Number of operators", expertMeaning_i18n: {"en":"Number of operators","tr":"Number of operators"} },
    { id: "targetEfficiency", label: "Hedef Verim", label_i18n: {"en":"Hedef Verim","tr":"Hedef Verim"}, type: "number", unit: "%", required: false, smartDefault: 85, validation: { min: 0, max: 100 }, helper: "", expertMeaning: "Target line efficiency", expertMeaning_i18n: {"en":"Target line efficiency","tr":"Target line efficiency"} },
    { id: "defectRate", label: "Hata Oranı", label_i18n: {"en":"Hata Oranı","tr":"Hata Oranı"}, type: "number", unit: "%", required: false, smartDefault: 3, validation: { min: 0, max: 100 }, helper: "", expertMeaning: "Defect rate", expertMeaning_i18n: {"en":"Defect rate","tr":"Defect rate"} },
    { id: "cycleTotal", label: "Toplam SMV (Tüm Operasyonlar)", label_i18n: {"en":"Toplam SMV (Tüm Operasyonlar)","tr":"Toplam SMV (Tüm Operasyonlar)"}, type: "number", unit: "dak", required: true, smartDefault: 6.5, validation: { min: 0.01 }, helper: "", expertMeaning: "Sum of all SMV times", expertMeaning_i18n: {"en":"Sum of all SMV times","tr":"Sum of all SMV times"} },
  ],
  outputs: [
    { id: "taktTime", label: "Takt Süresi", label_i18n: {"en":"Takt Time","tr":"Takt Süresi"}, unit: "dak", format: "number" },
    { id: "cycleTotal", label: "Toplam SMV", label_i18n: {"en":"Toplam SMV","tr":"Toplam SMV"}, unit: "dak", format: "number" },
    { id: "theoreticalOps", label: "Teorik Operatör", label_i18n: {"en":"Teorik Operatör","tr":"Teorik Operatör"}, unit: "kişi", format: "number" },
    { id: "actualOperators", label: "Gerçek Operatör", label_i18n: {"en":"Gerçek Operatör","tr":"Gerçek Operatör"}, unit: "kişi", format: "number" },
    { id: "lineEfficiency", label: "Hat Verimliliği", label_i18n: {"en":"Hat Verimliliği","tr":"Hat Verimliliği"}, unit: "%", format: "percentage" },
    { id: "balanceDelay", label: "Denge Kaybı", label_i18n: {"en":"Balance Loss","tr":"Denge Kaybı"}, unit: "%", format: "percentage", isBigNumber: true },
  ],
  thresholds: [{ fieldId: "lineEfficiency", warning: 80, critical: 70, direction: "lower_is_bad", warningMessage: "Verim < %80 — SMV dağılımı iyileştirilmeli.", warningMessage_i18n: {"en":"Verim < %80 — SMV dağılımı iyileştirilmeli.","tr":"Verim < %80 — SMV dağılımı iyileştirilmeli."}, criticalMessage: "Verim < %70 — hat yeniden dengelenmeli.", criticalMessage_i18n: {"en":"Verim < %70 — hat yeniden dengelenmeli.","tr":"Verim < %70 — hat yeniden dengelenmeli."} }],
  formulaPipeline: [
    { formulaId: "measurement.sewing_takt_time", inputMap: { availableTime: "availableTime", demand: "demand" }, outputId: "taktTime" },
    { formulaId: "measurement.sewing_line_efficiency", inputMap: { cycleTotal: "cycleTotal", actualOperators: "operatorCount", taktTime: "taktTime" }, outputId: "lineEfficiency" },
  ],
  reportTemplate: { title: "Sewing Line Balance Report", title_i18n: {"en":"Sewing Line Balance Report","tr":"Dikiş Hattı Dengeleme Raporu"}, sections: ["executive_summary", "thresholds", "action_plan", "assumptions"], exportFormats: ["pdf", "excel"] },
  assumptions: { hiddenLossMultiplier: 1.1, volatilityPercent: 10, targetMarginPercent: 15, assumptionNotes: ["Takt = AvailableTime/Demand. ΣSMV = sum of all SMVs.", "LineEff = ΣSMV/(Operators×Takt)×100.", "Balance delay = 100 - LineEff."],assumptionNotes_i18n:[{"en":"Takt = AvailableTime/Demand. ΣSMV = sum of all SMVs.","tr":"Takt = AvailableTime/Demand. ΣSMV = sum of all SMVs."},{"en":"LineEff = ΣSMV/(Operators×Takt)×100.","tr":"LineEff = ΣSMV/(Operators×Takt)×100."},{"en":"Balance delay = 100 - LineEff.","tr":"Balance delay = 100 - LineEff."}] },
};
