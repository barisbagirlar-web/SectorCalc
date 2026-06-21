/**
 * İSTATİSTİKSEL PROSES KONTROL — Premium Calculator Schema
 * Auto-generated from user-provided formulas
 */
import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";

export const SPCLIMITCONTROL_SCHEMA: PremiumCalculatorSchema = {
  id: "spc-limit-control-analyzer",
  legacyPaidSlug: "spc-limit-control-analyzer",
  name: "İSTATİSTİKSEL PROSES KONTROL",
  sectorSlug: "general",
  category: "cost",
  painStatement: "İSTATİSTİKSEL PROSES KONTROL — premium analysis tool.",
  inputs: [
    { id: "alt_grup_n", label: "Alt Grup n", type: "number", required: true },
    { id: "veri", label: "Veri", type: "matrix", required: true },
    { id: "usl", label: "USL", type: "number", required: true },
    { id: "lsl", label: "LSL", type: "number", required: true },
    { id: "tip", label: "Tip", type: "text", required: true },
    { id: "hedef", label: "Hedef", type: "number", required: true },
  ],
  outputs: [
    { id: "x__bar__bar", label: "X_ Bar_ Bar", unit: "currency", format: "currency" },
    { id: "r__bar", label: "R_ Bar", unit: "currency", format: "currency" },
    { id: "s__bar", label: "S_ Bar", unit: "currency", format: "currency" },
    { id: "u_c_l__x", label: "U C L_ X", unit: "currency", format: "currency" },
    { id: "l_c_l__x", label: "L C L_ X", unit: "currency", format: "currency" },
    { id: "u_c_l__r", label: "U C L_ R", unit: "currency", format: "currency" },
    { id: "l_c_l__r", label: "L C L_ R", unit: "currency", format: "currency" },
    { id: "sigma", label: "Sigma", unit: "currency", format: "currency" },
    { id: "cp", label: "Cp", unit: "currency", format: "currency" },
  ],
  thresholds: [],
  formulaPipeline: [
    { formulaId: "custom.istatistiksel_proses_kontrol_analyzer_0", inputMap: { Means: "means" }, outputId: "x__bar__bar" },
    { formulaId: "custom.istatistiksel_proses_kontrol_analyzer_1", inputMap: { Ranges: "ranges" }, outputId: "r__bar" },
    { formulaId: "custom.istatistiksel_proses_kontrol_analyzer_2", inputMap: { StdDevs: "std_devs" }, outputId: "s__bar" },
    { formulaId: "custom.istatistiksel_proses_kontrol_analyzer_3", inputMap: { X_Bar_Bar: "x__bar__bar", A2: "a2", R_Bar: "r__bar" }, outputId: "u_c_l__x" },
    { formulaId: "custom.istatistiksel_proses_kontrol_analyzer_4", inputMap: { X_Bar_Bar: "x__bar__bar", A2: "a2", R_Bar: "r__bar" }, outputId: "l_c_l__x" },
    { formulaId: "custom.istatistiksel_proses_kontrol_analyzer_5", inputMap: { D4: "d4", R_Bar: "r__bar" }, outputId: "u_c_l__r" },
    { formulaId: "custom.istatistiksel_proses_kontrol_analyzer_6", inputMap: { D3: "d3", R_Bar: "r__bar" }, outputId: "l_c_l__r" },
    { formulaId: "custom.istatistiksel_proses_kontrol_analyzer_7", inputMap: { R_Bar: "r__bar", d2: "d2" }, outputId: "sigma" },
    { formulaId: "custom.istatistiksel_proses_kontrol_analyzer_8", inputMap: { USL: "usl", LSL: "lsl", Sigma: "sigma" }, outputId: "cp" },
  ],
  reportTemplate: {
    title: "İSTATİSTİKSEL PROSES KONTROL Report",
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
