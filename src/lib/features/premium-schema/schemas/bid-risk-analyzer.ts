/**
 * Tool #23 — Teklif Risk
 */
import type { PremiumCalculatorSchema } from "@/lib/features/premium-schema/premium-calculator-schema";
export const BID_RISK_SCHEMA: PremiumCalculatorSchema = {
  id: "bid-risk-analyzer", legacyPaidSlug: "bid-risk-analyzer",
  name: "Teklif Risk Analizi", name_i18n: {"en":"Bid Risk Analysis"}, sectorSlug: "construction", category: "cost",
  painStatement: "İnşaat tekliflerinde belirsizlik ve risk payı hesaplanmazsa ya düşük kârlı ya da kaybeden teklifler verilir.", painStatement_i18n: {"en":"Without calculating uncertainty and risk premium in construction bids, you submit either low-profit or losing bids."},
  inputs: [
    { id: "baseEstimate", label: "Baz Tahmin", label_i18n: {"en":"Base Estimate"}, type: "number", unit: "USD", required: true, smartDefault: 200000, validation: { min: 1 }, helper: "", expertMeaning: "Base cost estimate", expertMeaning_i18n: {"en":"Base cost estimate"} },
    { id: "materialUncertainty", label: "Malzeme Belirsizlik Oranı", label_i18n: {"en":"Material Uncertainty Rate"}, type: "number", unit: "%", required: true, smartDefault: 10, validation: { min: 0, max: 100 }, helper: "", expertMeaning: "Material price uncertainty", expertMeaning_i18n: {"en":"Material price uncertainty"} },
    { id: "laborUncertainty", label: "İşçilik Belirsizlik Oranı", label_i18n: {"en":"Labor Uncertainty Rate"}, type: "number", unit: "%", required: true, smartDefault: 8, validation: { min: 0, max: 100 }, helper: "", expertMeaning: "Labor uncertainty", expertMeaning_i18n: {"en":"Labor uncertainty"} },
    { id: "overheadContingency", label: "Genel Gider Risk Oranı", label_i18n: {"en":"Overhead Risk Rate"}, type: "number", unit: "%", required: false, smartDefault: 5, validation: { min: 0, max: 100 }, helper: "", expertMeaning: "Overhead contingency rate", expertMeaning_i18n: {"en":"Overhead contingency rate"} },
    { id: "numCompetitors", label: "Rakip Sayısı", label_i18n: {"en":"Number of Competitors"}, type: "number", unit: "adet", required: false, smartDefault: 5, validation: { min: 0 }, helper: "", expertMeaning: "Number of competing bidders", expertMeaning_i18n: {"en":"Number of competing bidders"} },
    { id: "yourBidPrice", label: "Sizin Teklif Fiyatınız", label_i18n: {"en":"Your Bid Price"}, type: "number", unit: "USD", required: false, smartDefault: 240000, validation: { min: 0 }, helper: "", expertMeaning: "Your bid price", expertMeaning_i18n: {"en":"Your bid price"} },
  ],
  outputs: [
    { id: "baseEstimateOut", label: "Baz Tahmin", label_i18n: {"en":"Base Estimate"}, unit: "USD", format: "currency" },
    { id: "contingencyTotal", label: "Toplam Risk Payı", label_i18n: {"en":"Toplam Risk Pay"}, unit: "USD", format: "currency" },
    { id: "winProbability", label: "Kazanma Olasılığı", label_i18n: {"en":"Kazanma Olaslg"}, unit: "%", format: "percentage" },
    { id: "expectedValueBid", label: "Beklenen Değer", label_i18n: {"en":"Beklenen Deger"}, unit: "USD", format: "currency", isBigNumber: true },
  ],
  thresholds: [{ fieldId: "winProbability", warning: 40, critical: 20, direction: "lower_is_bad", warningMessage: "Kazanma olasılığı < %40 — teklif stratejisi gözden geçirilmeli.", warningMessage_i18n: {"en":"Win probability < 40% — review bid strategy."}, criticalMessage: "Kazanma olasılığı < %20 — teklif vermek riskli.", criticalMessage_i18n: {"en":"Win probability < 20% — bidding is risky."} }],
  formulaPipeline: [
    { formulaId: "cost.base_estimate", inputMap: {
        directCost: "baseEstimate"
      ,
        indirectCost: "indirectCost",
        profitMargin: "profitMargin"}, outputId: "baseEstimateOut" },
    { formulaId: "cost.contingency_total", inputMap: {
        baseEstimate: "baseEstimate",
        contingencyPct: "materialUncertainty",
        laborUncertainty: "laborUncertainty",
        overheadContingency: "overheadContingency"
      }, outputId: "contingencyTotal" },
    { formulaId: "measurement.win_probability", inputMap: {
        competitiveScore: "yourBidPrice",
        maxScore: "baseEstimate",
        numCompetitors: "numCompetitors"
      }, outputId: "winProbability" },
    { formulaId: "cost.expected_value_bid", inputMap: {
        contingencyTotal: "contingencyTotal",
        winProbability: "winProbability",
        baseEstimate: "yourBidPrice"
      }, outputId: "expectedValueBid" },
  ],
  reportTemplate: { title: "Bid Risk Analysis Report", title_i18n: {"en":"Bid Risk Analysis Report"}, sections: ["executive_summary", "thresholds", "action_plan", "assumptions"], exportFormats: ["pdf", "excel"] },
  assumptions: { hiddenLossMultiplier: 1.15, volatilityPercent: 12, targetMarginPercent: 20, assumptionNotes: ["Contingency = weighted uncertainty rates.", "Win probability based on competitor count.", "Expected value = Price × Probability."],assumptionNotes_i18n:[{"en":"Contingency = weighted uncertainty rates."},{"en":"Win probability based on competitor count."},{"en":"Expected value = Price × Probability."}]},
};
