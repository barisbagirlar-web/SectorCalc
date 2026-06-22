/**
 * Tool — SMED Değişim
 */
import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";
export const SMED_CHANGEOVER_OPTIMIZER_ANALYZER: PremiumCalculatorSchema = {
  id: "smed-changeover-optimizer-analyzer", legacyPaidSlug: "smed-changeover-optimizer-analyzer",
  name: "SMED Değişim Süresi Optimizasyonu", name_i18n: {"en":"SMED Degisim Suresi Optimizasyonu","tr":"SMED Değişim Süresi Optimizasyonu"}, sectorSlug: "cnc-manufacturing", category: "cost",
  painStatement: "Uzun kalıp değişim süreleri makine duruşlarını artırır, kapasite kaybına yol açar ve SMED uygulanmazsa kayıplar görünmez.", painStatement_i18n: {"en":"Uzun kalıp değişim süreleri makine duruşlarını artırır, kapasite kaybına yol açar ve SMED uygulanmazsa kayıplar görünmez.","tr":"Uzun kalıp değişim süreleri makine duruşlarını artırır, kapasite kaybına yol açar ve SMED uygulanmazsa kayıplar görünmez."},
  inputs: [
    { id: "currentChangeoverTime", label: "Mevcut Değişim Süresi", label_i18n: {"en":"Current changeover time in minutes","tr":"Mevcut Değişim Süresi"}, type: "number", unit: "dakika", required: true, smartDefault: 45, validation: { min: 1 }, helper: "", expertMeaning: "Current changeover time in minutes", expertMeaning_i18n: {"en":"Current changeover time in minutes","tr":"mevcut değişim süresi"} },
    { id: "changeoversPerMonth", label: "Aylık Değişim Sayısı", label_i18n: {"en":"Changeovers per month","tr":"Aylık Değişim Sayısı"}, type: "number", unit: "adet", required: true, smartDefault: 30, validation: { min: 1 }, helper: "", expertMeaning: "Changeovers per month", expertMeaning_i18n: {"en":"Changeovers per month","tr":"aylık değişim sayısı"} },
    { id: "targetChangeoverTime", label: "Hedef Değişim Süresi", label_i18n: {"en":"Target changeover time after SMED","tr":"Hedef Değişim Süresi"}, type: "number", unit: "dakika", required: false, smartDefault: 15, validation: { min: 1 }, helper: "", expertMeaning: "Target changeover time after SMED", expertMeaning_i18n: {"en":"Target changeover time after SMED","tr":"hedef değişim süresi"} },
    { id: "machineHourlyRate", label: "Makine Saatlik Maliyeti", label_i18n: {"en":"Makine Saatlik Maliyeti","tr":"Makine Saatlik Maliyeti"}, type: "number", unit: "USD/saat", required: true, smartDefault: 85, validation: { min: 1 }, helper: "", expertMeaning: "Machine cost per hour", expertMeaning_i18n: {"en":"Machine cost per hour","tr":"Machine cost per hour"} },
    { id: "operatorCount", label: "Operatör Sayısı", label_i18n: {"en":"Operators during changeover","tr":"Operatör Sayısı"}, type: "number", unit: "adet", required: false, smartDefault: 2, validation: { min: 1 }, helper: "", expertMeaning: "Operators during changeover", expertMeaning_i18n: {"en":"Operators during changeover","tr":"operatör sayısı"} },
    { id: "smedImplementationCost", label: "SMED Uygulama Maliyeti", label_i18n: {"en":"SMED Uygulama Maliyeti","tr":"SMED Uygulama Maliyeti"}, type: "number", unit: "USD", required: false, smartDefault: 5000, validation: { min: 0 }, helper: "", expertMeaning: "Cost to implement SMED", expertMeaning_i18n: {"en":"Cost to implement SMED","tr":"Cost to implement SMED"} },
  ],
  outputs: [
    { id: "capacityRecovered", label: "Kazanılan Kapasite", label_i18n: {"en":"Kazanlan Kapasite","tr":"Kazanılan Kapasite"}, unit: "saat/yıl", format: "number", isBigNumber: true },
    { id: "financialGain", label: "Finansal Kazanç", label_i18n: {"en":"Finansal Kazanc","tr":"Finansal Kazanç"}, unit: "USD/yıl", format: "currency" },
    { id: "roi", label: "Yatırım Getirisi (ROI)", label_i18n: {"en":"Yatrm Getirisi (ROI)","tr":"Yatırım Getirisi (ROI)"}, unit: "%", format: "percentage" },
  ],
  thresholds: [{ fieldId: "roi", warning: 100, critical: 50, direction: "lower_is_bad", warningMessage: "ROI <%100 — SMED uygulaması sorgulanmalı.", warningMessage_i18n: {"en":"ROI <%100 — SMED uygulaması sorgulanmalı.","tr":"ROI <%100 — SMED uygulaması sorgulanmalı."}, criticalMessage: "ROI <%50 — SMED projesi yeniden değerlendirilmeli.", criticalMessage_i18n: {"en":"ROI <%50 — SMED projesi yeniden değerlendirilmeli.","tr":"ROI <%50 — SMED projesi yeniden değerlendirilmeli."} }],
  formulaPipeline: [
    { formulaId: "measurement.smed_capacity_recovered", inputMap: { currentChangeoverTime: "currentChangeoverTime", targetChangeoverTime: "targetChangeoverTime", changeoversPerMonth: "changeoversPerMonth" }, outputId: "capacityRecovered" },
    { formulaId: "cost.smed_financial_gain", inputMap: { capacityRecovered: "capacityRecovered", machineHourlyRate: "machineHourlyRate", operatorCount: "operatorCount" }, outputId: "financialGain" },
    { formulaId: "cost.smed_roi", inputMap: {
        financialGain: "financialGain",
        smedImplementationCost: "smedImplementationCost"
      }, outputId: "roi" },
  ],
  reportTemplate: { title: "SMED Değişim Optimizasyon Raporu", title_i18n: {"en":"SMED Değişim Optimizasyon Raporu","tr":"SMED Değişim Optimizasyon Raporu"}, sections: ["executive_summary", "loss_breakdown", "thresholds", "action_plan", "assumptions"], exportFormats: ["pdf", "excel"] },
  assumptions: { hiddenLossMultiplier: 1.1, volatilityPercent: 10, targetMarginPercent: 15, assumptionNotes: ["Kazanılan kapasite = (mevcut − hedef) × değişim sayısı × 12 / 60 saat.", "Finansal kazanç = kapasite × (makine + operatör) saatlik maliyet.", "ROI = (kazanç − uygulama) / uygulama × 100.", "SMED iç ve dış ayırma prensibine dayanır."],assumptionNotes_i18n:[{"en":"Kazanılan kapasite = (mevcut − hedef) × değişim sayısı × 12 / 60 saat.","tr":"Kazanılan kapasite = (mevcut − hedef) × değişim sayısı × 12 / 60 saat."},{"en":"Finansal kazanç = kapasite × (makine + operatör) saatlik maliyet.","tr":"Finansal kazanç = kapasite × (makine + operatör) saatlik maliyet."},{"en":"ROI = (kazanç − uygulama) / uygulama × 100.","tr":"ROI = (kazanç − uygulama) / uygulama × 100."},{"en":"SMED iç ve dış ayırma prensibine dayanır.","tr":"SMED iç ve dış ayırma prensibine dayanır."}] },
};
