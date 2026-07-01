/**
 * Tool #28 — Değişim Matrisi SMED
 */
import type { PremiumCalculatorSchema } from "@/lib/features/premium-schema/premium-calculator-schema";
export const SMED_CHANGEOVER_SCHEMA: PremiumCalculatorSchema = {
  id: "smed-changeover-matrix-analyzer", legacyPaidSlug: "smed-changeover-matrix-analyzer",
  name: "SMED Değişim Matrisi & EBQ Analizi", name_i18n: {"en":"SMED Changeover Matrix & EBQ Analyzer","tr":"SMED Değişim Matrisi & EBQ Analizi"}, sectorSlug: "cnc-manufacturing", category: "measurement",
  painStatement: "Kalıp değişim süreleri SMED prensipleriyle optimize edilmezse kapasite kaybı yıllık büyük rakamlara ulaşır.", painStatement_i18n: {"en":"Kalıp değişim süreleri SMED prensipleriyle optimize edilmezse kapasite kaybı yıllık büyük rakamlara ulaşır.","tr":"Kalıp değişim süreleri SMED prensipleriyle optimize edilmezse kapasite kaybı yıllık büyük rakamlara ulaşır."}, inputs: [
    { id: "internalSetup", label: "İç Ayar Süresi (T_internal)", label_i18n: {"en":"Internal (machine stopped) setup","tr":"İç Ayar Süresi (T_internal)"}, type: "number", unit: "dak", required: true, smartDefault: 30, validation: { min: 0 }, helper: "", expertMeaning: "Internal (machine stopped) setup", expertMeaning_i18n: {"en":"Internal (machine stopped) setup","tr":"i̇ç ayar süresi (t_internal)"} },
    { id: "externalSetup", label: "Dış Ayar Süresi (T_external)", label_i18n: {"en":"External (machine running) setup","tr":"Dış Ayar Süresi (T_external)"}, type: "number", unit: "dak", required: false, smartDefault: 10, validation: { min: 0 }, helper: "", expertMeaning: "External (machine running) setup", expertMeaning_i18n: {"en":"External (machine running) setup","tr":"dış ayar süresi (t_external)"} },
    { id: "conversionRate", label: "Dönüştürme Oranı", label_i18n: {"en":"Internal to external conversion rate","tr":"Dönüştürme Oranı"}, type: "number", unit: "%", required: false, smartDefault: 50, validation: { min: 0, max: 100 }, helper: "", expertMeaning: "Internal to external conversion rate", expertMeaning_i18n: {"en":"Internal to external conversion rate","tr":"dönüştürme oranı"} },
    { id: "changeoverFreq", label: "Aylık Değişim Sayısı", label_i18n: {"en":"Monthly changeover count","tr":"Aylık Değişim Sayısı"}, type: "number", unit: "adet/ay", required: true, smartDefault: 20, validation: { min: 0 }, helper: "", expertMeaning: "Monthly changeover count", expertMeaning_i18n: {"en":"Monthly changeover count","tr":"aylık değişim sayısı"} },
    { id: "annualDemand", label: "Yıllık Talep", label_i18n: {"en":"Annual demand","tr":"Yıllık Talep"}, type: "number", unit: "adet", required: false, smartDefault: 100000, validation: { min: 0 }, helper: "", expertMeaning: "Annual demand", expertMeaning_i18n: {"en":"Annual demand","tr":"yıllık talep"} },
    { id: "setupCost", label: "Setup Maliyeti", label_i18n: {"en":"Setup Maliyeti","tr":"Setup Maliyeti"}, type: "number", unit: "USD", required: false, smartDefault: 500, validation: { min: 0 }, helper: "", expertMeaning: "Cost per setup", expertMeaning_i18n: {"en":"Cost per setup","tr":"Cost per setup"} },
    { id: "holdingCost", label: "Taşıma Maliyeti", label_i18n: {"en":"Holding cost per unit","tr":"Taşıma Maliyeti"}, type: "number", unit: "USD/adet/yıl", required: false, smartDefault: 2, validation: { min: 0 }, helper: "", expertMeaning: "Holding cost per unit", expertMeaning_i18n: {"en":"Holding cost per unit","tr":"taşıma maliyeti"} },
    { id: "machineRate", label: "Makine Saat Ücreti", label_i18n: {"en":"Machine hourly rate","tr":"Makine Saat Ücreti"}, type: "number", unit: "USD/saat", required: false, smartDefault: 85, validation: { min: 0 }, helper: "", expertMeaning: "Machine hourly rate", expertMeaning_i18n: {"en":"Machine hourly rate","tr":"makine saat ücreti"} },
    { id: "targetSetup", label: "Hedef Setup Süresi (SMED)", label_i18n: {"en":"Target setup time after SMED","tr":"Hedef Setup Süresi (SMED)"}, type: "number", unit: "dak", required: false, smartDefault: 10, validation: { min: 0 }, helper: "", expertMeaning: "Target setup time after SMED", expertMeaning_i18n: {"en":"Target setup time after SMED","tr":"hedef setup süresi (smed)"} },
    { id: "availableTime", label: "Mevcut Süre/Ay", label_i18n: {"en":"Available monthly minutes","tr":"Mevcut Süre/Ay"}, type: "number", unit: "dak", required: false, smartDefault: 19200, validation: { min: 0 }, helper: "", expertMeaning: "Available monthly minutes", expertMeaning_i18n: {"en":"Available monthly minutes","tr":"mevcut süre/ay"} },
  ],
  outputs: [
    { id: "totalSetup", label: "Toplam Setup Süresi", label_i18n: {"en":"Toplam Setup Suresi","tr":"Toplam Setup Süresi"}, unit: "dak", format: "number" },
    { id: "ebq", label: "EBQ (Ekonomik Parti)", label_i18n: {"en":"EBQ (Ekonomik Parti)","tr":"EBQ (Ekonomik Parti)"}, unit: "adet", format: "number" },
    { id: "annualSavings", label: "Yıllık Tasarruf", label_i18n: {"en":"Yllk Tasarruf","tr":"Yıllık Tasarruf"}, unit: "USD/yıl", format: "currency" },
    { id: "capacityGain", label: "Kapasite Kazanımı", label_i18n: {"en":"Kapasite Kazanm","tr":"Kapasite Kazanımı"}, unit: "%", format: "percentage", isBigNumber: true },
  ],
  thresholds: [{ fieldId: "annualSavings", warning: 10000, critical: 50000, direction: "higher_is_bad", warningMessage: "Tasarruf > $10K — SMED projesi başlatılmalı.", warningMessage_i18n: {"en":"Tasarruf > $10K — SMED projesi başlatılmalı.","tr":"Tasarruf > $10K — SMED projesi başlatılmalı."}, criticalMessage: "Tasarruf > $50K — acil SMED uygulaması gerekiyor.", criticalMessage_i18n: {"en":"Tasarruf > $50K — acil SMED uygulaması gerekiyor.","tr":"Tasarruf > $50K — acil SMED uygulaması gerekiyor."} }],
  formulaPipeline: [
    { formulaId: "measurement.smed_setup_total", inputMap: { internalSetup: "internalSetup", externalSetup: "externalSetup" }, outputId: "totalSetup" },
    { formulaId: "measurement.smed_ebq", inputMap: { annualDemand: "annualDemand", setupCost: "setupCost", holdingCost: "holdingCost" ,
        demand: "demand"}, outputId: "ebq" },
    { formulaId: "cost.smed_annual_savings", inputMap: { totalSetup: "totalSetup", targetSetup: "targetSetup", changeoverFreq: "changeoverFreq", machineRate: "machineRate" ,
        targetTime: "targetTime"}, outputId: "annualSavings" },
    { formulaId: "measurement.smed_capacity_gain", inputMap: { totalSetup: "totalSetup", targetSetup: "targetSetup", changeoverFreq: "changeoverFreq", availableTime: "availableTime" ,
        targetTime: "targetTime"}, outputId: "capacityGain" },
  ],
  reportTemplate: { title: "SMED Changeover Matrix Report", title_i18n: {"en":"SMED Changeover Matrix Report","tr":"SMED Changeover Matrix Report"}, sections: ["executive_summary", "thresholds", "action_plan", "assumptions"], exportFormats: ["pdf", "excel"] },
  assumptions: { hiddenLossMultiplier: 1.1, volatilityPercent: 10, targetMarginPercent: 15, assumptionNotes: ["Total = Internal + External. EBQ = √(2×Demand×Setup/Holding).", "Annual savings = (T_total-T_target)×Freq×Rate×12/60."],assumptionNotes_i18n:[{"en":"Total = Internal + External. EBQ = √(2×Demand×Setup/Holding).","tr":"Total = Internal + External. EBQ = √(2×Demand×Setup/Holding)."},{"en":"Annual savings = (T_total-T_target)×Freq×Rate×12/60.","tr":"Annual savings = (T_total-T_target)×Freq×Rate×12/60."}] },
};
