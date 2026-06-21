/**
 * Supplier Performans Tco — Premium Calculator Schema
 * Auto-generated from user-provided formulas
 */
import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";

export const SUPPLIERPERFORMANCETCO_SCHEMA: PremiumCalculatorSchema = {
  id: "supplier-performance-tco-analyzer",
  legacyPaidSlug: "supplier-performance-tco-analyzer",
  name: "Supplier Performans Tco",
  sectorSlug: "general",
  category: "cost",
  painStatement: "Supplier Performans Tco — premium analysis tool.",
  inputs: [
    { id: "teklif_fiyati", label: "Teklif Fiyatı", type: "number", required: true },
    { id: "siparisnakliye_maliyeti", label: "Sipariş/Nakliye Maliyeti", type: "number", required: true },
    { id: "hata_orani_ppm", label: "Hata Oranı PPM", type: "number", required: true },
    { id: "hata_maliyeti", label: "Hata Maliyeti", type: "number", required: true },
    { id: "lead_time_gun", label: "Lead Time gün", type: "number", required: true },
    { id: "guvenlik_stogu_gun", label: "Güvenlik Stoğu gün", type: "number", required: true },
    { id: "kesinti_olasiligi", label: "Kesinti Olasılığı", type: "number", required: true },
    { id: "etki_maliyeti", label: "Etki Maliyeti", type: "number", required: true },
  ],
  outputs: [
    { id: "t_c_o", label: "T C O", unit: "currency", format: "currency" },
    { id: "quality_cost", label: "Quality Cost", unit: "currency", format: "currency" },
    { id: "inventory_cost", label: "Inventory Cost", unit: "currency", format: "currency" },
    { id: "risk_cost", label: "Risk Cost", unit: "currency", format: "currency" },
    { id: "supplier_score", label: "Supplier Score", unit: "currency", format: "currency" },
    { id: "t_c_o__variance", label: "T C O_ Variance", unit: "currency", format: "currency" },
  ],
  thresholds: [],
  formulaPipeline: [
    { formulaId: "custom.supplier_performans_tco_analyzer_0", inputMap: { PurchasePrice: "purchase_price", OrderingCost: "ordering_cost", TransportCost: "transport_cost", QualityCost: "quality_cost", InventoryCost: "inventory_cost", RiskCost: "risk_cost" }, outputId: "t_c_o" },
    { formulaId: "custom.supplier_performans_tco_analyzer_1", inputMap: { DefectRate: "defect_rate", AnnualVolume: "annual_volume", CostPerDefect: "cost_per_defect" }, outputId: "quality_cost" },
    { formulaId: "custom.supplier_performans_tco_analyzer_2", inputMap: { AvgLeadTime: "avg_lead_time", SafetyStockDays: "safety_stock_days", DailyDemand: "daily_demand", HoldingRate: "holding_rate" }, outputId: "inventory_cost" },
    { formulaId: "custom.supplier_performans_tco_analyzer_3", inputMap: { ProbabilityOfDisruption: "probability_of_disruption", ImpactCost: "impact_cost" }, outputId: "risk_cost" },
    { formulaId: "custom.supplier_performans_tco_analyzer_4", inputMap: { QualityWeight: "quality_weight", QualityScore: "quality_score", DeliveryWeight: "delivery_weight", DeliveryScore: "delivery_score", CostWeight: "cost_weight", CostScore: "cost_score" }, outputId: "supplier_score" },
    { formulaId: "custom.supplier_performans_tco_analyzer_5", inputMap: { TCO_Actual: "t_c_o__actual", TCO_Quoted: "t_c_o__quoted" }, outputId: "t_c_o__variance" },
  ],
  reportTemplate: {
    title: "Supplier Performans Tco Report",
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
