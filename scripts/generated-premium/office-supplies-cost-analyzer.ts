/**
 * Ofis Malzemeleri Maliyet — Premium Calculator Schema
 * Auto-generated from user-provided formulas
 */
import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";

export const OFFICESUPPLIESCOST_SCHEMA: PremiumCalculatorSchema = {
  id: "office-supplies-cost-analyzer",
  legacyPaidSlug: "office-supplies-cost-analyzer",
  name: "Ofis Malzemeleri Maliyet",
  sectorSlug: "general",
  category: "cost",
  painStatement: "Ofis Malzemeleri Maliyet — premium analysis tool.",
  inputs: [
    { id: "calisan_sayisi", label: "Çalışan Sayısı", type: "number", required: true },
    { id: "tuketim_miktarlari", label: "Tüketim Miktarları", type: "array", required: true },
    { id: "birim_fiyatlar", label: "Birim Fiyatlar", type: "array", required: true },
    { id: "siparis_maliyeti", label: "Sipariş Maliyeti", type: "number", required: true },
    { id: "acil_kargo_maliyeti", label: "Acil Kargo Maliyeti", type: "number", required: true },
    { id: "stok_tasima_orani", label: "Stok Taşıma Oranı", type: "number", required: true },
    { id: "fireisraf_orani", label: "Fire/İsraf Oranı", type: "number", required: true },
  ],
  outputs: [
    { id: "consumption_rate", label: "Consumption Rate", unit: "currency", format: "currency" },
    { id: "annual_cost", label: "Annual Cost", unit: "currency", format: "currency" },
    { id: "carrying_cost", label: "Carrying Cost", unit: "currency", format: "currency" },
    { id: "stockout_cost", label: "Stockout Cost", unit: "currency", format: "currency" },
    { id: "e_o_q__office", label: "E O Q_ Office", unit: "currency", format: "currency" },
    { id: "waste_pct", label: "Waste Pct", unit: "currency", format: "currency" },
    { id: "optimization_savings", label: "Optimization Savings", unit: "currency", format: "currency" },
  ],
  thresholds: [],
  formulaPipeline: [
    { formulaId: "custom.ofis_malzemeleri_maliyet_analyzer_0", inputMap: { TotalConsumed: "total_consumed", EmployeeCount: "employee_count" }, outputId: "consumption_rate" },
    { formulaId: "custom.ofis_malzemeleri_maliyet_analyzer_1", inputMap: { Item_i: "item_i", UnitPrice_i: "unit_price_i", AnnualUsage_i: "annual_usage_i" }, outputId: "annual_cost" },
    { formulaId: "custom.ofis_malzemeleri_maliyet_analyzer_2", inputMap: { AverageInventory: "average_inventory", HoldingRate: "holding_rate" }, outputId: "carrying_cost" },
    { formulaId: "custom.ofis_malzemeleri_maliyet_analyzer_3", inputMap: { EmergencyOrders: "emergency_orders", PremiumFreight: "premium_freight" }, outputId: "stockout_cost" },
    { formulaId: "custom.ofis_malzemeleri_maliyet_analyzer_4", inputMap: { AnnualUsage: "annual_usage", OrderCost: "order_cost", HoldingCost: "holding_cost" }, outputId: "e_o_q__office" },
    { formulaId: "custom.ofis_malzemeleri_maliyet_analyzer_5", inputMap: { Purchased: "purchased", Consumed: "consumed" }, outputId: "waste_pct" },
    { formulaId: "custom.ofis_malzemeleri_maliyet_analyzer_6", inputMap: { CurrentCost: "current_cost", EOQ_Cost: "e_o_q__cost", WastePct: "waste_pct" }, outputId: "optimization_savings" },
  ],
  reportTemplate: {
    title: "Ofis Malzemeleri Maliyet Report",
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
