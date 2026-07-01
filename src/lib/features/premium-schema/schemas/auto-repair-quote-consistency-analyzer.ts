/**
 * Tool #7 — Auto Repair Quote Consistency
 * QuoteVariance → ConsistencyScore → MarginLeak
 */
import type { PremiumCalculatorSchema } from "@/lib/features/premium-schema/premium-calculator-schema";
export const AUTO_REPAIR_QUOTE_SCHEMA: PremiumCalculatorSchema = {
  id: "auto-repair-quote-consistency-analyzer", legacyPaidSlug: "auto-repair-quote-consistency-analyzer",
  name: "Auto Repair Quote Consistency Analysis", name_i18n: {"en":"Auto Repair Quote Consistency Analysis"}, sectorSlug: "auto-repair", category: "cost",
  painStatement: "Aynı iş için verilen farklı teklifler hem müşteri güvenini sarsar hem de marj kaçağına yol açar. Bu araç teklif tutarlılığını ve marj riskini ölçer.", painStatement_i18n: {"en":"Aynı iş için verilen different teklifler hem customer güvenini sarsar hem de Margin kaçağına yol açar. Bu araç quote tutarlılığını ve Margin riskini ölçer."},
  inputs: [
    { id: "quote1Total", label: "Teklif 1 Toplam", label_i18n: {"en":"Quote 1 Total"}, type: "number", unit: "USD", required: true, smartDefault: 850, validation: { min: 0 }, helper: "", expertMeaning: "Quote 1 total amount", expertMeaning_i18n: {"en":"Quote 1 total amount"} },
    { id: "quote2Total", label: "Teklif 2 Toplam", label_i18n: {"en":"Quote 2 Total"}, type: "number", unit: "USD", required: true, smartDefault: 950, validation: { min: 0 }, helper: "", expertMeaning: "Quote 2 total amount", expertMeaning_i18n: {"en":"Quote 2 total amount"} },
    { id: "quote3Total", label: "Teklif 3 Toplam", label_i18n: {"en":"Quote 3 Total"}, type: "number", unit: "USD", required: true, smartDefault: 900, validation: { min: 0 }, helper: "", expertMeaning: "Quote 3 total amount", expertMeaning_i18n: {"en":"Quote 3 total amount"} },
    { id: "partQuotedPrice", label: "Part Quote Price", label_i18n: {"en":"Part Quote Price"}, type: "number", unit: "USD", required: true, smartDefault: 320, validation: { min: 0 }, helper: "", expertMeaning: "Quoted part price", expertMeaning_i18n: {"en":"Quoted part price"} },
    { id: "partMarketPrice", label: "Part Market Price", label_i18n: {"en":"Part Market Price"}, type: "number", unit: "USD", required: true, smartDefault: 300, validation: { min: 0 }, helper: "", expertMeaning: "Market average part price", expertMeaning_i18n: {"en":"Market average part price"} },
    { id: "partsQuantity", label: "Part Quantity", label_i18n: {"en":"Part Quantity"}, type: "number", unit: "adet", required: false, smartDefault: 1, validation: { min: 1 }, helper: "", expertMeaning: "Number of parts", expertMeaning_i18n: {"en":"Number of parts"} },
    { id: "quotedLaborHours", label: "Quoted Labor Hours", label_i18n: {"en":"Quoted Labor Hours"}, type: "number", unit: "saat", required: true, smartDefault: 3.5, validation: { min: 0 }, helper: "", expertMeaning: "Quoted labor hours", expertMeaning_i18n: {"en":"Quoted labor hours"} },
    { id: "standardLaborHours", label: "Standard Labor Hours", label_i18n: {"en":"Standard Labor Hours"}, type: "number", unit: "saat", required: true, smartDefault: 3, validation: { min: 0 }, helper: "", expertMeaning: "Standard labor hours per job", expertMeaning_i18n: {"en":"Standard labor hours per job"} },
    { id: "shopHourlyRate", label: "Shop Hourly Rate", label_i18n: {"en":"Shop Hourly Rate"}, type: "number", unit: "USD/saat", required: false, smartDefault: 85, validation: { min: 0 }, helper: "", expertMeaning: "Shop labor rate", expertMeaning_i18n: {"en":"Shop labor rate"} },
  ],
  outputs: [
    { id: "quoteVariance", label: "Teklif Varyans (CV)", label_i18n: {"en":"quote Varyans (CV)"}, unit: "", format: "number" },
    { id: "partPriceDeviation", label: "Parts Price Variance", label_i18n: {"en":"Parts Price Variance"}, unit: "%", format: "percentage" },
    { id: "consistencyScore", label: "Tutarllk Skoru", label_i18n: {"en":"Tutarllk Skoru"}, unit: "", format: "score", isBigNumber: true },
    { id: "marginLeak", label: "Marj Kacag", label_i18n: {"en":"Margin Kacag"}, unit: "USD", format: "currency" },
  ],
  thresholds: [
    { fieldId: "consistencyScore", warning: 70, critical: 50, direction: "lower_is_bad", warningMessage: "Tutarlılık < 70 — iyileştirme alanı var.", warningMessage_i18n: {"en":"consistency < 70 — improvement alanı var."}, criticalMessage: "Tutarlılık < 50 — fiyatlama politikası revize edilmeli.", criticalMessage_i18n: {"en":"consistency < 50 — fiyatlama policy revize edilmeli."} },
  ],
  formulaPipeline: [
    { formulaId: "stats.quote_variance", inputMap: { q1: "quote1Total", q2: "quote2Total", q3: "quote3Total" }, outputId: "quoteVariance" },
    { formulaId: "stats.price_deviation", inputMap: { quotedPrice: "partQuotedPrice", marketPrice: "partMarketPrice" }, outputId: "partPriceDeviation" },
    { formulaId: "stats.consistency_score", inputMap: { variance: "quoteVariance", priceDeviation: "partPriceDeviation", laborDeviation: "quotedLaborHours" }, outputId: "consistencyScore" },
    { formulaId: "cost.margin_leak_quote", inputMap: { marketPrice: "partMarketPrice", quotedPrice: "partQuotedPrice", quantity: "partsQuantity" }, outputId: "marginLeak" },
  ],
  reportTemplate: { title: "Quote Consistency Report", title_i18n: {"en":"Quote Consistency Report"}, sections: ["executive_summary", "thresholds", "action_plan", "assumptions"], exportFormats: ["pdf", "excel"] },
  assumptions: { hiddenLossMultiplier: 1.1, volatilityPercent: 10, targetMarginPercent: 15, assumptionNotes: ["QuoteVariance = STDEV(q1,q2,q3) / AVERAGE(q1,q2,q3).", "ConsistencyScore = 100 - (Variance*50 + |PriceDev|*25 + |LaborDev|*25).", "MarginLeak = (MarketPrice - QuotedPrice) × Quantity. Positive = underpriced."],assumptionNotes_i18n:[{"en":"QuoteVariance = STDEV(q1,q2,q3) / AVERAGE(q1,q2,q3)."},{"en":"ConsistencyScore = 100 - (Variance*50 + |PriceDev|*25 + |LaborDev|*25)."},{"en":"MarginLeak = (MarketPrice - QuotedPrice) × Quantity. Positive = underpriced."}]},
};
