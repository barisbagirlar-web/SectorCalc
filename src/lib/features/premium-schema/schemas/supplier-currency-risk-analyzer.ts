/**
 * Tool #22 — Tedarikçi Döviz
 */
import type { PremiumCalculatorSchema } from "@/lib/features/premium-schema/premium-calculator-schema";
export const SUPPLIER_CURRENCY_RISK_SCHEMA: PremiumCalculatorSchema = {
  id: "supplier-currency-risk-analyzer", legacyPaidSlug: "supplier-currency-risk-analyzer",
  name: "Supplier Currency Risk Analysis", name_i18n: {"en":"Supplier Currency Risk Analysis"}, sectorSlug: "financial-planning", category: "cost",
  painStatement: "If the cost of exchange rate fluctuations is not calculated for foreign currency suppliers, unexpected losses occur.", painStatement_i18n: {"en":"If the cost of exchange rate fluctuations is not calculated for foreign currency suppliers, unexpected losses occur."},
  inputs: [
    { id: "invoiceTotal", label: "Total invoice in foreign currency", label_i18n: {"en":"Total invoice in foreign currency"}, type: "number", unit: "USD", required: true, smartDefault: 100000, validation: { min: 1 }, helper: "", expertMeaning: "Total invoice in foreign currency", expertMeaning_i18n: {"en":"Total invoice in foreign currency"} },
    { id: "currentExchangeRate", label: "Güncel Kur", label_i18n: {"en":"Current exchange rate"}, type: "number", unit: "TRY/USD", required: true, smartDefault: 30, validation: { min: 0.01 }, helper: "", expertMeaning: "Current exchange rate", expertMeaning_i18n: {"en":"Current exchange rate"} },
    { id: "expectedRateShift", label: "Expected exchange rate shift", label_i18n: {"en":"Expected exchange rate shift"}, type: "number", unit: "%", required: true, smartDefault: 10, validation: { min: -50, max: 50 }, helper: "", expertMeaning: "Expected exchange rate shift", expertMeaning_i18n: {"en":"Expected exchange rate shift"} },
    { id: "volatilityRate", label: "Kur Volatilitesi", label_i18n: {"en":"Currency Volatility"}, type: "number", unit: "%", required: true, smartDefault: 15, validation: { min: 0, max: 100 }, helper: "", expertMeaning: "Currency volatility rate", expertMeaning_i18n: {"en":"Currency volatility rate"} },
    { id: "hedgingCost", label: "Korunma Maliyeti", label_i18n: {"en":"Hedging Cost"}, type: "number", unit: "USD", required: false, smartDefault: 3000, validation: { min: 0 }, helper: "", expertMeaning: "Cost of hedging", expertMeaning_i18n: {"en":"Cost of hedging"} },
    { id: "contractClauseSavings", label: "Savings from FX clauses", label_i18n: {"en":"Savings from FX clauses"}, type: "number", unit: "USD", required: false, smartDefault: 2000, validation: { min: 0 }, helper: "", expertMeaning: "Savings from FX clauses", expertMeaning_i18n: {"en":"Savings from FX clauses"} },
  ],
  outputs: [
    { id: "fxExposureSupplier", label: "Döviz Pozisyonu", label_i18n: {"en":"Doviz Pozisyonu"}, unit: "USD", format: "currency" },
    { id: "fxExpectedLoss", label: "Beklenen Kur Zarar", label_i18n: {"en":"Expected fx Loss"}, unit: "USD", format: "currency" },
    { id: "fxVarSupplier", label: "Value at Risk (VAR)", label_i18n: {"en":"Value at Risk (VAR)"}, unit: "USD", format: "currency" },
    { id: "fxNetRiskCost", label: "Net Risk Maliyeti", label_i18n: {"en":"Net Risk Cost"}, unit: "USD", format: "currency", isBigNumber: true },
    { id: "fxClauseSavings", label: "Klausül Tasarrufu", label_i18n: {"en":"Klausul Tasarrufu"}, unit: "USD", format: "currency" },
  ],
  thresholds: [{ fieldId: "fxNetRiskCost", warning: 5000, critical: 15000, direction: "higher_is_bad", warningMessage: "Net risk maliyeti > $5K — hedge değerlendirilmeli.", warningMessage_i18n: {"en":"Net risk Cost > $5K — hedge değerlendirilmeli."}, criticalMessage: "Net risk maliyeti > $15K — döviz korunması zorunlu.", criticalMessage_i18n: {"en":"Net risk Cost > $15K — döviz korunması zorunlu."} }],
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
      ,
        clauseDiscountPct: "clauseDiscountPct"}, outputId: "fxClauseSavings" },
  ],
  reportTemplate: { title: "Supplier Currency Risk Report", title_i18n: {"en":"Supplier Currency Risk Report"}, sections: ["executive_summary", "thresholds", "action_plan", "assumptions"], exportFormats: ["pdf", "excel"] },
  assumptions: { hiddenLossMultiplier: 1.2, volatilityPercent: 15, targetMarginPercent: 12, assumptionNotes: ["FX exposure = Invoice × Rate.", "Expected loss = Exposure × Shift%.", "VAR at 95% confidence using volatility."],assumptionNotes_i18n:[{"en":"FX exposure = Invoice × Rate."},{"en":"Expected loss = Exposure × Shift%."},{"en":"VAR at 95% confidence using volatility."}] },
};
