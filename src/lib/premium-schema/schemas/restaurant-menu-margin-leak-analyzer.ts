/**
 * Tool #39 — Restoran Menü Marj Kaçağı
 */
import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";
export const RESTAURANT_MENU_MARGIN_LEAK_SCHEMA: PremiumCalculatorSchema = {
  id: "restaurant-menu-margin-leak-analyzer", legacyPaidSlug: "restaurant-menu-margin-leak-analyzer",
  name: "Restoran Menü Marj Kaçağı Analizi", name_i18n: {"en":"Restaurant Menu Margin Leak Analysis","tr":"Restoran Menü Marj Kaçağı Analizi"}, sectorSlug: "food", category: "cost",
  painStatement: "Teorik marj ile gerçek marj arasındaki fark izlenmezse fire, hırsızlık ve yanlış porsiyonlama kârı sessizce yok eder.", painStatement_i18n: {"en":"Teorik marj ile gerçek marj arasındaki fark izlenmezse fire, hırsızlık ve yanlış porsiyonlama kârı sessizce yok eder.","tr":"Teorik marj ile gerçek marj arasındaki fark izlenmezse fire, hırsızlık ve yanlış porsiyonlama kârı sessizce yok eder."},
  inputs: [
    { id: "theoreticalFoodCost", label: "Teorik Yiyecek Maliyeti", label_i18n: {"en":"Teorik Yiyecek Maliyeti","tr":"Teorik Yiyecek Maliyeti"}, type: "number", unit: "USD", required: true, smartDefault: 15000, validation: { min: 0 }, helper: "", expertMeaning: "Theoretical (ideal) food cost", expertMeaning_i18n: {"en":"Theoretical (ideal) food cost","tr":"Theoretical (ideal) food cost"} },
    { id: "actualFoodCost", label: "Gerçek Yiyecek Maliyeti", label_i18n: {"en":"Gerçek Yiyecek Maliyeti","tr":"Gerçek Yiyecek Maliyeti"}, type: "number", unit: "USD", required: true, smartDefault: 18500, validation: { min: 0 }, helper: "", expertMeaning: "Actual food cost from P&L", expertMeaning_i18n: {"en":"Actual food cost from P&L","tr":"Actual food cost from P&L"} },
    { id: "revenue", label: "Gelir", label_i18n: {"en":"Gelir","tr":"Gelir"}, type: "number", unit: "USD", required: true, smartDefault: 55000, validation: { min: 1 }, helper: "", expertMeaning: "Total food revenue", expertMeaning_i18n: {"en":"Total food revenue","tr":"Total food revenue"} },
    { id: "wasteAmount", label: "Tahmini Fire", label_i18n: {"en":"Tahmini Fire","tr":"Tahmini Fire"}, type: "number", unit: "USD", required: false, smartDefault: 1200, validation: { min: 0 }, helper: "", expertMeaning: "Estimated waste cost", expertMeaning_i18n: {"en":"Estimated waste cost","tr":"Estimated waste cost"} },
    { id: "theftLoss", label: "Hırsızlık / Zaiyat", label_i18n: {"en":"Hırsızlık / Zaiyat","tr":"Hırsızlık / Zaiyat"}, type: "number", unit: "USD", required: false, smartDefault: 800, validation: { min: 0 }, helper: "", expertMeaning: "Estimated theft or unauthorized use", expertMeaning_i18n: {"en":"Estimated theft or unauthorized use","tr":"Estimated theft or unauthorized use"} },
  ],
  outputs: [
    { id: "restaurantTheoreticalFood", label: "Teorik Yiyecek Maliyeti", label_i18n: {"en":"Teorik Yiyecek Maliyeti","tr":"Teorik Yiyecek Maliyeti"}, unit: "USD", format: "currency" },
    { id: "restaurantActualFood", label: "Gerçek Yiyecek Maliyeti", label_i18n: {"en":"Gerçek Yiyecek Maliyeti","tr":"Gerçek Yiyecek Maliyeti"}, unit: "USD", format: "currency" },
    { id: "restaurantVariance", label: "Mutfak Sapması", label_i18n: {"en":"Mutfak Sapması","tr":"Mutfak Sapması"}, unit: "USD", format: "currency" },
    { id: "restaurantVariancePct", label: "Sapma Oranı", label_i18n: {"en":"Sapma Oranı","tr":"Sapma Oranı"}, unit: "%", format: "number" },
    { id: "restaurantWasteCost", label: "Fire Maliyeti", label_i18n: {"en":"Fire Maliyeti","tr":"Fire Maliyeti"}, unit: "USD", format: "currency" },
    { id: "restaurantTheftLoss", label: "Zaiyat Maliyeti", label_i18n: {"en":"Zaiyat Maliyeti","tr":"Zaiyat Maliyeti"}, unit: "USD", format: "currency" },
    { id: "restaurantIdealMargin", label: "İdeal Marj", label_i18n: {"en":"İdeal Marj","tr":"İdeal Marj"}, unit: "%", format: "number" },
    { id: "restaurantActualMargin", label: "Gerçek Marj", label_i18n: {"en":"Actual Margin","tr":"Gerçek Marj"}, unit: "%", format: "number" },
  ],
  thresholds: [{ fieldId: "restaurantVariancePct", warning: 5, critical: 10, direction: "higher_is_bad", warningMessage: "Sapma > %5 — porsiyon ve fire kontrolü önerilir.", warningMessage_i18n: {"en":"Sapma > %5 — porsiyon ve fire kontrolü önerilir.","tr":"Sapma > %5 — porsiyon ve fire kontrolü önerilir."}, criticalMessage: "Sapma > %10 — mutfak operasyonu acilen denetlenmeli.", criticalMessage_i18n: {"en":"Sapma > %10 — mutfak operasyonu acilen denetlenmeli.","tr":"Sapma > %10 — mutfak operasyonu acilen denetlenmeli."} }],
  formulaPipeline: [
    { formulaId: "cost.restaurant_theoretical_food", inputMap: { theoreticalFoodCost: "theoreticalFoodCost" }, outputId: "restaurantTheoreticalFood" },
    { formulaId: "cost.restaurant_actual_food", inputMap: { actualFoodCost: "actualFoodCost" }, outputId: "restaurantActualFood" },
    { formulaId: "cost.restaurant_variance", inputMap: { restaurantActualFood: "restaurantActualFood", restaurantTheoreticalFood: "restaurantTheoreticalFood" }, outputId: "restaurantVariance" },
    { formulaId: "measurement.restaurant_variance_pct", inputMap: { restaurantVariance: "restaurantVariance", restaurantTheoreticalFood: "restaurantTheoreticalFood" }, outputId: "restaurantVariancePct" },
    { formulaId: "cost.restaurant_waste_cost", inputMap: { wasteAmount: "wasteAmount" }, outputId: "restaurantWasteCost" },
    { formulaId: "cost.restaurant_theft_loss", inputMap: { theftLoss: "theftLoss" }, outputId: "restaurantTheftLoss" },
    { formulaId: "measurement.restaurant_ideal_margin", inputMap: { revenue: "revenue", restaurantTheoreticalFood: "restaurantTheoreticalFood" }, outputId: "restaurantIdealMargin" },
    { formulaId: "measurement.restaurant_actual_margin", inputMap: { revenue: "revenue", restaurantActualFood: "restaurantActualFood" }, outputId: "restaurantActualMargin" },
  ],
  reportTemplate: { title: "Restaurant Menu Margin Leak Report", title_i18n: {"en":"Restaurant Menu Margin Leak Report","tr":"Restaurant Menu Margin Leak Report"}, sections: ["executive_summary", "thresholds", "action_plan", "assumptions"], exportFormats: ["pdf", "excel"] },
  assumptions: { hiddenLossMultiplier: 1.0, volatilityPercent: 10, targetMarginPercent: 20, assumptionNotes: ["Sapma = gerçek - teorik.", "Sapma % = sapma / teorik × 100.", "İdeal marj = (gelir - teorik) / gelir × 100.", "Gerçek marj = (gelir - gerçek) / gelir × 100."],assumptionNotes_i18n:[{"en":"Sapma = gerçek - teorik.","tr":"Sapma = gerçek - teorik."},{"en":"Sapma % = sapma / teorik × 100.","tr":"Sapma % = sapma / teorik × 100."},{"en":"İdeal marj = (gelir - teorik) / gelir × 100.","tr":"İdeal marj = (gelir - teorik) / gelir × 100."},{"en":"Gerçek marj = (gelir - gerçek) / gelir × 100.","tr":"Gerçek marj = (gelir - gerçek) / gelir × 100."}] },
};
