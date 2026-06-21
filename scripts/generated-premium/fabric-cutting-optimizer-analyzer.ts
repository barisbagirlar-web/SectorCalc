/**
 * Kumaş Kesim Optimize Edici — Premium Calculator Schema
 * Auto-generated from user-provided formulas
 */
import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";

export const FABRICCUTTINGOPTIMIZER_SCHEMA: PremiumCalculatorSchema = {
  id: "fabric-cutting-optimizer-analyzer",
  legacyPaidSlug: "fabric-cutting-optimizer-analyzer",
  name: "Kumaş Kesim Optimize Edici",
  sectorSlug: "general",
  category: "cost",
  painStatement: "Kumaş Kesim Optimize Edici — premium analysis tool.",
  inputs: [
    { id: "kumas_eni", label: "Kumaş Eni", type: "number", required: true },
    { id: "pastal_boyu", label: "Pastal Boyu", type: "number", required: true },
    { id: "fireendloss", label: "Fire/EndLoss", type: "number", required: true },
    { id: "parca_alanlari", label: "Parça Alanları", type: "array", required: true },
    { id: "pastal_verimi", label: "Pastal Verimi", type: "number", required: true },
    { id: "metretul_fiyati", label: "Metretül Fiyatı", type: "number", required: true },
    { id: "ortalama_bindirme_payi", label: "Ortalama Bindirme Payı", type: "number", required: true },
  ],
  outputs: [
    { id: "marker_efficiency", label: "Marker Efficiency", unit: "currency", format: "currency" },
    { id: "fabric_required", label: "Fabric Required", unit: "currency", format: "currency" },
    { id: "cost__fabric", label: "Cost_ Fabric", unit: "currency", format: "currency" },
    { id: "utilization__gain", label: "Utilization_ Gain", unit: "currency", format: "currency" },
    { id: "splicing_loss", label: "Splicing Loss", unit: "currency", format: "currency" },
    { id: "total_yardage", label: "Total Yardage", unit: "currency", format: "currency" },
  ],
  thresholds: [],
  formulaPipeline: [
    { formulaId: "custom.kumas_kesim_optimize_edici_analyzer_0", inputMap: { TotalPatternArea: "total_pattern_area", MarkerLength: "marker_length", FabricWidth: "fabric_width" }, outputId: "marker_efficiency" },
    { formulaId: "custom.kumas_kesim_optimize_edici_analyzer_1", inputMap: { TotalPatternArea: "total_pattern_area", MarkerEfficiency: "marker_efficiency", EndLossPct: "end_loss_pct" }, outputId: "fabric_required" },
    { formulaId: "custom.kumas_kesim_optimize_edici_analyzer_2", inputMap: { FabricRequired: "fabric_required", PricePerMeter: "price_per_meter" }, outputId: "cost__fabric" },
    { formulaId: "custom.kumas_kesim_optimize_edici_analyzer_3", inputMap: { NewEfficiency: "new_efficiency", OldEfficiency: "old_efficiency", FabricRequired: "fabric_required", PricePerMeter: "price_per_meter" }, outputId: "utilization__gain" },
    { formulaId: "custom.kumas_kesim_optimize_edici_analyzer_4", inputMap: { Splices: "splices", OverlapLength: "overlap_length", FabricWidth: "fabric_width" }, outputId: "splicing_loss" },
    { formulaId: "custom.kumas_kesim_optimize_edici_analyzer_5", inputMap: { MarkerLength: "marker_length", EndLoss: "end_loss", SplicingLoss: "splicing_loss" }, outputId: "total_yardage" },
  ],
  reportTemplate: {
    title: "Kumaş Kesim Optimize Edici Report",
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
