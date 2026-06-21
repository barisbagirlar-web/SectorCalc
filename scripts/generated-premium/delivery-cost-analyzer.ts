/**
 * Teslimat Maliyeti — Premium Calculator Schema
 * Auto-generated from user-provided formulas
 */
import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";

export const DELIVERYCOST_SCHEMA: PremiumCalculatorSchema = {
  id: "delivery-cost-analyzer",
  legacyPaidSlug: "delivery-cost-analyzer",
  name: "Teslimat Maliyeti",
  sectorSlug: "general",
  category: "cost",
  painStatement: "Teslimat Maliyeti — premium analysis tool.",
  inputs: [
    { id: "rota_toplam_maliyeti", label: "Rota Toplam Maliyeti", type: "number", required: true },
    { id: "durak_sayisi", label: "Durak Sayısı", type: "number", required: true },
    { id: "mesafe_km", label: "Mesafe km", type: "number", required: true },
    { id: "basarisiz_teslimat_sayisi", label: "Başarısız Teslimat Sayısı", type: "number", required: true },
    { id: "iade_navlunistoklama_ucreti", label: "İade Navlun/İstoklama Ücreti", type: "number", required: true },
    { id: "yakit_endeksi", label: "Yakıt Endeksi", type: "number", required: true },
  ],
  outputs: [
    { id: "cost_per_drop", label: "Cost Per Drop", unit: "currency", format: "currency" },
    { id: "cost_per_km", label: "Cost Per Km", unit: "currency", format: "currency" },
    { id: "failed_delivery_cost", label: "Failed Delivery Cost", unit: "currency", format: "currency" },
    { id: "fuel_surcharge", label: "Fuel Surcharge", unit: "currency", format: "currency" },
    { id: "total_delivery_cost", label: "Total Delivery Cost", unit: "currency", format: "currency" },
    { id: "delivery_efficiency", label: "Delivery Efficiency", unit: "currency", format: "currency" },
  ],
  thresholds: [],
  formulaPipeline: [
    { formulaId: "custom.teslimat_maliyeti_analyzer_0", inputMap: { TotalRouteCost: "total_route_cost", NumberOfDrops: "number_of_drops" }, outputId: "cost_per_drop" },
    { formulaId: "custom.teslimat_maliyeti_analyzer_1", inputMap: { TotalRouteCost: "total_route_cost", TotalDistance: "total_distance" }, outputId: "cost_per_km" },
    { formulaId: "custom.teslimat_maliyeti_analyzer_2", inputMap: { FailedDrops: "failed_drops", ReturnFreight: "return_freight", RestockingFee: "restocking_fee", AdminCost: "admin_cost" }, outputId: "failed_delivery_cost" },
    { formulaId: "custom.teslimat_maliyeti_analyzer_3", inputMap: { BaseFreight: "base_freight", FuelIndexPct: "fuel_index_pct" }, outputId: "fuel_surcharge" },
    { formulaId: "custom.teslimat_maliyeti_analyzer_4", inputMap: { Linehaul: "linehaul", LastMile: "last_mile", FailedDeliveryCost: "failed_delivery_cost", Surcharges: "surcharges" }, outputId: "total_delivery_cost" },
    { formulaId: "custom.teslimat_maliyeti_analyzer_5", inputMap: { SuccessfulDrops: "successful_drops", TotalPlannedDrops: "total_planned_drops" }, outputId: "delivery_efficiency" },
  ],
  reportTemplate: {
    title: "Teslimat Maliyeti Report",
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
