/**
 * Tool #30 — Ödeme Vadesi Optimizasyonu
 */
import type { PremiumCalculatorSchema } from "@/lib/features/premium-schema/premium-calculator-schema";
export const PAYMENT_TERMS_OPTIMIZER_SCHEMA: PremiumCalculatorSchema = {
  id: "payment-terms-optimizer-analyzer", legacyPaidSlug: "payment-terms-optimizer-analyzer",
  name: "Ödeme Vadesi Optimizasyonu", name_i18n: {"en":"odeme Vadesi Optimizasyonu","tr":"Ödeme Vadesi Optimizasyonu"}, sectorSlug: "financial-planning", category: "cost",
  painStatement: "Uzun vade müşteri memnuniyetini artırır ama nakit akışını boğar; kısa vade tahsilatı hızlandırır ama satış kaybı yaratır.", painStatement_i18n: {"en":"Uzun vade müşteri memnuniyetini artırır ama nakit akışını boğar; kısa vade tahsilatı hızlandırır ama satış kaybı yaratır.","tr":"Uzun vade müşteri memnuniyetini artırır ama nakit akışını boğar; kısa vade tahsilatı hızlandırır ama satış kaybı yaratır."},
  inputs: [
    { id: "avgReceivables", label: "Ortalama Alacak Bakiyesi", label_i18n: {"en":"Ortalama Alacak Bakiyesi","tr":"Ortalama Alacak Bakiyesi"}, type: "number", unit: "USD", required: true, smartDefault: 500000, validation: { min: 1 }, helper: "", expertMeaning: "Average accounts receivable balance", expertMeaning_i18n: {"en":"Average accounts receivable balance","tr":"Average accounts receivable balance"} },
    { id: "annualRevenue", label: "Yıllık Gelir", label_i18n: {"en":"Annual revenue","tr":"Yıllık Gelir"}, type: "number", unit: "USD", required: true, smartDefault: 5000000, validation: { min: 1 }, helper: "", expertMeaning: "Annual revenue", expertMeaning_i18n: {"en":"Annual revenue","tr":"yıllık gelir"} },
    { id: "costOfCapital", label: "Sermaye Maliyeti", label_i18n: {"en":"Sermaye Maliyeti","tr":"Sermaye Maliyeti"}, type: "number", unit: "%", required: true, smartDefault: 12, validation: { min: 0.1 }, helper: "", expertMeaning: "Annual cost of capital", expertMeaning_i18n: {"en":"Annual cost of capital","tr":"Annual cost of capital"} },
    { id: "currentTerms", label: "Mevcut Vade", label_i18n: {"en":"Mevcut Vade","tr":"Mevcut Vade"}, type: "number", unit: "gün", required: true, smartDefault: 45, validation: { min: 1 }, helper: "", expertMeaning: "Current payment terms in days", expertMeaning_i18n: {"en":"Current payment terms in days","tr":"Current payment terms in days"} },
    { id: "proposedTerms", label: "Önerilen Vade", label_i18n: {"en":"Proposed payment terms in days","tr":"Önerilen Vade"}, type: "number", unit: "gün", required: true, smartDefault: 30, validation: { min: 1 }, helper: "", expertMeaning: "Proposed payment terms in days", expertMeaning_i18n: {"en":"Proposed payment terms in days","tr":"önerilen vade"} },
    { id: "badDebtRate", label: "Şüpheli Alacak Oranı", label_i18n: {"en":"Historical bad debt rate","tr":"Şüpheli Alacak Oranı"}, type: "number", unit: "%", required: false, smartDefault: 2.5, validation: { min: 0 }, helper: "", expertMeaning: "Historical bad debt rate", expertMeaning_i18n: {"en":"Historical bad debt rate","tr":"şüpheli alacak oranı"} },
    { id: "discountRate", label: "Erken Ödeme İskonto Oranı", label_i18n: {"en":"Early payment discount rate","tr":"Erken Ödeme İskonto Oranı"}, type: "number", unit: "%", required: false, smartDefault: 2, validation: { min: 0 }, helper: "", expertMeaning: "Early payment discount rate", expertMeaning_i18n: {"en":"Early payment discount rate","tr":"erken ödeme i̇skonto oranı"} },
    { id: "discountTakeRate", label: "İskonto Kullanım Oranı", label_i18n: {"en":"Percentage of customers taking discount","tr":"İskonto Kullanım Oranı"}, type: "number", unit: "%", required: false, smartDefault: 30, validation: { min: 0, max: 100 }, helper: "", expertMeaning: "Percentage of customers taking discount", expertMeaning_i18n: {"en":"Percentage of customers taking discount","tr":"i̇skonto kullanım oranı"} },
  ],
  outputs: [
    { id: "dso", label: "Alacak Tahsil Süresi (DSO)", label_i18n: {"en":"Alacak Tahsil Suresi (DSO)","tr":"Alacak Tahsil Süresi (DSO)"}, unit: "gün", format: "number" },
    { id: "carryingCostAr", label: "Alacak Taşıma Maliyeti", label_i18n: {"en":"Alacak Tasma Maliyeti","tr":"Alacak Taşıma Maliyeti"}, unit: "USD/yıl", format: "currency" },
    { id: "badDebtExpense", label: "Şüpheli Alacak Gideri", label_i18n: {"en":"Supheli Alacak Gideri","tr":"Şüpheli Alacak Gideri"}, unit: "USD/yıl", format: "currency" },
    { id: "discountCost", label: "İskonto Maliyeti", label_i18n: {"en":"Iskonto Maliyeti","tr":"İskonto Maliyeti"}, unit: "USD/yıl", format: "currency" },
    { id: "cashFlowImpact", label: "Nakit Akış Etkisi", label_i18n: {"en":"Nakit Aks Etkisi","tr":"Nakit Akış Etkisi"}, unit: "USD", format: "currency", isBigNumber: true },
    { id: "npvTerms", label: "Vade Değişimi Net Bugünkü Değer", label_i18n: {"en":"Vade Degisimi Net Bugunku Deger","tr":"Vade Değişimi Net Bugünkü Değer"}, unit: "USD", format: "currency", isBigNumber: true },
  ],
  thresholds: [{ fieldId: "dso", warning: 45, critical: 60, direction: "higher_is_bad", warningMessage: "DSO > 45 gün — tahsilat politikası gözden geçirilmeli.", warningMessage_i18n: {"en":"DSO > 45 gün — tahsilat politikası gözden geçirilmeli.","tr":"DSO > 45 gün — tahsilat politikası gözden geçirilmeli."}, criticalMessage: "DSO > 60 gün — ciddi nakit akışı riski.", criticalMessage_i18n: {"en":"DSO > 60 gün — ciddi nakit akışı riski.","tr":"DSO > 60 gün — ciddi nakit akışı riski."} }],
  formulaPipeline: [
    { formulaId: "measurement.dso", inputMap: { avgReceivables: "avgReceivables", annualRevenue: "annualRevenue" }, outputId: "dso" },
    { formulaId: "cost.carrying_cost_ar", inputMap: { avgReceivables: "avgReceivables", costOfCapital: "costOfCapital" }, outputId: "carryingCostAr" },
    { formulaId: "cost.bad_debt_expense", inputMap: { annualRevenue: "annualRevenue", badDebtRate: "badDebtRate" }, outputId: "badDebtExpense" },
    { formulaId: "cost.discount_cost", inputMap: { annualRevenue: "annualRevenue", discountRate: "discountRate", discountTakeRate: "discountTakeRate" }, outputId: "discountCost" },
    { formulaId: "measurement.cash_flow_impact_terms", inputMap: { currentTerms: "currentTerms", proposedTerms: "proposedTerms", annualRevenue: "annualRevenue" }, outputId: "cashFlowImpact" },
    { formulaId: "cost.npv_terms", inputMap: {
        cashFlowImpact: "cashFlowImpact",
        discountRate: "costOfCapital"
      }, outputId: "npvTerms" },
  ],
  reportTemplate: { title: "Payment Terms Optimization Report", title_i18n: {"en":"Payment Terms Optimization Report","tr":"Payment Terms Optimization Report"}, sections: ["executive_summary", "thresholds", "action_plan", "assumptions"], exportFormats: ["pdf", "excel"] },
  assumptions: { hiddenLossMultiplier: 1.0, volatilityPercent: 5, targetMarginPercent: 15, assumptionNotes: ["DSO = (Ort. Alacak / Gelir) × 365.", "Taşıma maliyeti = Alacak × Sermaye Maliyeti.", "İskonto maliyeti = Gelir × İskonto × Kullanım.", "NBD = nakit akış etkisi / (1 + r)^t."],assumptionNotes_i18n:[{"en":"DSO = (Ort. Alacak / Gelir) × 365.","tr":"DSO = (Ort. Alacak / Gelir) × 365."},{"en":"Taşıma maliyeti = Alacak × Sermaye Maliyeti.","tr":"Taşıma maliyeti = Alacak × Sermaye Maliyeti."},{"en":"İskonto maliyeti = Gelir × İskonto × Kullanım.","tr":"İskonto maliyeti = Gelir × İskonto × Kullanım."},{"en":"NBD = nakit akış etkisi / (1 + r)^t.","tr":"NBD = nakit akış etkisi / (1 + r)^t."}] },
};
