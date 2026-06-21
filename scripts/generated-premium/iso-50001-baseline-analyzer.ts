/**
 * ISO 50001 BASELINE — Premium Calculator Schema
 * Auto-generated from user-provided formulas
 */
import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";

export const ISO50001BASELINE_SCHEMA: PremiumCalculatorSchema = {
  id: "iso-50001-baseline-analyzer",
  legacyPaidSlug: "iso-50001-baseline-analyzer",
  name: "ISO 50001 BASELINE",
  sectorSlug: "general",
  category: "cost",
  painStatement: "ISO 50001 BASELINE — premium analysis tool.",
  inputs: [
    { id: "tuketim", label: "Tüketim", type: "array", required: true },
    { id: "uretim", label: "Üretim", type: "array", required: true },
    { id: "hddcdd", label: "HDD/CDD", type: "array", required: true },
    { id: "rkare", label: "R-Kare", type: "number", required: true },
    { id: "baz_yil", label: "Baz Yıl", type: "number", required: true },
    { id: "azaltim", label: "Azaltım", type: "number", required: true },
    { id: "periyot", label: "Periyot", type: "text", required: true },
  ],
  outputs: [
    { id: "en_p_i", label: "En P I", unit: "currency", format: "currency" },
    { id: "baseline", label: "Baseline", unit: "currency", format: "currency" },
    { id: "cusum_t", label: "Cusum_t", unit: "currency", format: "currency" },
    { id: "cusum__cum", label: "Cusum_ Cum", unit: "currency", format: "currency" },
    { id: "savings", label: "Savings", unit: "currency", format: "currency" },
    { id: "norm", label: "Norm", unit: "currency", format: "currency" },
    { id: "sig", label: "Sig", unit: "currency", format: "currency" },
    { id: "target", label: "Target", unit: "currency", format: "currency" },
  ],
  thresholds: [],
  formulaPipeline: [
    { formulaId: "custom.iso_50001_baseline_analyzer_0", inputMap: { Energy: "energy", Volume: "volume" }, outputId: "en_p_i" },
    { formulaId: "custom.iso_50001_baseline_analyzer_1", inputMap: { Intercept: "intercept", Slope1: "slope1", Prod: "prod", Slope2: "slope2", DD: "d_d" }, outputId: "baseline" },
    { formulaId: "custom.iso_50001_baseline_analyzer_2", inputMap: { Actual: "actual", Predicted: "predicted" }, outputId: "cusum_t" },
    { formulaId: "custom.iso_50001_baseline_analyzer_3", inputMap: { Cusum_t: "cusum_t" }, outputId: "cusum__cum" },
    { formulaId: "custom.iso_50001_baseline_analyzer_4", inputMap: { Predicted: "predicted", Actual: "actual" }, outputId: "savings" },
    { formulaId: "custom.iso_50001_baseline_analyzer_5", inputMap: { DD_Curr: "d_d__curr", DD_Hist: "d_d__hist" }, outputId: "norm" },
    { formulaId: "custom.iso_50001_baseline_analyzer_6", inputMap: { R2: "r2" }, outputId: "sig" },
    { formulaId: "custom.iso_50001_baseline_analyzer_7", inputMap: { Baseline: "baseline", RedTarget: "red_target" }, outputId: "target" },
  ],
  reportTemplate: {
    title: "ISO 50001 BASELINE Report",
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
