/**
 * Tool #38 — Yenileme Bütçe
 */
import type { PremiumCalculatorSchema } from "@/lib/features/premium-schema/premium-calculator-schema";
export const RENOVATION_BUDGET_SCHEMA: PremiumCalculatorSchema = {
  id: "renovation-budget-optimizer-analyzer", legacyPaidSlug: "renovation-budget-optimizer-analyzer",
  name: "Yenileme Bütçe Optimizasyonu", name_i18n: {"en":"Renovation Budget Optimization","tr":"Yenileme Bütçe Optimizasyonu"}, sectorSlug: "construction", category: "cost",
  painStatement: "Yenileme projelerinde bütçe planlaması yapılmazsa beklenmeyen maliyet aşımları ve düşük yatırım getirisi oluşur. Her kalemin optimize edilmesi gerekir.", painStatement_i18n: {"en":"Without budget planning in renovation projects, unexpected cost overruns and low investment returns occur. Every line item must be optimized.","tr":"Yenileme projelerinde bütçe planlaması yapılmazsa beklenmeyen maliyet aşımları ve düşük yatırım getirisi oluşur. Her kalemin optimize edilmesi gerekir."},
  inputs: [
    { id: "propertyValue", label: "Mülk Değeri", label_i18n: {"en":"Property Value","tr":"Mülk Değeri"}, type: "number", unit: "USD", required: true, smartDefault: 500000, validation: { min: 1000 }, helper: "", expertMeaning: "Current property value", expertMeaning_i18n: {"en":"Current property value","tr":"Mevcut mülk değeri"} },
    { id: "renovationScope", label: "Yenileme Kapsamı", label_i18n: {"en":"Renovation Scope","tr":"Yenileme Kapsamı"}, type: "number", unit: "m²", required: true, smartDefault: 150, validation: { min: 1 }, helper: "", expertMeaning: "Renovation area in sqm", expertMeaning_i18n: {"en":"Renovation area in sqm","tr":"Metrekare cinsinden yenileme alanı"} },
    { id: "baseCostPerSqm", label: "Birim Yenileme Maliyeti", label_i18n: {"en":"Unit Renovation Cost","tr":"Birim Yenileme Maliyeti"}, type: "number", unit: "USD/m²", required: true, smartDefault: 500, validation: { min: 10 }, helper: "", expertMeaning: "Base renovation cost per sqm", expertMeaning_i18n: {"en":"Base renovation cost per sqm","tr":"Metrekare başına temel yenileme maliyeti"} },
    { id: "expectedValueAfter", label: "Yenileme Sonrası Değer", label_i18n: {"en":"Post-Renovation Value","tr":"Yenileme Sonrası Değer"}, type: "number", unit: "USD", required: true, smartDefault: 650000, validation: { min: 1 }, helper: "", expertMeaning: "Expected value after renovation", expertMeaning_i18n: {"en":"Expected value after renovation","tr":"Yenileme sonrası beklenen değer"} },
    { id: "contingencyPercent", label: "Beklenmeyen Gider Oranı", label_i18n: {"en":"Contingency Rate","tr":"Beklenmeyen Gider Oranı"}, type: "number", unit: "%", required: false, smartDefault: 15, validation: { min: 0, max: 50 }, helper: "", expertMeaning: "Contingency budget percentage", expertMeaning_i18n: {"en":"Contingency budget percentage","tr":"Beklenmeyen gider bütçe yüzdesi"} },
    { id: "laborCostPercent", label: "İşçilik Maliyeti Oranı", label_i18n: {"en":"Labor Cost Percentage","tr":"İşçilik Maliyeti Oranı"}, type: "number", unit: "%", required: false, smartDefault: 40, validation: { min: 0, max: 100 }, helper: "", expertMeaning: "Labor cost percentage", expertMeaning_i18n: {"en":"Labor cost percentage","tr":"İşçilik maliyeti yüzdesi"} },
    { id: "materialCostPercent", label: "Malzeme Maliyeti Oranı", label_i18n: {"en":"Material Cost Percentage","tr":"Malzeme Maliyeti Oranı"}, type: "number", unit: "%", required: false, smartDefault: 35, validation: { min: 0, max: 100 }, helper: "", expertMeaning: "Material cost percentage", expertMeaning_i18n: {"en":"Material cost percentage","tr":"Malzeme maliyeti yüzdesi"} },
  ],
  outputs: [
    { id: "renovationBaseCost", label: "Temel Yenileme Maliyeti", label_i18n: {"en":"Base Renovation Cost","tr":"Temel Yenileme Maliyeti"}, unit: "USD", format: "currency" },
    { id: "renovationTotalBudget", label: "Toplam Yenileme Bütçesi", label_i18n: {"en":"Total Renovation Budget","tr":"Toplam Yenileme Bütçesi"}, unit: "USD", format: "currency", isBigNumber: true },
    { id: "renovationRoi", label: "Yenileme Yatırım Getirisi", label_i18n: {"en":"Renovation ROI","tr":"Yenileme Yatırım Getirisi"}, unit: "%", format: "percentage" },
    { id: "budgetBreakdown", label: "Bütçe Dağılımı (İşçilik + Malzeme)", label_i18n: {"en":"Budget Breakdown (Labor + Material)","tr":"Bütçe Dağılımı (İşçilik + Malzeme)"}, unit: "USD", format: "currency" },
  ],
  thresholds: [
    { fieldId: "renovationRoi", warning: 15, critical: 5, direction: "lower_is_bad", warningMessage: "YG < %15 — yenileme kapsamı daraltılmalı.", warningMessage_i18n: {"en":"ROI < 15% — renovation scope should be reduced.","tr":"YG < %15 — yenileme kapsamı daraltılmalı."}, criticalMessage: "YG < %5 — yenileme projesi yeniden değerlendirilmeli.", criticalMessage_i18n: {"en":"ROI < 5% — renovation project should be re-evaluated.","tr":"YG < %5 — yenileme projesi yeniden değerlendirilmeli."} },
    { fieldId: "renovationTotalBudget", warning: 100000, critical: 250000, direction: "higher_is_bad", warningMessage: "Bütçe > $100K — alternatif teklifler alınmalı.", warningMessage_i18n: {"en":"Budget > $100K — obtain alternative quotes.","tr":"Bütçe > $100K — alternatif teklifler alınmalı."}, criticalMessage: "Bütçe > $250K — fizibilite çalışması gerekli.", criticalMessage_i18n: {"en":"Budget > $250K — feasibility study required.","tr":"Bütçe > $250K — fizibilite çalışması gerekli."} },
  ],
  formulaPipeline: [
    { formulaId: "cost.renovation_base_cost", inputMap: {
        areaSqm: "renovationScope",
        costPerSqm: "baseCostPerSqm"
      }, outputId: "renovationBaseCost" },
    { formulaId: "cost.renovation_total_budget", inputMap: {
        renovationBaseCost: "renovationBaseCost",
        contingencyBudget: "contingencyPercent"
      ,
        designFee: "designFee"}, outputId: "renovationTotalBudget" },
    { formulaId: "cost.renovation_roi", inputMap: {
        renovationTotalBudget: "renovationTotalBudget",
        valueAfter: "expectedValueAfter",
        propertyValue: "propertyValue"
      }, outputId: "renovationRoi" },
    { formulaId: "cost.renovation_budget_breakdown", inputMap: { renovationTotalBudget: "renovationTotalBudget", laborCostPercent: "laborCostPercent", materialCostPercent: "materialCostPercent" ,
        renovationBaseCost: "renovationBaseCost",
        contingencyBudget: "contingencyBudget",
        designFee: "designFee"}, outputId: "budgetBreakdown" },
  ],
  reportTemplate: { title: "Yenileme Bütçe Optimizasyon Raporu", title_i18n: {"en":"Renovation Budget Optimization Report","tr":"Yenileme Bütçe Optimizasyon Raporu"}, sections: ["executive_summary", "loss_breakdown", "thresholds", "action_plan", "assumptions"], exportFormats: ["pdf", "excel"] },
  assumptions: { hiddenLossMultiplier: 1.2, volatilityPercent: 15, targetMarginPercent: 20, assumptionNotes: ["Temel maliyet = alan × birim maliyet.", "Toplam bütçe = temel maliyet × (1 + beklenmeyen gider oranı).", "YG = (yeni değer - mevcut değer - bütçe) / bütçe × 100."],assumptionNotes_i18n:[{"en":"Base cost = area × unit cost.","tr":"Temel maliyet = alan × birim maliyet."},{"en":"Total budget = base cost × (1 + contingency rate).","tr":"Toplam bütçe = temel maliyet × (1 + beklenmeyen gider oranı)."},{"en":"ROI = (new value - current value - budget) / budget × 100.","tr":"YG = (yeni değer - mevcut değer - bütçe) / bütçe × 100."}] },
};
