/**
 * Tool — Supplier TCO
 */
import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";
export const SUPPLIER_PERFORMANCE_TCO_ANALYZER: PremiumCalculatorSchema = {
  id: "supplier-performance-tco-analyzer", legacyPaidSlug: "supplier-performance-tco-analyzer",
  name: "Tedarikçi TCO Performans Analizi", sectorSlug: "quality", category: "cost",
  painStatement: "Tedarikçi seçiminde sadece birim fiyata bakılır; kalite, lojistik, stok ve hurda maliyetleri hesaba katılmazsa gerçek toplam sahip olma maliyeti gizli kalır.",
  inputs: [
    { id: "unitPrice", label: "Birim Fiyat", type: "number", unit: "USD/adet", required: true, smartDefault: 5, validation: { min: 0.01 }, helper: "", expertMeaning: "Price per unit" },
    { id: "annualVolume", label: "Yıllık Hacim", type: "number", unit: "adet", required: true, smartDefault: 50000, validation: { min: 1 }, helper: "", expertMeaning: "Annual purchase volume" },
    { id: "defectRate", label: "Hata Oranı", type: "number", unit: "%", required: true, smartDefault: 2, validation: { min: 0, max: 100 }, helper: "", expertMeaning: "Defect rate percentage" },
    { id: "costPerDefect", label: "Hata Başına Maliyet", type: "number", unit: "USD", required: true, smartDefault: 10, validation: { min: 0.01 }, helper: "", expertMeaning: "Cost per defective unit" },
    { id: "freightCostPerUnit", label: "Nakliye Birim Maliyeti", type: "number", unit: "USD/adet", required: false, smartDefault: 0.5, validation: { min: 0 }, helper: "", expertMeaning: "Freight cost per unit" },
    { id: "leadTimeDays", label: "Teslim Süresi", type: "number", unit: "gün", required: false, smartDefault: 14, validation: { min: 1 }, helper: "", expertMeaning: "Delivery lead time in days" },
    { id: "holdingCostPct", label: "Stok Taşıma Maliyeti Oranı", type: "number", unit: "%/yıl", required: false, smartDefault: 20, validation: { min: 0, max: 100 }, helper: "", expertMeaning: "Annual holding cost as % of unit price" },
    { id: "inspectionCostPerUnit", label: "Muayene Birim Maliyeti", type: "number", unit: "USD/adet", required: false, smartDefault: 0.1, validation: { min: 0 }, helper: "", expertMeaning: "Inspection cost per unit" },
  ],
  outputs: [
    { id: "supplierTco", label: "Toplam Sahip Olma Maliyeti (TCO)", unit: "USD/adet", format: "currency", isBigNumber: true },
  ],
  thresholds: [{ fieldId: "supplierTco", warning: 6, critical: 8, direction: "higher_is_bad", warningMessage: "TCO >$6/adet — tedarikçi performansı sorgulanmalı.", criticalMessage: "TCO >$8/adet — alternatif tedarikçi değerlendirmesi gerekli." }],
  formulaPipeline: [
    { formulaId: "cost.supplier_tco", inputMap: { unitPrice: "unitPrice", annualVolume: "annualVolume", defectRate: "defectRate", costPerDefect: "costPerDefect", freightCostPerUnit: "freightCostPerUnit", leadTimeDays: "leadTimeDays", holdingCostPct: "holdingCostPct", inspectionCostPerUnit: "inspectionCostPerUnit" }, outputId: "supplierTco" },
  ],
  reportTemplate: { title: "Tedarikçi TCO Raporu", sections: ["executive_summary", "loss_breakdown", "thresholds", "action_plan", "assumptions"], exportFormats: ["pdf", "excel"] },
  assumptions: { hiddenLossMultiplier: 1.1, volatilityPercent: 10, targetMarginPercent: 15, assumptionNotes: ["TCO = birim fiyat + hata maliyeti + nakliye + muayene + stok taşıma.", "Hata maliyeti = hata oranı × hacim × birim hata maliyeti / hacim.", "Stok taşıma = teslim süresi × günlük talep × taşıma oranı × birim fiyat / hacim.", "Kalite maliyetleri TCO'nun ortalama %15-30'unu oluşturur."] },
};
