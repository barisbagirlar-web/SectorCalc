/**
 * CPK TO PPM — Premium Calculator Schema
 * Auto-generated from user-provided formulas
 */
import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";

export const CPKPPMCONVERTER_SCHEMA: PremiumCalculatorSchema = {
  id: "cpk-ppm-converter-analyzer",
  legacyPaidSlug: "cpk-ppm-converter-analyzer",
  name: "CPK TO PPM",
  sectorSlug: "general",
  category: "cost",
  painStatement: "CPK TO PPM — premium analysis tool.",
  inputs: [
    { id: "usl", label: "USL", type: "number", required: true },
    { id: "lsl", label: "LSL", type: "number", required: true },
    { id: "mean", label: "Mean", type: "number", required: true },
    { id: "stddev", label: "StdDev", type: "number", required: true },
    { id: "hedef_cpk", label: "Hedef Cpk", type: "number", required: true },
    { id: "gunluk_hacim", label: "Günlük Hacim", type: "number", required: true },
  ],
  outputs: [
    { id: "z__u_s_l", label: "Z_ U S L", unit: "currency", format: "currency" },
    { id: "z__l_s_l", label: "Z_ L S L", unit: "currency", format: "currency" },
    { id: "cpk", label: "Cpk", unit: "currency", format: "currency" },
    { id: "p__u_s_l", label: "P_ U S L", unit: "currency", format: "currency" },
    { id: "p__l_s_l", label: "P_ L S L", unit: "currency", format: "currency" },
    { id: "p__total", label: "P_ Total", unit: "currency", format: "currency" },
    { id: "p_p_m", label: "P P M", unit: "currency", format: "currency" },
    { id: "yield", label: "Yield", unit: "currency", format: "currency" },
    { id: "sigma__short_term", label: "Sigma_ Short Term", unit: "currency", format: "currency" },
  ],
  thresholds: [],
  formulaPipeline: [
    { formulaId: "custom.cpk_to_ppm_analyzer_0", inputMap: { USL: "usl", Mean: "mean", StdDev: "stddev" }, outputId: "z__u_s_l" },
    { formulaId: "custom.cpk_to_ppm_analyzer_1", inputMap: { Mean: "mean", LSL: "lsl", StdDev: "stddev" }, outputId: "z__l_s_l" },
    { formulaId: "custom.cpk_to_ppm_analyzer_2", inputMap: { Z_USL: "usl", Z_LSL: "lsl" }, outputId: "cpk" },
    { formulaId: "custom.cpk_to_ppm_analyzer_3", inputMap: { Z_USL: "usl" }, outputId: "p__u_s_l" },
    { formulaId: "custom.cpk_to_ppm_analyzer_4", inputMap: { Z_LSL: "lsl" }, outputId: "p__l_s_l" },
    { formulaId: "custom.cpk_to_ppm_analyzer_5", inputMap: { P_USL: "usl", P_LSL: "lsl" }, outputId: "p__total" },
    { formulaId: "custom.cpk_to_ppm_analyzer_6", inputMap: { P_Total: "p__total" }, outputId: "p_p_m" },
    { formulaId: "custom.cpk_to_ppm_analyzer_7", inputMap: { P_Total: "p__total" }, outputId: "yield" },
    { formulaId: "custom.cpk_to_ppm_analyzer_8", inputMap: { Cpk: "hedef_cpk" }, outputId: "sigma__short_term" },
  ],
  reportTemplate: {
    title: "CPK TO PPM Report",
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
