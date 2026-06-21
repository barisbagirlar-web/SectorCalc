/**
 * AUTO SHOP MARJ KAÇAK — Premium Calculator Schema
 * Auto-generated from user-provided formulas
 */
import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";

export const AUTOSHOPMARGINLEAK_SCHEMA: PremiumCalculatorSchema = {
  id: "auto-shop-margin-leak-analyzer",
  legacyPaidSlug: "auto-shop-margin-leak-analyzer",
  name: "AUTO SHOP MARJ KAÇAK",
  sectorSlug: "general",
  category: "cost",
  painStatement: "AUTO SHOP MARJ KAÇAK — premium analysis tool.",
  inputs: [
    { id: "parcaiscilik_geliri", label: "Parça/İşçilik Geliri", type: "number", required: true },
    { id: "cogs", label: "COGS", type: "number", required: true },
    { id: "envanter_fire", label: "Envanter Fire", type: "number", required: true },
    { id: "flagmevcut_saatler", label: "Flag/Mevcut Saatler", type: "number", required: true },
    { id: "benchmark_marj", label: "Benchmark Marj", type: "number", required: true },
  ],
  outputs: [
    { id: "gross_margin__parts", label: "Gross Margin_ Parts", unit: "currency", format: "currency" },
    { id: "effective_labor_rate", label: "Effective Labor Rate", unit: "currency", format: "currency" },
    { id: "productivity_rate", label: "Productivity Rate", unit: "currency", format: "currency" },
    { id: "margin_leak__discount", label: "Margin Leak_ Discount", unit: "currency", format: "currency" },
    { id: "margin_leak__shrinkage", label: "Margin Leak_ Shrinkage", unit: "currency", format: "currency" },
    { id: "net_margin", label: "Net Margin", unit: "currency", format: "currency" },
    { id: "annual_leakage", label: "Annual Leakage", unit: "currency", format: "currency" },
  ],
  thresholds: [],
  formulaPipeline: [
    { formulaId: "custom.auto_shop_marj_kacak_analyzer_0", inputMap: { PartsRevenue: "parts_revenue", PartsCOGS: "cogs" }, outputId: "gross_margin__parts" },
    { formulaId: "custom.auto_shop_marj_kacak_analyzer_1", inputMap: { TotalLaborRevenue: "total_labor_revenue", TotalFlagHours: "total_flag_hours" }, outputId: "effective_labor_rate" },
    { formulaId: "custom.auto_shop_marj_kacak_analyzer_2", inputMap: { TotalFlagHours: "total_flag_hours", TotalAvailableHours: "total_available_hours" }, outputId: "productivity_rate" },
    { formulaId: "custom.auto_shop_marj_kacak_analyzer_3", inputMap: { Discount: "discount", TotalRevenue: "total_revenue" }, outputId: "margin_leak__discount" },
    { formulaId: "custom.auto_shop_marj_kacak_analyzer_4", inputMap: { InventoryShrinkage: "inventory_shrinkage", PartsCOGS: "cogs" }, outputId: "margin_leak__shrinkage" },
    { formulaId: "custom.auto_shop_marj_kacak_analyzer_5", inputMap: { TotalRevenue: "total_revenue", TotalCOGS: "cogs", TotalOpEx: "total_op_ex" }, outputId: "net_margin" },
    { formulaId: "custom.auto_shop_marj_kacak_analyzer_6", inputMap: { TotalRevenue: "total_revenue", TargetMargin: "target_margin", NetMargin: "net_margin" }, outputId: "annual_leakage" },
  ],
  reportTemplate: {
    title: "AUTO SHOP MARJ KAÇAK Report",
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
