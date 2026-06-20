/**
 * Tool #18 — Tamirhane Parça Teklif
 */
import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";
export const REPAIR_SHOP_QUOTE_SCHEMA: PremiumCalculatorSchema = {
  id: "repair-shop-quote-analyzer", legacyPaidSlug: "repair-shop-quote-analyzer",
  name: "Tamirhane Parça Teklif Analizi", sectorSlug: "financial-planning", category: "cost",
  painStatement: "Tamirhane tekliflerinde işçilik, parça ve kar marjı şeffaf olmadığında maliyet kontrolü kaybolur.",
  inputs: [
    { id: "laborHours", label: "Toplam İşçilik Saati", type: "number", unit: "saat", required: true, smartDefault: 8, validation: { min: 0 }, helper: "", expertMeaning: "Total labor hours" },
    { id: "hourlyRate", label: "Saatlik İşçilik Ücreti", type: "number", unit: "USD/saat", required: true, smartDefault: 65, validation: { min: 1 }, helper: "", expertMeaning: "Hourly labor rate" },
    { id: "partsCost", label: "Parça Maliyeti", type: "number", unit: "USD", required: true, smartDefault: 450, validation: { min: 0 }, helper: "", expertMeaning: "Total parts cost" },
    { id: "quoteTotal", label: "Teklif Toplamı", type: "number", unit: "USD", required: true, smartDefault: 1200, validation: { min: 0 }, helper: "", expertMeaning: "Total quoted amount" },
    { id: "overheadCost", label: "Genel Gider Maliyeti", type: "number", unit: "USD", required: false, smartDefault: 80, validation: { min: 0 }, helper: "", expertMeaning: "Overhead cost" },
  ],
  outputs: [
    { id: "quoteTotalOut", label: "Teklif Tutarı", unit: "USD", format: "currency" },
    { id: "effectiveLaborRate", label: "Efektif İşçilik Ücreti", unit: "USD/saat", format: "currency" },
    { id: "grossProfitPct", label: "Brüt Kar Marjı", unit: "%", format: "percentage" },
  ],
  thresholds: [{ fieldId: "grossProfitPct", warning: 30, critical: 15, direction: "lower_is_bad", warningMessage: "Kar marjı < %30 — maliyet yapısı gözden geçirilmeli.", criticalMessage: "Kar marjı < %15 — teklif zarar ediyor olabilir." }],
  formulaPipeline: [
    { formulaId: "cost.quote_total", inputMap: { laborHours: "laborHours", hourlyRate: "hourlyRate", partsCost: "partsCost" }, outputId: "quoteTotalOut" },
    { formulaId: "cost.effective_labor_rate", inputMap: { quoteTotal: "quoteTotal", partsCost: "partsCost", laborHours: "laborHours" }, outputId: "effectiveLaborRate" },
    { formulaId: "cost.gross_profit_pct", inputMap: { quoteTotal: "quoteTotal", quoteTotalOut: "quoteTotalOut" }, outputId: "grossProfitPct" },
  ],
  reportTemplate: { title: "Repair Shop Quote Analysis Report", sections: ["executive_summary", "thresholds", "action_plan", "assumptions"], exportFormats: ["pdf", "excel"] },
  assumptions: { hiddenLossMultiplier: 1.1, volatilityPercent: 5, targetMarginPercent: 20, assumptionNotes: ["Gross profit = (Quote − Cost) / Quote.", "Effective rate = (Quote − Parts) / Hours.", "Overhead absorbs fixed costs."] },
};
