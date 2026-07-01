/**
 * Tool #31 — Ürün Karmaşıklığı
 */
import type { PremiumCalculatorSchema } from "@/lib/features/premium-schema/premium-calculator-schema";
export const PRODUCT_COMPLEXITY_SCHEMA: PremiumCalculatorSchema = {
  id: "product-complexity-hidden-cost-analyzer", legacyPaidSlug: "product-complexity-hidden-cost-analyzer",
  name: "Ürün Karmaşıklığı Gizli Maliyet", name_i18n: {"en":"Product Complexity Hidden Cost","tr":"Ürün Karmaşıklığı Gizli Maliyet"}, sectorSlug: "cnc-manufacturing", category: "cost",
  painStatement: "Yüksek ürün çeşitliliği ve karmaşık tasarımlar, operasyonel gizli maliyetleri artırır. Her bir SKU'nun gerçek kârlılığı bilinmezse kaynak israfı kaçınılmazdır.", painStatement_i18n: {"en":"High product variety and complex designs increase hidden operational costs. Without knowing each SKU's true profitability, resource waste is inevitable.","tr":"Yüksek ürün çeşitliliği ve karmaşık tasarımlar, operasyonel gizli maliyetleri artırır. Her bir SKU'nun gerçek kârlılığı bilinmezse kaynak israfı kaçınılmazdır."},
  inputs: [
    { id: "numSkus", label: "SKU Sayısı", label_i18n: {"en":"Total number of active SKUs","tr":"SKU Sayısı"}, type: "number", unit: "adet", required: true, smartDefault: 50, validation: { min: 1 }, helper: "", expertMeaning: "Total number of active SKUs", expertMeaning_i18n: {"en":"Total number of active SKUs","tr":"sku sayısı"} },
    { id: "numPartsPerSku", label: "Parça Sayısı / SKU", label_i18n: {"en":"Average parts per SKU","tr":"Parça Sayısı / SKU"}, type: "number", unit: "adet", required: true, smartDefault: 12, validation: { min: 1 }, helper: "", expertMeaning: "Average parts per SKU", expertMeaning_i18n: {"en":"Average parts per SKU","tr":"parça sayısı / sku"} },
    { id: "setupTime", label: "Ortalama Hazırlık Süresi", label_i18n: {"en":"Average setup time per batch","tr":"Ortalama Hazırlık Süresi"}, type: "number", unit: "dk", required: true, smartDefault: 45, validation: { min: 1 }, helper: "", expertMeaning: "Average setup time per batch", expertMeaning_i18n: {"en":"Average setup time per batch","tr":"ortalama hazırlık süresi"} },
    { id: "hourlyRate", label: "Saatlik İşçilik Maliyeti", label_i18n: {"en":"Labor cost per hour","tr":"Saatlik İşçilik Maliyeti"}, type: "number", unit: "USD/saat", required: true, smartDefault: 35, validation: { min: 1 }, helper: "", expertMeaning: "Labor cost per hour", expertMeaning_i18n: {"en":"Labor cost per hour","tr":"saatlik i̇şçilik maliyeti"} },
    { id: "batchFrequency", label: "Parti Sıklığı / Yıl", label_i18n: {"en":"Batches per year per SKU","tr":"Parti Sıklığı / Yıl"}, type: "number", unit: "parti/yıl", required: true, smartDefault: 6, validation: { min: 1 }, helper: "", expertMeaning: "Batches per year per SKU", expertMeaning_i18n: {"en":"Batches per year per SKU","tr":"parti sıklığı / yıl"} },
    { id: "complexityScore", label: "Karmaşıklık Skoru (1-10)", label_i18n: {"en":"Engineering complexity rating","tr":"Karmaşıklık Skoru (1-10)"}, type: "number", unit: "", required: false, smartDefault: 5, validation: { min: 1, max: 10 }, helper: "", expertMeaning: "Engineering complexity rating", expertMeaning_i18n: {"en":"Engineering complexity rating","tr":"karmaşıklık skoru (1-10)"} },
    { id: "avgMargin", label: "Ortalama Kâr Marjı", label_i18n: {"en":"Average profit margin per SKU","tr":"Ortalama Kâr Marjı"}, type: "number", unit: "%", required: false, smartDefault: 20, validation: { min: 0, max: 100 }, helper: "", expertMeaning: "Average profit margin per SKU", expertMeaning_i18n: {"en":"Average profit margin per SKU","tr":"ortalama kâr marjı"} },
  ],
  outputs: [
    { id: "complexityIndex", label: "Karmaşıklık Endeksi", label_i18n: {"en":"Complexity Index","tr":"Karmaşıklık Endeksi"}, unit: "puan", format: "number" },
    { id: "hiddenCostComplexity", label: "Gizli Karmaşıklık Maliyeti", label_i18n: {"en":"Gizli Karmasklk Maliyeti","tr":"Gizli Karmaşıklık Maliyeti"}, unit: "USD/yıl", format: "currency" },
    { id: "profitabilityPerSku", label: "SKU Başına Kârlılık", label_i18n: {"en":"SKU Basna Karllk","tr":"SKU Başına Kârlılık"}, unit: "USD/adet", format: "currency" },
    { id: "totalSetupCost", label: "Toplam Hazırlık Maliyeti", label_i18n: {"en":"Toplam Hazrlk Maliyeti","tr":"Toplam Hazırlık Maliyeti"}, unit: "USD/yıl", format: "currency" },
    { id: "wastePercent", label: "İsraf Oranı", label_i18n: {"en":"Israf Oran","tr":"İsraf Oranı"}, unit: "%", format: "percentage" },
  ],
  thresholds: [
    { fieldId: "hiddenCostComplexity", warning: 50000, critical: 150000, direction: "higher_is_bad", warningMessage: "Gizli maliyet > $50K — ürün gruplaması ve standardizasyon önerilir.", warningMessage_i18n: {"en":"Gizli maliyet > $50K — ürün gruplaması ve standardizasyon önerilir.","tr":"Gizli maliyet > $50K — ürün gruplaması ve standardizasyon önerilir."}, criticalMessage: "Gizli maliyet > $150K — acil portföy sadeleştirmesi gerekli.", criticalMessage_i18n: {"en":"Gizli maliyet > $150K — acil portföy sadeleştirmesi gerekli.","tr":"Gizli maliyet > $150K — acil portföy sadeleştirmesi gerekli."} },
    { fieldId: "complexityIndex", warning: 50, critical: 80, direction: "higher_is_bad", warningMessage: "Karmaşıklık endeksi > 50 — üretim hücreleri gözden geçirilmeli.", warningMessage_i18n: {"en":"Karmaşıklık endeksi > 50 — üretim hücreleri gözden geçirilmeli.","tr":"Karmaşıklık endeksi > 50 — üretim hücreleri gözden geçirilmeli."}, criticalMessage: "Karmaşıklık endeksi > 80 — ürün mimarisi yeniden tasarlanmalı.", criticalMessage_i18n: {"en":"Karmaşıklık endeksi > 80 — ürün mimarisi yeniden tasarlanmalı.","tr":"Karmaşıklık endeksi > 80 — ürün mimarisi yeniden tasarlanmalı."} },
  ],
  formulaPipeline: [
    { formulaId: "measurement.complexity_index", inputMap: { numSkus: "numSkus", numPartsPerSku: "numPartsPerSku", setupTime: "setupTime", complexityScore: "complexityScore" ,
        uniqueParts: "uniqueParts",
        totalParts: "totalParts"}, outputId: "complexityIndex" },
    { formulaId: "cost.hidden_cost_complexity", inputMap: {
        complexityIndex: "complexityIndex",
        annualOverhead: "hourlyRate",
        batchFrequency: "batchFrequency",
        numSkus: "numSkus"
      }, outputId: "hiddenCostComplexity" },
    { formulaId: "cost.profitability_per_sku", inputMap: {
        skuRevenue: "avgMargin",
        skuCost: "hiddenCostComplexity",
        skuQty: "numSkus"
      }, outputId: "profitabilityPerSku" },
    { formulaId: "cost.setup_total_cost", inputMap: { setupTime: "setupTime", hourlyRate: "hourlyRate", batchFrequency: "batchFrequency", numSkus: "numSkus" ,
        changeoverTime: "changeoverTime",
        costPerMinute: "costPerMinute"}, outputId: "totalSetupCost" },
    { formulaId: "measurement.waste_percentage", inputMap: { hiddenCostComplexity: "hiddenCostComplexity", numSkus: "numSkus", numPartsPerSku: "numPartsPerSku" ,
        waste: "waste",
        total: "total"}, outputId: "wastePercent" },
  ],
  reportTemplate: { title: "Ürün Karmaşıklığı Gizli Maliyet Raporu", title_i18n: {"en":"Product Complexity Hidden Cost Report","tr":"Ürün Karmaşıklığı Gizli Maliyet Raporu"}, sections: ["executive_summary", "loss_breakdown", "thresholds", "action_plan", "assumptions"], exportFormats: ["pdf", "excel"] },
  assumptions: { hiddenLossMultiplier: 1.15, volatilityPercent: 10, targetMarginPercent: 12, assumptionNotes: ["Karmaşıklık endeksi SKU, parça ve hazırlık süresine göre hesaplanır.", "Gizli maliyet = endeks × işçilik × parti sıklığı.", "SKU kârlılığı ortalama marjdan gizli maliyet düşülerek bulunur."],assumptionNotes_i18n:[{"en":"Karmaşıklık endeksi SKU, parça ve hazırlık süresine göre hesaplanır.","tr":"Karmaşıklık endeksi SKU, parça ve hazırlık süresine göre hesaplanır."},{"en":"Gizli maliyet = endeks × işçilik × parti sıklığı.","tr":"Gizli maliyet = endeks × işçilik × parti sıklığı."},{"en":"SKU kârlılığı ortalama marjdan gizli maliyet düşülerek bulunur.","tr":"SKU kârlılığı ortalama marjdan gizli maliyet düşülerek bulunur."}] },
};
