/**
 * Tool #23 — Teklif Risk
 */
import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";
export const BID_RISK_SCHEMA: PremiumCalculatorSchema = {
  id: "bid-risk-analyzer", legacyPaidSlug: "bid-risk-analyzer",
  name: "Teklif Risk Analizi", sectorSlug: "construction", category: "cost",
  painStatement: "İnşaat tekliflerinde belirsizlik ve risk payı hesaplanmazsa ya düşük kârlı ya da kaybeden teklifler verilir.",
  inputs: [
    { id: "baseEstimate", label: "Baz Tahmin", type: "number", unit: "USD", required: true, smartDefault: 200000, validation: { min: 1 }, helper: "", expertMeaning: "Base cost estimate" },
    { id: "materialUncertainty", label: "Malzeme Belirsizlik Oranı", type: "number", unit: "%", required: true, smartDefault: 10, validation: { min: 0, max: 100 }, helper: "", expertMeaning: "Material price uncertainty" },
    { id: "laborUncertainty", label: "İşçilik Belirsizlik Oranı", type: "number", unit: "%", required: true, smartDefault: 8, validation: { min: 0, max: 100 }, helper: "", expertMeaning: "Labor uncertainty" },
    { id: "overheadContingency", label: "Genel Gider Risk Oranı", type: "number", unit: "%", required: false, smartDefault: 5, validation: { min: 0, max: 100 }, helper: "", expertMeaning: "Overhead contingency rate" },
    { id: "numCompetitors", label: "Rakip Sayısı", type: "number", unit: "adet", required: false, smartDefault: 5, validation: { min: 0 }, helper: "", expertMeaning: "Number of competing bidders" },
    { id: "yourBidPrice", label: "Sizin Teklif Fiyatınız", type: "number", unit: "USD", required: false, smartDefault: 240000, validation: { min: 0 }, helper: "", expertMeaning: "Your bid price" },
  ],
  outputs: [
    { id: "baseEstimateOut", label: "Baz Tahmin", unit: "USD", format: "currency" },
    { id: "contingencyTotal", label: "Toplam Risk Payı", unit: "USD", format: "currency" },
    { id: "winProbability", label: "Kazanma Olasılığı", unit: "%", format: "percentage" },
    { id: "expectedValueBid", label: "Beklenen Değer", unit: "USD", format: "currency", isBigNumber: true },
  ],
  thresholds: [{ fieldId: "winProbability", warning: 40, critical: 20, direction: "lower_is_bad", warningMessage: "Kazanma olasılığı < %40 — teklif stratejisi gözden geçirilmeli.", criticalMessage: "Kazanma olasılığı < %20 — teklif vermek riskli." }],
  formulaPipeline: [
    { formulaId: "cost.base_estimate", inputMap: { baseEstimate: "baseEstimate" }, outputId: "baseEstimateOut" },
    { formulaId: "cost.contingency_total", inputMap: { baseEstimate: "baseEstimate", materialUncertainty: "materialUncertainty", laborUncertainty: "laborUncertainty", overheadContingency: "overheadContingency" }, outputId: "contingencyTotal" },
    { formulaId: "measurement.win_probability", inputMap: { yourBidPrice: "yourBidPrice", baseEstimate: "baseEstimate", numCompetitors: "numCompetitors" }, outputId: "winProbability" },
    { formulaId: "cost.expected_value_bid", inputMap: { yourBidPrice: "yourBidPrice", contingencyTotal: "contingencyTotal", winProbability: "winProbability" }, outputId: "expectedValueBid" },
  ],
  reportTemplate: { title: "Bid Risk Analysis Report", sections: ["executive_summary", "thresholds", "action_plan", "assumptions"], exportFormats: ["pdf", "excel"] },
  assumptions: { hiddenLossMultiplier: 1.15, volatilityPercent: 12, targetMarginPercent: 20, assumptionNotes: ["Contingency = weighted uncertainty rates.", "Win probability based on competitor count.", "Expected value = Price × Probability."] },
};
