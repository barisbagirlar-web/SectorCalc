/**
 * GAGE R&R MALİYET — Premium Calculator Schema
 * Auto-generated from user-provided formulas
 */
import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";

export const GAGERNRCOST_SCHEMA: PremiumCalculatorSchema = {
  id: "gage-rnr-cost-analyzer",
  legacyPaidSlug: "gage-rnr-cost-analyzer",
  name: "GAGE R&R MALİYET",
  sectorSlug: "general",
  category: "cost",
  painStatement: "GAGE R&R MALİYET — premium analysis tool.",
  inputs: [
    { id: "parca_n", label: "Parça n", type: "number", required: true },
    { id: "operator", label: "Operatör", type: "number", required: true },
    { id: "tekrar_r", label: "Tekrar r", type: "number", required: true },
    { id: "veri", label: "Veri", type: "matrix", required: true },
    { id: "tolerans", label: "Tolerans", type: "number", required: true },
    { id: "yanlis_kabulred", label: "Yanlış Kabul/Red", type: "number", required: true },
    { id: "toplam_kalite", label: "Toplam Kalite", type: "number", required: true },
  ],
  outputs: [
    { id: "e_v", label: "E V", unit: "currency", format: "currency" },
    { id: "a_v", label: "A V", unit: "currency", format: "currency" },
    { id: "g_r_r", label: "G R R", unit: "currency", format: "currency" },
    { id: "p_v", label: "P V", unit: "currency", format: "currency" },
    { id: "t_v", label: "T V", unit: "currency", format: "currency" },
    { id: "pct_g_r_r", label: "Pct G R R", unit: "currency", format: "currency" },
    { id: "cost_error", label: "Cost Error", unit: "currency", format: "currency" },
    { id: "opt_tol", label: "Opt Tol", unit: "currency", format: "currency" },
    { id: "fin_impact", label: "Fin Impact", unit: "currency", format: "currency" },
  ],
  thresholds: [],
  formulaPipeline: [
    { formulaId: "custom.gage_rver_maliyet_analyzer_0", inputMap: { Range_Avg: "range__avg", d2_star: "d2_star" }, outputId: "e_v" },
    { formulaId: "custom.gage_rver_maliyet_analyzer_1", inputMap: { Range_Ops: "range__ops", d2_star: "d2_star", EV: "e_v" }, outputId: "a_v" },
    { formulaId: "custom.gage_rver_maliyet_analyzer_2", inputMap: { EV: "e_v", AV: "a_v" }, outputId: "g_r_r" },
    { formulaId: "custom.gage_rver_maliyet_analyzer_3", inputMap: { Range_Parts: "range__parts", d2_star: "d2_star" }, outputId: "p_v" },
    { formulaId: "custom.gage_rver_maliyet_analyzer_4", inputMap: { GRR: "g_r_r", PV: "p_v" }, outputId: "t_v" },
    { formulaId: "custom.gage_rver_maliyet_analyzer_5", inputMap: { GRR: "g_r_r", TV: "t_v" }, outputId: "pct_g_r_r" },
    { formulaId: "custom.gage_rver_maliyet_analyzer_6", inputMap: { FalseAcc: "false_acc", EscapeCost: "escape_cost", FalseRej: "false_rej", ScrapCost: "scrap_cost" }, outputId: "cost_error" },
    { formulaId: "custom.gage_rver_maliyet_analyzer_7", inputMap: { GRR: "g_r_r" }, outputId: "opt_tol" },
    { formulaId: "custom.gage_rver_maliyet_analyzer_8", inputMap: { PctGRR: "pct_g_r_r", TotalQualCost: "total_qual_cost" }, outputId: "fin_impact" },
  ],
  reportTemplate: {
    title: "GAGE R&R MALİYET Report",
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
