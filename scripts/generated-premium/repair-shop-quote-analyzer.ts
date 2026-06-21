/**
 * Tamirhane Parça ve İşçilik Teklif — Premium Calculator Schema
 * Auto-generated from user-provided formulas
 */
import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";

export const REPAIRSHOPQUOTE_SCHEMA: PremiumCalculatorSchema = {
  id: "repair-shop-quote-analyzer",
  legacyPaidSlug: "repair-shop-quote-analyzer",
  name: "Tamirhane Parça ve İşçilik Teklif",
  sectorSlug: "general",
  category: "cost",
  painStatement: "Tamirhane Parça ve İşçilik Teklif — premium analysis tool.",
  inputs: [
    { id: "flat_rate_saatleri", label: "Flat Rate Saatleri", type: "number", required: true },
    { id: "magaza_saatlik_ucreti", label: "Mağaza Saatlik Ücreti", type: "number", required: true },
    { id: "parca_listesiadetdealer_fiyat", label: "Parça Listesi/Adet/Dealer Fiyat", type: "array", required: true },
    { id: "parca_marj_orani", label: "Parça Marj Oranı", type: "number", required: true },
    { id: "sarfcevre_ucreti", label: "Sarf/Çevre Ücreti", type: "number", required: true },
    { id: "gercek_harcanan_saat", label: "Gerçek Harcanan Saat", type: "number", required: true },
  ],
  outputs: [
    { id: "part_cost", label: "Part Cost", unit: "currency", format: "currency" },
    { id: "part_margin", label: "Part Margin", unit: "currency", format: "currency" },
    { id: "labor_cost", label: "Labor Cost", unit: "currency", format: "currency" },
    { id: "sublet_cost", label: "Sublet Cost", unit: "currency", format: "currency" },
    { id: "total_quote", label: "Total Quote", unit: "currency", format: "currency" },
    { id: "effective_labor_rate", label: "Effective Labor Rate", unit: "currency", format: "currency" },
    { id: "gross_profit_pct", label: "Gross Profit Pct", unit: "currency", format: "currency" },
  ],
  thresholds: [],
  formulaPipeline: [
    { formulaId: "custom.tamirhane_parca_ve_iscilik_teklif_analyzer_0", inputMap: { Quantity_i: "quantity_i", DealerPrice_i: "dealer_price_i" }, outputId: "part_cost" },
    { formulaId: "custom.tamirhane_parca_ve_iscilik_teklif_analyzer_1", inputMap: { PartCost: "part_cost", PartMarkupPct: "part_markup_pct" }, outputId: "part_margin" },
    { formulaId: "custom.tamirhane_parca_ve_iscilik_teklif_analyzer_2", inputMap: { FlatRateHours: "flat_rate_hours", ShopHourlyRate: "shop_hourly_rate" }, outputId: "labor_cost" },
    { formulaId: "custom.tamirhane_parca_ve_iscilik_teklif_analyzer_3", inputMap: { SubletInvoices: "sublet_invoices" }, outputId: "sublet_cost" },
    { formulaId: "custom.tamirhane_parca_ve_iscilik_teklif_analyzer_4", inputMap: { PartCost: "part_cost", PartMargin: "part_margin", LaborCost: "labor_cost", SubletCost: "sublet_cost", ShopSuppliesFee: "shop_supplies_fee", EnvironmentalFee: "environmental_fee" }, outputId: "total_quote" },
    { formulaId: "custom.tamirhane_parca_ve_iscilik_teklif_analyzer_5", inputMap: { LaborCost: "labor_cost", PartMargin: "part_margin", ActualHours: "actual_hours" }, outputId: "effective_labor_rate" },
    { formulaId: "custom.tamirhane_parca_ve_iscilik_teklif_analyzer_6", inputMap: { TotalQuote: "total_quote", PartCost: "part_cost", ActualLaborCost: "actual_labor_cost" }, outputId: "gross_profit_pct" },
  ],
  reportTemplate: {
    title: "Tamirhane Parça ve İşçilik Teklif Report",
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
