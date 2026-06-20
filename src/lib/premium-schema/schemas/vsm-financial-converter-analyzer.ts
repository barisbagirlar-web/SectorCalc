/**
 * Tool #34 — VSM Finansal Dönüştürücü
 */
import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";
export const VSM_FINANCIAL_SCHEMA: PremiumCalculatorSchema = {
  id: "vsm-financial-converter-analyzer", legacyPaidSlug: "vsm-financial-converter-analyzer",
  name: "VSM Finansal Dönüştürücü", sectorSlug: "quality", category: "cost",
  painStatement: "Value Stream Mapping (VSM) çalışmaları operasyonel süreçleri gösterir ancak finansal etkiyi ölçmez. Katma değersiz adımların parasal karşılığı bilinmezse iyileştirme önceliklendirilemez.",
  inputs: [
    { id: "totalLeadTime", label: "Toplam Teslim Süresi", type: "number", unit: "dk", required: true, smartDefault: 480, validation: { min: 1 }, helper: "", expertMeaning: "Total lead time from order to delivery" },
    { id: "valueAddedTime", label: "Katma Değerli Süre", type: "number", unit: "dk", required: true, smartDefault: 120, validation: { min: 1 }, helper: "", expertMeaning: "Value-added processing time" },
    { id: "dailyProduction", label: "Günlük Üretim Miktarı", type: "number", unit: "adet/gün", required: true, smartDefault: 500, validation: { min: 1 }, helper: "", expertMeaning: "Daily production volume" },
    { id: "costPerMinute", label: "Dakika Başına Maliyet", type: "number", unit: "USD/dk", required: true, smartDefault: 1.5, validation: { min: 0.01 }, helper: "", expertMeaning: "Operating cost per minute" },
    { id: "operatingDays", label: "Çalışma Günü / Yıl", type: "number", unit: "gün", required: false, smartDefault: 240, validation: { min: 1 }, helper: "", expertMeaning: "Annual operating days" },
    { id: "reworkPercent", label: "Yeniden İşlem Oranı", type: "number", unit: "%", required: false, smartDefault: 5, validation: { min: 0, max: 100 }, helper: "", expertMeaning: "Rework percentage" },
  ],
  outputs: [
    { id: "vsmLeadtimeCost", label: "Teslim Süresi Maliyeti", unit: "USD/gün", format: "currency" },
    { id: "vsmValueAddedRatio", label: "Katma Değer Oranı", unit: "%", format: "percentage" },
    { id: "vsmNonValueAddedCost", label: "Katma Değersiz Maliyet", unit: "USD/yıl", format: "currency", isBigNumber: true },
    { id: "vsmTotalFinancialImpact", label: "Toplam Finansal Etki", unit: "USD/yıl", format: "currency", isBigNumber: true },
  ],
  thresholds: [
    { fieldId: "vsmValueAddedRatio", warning: 30, critical: 15, direction: "lower_is_bad", warningMessage: "KD oranı < %30 — süreçte önemli katma değersiz adımlar var.", criticalMessage: "KD oranı < %15 — süreç köklü yeniden yapılandırılmalı." },
    { fieldId: "vsmNonValueAddedCost", warning: 50000, critical: 150000, direction: "higher_is_bad", warningMessage: "KD maliyet > $50K — yalın dönüşüm önceliklendirilmeli.", criticalMessage: "KD maliyet > $150K — acil VSM atölyesi planlanmalı." },
  ],
  formulaPipeline: [
    { formulaId: "cost.vsm_leadtime_cost", inputMap: { totalLeadTime: "totalLeadTime", costPerMinute: "costPerMinute", dailyProduction: "dailyProduction" }, outputId: "vsmLeadtimeCost" },
    { formulaId: "measurement.vsm_value_added_ratio", inputMap: { valueAddedTime: "valueAddedTime", totalLeadTime: "totalLeadTime" }, outputId: "vsmValueAddedRatio" },
    { formulaId: "cost.vsm_non_value_added_cost", inputMap: { totalLeadTime: "totalLeadTime", valueAddedTime: "valueAddedTime", costPerMinute: "costPerMinute", dailyProduction: "dailyProduction", operatingDays: "operatingDays" }, outputId: "vsmNonValueAddedCost" },
    { formulaId: "cost.vsm_total_financial_impact", inputMap: { vsmNonValueAddedCost: "vsmNonValueAddedCost", vsmLeadtimeCost: "vsmLeadtimeCost", reworkPercent: "reworkPercent", dailyProduction: "dailyProduction", operatingDays: "operatingDays" }, outputId: "vsmTotalFinancialImpact" },
  ],
  reportTemplate: { title: "VSM Finansal Dönüştürücü Raporu", sections: ["executive_summary", "loss_breakdown", "thresholds", "action_plan", "assumptions"], exportFormats: ["pdf", "excel"] },
  assumptions: { hiddenLossMultiplier: 1.2, volatilityPercent: 10, targetMarginPercent: 10, assumptionNotes: ["Katma değer oranı = KD süre / toplam teslim süresi.", "KD olmayan maliyet = (toplam - KD süre) × birim maliyet × üretim.", "Fire ve yeniden işlem maliyeti KD olmayan maliyete dahildir."] },
};
