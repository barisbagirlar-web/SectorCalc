/**
 * talep Forecast Stok Maliyet — Premium Calculator Schema
 * Auto-generated from user-provided formulas
 */
import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";

export const DEMANDFORECASTSTOCK_SCHEMA: PremiumCalculatorSchema = {
  id: "demand-forecast-stock-analyzer",
  legacyPaidSlug: "demand-forecast-stock-analyzer",
  name: "talep Forecast Stok Maliyet",
  sectorSlug: "general",
  category: "cost",
  painStatement: "talep Forecast Stok Maliyet — premium analysis tool.",
  inputs: [
    { id: "tahmingercek_talep_array", label: "Tahmin/Gerçek Talep array", type: "number", required: true },
    { id: "lead_time_gun", label: "Lead Time gün", type: "number", required: true },
    { id: "zskoru", label: "Z-Skoru", type: "number", required: true },
    { id: "stddev", label: "StdDev", type: "number", required: true },
    { id: "birim_maliyet", label: "Birim Maliyet", type: "number", required: true },
    { id: "tasima_orani", label: "Taşıma Oranı", type: "number", required: true },
    { id: "stoksuz_kalma_cezasi", label: "Stoksuz Kalma Cezası", type: "number", required: true },
  ],
  outputs: [
    { id: "forecast_error", label: "Forecast Error", unit: "currency", format: "currency" },
    { id: "safety_stock", label: "Safety Stock", unit: "currency", format: "currency" },
    { id: "carrying_cost__safety", label: "Carrying Cost_ Safety", unit: "currency", format: "currency" },
    { id: "stockout_cost", label: "Stockout Cost", unit: "currency", format: "currency" },
    { id: "total_forecast_cost", label: "Total Forecast Cost", unit: "currency", format: "currency" },
  ],
  thresholds: [],
  formulaPipeline: [
    { formulaId: "custom.talep_forecast_stok_maliyet_analyzer_0", inputMap: { ActualDemand: "actual_demand", ForecastDemand: "forecast_demand" }, outputId: "forecast_error" },
    { formulaId: "custom.talep_forecast_stok_maliyet_analyzer_1", inputMap: { Z_Score: "z__score", StdDev_ForecastError: "stddev", LeadTime: "lead_time_gun" }, outputId: "safety_stock" },
    { formulaId: "custom.talep_forecast_stok_maliyet_analyzer_2", inputMap: { SafetyStock: "safety_stock", UnitCost: "unit_cost", HoldingRate: "holding_rate" }, outputId: "carrying_cost__safety" },
    { formulaId: "custom.talep_forecast_stok_maliyet_analyzer_3", inputMap: { ActualDemand: "actual_demand", ForecastDemand: "forecast_demand", SafetyStock: "safety_stock", PenaltyCost: "penalty_cost" }, outputId: "stockout_cost" },
    { formulaId: "custom.talep_forecast_stok_maliyet_analyzer_4", inputMap: { CarryingCost_Safety: "carrying_cost__safety", StockoutCost: "stockout_cost", ForecastingSystemCost: "forecasting_system_cost" }, outputId: "total_forecast_cost" },
  ],
  reportTemplate: {
    title: "talep Forecast Stok Maliyet Report",
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
