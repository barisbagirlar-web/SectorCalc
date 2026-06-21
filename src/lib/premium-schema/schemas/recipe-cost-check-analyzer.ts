/**
 * Tool #38 — Reçete Maliyet Kontrol
 */
import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";
export const RECIPE_COST_CHECK_ANALYZER_SCHEMA: PremiumCalculatorSchema = {
  id: "recipe-cost-check-analyzer", legacyPaidSlug: "recipe-cost-check-analyzer",
  name: "Reçete Maliyet Kontrol", name_i18n: {"en":"Reçete Maliyet Kontrol","tr":"Reçete Maliyet Kontrol"}, sectorSlug: "food", category: "cost",
  painStatement: "Reçete maliyeti teorik ile gerçek arasındaki fark izlenmezse fire, buharlaşma ve hammadde kaybı fark edilmeden kârı eritir.", painStatement_i18n: {"en":"Reçete maliyeti teorik ile gerçek arasındaki fark izlenmezse fire, buharlaşma ve hammadde kaybı fark edilmeden kârı eritir.","tr":"Reçete maliyeti teorik ile gerçek arasındaki fark izlenmezse fire, buharlaşma ve hammadde kaybı fark edilmeden kârı eritir."},
  inputs: [
    { id: "recipeQty", label: "Reçete Miktarı", label_i18n: {"en":"Reçete Miktarı","tr":"Reçete Miktarı"}, type: "number", unit: "kg", required: true, smartDefault: 100, validation: { min: 0.01 }, helper: "", expertMeaning: "Recipe batch quantity in kg", expertMeaning_i18n: {"en":"Recipe batch quantity in kg","tr":"Recipe batch quantity in kg"} },
    { id: "ingredientCostPerKg", label: "İçindekiler Birim Maliyeti", label_i18n: {"en":"İçindekiler Birim Maliyeti","tr":"İçindekiler Birim Maliyeti"}, type: "number", unit: "USD/kg", required: true, smartDefault: 8.5, validation: { min: 0.01 }, helper: "", expertMeaning: "Ingredient cost per kg", expertMeaning_i18n: {"en":"Ingredient cost per kg","tr":"Ingredient cost per kg"} },
    { id: "actualUsage", label: "Gerçek Kullanım", label_i18n: {"en":"Gerçek Kullanım","tr":"Gerçek Kullanım"}, type: "number", unit: "kg", required: true, smartDefault: 110, validation: { min: 0 }, helper: "", expertMeaning: "Actual material used", expertMeaning_i18n: {"en":"Actual material used","tr":"Actual material used"} },
    { id: "yieldLossPct", label: "Fire Oranı", label_i18n: {"en":"Fire Oranı","tr":"Fire Oranı"}, type: "number", unit: "%", required: true, smartDefault: 8, validation: { min: 0, max: 50 }, helper: "", expertMeaning: "Yield loss percentage (trimming, spillage)", expertMeaning_i18n: {"en":"Yield loss percentage (trimming, spillage)","tr":"Yield loss percentage (trimming, spillage)"} },
    { id: "evaporationPct", label: "Buharlaşma Oranı", label_i18n: {"en":"Buharlaşma Oranı","tr":"Buharlaşma Oranı"}, type: "number", unit: "%", required: false, smartDefault: 5, validation: { min: 0, max: 50 }, helper: "", expertMeaning: "Evaporation loss percentage", expertMeaning_i18n: {"en":"Evaporation loss percentage","tr":"Evaporation loss percentage"} },
  ],
  outputs: [
    { id: "recipeTheoretical", label: "Teorik Reçete Maliyeti", label_i18n: {"en":"Teorik Reçete Maliyeti","tr":"Teorik Reçete Maliyeti"}, unit: "USD", format: "currency" },
    { id: "recipeActual", label: "Gerçek Reçete Maliyeti", label_i18n: {"en":"Gerçek Reçete Maliyeti","tr":"Gerçek Reçete Maliyeti"}, unit: "USD", format: "currency" },
    { id: "recipeVariance", label: "Reçete Sapması", label_i18n: {"en":"Reçete Sapması","tr":"Reçete Sapması"}, unit: "USD", format: "currency" },
    { id: "recipeYieldLoss", label: "Fire Kaybı", label_i18n: {"en":"Fire Kaybı","tr":"Fire Kaybı"}, unit: "USD", format: "currency" },
    { id: "recipeEvaporation", label: "Buharlaşma Kaybı", label_i18n: {"en":"Buharlaşma Kaybı","tr":"Buharlaşma Kaybı"}, unit: "%", format: "number" },
    { id: "recipeEfficiency", label: "Reçete Verimliliği", label_i18n: {"en":"Reçete Verimliliği","tr":"Reçete Verimliliği"}, unit: "%", format: "number" },
    { id: "recipeCostPerKg", label: "Birim Maliyet", label_i18n: {"en":"Birim Maliyet","tr":"Birim Maliyet"}, unit: "USD/kg", format: "currency" },
  ],
  thresholds: [{ fieldId: "recipeVariance", warning: 50, critical: 100, direction: "higher_is_bad", warningMessage: "Sapma > $50 — fire ve kullanım takibi başlatılmalı.", warningMessage_i18n: {"en":"Sapma > $50 — fire ve kullanım takibi başlatılmalı.","tr":"Sapma > $50 — fire ve kullanım takibi başlatılmalı."}, criticalMessage: "Sapma > $100 — reçete standartları acilen gözden geçirilmeli.", criticalMessage_i18n: {"en":"Sapma > $100 — reçete standartları acilen gözden geçirilmeli.","tr":"Sapma > $100 — reçete standartları acilen gözden geçirilmeli."} }],
  formulaPipeline: [
    { formulaId: "cost.recipe_theoretical", inputMap: { recipeQty: "recipeQty", ingredientCostPerKg: "ingredientCostPerKg" }, outputId: "recipeTheoretical" },
    { formulaId: "cost.recipe_actual", inputMap: { actualUsage: "actualUsage", ingredientCostPerKg: "ingredientCostPerKg" }, outputId: "recipeActual" },
    { formulaId: "cost.recipe_variance", inputMap: { recipeActual: "recipeActual", recipeTheoretical: "recipeTheoretical" }, outputId: "recipeVariance" },
    { formulaId: "cost.recipe_yield_loss", inputMap: { recipeQty: "recipeQty", ingredientCostPerKg: "ingredientCostPerKg", yieldLossPct: "yieldLossPct" }, outputId: "recipeYieldLoss" },
    { formulaId: "measurement.recipe_evaporation", inputMap: { evaporationPct: "evaporationPct" }, outputId: "recipeEvaporation" },
    { formulaId: "measurement.recipe_efficiency", inputMap: { recipeTheoretical: "recipeTheoretical", recipeActual: "recipeActual" }, outputId: "recipeEfficiency" },
    { formulaId: "cost.recipe_cost_per_kg", inputMap: { recipeActual: "recipeActual", actualUsage: "actualUsage" }, outputId: "recipeCostPerKg" },
  ],
  reportTemplate: { title: "Recipe Cost Check Report", title_i18n: {"en":"Recipe Cost Check Report","tr":"Recipe Cost Check Report"}, sections: ["executive_summary", "thresholds", "action_plan", "assumptions"], exportFormats: ["pdf", "excel"] },
  assumptions: { hiddenLossMultiplier: 1.0, volatilityPercent: 10, targetMarginPercent: 20, assumptionNotes: ["Teorik = miktar × birim fiyat.", "Gerçek = kullanım × birim fiyat.", "Fire kaybı = teorik × (fire%/100).", "Verimlilik = teorik / gerçek × 100."],assumptionNotes_i18n:[{"en":"Teorik = miktar × birim fiyat.","tr":"Teorik = miktar × birim fiyat."},{"en":"Gerçek = kullanım × birim fiyat.","tr":"Gerçek = kullanım × birim fiyat."},{"en":"Fire kaybı = teorik × (fire%/100).","tr":"Fire kaybı = teorik × (fire%/100)."},{"en":"Verimlilik = teorik / gerçek × 100.","tr":"Verimlilik = teorik / gerçek × 100."}] },
};
