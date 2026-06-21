/**
 * ürün Complexity Hidden Maliyet — Premium Calculator Schema
 * Auto-generated from user-provided formulas
 */
import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";

export const PRODUCTCOMPLEXITYHIDDENCOST_SCHEMA: PremiumCalculatorSchema = {
  id: "product-complexity-hidden-cost-analyzer",
  legacyPaidSlug: "product-complexity-hidden-cost-analyzer",
  name: "ürün Complexity Hidden Maliyet",
  sectorSlug: "general",
  category: "cost",
  painStatement: "ürün Complexity Hidden Maliyet — premium analysis tool.",
  inputs: [
    { id: "sku_sayisi", label: "SKU Sayısı", type: "number", required: true },
    { id: "bom_derinligi", label: "BOM Derinliği", type: "number", required: true },
    { id: "degisim_sayisimaliyeti", label: "Değişim Sayısı/Maliyeti", type: "number", required: true },
    { id: "toplam_guvenlik_stogu", label: "Toplam Güvenlik Stoğu", type: "number", required: true },
    { id: "dolayli_giderler", label: "Dolaylı Giderler", type: "number", required: true },
    { id: "karmasiklik_surucu_orani", label: "Karmaşıklık Sürücü Oranı", type: "number", required: true },
  ],
  outputs: [
    { id: "complexity_index", label: "Complexity Index", unit: "currency", format: "currency" },
    { id: "setup_cost_complexity", label: "Setup Cost Complexity", unit: "currency", format: "currency" },
    { id: "inventory_cost_complexity", label: "Inventory Cost Complexity", unit: "currency", format: "currency" },
    { id: "overhead_allocation", label: "Overhead Allocation", unit: "currency", format: "currency" },
    { id: "hidden_cost", label: "Hidden Cost", unit: "currency", format: "currency" },
    { id: "profitability_per_s_k_u", label: "Profitability Per S K U", unit: "currency", format: "currency" },
  ],
  thresholds: [],
  formulaPipeline: [
    { formulaId: "custom.urun_complexity_hidden_maliyet_analyzer_0", inputMap: { NumberOfSKUs: "number_of_s_k_us", AverageBOMDepth: "average_b_o_m_depth" }, outputId: "complexity_index" },
    { formulaId: "custom.urun_complexity_hidden_maliyet_analyzer_1", inputMap: { Changeovers: "changeovers", SetupCostPerChange: "setup_cost_per_change" }, outputId: "setup_cost_complexity" },
    { formulaId: "custom.urun_complexity_hidden_maliyet_analyzer_2", inputMap: { SafetyStock_AllSKUs: "safety_stock__all_s_k_us", HoldingRate: "holding_rate" }, outputId: "inventory_cost_complexity" },
    { formulaId: "custom.urun_complexity_hidden_maliyet_analyzer_3", inputMap: { TotalIndirectCosts: "total_indirect_costs", ComplexityDriverPct: "complexity_driver_pct" }, outputId: "overhead_allocation" },
    { formulaId: "custom.urun_complexity_hidden_maliyet_analyzer_4", inputMap: { SetupCostComplexity: "setup_cost_complexity", InventoryCostComplexity: "inventory_cost_complexity", OverheadAllocation: "overhead_allocation", TraditionalOverhead: "traditional_overhead" }, outputId: "hidden_cost" },
    { formulaId: "custom.urun_complexity_hidden_maliyet_analyzer_5", inputMap: { Revenue_SKU: "revenue__s_k_u", DirectCost_SKU: "direct_cost__s_k_u", HiddenCost_SKU: "hidden_cost__s_k_u" }, outputId: "profitability_per_s_k_u" },
  ],
  reportTemplate: {
    title: "ürün Complexity Hidden Maliyet Report",
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
