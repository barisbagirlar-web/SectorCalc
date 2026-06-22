/**
 * Tool #18 — Tamirhane Parça Teklif
 */
import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";
export const REPAIR_SHOP_QUOTE_SCHEMA: PremiumCalculatorSchema = {
  id: "repair-shop-quote-analyzer", legacyPaidSlug: "repair-shop-quote-analyzer",
  name: "Tamirhane Parça Teklif Analizi", name_i18n: {"en":"Repair Shop Parts Quote Analysis","tr":"Tamirhane Parça Teklif Analizi"}, sectorSlug: "financial-planning", category: "cost",
  painStatement: "Tamirhane tekliflerinde işçilik, parça ve kar marjı şeffaf olmadığında maliyet kontrolü kaybolur.", painStatement_i18n: {"en":"When labor, parts, and profit margin are not transparent in repair shop quotes, cost control is lost.","tr":"Tamirhane tekliflerinde işçilik, parça ve kar marjı şeffaf olmadığında maliyet kontrolü kaybolur."},
  inputs: [
    { id: "laborHours", label: "Toplam İşçilik Saati", label_i18n: {"en":"Total Labor Hours","tr":"Toplam İşçilik Saati"}, type: "number", unit: "saat", required: true, smartDefault: 8, validation: { min: 0 }, helper: "", expertMeaning: "Total labor hours", expertMeaning_i18n: {"en":"Total labor hours","tr":"Toplam işçilik saati"} },
    { id: "hourlyRate", label: "Saatlik İşçilik Ücreti", label_i18n: {"en":"Hourly Labor Rate","tr":"Saatlik İşçilik Ücreti"}, type: "number", unit: "USD/saat", required: true, smartDefault: 65, validation: { min: 1 }, helper: "", expertMeaning: "Hourly labor rate", expertMeaning_i18n: {"en":"Hourly labor rate","tr":"Saatlik işçilik ücreti"} },
    { id: "partsCost", label: "Parça Maliyeti", label_i18n: {"en":"Parts Cost","tr":"Parça Maliyeti"}, type: "number", unit: "USD", required: true, smartDefault: 450, validation: { min: 0 }, helper: "", expertMeaning: "Total parts cost", expertMeaning_i18n: {"en":"Total parts cost","tr":"Toplam parça maliyeti"} },
    { id: "quoteTotal", label: "Teklif Toplamı", label_i18n: {"en":"Quote Total","tr":"Teklif Toplamı"}, type: "number", unit: "USD", required: true, smartDefault: 1200, validation: { min: 0 }, helper: "", expertMeaning: "Total quoted amount", expertMeaning_i18n: {"en":"Total quoted amount","tr":"Toplam teklif tutarı"} },
    { id: "overheadCost", label: "Genel Gider Maliyeti", label_i18n: {"en":"Overhead Cost","tr":"Genel Gider Maliyeti"}, type: "number", unit: "USD", required: false, smartDefault: 80, validation: { min: 0 }, helper: "", expertMeaning: "Overhead cost", expertMeaning_i18n: {"en":"Overhead cost","tr":"Genel gider maliyeti"} },
  ],
  outputs: [
    { id: "quoteTotalOut", label: "Teklif Tutarı", label_i18n: {"en":"Quote Amount","tr":"Teklif Tutarı"}, unit: "USD", format: "currency" },
    { id: "effectiveLaborRate", label: "Efektif İşçilik Ücreti", label_i18n: {"en":"Effective Labor Rate","tr":"Efektif İşçilik Ücreti"}, unit: "USD/saat", format: "currency" },
    { id: "grossProfitPct", label: "Brüt Kar Marjı", label_i18n: {"en":"Gross Profit Margin","tr":"Brüt Kar Marjı"}, unit: "%", format: "percentage" },
  ],
  thresholds: [{ fieldId: "grossProfitPct", warning: 30, critical: 15, direction: "lower_is_bad", warningMessage: "Kar marjı < %30 — maliyet yapısı gözden geçirilmeli.", warningMessage_i18n: {"en":"Margin < 30% — review cost structure.","tr":"Kar marjı < %30 — maliyet yapısı gözden geçirilmeli."}, criticalMessage: "Kar marjı < %15 — teklif zarar ediyor olabilir.", criticalMessage_i18n: {"en":"Margin < 15% — quote may be losing money.","tr":"Kar marjı < %15 — teklif zarar ediyor olabilir."} }],
  formulaPipeline: [
    { formulaId: "cost.quote_total", inputMap: { laborHours: "laborHours", hourlyRate: "hourlyRate", partsCost: "partsCost" }, outputId: "quoteTotalOut" },
    { formulaId: "cost.effective_labor_rate", inputMap: { quoteTotal: "quoteTotal", partsCost: "partsCost", laborHours: "laborHours" }, outputId: "effectiveLaborRate" },
    { formulaId: "cost.gross_profit_pct", inputMap: { quoteTotal: "quoteTotal", quoteTotalOut: "quoteTotalOut" }, outputId: "grossProfitPct" },
  ],
  reportTemplate: { title: "Repair Shop Quote Analysis Report", title_i18n: {"en":"Repair Shop Quote Analysis Report","tr":"Repair Shop Quote Analysis Report"}, sections: ["executive_summary", "thresholds", "action_plan", "assumptions"], exportFormats: ["pdf", "excel"] },
  assumptions: { hiddenLossMultiplier: 1.1, volatilityPercent: 5, targetMarginPercent: 20, assumptionNotes: ["Gross profit = (Quote − Cost) / Quote.", "Effective rate = (Quote − Parts) / Hours.", "Overhead absorbs fixed costs."],assumptionNotes_i18n:[{"en":"Gross profit = (Quote − Cost) / Quote.","tr":"Gross profit = (Quote − Cost) / Quote."},{"en":"Effective rate = (Quote − Parts) / Hours.","tr":"Effective rate = (Quote − Parts) / Hours."},{"en":"Overhead absorbs fixed costs.","tr":"Overhead absorbs fixed costs."}] },
};
