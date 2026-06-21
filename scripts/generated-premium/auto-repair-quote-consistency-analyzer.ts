/**
 * AUTO REPAIR QUOTE — Premium Calculator Schema
 * Auto-generated from user-provided formulas
 */
import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";

export const AUTOREPAIRQUOTECONSISTENCY_SCHEMA: PremiumCalculatorSchema = {
  id: "auto-repair-quote-consistency-analyzer",
  legacyPaidSlug: "auto-repair-quote-consistency-analyzer",
  name: "AUTO REPAIR QUOTE",
  sectorSlug: "general",
  category: "cost",
  painStatement: "AUTO REPAIR QUOTE — premium analysis tool.",
  inputs: [
    { id: "teklif_123_toplam", label: "Teklif 1-2-3 Toplam", type: "number", required: true },
    { id: "parca_teklifpiyasa_fiyati", label: "Parça Teklif/Piyasa Fiyatı", type: "number", required: true },
    { id: "miktar", label: "Miktar", type: "number", required: true },
    { id: "teklifstandart_iscilik_saati", label: "Teklif/Standart İşçilik Saati", type: "number", required: true },
  ],
  outputs: [
    { id: "quote_variance", label: "Quote Variance", unit: "currency", format: "currency" },
    { id: "part_price_deviation", label: "Part Price Deviation", unit: "currency", format: "currency" },
    { id: "labor_time_deviation", label: "Labor Time Deviation", unit: "currency", format: "currency" },
    { id: "consistency_score", label: "Consistency Score", unit: "currency", format: "currency" },
    { id: "margin_leak", label: "Margin Leak", unit: "currency", format: "currency" },
  ],
  thresholds: [],
  formulaPipeline: [
    { formulaId: "custom.auto_repair_quote_analyzer_0", inputMap: { QuoteAmounts: "quote_amounts" }, outputId: "quote_variance" },
    { formulaId: "custom.auto_repair_quote_analyzer_1", inputMap: { QuotedPartPrice: "quoted_part_price", MarketAvg: "market_avg" }, outputId: "part_price_deviation" },
    { formulaId: "custom.auto_repair_quote_analyzer_2", inputMap: { QuotedLaborHours: "quoted_labor_hours", StandardHours: "standard_hours" }, outputId: "labor_time_deviation" },
    { formulaId: "custom.auto_repair_quote_analyzer_3", inputMap: { QuoteVariance: "quote_variance", PartPriceDeviation: "part_price_deviation", LaborTimeDeviation: "labor_time_deviation" }, outputId: "consistency_score" },
    { formulaId: "custom.auto_repair_quote_analyzer_4", inputMap: { MarketPrice: "market_price", QuotedPrice: "quoted_price", Quantity: "quantity" }, outputId: "margin_leak" },
  ],
  reportTemplate: {
    title: "AUTO REPAIR QUOTE Report",
    sections: ["executive_summary", "loss_breakdown", "thresholds", "action_plan"],
    exportFormats: ["pdf"],
  },
  assumptions: {
    hiddenLossMultiplier: 1.0,
    volatilityPercent: 10,
    targetMarginPercent: 20,
    assumptionNotes: ["Based on user-provided formulas.", "Verify constants periodically."],
  },
};
