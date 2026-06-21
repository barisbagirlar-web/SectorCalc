/**
 * DEPO YERLEŞİMİ — Premium Calculator Schema
 * Auto-generated from user-provided formulas
 */
import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";

export const WAREHOUSELAYOUT_SCHEMA: PremiumCalculatorSchema = {
  id: "warehouse-layout-analyzer",
  legacyPaidSlug: "warehouse-layout-analyzer",
  name: "DEPO YERLEŞİMİ",
  sectorSlug: "general",
  category: "cost",
  painStatement: "DEPO YERLEŞİMİ — premium analysis tool.",
  inputs: [
    { id: "taban_alani", label: "Taban Alanı", type: "number", required: true },
    { id: "depolama_orani", label: "Depolama Oranı", type: "number", required: true },
    { id: "raf_seviye", label: "Raf Seviye", type: "number", required: true },
    { id: "palet_olcu", label: "Palet Ölçü", type: "text", required: true },
    { id: "koridor", label: "Koridor", type: "number", required: true },
    { id: "forklift", label: "Forklift", type: "text", required: true },
    { id: "gunluk_sevkiyat", label: "Günlük Sevkıyat", type: "number", required: true },
  ],
  outputs: [
    { id: "storage_area", label: "Storage Area", unit: "currency", format: "currency" },
    { id: "pallet_positions", label: "Pallet Positions", unit: "currency", format: "currency" },
    { id: "vertical_cap", label: "Vertical Cap", unit: "currency", format: "currency" },
    { id: "throughput_cap", label: "Throughput Cap", unit: "currency", format: "currency" },
    { id: "travel_dist", label: "Travel Dist", unit: "currency", format: "currency" },
    { id: "pick_efficiency", label: "Pick Efficiency", unit: "currency", format: "currency" },
    { id: "cube_util", label: "Cube Util", unit: "currency", format: "currency" },
    { id: "cost_per_pos", label: "Cost Per Pos", unit: "currency", format: "currency" },
  ],
  thresholds: [],
  formulaPipeline: [
    { formulaId: "custom.depo_yerlesimi_analyzer_0", inputMap: { Footprint: "footprint", UtilRate: "util_rate" }, outputId: "storage_area" },
    { formulaId: "custom.depo_yerlesimi_analyzer_1", inputMap: { StorageArea: "storage_area", PalletFootprint: "pallet_footprint", AisleFactor: "aisle_factor" }, outputId: "pallet_positions" },
    { formulaId: "custom.depo_yerlesimi_analyzer_2", inputMap: { PalletPositions: "pallet_positions", RackLevels: "rack_levels" }, outputId: "vertical_cap" },
    { formulaId: "custom.depo_yerlesimi_analyzer_3", inputMap: { Doors: "doors", Turnaround_Load: "turnaround__load", Turnaround_Unload: "turnaround__unload" }, outputId: "throughput_cap" },
    { formulaId: "custom.depo_yerlesimi_analyzer_4", inputMap: { Freq: "freq", Dist: "dist" }, outputId: "travel_dist" },
    { formulaId: "custom.depo_yerlesimi_analyzer_5", inputMap: { Lines: "lines", TravelTime: "travel_time" }, outputId: "pick_efficiency" },
    { formulaId: "custom.depo_yerlesimi_analyzer_6", inputMap: { ActualVol: "actual_vol", RackVol: "rack_vol" }, outputId: "cube_util" },
    { formulaId: "custom.depo_yerlesimi_analyzer_7", inputMap: { FacilityCost: "facility_cost", PalletPositions: "pallet_positions" }, outputId: "cost_per_pos" },
  ],
  reportTemplate: {
    title: "DEPO YERLEŞİMİ Report",
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
