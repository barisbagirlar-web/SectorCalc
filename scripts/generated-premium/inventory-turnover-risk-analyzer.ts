/**
 * Stok Devir hızı risk — Premium Calculator Schema
 * Auto-generated from user-provided formulas
 */
import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";

export const INVENTORYTURNOVERRISK_SCHEMA: PremiumCalculatorSchema = {
  id: "inventory-turnover-risk-analyzer",
  legacyPaidSlug: "inventory-turnover-risk-analyzer",
  name: "Stok Devir hızı risk",
  sectorSlug: "general",
  category: "cost",
  painStatement: "Stok Devir hızı risk — premium analysis tool.",
  inputs: [
    { id: "cogs", label: "COGS", type: "number", required: true },
    { id: "ortalama_stok", label: "Ortalama Stok", type: "number", required: true },
    { id: "yaslandirma_dagilimi", label: "Yaşlandırma Dağılımı", type: "array", required: true },
    { id: "sigorta_oranlari", label: "Sigorta Oranları", type: "number", required: true },
    { id: "sektor_benchmark", label: "Sektör Benchmark", type: "number", required: true },
    { id: "fireobsolescence_oranlari", label: "Fire/Obsolescence Oranları", type: "array", required: true },
    { id: "kurtarilan_deger_orani", label: "Kurtarılan Değer Oranı", type: "number", required: true },
  ],
  outputs: [
    { id: "inventory_turnover", label: "Inventory Turnover", unit: "currency", format: "currency" },
    { id: "days_sales_inventory", label: "Days Sales Inventory", unit: "currency", format: "currency" },
    { id: "obsolescence_risk", label: "Obsolescence Risk", unit: "currency", format: "currency" },
    { id: "carrying_cost", label: "Carrying Cost", unit: "currency", format: "currency" },
    { id: "optimal_turnover", label: "Optimal Turnover", unit: "currency", format: "currency" },
    { id: "stockout_risk", label: "Stockout Risk", unit: "currency", format: "currency" },
    { id: "liquidation_loss", label: "Liquidation Loss", unit: "currency", format: "currency" },
  ],
  thresholds: [],
  formulaPipeline: [
    { formulaId: "custom.stok_devir_hizi_risk_analyzer_0", inputMap: { COGS: "cogs", AverageInventory: "average_inventory" }, outputId: "inventory_turnover" },
    { formulaId: "custom.stok_devir_hizi_risk_analyzer_1", inputMap: { InventoryTurnover: "inventory_turnover" }, outputId: "days_sales_inventory" },
    { formulaId: "custom.stok_devir_hizi_risk_analyzer_2", inputMap: { AgingBracket_i: "aging_bracket_i", ObsolescenceRate_i: "obsolescence_rate_i", InventoryValue_i: "inventory_value_i" }, outputId: "obsolescence_risk" },
    { formulaId: "custom.stok_devir_hizi_risk_analyzer_3", inputMap: { AverageInventory: "average_inventory", WACC: "w_a_c_c", Storage: "storage", Insurance: "insurance", Obsolescence: "fireobsolescence_oranlari" }, outputId: "carrying_cost" },
    { formulaId: "custom.stok_devir_hizi_risk_analyzer_4", inputMap: { IndustryBenchmark: "industry_benchmark", AdjustmentFactor: "adjustment_factor" }, outputId: "optimal_turnover" },
    { formulaId: "custom.stok_devir_hizi_risk_analyzer_5", inputMap: { Turnover: "turnover", MaxThreshold: "max_threshold", High: "high", Low: "low" }, outputId: "stockout_risk" },
    { formulaId: "custom.stok_devir_hizi_risk_analyzer_6", inputMap: { SlowMovingInventory: "slow_moving_inventory", SalvageValuePct: "salvage_value_pct" }, outputId: "liquidation_loss" },
  ],
  reportTemplate: {
    title: "Stok Devir hızı risk Report",
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
