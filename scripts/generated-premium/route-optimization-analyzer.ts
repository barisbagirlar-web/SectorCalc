/**
 * Rota Optimizasyonu Analizörü — Premium Calculator Schema
 * Auto-generated from user-provided formulas
 */
import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";

export const ROUTEOPTIMIZATION_SCHEMA: PremiumCalculatorSchema = {
  id: "route-optimization-analyzer",
  legacyPaidSlug: "route-optimization-analyzer",
  name: "Rota Optimizasyonu Analizörü",
  sectorSlug: "general",
  category: "cost",
  painStatement: "Rota Optimizasyonu Analizörü — premium analysis tool.",
  inputs: [
    { id: "durak_sayisikoordinatlar", label: "Durak Sayısı/Koordinatlar", type: "matrix", required: true },
    { id: "depo_konumu", label: "Depo Konumu", type: "array", required: true },
    { id: "arac_kapasitesi", label: "Araç Kapasitesi", type: "number", required: true },
    { id: "zaman_pencereleri", label: "Zaman Pencereleri", type: "array", required: true },
    { id: "gecikme_ceza_orani", label: "Gecikme Ceza Oranı", type: "number", required: true },
    { id: "baz_rota_maliyeti", label: "Baz Rota Maliyeti", type: "number", required: true },
  ],
  outputs: [
    { id: "nearest_neighbor__dist", label: "Nearest Neighbor_ Dist", unit: "currency", format: "currency" },
    { id: "savings__clarke_wright", label: "Savings_ Clarke Wright", unit: "currency", format: "currency" },
    { id: "route_efficiency", label: "Route Efficiency", unit: "currency", format: "currency" },
    { id: "drop_density", label: "Drop Density", unit: "currency", format: "currency" },
    { id: "time_window_penalty", label: "Time Window Penalty", unit: "currency", format: "currency" },
    { id: "vehicle_utilization", label: "Vehicle Utilization", unit: "currency", format: "currency" },
    { id: "total_savings", label: "Total Savings", unit: "currency", format: "currency" },
  ],
  thresholds: [],
  formulaPipeline: [
    { formulaId: "custom.rota_optimizasyonu_analizoru_analyzer_0", inputMap: { MinDistance_i: "min_distance_i" }, outputId: "nearest_neighbor__dist" },
    { formulaId: "custom.rota_optimizasyonu_analizoru_analyzer_1", inputMap: { Distance_Depot_i: "distance__depot_i", Distance_Depot_j: "distance__depot_j", Distance_i_j: "distance_i_j" }, outputId: "savings__clarke_wright" },
    { formulaId: "custom.rota_optimizasyonu_analizoru_analyzer_2", inputMap: { TheoreticalMinDistance: "theoretical_min_distance", ActualRouteDistance: "actual_route_distance" }, outputId: "route_efficiency" },
    { formulaId: "custom.rota_optimizasyonu_analizoru_analyzer_3", inputMap: { NumberOfDrops: "number_of_drops", RouteArea: "route_area" }, outputId: "drop_density" },
    { formulaId: "custom.rota_optimizasyonu_analizoru_analyzer_4", inputMap: { ArrivalTime: "arrival_time", LateWindow: "late_window", PenaltyRate: "penalty_rate" }, outputId: "time_window_penalty" },
    { formulaId: "custom.rota_optimizasyonu_analizoru_analyzer_5", inputMap: { TotalLoad: "total_load", VehicleCapacity: "vehicle_capacity" }, outputId: "vehicle_utilization" },
    { formulaId: "custom.rota_optimizasyonu_analizoru_analyzer_6", inputMap: { BaselineCost: "baseline_cost", OptimizedCost: "optimized_cost" }, outputId: "total_savings" },
  ],
  reportTemplate: {
    title: "Rota Optimizasyonu Analizörü Report",
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
