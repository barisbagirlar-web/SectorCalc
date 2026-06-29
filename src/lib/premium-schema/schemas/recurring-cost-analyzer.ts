/**
 * Tool #24 — Tekrarlayan Maliyet RCA
 */
import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";
export const RECURRING_COST_SCHEMA: PremiumCalculatorSchema = {
  id: "recurring-cost-analyzer", legacyPaidSlug: "recurring-cost-analyzer",
  name: "Tekrarlayan Maliyet Kök Neden Analizi", name_i18n: {"en":"Recurring Cost Root Cause Analysis","tr":"Tekrarlayan Maliyet Kök Neden Analizi"}, sectorSlug: "quality", category: "cost",
  painStatement: "Tekrarlayan hatalar ve maliyetler kök neden analizi yapılmadan devam ederse toplam kayıp katlanarak büyür.", painStatement_i18n: {"en":"If recurring errors and costs continue without root cause analysis, total loss grows exponentially.","tr":"Tekrarlayan hatalar ve maliyetler kök neden analizi yapılmadan devam ederse toplam kayıp katlanarak büyür."},
  inputs: [
    { id: "monthlyRecurringCost", label: "Aylık Tekrarlayan Maliyet", label_i18n: {"en":"Monthly Recurring Cost","tr":"Aylık Tekrarlayan Maliyet"}, type: "number", unit: "USD/ay", required: true, smartDefault: 5000, validation: { min: 1 }, helper: "", expertMeaning: "Monthly recurring defect cost", expertMeaning_i18n: {"en":"Monthly recurring defect cost","tr":"Monthly recurring defect cost"} },
    { id: "eliminationProjectCost", label: "Giderme Proje Maliyeti", label_i18n: {"en":"Giderme Proje Maliyeti","tr":"Giderme Proje Maliyeti"}, type: "number", unit: "USD", required: true, smartDefault: 40000, validation: { min: 1 }, helper: "", expertMeaning: "Root cause elimination project cost", expertMeaning_i18n: {"en":"Root cause elimination project cost","tr":"Root cause elimination project cost"} },
    { id: "expectedLifeYears", label: "Beklenen Proje Ömrü", label_i18n: {"en":"Expected Project Life","tr":"Beklenen Proje Ömrü"}, type: "number", unit: "yıl", required: true, smartDefault: 5, validation: { min: 1 }, helper: "", expertMeaning: "Expected benefit life in years", expertMeaning_i18n: {"en":"Expected benefit life in years","tr":"Expected benefit life in years"} },
    { id: "discountRate", label: "İskonto Oranı", label_i18n: {"en":"Discount Rate","tr":"İskonto Oranı"}, type: "number", unit: "%", required: false, smartDefault: 10, validation: { min: 0, max: 100 }, helper: "", expertMeaning: "Discount rate for NPV", expertMeaning_i18n: {"en":"Discount rate for NPV","tr":"Discount rate for NPV"} },
    { id: "annualGrowthRecurring", label: "Yıllık Maliyet Artış Oranı", label_i18n: {"en":"Annual Cost Growth Rate","tr":"Yıllık Maliyet Artış Oranı"}, type: "number", unit: "%", required: false, smartDefault: 3, validation: { min: 0, max: 100 }, helper: "", expertMeaning: "Annual cost growth rate", expertMeaning_i18n: {"en":"Annual cost growth rate","tr":"Annual cost growth rate"} },
  ],
  outputs: [
    { id: "recurringAnnualCost", label: "Yıllık Tekrarlayan Maliyet", label_i18n: {"en":"Annual Recurring Cost","tr":"Yıllık Tekrarlayan Maliyet"}, unit: "USD/yıl", format: "currency" },
    { id: "presentValueRecurring", label: "Tekrarlayan Maliyetin Bugünkü Değeri", label_i18n: {"en":"PV of Recurring Cost","tr":"Tekrarlayan Maliyetin Bugünkü Değeri"}, unit: "USD", format: "currency" },
    { id: "npvElimination", label: "Giderme Projesi NPV", label_i18n: {"en":"Giderme Projesi NPV","tr":"Giderme Projesi NPV"}, unit: "USD", format: "currency" },
    { id: "rootCausePayback", label: "Kök Neden Geri Ödeme Süresi", label_i18n: {"en":"Root Cause Payback Period","tr":"Kök Neden Geri Ödeme Süresi"}, unit: "ay", format: "number" },
  ],
  thresholds: [{ fieldId: "rootCausePayback", warning: 12, critical: 24, direction: "higher_is_bad", warningMessage: "Geri ödeme süresi > 12 ay — önceliklendirme yapılmalı.", warningMessage_i18n: {"en":"Payback period > 12 months — prioritize accordingly.","tr":"Geri ödeme süresi > 12 ay — önceliklendirme yapılmalı."}, criticalMessage: "Geri ödeme süresi > 24 ay — proje fizibilitesi sorgulanmalı.", criticalMessage_i18n: {"en":"Payback period > 24 months — question project feasibility.","tr":"Geri ödeme süresi > 24 ay — proje fizibilitesi sorgulanmalı."} }],
  formulaPipeline: [
    { formulaId: "cost.recurring_annual_cost", inputMap: { monthlyRecurringCost: "monthlyRecurringCost" }, outputId: "recurringAnnualCost" },
    { formulaId: "cost.present_value_recurring", inputMap: { recurringAnnualCost: "recurringAnnualCost", discountRate: "discountRate", expectedLifeYears: "expectedLifeYears" }, outputId: "presentValueRecurring" },
    { formulaId: "cost.npv_elimination", inputMap: { presentValueRecurring: "presentValueRecurring", eliminationProjectCost: "eliminationProjectCost" }, outputId: "npvElimination" },
    { formulaId: "cost.root_cause_payback", inputMap: { eliminationProjectCost: "eliminationProjectCost", monthlyRecurringCost: "monthlyRecurringCost" }, outputId: "rootCausePayback" },
  ],
  reportTemplate: { title: "Recurring Cost Root Cause Report", title_i18n: {"en":"Recurring Cost Root Cause Report","tr":"Tekrarlayan Maliyet Kök Neden Analizi Raporu"}, sections: ["executive_summary", "thresholds", "action_plan", "assumptions"], exportFormats: ["pdf", "excel"] },
  assumptions: { hiddenLossMultiplier: 1.2, volatilityPercent: 8, targetMarginPercent: 15, assumptionNotes: ["NPV = PV(Savings) − ProjectCost.", "Payback = ProjectCost / MonthlySavings.", "Discount rate reflects WACC."],assumptionNotes_i18n:[{"en":"NPV = PV(Savings) − ProjectCost.","tr":"NBD = Tasarrufların BD'si − Proje Maliyeti."},{"en":"Payback = ProjectCost / MonthlySavings.","tr":"Geri Ödeme = ProjeMaliyeti / AylıkTasarruf."},{"en":"Discount rate reflects WACC.","tr":"İskonto oranı AOSM'yi yansıtır."}] },
};
