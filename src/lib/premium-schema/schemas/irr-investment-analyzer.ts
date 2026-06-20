/**
 * Tool #55 — İç Verim Oranı IRR
 */
import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";
export const IRR_INVESTMENT_SCHEMA: PremiumCalculatorSchema = {
  id: "irr-npv-investment-analyzer", legacyPaidSlug: "irr-npv-investment-analyzer",
  name: "İç Verim Oranı (IRR) & Yatırım Analizi", sectorSlug: "financial-planning", category: "cost",
  painStatement: "Yatırım projelerinde NPV, IRR, geri ödeme süresi ve PI hesaplanmadan doğru fizibilite kararı verilemez.",
  inputs: [
    { id: "cashFlows", label: "Nakit Akışları (virgülle; ilki negatif)", type: "number", unit: "USD", array: true, required: true, validation: { min: 0 }, helper: "", expertMeaning: "Cash flows, first is investment (negative)" },
    { id: "discountRate", label: "İskonto Oranı (WACC)", type: "number", unit: "%", required: true, smartDefault: 10, validation: { min: 0, max: 100 }, helper: "", expertMeaning: "Discount rate" },
    { id: "pvFuture", label: "Gelecek Nakit PV", type: "number", unit: "USD", required: false, smartDefault: 120000, validation: { min: 0 }, helper: "", expertMeaning: "PV of future cash flows" },
    { id: "initialInvestment", label: "Başlangıç Yatırımı", type: "number", unit: "USD", required: false, smartDefault: 100000, validation: { min: 0 }, helper: "", expertMeaning: "Initial investment amount" },
  ],
  outputs: [
    { id: "npv", label: "NPV (Net Bugünkü Değer)", unit: "USD", format: "currency" },
    { id: "irr", label: "IRR (İç Verim Oranı)", unit: "%", format: "percentage" },
    { id: "payback", label: "Geri Ödeme Süresi", unit: "yıl", format: "number" },
    { id: "profitabilityIndex", label: "Kârlılık İndeksi (PI)", unit: "", format: "number", isBigNumber: true },
  ],
  thresholds: [{ fieldId: "irr", warning: 15, critical: 10, direction: "lower_is_bad", warningMessage: "IRR < %15 — WACC'nin altında olabilir, risk değerlendirmesi yapılmalı.", criticalMessage: "IRR < %10 — yatırım fizibilitesi sorgulanmalı." }],
  formulaPipeline: [
    { formulaId: "cost.npv", inputMap: { cashFlows: "cashFlows", discountRate: "discountRate" }, outputId: "npv" },
    { formulaId: "cost.irr_simple", inputMap: { cashFlows: "cashFlows" }, outputId: "irr" },
    { formulaId: "cost.payback_period", inputMap: { cashFlows: "cashFlows" }, outputId: "payback" },
    { formulaId: "cost.profitability_index", inputMap: { pvFuture: "pvFuture", initialInvestment: "initialInvestment" }, outputId: "profitabilityIndex" },
  ],
  reportTemplate: { title: "IRR Investment Analysis Report", sections: ["executive_summary", "thresholds", "action_plan", "assumptions"], exportFormats: ["pdf", "excel"] },
  assumptions: { hiddenLossMultiplier: 1.2, volatilityPercent: 20, targetMarginPercent: 25, assumptionNotes: ["NPV = Σ(Cash/(1+r)^t). IRR is the rate where NPV=0.", "Payback = Year_Before + Unrecovered/Cash_Rec.", "PI = PV_Future/InitInv."] },
};
