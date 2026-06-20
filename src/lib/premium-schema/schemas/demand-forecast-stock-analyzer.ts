/**
 * Tool #17 — Talep Forecast
 */
import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";
export const DEMAND_FORECAST_STOCK_SCHEMA: PremiumCalculatorSchema = {
  id: "demand-forecast-stock-analyzer", legacyPaidSlug: "demand-forecast-stock-analyzer",
  name: "Talep Tahmini Stok Maliyeti", sectorSlug: "logistics-transport", category: "cost",
  painStatement: "Talep tahmini sapmaları ya stok fazlası taşıma maliyetine ya da stok dışı satış kaybına neden olur.",
  inputs: [
    { id: "actualDemand", label: "Gerçekleşen Talep", type: "number", unit: "adet/dönem", required: true, smartDefault: 1000, validation: { min: 1 }, helper: "", expertMeaning: "Actual realized demand" },
    { id: "forecastDemand", label: "Tahmini Talep", type: "number", unit: "adet/dönem", required: true, smartDefault: 1100, validation: { min: 1 }, helper: "", expertMeaning: "Forecasted demand" },
    { id: "unitCost", label: "Birim Stok Maliyeti", type: "number", unit: "USD/adet", required: true, smartDefault: 5, validation: { min: 0.01 }, helper: "", expertMeaning: "Unit carrying cost" },
    { id: "stockoutCost", label: "Stok Dışı Kalma Maliyeti", type: "number", unit: "USD/adet", required: true, smartDefault: 12, validation: { min: 0.01 }, helper: "", expertMeaning: "Cost per stockout unit" },
    { id: "leadTime", label: "Teslim Süresi", type: "number", unit: "gün", required: false, smartDefault: 5, validation: { min: 0 }, helper: "", expertMeaning: "Replenishment lead time" },
  ],
  outputs: [
    { id: "forecastError", label: "Tahmin Hatası", unit: "adet", format: "number" },
    { id: "safetyStockForecast", label: "Tahmin Bazlı Güvenlik Stoğu", unit: "adet", format: "number" },
    { id: "forecastCarryingCost", label: "Taşıma Maliyeti (Sapma)", unit: "USD/dönem", format: "currency" },
    { id: "stockoutCostForecast", label: "Stok Dışı Maliyeti", unit: "USD/dönem", format: "currency" },
    { id: "totalForecastCost", label: "Toplam Tahmin Kaynaklı Maliyet", unit: "USD/dönem", format: "currency", isBigNumber: true },
  ],
  thresholds: [{ fieldId: "forecastError", warning: 100, critical: 300, direction: "higher_is_bad", warningMessage: "Tahmin hatası > 100 adet — forecast modeli gözden geçirilmeli.", criticalMessage: "Tahmin hatası > 300 adet — acil talep tahmini revizyonu gerekli." }],
  formulaPipeline: [
    { formulaId: "measurement.forecast_error", inputMap: { actualDemand: "actualDemand", forecastDemand: "forecastDemand" }, outputId: "forecastError" },
    { formulaId: "measurement.safety_stock_forecast", inputMap: { forecastError: "forecastError", leadTime: "leadTime" }, outputId: "safetyStockForecast" },
    { formulaId: "cost.forecast_carrying_cost", inputMap: { forecastError: "forecastError", unitCost: "unitCost" }, outputId: "forecastCarryingCost" },
    { formulaId: "cost.stockout_cost_forecast", inputMap: { forecastError: "forecastError", stockoutCost: "stockoutCost" }, outputId: "stockoutCostForecast" },
    { formulaId: "cost.total_forecast_cost", inputMap: { forecastCarryingCost: "forecastCarryingCost", stockoutCostForecast: "stockoutCostForecast" }, outputId: "totalForecastCost" },
  ],
  reportTemplate: { title: "Demand Forecast Cost Report", sections: ["executive_summary", "thresholds", "action_plan", "assumptions"], exportFormats: ["pdf", "excel"] },
  assumptions: { hiddenLossMultiplier: 1.15, volatilityPercent: 10, targetMarginPercent: 15, assumptionNotes: ["Forecast error = |Actual − Forecast|.", "Safety stock = error × leadTime factor.", "Total = carrying + stockout cost."] },
};
