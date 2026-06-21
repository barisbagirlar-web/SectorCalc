/**
 * Taguchi kalite kayıp Fonksiyon — Premium Calculator Schema
 * Auto-generated from user-provided formulas
 */
import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";

export const TAGUCHIQUALITYLOSS_SCHEMA: PremiumCalculatorSchema = {
  id: "taguchi-quality-loss-analyzer",
  legacyPaidSlug: "taguchi-quality-loss-analyzer",
  name: "Taguchi kalite kayıp Fonksiyon",
  sectorSlug: "general",
  category: "cost",
  painStatement: "Taguchi kalite kayıp Fonksiyon — premium analysis tool.",
  inputs: [
    { id: "hedef_deger", label: "Hedef Değer", type: "number", required: true },
    { id: "tolerans_siniri", label: "Tolerans Sınırı", type: "number", required: true },
    { id: "toleransta_maliyet", label: "Toleransta Maliyet", type: "number", required: true },
    { id: "gerceklesen_ortalama", label: "Gerçekleşen Ortalama", type: "number", required: true },
    { id: "varyans", label: "Varyans", type: "number", required: true },
    { id: "yillik_uretim", label: "Yıllık Üretim", type: "number", required: true },
    { id: "sn_orani_tipi", label: "S/N Oranı Tipi", type: "text", required: true },
  ],
  outputs: [
    { id: "loss_per_unit", label: "Loss Per Unit", unit: "currency", format: "currency" },
    { id: "k", label: "k", unit: "currency", format: "currency" },
    { id: "average_loss", label: "Average Loss", unit: "currency", format: "currency" },
    { id: "total_annual_loss", label: "Total Annual Loss", unit: "currency", format: "currency" },
    { id: "signal_to_noise__larger_better", label: "Signal To Noise_ Larger Better", unit: "currency", format: "currency" },
    { id: "signal_to_noise__smaller_better", label: "Signal To Noise_ Smaller Better", unit: "currency", format: "currency" },
    { id: "quality_improvement_savings", label: "Quality Improvement Savings", unit: "currency", format: "currency" },
  ],
  thresholds: [],
  formulaPipeline: [
    { formulaId: "custom.taguchi_kalite_kayip_fonksiyon_analyzer_0", inputMap: { ActualValue: "actual_value", TargetValue: "target_value" }, outputId: "loss_per_unit" },
    { formulaId: "custom.taguchi_kalite_kayip_fonksiyon_analyzer_1", inputMap: { CostAtTolerance: "cost_at_tolerance", Tolerance: "tolerance" }, outputId: "k" },
    { formulaId: "custom.taguchi_kalite_kayip_fonksiyon_analyzer_2", inputMap: { Variance: "variance", Mean: "mean", Target: "target" }, outputId: "average_loss" },
    { formulaId: "custom.taguchi_kalite_kayip_fonksiyon_analyzer_3", inputMap: { AverageLoss: "average_loss", AnnualProduction: "annual_production" }, outputId: "total_annual_loss" },
    { formulaId: "custom.taguchi_kalite_kayip_fonksiyon_analyzer_4", inputMap: { y_i: "y_i" }, outputId: "signal_to_noise__larger_better" },
    { formulaId: "custom.taguchi_kalite_kayip_fonksiyon_analyzer_5", inputMap: { y_i: "y_i" }, outputId: "signal_to_noise__smaller_better" },
    { formulaId: "custom.taguchi_kalite_kayip_fonksiyon_analyzer_6", inputMap: { OldAverageLoss: "old_average_loss", NewAverageLoss: "new_average_loss", AnnualProduction: "annual_production" }, outputId: "quality_improvement_savings" },
  ],
  reportTemplate: {
    title: "Taguchi kalite kayıp Fonksiyon Report",
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
