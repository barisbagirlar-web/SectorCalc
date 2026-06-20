/**
 * Tool #38 — Yenileme Bütçe
 */
import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";
export const RENOVATION_BUDGET_SCHEMA: PremiumCalculatorSchema = {
  id: "renovation-budget-optimizer-analyzer", legacyPaidSlug: "renovation-budget-optimizer-analyzer",
  name: "Yenileme Bütçe Optimizasyonu", sectorSlug: "construction", category: "cost",
  painStatement: "Yenileme projelerinde bütçe planlaması yapılmazsa beklenmeyen maliyet aşımları ve düşük yatırım getirisi oluşur. Her kalemin optimize edilmesi gerekir.",
  inputs: [
    { id: "propertyValue", label: "Mülk Değeri", type: "number", unit: "USD", required: true, smartDefault: 500000, validation: { min: 1000 }, helper: "", expertMeaning: "Current property value" },
    { id: "renovationScope", label: "Yenileme Kapsamı", type: "number", unit: "m²", required: true, smartDefault: 150, validation: { min: 1 }, helper: "", expertMeaning: "Renovation area in sqm" },
    { id: "baseCostPerSqm", label: "Birim Yenileme Maliyeti", type: "number", unit: "USD/m²", required: true, smartDefault: 500, validation: { min: 10 }, helper: "", expertMeaning: "Base renovation cost per sqm" },
    { id: "expectedValueAfter", label: "Yenileme Sonrası Değer", type: "number", unit: "USD", required: true, smartDefault: 650000, validation: { min: 1 }, helper: "", expertMeaning: "Expected value after renovation" },
    { id: "contingencyPercent", label: "Beklenmeyen Gider Oranı", type: "number", unit: "%", required: false, smartDefault: 15, validation: { min: 0, max: 50 }, helper: "", expertMeaning: "Contingency budget percentage" },
    { id: "laborCostPercent", label: "İşçilik Maliyeti Oranı", type: "number", unit: "%", required: false, smartDefault: 40, validation: { min: 0, max: 100 }, helper: "", expertMeaning: "Labor cost percentage" },
    { id: "materialCostPercent", label: "Malzeme Maliyeti Oranı", type: "number", unit: "%", required: false, smartDefault: 35, validation: { min: 0, max: 100 }, helper: "", expertMeaning: "Material cost percentage" },
  ],
  outputs: [
    { id: "renovationBaseCost", label: "Temel Yenileme Maliyeti", unit: "USD", format: "currency" },
    { id: "renovationTotalBudget", label: "Toplam Yenileme Bütçesi", unit: "USD", format: "currency", isBigNumber: true },
    { id: "renovationRoi", label: "Yenileme Yatırım Getirisi", unit: "%", format: "percentage" },
    { id: "budgetBreakdown", label: "Bütçe Dağılımı (İşçilik + Malzeme)", unit: "USD", format: "currency" },
  ],
  thresholds: [
    { fieldId: "renovationRoi", warning: 15, critical: 5, direction: "lower_is_bad", warningMessage: "YG < %15 — yenileme kapsamı daraltılmalı.", criticalMessage: "YG < %5 — yenileme projesi yeniden değerlendirilmeli." },
    { fieldId: "renovationTotalBudget", warning: 100000, critical: 250000, direction: "higher_is_bad", warningMessage: "Bütçe > $100K — alternatif teklifler alınmalı.", criticalMessage: "Bütçe > $250K — fizibilite çalışması gerekli." },
  ],
  formulaPipeline: [
    { formulaId: "cost.renovation_base_cost", inputMap: { renovationScope: "renovationScope", baseCostPerSqm: "baseCostPerSqm" }, outputId: "renovationBaseCost" },
    { formulaId: "cost.renovation_total_budget", inputMap: { renovationBaseCost: "renovationBaseCost", contingencyPercent: "contingencyPercent" }, outputId: "renovationTotalBudget" },
    { formulaId: "cost.renovation_roi", inputMap: { expectedValueAfter: "expectedValueAfter", propertyValue: "propertyValue", renovationTotalBudget: "renovationTotalBudget" }, outputId: "renovationRoi" },
    { formulaId: "cost.renovation_budget_breakdown", inputMap: { renovationTotalBudget: "renovationTotalBudget", laborCostPercent: "laborCostPercent", materialCostPercent: "materialCostPercent" }, outputId: "budgetBreakdown" },
  ],
  reportTemplate: { title: "Yenileme Bütçe Optimizasyon Raporu", sections: ["executive_summary", "loss_breakdown", "thresholds", "action_plan", "assumptions"], exportFormats: ["pdf", "excel"] },
  assumptions: { hiddenLossMultiplier: 1.2, volatilityPercent: 15, targetMarginPercent: 20, assumptionNotes: ["Temel maliyet = alan × birim maliyet.", "Toplam bütçe = temel maliyet × (1 + beklenmeyen gider oranı).", "YG = (yeni değer - mevcut değer - bütçe) / bütçe × 100."] },
};
