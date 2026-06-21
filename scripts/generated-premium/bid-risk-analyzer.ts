/**
 * Teklif Risk Analizörü — Premium Calculator Schema
 * Auto-generated from user-provided formulas
 */
import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";

export const BIDRISK_SCHEMA: PremiumCalculatorSchema = {
  id: "bid-risk-analyzer",
  legacyPaidSlug: "bid-risk-analyzer",
  name: "Teklif Risk Analizörü",
  sectorSlug: "general",
  category: "cost",
  painStatement: "Teklif Risk Analizörü — premium analysis tool.",
  inputs: [
    { id: "dogrudan_maliyetler", label: "Doğrudan Maliyetler", type: "number", required: true },
    { id: "overhead", label: "Overhead", type: "number", required: true },
    { id: "teklif_fiyati", label: "Teklif Fiyatı", type: "number", required: true },
    { id: "rakip_indeksi", label: "Rakip İndeksi", type: "number", required: true },
    { id: "tarihsel_kazanma_orani", label: "Tarihsel Kazanma Oranı", type: "number", required: true },
    { id: "risk_faktoru", label: "Risk Faktörü", type: "number", required: true },
    { id: "risk_primi", label: "Risk Primi", type: "number", required: true },
    { id: "hedef_marj", label: "Hedef Marj", type: "number", required: true },
  ],
  outputs: [
    { id: "base_estimate", label: "Base Estimate", unit: "currency", format: "currency" },
    { id: "contingency", label: "Contingency", unit: "currency", format: "currency" },
    { id: "expected_margin", label: "Expected Margin", unit: "currency", format: "currency" },
    { id: "win_probability", label: "Win Probability", unit: "currency", format: "currency" },
    { id: "expected_value", label: "Expected Value", unit: "currency", format: "currency" },
    { id: "risk_adjusted_bid", label: "Risk Adjusted Bid", unit: "currency", format: "currency" },
  ],
  thresholds: [],
  formulaPipeline: [
    { formulaId: "custom.teklif_risk_analizoru_analyzer_0", inputMap: { DirectCosts: "direct_costs", Overhead: "overhead" }, outputId: "base_estimate" },
    { formulaId: "custom.teklif_risk_analizoru_analyzer_1", inputMap: { BaseEstimate: "base_estimate", RiskFactor: "risk_factor" }, outputId: "contingency" },
    { formulaId: "custom.teklif_risk_analizoru_analyzer_2", inputMap: { BidPrice: "bid_price", BaseEstimate: "base_estimate", Contingency: "contingency" }, outputId: "expected_margin" },
    { formulaId: "custom.teklif_risk_analizoru_analyzer_3", inputMap: { BidPrice: "bid_price", CompetitorIndex: "competitor_index", HistoricalWinRate: "historical_win_rate" }, outputId: "win_probability" },
    { formulaId: "custom.teklif_risk_analizoru_analyzer_4", inputMap: { WinProbability: "win_probability", ExpectedMargin: "expected_margin", BidPrice: "bid_price" }, outputId: "expected_value" },
    { formulaId: "custom.teklif_risk_analizoru_analyzer_5", inputMap: { BaseEstimate: "base_estimate", TargetMargin: "target_margin", RiskPremium: "risk_premium" }, outputId: "risk_adjusted_bid" },
  ],
  reportTemplate: {
    title: "Teklif Risk Analizörü Report",
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
