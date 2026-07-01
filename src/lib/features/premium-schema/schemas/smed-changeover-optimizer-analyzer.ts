/**
 * Tool — SMED Changeover Duration Optimizer
 */
import type { PremiumCalculatorSchema } from "@/lib/features/premium-schema/premium-calculator-schema";
export const SMED_CHANGEOVER_OPTIMIZER_ANALYZER: PremiumCalculatorSchema = {
  id: "smed-changeover-optimizer-analyzer", legacyPaidSlug: "smed-changeover-optimizer-analyzer",
  name: "SMED Changeover Duration Optimizer", name_i18n: {"en":"SMED Changeover Duration Optimizer"}, sectorSlug: "cnc-manufacturing", category: "cost",
  painStatement: "Long mold changeover times increase machine downtime, cause capacity loss, and remain invisible if SMED is not applied.", painStatement_i18n: {"en":"Long mold changeover times increase machine downtime, cause capacity loss, and remain invisible if SMED is not applied."},
  inputs: [
    { id: "currentChangeoverTime", label: "Current changeover time in minutes", label_i18n: {"en":"Current changeover time in minutes"}, type: "number", unit: "dakika", required: true, smartDefault: 45, validation: { min: 1 }, helper: "", expertMeaning: "Current changeover time in minutes", expertMeaning_i18n: {"en":"Current changeover time in minutes"} },
    { id: "changeoversPerMonth", label: "Changeovers per month", label_i18n: {"en":"Changeovers per month"}, type: "number", unit: "adet", required: true, smartDefault: 30, validation: { min: 1 }, helper: "", expertMeaning: "Changeovers per month", expertMeaning_i18n: {"en":"Changeovers per month"} },
    { id: "targetChangeoverTime", label: "Target changeover time after SMED", label_i18n: {"en":"Target changeover time after SMED"}, type: "number", unit: "dakika", required: false, smartDefault: 15, validation: { min: 1 }, helper: "", expertMeaning: "Target changeover time after SMED", expertMeaning_i18n: {"en":"Target changeover time after SMED"} },
    { id: "machineHourlyRate", label: "Makine Saatlik Maliyeti", label_i18n: {"en":"Makine Hourly Cost"}, type: "number", unit: "USD/saat", required: true, smartDefault: 85, validation: { min: 1 }, helper: "", expertMeaning: "Machine cost per hour", expertMeaning_i18n: {"en":"Machine cost per hour"} },
    { id: "operatorCount", label: "Operators during changeover", label_i18n: {"en":"Operators during changeover"}, type: "number", unit: "adet", required: false, smartDefault: 2, validation: { min: 1 }, helper: "", expertMeaning: "Operators during changeover", expertMeaning_i18n: {"en":"Operators during changeover"} },
    { id: "smedImplementationCost", label: "SMED Uygulama Maliyeti", label_i18n: {"en":"SMED application Cost"}, type: "number", unit: "USD", required: false, smartDefault: 5000, validation: { min: 0 }, helper: "", expertMeaning: "Cost to implement SMED", expertMeaning_i18n: {"en":"Cost to implement SMED"} },
  ],
  outputs: [
    { id: "capacityRecovered", label: "Kazanlan Kapasite", label_i18n: {"en":"Kazanlan Capacity"}, unit: "saat/yıl", format: "number", isBigNumber: true },
    { id: "financialGain", label: "Finansal Kazanc", label_i18n: {"en":"Finansal Gain"}, unit: "USD/yıl", format: "currency" },
    { id: "roi", label: "Yatrm Getirisi (ROI)", label_i18n: {"en":"Yatrm Return (ROI)"}, unit: "%", format: "percentage" },
  ],
  thresholds: [{ fieldId: "roi", warning: 100, critical: 50, direction: "lower_is_bad", warningMessage: "ROI <%100 — SMED uygulaması sorgulanmalı.", warningMessage_i18n: {"en":"ROI <%100 — SMED uygulaması sorgulanmalı."}, criticalMessage: "ROI <%50 — SMED projesi yeniden değerlendirilmeli.", criticalMessage_i18n: {"en":"ROI <%50 — SMED projesi re değerlendirilmeli."} }],
  formulaPipeline: [
    { formulaId: "measurement.smed_capacity_recovered", inputMap: { currentChangeoverTime: "currentChangeoverTime", targetChangeoverTime: "targetChangeoverTime", changeoversPerMonth: "changeoversPerMonth" ,
        currentSetup: "currentSetup",
        targetSetup: "targetSetup",
        changeoverFreq: "changeoverFreq"}, outputId: "capacityRecovered" },
    { formulaId: "cost.smed_financial_gain", inputMap: { capacityRecovered: "capacityRecovered", machineHourlyRate: "machineHourlyRate", operatorCount: "operatorCount" ,
        bottleneckThroughput: "bottleneckThroughput",
        unitMargin: "unitMargin"}, outputId: "financialGain" },
    { formulaId: "cost.smed_roi", inputMap: {
        financialGain: "financialGain",
        smedImplementationCost: "smedImplementationCost"
      ,
        smedInvestment: "smedInvestment"}, outputId: "roi" },
  ],
  reportTemplate: { title: "SMED Changeover Optimization Report", title_i18n: {"en":"SMED Changeover Optimization Report"}, sections: ["executive_summary", "loss_breakdown", "thresholds", "action_plan", "assumptions"], exportFormats: ["pdf", "excel"] },
  assumptions: { hiddenLossMultiplier: 1.1, volatilityPercent: 10, targetMarginPercent: 15, assumptionNotes: ["Kazanılan kapasite = (mevcut − hedef) × değişim sayısı × 12 / 60 saat.", "Finansal kazanç = kapasite × (makine + operatör) saatlik maliyet.", "ROI = (kazanç − uygulama) / uygulama × 100.", "SMED iç ve dış ayırma prensibine dayanır."],assumptionNotes_i18n:[{"en":"Kazanılan kapasite = (mevcut − hedef) × değişim sayısı × 12 / 60 saat."},{"en":"Finansal kazanç = kapasite × (makine + operatör) saatlik maliyet."},{"en":"ROI = (kazanç − uygulama) / uygulama × 100."},{"en":"SMED iç ve dış ayırma prensibine dayanır."}] },
};
