/**
 * Tedarikçi Döviz Kuru Riski — Premium Calculator Schema
 * Auto-generated from user-provided formulas
 */
import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";

export const SUPPLIERCURRENCYRISK_SCHEMA: PremiumCalculatorSchema = {
  id: "supplier-currency-risk-analyzer",
  legacyPaidSlug: "supplier-currency-risk-analyzer",
  name: "Tedarikçi Döviz Kuru Riski",
  sectorSlug: "general",
  category: "cost",
  painStatement: "Tedarikçi Döviz Kuru Riski — premium analysis tool.",
  inputs: [
    { id: "doviz_cinsi_sozlesme_bedeli", label: "Döviz Cinsi Sözleşme Bedeli", type: "number", required: true },
    { id: "hedge_edilmeyen_oran", label: "Hedge Edilmeyen Oran", type: "number", required: true },
    { id: "spotforward_kur", label: "Spot/Forward Kur", type: "number", required: true },
    { id: "volatilite", label: "Volatilite", type: "number", required: true },
    { id: "zaman_ufku_gun", label: "Zaman Ufku gün", type: "number", required: true },
    { id: "zskoru", label: "Z-Skoru", type: "number", required: true },
    { id: "doviz_ayarlama_klozu_faktoru", label: "Döviz Ayarlama Klozu Faktörü", type: "number", required: true },
  ],
  outputs: [
    { id: "exposure", label: "Exposure", unit: "currency", format: "currency" },
    { id: "expected_loss", label: "Expected Loss", unit: "currency", format: "currency" },
    { id: "va_r", label: "Va R", unit: "currency", format: "currency" },
    { id: "hedging_cost", label: "Hedging Cost", unit: "currency", format: "currency" },
    { id: "net_risk_cost", label: "Net Risk Cost", unit: "currency", format: "currency" },
    { id: "currency_clause_savings", label: "Currency Clause Savings", unit: "currency", format: "currency" },
  ],
  thresholds: [],
  formulaPipeline: [
    { formulaId: "custom.tedarikci_doviz_kuru_riski_analyzer_0", inputMap: { ContractValue_FC: "contract_value__f_c", UnhedgedPct: "unhedged_pct" }, outputId: "exposure" },
    { formulaId: "custom.tedarikci_doviz_kuru_riski_analyzer_1", inputMap: { Exposure: "exposure", ForwardRate: "forward_rate", ExpectedSpotRate: "expected_spot_rate" }, outputId: "expected_loss" },
    { formulaId: "custom.tedarikci_doviz_kuru_riski_analyzer_2", inputMap: { Exposure: "exposure", Volatility: "volatility", Z_Score: "z__score", TimeHorizon: "time_horizon" }, outputId: "va_r" },
    { formulaId: "custom.tedarikci_doviz_kuru_riski_analyzer_3", inputMap: { Exposure: "exposure", ForwardRate: "forward_rate", SpotRate: "spot_rate" }, outputId: "hedging_cost" },
    { formulaId: "custom.tedarikci_doviz_kuru_riski_analyzer_4", inputMap: { ExpectedLoss: "expected_loss", HedgingCost: "hedging_cost" }, outputId: "net_risk_cost" },
    { formulaId: "custom.tedarikci_doviz_kuru_riski_analyzer_5", inputMap: { ContractHasAdjustment: "contract_has_adjustment", Exposure: "exposure", AdjustmentFactor: "adjustment_factor" }, outputId: "currency_clause_savings" },
  ],
  reportTemplate: {
    title: "Tedarikçi Döviz Kuru Riski Report",
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
