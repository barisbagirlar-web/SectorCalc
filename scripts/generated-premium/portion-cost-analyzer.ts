/**
 * Porsiyon Maliyet — Premium Calculator Schema
 * Auto-generated from user-provided formulas
 */
import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";

export const PORTIONCOST_SCHEMA: PremiumCalculatorSchema = {
  id: "portion-cost-analyzer",
  legacyPaidSlug: "portion-cost-analyzer",
  name: "Porsiyon Maliyet",
  sectorSlug: "general",
  category: "cost",
  painStatement: "Porsiyon Maliyet — premium analysis tool.",
  inputs: [
    { id: "recete_miktarlari", label: "Reçete Miktarları", type: "array", required: true },
    { id: "hazirlik_suresi", label: "Hazırlık Süresi", type: "number", required: true },
    { id: "fireyield", label: "Fire/Yield", type: "number", required: true },
    { id: "hammadde_birim_fiyatlari", label: "Hammadde Birim Fiyatları", type: "array", required: true },
    { id: "iscilik_saati", label: "İşçilik Saati", type: "number", required: true },
    { id: "overhead_orani", label: "Overhead Oranı", type: "number", required: true },
    { id: "hedef_food_cost", label: "Hedef Food Cost", type: "number", required: true },
    { id: "menu_fiyati", label: "Menü Fiyatı", type: "number", required: true },
  ],
  outputs: [
    { id: "ingredient_cost", label: "Ingredient Cost", unit: "currency", format: "currency" },
    { id: "yield_adjusted_cost", label: "Yield Adjusted Cost", unit: "currency", format: "currency" },
    { id: "labor_cost", label: "Labor Cost", unit: "currency", format: "currency" },
    { id: "overhead", label: "Overhead", unit: "currency", format: "currency" },
    { id: "total_portion_cost", label: "Total Portion Cost", unit: "currency", format: "currency" },
    { id: "food_cost_pct", label: "Food Cost Pct", unit: "currency", format: "currency" },
    { id: "menu_price__target", label: "Menu Price_ Target", unit: "currency", format: "currency" },
    { id: "margin", label: "Margin", unit: "currency", format: "currency" },
  ],
  thresholds: [],
  formulaPipeline: [
    { formulaId: "custom.porsiyon_maliyet_analyzer_0", inputMap: { Quantity_i: "quantity_i", UnitPrice_i: "unit_price_i" }, outputId: "ingredient_cost" },
    { formulaId: "custom.porsiyon_maliyet_analyzer_1", inputMap: { IngredientCost: "ingredient_cost", YieldPct: "yield_pct" }, outputId: "yield_adjusted_cost" },
    { formulaId: "custom.porsiyon_maliyet_analyzer_2", inputMap: { PrepTime: "prep_time", LaborRate: "labor_rate" }, outputId: "labor_cost" },
    { formulaId: "custom.porsiyon_maliyet_analyzer_3", inputMap: { IngredientCost: "ingredient_cost", LaborCost: "labor_cost", OverheadPct: "overhead_pct" }, outputId: "overhead" },
    { formulaId: "custom.porsiyon_maliyet_analyzer_4", inputMap: { YieldAdjustedCost: "yield_adjusted_cost", LaborCost: "labor_cost", Overhead: "overhead_orani" }, outputId: "total_portion_cost" },
    { formulaId: "custom.porsiyon_maliyet_analyzer_5", inputMap: { TotalPortionCost: "total_portion_cost", MenuPrice: "menu_price" }, outputId: "food_cost_pct" },
    { formulaId: "custom.porsiyon_maliyet_analyzer_6", inputMap: { TotalPortionCost: "total_portion_cost", TargetFoodCostPct: "target_food_cost_pct" }, outputId: "menu_price__target" },
    { formulaId: "custom.porsiyon_maliyet_analyzer_7", inputMap: { MenuPrice: "menu_price", TotalPortionCost: "total_portion_cost" }, outputId: "margin" },
  ],
  reportTemplate: {
    title: "Porsiyon Maliyet Report",
    sections: ["executive_summary", "loss_breakdown", "thresholds", "action_plan"],
    exportFormats: ["pdf"],
  },
  assumptions: {
    hiddenLossMultiplier: 1.0,
    volatilityPercent: 10,
    targetMarginPercent: 20,
    assumptionNotes: ["Based on user-provided formulas.", "Verify constants periodically."],
  },
};
