/**
 * Restaurant Menü Marj Kaçak — Premium Calculator Schema
 * Auto-generated from user-provided formulas
 */
import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";

export const RESTAURANTMENUMARGINLEAK_SCHEMA: PremiumCalculatorSchema = {
  id: "restaurant-menu-margin-leak-analyzer",
  legacyPaidSlug: "restaurant-menu-margin-leak-analyzer",
  name: "Restaurant Menü Marj Kaçak",
  sectorSlug: "general",
  category: "cost",
  painStatement: "Restaurant Menü Marj Kaçak — premium analysis tool.",
  inputs: [
    { id: "satilan_urun_adetleri", label: "Satılan Ürün Adetleri", type: "array", required: true },
    { id: "baslangicbitis_stok", label: "Başlangıç/Bitiş Stok", type: "number", required: true },
    { id: "porsiyon_maliyetleri", label: "Porsiyon Maliyetleri", type: "array", required: true },
    { id: "kayitli_fire", label: "Kayıtlı Fire", type: "number", required: true },
    { id: "ikramiptal_tutari", label: "İkram/İptal Tutarı", type: "number", required: true },
    { id: "toplam_yemek_satisi", label: "Toplam Yemek Satışı", type: "number", required: true },
  ],
  outputs: [
    { id: "theoretical_food_cost", label: "Theoretical Food Cost", unit: "currency", format: "currency" },
    { id: "actual_food_cost", label: "Actual Food Cost", unit: "currency", format: "currency" },
    { id: "variance", label: "Variance", unit: "currency", format: "currency" },
    { id: "variance_pct", label: "Variance Pct", unit: "currency", format: "currency" },
    { id: "waste_cost", label: "Waste Cost", unit: "currency", format: "currency" },
    { id: "theft_loss", label: "Theft Loss", unit: "currency", format: "currency" },
    { id: "ideal_margin", label: "Ideal Margin", unit: "currency", format: "currency" },
    { id: "actual_margin", label: "Actual Margin", unit: "currency", format: "currency" },
  ],
  thresholds: [],
  formulaPipeline: [
    { formulaId: "custom.restaurant_menu_marj_kacak_analyzer_0", inputMap: { ItemsSold_i: "items_sold_i", PortionCost_i: "portion_cost_i" }, outputId: "theoretical_food_cost" },
    { formulaId: "custom.restaurant_menu_marj_kacak_analyzer_1", inputMap: { BeginningInventory: "beginning_inventory", Purchases: "purchases", EndingInventory: "ending_inventory" }, outputId: "actual_food_cost" },
    { formulaId: "custom.restaurant_menu_marj_kacak_analyzer_2", inputMap: { ActualFoodCost: "actual_food_cost", TheoreticalFoodCost: "theoretical_food_cost" }, outputId: "variance" },
    { formulaId: "custom.restaurant_menu_marj_kacak_analyzer_3", inputMap: { Variance: "variance", TotalFoodSales: "total_food_sales" }, outputId: "variance_pct" },
    { formulaId: "custom.restaurant_menu_marj_kacak_analyzer_4", inputMap: { RecordedWaste: "recorded_waste", AvgPortionCost: "avg_portion_cost" }, outputId: "waste_cost" },
    { formulaId: "custom.restaurant_menu_marj_kacak_analyzer_5", inputMap: { Variance: "variance", WasteCost: "waste_cost", CompMeals: "comp_meals" }, outputId: "theft_loss" },
    { formulaId: "custom.restaurant_menu_marj_kacak_analyzer_6", inputMap: { TheoreticalFoodCost: "theoretical_food_cost", TotalFoodSales: "total_food_sales" }, outputId: "ideal_margin" },
    { formulaId: "custom.restaurant_menu_marj_kacak_analyzer_7", inputMap: { ActualFoodCost: "actual_food_cost", TotalFoodSales: "total_food_sales" }, outputId: "actual_margin" },
  ],
  reportTemplate: {
    title: "Restaurant Menü Marj Kaçak Report",
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
