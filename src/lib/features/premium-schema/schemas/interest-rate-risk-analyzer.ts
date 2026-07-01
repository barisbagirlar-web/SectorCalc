/**
 * Tool #40 — Faiz Oranı Riski
 */
import type { PremiumCalculatorSchema } from "@/lib/features/premium-schema/premium-calculator-schema";
export const INTEREST_RATE_RISK_SCHEMA: PremiumCalculatorSchema = {
  id: "interest-rate-risk-analyzer", legacyPaidSlug: "interest-rate-risk-analyzer",
  name: "Interest Rate Risk & Hedge Analyzer", name_i18n: {"en":"Interest Rate Risk & Hedge Analyzer"}, sectorSlug: "financial-planning", category: "cost",
  painStatement: "Faiz oranı riski (duration gap, VaR, NIM) doğru hesaplanmazsa bilanço korunmasız kalır ve beklenmedik kayıplar oluşur.", painStatement_i18n: {"en":"Faiz rate riski (duration gap, VaR, NIM) accurate if not calculated bilanço korunmasız kalır ve beklenmedik kayıplar oluşur."},
  inputs: [
    { id: "floatingDebt", label: "Floating rate debt", label_i18n: {"en":"Floating rate debt"}, type: "number", unit: "USD", required: true, smartDefault: 5000000, validation: { min: 0 }, helper: "", expertMeaning: "Floating rate debt", expertMeaning_i18n: {"en":"Floating rate debt"} },
    { id: "hedgeRatio", label: "Hedge ratio percentage", label_i18n: {"en":"Hedge ratio percentage"}, type: "number", unit: "%", required: false, smartDefault: 60, validation: { min: 0, max: 100 }, helper: "", expertMeaning: "Hedge ratio percentage", expertMeaning_i18n: {"en":"Hedge ratio percentage"} },
    { id: "bpsChange", label: "Interest rate shock in bps", label_i18n: {"en":"Interest rate shock in bps"}, type: "number", unit: "bps", required: true, smartDefault: 100, validation: { min: 0 }, helper: "", expertMeaning: "Interest rate shock in bps", expertMeaning_i18n: {"en":"Interest rate shock in bps"} },
    { id: "durGap", label: "Duration Gap (D_A - D_L)", label_i18n: {"en":"Duration Gap (D_A - D_L)"}, type: "number", unit: "yıl", required: false, smartDefault: 2.5, validation: { min: 0 }, helper: "", expertMeaning: "Duration gap", expertMeaning_i18n: {"en":"Duration gap"} },
    { id: "assetValue", label: "Total asset value", label_i18n: {"en":"Total asset value"}, type: "number", unit: "USD", required: false, smartDefault: 10000000, validation: { min: 0 }, helper: "", expertMeaning: "Total asset value", expertMeaning_i18n: {"en":"Total asset value"} },
    { id: "rateChange", label: "Interest rate change", label_i18n: {"en":"Interest rate change"}, type: "number", unit: "%", required: false, smartDefault: 1.5, validation: { min: 0, max: 20 }, helper: "", expertMeaning: "Interest rate change", expertMeaning_i18n: {"en":"Interest rate change"} },
    { id: "portfolioValue", label: "Portfolio value", label_i18n: {"en":"Portfolio value"}, type: "number", unit: "USD", required: false, smartDefault: 8000000, validation: { min: 0 }, helper: "", expertMeaning: "Portfolio value", expertMeaning_i18n: {"en":"Portfolio value"} },
    { id: "volatility", label: "Volatilite", label_i18n: {"en":"Volatilite"}, type: "number", unit: "%", required: false, smartDefault: 15, validation: { min: 0, max: 100 }, helper: "", expertMeaning: "Annual volatility", expertMeaning_i18n: {"en":"Annual volatility"} },
    { id: "zScore", label: "Z-Skor (G.K. Düzeyi)", label_i18n: {"en":"Confidence z-score"}, type: "number", unit: "", required: false, smartDefault: 2.33, validation: { min: 0, max: 4 }, helper: "", expertMeaning: "Confidence z-score", expertMeaning_i18n: {"en":"Confidence z-score"} },
    { id: "notionalAmount", label: "Notional swap amount", label_i18n: {"en":"Notional swap amount"}, type: "number", unit: "USD", required: false, smartDefault: 3000000, validation: { min: 0 }, helper: "", expertMeaning: "Notional swap amount", expertMeaning_i18n: {"en":"Notional swap amount"} },
    { id: "swapSpread", label: "Swap Spread", label_i18n: {"en":"Swap Spread"}, type: "number", unit: "%", required: false, smartDefault: 1.5, validation: { min: 0 }, helper: "", expertMeaning: "Swap spread percentage", expertMeaning_i18n: {"en":"Swap spread percentage"} },
  ],
  outputs: [
    { id: "exposure", label: "Net Faiz Riski (Exposure)", label_i18n: {"en":"Net Faiz Riski (Exposure)"}, unit: "USD", format: "currency" },
    { id: "shockImpact", label: "Sok Etkisi (100bps)", label_i18n: {"en":"Sok Etkisi (100bps)"}, unit: "USD", format: "currency" },
    { id: "eveChange", label: "EVE Degisimi", label_i18n: {"en":"EVE Degisimi"}, unit: "USD", format: "currency" },
    { id: "valueAtRisk", label: "VaR (99% G.K.)", label_i18n: {"en":"VaR (99% G.K.)"}, unit: "USD", format: "currency", isBigNumber: true },
  ],
  thresholds: [{ fieldId: "shockImpact", warning: 500000, critical: 1000000, direction: "higher_is_bad", warningMessage: "Şok etkisi > $500K — hedge oranı artırılmalı.", warningMessage_i18n: {"en":"Şok etkisi > $500K — hedge rate artırılmalı."}, criticalMessage: "Şok etkisi > $1M — acil risk azaltma stratejisi.", criticalMessage_i18n: {"en":"Şok etkisi > $1M — urgent risk azaltma stratejisi."} }],
  formulaPipeline: [
    { formulaId: "cost.ir_exposure", inputMap: { floatingDebt: "floatingDebt", hedgeRatio: "hedgeRatio" }, outputId: "exposure" },
    { formulaId: "cost.ir_shock_impact", inputMap: { exposure: "exposure", bpsChange: "bpsChange" }, outputId: "shockImpact" },
    { formulaId: "cost.ir_eve_change", inputMap: {
        durGap: "durGap",
        rateChange: "rateChange",
        assetVal: "assetValue"
      }, outputId: "eveChange" },
    { formulaId: "cost.ir_var", inputMap: {
        volatility: "volatility",
        zScore: "zScore",
        portVal: "portfolioValue"
      }, outputId: "valueAtRisk" },
  ],
  reportTemplate: { title: "Interest Rate Risk Report", title_i18n: {"en":"Interest Rate Risk Report"}, sections: ["executive_summary", "thresholds", "action_plan", "assumptions"], exportFormats: ["pdf", "excel"] },
  assumptions: { hiddenLossMultiplier: 1.2, volatilityPercent: 20, targetMarginPercent: 25, assumptionNotes: ["Exposure = FloatingDebt×(1-HedgeRatio).", "Shock = Exposure×Bps/10000.", "EVE = -DurGap×Asset×Rate/100.", "VaR = PortVal×Vol×Z."],assumptionNotes_i18n:[{"en":"Exposure = FloatingDebt×(1-HedgeRatio)."},{"en":"Shock = Exposure×Bps/10000."},{"en":"EVE = -DurGap×Asset×Rate/100."},{"en":"VaR = PortVal×Vol×Z."}] },
};
