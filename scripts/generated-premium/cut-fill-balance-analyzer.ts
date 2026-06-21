/**
 * Kesme-Dolgu Denge — Premium Calculator Schema
 * Auto-generated from user-provided formulas
 */
import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";

export const CUTFILLBALANCE_SCHEMA: PremiumCalculatorSchema = {
  id: "cut-fill-balance-analyzer",
  legacyPaidSlug: "cut-fill-balance-analyzer",
  name: "Kesme-Dolgu Denge",
  sectorSlug: "general",
  category: "cost",
  painStatement: "Kesme-Dolgu Denge — premium analysis tool.",
  inputs: [
    { id: "enkesit_alanlari_kesimdolgu", label: "Enkesit Alanları Kesim/Dolgu", type: "array", required: true },
    { id: "istasyon_mesafeleri", label: "İstasyon Mesafeleri", type: "array", required: true },
    { id: "sismekuculme_faktorleri", label: "Şişme/Küçülme Faktörleri", type: "number", required: true },
    { id: "nakliye_birim_fiyati", label: "Nakliye Birim Fiyatı", type: "currency/m3-km", required: true },
    { id: "oduncdepo_alani_mesafesi", label: "Ödünç/Depo Alanı Mesafesi", type: "number", required: true },
  ],
  outputs: [
    { id: "volume__cut", label: "Volume_ Cut", unit: "currency", format: "currency" },
    { id: "volume__fill", label: "Volume_ Fill", unit: "currency", format: "currency" },
    { id: "shrinkage_factor", label: "Shrinkage Factor", unit: "currency", format: "currency" },
    { id: "swell_factor", label: "Swell Factor", unit: "currency", format: "currency" },
    { id: "net_balance", label: "Net Balance", unit: "currency", format: "currency" },
    { id: "borrow_required", label: "Borrow Required", unit: "currency", format: "currency" },
    { id: "waste_required", label: "Waste Required", unit: "currency", format: "currency" },
    { id: "haul_cost", label: "Haul Cost", unit: "currency", format: "currency" },
  ],
  thresholds: [],
  formulaPipeline: [
    { formulaId: "custom.kesme_dolgu_denge_analyzer_0", inputMap: { Area_Cut_i: "area__cut_i", Distance_i: "distance_i" }, outputId: "volume__cut" },
    { formulaId: "custom.kesme_dolgu_denge_analyzer_1", inputMap: { Area_Fill_i: "area__fill_i", Distance_i: "distance_i" }, outputId: "volume__fill" },
    { formulaId: "custom.kesme_dolgu_denge_analyzer_2", inputMap: { CompactedVolume: "compacted_volume", LooseVolume: "loose_volume" }, outputId: "shrinkage_factor" },
    { formulaId: "custom.kesme_dolgu_denge_analyzer_3", inputMap: { LooseVolume: "loose_volume", BankVolume: "bank_volume" }, outputId: "swell_factor" },
    { formulaId: "custom.kesme_dolgu_denge_analyzer_4", inputMap: { Volume_Cut: "volume__cut", Volume_Fill: "volume__fill", ShrinkageFactor: "shrinkage_factor" }, outputId: "net_balance" },
    { formulaId: "custom.kesme_dolgu_denge_analyzer_5", inputMap: { Volume_Fill: "volume__fill", ShrinkageFactor: "shrinkage_factor", Volume_Cut: "volume__cut" }, outputId: "borrow_required" },
    { formulaId: "custom.kesme_dolgu_denge_analyzer_6", inputMap: { Volume_Cut: "volume__cut", Volume_Fill: "volume__fill", ShrinkageFactor: "shrinkage_factor" }, outputId: "waste_required" },
    { formulaId: "custom.kesme_dolgu_denge_analyzer_7", inputMap: { Volume_i: "volume_i", Distance_i: "distance_i", UnitHaulCost: "unit_haul_cost" }, outputId: "haul_cost" },
  ],
  reportTemplate: {
    title: "Kesme-Dolgu Denge Report",
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
