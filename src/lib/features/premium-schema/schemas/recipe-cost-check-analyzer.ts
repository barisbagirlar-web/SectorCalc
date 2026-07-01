/**
 * Tool #38 — Reçete Maliyet Kontrol
 */
import type { PremiumCalculatorSchema } from "@/lib/features/premium-schema/premium-calculator-schema";
export const RECIPE_COST_CHECK_ANALYZER_SCHEMA: PremiumCalculatorSchema = {
  id: "recipe-cost-check-analyzer", legacyPaidSlug: "recipe-cost-check-analyzer",
  name: "Reçete Maliyet Kontrol", name_i18n: {"en":"Recipe Cost Check"}, sectorSlug: "food", category: "cost",
  painStatement: "Reçete maliyeti teorik ile gerçek arasındaki fark izlenmezse fire, buharlaşma ve hammadde kaybı fark edilmeden kârı eritir.", painStatement_i18n: {"en":"If the gap between theoretical and actual recipe cost is not tracked, waste, evaporation, and material loss silently erode profit."},
  inputs: [
    { id: "recipeQty", label: "Reçete Miktarı", label_i18n: {"en":"Recipe Quantity"}, type: "number", unit: "kg", required: true, smartDefault: 100, validation: { min: 0.01 }, helper: "", expertMeaning: "Recipe batch quantity in kg", expertMeaning_i18n: {"en":"Recipe batch quantity in kg"} },
    { id: "ingredientCostPerKg", label: "İçindekiler Birim Maliyeti", label_i18n: {"en":"Ingredient Unit Cost"}, type: "number", unit: "USD/kg", required: true, smartDefault: 8.5, validation: { min: 0.01 }, helper: "", expertMeaning: "Ingredient cost per kg", expertMeaning_i18n: {"en":"Ingredient cost per kg"} },
    { id: "actualUsage", label: "Gerçek Kullanım", label_i18n: {"en":"Actual Usage"}, type: "number", unit: "kg", required: true, smartDefault: 110, validation: { min: 0 }, helper: "", expertMeaning: "Actual material used", expertMeaning_i18n: {"en":"Actual material used"} },
    { id: "yieldLossPct", label: "Fire Oranı", label_i18n: {"en":"Waste Rate"}, type: "number", unit: "%", required: true, smartDefault: 8, validation: { min: 0, max: 50 }, helper: "", expertMeaning: "Yield loss percentage (trimming, spillage)", expertMeaning_i18n: {"en":"Yield loss percentage (trimming, spillage)"} },
    { id: "evaporationPct", label: "Buharlaşma Oranı", label_i18n: {"en":"Evaporation Rate"}, type: "number", unit: "%", required: false, smartDefault: 5, validation: { min: 0, max: 50 }, helper: "", expertMeaning: "Evaporation loss percentage", expertMeaning_i18n: {"en":"Evaporation loss percentage"} },
  ],
  outputs: [
    { id: "recipeTheoretical", label: "Teorik Reçete Maliyeti", label_i18n: {"en":"Theoretical Recipe Cost"}, unit: "USD", format: "currency" },
    { id: "recipeActual", label: "Gerçek Reçete Maliyeti", label_i18n: {"en":"Actual Recipe Cost"}, unit: "USD", format: "currency" },
    { id: "recipeVariance", label: "Reçete Sapması", label_i18n: {"en":"Recipe Variance"}, unit: "USD", format: "currency" },
    { id: "recipeYieldLoss", label: "Fire Kaybı", label_i18n: {"en":"Yield Loss"}, unit: "USD", format: "currency" },
    { id: "recipeEvaporation", label: "Buharlaşma Kaybı", label_i18n: {"en":"Evaporation Loss"}, unit: "%", format: "number" },
    { id: "recipeEfficiency", label: "Reçete Verimliliği", label_i18n: {"en":"Recipe Efficiency"}, unit: "%", format: "number" },
    { id: "recipeCostPerKg", label: "Birim Maliyet", label_i18n: {"en":"Unit Cost"}, unit: "USD/kg", format: "currency" },
  ],
  thresholds: [{ fieldId: "recipeVariance", warning: 50, critical: 100, direction: "higher_is_bad", warningMessage: "Sapma > $50 — fire ve kullanım takibi başlatılmalı.", warningMessage_i18n: {"en":"Variance > $50 — initiate waste and usage tracking."}, criticalMessage: "Sapma > $100 — reçete standartları acilen gözden geçirilmeli.", criticalMessage_i18n: {"en":"Variance > $100 — urgently review recipe standards."} }],
  formulaPipeline: [
    { formulaId: "cost.recipe_theoretical", inputMap: { recipeQty: "recipeQty", ingredientCostPerKg: "ingredientCostPerKg" ,
        batchQty: "batchQty",
        theoreticalCostPerKg: "theoreticalCostPerKg"}, outputId: "recipeTheoretical" },
    { formulaId: "cost.recipe_actual", inputMap: { actualUsage: "actualUsage", ingredientCostPerKg: "ingredientCostPerKg" ,
        batchQty: "batchQty",
        actualCostPerKg: "actualCostPerKg"}, outputId: "recipeActual" },
    { formulaId: "cost.recipe_variance", inputMap: { recipeActual: "recipeActual", recipeTheoretical: "recipeTheoretical" }, outputId: "recipeVariance" },
    { formulaId: "cost.recipe_yield_loss", inputMap: { recipeQty: "recipeQty", ingredientCostPerKg: "ingredientCostPerKg", yieldLossPct: "yieldLossPct" ,
        expectedYield: "expectedYield",
        actualYield: "actualYield",
        costPerUnit: "costPerUnit"}, outputId: "recipeYieldLoss" },
    { formulaId: "measurement.recipe_evaporation", inputMap: {
        inputWeight: "evaporationPct"
      ,
        outputWeight: "outputWeight"}, outputId: "recipeEvaporation" },
    { formulaId: "measurement.recipe_efficiency", inputMap: { recipeTheoretical: "recipeTheoretical", recipeActual: "recipeActual" ,
        actualYield: "actualYield",
        expectedYield: "expectedYield"}, outputId: "recipeEfficiency" },
    { formulaId: "cost.recipe_cost_per_kg", inputMap: { recipeActual: "recipeActual", actualUsage: "actualUsage" ,
        outputWeight: "outputWeight"}, outputId: "recipeCostPerKg" },
  ],
  reportTemplate: { title: "Recipe Cost Check Report", title_i18n: {"en":"Recipe Cost Check Report"}, sections: ["executive_summary", "thresholds", "action_plan", "assumptions"], exportFormats: ["pdf", "excel"] },
  assumptions: { hiddenLossMultiplier: 1.0, volatilityPercent: 10, targetMarginPercent: 20, assumptionNotes: ["Teorik = miktar × birim fiyat.", "Gerçek = kullanım × birim fiyat.", "Fire kaybı = teorik × (fire%/100).", "Verimlilik = teorik / gerçek × 100."],assumptionNotes_i18n:[{"en":"Theoretical = quantity × unit price."},{"en":"Actual = usage × unit price."},{"en":"Yield loss = theoretical × (loss%/100)."},{"en":"Efficiency = theoretical / actual × 100."}] },
};
