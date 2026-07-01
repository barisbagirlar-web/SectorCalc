/**
 * Tool #30 — Payment Terms Optimizer
 */
import type { PremiumCalculatorSchema } from "@/lib/features/premium-schema/premium-calculator-schema";
export const PAYMENT_TERMS_OPTIMIZER_SCHEMA: PremiumCalculatorSchema = {
  id: "payment-terms-optimizer-analyzer", legacyPaidSlug: "payment-terms-optimizer-analyzer",
  name: "Payment Terms Optimizer", name_i18n: {"en":"Payment Terms Optimizer"}, sectorSlug: "financial-planning", category: "cost",
  painStatement: "Long payment terms boost customer satisfaction but strain cash flow; short terms accelerate collection but may reduce sales.", painStatement_i18n: {"en":"Long payment terms boost customer satisfaction but strain cash flow; short terms accelerate collection but may reduce sales."},
  inputs: [
    { id: "avgReceivables", label: "Ortalama Alacak Bakiyesi", label_i18n: {"en":"Average Receivable Bakiyesi"}, type: "number", unit: "USD", required: true, smartDefault: 500000, validation: { min: 1 }, helper: "", expertMeaning: "Average accounts receivable balance", expertMeaning_i18n: {"en":"Average accounts receivable balance"} },
    { id: "annualRevenue", label: "Annual revenue", label_i18n: {"en":"Annual revenue"}, type: "number", unit: "USD", required: true, smartDefault: 5000000, validation: { min: 1 }, helper: "", expertMeaning: "Annual revenue", expertMeaning_i18n: {"en":"Annual revenue"} },
    { id: "costOfCapital", label: "Cost of Capital", label_i18n: {"en":"Cost of Capital"}, type: "number", unit: "%", required: true, smartDefault: 12, validation: { min: 0.1 }, helper: "", expertMeaning: "Annual cost of capital", expertMeaning_i18n: {"en":"Annual cost of capital"} },
    { id: "currentTerms", label: "Mevcut Vade", label_i18n: {"en":"Current Vade"}, type: "number", unit: "gün", required: true, smartDefault: 45, validation: { min: 1 }, helper: "", expertMeaning: "Current payment terms in days", expertMeaning_i18n: {"en":"Current payment terms in days"} },
    { id: "proposedTerms", label: "Önerilen Vade", label_i18n: {"en":"Proposed payment terms in days"}, type: "number", unit: "gün", required: true, smartDefault: 30, validation: { min: 1 }, helper: "", expertMeaning: "Proposed payment terms in days", expertMeaning_i18n: {"en":"Proposed payment terms in days"} },
    { id: "badDebtRate", label: "Historical bad debt rate", label_i18n: {"en":"Historical bad debt rate"}, type: "number", unit: "%", required: false, smartDefault: 2.5, validation: { min: 0 }, helper: "", expertMeaning: "Historical bad debt rate", expertMeaning_i18n: {"en":"Historical bad debt rate"} },
    { id: "discountRate", label: "Early payment discount rate", label_i18n: {"en":"Early payment discount rate"}, type: "number", unit: "%", required: false, smartDefault: 2, validation: { min: 0 }, helper: "", expertMeaning: "Early payment discount rate", expertMeaning_i18n: {"en":"Early payment discount rate"} },
    { id: "discountTakeRate", label: "Percentage of customers taking discount", label_i18n: {"en":"Percentage of customers taking discount"}, type: "number", unit: "%", required: false, smartDefault: 30, validation: { min: 0, max: 100 }, helper: "", expertMeaning: "Percentage of customers taking discount", expertMeaning_i18n: {"en":"Percentage of customers taking discount"} },
  ],
  outputs: [
    { id: "dso", label: "Alacak Tahsil Süresi (DSO)", label_i18n: {"en":"Receivable Collection Period (DSO)"}, unit: "gün", format: "number" },
    { id: "carryingCostAr", label: "Receivable Carrying Cost", label_i18n: {"en":"Receivable Carrying Cost"}, unit: "USD/yıl", format: "currency" },
    { id: "badDebtExpense", label: "Supheli Alacak Gideri", label_i18n: {"en":"Supheli Receivable Gideri"}, unit: "USD/yıl", format: "currency" },
    { id: "discountCost", label: "Discount Cost", label_i18n: {"en":"Discount Cost"}, unit: "USD/yıl", format: "currency" },
    { id: "cashFlowImpact", label: "Nakit Aks Etkisi", label_i18n: {"en":"cash Aks Etkisi"}, unit: "USD", format: "currency", isBigNumber: true },
    { id: "npvTerms", label: "Vade Degisimi Net Bugunku Deger", label_i18n: {"en":"Vade Degisimi Net Bugunku Value"}, unit: "USD", format: "currency", isBigNumber: true },
  ],
  thresholds: [{ fieldId: "dso", warning: 45, critical: 60, direction: "higher_is_bad", warningMessage: "DSO > 45 gün — tahsilat politikası gözden geçirilmeli.", warningMessage_i18n: {"en":"DSO > 45 gün — tahsilat policy gözden geçirilmeli."}, criticalMessage: "DSO > 60 gün — ciddi nakit akışı riski.", criticalMessage_i18n: {"en":"DSO > 60 gün — serious cash akışı riski."} }],
  formulaPipeline: [
    { formulaId: "measurement.dso", inputMap: { avgReceivables: "avgReceivables", annualRevenue: "annualRevenue" ,
        accountsReceivable: "accountsReceivable"}, outputId: "dso" },
    { formulaId: "cost.carrying_cost_ar", inputMap: { avgReceivables: "avgReceivables", costOfCapital: "costOfCapital" ,
        accountsReceivable: "accountsReceivable"}, outputId: "carryingCostAr" },
    { formulaId: "cost.bad_debt_expense", inputMap: { annualRevenue: "annualRevenue", badDebtRate: "badDebtRate" ,
        creditSales: "creditSales"}, outputId: "badDebtExpense" },
    { formulaId: "cost.discount_cost", inputMap: { annualRevenue: "annualRevenue", discountRate: "discountRate", discountTakeRate: "discountTakeRate" ,
        discountEligibleSales: "discountEligibleSales"}, outputId: "discountCost" },
    { formulaId: "measurement.cash_flow_impact_terms", inputMap: { currentTerms: "currentTerms", proposedTerms: "proposedTerms", annualRevenue: "annualRevenue" ,
        newDso: "newDso",
        currentDso: "currentDso",
        avgDailySales: "avgDailySales"}, outputId: "cashFlowImpact" },
    { formulaId: "cost.npv_terms", inputMap: {
        cashFlowImpact: "cashFlowImpact",
        discountRate: "costOfCapital"
      ,
        discountCost: "discountCost"}, outputId: "npvTerms" },
  ],
  reportTemplate: { title: "Payment Terms Optimization Report", title_i18n: {"en":"Payment Terms Optimization Report"}, sections: ["executive_summary", "thresholds", "action_plan", "assumptions"], exportFormats: ["pdf", "excel"] },
  assumptions: { hiddenLossMultiplier: 1.0, volatilityPercent: 5, targetMarginPercent: 15, assumptionNotes: ["DSO = (Ort. Alacak / Gelir) × 365.", "Taşıma maliyeti = Alacak × Sermaye Maliyeti.", "İskonto maliyeti = Gelir × İskonto × Kullanım.", "NBD = nakit akış etkisi / (1 + r)^t."],assumptionNotes_i18n:[{"en":"DSO = (Ort. Alacak / Gelir) × 365."},{"en":"Taşıma maliyeti = Alacak × Sermaye Maliyeti."},{"en":"İskonto maliyeti = Gelir × İskonto × Kullanım."},{"en":"NBD = nakit akış etkisi / (1 + r)^t."}] },
};
