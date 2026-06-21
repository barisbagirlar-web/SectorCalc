/**
 * Tool #35 — Porsiyon Maliyet Analizi
 */
import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";
export const PORTION_COST_ANALYZER_SCHEMA: PremiumCalculatorSchema = {
  id: "portion-cost-analyzer", legacyPaidSlug: "portion-cost-analyzer",
  name: "Porsiyon Maliyet Analizi", name_i18n: {"en":"Porsiyon Maliyet Analizi","tr":"Porsiyon Maliyet Analizi"}, sectorSlug: "food", category: "cost",
  painStatement: "Porsiyon maliyeti doğru hesaplanmazsa menü fiyatlaması hatalı olur ve ya kar marjı erir ya da müşteri kaybedilir.", painStatement_i18n: {"en":"Porsiyon maliyeti doğru hesaplanmazsa menü fiyatlaması hatalı olur ve ya kar marjı erir ya da müşteri kaybedilir.","tr":"Porsiyon maliyeti doğru hesaplanmazsa menü fiyatlaması hatalı olur ve ya kar marjı erir ya da müşteri kaybedilir."},
  inputs: [
    { id: "ingredientCost", label: "İçindekiler Maliyeti", label_i18n: {"en":"İçindekiler Maliyeti","tr":"İçindekiler Maliyeti"}, type: "number", unit: "USD/porsiyon", required: true, smartDefault: 4.5, validation: { min: 0.01 }, helper: "", expertMeaning: "Raw ingredient cost per portion", expertMeaning_i18n: {"en":"Raw ingredient cost per portion","tr":"Raw ingredient cost per portion"} },
    { id: "yieldPercent", label: "Verim Oranı", label_i18n: {"en":"Verim Oranı","tr":"Verim Oranı"}, type: "number", unit: "%", required: true, smartDefault: 85, validation: { min: 1, max: 100 }, helper: "", expertMeaning: "Yield percentage after trimming", expertMeaning_i18n: {"en":"Yield percentage after trimming","tr":"Yield percentage after trimming"} },
    { id: "laborCostPerPortion", label: "İşçilik Maliyeti", label_i18n: {"en":"İşçilik Maliyeti","tr":"İşçilik Maliyeti"}, type: "number", unit: "USD/porsiyon", required: true, smartDefault: 2.0, validation: { min: 0 }, helper: "", expertMeaning: "Labor cost per portion", expertMeaning_i18n: {"en":"Labor cost per portion","tr":"Labor cost per portion"} },
    { id: "overheadPerPortion", label: "Genel Gider", label_i18n: {"en":"Genel Gider","tr":"Genel Gider"}, type: "number", unit: "USD/porsiyon", required: false, smartDefault: 1.5, validation: { min: 0 }, helper: "", expertMeaning: "Overhead cost allocated per portion", expertMeaning_i18n: {"en":"Overhead cost allocated per portion","tr":"Overhead cost allocated per portion"} },
    { id: "targetFoodCostPct", label: "Hedef Yiyecek Maliyeti Oranı", label_i18n: {"en":"Hedef Yiyecek Maliyeti Oranı","tr":"Hedef Yiyecek Maliyeti Oranı"}, type: "number", unit: "%", required: false, smartDefault: 30, validation: { min: 5, max: 80 }, helper: "", expertMeaning: "Target food cost percentage", expertMeaning_i18n: {"en":"Target food cost percentage","tr":"Target food cost percentage"} },
  ],
  outputs: [
    { id: "ingredientCostPortion", label: "İçindekiler Birim Maliyeti", label_i18n: {"en":"İçindekiler Birim Maliyeti","tr":"İçindekiler Birim Maliyeti"}, unit: "USD", format: "currency" },
    { id: "yieldAdjustedCost", label: "Verim Ayarlı Maliyet", label_i18n: {"en":"Verim Ayarlı Maliyet","tr":"Verim Ayarlı Maliyet"}, unit: "USD", format: "currency" },
    { id: "portionLaborCost", label: "Porsiyon İşçilik Maliyeti", label_i18n: {"en":"Porsiyon İşçilik Maliyeti","tr":"Porsiyon İşçilik Maliyeti"}, unit: "USD", format: "currency" },
    { id: "portionOverhead", label: "Porsiyon Genel Gider", label_i18n: {"en":"Porsiyon Genel Gider","tr":"Porsiyon Genel Gider"}, unit: "USD", format: "currency" },
    { id: "totalPortionCost", label: "Toplam Porsiyon Maliyeti", label_i18n: {"en":"Toplam Porsiyon Maliyeti","tr":"Toplam Porsiyon Maliyeti"}, unit: "USD", format: "currency" },
    { id: "foodCostPct", label: "Yiyecek Maliyeti Oranı", label_i18n: {"en":"Yiyecek Maliyeti Oranı","tr":"Yiyecek Maliyeti Oranı"}, unit: "%", format: "number" },
    { id: "targetMenuPrice", label: "Hedef Menü Fiyatı", label_i18n: {"en":"Hedef Menü Fiyatı","tr":"Hedef Menü Fiyatı"}, unit: "USD", format: "currency" },
  ],
  thresholds: [{ fieldId: "foodCostPct", warning: 35, critical: 40, direction: "higher_is_bad", warningMessage: "Yiyecek maliyeti > %35 — fiyatlama veya reçete gözden geçirilmeli.", warningMessage_i18n: {"en":"Yiyecek maliyeti > %35 — fiyatlama veya reçete gözden geçirilmeli.","tr":"Yiyecek maliyeti > %35 — fiyatlama veya reçete gözden geçirilmeli."}, criticalMessage: "Yiyecek maliyeti > %40 — menü kârlılığı risk altında.", criticalMessage_i18n: {"en":"Yiyecek maliyeti > %40 — menü kârlılığı risk altında.","tr":"Yiyecek maliyeti > %40 — menü kârlılığı risk altında."} }],
  formulaPipeline: [
    { formulaId: "cost.ingredient_cost_portion", inputMap: { ingredientCost: "ingredientCost" }, outputId: "ingredientCostPortion" },
    { formulaId: "cost.yield_adjusted_cost", inputMap: { ingredientCostPortion: "ingredientCostPortion", yieldPercent: "yieldPercent" }, outputId: "yieldAdjustedCost" },
    { formulaId: "cost.portion_labor_cost", inputMap: { laborCostPerPortion: "laborCostPerPortion" }, outputId: "portionLaborCost" },
    { formulaId: "cost.portion_overhead", inputMap: { overheadPerPortion: "overheadPerPortion" }, outputId: "portionOverhead" },
    { formulaId: "cost.total_portion_cost", inputMap: { yieldAdjustedCost: "yieldAdjustedCost", portionLaborCost: "portionLaborCost", portionOverhead: "portionOverhead" }, outputId: "totalPortionCost" },
    { formulaId: "measurement.food_cost_pct", inputMap: { totalPortionCost: "totalPortionCost" }, outputId: "foodCostPct" },
    { formulaId: "measurement.target_menu_price", inputMap: { totalPortionCost: "totalPortionCost", targetFoodCostPct: "targetFoodCostPct" }, outputId: "targetMenuPrice" },
  ],
  reportTemplate: { title: "Portion Cost Analysis Report", title_i18n: {"en":"Portion Cost Analysis Report","tr":"Portion Cost Analysis Report"}, sections: ["executive_summary", "thresholds", "action_plan", "assumptions"], exportFormats: ["pdf", "excel"] },
  assumptions: { hiddenLossMultiplier: 1.0, volatilityPercent: 10, targetMarginPercent: 20, assumptionNotes: ["Verim ayarlı maliyet = içindekiler / (verim/100).", "Toplam maliyet = malzeme + işçilik + genel gider.", "Yiyecek % = toplam maliyet / satış fiyatı.", "Hedef fiyat = toplam maliyet / (hedef %/100)."],assumptionNotes_i18n:[{"en":"Verim ayarlı maliyet = içindekiler / (verim/100).","tr":"Verim ayarlı maliyet = içindekiler / (verim/100)."},{"en":"Toplam maliyet = malzeme + işçilik + genel gider.","tr":"Toplam maliyet = malzeme + işçilik + genel gider."},{"en":"Yiyecek % = toplam maliyet / satış fiyatı.","tr":"Yiyecek % = toplam maliyet / satış fiyatı."},{"en":"Hedef fiyat = toplam maliyet / (hedef %/100).","tr":"Hedef fiyat = toplam maliyet / (hedef %/100)."}] },
};
