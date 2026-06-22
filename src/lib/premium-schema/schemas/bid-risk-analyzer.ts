/**
 * Tool #23 — Teklif Risk
 */
import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";
export const BID_RISK_SCHEMA: PremiumCalculatorSchema = {
  id: "bid-risk-analyzer", legacyPaidSlug: "bid-risk-analyzer",
  name: "Teklif Risk Analizi", name_i18n: {"en":"Bid Risk Analysis","tr":"Teklif Risk Analizi"}, sectorSlug: "construction", category: "cost",
  painStatement: "İnşaat tekliflerinde belirsizlik ve risk payı hesaplanmazsa ya düşük kârlı ya da kaybeden teklifler verilir.", painStatement_i18n: {"en":"Without calculating uncertainty and risk premium in construction bids, you submit either low-profit or losing bids.","tr":"İnşaat tekliflerinde belirsizlik ve risk payı hesaplanmazsa ya düşük kârlı ya da kaybeden teklifler verilir."},
  inputs: [
    { id: "baseEstimate", label: "Baz Tahmin", label_i18n: {"en":"Base Estimate","tr":"Baz Tahmin"}, type: "number", unit: "USD", required: true, smartDefault: 200000, validation: { min: 1 }, helper: "", expertMeaning: "Base cost estimate", expertMeaning_i18n: {"en":"Base cost estimate","tr":"Baz maliyet tahmini"} },
    { id: "materialUncertainty", label: "Malzeme Belirsizlik Oranı", label_i18n: {"en":"Material Uncertainty Rate","tr":"Malzeme Belirsizlik Oranı"}, type: "number", unit: "%", required: true, smartDefault: 10, validation: { min: 0, max: 100 }, helper: "", expertMeaning: "Material price uncertainty", expertMeaning_i18n: {"en":"Material price uncertainty","tr":"Malzeme fiyat belirsizliği"} },
    { id: "laborUncertainty", label: "İşçilik Belirsizlik Oranı", label_i18n: {"en":"Labor Uncertainty Rate","tr":"İşçilik Belirsizlik Oranı"}, type: "number", unit: "%", required: true, smartDefault: 8, validation: { min: 0, max: 100 }, helper: "", expertMeaning: "Labor uncertainty", expertMeaning_i18n: {"en":"Labor uncertainty","tr":"İşçilik belirsizliği"} },
    { id: "overheadContingency", label: "Genel Gider Risk Oranı", label_i18n: {"en":"Overhead Risk Rate","tr":"Genel Gider Risk Oranı"}, type: "number", unit: "%", required: false, smartDefault: 5, validation: { min: 0, max: 100 }, helper: "", expertMeaning: "Overhead contingency rate", expertMeaning_i18n: {"en":"Overhead contingency rate","tr":"Genel gider risk oranı"} },
    { id: "numCompetitors", label: "Rakip Sayısı", label_i18n: {"en":"Number of Competitors","tr":"Rakip Sayısı"}, type: "number", unit: "adet", required: false, smartDefault: 5, validation: { min: 0 }, helper: "", expertMeaning: "Number of competing bidders", expertMeaning_i18n: {"en":"Number of competing bidders","tr":"Rakip teklif veren sayısı"} },
    { id: "yourBidPrice", label: "Sizin Teklif Fiyatınız", label_i18n: {"en":"Your Bid Price","tr":"Sizin Teklif Fiyatınız"}, type: "number", unit: "USD", required: false, smartDefault: 240000, validation: { min: 0 }, helper: "", expertMeaning: "Your bid price", expertMeaning_i18n: {"en":"Your bid price","tr":"Teklif fiyatınız"} },
  ],
  outputs: [
    { id: "baseEstimateOut", label: "Baz Tahmin", label_i18n: {"en":"Base Estimate","tr":"Baz Tahmin"}, unit: "USD", format: "currency" },
    { id: "contingencyTotal", label: "Toplam Risk Payı", label_i18n: {"en":"Toplam Risk Pay","tr":"Toplam Risk Payı"}, unit: "USD", format: "currency" },
    { id: "winProbability", label: "Kazanma Olasılığı", label_i18n: {"en":"Kazanma Olaslg","tr":"Kazanma Olasılığı"}, unit: "%", format: "percentage" },
    { id: "expectedValueBid", label: "Beklenen Değer", label_i18n: {"en":"Beklenen Deger","tr":"Beklenen Değer"}, unit: "USD", format: "currency", isBigNumber: true },
  ],
  thresholds: [{ fieldId: "winProbability", warning: 40, critical: 20, direction: "lower_is_bad", warningMessage: "Kazanma olasılığı < %40 — teklif stratejisi gözden geçirilmeli.", warningMessage_i18n: {"en":"Win probability < 40% — review bid strategy.","tr":"Kazanma olasılığı < %40 — teklif stratejisi gözden geçirilmeli."}, criticalMessage: "Kazanma olasılığı < %20 — teklif vermek riskli.", criticalMessage_i18n: {"en":"Win probability < 20% — bidding is risky.","tr":"Kazanma olasılığı < %20 — teklif vermek riskli."} }],
  formulaPipeline: [
    { formulaId: "cost.base_estimate", inputMap: { baseEstimate: "baseEstimate" }, outputId: "baseEstimateOut" },
    { formulaId: "cost.contingency_total", inputMap: { baseEstimate: "baseEstimate", materialUncertainty: "materialUncertainty", laborUncertainty: "laborUncertainty", overheadContingency: "overheadContingency" }, outputId: "contingencyTotal" },
    { formulaId: "measurement.win_probability", inputMap: { yourBidPrice: "yourBidPrice", baseEstimate: "baseEstimate", numCompetitors: "numCompetitors" }, outputId: "winProbability" },
    { formulaId: "cost.expected_value_bid", inputMap: { yourBidPrice: "yourBidPrice", contingencyTotal: "contingencyTotal", winProbability: "winProbability" }, outputId: "expectedValueBid" },
  ],
  reportTemplate: { title: "Bid Risk Analysis Report", title_i18n: {"en":"Bid Risk Analysis Report","tr":"Bid Risk Analysis Report"}, sections: ["executive_summary", "thresholds", "action_plan", "assumptions"], exportFormats: ["pdf", "excel"] },
  assumptions: { hiddenLossMultiplier: 1.15, volatilityPercent: 12, targetMarginPercent: 20, assumptionNotes: ["Contingency = weighted uncertainty rates.", "Win probability based on competitor count.", "Expected value = Price × Probability."],assumptionNotes_i18n:[{"en":"Contingency = weighted uncertainty rates.","tr":"Contingency = weighted uncertainty rates."},{"en":"Win probability based on competitor count.","tr":"Win probability based on competitor count."},{"en":"Expected value = Price × Probability.","tr":"Expected value = Price × Probability."}]},
};
