
import type { PremiumCalculatorSchema } from "@/lib/features/premium-schema/premium-calculator-schema";
export const PRODUCT_COMPLEXITY_SCHEMA: PremiumCalculatorSchema = {
  id: "product-complexity-hidden-cost-analyzer", legacyPaidSlug: "product-complexity-hidden-cost-analyzer",
  name: "Product Complexity Hidden Cost", name_i18n: {"en":"Product Complexity Hidden Cost"}, sectorSlug: "cnc-manufacturing", category: "cost",
  painStatement: "High product variety and complex designs increase hidden operational costs. Without knowing each SKU's true profitability, resource waste is inevitable.", painStatement_i18n: {"en":"High product variety and complex designs increase hidden operational costs. Without knowing each SKU's true profitability, resource waste is inevitable."},
  inputs: [
    { id: "numSkus", label: "Total number of active SKUs", label_i18n: {"en":"Total number of active SKUs"}, type: "number", unit: "units", required: true, smartDefault: 50, validation: { min: 1 }, helper: "", expertMeaning: "Total number of active SKUs", expertMeaning_i18n: {"en":"Total number of active SKUs"} },
    { id: "numPartsPerSku", label: "Average parts per SKU", label_i18n: {"en":"Average parts per SKU"}, type: "number", unit: "units", required: true, smartDefault: 12, validation: { min: 1 }, helper: "", expertMeaning: "Average parts per SKU", expertMeaning_i18n: {"en":"Average parts per SKU"} },
    { id: "setupTime", label: "Average setup time per batch", label_i18n: {"en":"Average setup time per batch"}, type: "number", unit: "dk", required: true, smartDefault: 45, validation: { min: 1 }, helper: "", expertMeaning: "Average setup time per batch", expertMeaning_i18n: {"en":"Average setup time per batch"} },
    { id: "hourlyRate", label: "Labor cost per hour", label_i18n: {"en":"Labor cost per hour"}, type: "number", unit: "USD/hour", required: true, smartDefault: 35, validation: { min: 1 }, helper: "", expertMeaning: "Labor cost per hour", expertMeaning_i18n: {"en":"Labor cost per hour"} },
    { id: "batchFrequency", label: "Batches per year per SKU", label_i18n: {"en":"Batches per year per SKU"}, type: "number", unit: "parti/yil", required: true, smartDefault: 6, validation: { min: 1 }, helper: "", expertMeaning: "Batches per year per SKU", expertMeaning_i18n: {"en":"Batches per year per SKU"} },
    { id: "complexityScore", label: "Engineering complexity rating", label_i18n: {"en":"Engineering complexity rating"}, type: "number", unit: "", required: false, smartDefault: 5, validation: { min: 1, max: 10 }, helper: "", expertMeaning: "Engineering complexity rating", expertMeaning_i18n: {"en":"Engineering complexity rating"} },
    { id: "avgMargin", label: "Average profit margin per SKU", label_i18n: {"en":"Average profit margin per SKU"}, type: "number", unit: "%", required: false, smartDefault: 20, validation: { min: 0, max: 100 }, helper: "", expertMeaning: "Average profit margin per SKU", expertMeaning_i18n: {"en":"Average profit margin per SKU"} },
  ],
  outputs: [
    { id: "complexityIndex", label: "Complexity Index", label_i18n: {"en":"Complexity Index"}, unit: "puan", format: "number" },
    { id: "hiddenCostComplexity", label: "latent Karmasklk Cost", label_i18n: {"en":"latent Karmasklk Cost"}, unit: "USD/year", format: "currency" },
    { id: "profitabilityPerSku", label: "SKU Per Karllk", label_i18n: {"en":"SKU Per Karllk"}, unit: "USD/unit", format: "currency" },
    { id: "totalSetupCost", label: "Total Hazrlk Cost", label_i18n: {"en":"Total Hazrlk Cost"}, unit: "USD/year", format: "currency" },
    { id: "wastePercent", label: "Waste Rate", label_i18n: {"en":"Waste Rate"}, unit: "%", format: "percentage" },
  ],
  thresholds: [
    { fieldId: "hiddenCostComplexity", warning: 50000, critical: 150000, direction: "higher_is_bad", warningMessage: "Latent cost > $50K — product grouping and standardization are recommended.", warningMessage_i18n: {"en":"Latent cost > $50K — product grouping and standardization are recommended."}, criticalMessage: "Latent cost > $150K — urgent portfolio simplification is required.", criticalMessage_i18n: {"en":"Latent cost > $150K — urgent portfolio simplification is required."} },
    { fieldId: "complexityIndex", warning: 50, critical: 80, direction: "higher_is_bad", warningMessage: "Complexity index > 50 — production cells should be reviewed.", warningMessage_i18n: {"en":"Complexity index > 50 — production cells should be reviewed."}, criticalMessage: "Complexity index > 80 — product architecture must be redesigned.", criticalMessage_i18n: {"en":"Complexity index > 80 — product architecture must be redesigned."} },
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
  assumptions: { hiddenLossMultiplier: 1.15, volatilityPercent: 10, targetMarginPercent: 12, assumptionNotes: ["Karmasiklik endeksi SKU, parca ve hazirlik suresine gore hesaplanir.", "Gizli maliyet = endeks × iscilik × parti sikligi.", "SKU kârliligi ortalama marjdan gizli maliyet dusulerek bulunur."],assumptionNotes_i18n:[{"en":"Complexity index is calculated based on SKU, part count, and setup time."},{"en":"Hidden cost = index × labor × batch frequency."},{"en":"SKU profitability is found by subtracting hidden cost from average margin."}] },
};
