/**
 * Tool #22 — Tedarikçi Döviz
 */
import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";
export const SUPPLIER_CURRENCY_RISK_SCHEMA: PremiumCalculatorSchema = {
  id: "supplier-currency-risk-analyzer", legacyPaidSlug: "supplier-currency-risk-analyzer",
  name: "Tedarikçi Döviz Riski Analizi", sectorSlug: "financial-planning", category: "cost",
  painStatement: "Yabancı para tedarikçilerinde kur dalgalanması maliyeti hesaplanmazsa beklenmedik zararlar oluşur.",
  inputs: [
    { id: "invoiceTotal", label: "Toplam Fatura Tutarı (Döviz)", type: "number", unit: "USD", required: true, smartDefault: 100000, validation: { min: 1 }, helper: "", expertMeaning: "Total invoice in foreign currency" },
    { id: "currentExchangeRate", label: "Güncel Kur", type: "number", unit: "TRY/USD", required: true, smartDefault: 30, validation: { min: 0.01 }, helper: "", expertMeaning: "Current exchange rate" },
    { id: "expectedRateShift", label: "Beklenen Kur Değişimi", type: "number", unit: "%", required: true, smartDefault: 10, validation: { min: -50, max: 50 }, helper: "", expertMeaning: "Expected exchange rate shift" },
    { id: "volatilityRate", label: "Kur Volatilitesi", type: "number", unit: "%", required: true, smartDefault: 15, validation: { min: 0, max: 100 }, helper: "", expertMeaning: "Currency volatility rate" },
    { id: "hedgingCost", label: "Korunma Maliyeti", type: "number", unit: "USD", required: false, smartDefault: 3000, validation: { min: 0 }, helper: "", expertMeaning: "Cost of hedging" },
    { id: "contractClauseSavings", label: "Sözleşme Klausül Tasarrufu", type: "number", unit: "USD", required: false, smartDefault: 2000, validation: { min: 0 }, helper: "", expertMeaning: "Savings from FX clauses" },
  ],
  outputs: [
    { id: "fxExposureSupplier", label: "Döviz Pozisyonu", unit: "USD", format: "currency" },
    { id: "fxExpectedLoss", label: "Beklenen Kur Zararı", unit: "USD", format: "currency" },
    { id: "fxVarSupplier", label: "Value at Risk (VAR)", unit: "USD", format: "currency" },
    { id: "fxNetRiskCost", label: "Net Risk Maliyeti", unit: "USD", format: "currency", isBigNumber: true },
    { id: "fxClauseSavings", label: "Klausül Tasarrufu", unit: "USD", format: "currency" },
  ],
  thresholds: [{ fieldId: "fxNetRiskCost", warning: 5000, critical: 15000, direction: "higher_is_bad", warningMessage: "Net risk maliyeti > $5K — hedge değerlendirilmeli.", criticalMessage: "Net risk maliyeti > $15K — döviz korunması zorunlu." }],
  formulaPipeline: [
    { formulaId: "cost.fx_exposure_supplier", inputMap: { invoiceTotalAmt: "invoiceTotal", currentExchangeRate: "currentExchangeRate" }, outputId: "fxExposureSupplier" },
    { formulaId: "cost.fx_expected_loss", inputMap: { invoiceTotalAmt: "invoiceTotal", expectedRateShift: "expectedRateShift" }, outputId: "fxExpectedLoss" },
    { formulaId: "cost.fx_var_supplier", inputMap: { invoiceTotalAmt: "invoiceTotal", volatilityRate: "volatilityRate" }, outputId: "fxVarSupplier" },
    { formulaId: "cost.fx_net_risk_cost", inputMap: { fxExpectedLoss: "fxExpectedLoss", fxVarSupplier: "fxVarSupplier", hedgingCost: "hedgingCost" }, outputId: "fxNetRiskCost" },
    { formulaId: "cost.fx_clause_savings", inputMap: { contractClauseSavings: "contractClauseSavings" }, outputId: "fxClauseSavings" },
  ],
  reportTemplate: { title: "Supplier Currency Risk Report", sections: ["executive_summary", "thresholds", "action_plan", "assumptions"], exportFormats: ["pdf", "excel"] },
  assumptions: { hiddenLossMultiplier: 1.2, volatilityPercent: 15, targetMarginPercent: 12, assumptionNotes: ["FX exposure = Invoice × Rate.", "Expected loss = Exposure × Shift%.", "VAR at 95% confidence using volatility."] },
};
