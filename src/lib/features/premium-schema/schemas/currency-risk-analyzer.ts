import type { PremiumCalculatorSchema } from "@/lib/features/premium-schema/premium-calculator-schema";
export const CURRENCY_RISK_SCHEMA: PremiumCalculatorSchema = {
  id: "currency-risk-analyzer", legacyPaidSlug: "currency-risk-analyzer",
  name: "Currency Risk Analyzer", name_i18n: {"en":"Currency Risk Analyzer","tr":"Currency Risk Analyzer"}, sectorSlug: "financial-planning", category: "cost",
  painStatement: "Kur riski hedge edilmezse, döviz açık pozisyonu beklenmedik zararlara yol açar.", painStatement_i18n: {"en":"Kur riski hedge edilmezse, döviz açık pozisyonu beklenmedik zararlara yol açar.","tr":"Kur riski hedge edilmezse, döviz açık pozisyonu beklenmedik zararlara yol açar."},
  inputs: [
    { id: "fxRevenue", label: "Döviz Gelir", label_i18n: {"en":"FX revenue","tr":"Döviz Gelir"}, type: "number", unit: "USD", required: true, smartDefault: 1000000, validation: { min: 0 }, helper: "", expertMeaning: "FX revenue", expertMeaning_i18n: {"en":"FX revenue","tr":"döviz gelir"} },
    { id: "fxCost", label: "Döviz Gider", label_i18n: {"en":"FX cost","tr":"Döviz Gider"}, type: "number", unit: "USD", required: true, smartDefault: 600000, validation: { min: 0 }, helper: "", expertMeaning: "FX cost", expertMeaning_i18n: {"en":"FX cost","tr":"döviz gider"} },
    { id: "fxPair", label: "Döviz Çifti", label_i18n: {"en":"Currency pair","tr":"Döviz Çifti"}, type: "select", unit: "", enumValues: ["USD/TRY", "EUR/USD", "EUR/TRY", "GBP/USD", "USD/JPY"], required: true, smartDefault: "USD/TRY", helper: "", expertMeaning: "Currency pair", expertMeaning_i18n: {"en":"Currency pair","tr":"döviz çifti"} },
    { id: "volatility", label: "Volatilite", label_i18n: {"en":"Volatilite","tr":"Volatilite"}, type: "number", unit: "%", required: true, smartDefault: 15, validation: { min: 0 }, helper: "", expertMeaning: "Annual volatility", expertMeaning_i18n: {"en":"Annual volatility","tr":"Annual volatility"} },
    { id: "timeHorizon", label: "Zaman Ufku", label_i18n: {"en":"Zaman Ufku","tr":"Zaman Ufku"}, type: "number", unit: "gün", required: true, smartDefault: 90, validation: { min: 1 }, helper: "", expertMeaning: "Risk horizon", expertMeaning_i18n: {"en":"Risk horizon","tr":"Risk horizon"} },
    { id: "zScore", label: "Z-Skoru", label_i18n: {"en":"Z-Skoru","tr":"Z-Skoru"}, type: "number", unit: "", required: false, smartDefault: 1.65, validation: { min: 0, max: 4 }, helper: "", expertMeaning: "Confidence level z-score", expertMeaning_i18n: {"en":"Confidence level z-score","tr":"Confidence level z-score"} },
    { id: "hedgeRatio", label: "Hedge Oranı", label_i18n: {"en":"Hedge ratio","tr":"Hedge Oranı"}, type: "number", unit: "", required: false, smartDefault: 0.5, validation: { min: 0, max: 1 }, helper: "", expertMeaning: "Hedge ratio", expertMeaning_i18n: {"en":"Hedge ratio","tr":"hedge oranı"} },
    { id: "forwardPoints", label: "Forward Puanı", label_i18n: {"en":"Forward premium/discount","tr":"Forward Puanı"}, type: "number", unit: "", required: false, smartDefault: 0.02, validation: { min: 0 }, helper: "", expertMeaning: "Forward premium/discount", expertMeaning_i18n: {"en":"Forward premium/discount","tr":"forward puanı"} },
    { id: "spotRate", label: "Spot Kur", label_i18n: {"en":"Spot Kur","tr":"Spot Kur"}, type: "number", unit: "", required: true, smartDefault: 30, validation: { min: 0.01 }, helper: "", expertMeaning: "Current spot rate", expertMeaning_i18n: {"en":"Current spot rate","tr":"Current spot rate"} },
    { id: "forwardRate", label: "Forward Kur", label_i18n: {"en":"Forward Kur","tr":"Forward Kur"}, type: "number", unit: "", required: false, smartDefault: 32, validation: { min: 0.01 }, helper: "", expertMeaning: "Forward rate", expertMeaning_i18n: {"en":"Forward rate","tr":"Forward rate"} },
  ],
  outputs: [
    { id: "fxExposure", label: "Net Döviz Pozisyonu", label_i18n: {"en":"Net Doviz Pozisyonu","tr":"Net Döviz Pozisyonu"}, unit: "USD", format: "currency" },
    { id: "varHistorical", label: "Tarihsel VaR", label_i18n: {"en":"Tarihsel VaR","tr":"Tarihsel VaR"}, unit: "USD", format: "currency" },
    { id: "varParametric", label: "Parametrik VaR", label_i18n: {"en":"Parametrik VaR","tr":"Parametrik VaR"}, unit: "USD", format: "currency" },
    { id: "unhedgedVaR", label: "Hedge Edilmemiş VaR", label_i18n: {"en":"Hedge Edilmemis VaR","tr":"Hedge Edilmemiş VaR"}, unit: "USD", format: "currency" },
    { id: "costOfHedge", label: "Hedge Maliyeti", label_i18n: {"en":"Hedge Maliyeti","tr":"Hedge Maliyeti"}, unit: "USD", format: "currency" },
    { id: "netImpact", label: "Net Kur Etkisi", label_i18n: {"en":"Net Kur Etkisi","tr":"Net Kur Etkisi"}, unit: "USD", format: "currency" },
  ],
  thresholds: [{ fieldId: "unhedgedVaR", warning: 50000, critical: 200000, direction: "higher_is_bad", warningMessage: "Açık VaR > $50K — hedge oranı artırılmalı.", warningMessage_i18n: {"en":"Açık VaR > $50K — hedge oranı artırılmalı.","tr":"Açık VaR > $50K — hedge oranı artırılmalı."}, criticalMessage: "Açık VaR > $200K — acil hedge işlemi gerekli.", criticalMessage_i18n: {"en":"Açık VaR > $200K — acil hedge işlemi gerekli.","tr":"Açık VaR > $200K — acil hedge işlemi gerekli."} }],
  formulaPipeline: [
    { formulaId: "cost.fx_exposure", inputMap: {
        fxAmount: "fxRevenue",
        spotRate: "fxCost"
      }, outputId: "fxExposure" },
    { formulaId: "cost.fx_var_historical", inputMap: {
        fxExposure: "fxExposure",
        historicalVol: "volatility",
        zScore: "zScore"
      }, outputId: "varHistorical" },
    { formulaId: "cost.fx_var_parametric", inputMap: {
        fxExposure: "fxExposure",
        stdDev: "volatility",
        timeHorizon: "timeHorizon"
      }, outputId: "varParametric" },
    { formulaId: "cost.fx_unhedged_var", inputMap: {
        fxExposure: "varHistorical",
        expectedMove: "hedgeRatio"
      }, outputId: "unhedgedVaR" },
    { formulaId: "cost.fx_hedge_cost", inputMap: {
        fxExposure: "fxExposure",
        hedgePremiumPct: "forwardPoints"
      }, outputId: "costOfHedge" },
    { formulaId: "cost.fx_net_impact", inputMap: {
        unhedgedVar: "spotRate",
        hedgeCost: "forwardRate",
        fxExposure: "fxExposure",
        hedgeRatio: "hedgeRatio"
      }, outputId: "netImpact" },
  ],
  reportTemplate: { title: "Kur Riski Raporu", title_i18n: {"en":"Kur Riski Raporu","tr":"Kur Riski Raporu"}, sections: ["executive_summary", "loss_breakdown", "thresholds", "action_plan", "assumptions"], exportFormats: ["pdf", "excel"] },
  assumptions: { hiddenLossMultiplier: 1.1, volatilityPercent: 15, targetMarginPercent: 10, assumptionNotes: ["VaR = Pozisyon × Volatilite × Z × √T.", "Hedge maliyeti = Notional × Forward puan.", "Net etki = (Spot - Forward) × Hedge edilen."],assumptionNotes_i18n:[{"en":"VaR = Pozisyon × Volatilite × Z × √T.","tr":"VaR = Pozisyon × Volatilite × Z × √T."},{"en":"Hedge maliyeti = Notional × Forward puan.","tr":"Hedge maliyeti = Notional × Forward puan."},{"en":"Net etki = (Spot - Forward) × Hedge edilen.","tr":"Net etki = (Spot - Forward) × Hedge edilen."}] },
};
