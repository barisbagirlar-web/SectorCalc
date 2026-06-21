/**
 * Palet Rafı Optimize Edici — Premium Calculator Schema
 * Auto-generated from user-provided formulas
 */
import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";

export const PALLETRACKOPTIMIZER_SCHEMA: PremiumCalculatorSchema = {
  id: "pallet-rack-optimizer-analyzer",
  legacyPaidSlug: "pallet-rack-optimizer-analyzer",
  name: "Palet Rafı Optimize Edici",
  sectorSlug: "general",
  category: "cost",
  painStatement: "Palet Rafı Optimize Edici — premium analysis tool.",
  inputs: [
    { id: "koridorraf_sayisi", label: "Koridor/Raf Sayısı", type: "number", required: true },
    { id: "seviye", label: "Seviye", type: "number", required: true },
    { id: "palet_kapasitesi", label: "Palet Kapasitesi", type: "number", required: true },
    { id: "forklift_hizi", label: "Forklift Hızı", type: "number", required: true },
    { id: "toplama_suresi", label: "Toplama Süresi", type: "number", required: true },
    { id: "kiris_uzunluguyuk", label: "Kiriş Uzunluğu/Yük", type: "number", required: true },
    { id: "elastisite", label: "Elastisite", type: "number", required: true },
    { id: "raf_sistem_toplam_bedeli", label: "Raf Sistem Toplam Bedeli", type: "number", required: true },
  ],
  outputs: [
    { id: "rack_capacity", label: "Rack Capacity", unit: "currency", format: "currency" },
    { id: "floor_utilization", label: "Floor Utilization", unit: "currency", format: "currency" },
    { id: "throughput", label: "Throughput", unit: "currency", format: "currency" },
    { id: "deflection", label: "Deflection", unit: "currency", format: "currency" },
    { id: "safety_factor", label: "Safety Factor", unit: "currency", format: "currency" },
    { id: "cost_per_position", label: "Cost Per Position", unit: "currency", format: "currency" },
    { id: "retrieval_time", label: "Retrieval Time", unit: "currency", format: "currency" },
  ],
  thresholds: [],
  formulaPipeline: [
    { formulaId: "custom.palet_rafi_optimize_edici_analyzer_0", inputMap: { Bays: "bays", Levels: "levels", PalletsPerBay: "pallets_per_bay" }, outputId: "rack_capacity" },
    { formulaId: "custom.palet_rafi_optimize_edici_analyzer_1", inputMap: { RackFootprint: "rack_footprint", TotalFloorArea: "total_floor_area" }, outputId: "floor_utilization" },
    { formulaId: "custom.palet_rafi_optimize_edici_analyzer_2", inputMap: { Aisles: "aisles", ForkliftSpeed: "forklift_speed", TravelDistance: "travel_distance" }, outputId: "throughput" },
    { formulaId: "custom.palet_rafi_optimize_edici_analyzer_3", inputMap: { Load: "load", BeamLength: "beam_length" }, outputId: "deflection" },
    { formulaId: "custom.palet_rafi_optimize_edici_analyzer_4", inputMap: { MaxLoadCapacity: "max_load_capacity", ActualLoad: "actual_load" }, outputId: "safety_factor" },
    { formulaId: "custom.palet_rafi_optimize_edici_analyzer_5", inputMap: { TotalRackCost: "total_rack_cost", RackCapacity: "rack_capacity" }, outputId: "cost_per_position" },
    { formulaId: "custom.palet_rafi_optimize_edici_analyzer_6", inputMap: { TravelTime_Horizontal: "travel_time__horizontal", TravelTime_Vertical: "travel_time__vertical", PickTime: "pick_time" }, outputId: "retrieval_time" },
  ],
  reportTemplate: {
    title: "Palet Rafı Optimize Edici Report",
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
