/**
 * CHATTER YÜZEY KALİTE — Premium Calculator Schema
 * Auto-generated from user-provided formulas
 */
import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";

export const CHATTERSURFACEQUALITY_SCHEMA: PremiumCalculatorSchema = {
  id: "chatter-surface-quality-analyzer",
  legacyPaidSlug: "chatter-surface-quality-analyzer",
  name: "CHATTER YÜZEY KALİTE",
  sectorSlug: "general",
  category: "cost",
  painStatement: "CHATTER YÜZEY KALİTE — premium analysis tool.",
  inputs: [
    { id: "kesme_hizi_vc", label: "Kesme Hızı V_c", type: "number", required: true },
    { id: "devir_n", label: "Devir n", type: "number", required: true },
    { id: "ilerleme_vf", label: "İlerleme V_f", type: "number", required: true },
    { id: "dis_sayisi_z", label: "Diş Sayısı z", type: "number", required: true },
    { id: "takim_ucu_radyusu", label: "Takım Ucu Radyusu", type: "number", required: true },
    { id: "titresim_genligi", label: "Titreşim Genliği", type: "number", required: true },
    { id: "ra_limiti", label: "Ra Limiti", type: "number", required: true },
  ],
  outputs: [
    { id: "v_c", label: "V_c", unit: "currency", format: "currency" },
    { id: "f_z", label: "f_z", unit: "currency", format: "currency" },
    { id: "surface_roughness__theo", label: "Surface Roughness_ Theo", unit: "currency", format: "currency" },
    { id: "surface_roughness__actual", label: "Surface Roughness_ Actual", unit: "currency", format: "currency" },
    { id: "quality_loss_cost", label: "Quality Loss Cost", unit: "currency", format: "currency" },
    { id: "scrap_rate", label: "Scrap Rate", unit: "currency", format: "currency" },
  ],
  thresholds: [],
  formulaPipeline: [
    { formulaId: "custom.chatter_yuzey_kalite_analyzer_0", inputMap: {  }, outputId: "v_c" },
    { formulaId: "custom.chatter_yuzey_kalite_analyzer_1", inputMap: { V_f: "v_f" }, outputId: "f_z" },
    { formulaId: "custom.chatter_yuzey_kalite_analyzer_2", inputMap: { f_z: "f_z", r_epsilon: "r_epsilon" }, outputId: "surface_roughness__theo" },
    { formulaId: "custom.chatter_yuzey_kalite_analyzer_3", inputMap: { Theo: "theo", ChatterAmplification: "chatter_amplification" }, outputId: "surface_roughness__actual" },
    { formulaId: "custom.chatter_yuzey_kalite_analyzer_4", inputMap: { Actual: "actual", ToleranceLimit: "tolerance_limit", ReworkCostPerMicron: "rework_cost_per_micron" }, outputId: "quality_loss_cost" },
    { formulaId: "custom.chatter_yuzey_kalite_analyzer_5", inputMap: { Actual: "actual", MaxTolerance: "max_tolerance", BatchSize: "batch_size" }, outputId: "scrap_rate" },
  ],
  reportTemplate: {
    title: "CHATTER YÜZEY KALİTE Report",
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
