/**
 * Tool #18 — Tamirhane Parca Teklif
 */
import type { PremiumCalculatorSchema } from "@/lib/features/premium-schema/premium-calculator-schema";
export const REPAIR_SHOP_QUOTE_SCHEMA: PremiumCalculatorSchema = {
  id: "repair-shop-quote-analyzer", legacyPaidSlug: "repair-shop-quote-analyzer",
  name: "Repair Shop Parts Quote Analysis", name_i18n: {"en":"Repair Shop Parts Quote Analysis"}, sectorSlug: "financial-planning", category: "cost",
  painStatement: "When labor, parts, and profit margin are not transparent in repair shop quotes, cost control is lost.", painStatement_i18n: {"en":"When labor, parts, and profit margin are not transparent in repair shop quotes, cost control is lost."},
  inputs: [
    { id: "laborHours", label: "Total Labor Hours", label_i18n: {"en":"Total Labor Hours"}, type: "number", unit: "saat", required: true, smartDefault: 8, validation: { min: 0 }, helper: "", expertMeaning: "Total labor hours", expertMeaning_i18n: {"en":"Total labor hours"} },
    { id: "hourlyRate", label: "Hourly Labor Rate", label_i18n: {"en":"Hourly Labor Rate"}, type: "number", unit: "USD/saat", required: true, smartDefault: 65, validation: { min: 1 }, helper: "", expertMeaning: "Hourly labor rate", expertMeaning_i18n: {"en":"Hourly labor rate"} },
    { id: "partsCost", label: "Parts Cost", label_i18n: {"en":"Parts Cost"}, type: "number", unit: "USD", required: true, smartDefault: 450, validation: { min: 0 }, helper: "", expertMeaning: "Total parts cost", expertMeaning_i18n: {"en":"Total parts cost"} },
    { id: "quoteTotal", label: "Quote Total", label_i18n: {"en":"Quote Total"}, type: "number", unit: "USD", required: true, smartDefault: 1200, validation: { min: 0 }, helper: "", expertMeaning: "Total quoted amount", expertMeaning_i18n: {"en":"Total quoted amount"} },
    { id: "overheadCost", label: "Genel Gider Maliyeti", label_i18n: {"en":"Overhead Cost"}, type: "number", unit: "USD", required: false, smartDefault: 80, validation: { min: 0 }, helper: "", expertMeaning: "Overhead cost", expertMeaning_i18n: {"en":"Overhead cost"} },
  ],
  outputs: [
    { id: "quoteTotalOut", label: "Quote Amount", label_i18n: {"en":"Quote Amount"}, unit: "USD", format: "currency" },
    { id: "effectiveLaborRate", label: "Effective Labor Rate", label_i18n: {"en":"Effective Labor Rate"}, unit: "USD/saat", format: "currency" },
    { id: "grossProfitPct", label: "Gross Profit Margin", label_i18n: {"en":"Gross Profit Margin"}, unit: "%", format: "percentage" },
  ],
  thresholds: [{ fieldId: "grossProfitPct", warning: 30, critical: 15, direction: "lower_is_bad", warningMessage: "Margin < 30% — review cost structure.", warningMessage_i18n: {"en":"Margin < 30% — review cost structure."}, criticalMessage: "Margin < 15% — quote may be losing money.", criticalMessage_i18n: {"en":"Margin < 15% — quote may be losing money."} }],
  formulaPipeline: [
    { formulaId: "cost.quote_total", inputMap: { laborHours: "laborHours", hourlyRate: "hourlyRate", partsCost: "partsCost" ,
        laborRate: "laborRate",
        overheadCost: "overheadCost"}, outputId: "quoteTotalOut" },
    { formulaId: "cost.effective_labor_rate", inputMap: {
        totalLaborCost: "quoteTotal",
        billableHours: "partsCost",
        laborHours: "laborHours"
      ,
        laborRevenue: "laborRevenue",
        flagHours: "flagHours"}, outputId: "effectiveLaborRate" },
    { formulaId: "cost.gross_profit_pct", inputMap: { quoteTotal: "quoteTotal", quoteTotalOut: "quoteTotalOut" ,
        grossProfit: "grossProfit",
        revenue: "revenue"}, outputId: "grossProfitPct" },
  ],
  reportTemplate: { title: "Repair Shop Quote Analysis Report", title_i18n: {"en":"Repair Shop Quote Analysis Report"}, sections: ["executive_summary", "thresholds", "action_plan", "assumptions"], exportFormats: ["pdf", "excel"] },
  assumptions: { hiddenLossMultiplier: 1.1, volatilityPercent: 5, targetMarginPercent: 20, assumptionNotes: ["Gross profit = (Quote − Cost) / Quote.", "Effective rate = (Quote − Parts) / Hours.", "Overhead absorbs fixed costs."],assumptionNotes_i18n:[{"en":"Gross profit = (Quote − Cost) / Quote."},{"en":"Effective rate = (Quote − Parts) / Hours."},{"en":"Overhead absorbs fixed costs."}] },
};
