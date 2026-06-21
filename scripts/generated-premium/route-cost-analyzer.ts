/**
 * Rota Maliyet — Premium Calculator Schema
 * Auto-generated from user-provided formulas
 */
import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";

export const ROUTECOST_SCHEMA: PremiumCalculatorSchema = {
  id: "route-cost-analyzer",
  legacyPaidSlug: "route-cost-analyzer",
  name: "Rota Maliyet",
  sectorSlug: "general",
  category: "cost",
  painStatement: "Rota Maliyet — premium analysis tool.",
  inputs: [
    { id: "toplam_mesafesure", label: "Toplam Mesafe/Süre", type: "number", required: true },
    { id: "yakit_tuketimfiyat", label: "Yakıt Tüketim/Fiyat", type: "number", required: true },
    { id: "surucu_ucreti", label: "Sürücü Ücreti", type: "number", required: true },
    { id: "otoyolkopru_gecisleri", label: "Otoyol/Köprü Geçişleri", type: "array", required: true },
    { id: "bakim_km_maliyeti", label: "Bakım km Maliyeti", type: "number", required: true },
    { id: "amortisman_ve_overhead", label: "Amortisman ve Overhead", type: "number", required: true },
  ],
  outputs: [
    { id: "distance_cost", label: "Distance Cost", unit: "currency", format: "currency" },
    { id: "time_cost", label: "Time Cost", unit: "currency", format: "currency" },
    { id: "toll_cost", label: "Toll Cost", unit: "currency", format: "currency" },
    { id: "maintenance_cost", label: "Maintenance Cost", unit: "currency", format: "currency" },
    { id: "overhead", label: "Overhead", unit: "currency", format: "currency" },
    { id: "total_route_cost", label: "Total Route Cost", unit: "currency", format: "currency" },
    { id: "cost_per_km", label: "Cost Per Km", unit: "currency", format: "currency" },
    { id: "cost_per_drop", label: "Cost Per Drop", unit: "currency", format: "currency" },
  ],
  thresholds: [],
  formulaPipeline: [
    { formulaId: "custom.rota_maliyet_analyzer_0", inputMap: { TotalDistance: "total_distance", FuelConsumption: "fuel_consumption", FuelPrice: "fuel_price" }, outputId: "distance_cost" },
    { formulaId: "custom.rota_maliyet_analyzer_1", inputMap: { TotalTime: "total_time", DriverWage: "driver_wage", VehicleDepreciation: "vehicle_depreciation" }, outputId: "time_cost" },
    { formulaId: "custom.rota_maliyet_analyzer_2", inputMap: { Tolls_i: "tolls_i" }, outputId: "toll_cost" },
    { formulaId: "custom.rota_maliyet_analyzer_3", inputMap: { TotalDistance: "total_distance", MaintRatePerKm: "maint_rate_per_km" }, outputId: "maintenance_cost" },
    { formulaId: "custom.rota_maliyet_analyzer_4", inputMap: { DistanceCost: "distance_cost", TimeCost: "time_cost", OverheadPct: "overhead_pct" }, outputId: "overhead" },
    { formulaId: "custom.rota_maliyet_analyzer_5", inputMap: { DistanceCost: "distance_cost", TimeCost: "time_cost", TollCost: "toll_cost", MaintenanceCost: "maintenance_cost", Overhead: "amortisman_ve_overhead" }, outputId: "total_route_cost" },
    { formulaId: "custom.rota_maliyet_analyzer_6", inputMap: { TotalRouteCost: "total_route_cost", TotalDistance: "total_distance" }, outputId: "cost_per_km" },
    { formulaId: "custom.rota_maliyet_analyzer_7", inputMap: { TotalRouteCost: "total_route_cost", NumberOfDrops: "number_of_drops" }, outputId: "cost_per_drop" },
  ],
  reportTemplate: {
    title: "Rota Maliyet Report",
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
