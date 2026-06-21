/**
 * Lojistik Rota Kaybı — Premium Calculator Schema
 * Auto-generated from user-provided formulas
 */
import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";

export const LOGISTICSROUTELOSS_SCHEMA: PremiumCalculatorSchema = {
  id: "logistics-route-loss-analyzer",
  legacyPaidSlug: "logistics-route-loss-analyzer",
  name: "Lojistik Rota Kaybı",
  sectorSlug: "general",
  category: "cost",
  painStatement: "Lojistik Rota Kaybı — premium analysis tool.",
  inputs: [
    { id: "idealgercek_mesafe_km", label: "İdeal/Gerçek Mesafe km", type: "number", required: true },
    { id: "ortalama_hiz_kms", label: "Ortalama Hız km/s", type: "number", required: true },
    { id: "yakit_tuketim_orani_lkm", label: "Yakıt Tüketim Oranı L/km", type: "number", required: true },
    { id: "yakit_fiyati", label: "Yakıt Fiyatı", type: "number", required: true },
    { id: "surucu_saatlik_ucreti", label: "Sürücü Saatlik Ücreti", type: "number", required: true },
    { id: "arac_km_asinma_maliyeti_currencykm", label: "Araç Km Aşınma Maliyeti currency/km", type: "number", required: true },
  ],
  outputs: [
    { id: "ideal_distance", label: "Ideal Distance", unit: "currency", format: "currency" },
    { id: "actual_distance", label: "Actual Distance", unit: "currency", format: "currency" },
    { id: "drift_pct", label: "Drift Pct", unit: "currency", format: "currency" },
    { id: "fuel_waste", label: "Fuel Waste", unit: "currency", format: "currency" },
    { id: "time_waste", label: "Time Waste", unit: "currency", format: "currency" },
    { id: "total_route_loss", label: "Total Route Loss", unit: "currency", format: "currency" },
    { id: "efficiency", label: "Efficiency", unit: "currency", format: "currency" },
  ],
  thresholds: [],
  formulaPipeline: [
    { formulaId: "custom.lojistik_rota_kaybi_analyzer_0", inputMap: { PointToPoint_Distance: "point_to_point__distance" }, outputId: "ideal_distance" },
    { formulaId: "custom.lojistik_rota_kaybi_analyzer_1", inputMap: { RouteDistance: "route_distance" }, outputId: "actual_distance" },
    { formulaId: "custom.lojistik_rota_kaybi_analyzer_2", inputMap: { ActualDistance: "actual_distance", IdealDistance: "ideal_distance" }, outputId: "drift_pct" },
    { formulaId: "custom.lojistik_rota_kaybi_analyzer_3", inputMap: { ActualDistance: "actual_distance", IdealDistance: "ideal_distance", FuelConsumptionRate: "fuel_consumption_rate", FuelPrice: "fuel_price" }, outputId: "fuel_waste" },
    { formulaId: "custom.lojistik_rota_kaybi_analyzer_4", inputMap: { ActualDistance: "actual_distance", IdealDistance: "ideal_distance", AvgSpeed: "avg_speed", DriverHourlyRate: "driver_hourly_rate" }, outputId: "time_waste" },
    { formulaId: "custom.lojistik_rota_kaybi_analyzer_5", inputMap: { FuelWaste: "fuel_waste", TimeWaste: "time_waste", VehicleWearCost: "vehicle_wear_cost" }, outputId: "total_route_loss" },
    { formulaId: "custom.lojistik_rota_kaybi_analyzer_6", inputMap: { IdealDistance: "ideal_distance", ActualDistance: "actual_distance" }, outputId: "efficiency" },
  ],
  reportTemplate: {
    title: "Lojistik Rota Kaybı Report",
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
