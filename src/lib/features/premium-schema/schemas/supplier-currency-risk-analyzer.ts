/**
 * Tool #22 — Tedarikçi Döviz
 */
import type { PremiumCalculatorSchema } from "@/lib/features/premium-schema/premium-calculator-schema";
export const SUPPLIER_CURRENCY_RISK_SCHEMA: PremiumCalculatorSchema = {
  id: "supplier-currency-risk-analyzer", legacyPaidSlug: "supplier-currency-risk-analyzer",
  name: "Tedarikçi Döviz Riski Analizi", name_i18n: {"en":"Supplier Currency Risk Analysis","tr":"Tedarikçi Döviz Riski Analizi"}, sectorSlug: "financial-planning", category: "cost",
  painStatement: "Yabancı para tedarikçilerinde kur dalgalanması maliyeti hesaplanmazsa beklenmedik zararlar oluşur.", painStatement_i18n: {"en":"If the cost of exchange rate fluctuations is not calculated for foreign currency suppliers, unexpected losses occur.","tr":"Yabancı para tedarikçilerinde kur dalgalanması maliyeti hesaplanmazsa beklenmedik zararlar oluşur."},
  inputs: [
    { id: "invoiceTotal", label: "Toplam Fatura Tutarı (Döviz)", label_i18n: {"en":"Total invoice in foreign currency","tr":"Toplam Fatura Tutarı (Döviz)"}, type: "number", unit: "USD", required: true, smartDefault: 100000, validation: { min: 1 }, helper: "", expertMeaning: "Total invoice in foreign currency", expertMeaning_i18n: {"en":"Total invoice in foreign currency","tr":"toplam fatura tutarı (döviz)"} },
    { id: "currentExchangeRate", label: "Güncel Kur", label_i18n: {"en":"Current exchange rate","tr":"Güncel Kur"}, type: "number", unit: "TRY/USD", required: true, smartDefault: 30, validation: { min: 0.01 }, helper: "", expertMeaning: "Current exchange rate", expertMeaning_i18n: {"en":"Current exchange rate","tr":"güncel kur"} },
    { id: "expectedRateShift", label: "Beklenen Kur Değişimi", label_i18n: {"en":"Expected exchange rate shift","tr":"Beklenen Kur Değişimi"}, type: "number", unit: "%", required: true, smartDefault: 10, validation: { min: -50, max: 50 }, helper: "", expertMeaning: "Expected exchange rate shift", expertMeaning_i18n: {"en":"Expected exchange rate shift","tr":"beklenen kur değişimi"} },
    { id: "volatilityRate", label: "Kur Volatilitesi", label_i18n: {"en":"Currency Volatility","tr":"Kur Volatilitesi"}, type: "number", unit: "%", required: true, smartDefault: 15, validation: { min: 0, max: 100 }, helper: "", expertMeaning: "Currency volatility rate", expertMeaning_i18n: {"en":"Currency volatility rate","tr":"Kur volatilite oranı"} },
    { id: "hedgingCost", label: "Korunma Maliyeti", label_i18n: {"en":"Hedging Cost","tr":"Korunma Maliyeti"}, type: "number", unit: "USD", required: false, smartDefault: 3000, validation: { min: 0 }, helper: "", expertMeaning: "Cost of hedging", expertMeaning_i18n: {"en":"Cost of hedging","tr":"Korunma maliyeti"} },
    { id: "contractClauseSavings", label: "Sözleşme Klausül Tasarrufu", label_i18n: {"en":"Savings from FX clauses","tr":"Sözleşme Klausül Tasarrufu"}, type: "number", unit: "USD", required: false, smartDefault: 2000, validation: { min: 0 }, helper: "", expertMeaning: "Savings from FX clauses", expertMeaning_i18n: {"en":"Savings from FX clauses","tr":"sözleşme klausül tasarrufu"} },
  ],
  outputs: [
    { id: "fxExposureSupplier", label: "Döviz Pozisyonu", label_i18n: {"en":"Doviz Pozisyonu","tr":"Döviz Pozisyonu"}, unit: "USD", format: "currency" },
    { id: "fxExpectedLoss", label: "Beklenen Kur Zararı", label_i18n: {"en":"Beklenen Kur Zarar","tr":"Beklenen Kur Zararı"}, unit: "USD", format: "currency" },
    { id: "fxVarSupplier", label: "Value at Risk (VAR)", label_i18n: {"en":"Value at Risk (VAR)","tr":"Value at Risk (VAR)"}, unit: "USD", format: "currency" },
    { id: "fxNetRiskCost", label: "Net Risk Maliyeti", label_i18n: {"en":"Net Risk Cost","tr":"Net Risk Maliyeti"}, unit: "USD", format: "currency", isBigNumber: true },
    { id: "fxClauseSavings", label: "Klausül Tasarrufu", label_i18n: {"en":"Klausul Tasarrufu","tr":"Klausül Tasarrufu"}, unit: "USD", format: "currency" },
  ],
  thresholds: [{ fieldId: "fxNetRiskCost", warning: 5000, critical: 15000, direction: "higher_is_bad", warningMessage: "Net risk maliyeti > $5K — hedge değerlendirilmeli.", warningMessage_i18n: {"en":"Net risk maliyeti > $5K — hedge değerlendirilmeli.","tr":"Net risk maliyeti > $5K — hedge değerlendirilmeli."}, criticalMessage: "Net risk maliyeti > $15K — döviz korunması zorunlu.", criticalMessage_i18n: {"en":"Net risk maliyeti > $15K — döviz korunması zorunlu.","tr":"Net risk maliyeti > $15K — döviz korunması zorunlu."} }],
  formulaPipeline: [
    { formulaId: "cost.fx_exposure_supplier", inputMap: {
        contractValue: "invoiceTotal",
        exchangeRate: "currentExchangeRate"
      }, outputId: "fxExposureSupplier" },
    { formulaId: "cost.fx_expected_loss", inputMap: {
        fxExposureSupplier: "invoiceTotal",
        forexVolatility: "expectedRateShift"
      }, outputId: "fxExpectedLoss" },
    { formulaId: "cost.fx_var_supplier", inputMap: {
        fxExposureSupplier: "invoiceTotal",
        confidenceFactor: "volatilityRate"
      }, outputId: "fxVarSupplier" },
    { formulaId: "cost.fx_net_risk_cost", inputMap: {
        fxExpectedLoss: "fxExpectedLoss",
        fxVarSupplier: "fxVarSupplier",
        hedgeSavings: "hedgingCost"
      }, outputId: "fxNetRiskCost" },
    { formulaId: "cost.fx_clause_savings", inputMap: {
        fxExposureSupplier: "contractClauseSavings"
      }, outputId: "fxClauseSavings" },
  ],
  reportTemplate: { title: "Supplier Currency Risk Report", title_i18n: {"en":"Supplier Currency Risk Report","tr":"Tedarikçi Döviz Kuru Risk Raporu"}, sections: ["executive_summary", "thresholds", "action_plan", "assumptions"], exportFormats: ["pdf", "excel"] },
  assumptions: { hiddenLossMultiplier: 1.2, volatilityPercent: 15, targetMarginPercent: 12, assumptionNotes: ["FX exposure = Invoice × Rate.", "Expected loss = Exposure × Shift%.", "VAR at 95% confidence using volatility."],assumptionNotes_i18n:[{"en":"FX exposure = Invoice × Rate.","tr":"FX exposure = Invoice × Rate."},{"en":"Expected loss = Exposure × Shift%.","tr":"Expected loss = Exposure × Shift%."},{"en":"VAR at 95% confidence using volatility.","tr":"VAR at 95% confidence using volatility."}] },
};
