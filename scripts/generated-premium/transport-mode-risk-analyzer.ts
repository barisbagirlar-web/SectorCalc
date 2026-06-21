/**
 * Taşıma Mode Maliyet risk — Premium Calculator Schema
 * Auto-generated from user-provided formulas
 */
import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";

export const TRANSPORTMODERISK_SCHEMA: PremiumCalculatorSchema = {
  id: "transport-mode-risk-analyzer",
  legacyPaidSlug: "transport-mode-risk-analyzer",
  name: "Taşıma Mode Maliyet risk",
  sectorSlug: "general",
  category: "cost",
  painStatement: "Taşıma Mode Maliyet risk — premium analysis tool.",
  inputs: [
    { id: "agirlik_kghacim_m3", label: "Ağırlık kg/Hacim m3", type: "number", required: true },
    { id: "mesafe_km", label: "Mesafe km", type: "number", required: true },
    { id: "havadenizkara_birim_fiyatlari", label: "Hava/Deniz/Kara Birim Fiyatları", type: "number", required: true },
    { id: "gunluk_stok_tasima_maliyeti", label: "Günlük Stok Taşıma Maliyeti", type: "number", required: true },
    { id: "hasargecikme_olasiliklari", label: "Hasar/Gecikme Olasılıkları", type: "number", required: true },
    { id: "kargo_degeri", label: "Kargo Değeri", type: "number", required: true },
  ],
  outputs: [
    { id: "cost__air", label: "Cost_ Air", unit: "currency", format: "currency" },
    { id: "cost__sea", label: "Cost_ Sea", unit: "currency", format: "currency" },
    { id: "cost__road", label: "Cost_ Road", unit: "currency", format: "currency" },
    { id: "transit_time_cost", label: "Transit Time Cost", unit: "currency", format: "currency" },
    { id: "risk_cost", label: "Risk Cost", unit: "currency", format: "currency" },
    { id: "total_mode_cost", label: "Total Mode Cost", unit: "currency", format: "currency" },
    { id: "mode_selection", label: "Mode Selection", unit: "currency", format: "currency" },
  ],
  thresholds: [],
  formulaPipeline: [
    { formulaId: "custom.tasima_mode_maliyet_risk_analyzer_0", inputMap: { Weight: "weight", AirRate: "air_rate", Handling: "handling" }, outputId: "cost__air" },
    { formulaId: "custom.tasima_mode_maliyet_risk_analyzer_1", inputMap: { Volume: "volume", SeaRate: "sea_rate", PortFees: "port_fees", Customs: "customs" }, outputId: "cost__sea" },
    { formulaId: "custom.tasima_mode_maliyet_risk_analyzer_2", inputMap: { Distance: "distance", RoadRate: "road_rate", Tolls: "tolls" }, outputId: "cost__road" },
    { formulaId: "custom.tasima_mode_maliyet_risk_analyzer_3", inputMap: { TransitDays: "transit_days", InventoryCarryingCostPerDay: "inventory_carrying_cost_per_day" }, outputId: "transit_time_cost" },
    { formulaId: "custom.tasima_mode_maliyet_risk_analyzer_4", inputMap: { ProbabilityOfDamage: "probability_of_damage", CargoValue: "cargo_value", ProbabilityOfDelay: "probability_of_delay", DelayPenalty: "delay_penalty" }, outputId: "risk_cost" },
    { formulaId: "custom.tasima_mode_maliyet_risk_analyzer_5", inputMap: { TransportCost: "transport_cost", TransitTimeCost: "transit_time_cost", RiskCost: "risk_cost" }, outputId: "total_mode_cost" },
    { formulaId: "custom.tasima_mode_maliyet_risk_analyzer_6", inputMap: { TotalModeCost_Air: "total_mode_cost__air", TotalModeCost_Sea: "total_mode_cost__sea", TotalModeCost_Road: "total_mode_cost__road" }, outputId: "mode_selection" },
  ],
  reportTemplate: {
    title: "Taşıma Mode Maliyet risk Report",
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
