/**
 * Tool #40 — Faiz Oranı Riski
 */
import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";
export const INTEREST_RATE_RISK_SCHEMA: PremiumCalculatorSchema = {
  id: "interest-rate-risk-analyzer", legacyPaidSlug: "interest-rate-risk-analyzer",
  name: "Faiz Oranı Riski & Hedge Analizi", sectorSlug: "financial-planning", category: "cost",
  painStatement: "Faiz oranı riski (duration gap, VaR, NIM) doğru hesaplanmazsa bilanço korunmasız kalır ve beklenmedik kayıplar oluşur.",
  inputs: [
    { id: "floatingDebt", label: "Değişken Faizli Borç", type: "number", unit: "USD", required: true, smartDefault: 5000000, validation: { min: 0 }, helper: "", expertMeaning: "Floating rate debt" },
    { id: "hedgeRatio", label: "Hedge Oranı", type: "number", unit: "%", required: false, smartDefault: 60, validation: { min: 0, max: 100 }, helper: "", expertMeaning: "Hedge ratio percentage" },
    { id: "bpsChange", label: "Baz Puan Şoku", type: "number", unit: "bps", required: true, smartDefault: 100, validation: { min: 0 }, helper: "", expertMeaning: "Interest rate shock in bps" },
    { id: "durGap", label: "Duration Gap (D_A - D_L)", type: "number", unit: "yıl", required: false, smartDefault: 2.5, validation: { min: 0 }, helper: "", expertMeaning: "Duration gap" },
    { id: "assetValue", label: "Toplam Aktif Değer", type: "number", unit: "USD", required: false, smartDefault: 10000000, validation: { min: 0 }, helper: "", expertMeaning: "Total asset value" },
    { id: "rateChange", label: "Faiz Değişimi", type: "number", unit: "%", required: false, smartDefault: 1.5, validation: { min: 0, max: 20 }, helper: "", expertMeaning: "Interest rate change" },
    { id: "portfolioValue", label: "Portföy Değeri", type: "number", unit: "USD", required: false, smartDefault: 8000000, validation: { min: 0 }, helper: "", expertMeaning: "Portfolio value" },
    { id: "volatility", label: "Volatilite", type: "number", unit: "%", required: false, smartDefault: 15, validation: { min: 0, max: 100 }, helper: "", expertMeaning: "Annual volatility" },
    { id: "zScore", label: "Z-Skor (G.K. Düzeyi)", type: "number", unit: "", required: false, smartDefault: 2.33, validation: { min: 0, max: 4 }, helper: "", expertMeaning: "Confidence z-score" },
    { id: "notionalAmount", label: "Swap Anaparası", type: "number", unit: "USD", required: false, smartDefault: 3000000, validation: { min: 0 }, helper: "", expertMeaning: "Notional swap amount" },
    { id: "swapSpread", label: "Swap Spread", type: "number", unit: "%", required: false, smartDefault: 1.5, validation: { min: 0 }, helper: "", expertMeaning: "Swap spread percentage" },
  ],
  outputs: [
    { id: "exposure", label: "Net Faiz Riski (Exposure)", unit: "USD", format: "currency" },
    { id: "shockImpact", label: "Şok Etkisi (100bps)", unit: "USD", format: "currency" },
    { id: "eveChange", label: "EVE Değişimi", unit: "USD", format: "currency" },
    { id: "valueAtRisk", label: "VaR (99% G.K.)", unit: "USD", format: "currency", isBigNumber: true },
  ],
  thresholds: [{ fieldId: "shockImpact", warning: 500000, critical: 1000000, direction: "higher_is_bad", warningMessage: "Şok etkisi > $500K — hedge oranı artırılmalı.", criticalMessage: "Şok etkisi > $1M — acil risk azaltma stratejisi." }],
  formulaPipeline: [
    { formulaId: "cost.ir_exposure", inputMap: { floatingDebt: "floatingDebt", hedgeRatio: "hedgeRatio" }, outputId: "exposure" },
    { formulaId: "cost.ir_shock_impact", inputMap: { exposure: "exposure", bpsChange: "bpsChange" }, outputId: "shockImpact" },
    { formulaId: "cost.ir_eve_change", inputMap: { durGap: "durGap", assetValue: "assetValue", rateChange: "rateChange" }, outputId: "eveChange" },
    { formulaId: "cost.ir_var", inputMap: { portfolioValue: "portfolioValue", volatility: "volatility", zScore: "zScore" }, outputId: "valueAtRisk" },
  ],
  reportTemplate: { title: "Interest Rate Risk Report", sections: ["executive_summary", "thresholds", "action_plan", "assumptions"], exportFormats: ["pdf", "excel"] },
  assumptions: { hiddenLossMultiplier: 1.2, volatilityPercent: 20, targetMarginPercent: 25, assumptionNotes: ["Exposure = FloatingDebt×(1-HedgeRatio).", "Shock = Exposure×Bps/10000.", "EVE = -DurGap×Asset×Rate/100.", "VaR = PortVal×Vol×Z."] },
};
