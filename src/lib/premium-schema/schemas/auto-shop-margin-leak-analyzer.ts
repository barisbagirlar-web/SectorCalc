/**
 * Tool #8 — Auto Shop Marj Kaçak (Margin Leak)
 * EffectiveLaborRate → NetMargin → AnnualLeakage
 */
import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";
export const AUTO_SHOP_MARGIN_LEAK_SCHEMA: PremiumCalculatorSchema = {
  id: "auto-shop-margin-leak-analyzer", legacyPaidSlug: "auto-shop-margin-leak-analyzer",
  name: "Auto Shop Marj Kaçak Analizi", sectorSlug: "auto-repair", category: "cost",
  painStatement: "Oto servislerde parça ve işçilik marjındaki küçük sapmalar yıllık yüz binlerce dolarlık kaçağa dönüşür. Bu araç marj yapısını analiz eder ve yıllık kaçağı hesaplar.",
  inputs: [
    { id: "monthlyPartsRevenue", label: "Aylık Parça Geliri", type: "number", unit: "USD", required: true, smartDefault: 40000, validation: { min: 0 }, helper: "", expertMeaning: "Parts revenue per month" },
    { id: "monthlyLaborRevenue", label: "Aylık İşçilik Geliri", type: "number", unit: "USD", required: true, smartDefault: 60000, validation: { min: 0 }, helper: "", expertMeaning: "Labor revenue per month" },
    { id: "partsCogs", label: "Parça COGS", type: "number", unit: "USD", required: true, smartDefault: 28000, validation: { min: 0 }, helper: "", expertMeaning: "Parts cost of goods sold" },
    { id: "laborCost", label: "İşçilik Maliyeti", type: "number", unit: "USD", required: true, smartDefault: 36000, validation: { min: 0 }, helper: "", expertMeaning: "Direct labor cost" },
    { id: "inventoryShrinkage", label: "Envanter Fire", type: "number", unit: "USD", required: false, smartDefault: 2000, validation: { min: 0 }, helper: "", expertMeaning: "Inventory shrinkage/loss" },
    { id: "totalFlagHours", label: "Flag Saatleri", type: "number", unit: "saat", required: true, smartDefault: 800, validation: { min: 0 }, helper: "", expertMeaning: "Total billed hours" },
    { id: "totalAvailableHours", label: "Mevcut Saatler", type: "number", unit: "saat", required: false, smartDefault: 1000, validation: { min: 0 }, helper: "", expertMeaning: "Total available technician hours" },
    { id: "totalOpEx", label: "Toplam OpEx", type: "number", unit: "USD", required: false, smartDefault: 35000, validation: { min: 0 }, helper: "", expertMeaning: "Total operating expenses" },
    { id: "industryBenchmarkMargin", label: "Sektör Benchmark Marjı", type: "number", unit: "%", required: false, smartDefault: 15, validation: { min: 0, max: 100 }, helper: "", expertMeaning: "Industry average net margin" },
    { id: "monthlyDiscounts", label: "Aylık İskontolar", type: "number", unit: "USD", required: false, smartDefault: 3000, validation: { min: 0 }, helper: "", expertMeaning: "Total discounts given" },
    { id: "netMarginInput", label: "Net Marj (%)", type: "number", unit: "%", required: true, smartDefault: 8, validation: { min: 0, max: 100 }, helper: "Mevcut net kâr marjınız.", expertMeaning: "Current net profit margin percentage" },
  ],
  outputs: [
    { id: "grossMarginParts", label: "Parça Brüt Marjı", unit: "%", format: "percentage" },
    { id: "effectiveLaborRate", label: "Efektif İşçilik Ücreti", unit: "USD/saat", format: "currency" },
    { id: "netMargin", label: "Net Marj", unit: "%", format: "percentage" },
    { id: "annualLeakage", label: "Yıllık Marj Kaçağı", unit: "USD", format: "currency", isBigNumber: true },
  ],
  thresholds: [
    { fieldId: "annualLeakage", warning: 30000, critical: 100000, direction: "higher_is_bad", warningMessage: "Yıllık kaçak > $30K — fiyatlama gözden geçirilmeli.", criticalMessage: "Yıllık kaçak > $100K — acil marj iyileştirme programı başlatılmalı." },
  ],
  formulaPipeline: [
    { formulaId: "cost.effective_labor_rate", inputMap: { laborRevenue: "monthlyLaborRevenue", flagHours: "totalFlagHours" }, outputId: "effectiveLaborRate" },
    { formulaId: "cost.annual_margin_leakage", inputMap: { totalRevenue: "monthlyLaborRevenue", targetMargin: "industryBenchmarkMargin", actualMargin: "netMarginInput" }, outputId: "annualLeakage" },
  ],
  reportTemplate: { title: "Auto Shop Margin Leak Report", sections: ["executive_summary", "loss_breakdown", "thresholds", "action_plan", "assumptions"], exportFormats: ["pdf", "excel"] },
  assumptions: { hiddenLossMultiplier: 1.15, volatilityPercent: 10, targetMarginPercent: 20, assumptionNotes: ["Gross margin = (Revenue - COGS) / Revenue. Parts margin excludes labor.", "Effective labor rate = Labor revenue / Flag hours.", "Net margin = (Total Revenue - COGS - OpEx) / Total Revenue.", "Annual leakage = Monthly revenue × (Target margin - Net margin) × 12."] },
};
