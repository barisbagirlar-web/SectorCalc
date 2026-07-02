
import type { PremiumCalculatorSchema } from "@/lib/features/premium-schema/premium-calculator-schema";
export const SUBCONTRACTOR_MARGIN_LEAK_SCHEMA: PremiumCalculatorSchema = {
  id: "subcontractor-margin-leak-analyzer", legacyPaidSlug: "subcontractor-margin-leak-analyzer",
  name: "Subcontractor Margin Leak Analysis", name_i18n: {"en":"Subcontractor Margin Leak Analysis"}, sectorSlug: "construction", category: "cost",
  painStatement: "If the difference between quoted subcontractor margin and actual margin is not monitored, project profitability silently erodes.", painStatement_i18n: {"en":"If the difference between quoted subcontractor margin and actual margin is not monitored, project profitability silently erodes."},
  inputs: [
    { id: "quotedAmount", label: "Quoted Amount", label_i18n: {"en":"Quoted Amount"}, type: "number", unit: "USD", required: true, smartDefault: 50000, validation: { min: 1 }, helper: "", expertMeaning: "Quoted subcontractor amount", expertMeaning_i18n: {"en":"Quoted subcontractor amount"} },
    { id: "actualCost", label: "Actual subcontractor cost", label_i18n: {"en":"Actual subcontractor cost"}, type: "number", unit: "USD", required: true, smartDefault: 55000, validation: { min: 1 }, helper: "", expertMeaning: "Actual subcontractor cost", expertMeaning_i18n: {"en":"Actual subcontractor cost"} },
    { id: "contractMargin", label: "Contractual margin percentage", label_i18n: {"en":"Contractual margin percentage"}, type: "number", unit: "%", required: true, smartDefault: 15, validation: { min: 0, max: 100 }, helper: "", expertMeaning: "Contractual margin percentage", expertMeaning_i18n: {"en":"Contractual margin percentage"} },
    { id: "totalSubBudgets", label: "Total subcontractor budget", label_i18n: {"en":"Total subcontractor budget"}, type: "number", unit: "USD", required: false, smartDefault: 500000, validation: { min: 0 }, helper: "", expertMeaning: "Total subcontractor budget", expertMeaning_i18n: {"en":"Total subcontractor budget"} },
  ],
  outputs: [
    { id: "quotedMargin", label: "quote Margin", label_i18n: {"en":"quote Margin"}, unit: "%", format: "percentage" },
    { id: "actualMargin", label: "Gerceklesen Margin", label_i18n: {"en":"Gerceklesen Margin"}, unit: "%", format: "percentage" },
    { id: "marginLeakSub", label: "Margin Kacag", label_i18n: {"en":"Margin Kacag"}, unit: "USD", format: "currency" },
    { id: "leakagePct", label: "Leak Rate", label_i18n: {"en":"Leak Rate"}, unit: "%", format: "percentage" },
  ],
  thresholds: [{ fieldId: "leakagePct", warning: 5, critical: 15, direction: "higher_is_bad", warningMessage: "Margin leakage > 5% - subcontractor monitoring should be increased.", warningMessage_i18n: {"en":"Margin leakage > 5% - subcontractor monitoring should be increased."}, criticalMessage: "Margin leakage > 15% - subcontractor contracts should be renewed.", criticalMessage_i18n: {"en":"Margin leakage > 15% - subcontractor contracts should be renewed."} }],
  formulaPipeline: [
    { formulaId: "measurement.quoted_margin", inputMap: { quotedAmount: "quotedAmount", actualCost: "actualCost" ,
        quotedPrice: "quotedPrice",
        estimatedCost: "estimatedCost"}, outputId: "quotedMargin" },
    { formulaId: "measurement.actual_margin", inputMap: { actualCost: "actualCost", contractMargin: "contractMargin" ,
        actualRevenue: "actualRevenue"}, outputId: "actualMargin" },
    { formulaId: "cost.margin_leak_sub", inputMap: { quotedMargin: "quotedMargin", actualMargin: "actualMargin", totalSubBudgets: "totalSubBudgets" }, outputId: "marginLeakSub" },
    { formulaId: "cost.leakage_pct", inputMap: { quotedMargin: "quotedMargin", actualMargin: "actualMargin" ,
        marginLeakSub: "marginLeakSub"}, outputId: "leakagePct" },
  ],
  reportTemplate: { title: "Subcontractor Margin Leak Report", title_i18n: {"en":"Subcontractor Margin Leak Report"}, sections: ["executive_summary", "thresholds", "action_plan", "assumptions"], exportFormats: ["pdf", "excel"] },
  assumptions: { hiddenLossMultiplier: 1.2, volatilityPercent: 10, targetMarginPercent: 18, assumptionNotes: ["Quoted margin % = (Quoted − Cost) / Quoted.", "Actual margin reflects true cost.", "Leakage extrapolated to total budget."],assumptionNotes_i18n:[{"en":"Quoted margin % = (Quoted − Cost) / Quoted."},{"en":"Actual margin reflects true cost."},{"en":"Leakage extrapolated to total budget."}] },
};
