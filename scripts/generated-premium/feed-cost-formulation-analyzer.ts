/**
 * İLERLEME YEM MALİYET — Premium Calculator Schema
 * Auto-generated from user-provided formulas
 */
import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";

export const FEEDCOSTFORMULATION_SCHEMA: PremiumCalculatorSchema = {
  id: "feed-cost-formulation-analyzer",
  legacyPaidSlug: "feed-cost-formulation-analyzer",
  name: "İLERLEME YEM MALİYET",
  sectorSlug: "general",
  category: "cost",
  painStatement: "İLERLEME YEM MALİYET — premium analysis tool.",
  inputs: [
    { id: "kisitlar", label: "Kısıtlar", type: "matrix", required: true },
    { id: "besin", label: "Besin", type: "array", required: true },
    { id: "fiyatlar", label: "Fiyatlar", type: "array", required: true },
    { id: "ogutme", label: "Öğütme", type: "number", required: true },
    { id: "fire", label: "Fire", type: "number", required: true },
    { id: "fcr", label: "FCR", type: "number", required: true },
    { id: "kazanc", label: "Kazanç", type: "number", required: true },
  ],
  outputs: [
    { id: "cost__ing", label: "Cost_ Ing", unit: "currency", format: "currency" },
    { id: "cost__base", label: "Cost_ Base", unit: "currency", format: "currency" },
    { id: "cost__proc", label: "Cost_ Proc", unit: "currency", format: "currency" },
    { id: "cost__add", label: "Cost_ Add", unit: "currency", format: "currency" },
    { id: "shrink", label: "Shrink", unit: "currency", format: "currency" },
    { id: "f_c_r", label: "F C R", unit: "currency", format: "currency" },
    { id: "cost_per_kg", label: "Cost Per Kg", unit: "currency", format: "currency" },
    { id: "opt", label: "Opt", unit: "currency", format: "currency" },
  ],
  thresholds: [],
  formulaPipeline: [
    { formulaId: "custom.ilerleme_yem_maliyet_analyzer_0", inputMap: { InclRate: "incl_rate", Price: "price" }, outputId: "cost__ing" },
    { formulaId: "custom.ilerleme_yem_maliyet_analyzer_1", inputMap: { Cost_Ing: "cost__ing" }, outputId: "cost__base" },
    { formulaId: "custom.ilerleme_yem_maliyet_analyzer_2", inputMap: { Grind: "grind", Mix: "mix", Pellet: "pellet" }, outputId: "cost__proc" },
    { formulaId: "custom.ilerleme_yem_maliyet_analyzer_3", inputMap: { Enz: "enz", Vit: "vit", Tox: "tox" }, outputId: "cost__add" },
    { formulaId: "custom.ilerleme_yem_maliyet_analyzer_4", inputMap: { Cost_Base: "cost__base", ShrinkRate: "shrink_rate" }, outputId: "shrink" },
    { formulaId: "custom.ilerleme_yem_maliyet_analyzer_5", inputMap: { FeedCons: "feed_cons", WeightGain: "weight_gain" }, outputId: "f_c_r" },
    { formulaId: "custom.ilerleme_yem_maliyet_analyzer_6", inputMap: { Base: "base", Proc: "proc", Add: "add", Shrink: "shrink", FCR: "fcr" }, outputId: "cost_per_kg" },
    { formulaId: "custom.ilerleme_yem_maliyet_analyzer_7", inputMap: { Base: "base", SUBJECT: "s_u_b_j_e_c_t", TO: "t_o", Constraints: "constraints" }, outputId: "opt" },
  ],
  reportTemplate: {
    title: "İLERLEME YEM MALİYET Report",
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
