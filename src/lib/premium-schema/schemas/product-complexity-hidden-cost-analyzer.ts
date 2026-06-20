/**
 * Tool #31 — Ürün Karmaşıklığı
 */
import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";
export const PRODUCT_COMPLEXITY_SCHEMA: PremiumCalculatorSchema = {
  id: "product-complexity-hidden-cost-analyzer", legacyPaidSlug: "product-complexity-hidden-cost-analyzer",
  name: "Ürün Karmaşıklığı Gizli Maliyet", sectorSlug: "cnc-manufacturing", category: "cost",
  painStatement: "Yüksek ürün çeşitliliği ve karmaşık tasarımlar, operasyonel gizli maliyetleri artırır. Her bir SKU'nun gerçek kârlılığı bilinmezse kaynak israfı kaçınılmazdır.",
  inputs: [
    { id: "numSkus", label: "SKU Sayısı", type: "number", unit: "adet", required: true, smartDefault: 50, validation: { min: 1 }, helper: "", expertMeaning: "Total number of active SKUs" },
    { id: "numPartsPerSku", label: "Parça Sayısı / SKU", type: "number", unit: "adet", required: true, smartDefault: 12, validation: { min: 1 }, helper: "", expertMeaning: "Average parts per SKU" },
    { id: "setupTime", label: "Ortalama Hazırlık Süresi", type: "number", unit: "dk", required: true, smartDefault: 45, validation: { min: 1 }, helper: "", expertMeaning: "Average setup time per batch" },
    { id: "hourlyRate", label: "Saatlik İşçilik Maliyeti", type: "number", unit: "USD/saat", required: true, smartDefault: 35, validation: { min: 1 }, helper: "", expertMeaning: "Labor cost per hour" },
    { id: "batchFrequency", label: "Parti Sıklığı / Yıl", type: "number", unit: "parti/yıl", required: true, smartDefault: 6, validation: { min: 1 }, helper: "", expertMeaning: "Batches per year per SKU" },
    { id: "complexityScore", label: "Karmaşıklık Skoru (1-10)", type: "number", unit: "", required: false, smartDefault: 5, validation: { min: 1, max: 10 }, helper: "", expertMeaning: "Engineering complexity rating" },
    { id: "avgMargin", label: "Ortalama Kâr Marjı", type: "number", unit: "%", required: false, smartDefault: 20, validation: { min: 0, max: 100 }, helper: "", expertMeaning: "Average profit margin per SKU" },
  ],
  outputs: [
    { id: "complexityIndex", label: "Karmaşıklık Endeksi", unit: "puan", format: "number" },
    { id: "hiddenCostComplexity", label: "Gizli Karmaşıklık Maliyeti", unit: "USD/yıl", format: "currency" },
    { id: "profitabilityPerSku", label: "SKU Başına Kârlılık", unit: "USD/adet", format: "currency" },
    { id: "totalSetupCost", label: "Toplam Hazırlık Maliyeti", unit: "USD/yıl", format: "currency" },
    { id: "wastePercent", label: "İsraf Oranı", unit: "%", format: "percentage" },
  ],
  thresholds: [
    { fieldId: "hiddenCostComplexity", warning: 50000, critical: 150000, direction: "higher_is_bad", warningMessage: "Gizli maliyet > $50K — ürün gruplaması ve standardizasyon önerilir.", criticalMessage: "Gizli maliyet > $150K — acil portföy sadeleştirmesi gerekli." },
    { fieldId: "complexityIndex", warning: 50, critical: 80, direction: "higher_is_bad", warningMessage: "Karmaşıklık endeksi > 50 — üretim hücreleri gözden geçirilmeli.", criticalMessage: "Karmaşıklık endeksi > 80 — ürün mimarisi yeniden tasarlanmalı." },
  ],
  formulaPipeline: [
    { formulaId: "measurement.complexity_index", inputMap: { numSkus: "numSkus", numPartsPerSku: "numPartsPerSku", setupTime: "setupTime", complexityScore: "complexityScore" }, outputId: "complexityIndex" },
    { formulaId: "cost.hidden_cost_complexity", inputMap: { complexityIndex: "complexityIndex", hourlyRate: "hourlyRate", batchFrequency: "batchFrequency", numSkus: "numSkus" }, outputId: "hiddenCostComplexity" },
    { formulaId: "cost.profitability_per_sku", inputMap: { avgMargin: "avgMargin", hiddenCostComplexity: "hiddenCostComplexity", numSkus: "numSkus" }, outputId: "profitabilityPerSku" },
    { formulaId: "cost.setup_total_cost", inputMap: { setupTime: "setupTime", hourlyRate: "hourlyRate", batchFrequency: "batchFrequency", numSkus: "numSkus" }, outputId: "totalSetupCost" },
    { formulaId: "measurement.waste_percentage", inputMap: { hiddenCostComplexity: "hiddenCostComplexity", numSkus: "numSkus", numPartsPerSku: "numPartsPerSku" }, outputId: "wastePercent" },
  ],
  reportTemplate: { title: "Ürün Karmaşıklığı Gizli Maliyet Raporu", sections: ["executive_summary", "loss_breakdown", "thresholds", "action_plan", "assumptions"], exportFormats: ["pdf", "excel"] },
  assumptions: { hiddenLossMultiplier: 1.15, volatilityPercent: 10, targetMarginPercent: 12, assumptionNotes: ["Karmaşıklık endeksi SKU, parça ve hazırlık süresine göre hesaplanır.", "Gizli maliyet = endeks × işçilik × parti sıklığı.", "SKU kârlılığı ortalama marjdan gizli maliyet düşülerek bulunur."] },
};
