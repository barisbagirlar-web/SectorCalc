/**
 * GIDA FİRE MARJ — Premium Calculator Schema
 * Auto-generated from user-provided formulas
 */
import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";

export const FOODWASTEMARGIN_SCHEMA: PremiumCalculatorSchema = {
  id: "food-waste-margin-analyzer",
  legacyPaidSlug: "food-waste-margin-analyzer",
  name: "GIDA FİRE MARJ",
  sectorSlug: "general",
  category: "cost",
  painStatement: "GIDA FİRE MARJ — premium analysis tool.",
  inputs: [
    { id: "girencikan_agirlik", label: "Giren/Çıkan Ağırlık", type: "number", required: true },
    { id: "bozulmaasiri", label: "Bozulma/Aşırı", type: "number", required: true },
    { id: "teorik_kullanim", label: "Teorik Kullanım", type: "number", required: true },
    { id: "kg_maliyet", label: "kg Maliyet", type: "number", required: true },
    { id: "salvage", label: "Salvage", type: "number", required: true },
    { id: "indirimli", label: "İndirimli", type: "number", required: true },
  ],
  outputs: [
    { id: "yield", label: "Yield", unit: "currency", format: "currency" },
    { id: "shrinkage", label: "Shrinkage", unit: "currency", format: "currency" },
    { id: "cost__shrink", label: "Cost_ Shrink", unit: "currency", format: "currency" },
    { id: "cost__spoil", label: "Cost_ Spoil", unit: "currency", format: "currency" },
    { id: "cost__over", label: "Cost_ Over", unit: "currency", format: "currency" },
    { id: "margin_leak", label: "Margin Leak", unit: "currency", format: "currency" },
    { id: "o_e_e__food", label: "O E E_ Food", unit: "currency", format: "currency" },
    { id: "theo_usage", label: "Theo Usage", unit: "currency", format: "currency" },
    { id: "variance", label: "Variance", unit: "currency", format: "currency" },
  ],
  thresholds: [],
  formulaPipeline: [
    { formulaId: "custom.gida_fire_marj_analyzer_0", inputMap: { Finished: "finished", Raw: "raw" }, outputId: "yield" },
    { formulaId: "custom.gida_fire_marj_analyzer_1", inputMap: { Raw: "raw", Finished: "finished" }, outputId: "shrinkage" },
    { formulaId: "custom.gida_fire_marj_analyzer_2", inputMap: { Shrinkage: "shrinkage", RawCost: "raw_cost" }, outputId: "cost__shrink" },
    { formulaId: "custom.gida_fire_marj_analyzer_3", inputMap: { Spoiled: "spoiled", ProdCost: "prod_cost" }, outputId: "cost__spoil" },
    { formulaId: "custom.gida_fire_marj_analyzer_4", inputMap: { Excess: "excess", UnitCost: "unit_cost", Salvage: "salvage" }, outputId: "cost__over" },
    { formulaId: "custom.gida_fire_marj_analyzer_5", inputMap: { Shrink: "shrink", Spoil: "spoil", Over: "over" }, outputId: "margin_leak" },
    { formulaId: "custom.gida_fire_marj_analyzer_6", inputMap: { Avail: "avail", Perf: "perf", Qual_Yield: "qual__yield" }, outputId: "o_e_e__food" },
    { formulaId: "custom.gida_fire_marj_analyzer_7", inputMap: { Recipe: "recipe", ActualProd: "actual_prod" }, outputId: "theo_usage" },
    { formulaId: "custom.gida_fire_marj_analyzer_8", inputMap: { Actual: "actual", Theo: "theo" }, outputId: "variance" },
  ],
  reportTemplate: {
    title: "GIDA FİRE MARJ Report",
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
