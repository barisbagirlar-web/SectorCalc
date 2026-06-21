/**
 * Yakıt Rota Sapma — Premium Calculator Schema
 * Auto-generated from user-provided formulas
 */
import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";

export const FUELROUTEDRIFT_SCHEMA: PremiumCalculatorSchema = {
  id: "fuel-route-drift-analyzer",
  legacyPaidSlug: "fuel-route-drift-analyzer",
  name: "Yakıt Rota Sapma",
  sectorSlug: "general",
  category: "cost",
  painStatement: "Yakıt Rota Sapma — premium analysis tool.",
  inputs: [
    { id: "planligercek_mesafe_km", label: "Planlı/Gerçek Mesafe km", type: "number", required: true },
    { id: "planligercek_tuketim_lkm", label: "Planlı/Gerçek Tüketim L/km", type: "number", required: true },
    { id: "rolanti_suresi_saat", label: "Rölanti Süresi saat", type: "number", required: true },
    { id: "rolanti_tuketim_lsaat", label: "Rölanti Tüketim L/saat", type: "number", required: true },
    { id: "yakit_fiyati_currencyl", label: "Yakıt Fiyatı currency/L", type: "number", required: true },
  ],
  outputs: [
    { id: "planned_fuel", label: "Planned Fuel", unit: "currency", format: "currency" },
    { id: "actual_fuel", label: "Actual Fuel", unit: "currency", format: "currency" },
    { id: "route_drift", label: "Route Drift", unit: "currency", format: "currency" },
    { id: "fuel_waste__distance", label: "Fuel Waste_ Distance", unit: "currency", format: "currency" },
    { id: "fuel_waste__efficiency", label: "Fuel Waste_ Efficiency", unit: "currency", format: "currency" },
    { id: "idle_fuel_cost", label: "Idle Fuel Cost", unit: "currency", format: "currency" },
    { id: "total_drift_cost", label: "Total Drift Cost", unit: "currency", format: "currency" },
  ],
  thresholds: [],
  formulaPipeline: [
    { formulaId: "custom.yakit_rota_sapma_analyzer_0", inputMap: { PlannedDistance: "planned_distance", FuelEfficiency: "fuel_efficiency" }, outputId: "planned_fuel" },
    { formulaId: "custom.yakit_rota_sapma_analyzer_1", inputMap: { ActualDistance: "actual_distance", ActualFuelEfficiency: "actual_fuel_efficiency" }, outputId: "actual_fuel" },
    { formulaId: "custom.yakit_rota_sapma_analyzer_2", inputMap: { ActualDistance: "actual_distance", PlannedDistance: "planned_distance" }, outputId: "route_drift" },
    { formulaId: "custom.yakit_rota_sapma_analyzer_3", inputMap: { RouteDrift: "route_drift", FuelEfficiency: "fuel_efficiency", FuelPrice: "fuel_price" }, outputId: "fuel_waste__distance" },
    { formulaId: "custom.yakit_rota_sapma_analyzer_4", inputMap: { PlannedDistance: "planned_distance", ActualFuelEfficiency: "actual_fuel_efficiency", FuelEfficiency: "fuel_efficiency", FuelPrice: "fuel_price" }, outputId: "fuel_waste__efficiency" },
    { formulaId: "custom.yakit_rota_sapma_analyzer_5", inputMap: { IdleTime: "idle_time", IdleConsumptionRate: "idle_consumption_rate", FuelPrice: "fuel_price" }, outputId: "idle_fuel_cost" },
    { formulaId: "custom.yakit_rota_sapma_analyzer_6", inputMap: { FuelWaste_Distance: "fuel_waste__distance", FuelWaste_Efficiency: "fuel_waste__efficiency", IdleFuelCost: "idle_fuel_cost" }, outputId: "total_drift_cost" },
  ],
  reportTemplate: {
    title: "Yakıt Rota Sapma Report",
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
