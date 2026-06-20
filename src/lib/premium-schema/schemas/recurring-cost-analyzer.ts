/**
 * Tool #24 — Tekrarlayan Maliyet RCA
 */
import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";
export const RECURRING_COST_SCHEMA: PremiumCalculatorSchema = {
  id: "recurring-cost-analyzer", legacyPaidSlug: "recurring-cost-analyzer",
  name: "Tekrarlayan Maliyet Kök Neden Analizi", sectorSlug: "quality", category: "cost",
  painStatement: "Tekrarlayan hatalar ve maliyetler kök neden analizi yapılmadan devam ederse toplam kayıp katlanarak büyür.",
  inputs: [
    { id: "monthlyRecurringCost", label: "Aylık Tekrarlayan Maliyet", type: "number", unit: "USD/ay", required: true, smartDefault: 5000, validation: { min: 1 }, helper: "", expertMeaning: "Monthly recurring defect cost" },
    { id: "eliminationProjectCost", label: "Giderme Proje Maliyeti", type: "number", unit: "USD", required: true, smartDefault: 40000, validation: { min: 1 }, helper: "", expertMeaning: "Root cause elimination project cost" },
    { id: "expectedLifeYears", label: "Beklenen Proje Ömrü", type: "number", unit: "yıl", required: true, smartDefault: 5, validation: { min: 1 }, helper: "", expertMeaning: "Expected benefit life in years" },
    { id: "discountRate", label: "İskonto Oranı", type: "number", unit: "%", required: false, smartDefault: 10, validation: { min: 0, max: 100 }, helper: "", expertMeaning: "Discount rate for NPV" },
    { id: "annualGrowthRecurring", label: "Yıllık Maliyet Artış Oranı", type: "number", unit: "%", required: false, smartDefault: 3, validation: { min: 0, max: 100 }, helper: "", expertMeaning: "Annual cost growth rate" },
  ],
  outputs: [
    { id: "recurringAnnualCost", label: "Yıllık Tekrarlayan Maliyet", unit: "USD/yıl", format: "currency" },
    { id: "presentValueRecurring", label: "Tekrarlayan Maliyetin Bugünkü Değeri", unit: "USD", format: "currency" },
    { id: "npvElimination", label: "Giderme Projesi NPV", unit: "USD", format: "currency" },
    { id: "rootCausePayback", label: "Kök Neden Geri Ödeme Süresi", unit: "ay", format: "number" },
  ],
  thresholds: [{ fieldId: "rootCausePayback", warning: 12, critical: 24, direction: "higher_is_bad", warningMessage: "Geri ödeme süresi > 12 ay — önceliklendirme yapılmalı.", criticalMessage: "Geri ödeme süresi > 24 ay — proje fizibilitesi sorgulanmalı." }],
  formulaPipeline: [
    { formulaId: "cost.recurring_annual_cost", inputMap: { monthlyRecurringCost: "monthlyRecurringCost" }, outputId: "recurringAnnualCost" },
    { formulaId: "cost.present_value_recurring", inputMap: { recurringAnnualCost: "recurringAnnualCost", discountRate: "discountRate", expectedLifeYears: "expectedLifeYears" }, outputId: "presentValueRecurring" },
    { formulaId: "cost.npv_elimination", inputMap: { presentValueRecurring: "presentValueRecurring", eliminationProjectCost: "eliminationProjectCost" }, outputId: "npvElimination" },
    { formulaId: "cost.root_cause_payback", inputMap: { eliminationProjectCost: "eliminationProjectCost", monthlyRecurringCost: "monthlyRecurringCost" }, outputId: "rootCausePayback" },
  ],
  reportTemplate: { title: "Recurring Cost Root Cause Report", sections: ["executive_summary", "thresholds", "action_plan", "assumptions"], exportFormats: ["pdf", "excel"] },
  assumptions: { hiddenLossMultiplier: 1.2, volatilityPercent: 8, targetMarginPercent: 15, assumptionNotes: ["NPV = PV(Savings) − ProjectCost.", "Payback = ProjectCost / MonthlySavings.", "Discount rate reflects WACC."] },
};
