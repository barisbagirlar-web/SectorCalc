/**
 * İÇ VERİM ORANI IRR — Premium Calculator Schema
 * Auto-generated from user-provided formulas
 */
import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";

export const IRRINVESTMENT_SCHEMA: PremiumCalculatorSchema = {
  id: "irr-investment-analyzer",
  legacyPaidSlug: "irr-investment-analyzer",
  name: "İÇ VERİM ORANI IRR",
  sectorSlug: "general",
  category: "cost",
  painStatement: "İÇ VERİM ORANI IRR — premium analysis tool.",
  inputs: [
    { id: "baslangic", label: "Başlangıç", type: "number", required: true },
    { id: "nakit_akislari", label: "Nakit Akışları", type: "array", required: true },
    { id: "omur_n", label: "Ömür n", type: "number", required: true },
    { id: "kalinti", label: "Kalıntı", type: "number", required: true },
    { id: "wacc", label: "WACC", type: "number", required: true },
    { id: "yeniden_yatirim", label: "Yeniden Yatırım", type: "number", required: true },
    { id: "iskonto", label: "İskonto", type: "number", required: true },
  ],
  outputs: [
    { id: "n_p_v", label: "N P V", unit: "currency", format: "currency" },
    { id: "i_r_r", label: "I R R", unit: "currency", format: "currency" },
    { id: "m_i_r_r", label: "M I R R", unit: "currency", format: "currency" },
    { id: "payback", label: "Payback", unit: "currency", format: "currency" },
    { id: "p_i", label: "P I", unit: "currency", format: "currency" },
    { id: "annuity", label: "Annuity", unit: "currency", format: "currency" },
    { id: "sens", label: "Sens", unit: "currency", format: "currency" },
  ],
  thresholds: [],
  formulaPipeline: [
    { formulaId: "custom.ic_verim_orani_irr_analyzer_0", inputMap: { Cash_t: "cash_t" }, outputId: "n_p_v" },
    { formulaId: "custom.ic_verim_orani_irr_analyzer_1", inputMap: { where: "where", NPV: "n_p_v" }, outputId: "i_r_r" },
    { formulaId: "custom.ic_verim_orani_irr_analyzer_2", inputMap: { FV_Pos: "f_v__pos", PV_Neg: "p_v__neg" }, outputId: "m_i_r_r" },
    { formulaId: "custom.ic_verim_orani_irr_analyzer_3", inputMap: { Year_Before: "year__before", Unrecovered: "unrecovered", Cash_Rec: "cash__rec" }, outputId: "payback" },
    { formulaId: "custom.ic_verim_orani_irr_analyzer_4", inputMap: { PV_Future: "p_v__future", InitInv: "init_inv" }, outputId: "p_i" },
    { formulaId: "custom.ic_verim_orani_irr_analyzer_5", inputMap: { NPV: "n_p_v" }, outputId: "annuity" },
    { formulaId: "custom.ic_verim_orani_irr_analyzer_6", inputMap: { Delta_IRR: "delta__i_r_r", Delta_Var: "delta__var" }, outputId: "sens" },
  ],
  reportTemplate: {
    title: "İÇ VERİM ORANI IRR Report",
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
