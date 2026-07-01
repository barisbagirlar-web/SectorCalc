/**
 * Tool #31 — Ürün Karmaşıklığı
 */
import type { PremiumCalculatorSchema } from "@/lib/features/premium-schema/premium-calculator-schema";
export const PRODUCT_COMPLEXITY_SCHEMA: PremiumCalculatorSchema = {
  id: "product-complexity-hidden-cost-analyzer", legacyPaidSlug: "product-complexity-hidden-cost-analyzer",
  name: "Product Complexity Hidden Cost", name_i18n: {"en":"Product Complexity Hidden Cost"}, sectorSlug: "cnc-manufacturing", category: "cost",
  painStatement: "High product variety and complex designs increase hidden operational costs. Without knowing each SKU's true profitability, resource waste is inevitable.", painStatement_i18n: {"en":"High product variety and complex designs increase hidden operational costs. Without knowing each SKU's true profitability, resource waste is inevitable."},
  inputs: [
    { id: "numSkus", label: "Total number of active SKUs", label_i18n: {"en":"Total number of active SKUs"}, type: "number", unit: "adet", required: true, smartDefault: 50, validation: { min: 1 }, helper: "", expertMeaning: "Total number of active SKUs", expertMeaning_i18n: {"en":"Total number of active SKUs"} },
    { id: "numPartsPerSku", label: "Average parts per SKU", label_i18n: {"en":"Average parts per SKU"}, type: "number", unit: "adet", required: true, smartDefault: 12, validation: { min: 1 }, helper: "", expertMeaning: "Average parts per SKU", expertMeaning_i18n: {"en":"Average parts per SKU"} },
    { id: "setupTime", label: "Average setup time per batch", label_i18n: {"en":"Average setup time per batch"}, type: "number", unit: "dk", required: true, smartDefault: 45, validation: { min: 1 }, helper: "", expertMeaning: "Average setup time per batch", expertMeaning_i18n: {"en":"Average setup time per batch"} },
    { id: "hourlyRate", label: "Labor cost per hour", label_i18n: {"en":"Labor cost per hour"}, type: "number", unit: "USD/saat", required: true, smartDefault: 35, validation: { min: 1 }, helper: "", expertMeaning: "Labor cost per hour", expertMeaning_i18n: {"en":"Labor cost per hour"} },
    { id: "batchFrequency", label: "Batches per year per SKU", label_i18n: {"en":"Batches per year per SKU"}, type: "number", unit: "parti/yıl", required: true, smartDefault: 6, validation: { min: 1 }, helper: "", expertMeaning: "Batches per year per SKU", expertMeaning_i18n: {"en":"Batches per year per SKU"} },
    { id: "complexityScore", label: "Engineering complexity rating", label_i18n: {"en":"Engineering complexity rating"}, type: "number", unit: "", required: false, smartDefault: 5, validation: { min: 1, max: 10 }, helper: "", expertMeaning: "Engineering complexity rating", expertMeaning_i18n: {"en":"Engineering complexity rating"} },
    { id: "avgMargin", label: "Average profit margin per SKU", label_i18n: {"en":"Average profit margin per SKU"}, type: "number", unit: "%", required: false, smartDefault: 20, validation: { min: 0, max: 100 }, helper: "", expertMeaning: "Average profit margin per SKU", expertMeaning_i18n: {"en":"Average profit margin per SKU"} },
  ],
  outputs: [
    { id: "complexityIndex", label: "Complexity Index", label_i18n: {"en":"Complexity Index"}, unit: "puan", format: "number" },
    { id: "hiddenCostComplexity", label: "Gizli Karmasklk Maliyeti", label_i18n: {"en":"latent Karmasklk Cost"}, unit: "USD/yıl", format: "currency" },
    { id: "profitabilityPerSku", label: "SKU Basna Karllk", label_i18n: {"en":"SKU Per Karllk"}, unit: "USD/adet", format: "currency" },
    { id: "totalSetupCost", label: "Toplam Hazrlk Maliyeti", label_i18n: {"en":"Total Hazrlk Cost"}, unit: "USD/yıl", format: "currency" },
    { id: "wastePercent", label: "Israf Oran", label_i18n: {"en":"Waste Rate"}, unit: "%", format: "percentage" },
  ],
  thresholds: [
    { fieldId: "hiddenCostComplexity", warning: 50000, critical: 150000, direction: "higher_is_bad", warningMessage: "Gizli maliyet > $50K — ürün gruplaması ve standardizasyon önerilir.", warningMessage_i18n: {"en":"latent Cost > $50K — product gruplaması ve standardizasyon önerilir."}, criticalMessage: "Gizli maliyet > $150K — acil portföy sadeleştirmesi gerekli.", criticalMessage_i18n: {"en":"latent Cost > $150K — urgent portföy sadeleştirmesi gerekli."} },
    { fieldId: "complexityIndex", warning: 50, critical: 80, direction: "higher_is_bad", warningMessage: "Karmaşıklık endeksi > 50 — üretim hücreleri gözden geçirilmeli.", warningMessage_i18n: {"en":"Karmaşıklık endeksi > 50 — Production hücreleri gözden geçirilmeli."}, criticalMessage: "Karmaşıklık endeksi > 80 — ürün mimarisi yeniden tasarlanmalı.", criticalMessage_i18n: {"en":"Karmaşıklık endeksi > 80 — product mimarisi re tasarlanmalı."} },
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
  reportTemplate: { title: "Product Complexity Hidden Cost Report", title_i18n: {"en":"Product Complexity Hidden Cost Report"}, sections: ["executive_summary", "loss_breakdown", "thresholds", "action_plan", "assumptions"], exportFormats: ["pdf", "excel"] },
  assumptions: { hiddenLossMultiplier: 1.15, volatilityPercent: 10, targetMarginPercent: 12, assumptionNotes: ["Karmaşıklık endeksi SKU, parça ve hazırlık süresine göre hesaplanır.", "Gizli maliyet = endeks × işçilik × parti sıklığı.", "SKU kârlılığı ortalama marjdan gizli maliyet düşülerek bulunur."],assumptionNotes_i18n:[{"en":"Karmaşıklık endeksi SKU, parça ve hazırlık süresine göre hesaplanır."},{"en":"Gizli maliyet = endeks × işçilik × parti sıklığı."},{"en":"SKU kârlılığı ortalama marjdan gizli maliyet düşülerek bulunur."}] },
};
