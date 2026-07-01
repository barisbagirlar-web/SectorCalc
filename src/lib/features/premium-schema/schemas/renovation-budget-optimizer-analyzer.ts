/**
 * Tool #38 — Yenileme Butce
 */
import type { PremiumCalculatorSchema } from "@/lib/features/premium-schema/premium-calculator-schema";
export const RENOVATION_BUDGET_SCHEMA: PremiumCalculatorSchema = {
  id: "renovation-budget-optimizer-analyzer", legacyPaidSlug: "renovation-budget-optimizer-analyzer",
  name: "Renovation Budget Optimization", name_i18n: {"en":"Renovation Budget Optimization"}, sectorSlug: "construction", category: "cost",
  painStatement: "Without budget planning in renovation projects, unexpected cost overruns and low investment returns occur. Every line item must be optimized.", painStatement_i18n: {"en":"Without budget planning in renovation projects, unexpected cost overruns and low investment returns occur. Every line item must be optimized."},
  inputs: [
    { id: "propertyValue", label: "Property Value", label_i18n: {"en":"Property Value"}, type: "number", unit: "USD", required: true, smartDefault: 500000, validation: { min: 1000 }, helper: "", expertMeaning: "Current property value", expertMeaning_i18n: {"en":"Current property value"} },
    { id: "renovationScope", label: "Renovation Scope", label_i18n: {"en":"Renovation Scope"}, type: "number", unit: "m²", required: true, smartDefault: 150, validation: { min: 1 }, helper: "", expertMeaning: "Renovation area in sqm", expertMeaning_i18n: {"en":"Renovation area in sqm"} },
    { id: "baseCostPerSqm", label: "Birim Yenileme Maliyeti", label_i18n: {"en":"Unit Renovation Cost"}, type: "number", unit: "USD/m²", required: true, smartDefault: 500, validation: { min: 10 }, helper: "", expertMeaning: "Base renovation cost per sqm", expertMeaning_i18n: {"en":"Base renovation cost per sqm"} },
    { id: "expectedValueAfter", label: "Post-Renovation Value", label_i18n: {"en":"Post-Renovation Value"}, type: "number", unit: "USD", required: true, smartDefault: 650000, validation: { min: 1 }, helper: "", expertMeaning: "Expected value after renovation", expertMeaning_i18n: {"en":"Expected value after renovation"} },
    { id: "contingencyPercent", label: "Contingency Rate", label_i18n: {"en":"Contingency Rate"}, type: "number", unit: "%", required: false, smartDefault: 15, validation: { min: 0, max: 50 }, helper: "", expertMeaning: "Contingency budget percentage", expertMeaning_i18n: {"en":"Contingency budget percentage"} },
    { id: "laborCostPercent", label: "Labor Cost Percentage", label_i18n: {"en":"Labor Cost Percentage"}, type: "number", unit: "%", required: false, smartDefault: 40, validation: { min: 0, max: 100 }, helper: "", expertMeaning: "Labor cost percentage", expertMeaning_i18n: {"en":"Labor cost percentage"} },
    { id: "materialCostPercent", label: "Material Cost Percentage", label_i18n: {"en":"Material Cost Percentage"}, type: "number", unit: "%", required: false, smartDefault: 35, validation: { min: 0, max: 100 }, helper: "", expertMeaning: "Material cost percentage", expertMeaning_i18n: {"en":"Material cost percentage"} },
  ],
  outputs: [
    { id: "renovationBaseCost", label: "Temel Yenileme Maliyeti", label_i18n: {"en":"Base Renovation Cost"}, unit: "USD", format: "currency" },
    { id: "renovationTotalBudget", label: "Total Renovation Budget", label_i18n: {"en":"Total Renovation Budget"}, unit: "USD", format: "currency", isBigNumber: true },
    { id: "renovationRoi", label: "Renovation ROI", label_i18n: {"en":"Renovation ROI"}, unit: "%", format: "percentage" },
    { id: "budgetBreakdown", label: "Budget Breakdown (Labor + Material)", label_i18n: {"en":"Budget Breakdown (Labor + Material)"}, unit: "USD", format: "currency" },
  ],
  thresholds: [
    { fieldId: "renovationRoi", warning: 15, critical: 5, direction: "lower_is_bad", warningMessage: "ROI < 15% — renovation scope should be reduced.", warningMessage_i18n: {"en":"ROI < 15% — renovation scope should be reduced."}, criticalMessage: "ROI < 5% — renovation project should be re-evaluated.", criticalMessage_i18n: {"en":"ROI < 5% — renovation project should be re-evaluated."} },
    { fieldId: "renovationTotalBudget", warning: 100000, critical: 250000, direction: "higher_is_bad", warningMessage: "Budget > $100K — obtain alternative quotes.", warningMessage_i18n: {"en":"Budget > $100K — obtain alternative quotes."}, criticalMessage: "Budget > $250K — feasibility study required.", criticalMessage_i18n: {"en":"Budget > $250K — feasibility study required."} },
  ],
  formulaPipeline: [
    { formulaId: "cost.renovation_base_cost", inputMap: {
        areaSqm: "renovationScope",
        costPerSqm: "baseCostPerSqm"
      }, outputId: "renovationBaseCost" },
    { formulaId: "cost.renovation_total_budget", inputMap: {
        renovationBaseCost: "renovationBaseCost",
        contingencyBudget: "contingencyPercent"
      ,
        designFee: "designFee"}, outputId: "renovationTotalBudget" },
    { formulaId: "cost.renovation_roi", inputMap: {
        renovationTotalBudget: "renovationTotalBudget",
        valueAfter: "expectedValueAfter",
        propertyValue: "propertyValue"
      }, outputId: "renovationRoi" },
    { formulaId: "cost.renovation_budget_breakdown", inputMap: { renovationTotalBudget: "renovationTotalBudget", laborCostPercent: "laborCostPercent", materialCostPercent: "materialCostPercent" ,
        renovationBaseCost: "renovationBaseCost",
        contingencyBudget: "contingencyBudget",
        designFee: "designFee"}, outputId: "budgetBreakdown" },
  ],
  reportTemplate: { title: "Renovation Budget Optimization Report", title_i18n: {"en":"Renovation Budget Optimization Report"}, sections: ["executive_summary", "loss_breakdown", "thresholds", "action_plan", "assumptions"], exportFormats: ["pdf", "excel"] },
  assumptions: { hiddenLossMultiplier: 1.2, volatilityPercent: 15, targetMarginPercent: 20, assumptionNotes: ["Temel maliyet = alan × birim maliyet.", "Total budget = base cost × (1 + contingency rate).", "ROI = (new value - current value - budget) / budget × 100."],assumptionNotes_i18n:[{"en":"Base cost = area × unit cost."},{"en":"Total budget = base cost × (1 + contingency rate)."},{"en":"ROI = (new value - current value - budget) / budget × 100."}] },
};
