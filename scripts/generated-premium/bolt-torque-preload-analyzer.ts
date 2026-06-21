/**
 * CIVATE TORK — Premium Calculator Schema
 * Auto-generated from user-provided formulas
 */
import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";

export const BOLTTORQUEPRELOAD_SCHEMA: PremiumCalculatorSchema = {
  id: "bolt-torque-preload-analyzer",
  legacyPaidSlug: "bolt-torque-preload-analyzer",
  name: "CIVATE TORK",
  sectorSlug: "general",
  category: "cost",
  painStatement: "CIVATE TORK — premium analysis tool.",
  inputs: [
    { id: "nominal_cap_d", label: "Nominal Çap d", type: "number", required: true },
    { id: "hatve_p", label: "Hatve p", type: "number", required: true },
    { id: "surtunme_k", label: "Sürtünme K", type: "number", required: true },
    { id: "malzeme_sinifi", label: "Malzeme Sınıfı", type: "text", required: true },
    { id: "akma_dayanimi", label: "Akma Dayanımı", type: "number", required: true },
    { id: "hedef_ongerilme", label: "Hedef Öngerilme", type: "number", required: true },
  ],
  outputs: [
    { id: "t", label: "T", unit: "currency", format: "currency" },
    { id: "f", label: "F", unit: "currency", format: "currency" },
    { id: "sigma_p", label: "Sigma_p", unit: "currency", format: "currency" },
    { id: "a_t", label: "A_t", unit: "currency", format: "currency" },
    { id: "d2", label: "d2", unit: "currency", format: "currency" },
    { id: "d3", label: "d3", unit: "currency", format: "currency" },
    { id: "yield_check", label: "Yield Check", unit: "currency", format: "currency" },
  ],
  thresholds: [],
  formulaPipeline: [
    { formulaId: "custom.civate_tork_analyzer_0", inputMap: {  }, outputId: "t" },
    { formulaId: "custom.civate_tork_analyzer_1", inputMap: { Preload: "preload", Sigma_p: "sigma_p", A_t: "a_t" }, outputId: "f" },
    { formulaId: "custom.civate_tork_analyzer_2", inputMap: { ProofStrength: "proof_strength" }, outputId: "sigma_p" },
    { formulaId: "custom.civate_tork_analyzer_3", inputMap: { d2: "d2", d3: "d3" }, outputId: "a_t" },
    { formulaId: "custom.civate_tork_analyzer_4", inputMap: {  }, outputId: "d2" },
    { formulaId: "custom.civate_tork_analyzer_5", inputMap: {  }, outputId: "d3" },
    { formulaId: "custom.civate_tork_analyzer_6", inputMap: { Sigma_p: "sigma_p", YieldStrength: "yield_strength", FAIL: "f_a_i_l", PASS: "p_a_s_s" }, outputId: "yield_check" },
  ],
  reportTemplate: {
    title: "CIVATE TORK Report",
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
