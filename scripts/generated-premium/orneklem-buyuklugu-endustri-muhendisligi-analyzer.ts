/**
 * Örneklem Büyüklüğü (Endüstri Mühendisliği) — Premium Calculator Schema
 * Auto-generated from user-provided formulas
 */
import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";

export const ORNEKLEMBUYUKLUGUENDUSTRIMUHENDISLIGI_SCHEMA: PremiumCalculatorSchema = {
  id: "orneklem-buyuklugu-endustri-muhendisligi-analyzer",
  legacyPaidSlug: "orneklem-buyuklugu-endustri-muhendisligi-analyzer",
  name: "Örneklem Büyüklüğü (Endüstri Mühendisliği)",
  sectorSlug: "general",
  category: "cost",
  painStatement: "Örneklem Büyüklüğü (Endüstri Mühendisliği) — premium analysis tool.",
  inputs: [
    { id: "populasyon_n", label: "Popülasyon N", type: "number", required: true },
    { id: "guven_seviyesi_z", label: "Güven Seviyesi Z", type: "number", required: true },
    { id: "hata_payi_e", label: "Hata Payı E", type: "number", required: true },
    { id: "tahmini_oran_p", label: "Tahmini Oran p", type: "number", required: true },
    { id: "stddev_sigma", label: "StdDev Sigma", type: "number", required: true },
    { id: "icc", label: "ICC", type: "number", required: true },
    { id: "birim_muayene_maliyeti", label: "Birim Muayene Maliyeti", type: "number", required: true },
  ],
  outputs: [
    { id: "n__infinite", label: "n_ Infinite", unit: "currency", format: "currency" },
    { id: "n__finite", label: "n_ Finite", unit: "currency", format: "currency" },
    { id: "n__continuous", label: "n_ Continuous", unit: "currency", format: "currency" },
    { id: "power__adjusted", label: "Power_ Adjusted", unit: "currency", format: "currency" },
    { id: "design_effect", label: "Design Effect", unit: "currency", format: "currency" },
    { id: "final_n", label: "Final_n", unit: "currency", format: "currency" },
    { id: "cost__sampling", label: "Cost_ Sampling", unit: "currency", format: "currency" },
  ],
  thresholds: [],
  formulaPipeline: [
    { formulaId: "custom.orneklem_buyuklugu_endustri_muhendisligi_analyzer_0", inputMap: {  }, outputId: "n__infinite" },
    { formulaId: "custom.orneklem_buyuklugu_endustri_muhendisligi_analyzer_1", inputMap: { n_Infinite: "n__infinite" }, outputId: "n__finite" },
    { formulaId: "custom.orneklem_buyuklugu_endustri_muhendisligi_analyzer_2", inputMap: { Sigma: "stddev_sigma" }, outputId: "n__continuous" },
    { formulaId: "custom.orneklem_buyuklugu_endustri_muhendisligi_analyzer_3", inputMap: { Z_beta: "z_beta", Z_alpha: "z_alpha" }, outputId: "power__adjusted" },
    { formulaId: "custom.orneklem_buyuklugu_endustri_muhendisligi_analyzer_4", inputMap: { ClusterSize: "cluster_size", ICC: "icc" }, outputId: "design_effect" },
    { formulaId: "custom.orneklem_buyuklugu_endustri_muhendisligi_analyzer_5", inputMap: { n_Finite: "n__finite", DesignEffect: "design_effect" }, outputId: "final_n" },
    { formulaId: "custom.orneklem_buyuklugu_endustri_muhendisligi_analyzer_6", inputMap: { Final_n: "final_n", CostPerUnit: "cost_per_unit" }, outputId: "cost__sampling" },
  ],
  reportTemplate: {
    title: "Örneklem Büyüklüğü (Endüstri Mühendisliği) Report",
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
