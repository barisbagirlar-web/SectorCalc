/**
 * Tool #34 — VSM Finansal Converter
 */
import type { PremiumCalculatorSchema } from "@/lib/features/premium-schema/premium-calculator-schema";
export const VSM_FINANCIAL_SCHEMA: PremiumCalculatorSchema = {
  id: "vsm-financial-converter-analyzer", legacyPaidSlug: "vsm-financial-converter-analyzer",
  name: "VSM Financial Converter", name_i18n: {"en":"VSM Financial Converter"}, sectorSlug: "quality", category: "cost",
  painStatement: "Value Stream Mapping (VSM) studies show operational processes but do not measure financial impact. If the monetary equivalent of non-value-added steps is unknown, improvements cannot be prioritized.", painStatement_i18n: {"en":"Value Stream Mapping (VSM) studies show operational processes but do not measure financial impact. If the monetary equivalent of non-value-added steps is unknown, improvements cannot be prioritized."},
  inputs: [
    { id: "totalLeadTime", label: "Toplam Teslim Suresi", label_i18n: {"en":"Total Lead Time"}, type: "number", unit: "dk", required: true, smartDefault: 480, validation: { min: 1 }, helper: "", expertMeaning: "Total lead time from order to delivery", expertMeaning_i18n: {"en":"Total lead time from order to delivery"} },
    { id: "valueAddedTime", label: "Value-Added Time", label_i18n: {"en":"Value-Added Time"}, type: "number", unit: "dk", required: true, smartDefault: 120, validation: { min: 1 }, helper: "", expertMeaning: "Value-added processing time", expertMeaning_i18n: {"en":"Value-added processing time"} },
    { id: "dailyProduction", label: "Daily Production Quantity", label_i18n: {"en":"Daily Production Quantity"}, type: "number", unit: "adet/gun", required: true, smartDefault: 500, validation: { min: 1 }, helper: "", expertMeaning: "Daily production volume", expertMeaning_i18n: {"en":"Daily production volume"} },
    { id: "costPerMinute", label: "Cost Per Minute", label_i18n: {"en":"Cost Per Minute"}, type: "number", unit: "USD/dk", required: true, smartDefault: 1.5, validation: { min: 0.01 }, helper: "", expertMeaning: "Operating cost per minute", expertMeaning_i18n: {"en":"Operating cost per minute"} },
    { id: "operatingDays", label: "Operating Days / Year", label_i18n: {"en":"Operating Days / Year"}, type: "number", unit: "gun", required: false, smartDefault: 240, validation: { min: 1 }, helper: "", expertMeaning: "Annual operating days", expertMeaning_i18n: {"en":"Annual operating days"} },
    { id: "reworkPercent", label: "Rework Rate", label_i18n: {"en":"Rework Rate"}, type: "number", unit: "%", required: false, smartDefault: 5, validation: { min: 0, max: 100 }, helper: "", expertMeaning: "Rework percentage", expertMeaning_i18n: {"en":"Rework percentage"} },
  ],
  outputs: [
    { id: "vsmLeadtimeCost", label: "Teslim Suresi Maliyeti", label_i18n: {"en":"Lead Time Cost"}, unit: "USD/gun", format: "currency" },
    { id: "vsmValueAddedRatio", label: "Value-Added Ratio", label_i18n: {"en":"Value-Added Ratio"}, unit: "%", format: "percentage" },
    { id: "vsmNonValueAddedCost", label: "Non-Value-Added Cost", label_i18n: {"en":"Non-Value-Added Cost"}, unit: "USD/yil", format: "currency", isBigNumber: true },
    { id: "vsmTotalFinancialImpact", label: "Toplam Finansal Etki", label_i18n: {"en":"Total Financial Impact"}, unit: "USD/yil", format: "currency", isBigNumber: true },
  ],
  thresholds: [
    { fieldId: "vsmValueAddedRatio", warning: 30, critical: 15, direction: "lower_is_bad", warningMessage: "VA ratio < 30% — there are significant non-value-added steps in the process.", warningMessage_i18n: {"en":"VA ratio < 30% — there are significant non-value-added steps in the process."}, criticalMessage: "VA ratio < 15% — process needs fundamental restructuring.", criticalMessage_i18n: {"en":"VA ratio < 15% — process needs fundamental restructuring."} },
    { fieldId: "vsmNonValueAddedCost", warning: 50000, critical: 150000, direction: "higher_is_bad", warningMessage: "NVA cost > $50K — lean transformation should be prioritized.", warningMessage_i18n: {"en":"NVA cost > $50K — lean transformation should be prioritized."}, criticalMessage: "NVA cost > $150K — urgent VSM workshop should be planned.", criticalMessage_i18n: {"en":"NVA cost > $150K — urgent VSM workshop should be planned."} },
  ],
  formulaPipeline: [
    { formulaId: "cost.vsm_leadtime_cost", inputMap: { totalLeadTime: "totalLeadTime", costPerMinute: "costPerMinute", dailyProduction: "dailyProduction" ,
        costPerDay: "costPerDay"}, outputId: "vsmLeadtimeCost" },
    { formulaId: "measurement.vsm_value_added_ratio", inputMap: { valueAddedTime: "valueAddedTime", totalLeadTime: "totalLeadTime" }, outputId: "vsmValueAddedRatio" },
    { formulaId: "cost.vsm_non_value_added_cost", inputMap: { totalLeadTime: "totalLeadTime", valueAddedTime: "valueAddedTime", costPerMinute: "costPerMinute", dailyProduction: "dailyProduction", operatingDays: "operatingDays" ,
        costPerDay: "costPerDay"}, outputId: "vsmNonValueAddedCost" },
    { formulaId: "cost.vsm_total_financial_impact", inputMap: { vsmNonValueAddedCost: "vsmNonValueAddedCost", vsmLeadtimeCost: "vsmLeadtimeCost", reworkPercent: "reworkPercent", dailyProduction: "dailyProduction", operatingDays: "operatingDays" ,
        leadtimeCost: "leadtimeCost",
        nonValueAddedCost: "nonValueAddedCost",
        inventoryCost: "inventoryCost"}, outputId: "vsmTotalFinancialImpact" },
  ],
  reportTemplate: { title: "VSM Financial Converter Report", title_i18n: {"en":"VSM Financial Converter Report"}, sections: ["executive_summary", "loss_breakdown", "thresholds", "action_plan", "assumptions"], exportFormats: ["pdf", "excel"] },
  assumptions: { hiddenLossMultiplier: 1.2, volatilityPercent: 10, targetMarginPercent: 10, assumptionNotes: ["Value-added ratio = VA time / total lead time.", "KD olmayan maliyet = (toplam - KD sure) × birim maliyet × uretim.", "Scrap and rework costs are included in non-value-added cost."],assumptionNotes_i18n:[{"en":"Value-added ratio = VA time / total lead time."},{"en":"Non-value-added cost = (total - VA time) × unit cost × production."},{"en":"Scrap and rework costs are included in non-value-added cost."}] },
};
