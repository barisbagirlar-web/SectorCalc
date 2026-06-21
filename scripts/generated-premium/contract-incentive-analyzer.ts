/**
 * Sözleşme Teşvik — Premium Calculator Schema
 * Auto-generated from user-provided formulas
 */
import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";

export const CONTRACTINCENTIVE_SCHEMA: PremiumCalculatorSchema = {
  id: "contract-incentive-analyzer",
  legacyPaidSlug: "contract-incentive-analyzer",
  name: "Sözleşme Teşvik",
  sectorSlug: "general",
  category: "cost",
  painStatement: "Sözleşme Teşvik — premium analysis tool.",
  inputs: [
    { id: "hedef_maliyet", label: "Hedef Maliyet", type: "number", required: true },
    { id: "hedef_kar", label: "Hedef Kar", type: "number", required: true },
    { id: "paylasim_orani", label: "Paylaşım Oranı", type: "array", required: true },
    { id: "gerceklesen_maliyet", label: "Gerçekleşen Maliyet", type: "number", required: true },
    { id: "metrik_agirliklariskorlari", label: "Metrik Ağırlıkları/Skorları", type: "matrix", required: true },
    { id: "minmax_kar_carpanlari", label: "Min/Max Kar Çarpanları", type: "number", required: true },
  ],
  outputs: [
    { id: "target_cost", label: "Target Cost", unit: "currency", format: "currency" },
    { id: "target_fee", label: "Target Fee", unit: "currency", format: "currency" },
    { id: "share_ratio", label: "Share Ratio", unit: "currency", format: "currency" },
    { id: "actual_fee", label: "Actual Fee", unit: "currency", format: "currency" },
    { id: "max_fee", label: "Max Fee", unit: "currency", format: "currency" },
    { id: "min_fee", label: "Min Fee", unit: "currency", format: "currency" },
    { id: "final_fee", label: "Final Fee", unit: "currency", format: "currency" },
    { id: "final_price", label: "Final Price", unit: "currency", format: "currency" },
    { id: "performance_bonus", label: "Performance Bonus", unit: "currency", format: "currency" },
  ],
  thresholds: [],
  formulaPipeline: [
    { formulaId: "custom.sozlesme_tesvik_analyzer_0", inputMap: { BaselineEstimate: "baseline_estimate" }, outputId: "target_cost" },
    { formulaId: "custom.sozlesme_tesvik_analyzer_1", inputMap: { TargetCost: "target_cost", TargetFeePct: "target_fee_pct" }, outputId: "target_fee" },
    { formulaId: "custom.sozlesme_tesvik_analyzer_2", inputMap: { OverrunShare: "overrun_share", UnderrunShare: "underrun_share" }, outputId: "share_ratio" },
    { formulaId: "custom.sozlesme_tesvik_analyzer_3", inputMap: { TargetFee: "target_fee", TargetCost: "target_cost", ActualCost: "actual_cost", ContractorSharePct: "contractor_share_pct" }, outputId: "actual_fee" },
    { formulaId: "custom.sozlesme_tesvik_analyzer_4", inputMap: { TargetFee: "target_fee", MaxFeeMultiplier: "max_fee_multiplier" }, outputId: "max_fee" },
    { formulaId: "custom.sozlesme_tesvik_analyzer_5", inputMap: { TargetFee: "target_fee", MinFeeMultiplier: "min_fee_multiplier" }, outputId: "min_fee" },
    { formulaId: "custom.sozlesme_tesvik_analyzer_6", inputMap: { ActualFee: "actual_fee", MinFee: "min_fee", MaxFee: "max_fee" }, outputId: "final_fee" },
    { formulaId: "custom.sozlesme_tesvik_analyzer_7", inputMap: { ActualCost: "actual_cost", FinalFee: "final_fee" }, outputId: "final_price" },
    { formulaId: "custom.sozlesme_tesvik_analyzer_8", inputMap: { MetricWeight_i: "metric_weight_i", MetricScore_i: "metric_score_i", BonusPool: "bonus_pool" }, outputId: "performance_bonus" },
  ],
  reportTemplate: {
    title: "Sözleşme Teşvik Report",
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
