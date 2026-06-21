/**
 * Tool #55 — İç Verim Oranı IRR
 */
import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";
export const IRR_INVESTMENT_SCHEMA: PremiumCalculatorSchema = {
  id: "irr-npv-investment-analyzer", legacyPaidSlug: "irr-npv-investment-analyzer",
  name: "İç Verim Oranı (IRR) & Yatırım Analizi", name_i18n: {"en":"İç Verim Oranı (IRR) & Yatırım Analizi","tr":"İç Verim Oranı (IRR) & Yatırım Analizi"}, sectorSlug: "financial-planning", category: "cost",
  painStatement: "Yatırım projelerinde NPV, IRR, geri ödeme süresi ve PI hesaplanmadan doğru fizibilite kararı verilemez.", painStatement_i18n: {"en":"Yatırım projelerinde NPV, IRR, geri ödeme süresi ve PI hesaplanmadan doğru fizibilite kararı verilemez.","tr":"Yatırım projelerinde NPV, IRR, geri ödeme süresi ve PI hesaplanmadan doğru fizibilite kararı verilemez."},
  inputs: [
    { id: "cashFlows", label: "Nakit Akışları (virgülle; ilki negatif)", label_i18n: {"en":"Nakit Akışları (virgülle; ilki negatif)","tr":"Nakit Akışları (virgülle; ilki negatif)"}, type: "number", unit: "USD", array: true, required: true, validation: { min: 0 }, helper: "", expertMeaning: "Cash flows, first is investment (negative)", expertMeaning_i18n: {"en":"Cash flows, first is investment (negative)","tr":"Cash flows, first is investment (negative)"} },
    { id: "discountRate", label: "İskonto Oranı (WACC)", label_i18n: {"en":"İskonto Oranı (WACC)","tr":"İskonto Oranı (WACC)"}, type: "number", unit: "%", required: true, smartDefault: 10, validation: { min: 0, max: 100 }, helper: "", expertMeaning: "Discount rate", expertMeaning_i18n: {"en":"Discount rate","tr":"Discount rate"} },
    { id: "pvFuture", label: "Gelecek Nakit PV", label_i18n: {"en":"Gelecek Nakit PV","tr":"Gelecek Nakit PV"}, type: "number", unit: "USD", required: false, smartDefault: 120000, validation: { min: 0 }, helper: "", expertMeaning: "PV of future cash flows", expertMeaning_i18n: {"en":"PV of future cash flows","tr":"PV of future cash flows"} },
    { id: "initialInvestment", label: "Başlangıç Yatırımı", label_i18n: {"en":"Başlangıç Yatırımı","tr":"Başlangıç Yatırımı"}, type: "number", unit: "USD", required: false, smartDefault: 100000, validation: { min: 0 }, helper: "", expertMeaning: "Initial investment amount", expertMeaning_i18n: {"en":"Initial investment amount","tr":"Initial investment amount"} },
  ],
  outputs: [
    { id: "npv", label: "NPV (Net Bugünkü Değer)", label_i18n: {"en":"NPV (Net Bugünkü Değer)","tr":"NPV (Net Bugünkü Değer)"}, unit: "USD", format: "currency" },
    { id: "irr", label: "IRR (İç Verim Oranı)", label_i18n: {"en":"IRR (İç Verim Oranı)","tr":"IRR (İç Verim Oranı)"}, unit: "%", format: "percentage" },
    { id: "payback", label: "Geri Ödeme Süresi", label_i18n: {"en":"Geri Ödeme Süresi","tr":"Geri Ödeme Süresi"}, unit: "yıl", format: "number" },
    { id: "profitabilityIndex", label: "Kârlılık İndeksi (PI)", label_i18n: {"en":"Kârlılık İndeksi (PI)","tr":"Kârlılık İndeksi (PI)"}, unit: "", format: "number", isBigNumber: true },
  ],
  thresholds: [{ fieldId: "irr", warning: 15, critical: 10, direction: "lower_is_bad", warningMessage: "IRR < %15 — WACC'nin altında olabilir, risk değerlendirmesi yapılmalı.", warningMessage_i18n: {"en":"IRR < %15 — WACC'nin altında olabilir, risk değerlendirmesi yapılmalı.","tr":"IRR < %15 — WACC'nin altında olabilir, risk değerlendirmesi yapılmalı."}, criticalMessage: "IRR < %10 — yatırım fizibilitesi sorgulanmalı.", criticalMessage_i18n: {"en":"IRR < %10 — yatırım fizibilitesi sorgulanmalı.","tr":"IRR < %10 — yatırım fizibilitesi sorgulanmalı."} }],
  formulaPipeline: [
    { formulaId: "cost.npv", inputMap: { cashFlows: "cashFlows", discountRate: "discountRate" }, outputId: "npv" },
    { formulaId: "cost.irr_simple", inputMap: { cashFlows: "cashFlows" }, outputId: "irr" },
    { formulaId: "cost.payback_period", inputMap: { cashFlows: "cashFlows" }, outputId: "payback" },
    { formulaId: "cost.profitability_index", inputMap: { pvFuture: "pvFuture", initialInvestment: "initialInvestment" }, outputId: "profitabilityIndex" },
  ],
  reportTemplate: { title: "IRR Investment Analysis Report", title_i18n: {"en":"IRR Investment Analysis Report","tr":"IRR Investment Analysis Report"}, sections: ["executive_summary", "thresholds", "action_plan", "assumptions"], exportFormats: ["pdf", "excel"] },
  assumptions: { hiddenLossMultiplier: 1.2, volatilityPercent: 20, targetMarginPercent: 25, assumptionNotes: ["NPV = Σ(Cash/(1+r)^t). IRR is the rate where NPV=0.", "Payback = Year_Before + Unrecovered/Cash_Rec.", "PI = PV_Future/InitInv."],assumptionNotes_i18n:[{"en":"NPV = Σ(Cash/(1+r)^t). IRR is the rate where NPV=0.","tr":"NPV = Σ(Cash/(1+r)^t). IRR is the rate where NPV=0."},{"en":"Payback = Year_Before + Unrecovered/Cash_Rec.","tr":"Payback = Year_Before + Unrecovered/Cash_Rec."},{"en":"PI = PV_Future/InitInv.","tr":"PI = PV_Future/InitInv."}] },
};
