/**
 * HAFİFLİK MALİYET TASARRUFU — Premium Calculator Schema
 * Auto-generated from user-provided formulas
 */
import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";

export const LIGHTWEIGHTCOSTSAVINGS_SCHEMA: PremiumCalculatorSchema = {
  id: "lightweight-cost-savings-analyzer",
  legacyPaidSlug: "lightweight-cost-savings-analyzer",
  name: "HAFİFLİK MALİYET TASARRUFU",
  sectorSlug: "general",
  category: "cost",
  painStatement: "HAFİFLİK MALİYET TASARRUFU — premium analysis tool.",
  inputs: [
    { id: "orijinalyeni_agirlik", label: "Orijinal/Yeni Ağırlık", type: "number", required: true },
    { id: "malzeme", label: "Malzeme", type: "text", required: true },
    { id: "yeni_kg_fiyat", label: "Yeni kg Fiyat", type: "number", required: true },
    { id: "kalip_farki", label: "Kalıp Farkı", type: "number", required: true },
    { id: "omursaat", label: "Ömür/Saat", type: "number", required: true },
    { id: "yakit", label: "Yakıt", type: "number", required: true },
  ],
  outputs: [
    { id: "weight_red", label: "Weight Red", unit: "currency", format: "currency" },
    { id: "fuel_sav__auto", label: "Fuel Sav_ Auto", unit: "currency", format: "currency" },
    { id: "fuel_sav__aero", label: "Fuel Sav_ Aero", unit: "currency", format: "currency" },
    { id: "payload_gain", label: "Payload Gain", unit: "currency", format: "currency" },
    { id: "mat_prem", label: "Mat Prem", unit: "currency", format: "currency" },
    { id: "tool_delta", label: "Tool Delta", unit: "currency", format: "currency" },
    { id: "net_sav", label: "Net Sav", unit: "currency", format: "currency" },
  ],
  thresholds: [],
  formulaPipeline: [
    { formulaId: "custom.hafiflik_maliyet_tasarrufu_analyzer_0", inputMap: { Mass_Orig: "mass__orig", Mass_LW: "mass__l_w" }, outputId: "weight_red" },
    { formulaId: "custom.hafiflik_maliyet_tasarrufu_analyzer_1", inputMap: { WeightRed: "weight_red", FuelFactor: "fuel_factor", Dist: "dist", FuelPrice: "fuel_price" }, outputId: "fuel_sav__auto" },
    { formulaId: "custom.hafiflik_maliyet_tasarrufu_analyzer_2", inputMap: { WeightRed: "weight_red", BurnFactor: "burn_factor", Hours: "hours", JetPrice: "jet_price" }, outputId: "fuel_sav__aero" },
    { formulaId: "custom.hafiflik_maliyet_tasarrufu_analyzer_3", inputMap: { WeightRed: "weight_red", RevPerKg: "rev_per_kg" }, outputId: "payload_gain" },
    { formulaId: "custom.hafiflik_maliyet_tasarrufu_analyzer_4", inputMap: { Cost_LW: "cost__l_w", Cost_Orig: "cost__orig", Vol: "vol" }, outputId: "mat_prem" },
    { formulaId: "custom.hafiflik_maliyet_tasarrufu_analyzer_5", inputMap: { Tool_LW: "tool__l_w", Tool_Orig: "tool__orig" }, outputId: "tool_delta" },
    { formulaId: "custom.hafiflik_maliyet_tasarrufu_analyzer_6", inputMap: { FuelSav: "fuel_sav", Payload: "payload", Life: "life", MatPrem: "mat_prem", ToolDelta: "tool_delta" }, outputId: "net_sav" },
  ],
  reportTemplate: {
    title: "HAFİFLİK MALİYET TASARRUFU Report",
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
