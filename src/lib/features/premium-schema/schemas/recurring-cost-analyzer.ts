/**
 * Tool #24 — Tekrarlayan Maliyet RCA
 */
import type { PremiumCalculatorSchema } from "@/lib/features/premium-schema/premium-calculator-schema";
export const RECURRING_COST_SCHEMA: PremiumCalculatorSchema = {
  id: "recurring-cost-analyzer", legacyPaidSlug: "recurring-cost-analyzer",
  name: "Recurring Cost Root Cause Analysis", name_i18n: {"en":"Recurring Cost Root Cause Analysis"}, sectorSlug: "quality", category: "cost",
  painStatement: "If recurring errors and costs continue without root cause analysis, total loss grows exponentially.", painStatement_i18n: {"en":"If recurring errors and costs continue without root cause analysis, total loss grows exponentially."},
  inputs: [
    { id: "monthlyRecurringCost", label: "Monthly Recurring Cost", label_i18n: {"en":"Monthly Recurring Cost"}, type: "number", unit: "USD/ay", required: true, smartDefault: 5000, validation: { min: 1 }, helper: "", expertMeaning: "Monthly recurring defect cost", expertMeaning_i18n: {"en":"Monthly recurring defect cost"} },
    { id: "eliminationProjectCost", label: "Giderme Proje Maliyeti", label_i18n: {"en":"Elimination Project Cost"}, type: "number", unit: "USD", required: true, smartDefault: 40000, validation: { min: 1 }, helper: "", expertMeaning: "Root cause elimination project cost", expertMeaning_i18n: {"en":"Root cause elimination project cost"} },
    { id: "expectedLifeYears", label: "Beklenen Proje Ömrü", label_i18n: {"en":"Expected Project Life"}, type: "number", unit: "yıl", required: true, smartDefault: 5, validation: { min: 1 }, helper: "", expertMeaning: "Expected benefit life in years", expertMeaning_i18n: {"en":"Expected benefit life in years"} },
    { id: "discountRate", label: "Discount Rate", label_i18n: {"en":"Discount Rate"}, type: "number", unit: "%", required: false, smartDefault: 10, validation: { min: 0, max: 100 }, helper: "", expertMeaning: "Discount rate for NPV", expertMeaning_i18n: {"en":"Discount rate for NPV"} },
    { id: "annualGrowthRecurring", label: "Annual Cost Growth Rate", label_i18n: {"en":"Annual Cost Growth Rate"}, type: "number", unit: "%", required: false, smartDefault: 3, validation: { min: 0, max: 100 }, helper: "", expertMeaning: "Annual cost growth rate", expertMeaning_i18n: {"en":"Annual cost growth rate"} },
  ],
  outputs: [
    { id: "recurringAnnualCost", label: "Annual Recurring Cost", label_i18n: {"en":"Annual Recurring Cost"}, unit: "USD/yıl", format: "currency" },
    { id: "presentValueRecurring", label: "PV of Recurring Cost", label_i18n: {"en":"PV of Recurring Cost"}, unit: "USD", format: "currency" },
    { id: "npvElimination", label: "Giderme Projesi NPV", label_i18n: {"en":"Elimination Project NPV"}, unit: "USD", format: "currency" },
    { id: "rootCausePayback", label: "Kök Neden Geri Ödeme Süresi", label_i18n: {"en":"Root Cause Payback Period"}, unit: "ay", format: "number" },
  ],
  thresholds: [{ fieldId: "rootCausePayback", warning: 12, critical: 24, direction: "higher_is_bad", warningMessage: "Payback period > 12 months — prioritize accordingly.", warningMessage_i18n: {"en":"Payback period > 12 months — prioritize accordingly."}, criticalMessage: "Payback period > 24 months — question project feasibility.", criticalMessage_i18n: {"en":"Payback period > 24 months — question project feasibility."} }],
  formulaPipeline: [
    { formulaId: "cost.recurring_annual_cost", inputMap: { monthlyRecurringCost: "monthlyRecurringCost" ,
        monthlyCost: "monthlyCost"}, outputId: "recurringAnnualCost" },
    { formulaId: "cost.present_value_recurring", inputMap: { recurringAnnualCost: "recurringAnnualCost", discountRate: "discountRate", expectedLifeYears: "expectedLifeYears" ,
        years: "years"}, outputId: "presentValueRecurring" },
    { formulaId: "cost.npv_elimination", inputMap: { presentValueRecurring: "presentValueRecurring", eliminationProjectCost: "eliminationProjectCost" ,
        eliminationCost: "eliminationCost"}, outputId: "npvElimination" },
    { formulaId: "cost.root_cause_payback", inputMap: {
        eliminationProjectCost: "eliminationProjectCost",
        recurringAnnualCost: "monthlyRecurringCost"
      ,
        fixCost: "fixCost"}, outputId: "rootCausePayback" },
  ],
  reportTemplate: { title: "Recurring Cost Root Cause Report", title_i18n: {"en":"Recurring Cost Root Cause Report"}, sections: ["executive_summary", "thresholds", "action_plan", "assumptions"], exportFormats: ["pdf", "excel"] },
  assumptions: { hiddenLossMultiplier: 1.2, volatilityPercent: 8, targetMarginPercent: 15, assumptionNotes: ["NPV = PV(Savings) − ProjectCost.", "Payback = ProjectCost / MonthlySavings.", "Discount rate reflects WACC."],assumptionNotes_i18n:[{"en":"NPV = PV(Savings) − ProjectCost."},{"en":"Payback = ProjectCost / MonthlySavings."},{"en":"Discount rate reflects WACC."}] },
};
