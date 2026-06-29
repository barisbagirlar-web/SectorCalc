/**
 * Tool #40 — Faiz Oranı Riski
 */
import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";
export const INTEREST_RATE_RISK_SCHEMA: PremiumCalculatorSchema = {
  id: "interest-rate-risk-analyzer", legacyPaidSlug: "interest-rate-risk-analyzer",
  name: "Faiz Oranı Riski & Hedge Analizi", name_i18n: {"en":"Interest Rate Risk & Hedge Analysis","tr":"Faiz Oranı Riski & Hedge Analizi"}, sectorSlug: "financial-planning", category: "cost",
  painStatement: "Faiz oranı riski (duration gap, VaR, NIM) doğru hesaplanmazsa bilanço korunmasız kalır ve beklenmedik kayıplar oluşur.", painStatement_i18n: {"en":"Without proper interest rate risk calculation (duration gap, VaR, NIM), the balance sheet remains unprotected and unexpected losses occur.","tr":"Faiz oranı riski (duration gap, VaR, NIM) doğru hesaplanmazsa bilanço korunmasız kalır ve beklenmedik kayıplar oluşur."},
  inputs: [
    { id: "floatingDebt", label: "Değişken Faizli Borç", label_i18n: {"en":"Floating rate debt","tr":"Değişken Faizli Borç"}, type: "number", unit: "USD", required: true, smartDefault: 5000000, validation: { min: 0 }, helper: "", expertMeaning: "Floating rate debt", expertMeaning_i18n: {"en":"Floating rate debt","tr":"Değişken Faizli Borç"} },
    { id: "hedgeRatio", label: "Hedge Oranı", label_i18n: {"en":"Hedge ratio percentage","tr":"Hedge Oranı"}, type: "number", unit: "%", required: false, smartDefault: 60, validation: { min: 0, max: 100 }, helper: "", expertMeaning: "Hedge ratio percentage", expertMeaning_i18n: {"en":"Hedge ratio percentage","tr":"Hedge Oranı"} },
    { id: "bpsChange", label: "Baz Puan Şoku", label_i18n: {"en":"Interest rate shock in bps","tr":"Baz Puan Şoku"}, type: "number", unit: "bps", required: true, smartDefault: 100, validation: { min: 0 }, helper: "", expertMeaning: "Interest rate shock in bps", expertMeaning_i18n: {"en":"Interest rate shock in bps","tr":"Baz Puan Şoku"} },
    { id: "durGap", label: "Duration Gap (D_A - D_L)", label_i18n: {"en":"Duration gap","tr":"Duration Gap (D_A - D_L)"}, type: "number", unit: "yıl", required: false, smartDefault: 2.5, validation: { min: 0 }, helper: "", expertMeaning: "Duration gap", expertMeaning_i18n: {"en":"Duration gap","tr":"Duration Gap (D_A - D_L)"} },
    { id: "assetValue", label: "Toplam Aktif Değer", label_i18n: {"en":"Total asset value","tr":"Toplam Aktif Değer"}, type: "number", unit: "USD", required: false, smartDefault: 10000000, validation: { min: 0 }, helper: "", expertMeaning: "Total asset value", expertMeaning_i18n: {"en":"Total asset value","tr":"Toplam Aktif Değer"} },
    { id: "rateChange", label: "Faiz Değişimi", label_i18n: {"en":"Interest rate change","tr":"Faiz Değişimi"}, type: "number", unit: "%", required: false, smartDefault: 1.5, validation: { min: 0, max: 20 }, helper: "", expertMeaning: "Interest rate change", expertMeaning_i18n: {"en":"Interest rate change","tr":"Faiz Değişimi"} },
    { id: "portfolioValue", label: "Portföy Değeri", label_i18n: {"en":"Portfolio value","tr":"Portföy Değeri"}, type: "number", unit: "USD", required: false, smartDefault: 8000000, validation: { min: 0 }, helper: "", expertMeaning: "Portfolio value", expertMeaning_i18n: {"en":"Portfolio value","tr":"Portföy Değeri"} },
    { id: "volatility", label: "Volatilite", label_i18n: {"en":"Annual volatility","tr":"Volatilite"}, type: "number", unit: "%", required: false, smartDefault: 15, validation: { min: 0, max: 100 }, helper: "", expertMeaning: "Annual volatility", expertMeaning_i18n: {"en":"Annual volatility","tr":"Volatilite"} },
    { id: "zScore", label: "Z-Skor (G.K. Düzeyi)", label_i18n: {"en":"Confidence z-score","tr":"Z-Skor (G.K. Düzeyi)"}, type: "number", unit: "", required: false, smartDefault: 2.33, validation: { min: 0, max: 4 }, helper: "", expertMeaning: "Confidence z-score", expertMeaning_i18n: {"en":"Confidence z-score","tr":"Z-Skor (G.K. Düzeyi)"} },
    { id: "notionalAmount", label: "Swap Anaparası", label_i18n: {"en":"Notional swap amount","tr":"Swap Anaparası"}, type: "number", unit: "USD", required: false, smartDefault: 3000000, validation: { min: 0 }, helper: "", expertMeaning: "Notional swap amount", expertMeaning_i18n: {"en":"Notional swap amount","tr":"Swap Anaparası"} },
    { id: "swapSpread", label: "Swap Spread", label_i18n: {"en":"Swap spread percentage","tr":"Swap Spread"}, type: "number", unit: "%", required: false, smartDefault: 1.5, validation: { min: 0 }, helper: "", expertMeaning: "Swap spread percentage", expertMeaning_i18n: {"en":"Swap spread percentage","tr":"Swap Spread"} },
  ],
  outputs:  [
    { id: "exposure", label: "Net Faiz Riski (Exposure)", label_i18n: {"en":"Net Interest Rate Exposure","tr":"Net Faiz Riski (Exposure)"}, unit: "USD", format: "currency" },
    { id: "shockImpact", label: "Şok Etkisi (100bps)", label_i18n: {"en":"Shock Impact (100bps)","tr":"Şok Etkisi (100bps)"}, unit: "USD", format: "currency" },
    { id: "eveChange", label: "EVE Değişimi", label_i18n: {"en":"EVE Change","tr":"EVE Değişimi"}, unit: "USD", format: "currency" },
    { id: "valueAtRisk", label: "VaR (99% G.K.)", label_i18n: {"en":"VaR (99% Confidence)","tr":"VaR (99% G.K.)"}, unit: "USD", format: "currency", isBigNumber: true },
  ],
  thresholds: [{ fieldId: "shockImpact", warning: 500000, critical: 1000000, direction: "higher_is_bad", warningMessage: "Şok etkisi > $500K — hedge oranı artırılmalı.", warningMessage_i18n: {"en":"Shock impact > $500K — hedge ratio should be increased.","tr":"Şok etkisi > $500K — hedge oranı artırılmalı."}, criticalMessage: "Şok etkisi > $1M — acil risk azaltma stratejisi.", criticalMessage_i18n: {"en":"Shock impact > $1M — urgent risk mitigation strategy needed.","tr":"Şok etkisi > $1M — acil risk azaltma stratejisi."} }],
  formulaPipeline: [
    { formulaId: "cost.ir_exposure", inputMap: { floatingDebt: "floatingDebt", hedgeRatio: "hedgeRatio" }, outputId: "exposure" },
    { formulaId: "cost.ir_shock_impact", inputMap: { exposure: "exposure", bpsChange: "bpsChange" }, outputId: "shockImpact" },
    { formulaId: "cost.ir_eve_change", inputMap: { durGap: "durGap", assetValue: "assetValue", rateChange: "rateChange" }, outputId: "eveChange" },
    { formulaId: "cost.ir_var", inputMap: { portfolioValue: "portfolioValue", volatility: "volatility", zScore: "zScore" }, outputId: "valueAtRisk" },
  ],
  reportTemplate: { title: "Interest Rate Risk Report", title_i18n: {"en":"Interest Rate Risk Report","tr":"Interest Rate Risk Report"}, sections: ["executive_summary", "thresholds", "action_plan", "assumptions"], exportFormats: ["pdf", "excel"] },
  assumptions: { hiddenLossMultiplier: 1.2, volatilityPercent: 20, targetMarginPercent: 25, assumptionNotes: ["Exposure = FloatingDebt×(1-HedgeRatio).", "Shock = Exposure×Bps/10000.", "EVE = -DurGap×Asset×Rate/100.", "VaR = PortVal×Vol×Z."],assumptionNotes_i18n:[{"en":"Exposure = FloatingDebt×(1-HedgeRatio).","tr":"Exposure = FloatingDebt×(1-HedgeRatio)."},{"en":"Shock = Exposure×Bps/10000.","tr":"Shock = Exposure×Bps/10000."},{"en":"EVE = -DurGap×Asset×Rate/100.","tr":"EVE = -DurGap×Asset×Rate/100."},{"en":"VaR = PortVal×Vol×Z.","tr":"VaR = PortVal×Vol×Z."}] },
};
