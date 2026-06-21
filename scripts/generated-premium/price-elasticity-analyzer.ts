/**
 * FİYAT ESNEKLİĞİ — Premium Calculator Schema
 * Auto-generated from user-provided formulas
 */
import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";

export const PRICEELASTICITY_SCHEMA: PremiumCalculatorSchema = {
  id: "price-elasticity-analyzer",
  legacyPaidSlug: "price-elasticity-analyzer",
  name: "FİYAT ESNEKLİĞİ",
  sectorSlug: "general",
  category: "cost",
  painStatement: "FİYAT ESNEKLİĞİ — premium analysis tool.",
  inputs: [
    { id: "mevcut_fiyattalep", label: "Mevcut Fiyat/Talep", type: "currency/number", required: true },
    { id: "degisim", label: "Değişim", type: "number", required: true },
    { id: "esneklik", label: "Esneklik", type: "number", required: true },
    { id: "capraz_esneklik", label: "Çapraz Esneklik", type: "number", required: true },
    { id: "degiskensabit_maliyet", label: "Değişken/Sabit Maliyet", type: "number", required: true },
  ],
  outputs: [
    { id: "elasticity", label: "Elasticity", unit: "currency", format: "currency" },
    { id: "new_dem", label: "New Dem", unit: "currency", format: "currency" },
    { id: "new_rev", label: "New Rev", unit: "currency", format: "currency" },
    { id: "new_margin", label: "New Margin", unit: "currency", format: "currency" },
    { id: "max_price", label: "Max Price", unit: "currency", format: "currency" },
    { id: "markup", label: "Markup", unit: "currency", format: "currency" },
    { id: "cannib_loss", label: "Cannib Loss", unit: "currency", format: "currency" },
    { id: "net_impact", label: "Net Impact", unit: "currency", format: "currency" },
  ],
  thresholds: [],
  formulaPipeline: [
    { formulaId: "custom.fiyat_esnekligi_analyzer_0", inputMap: { PctChange_Dem: "pct_change__dem", PctChange_Price: "pct_change__price" }, outputId: "elasticity" },
    { formulaId: "custom.fiyat_esnekligi_analyzer_1", inputMap: { CurrDem: "curr_dem", Elast: "elast", PctChange_Price: "pct_change__price" }, outputId: "new_dem" },
    { formulaId: "custom.fiyat_esnekligi_analyzer_2", inputMap: { NewPrice: "new_price", NewDem: "new_dem" }, outputId: "new_rev" },
    { formulaId: "custom.fiyat_esnekligi_analyzer_3", inputMap: { NewPrice: "new_price", VarCost: "var_cost", NewDem: "new_dem", Fixed: "fixed" }, outputId: "new_margin" },
    { formulaId: "custom.fiyat_esnekligi_analyzer_4", inputMap: { Elast: "elast", VarCost: "var_cost" }, outputId: "max_price" },
    { formulaId: "custom.fiyat_esnekligi_analyzer_5", inputMap: { Elast: "elast" }, outputId: "markup" },
    { formulaId: "custom.fiyat_esnekligi_analyzer_6", inputMap: { NewDem: "new_dem", CannibRate: "cannib_rate", Margin_Other: "margin__other" }, outputId: "cannib_loss" },
    { formulaId: "custom.fiyat_esnekligi_analyzer_7", inputMap: { NewMargin: "new_margin", CurrMargin: "curr_margin", Cannib: "cannib" }, outputId: "net_impact" },
  ],
  reportTemplate: {
    title: "FİYAT ESNEKLİĞİ Report",
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
