/**
 * Tool #28 — Değişim Matrisi SMED
 */
import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";
export const SMED_CHANGEOVER_SCHEMA: PremiumCalculatorSchema = {
  id: "smed-changeover-matrix-analyzer", legacyPaidSlug: "smed-changeover-matrix-analyzer",
  name: "SMED Değişim Matrisi & EBQ Analizi", sectorSlug: "cnc-manufacturing", category: "measurement",
  painStatement: "Kalıp değişim süreleri SMED prensipleriyle optimize edilmezse kapasite kaybı yıllık büyük rakamlara ulaşır.", inputs: [
    { id: "internalSetup", label: "İç Ayar Süresi (T_internal)", type: "number", unit: "dak", required: true, smartDefault: 30, validation: { min: 0 }, helper: "", expertMeaning: "Internal (machine stopped) setup" },
    { id: "externalSetup", label: "Dış Ayar Süresi (T_external)", type: "number", unit: "dak", required: false, smartDefault: 10, validation: { min: 0 }, helper: "", expertMeaning: "External (machine running) setup" },
    { id: "conversionRate", label: "Dönüştürme Oranı", type: "number", unit: "%", required: false, smartDefault: 50, validation: { min: 0, max: 100 }, helper: "", expertMeaning: "Internal to external conversion rate" },
    { id: "changeoverFreq", label: "Aylık Değişim Sayısı", type: "number", unit: "adet/ay", required: true, smartDefault: 20, validation: { min: 0 }, helper: "", expertMeaning: "Monthly changeover count" },
    { id: "annualDemand", label: "Yıllık Talep", type: "number", unit: "adet", required: false, smartDefault: 100000, validation: { min: 0 }, helper: "", expertMeaning: "Annual demand" },
    { id: "setupCost", label: "Setup Maliyeti", type: "number", unit: "USD", required: false, smartDefault: 500, validation: { min: 0 }, helper: "", expertMeaning: "Cost per setup" },
    { id: "holdingCost", label: "Taşıma Maliyeti", type: "number", unit: "USD/adet/yıl", required: false, smartDefault: 2, validation: { min: 0 }, helper: "", expertMeaning: "Holding cost per unit" },
    { id: "machineRate", label: "Makine Saat Ücreti", type: "number", unit: "USD/saat", required: false, smartDefault: 85, validation: { min: 0 }, helper: "", expertMeaning: "Machine hourly rate" },
    { id: "targetSetup", label: "Hedef Setup Süresi (SMED)", type: "number", unit: "dak", required: false, smartDefault: 10, validation: { min: 0 }, helper: "", expertMeaning: "Target setup time after SMED" },
    { id: "availableTime", label: "Mevcut Süre/Ay", type: "number", unit: "dak", required: false, smartDefault: 19200, validation: { min: 0 }, helper: "", expertMeaning: "Available monthly minutes" },
  ],
  outputs: [
    { id: "totalSetup", label: "Toplam Setup Süresi", unit: "dak", format: "number" },
    { id: "ebq", label: "EBQ (Ekonomik Parti)", unit: "adet", format: "number" },
    { id: "annualSavings", label: "Yıllık Tasarruf", unit: "USD/yıl", format: "currency" },
    { id: "capacityGain", label: "Kapasite Kazanımı", unit: "%", format: "percentage", isBigNumber: true },
  ],
  thresholds: [{ fieldId: "annualSavings", warning: 10000, critical: 50000, direction: "higher_is_bad", warningMessage: "Tasarruf > $10K — SMED projesi başlatılmalı.", criticalMessage: "Tasarruf > $50K — acil SMED uygulaması gerekiyor." }],
  formulaPipeline: [
    { formulaId: "measurement.smed_setup_total", inputMap: { internalSetup: "internalSetup", externalSetup: "externalSetup" }, outputId: "totalSetup" },
    { formulaId: "measurement.smed_ebq", inputMap: { annualDemand: "annualDemand", setupCost: "setupCost", holdingCost: "holdingCost" }, outputId: "ebq" },
    { formulaId: "cost.smed_annual_savings", inputMap: { totalSetup: "totalSetup", targetSetup: "targetSetup", changeoverFreq: "changeoverFreq", machineRate: "machineRate" }, outputId: "annualSavings" },
    { formulaId: "measurement.smed_capacity_gain", inputMap: { totalSetup: "totalSetup", targetSetup: "targetSetup", changeoverFreq: "changeoverFreq", availableTime: "availableTime" }, outputId: "capacityGain" },
  ],
  reportTemplate: { title: "SMED Changeover Matrix Report", sections: ["executive_summary", "thresholds", "action_plan", "assumptions"], exportFormats: ["pdf", "excel"] },
  assumptions: { hiddenLossMultiplier: 1.1, volatilityPercent: 10, targetMarginPercent: 15, assumptionNotes: ["Total = Internal + External. EBQ = √(2×Demand×Setup/Holding).", "Annual savings = (T_total-T_target)×Freq×Rate×12/60."] },
};
