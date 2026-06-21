/**
 * Tool #38 — Yenileme Bütçe
 */
import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";
export const RENOVATION_BUDGET_SCHEMA: PremiumCalculatorSchema = {
  id: "renovation-budget-optimizer-analyzer", legacyPaidSlug: "renovation-budget-optimizer-analyzer",
  name: "Yenileme Bütçe Optimizasyonu", name_i18n: {"en":"Yenileme Bütçe Optimizasyonu","tr":"Yenileme Bütçe Optimizasyonu"}, sectorSlug: "construction", category: "cost",
  painStatement: "Yenileme projelerinde bütçe planlaması yapılmazsa beklenmeyen maliyet aşımları ve düşük yatırım getirisi oluşur. Her kalemin optimize edilmesi gerekir.", painStatement_i18n: {"en":"Yenileme projelerinde bütçe planlaması yapılmazsa beklenmeyen maliyet aşımları ve düşük yatırım getirisi oluşur. Her kalemin optimize edilmesi gerekir.","tr":"Yenileme projelerinde bütçe planlaması yapılmazsa beklenmeyen maliyet aşımları ve düşük yatırım getirisi oluşur. Her kalemin optimize edilmesi gerekir."},
  inputs: [
    { id: "propertyValue", label: "Mülk Değeri", label_i18n: {"en":"Mülk Değeri","tr":"Mülk Değeri"}, type: "number", unit: "USD", required: true, smartDefault: 500000, validation: { min: 1000 }, helper: "", expertMeaning: "Current property value", expertMeaning_i18n: {"en":"Current property value","tr":"Current property value"} },
    { id: "renovationScope", label: "Yenileme Kapsamı", label_i18n: {"en":"Yenileme Kapsamı","tr":"Yenileme Kapsamı"}, type: "number", unit: "m²", required: true, smartDefault: 150, validation: { min: 1 }, helper: "", expertMeaning: "Renovation area in sqm", expertMeaning_i18n: {"en":"Renovation area in sqm","tr":"Renovation area in sqm"} },
    { id: "baseCostPerSqm", label: "Birim Yenileme Maliyeti", label_i18n: {"en":"Birim Yenileme Maliyeti","tr":"Birim Yenileme Maliyeti"}, type: "number", unit: "USD/m²", required: true, smartDefault: 500, validation: { min: 10 }, helper: "", expertMeaning: "Base renovation cost per sqm", expertMeaning_i18n: {"en":"Base renovation cost per sqm","tr":"Base renovation cost per sqm"} },
    { id: "expectedValueAfter", label: "Yenileme Sonrası Değer", label_i18n: {"en":"Yenileme Sonrası Değer","tr":"Yenileme Sonrası Değer"}, type: "number", unit: "USD", required: true, smartDefault: 650000, validation: { min: 1 }, helper: "", expertMeaning: "Expected value after renovation", expertMeaning_i18n: {"en":"Expected value after renovation","tr":"Expected value after renovation"} },
    { id: "contingencyPercent", label: "Beklenmeyen Gider Oranı", label_i18n: {"en":"Beklenmeyen Gider Oranı","tr":"Beklenmeyen Gider Oranı"}, type: "number", unit: "%", required: false, smartDefault: 15, validation: { min: 0, max: 50 }, helper: "", expertMeaning: "Contingency budget percentage", expertMeaning_i18n: {"en":"Contingency budget percentage","tr":"Contingency budget percentage"} },
    { id: "laborCostPercent", label: "İşçilik Maliyeti Oranı", label_i18n: {"en":"İşçilik Maliyeti Oranı","tr":"İşçilik Maliyeti Oranı"}, type: "number", unit: "%", required: false, smartDefault: 40, validation: { min: 0, max: 100 }, helper: "", expertMeaning: "Labor cost percentage", expertMeaning_i18n: {"en":"Labor cost percentage","tr":"Labor cost percentage"} },
    { id: "materialCostPercent", label: "Malzeme Maliyeti Oranı", label_i18n: {"en":"Malzeme Maliyeti Oranı","tr":"Malzeme Maliyeti Oranı"}, type: "number", unit: "%", required: false, smartDefault: 35, validation: { min: 0, max: 100 }, helper: "", expertMeaning: "Material cost percentage", expertMeaning_i18n: {"en":"Material cost percentage","tr":"Material cost percentage"} },
  ],
  outputs: [
    { id: "renovationBaseCost", label: "Temel Yenileme Maliyeti", label_i18n: {"en":"Temel Yenileme Maliyeti","tr":"Temel Yenileme Maliyeti"}, unit: "USD", format: "currency" },
    { id: "renovationTotalBudget", label: "Toplam Yenileme Bütçesi", label_i18n: {"en":"Toplam Yenileme Bütçesi","tr":"Toplam Yenileme Bütçesi"}, unit: "USD", format: "currency", isBigNumber: true },
    { id: "renovationRoi", label: "Yenileme Yatırım Getirisi", label_i18n: {"en":"Yenileme Yatırım Getirisi","tr":"Yenileme Yatırım Getirisi"}, unit: "%", format: "percentage" },
    { id: "budgetBreakdown", label: "Bütçe Dağılımı (İşçilik + Malzeme)", label_i18n: {"en":"Bütçe Dağılımı (İşçilik + Malzeme)","tr":"Bütçe Dağılımı (İşçilik + Malzeme)"}, unit: "USD", format: "currency" },
  ],
  thresholds: [
    { fieldId: "renovationRoi", warning: 15, critical: 5, direction: "lower_is_bad", warningMessage: "YG < %15 — yenileme kapsamı daraltılmalı.", warningMessage_i18n: {"en":"YG < %15 — yenileme kapsamı daraltılmalı.","tr":"YG < %15 — yenileme kapsamı daraltılmalı."}, criticalMessage: "YG < %5 — yenileme projesi yeniden değerlendirilmeli.", criticalMessage_i18n: {"en":"YG < %5 — yenileme projesi yeniden değerlendirilmeli.","tr":"YG < %5 — yenileme projesi yeniden değerlendirilmeli."} },
    { fieldId: "renovationTotalBudget", warning: 100000, critical: 250000, direction: "higher_is_bad", warningMessage: "Bütçe > $100K — alternatif teklifler alınmalı.", warningMessage_i18n: {"en":"Bütçe > $100K — alternatif teklifler alınmalı.","tr":"Bütçe > $100K — alternatif teklifler alınmalı."}, criticalMessage: "Bütçe > $250K — fizibilite çalışması gerekli.", criticalMessage_i18n: {"en":"Bütçe > $250K — fizibilite çalışması gerekli.","tr":"Bütçe > $250K — fizibilite çalışması gerekli."} },
  ],
  formulaPipeline: [
    { formulaId: "cost.renovation_base_cost", inputMap: { renovationScope: "renovationScope", baseCostPerSqm: "baseCostPerSqm" }, outputId: "renovationBaseCost" },
    { formulaId: "cost.renovation_total_budget", inputMap: { renovationBaseCost: "renovationBaseCost", contingencyPercent: "contingencyPercent" }, outputId: "renovationTotalBudget" },
    { formulaId: "cost.renovation_roi", inputMap: { expectedValueAfter: "expectedValueAfter", propertyValue: "propertyValue", renovationTotalBudget: "renovationTotalBudget" }, outputId: "renovationRoi" },
    { formulaId: "cost.renovation_budget_breakdown", inputMap: { renovationTotalBudget: "renovationTotalBudget", laborCostPercent: "laborCostPercent", materialCostPercent: "materialCostPercent" }, outputId: "budgetBreakdown" },
  ],
  reportTemplate: { title: "Yenileme Bütçe Optimizasyon Raporu", title_i18n: {"en":"Yenileme Bütçe Optimizasyon Raporu","tr":"Yenileme Bütçe Optimizasyon Raporu"}, sections: ["executive_summary", "loss_breakdown", "thresholds", "action_plan", "assumptions"], exportFormats: ["pdf", "excel"] },
  assumptions: { hiddenLossMultiplier: 1.2, volatilityPercent: 15, targetMarginPercent: 20, assumptionNotes: ["Temel maliyet = alan × birim maliyet.", "Toplam bütçe = temel maliyet × (1 + beklenmeyen gider oranı).", "YG = (yeni değer - mevcut değer - bütçe) / bütçe × 100."],assumptionNotes_i18n:[{"en":"Temel maliyet = alan × birim maliyet.","tr":"Temel maliyet = alan × birim maliyet."},{"en":"Toplam bütçe = temel maliyet × (1 + beklenmeyen gider oranı).","tr":"Toplam bütçe = temel maliyet × (1 + beklenmeyen gider oranı)."},{"en":"YG = (yeni değer - mevcut değer - bütçe) / bütçe × 100.","tr":"YG = (yeni değer - mevcut değer - bütçe) / bütçe × 100."}] },
};
