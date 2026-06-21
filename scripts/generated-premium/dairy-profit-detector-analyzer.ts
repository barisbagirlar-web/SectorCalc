/**
 * Süt Kâr Dedektörü — Premium Calculator Schema
 * Auto-generated from user-provided formulas
 */
import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";

export const DAIRYPROFITDETECTOR_SCHEMA: PremiumCalculatorSchema = {
  id: "dairy-profit-detector-analyzer",
  legacyPaidSlug: "dairy-profit-detector-analyzer",
  name: "Süt Kâr Dedektörü",
  sectorSlug: "general",
  category: "cost",
  painStatement: "Süt Kâr Dedektörü — premium analysis tool.",
  inputs: [
    { id: "gunluk_sut_verimi_kg", label: "Günlük Süt Verimi kg", type: "number", required: true },
    { id: "yagprotein_orani", label: "Yağ/Protein Oranı", type: "number", required: true },
    { id: "yem_tuketimi_kg", label: "Yem Tüketimi kg", type: "number", required: true },
    { id: "yem_maliyeti_currencykg", label: "Yem Maliyeti currency/kg", type: "number", required: true },
    { id: "scc_somatik_hucre", label: "SCC Somatik Hücre", type: "number", required: true },
    { id: "saglikureme_maliyeti", label: "Sağlık/Üreme Maliyeti", type: "number", required: true },
    { id: "sut_alim_fiyati_currencykg", label: "Süt Alım Fiyatı currency/kg", type: "number", required: true },
    { id: "ceza_esigi", label: "Ceza Eşiği", type: "number", required: true },
  ],
  outputs: [
    { id: "fat_corrected_milk", label: "Fat Corrected Milk", unit: "currency", format: "currency" },
    { id: "protein_corrected_milk", label: "Protein Corrected Milk", unit: "currency", format: "currency" },
    { id: "feed_cost_per_liter", label: "Feed Cost Per Liter", unit: "currency", format: "currency" },
    { id: "income_over_feed_cost", label: "Income Over Feed Cost", unit: "currency", format: "currency" },
    { id: "margin_per_cow", label: "Margin Per Cow", unit: "currency", format: "currency" },
    { id: "herd_profitability", label: "Herd Profitability", unit: "currency", format: "currency" },
    { id: "somatic_cell_penalty", label: "Somatic Cell Penalty", unit: "currency", format: "currency" },
  ],
  thresholds: [],
  formulaPipeline: [
    { formulaId: "custom.sut_kr_dedektoru_analyzer_0", inputMap: { MilkYield: "milk_yield", FatYield: "fat_yield" }, outputId: "fat_corrected_milk" },
    { formulaId: "custom.sut_kr_dedektoru_analyzer_1", inputMap: { MilkYield: "milk_yield", ProteinYield: "protein_yield" }, outputId: "protein_corrected_milk" },
    { formulaId: "custom.sut_kr_dedektoru_analyzer_2", inputMap: { TotalFeedCost: "total_feed_cost", MilkYield: "milk_yield" }, outputId: "feed_cost_per_liter" },
    { formulaId: "custom.sut_kr_dedektoru_analyzer_3", inputMap: { MilkPrice: "milk_price", MilkYield: "milk_yield", TotalFeedCost: "total_feed_cost" }, outputId: "income_over_feed_cost" },
    { formulaId: "custom.sut_kr_dedektoru_analyzer_4", inputMap: { IncomeOverFeedCost: "income_over_feed_cost", VetCost: "vet_cost", BreedingCost: "breeding_cost", LaborCost: "labor_cost" }, outputId: "margin_per_cow" },
    { formulaId: "custom.sut_kr_dedektoru_analyzer_5", inputMap: { MarginPerCow: "margin_per_cow", FixedOverhead: "fixed_overhead" }, outputId: "herd_profitability" },
    { formulaId: "custom.sut_kr_dedektoru_analyzer_6", inputMap: { SCC: "s_c_c", Threshold: "threshold", MilkYield: "milk_yield", PenaltyRate: "penalty_rate" }, outputId: "somatic_cell_penalty" },
  ],
  reportTemplate: {
    title: "Süt Kâr Dedektörü Report",
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
