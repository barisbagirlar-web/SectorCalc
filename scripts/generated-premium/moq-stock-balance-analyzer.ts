/**
 * MOQ Stok Denge — Premium Calculator Schema
 * Auto-generated from user-provided formulas
 */
import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";

export const MOQSTOCKBALANCE_SCHEMA: PremiumCalculatorSchema = {
  id: "moq-stock-balance-analyzer",
  legacyPaidSlug: "moq-stock-balance-analyzer",
  name: "MOQ Stok Denge",
  sectorSlug: "general",
  category: "cost",
  painStatement: "MOQ Stok Denge — premium analysis tool.",
  inputs: [
    { id: "yillik_talep", label: "Yıllık Talep", type: "number", required: true },
    { id: "siparis_maliyeti", label: "Sipariş Maliyeti", type: "number", required: true },
    { id: "moq", label: "MOQ", type: "number", required: true },
    { id: "standartmoq_birim_fiyat", label: "Standart/MOQ Birim Fiyat", type: "number", required: true },
    { id: "birim_tasima_maliyeti", label: "Birim Taşıma Maliyeti", type: "number", required: true },
    { id: "tedarik_suresi", label: "Tedarik Süresi", type: "number", required: true },
    { id: "stok_alani_kisiti", label: "Stok Alanı Kısıtı", type: "number", required: true },
  ],
  outputs: [
    { id: "e_o_q", label: "E O Q", unit: "currency", format: "currency" },
    { id: "m_o_q__penalty", label: "M O Q_ Penalty", unit: "currency", format: "currency" },
    { id: "price_break_savings", label: "Price Break Savings", unit: "currency", format: "currency" },
    { id: "net_benefit", label: "Net Benefit", unit: "currency", format: "currency" },
    { id: "optimal_order_qty", label: "Optimal Order Qty", unit: "currency", format: "currency" },
    { id: "cycle_stock__cost", label: "Cycle Stock_ Cost", unit: "currency", format: "currency" },
  ],
  thresholds: [],
  formulaPipeline: [
    { formulaId: "custom.moq_stok_denge_analyzer_0", inputMap: { AnnualDemand: "annual_demand", OrderCost: "order_cost", HoldingCost: "holding_cost" }, outputId: "e_o_q" },
    { formulaId: "custom.moq_stok_denge_analyzer_1", inputMap: { MOQ: "moq", EOQ: "e_o_q", HoldingCost: "holding_cost" }, outputId: "m_o_q__penalty" },
    { formulaId: "custom.moq_stok_denge_analyzer_2", inputMap: { UnitPrice_Standard: "unit_price__standard", UnitPrice_MOQ: "moq", AnnualDemand: "annual_demand" }, outputId: "price_break_savings" },
    { formulaId: "custom.moq_stok_denge_analyzer_3", inputMap: { PriceBreakSavings: "price_break_savings", MOQ_Penalty: "moq", AdditionalOrderCostSavings: "additional_order_cost_savings" }, outputId: "net_benefit" },
    { formulaId: "custom.moq_stok_denge_analyzer_4", inputMap: { NetBenefit: "net_benefit", MOQ: "moq", EOQ: "e_o_q" }, outputId: "optimal_order_qty" },
    { formulaId: "custom.moq_stok_denge_analyzer_5", inputMap: { OptimalOrderQty: "optimal_order_qty", HoldingCost: "holding_cost" }, outputId: "cycle_stock__cost" },
  ],
  reportTemplate: {
    title: "MOQ Stok Denge Report",
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
