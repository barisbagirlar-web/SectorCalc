/**
 * Tool #30 — Ödeme Vadesi Optimizasyonu
 */
import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";
export const PAYMENT_TERMS_OPTIMIZER_SCHEMA: PremiumCalculatorSchema = {
  id: "payment-terms-optimizer-analyzer", legacyPaidSlug: "payment-terms-optimizer-analyzer",
  name: "Ödeme Vadesi Optimizasyonu", name_i18n: {"en":"Payment Terms Optimization","tr":"Ödeme Vadesi Optimizasyonu"}, sectorSlug: "financial-planning", category: "cost",
  painStatement: "Uzun vade müşteri memnuniyetini artırır ama nakit akışını boğar; kısa vade tahsilatı hızlandırır ama satış kaybı yaratır.", painStatement_i18n: {"en":"Longer terms increase customer satisfaction but strain cash flow; shorter terms accelerate collections but may reduce sales.","tr":"Uzun vade müşteri memnuniyetini artırır ama nakit akışını boğar; kısa vade tahsilatı hızlandırır ama satış kaybı yaratır."},
  inputs: [
    { id: "avgReceivables", label: "Ortalama Alacak Bakiyesi", label_i18n: {"en":"Average accounts receivable balance","tr":"Ortalama Alacak Bakiyesi"}, type: "number", unit: "USD", required: true, smartDefault: 500000, validation: { min: 1 }, helper: "", expertMeaning: "Average accounts receivable balance", expertMeaning_i18n: {"en":"Average accounts receivable balance","tr":"Ortalama Alacak Bakiyesi"} },
    { id: "annualRevenue", label: "Yıllık Gelir", label_i18n: {"en":"Annual revenue","tr":"Yıllık Gelir"}, type: "number", unit: "USD", required: true, smartDefault: 5000000, validation: { min: 1 }, helper: "", expertMeaning: "Annual revenue", expertMeaning_i18n: {"en":"Annual revenue","tr":"Yıllık Gelir"} },
    { id: "costOfCapital", label: "Sermaye Maliyeti", label_i18n: {"en":"Annual cost of capital","tr":"Sermaye Maliyeti"}, type: "number", unit: "%", required: true, smartDefault: 12, validation: { min: 0.1 }, helper: "", expertMeaning: "Annual cost of capital", expertMeaning_i18n: {"en":"Annual cost of capital","tr":"Sermaye Maliyeti"} },
    { id: "currentTerms", label: "Mevcut Vade", label_i18n: {"en":"Current payment terms in days","tr":"Mevcut Vade"}, type: "number", unit: "gün", required: true, smartDefault: 45, validation: { min: 1 }, helper: "", expertMeaning: "Current payment terms in days", expertMeaning_i18n: {"en":"Current payment terms in days","tr":"Mevcut Vade"} },
    { id: "proposedTerms", label: "Önerilen Vade", label_i18n: {"en":"Proposed payment terms in days","tr":"Önerilen Vade"}, type: "number", unit: "gün", required: true, smartDefault: 30, validation: { min: 1 }, helper: "", expertMeaning: "Proposed payment terms in days", expertMeaning_i18n: {"en":"Proposed payment terms in days","tr":"Önerilen Vade"} },
    { id: "badDebtRate", label: "Şüpheli Alacak Oranı", label_i18n: {"en":"Historical bad debt rate","tr":"Şüpheli Alacak Oranı"}, type: "number", unit: "%", required: false, smartDefault: 2.5, validation: { min: 0 }, helper: "", expertMeaning: "Historical bad debt rate", expertMeaning_i18n: {"en":"Historical bad debt rate","tr":"Şüpheli Alacak Oranı"} },
    { id: "discountRate", label: "Erken Ödeme İskonto Oranı", label_i18n: {"en":"Early payment discount rate","tr":"Erken Ödeme İskonto Oranı"}, type: "number", unit: "%", required: false, smartDefault: 2, validation: { min: 0 }, helper: "", expertMeaning: "Early payment discount rate", expertMeaning_i18n: {"en":"Early payment discount rate","tr":"Erken Ödeme İskonto Oranı"} },
    { id: "discountTakeRate", label: "İskonto Kullanım Oranı", label_i18n: {"en":"Percentage of customers taking discount","tr":"İskonto Kullanım Oranı"}, type: "number", unit: "%", required: false, smartDefault: 30, validation: { min: 0, max: 100 }, helper: "", expertMeaning: "Percentage of customers taking discount", expertMeaning_i18n: {"en":"Percentage of customers taking discount","tr":"İskonto Kullanım Oranı"} },
  ],
  outputs:  [
    { id: "dso", label: "Alacak Tahsil Süresi (DSO)", label_i18n: {"en":"Days Sales Outstanding (DSO)","tr":"Alacak Tahsil Süresi (DSO)"}, unit: "gün", format: "number" },
    { id: "carryingCostAr", label: "Alacak Taşıma Maliyeti", label_i18n: {"en":"AR Carrying Cost","tr":"Alacak Taşıma Maliyeti"}, unit: "USD/yıl", format: "currency" },
    { id: "badDebtExpense", label: "Şüpheli Alacak Gideri", label_i18n: {"en":"Bad Debt Expense","tr":"Şüpheli Alacak Gideri"}, unit: "USD/yıl", format: "currency" },
    { id: "discountCost", label: "İskonto Maliyeti", label_i18n: {"en":"Discount Cost","tr":"İskonto Maliyeti"}, unit: "USD/yıl", format: "currency" },
    { id: "cashFlowImpact", label: "Nakit Akış Etkisi", label_i18n: {"en":"Cash Flow Impact","tr":"Nakit Akış Etkisi"}, unit: "USD", format: "currency", isBigNumber: true },
    { id: "npvTerms", label: "Vade Değişimi Net Bugünkü Değer", label_i18n: {"en":"Terms Change Net Present Value","tr":"Vade Değişimi Net Bugünkü Değer"}, unit: "USD", format: "currency", isBigNumber: true },
  ],
  thresholds: [{ fieldId: "dso", warning: 45, critical: 60, direction: "higher_is_bad", warningMessage: "DSO > 45 gün — tahsilat politikası gözden geçirilmeli.", warningMessage_i18n: {"en":"DSO > 45 days — collection policy should be reviewed.","tr":"DSO > 45 gün — tahsilat politikası gözden geçirilmeli."}, criticalMessage: "DSO > 60 gün — ciddi nakit akışı riski.", criticalMessage_i18n: {"en":"DSO > 60 days — serious cash flow risk.","tr":"DSO > 60 gün — ciddi nakit akışı riski."} }],
  formulaPipeline: [
    { formulaId: "measurement.dso", inputMap: { avgReceivables: "avgReceivables", annualRevenue: "annualRevenue" }, outputId: "dso" },
    { formulaId: "cost.carrying_cost_ar", inputMap: { avgReceivables: "avgReceivables", costOfCapital: "costOfCapital" }, outputId: "carryingCostAr" },
    { formulaId: "cost.bad_debt_expense", inputMap: { annualRevenue: "annualRevenue", badDebtRate: "badDebtRate" }, outputId: "badDebtExpense" },
    { formulaId: "cost.discount_cost", inputMap: { annualRevenue: "annualRevenue", discountRate: "discountRate", discountTakeRate: "discountTakeRate" }, outputId: "discountCost" },
    { formulaId: "measurement.cash_flow_impact_terms", inputMap: { currentTerms: "currentTerms", proposedTerms: "proposedTerms", annualRevenue: "annualRevenue" }, outputId: "cashFlowImpact" },
    { formulaId: "cost.npv_terms", inputMap: { cashFlowImpact: "cashFlowImpact", costOfCapital: "costOfCapital" }, outputId: "npvTerms" },
  ],
  reportTemplate: { title: "Payment Terms Optimization Report", title_i18n: {"en":"Payment Terms Optimization Report","tr":"Payment Terms Optimization Report"}, sections: ["executive_summary", "thresholds", "action_plan", "assumptions"], exportFormats: ["pdf", "excel"] },
  assumptions: { hiddenLossMultiplier: 1.0, volatilityPercent: 5, targetMarginPercent: 15, assumptionNotes: ["DSO = (Ort. Alacak / Gelir) × 365.", "Taşıma maliyeti = Alacak × Sermaye Maliyeti.", "İskonto maliyeti = Gelir × İskonto × Kullanım.", "NBD = nakit akış etkisi / (1 + r)^t."],assumptionNotes_i18n:[{"en":"DSO = (Avg. Receivables / Revenue) × 365.","tr":"DSO = (Ort. Alacak / Gelir) × 365."},{"en":"Carrying cost = Receivables × Cost of Capital.","tr":"Taşıma maliyeti = Alacak × Sermaye Maliyeti."},{"en":"Discount cost = Revenue × Discount × Usage.","tr":"İskonto maliyeti = Gelir × İskonto × Kullanım."},{"en":"NPV = cash flow impact / (1 + r)^t.","tr":"NBD = nakit akış etkisi / (1 + r)^t."}] },
};
