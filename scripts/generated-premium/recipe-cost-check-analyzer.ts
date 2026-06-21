/**
 * reçete Maliyet Check — Premium Calculator Schema
 * Auto-generated from user-provided formulas
 */
import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";

export const RECIPECOSTCHECK_SCHEMA: PremiumCalculatorSchema = {
  id: "recipe-cost-check-analyzer",
  legacyPaidSlug: "recipe-cost-check-analyzer",
  name: "reçete Maliyet Check",
  sectorSlug: "general",
  category: "cost",
  painStatement: "reçete Maliyet Check — premium analysis tool.",
  inputs: [
    { id: "giren_cikan_agirlik", label: "Giren Çıkan Ağırlık", type: "number", required: true },
    { id: "firescrap", label: "Fire/Scrap", type: "number", required: true },
    { id: "recete_oranlari", label: "Reçete Oranları", type: "array", required: true },
    { id: "teorik_verim", label: "Teorik Verim", type: "number", required: true },
    { id: "hammadde_ortalama_fiyatlari", label: "Hammadde Ortalama Fiyatları", type: "array", required: true },
    { id: "hedef_birim_maliyet", label: "Hedef Birim Maliyet", type: "number", required: true },
  ],
  outputs: [
    { id: "theoretical_cost", label: "Theoretical Cost", unit: "currency", format: "currency" },
    { id: "actual_cost", label: "Actual Cost", unit: "currency", format: "currency" },
    { id: "variance", label: "Variance", unit: "currency", format: "currency" },
    { id: "yield_loss_cost", label: "Yield Loss Cost", unit: "currency", format: "currency" },
    { id: "evaporation_loss", label: "Evaporation Loss", unit: "currency", format: "currency" },
    { id: "efficiency", label: "Efficiency", unit: "currency", format: "currency" },
    { id: "cost_per_kg", label: "Cost Per Kg", unit: "currency", format: "currency" },
  ],
  thresholds: [],
  formulaPipeline: [
    { formulaId: "custom.recete_maliyet_check_analyzer_0", inputMap: { FormulationPct_i: "formulation_pct_i", IngredientPrice_i: "ingredient_price_i" }, outputId: "theoretical_cost" },
    { formulaId: "custom.recete_maliyet_check_analyzer_1", inputMap: { TotalMaterialConsumed: "total_material_consumed", AvgPrice: "avg_price", TotalOutput: "total_output" }, outputId: "actual_cost" },
    { formulaId: "custom.recete_maliyet_check_analyzer_2", inputMap: { ActualCost: "actual_cost", TheoreticalCost: "theoretical_cost" }, outputId: "variance" },
    { formulaId: "custom.recete_maliyet_check_analyzer_3", inputMap: { ActualYield: "actual_yield", TheoreticalCost: "theoretical_cost" }, outputId: "yield_loss_cost" },
    { formulaId: "custom.recete_maliyet_check_analyzer_4", inputMap: { InputWeight: "input_weight", OutputWeight: "output_weight", KnownScrap: "known_scrap" }, outputId: "evaporation_loss" },
    { formulaId: "custom.recete_maliyet_check_analyzer_5", inputMap: { ActualOutput: "actual_output", TheoreticalOutput: "theoretical_output" }, outputId: "efficiency" },
    { formulaId: "custom.recete_maliyet_check_analyzer_6", inputMap: { ActualCost: "actual_cost", OutputWeight: "output_weight" }, outputId: "cost_per_kg" },
  ],
  reportTemplate: {
    title: "reçete Maliyet Check Report",
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
