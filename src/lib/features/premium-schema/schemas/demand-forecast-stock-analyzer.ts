/**
 * Tool #17 — Talep Forecast
 */
import type { PremiumCalculatorSchema } from "@/lib/features/premium-schema/premium-calculator-schema";
export const DEMAND_FORECAST_STOCK_SCHEMA: PremiumCalculatorSchema = {
  id: "demand-forecast-stock-analyzer", legacyPaidSlug: "demand-forecast-stock-analyzer",
  name: "Talep Tahmini Stok Maliyeti", name_i18n: {"en":"Talep Tahmini Stok Maliyeti","tr":"Talep Tahmini Stok Maliyeti"}, sectorSlug: "logistics-transport", category: "cost",
  painStatement: "Talep tahmini sapmaları ya stok fazlası taşıma maliyetine ya da stok dışı satış kaybına neden olur.", painStatement_i18n: {"en":"Talep tahmini sapmaları ya stok fazlası taşıma maliyetine ya da stok dışı satış kaybına neden olur.","tr":"Talep tahmini sapmaları ya stok fazlası taşıma maliyetine ya da stok dışı satış kaybına neden olur."},
  inputs: [
    { id: "actualDemand", label: "Gerçekleşen Talep", label_i18n: {"en":"Actual realized demand","tr":"Gerçekleşen Talep"}, type: "number", unit: "adet/dönem", required: true, smartDefault: 1000, validation: { min: 1 }, helper: "", expertMeaning: "Actual realized demand", expertMeaning_i18n: {"en":"Actual realized demand","tr":"gerçekleşen talep"} },
    { id: "forecastDemand", label: "Tahmini Talep", label_i18n: {"en":"Tahmini Talep","tr":"Tahmini Talep"}, type: "number", unit: "adet/dönem", required: true, smartDefault: 1100, validation: { min: 1 }, helper: "", expertMeaning: "Forecasted demand", expertMeaning_i18n: {"en":"Forecasted demand","tr":"Forecasted demand"} },
    { id: "unitCost", label: "Birim Stok Maliyeti", label_i18n: {"en":"Birim Stok Maliyeti","tr":"Birim Stok Maliyeti"}, type: "number", unit: "USD/adet", required: true, smartDefault: 5, validation: { min: 0.01 }, helper: "", expertMeaning: "Unit carrying cost", expertMeaning_i18n: {"en":"Unit carrying cost","tr":"Unit carrying cost"} },
    { id: "stockoutCost", label: "Stok Dışı Kalma Maliyeti", label_i18n: {"en":"Cost per stockout unit","tr":"Stok Dışı Kalma Maliyeti"}, type: "number", unit: "USD/adet", required: true, smartDefault: 12, validation: { min: 0.01 }, helper: "", expertMeaning: "Cost per stockout unit", expertMeaning_i18n: {"en":"Cost per stockout unit","tr":"stok dışı kalma maliyeti"} },
    { id: "leadTime", label: "Teslim Süresi", label_i18n: {"en":"Replenishment lead time","tr":"Teslim Süresi"}, type: "number", unit: "gün", required: false, smartDefault: 5, validation: { min: 0 }, helper: "", expertMeaning: "Replenishment lead time", expertMeaning_i18n: {"en":"Replenishment lead time","tr":"teslim süresi"} },
  ],
  outputs: [
    { id: "forecastError", label: "Tahmin Hatası", label_i18n: {"en":"Tahmin Hatas","tr":"Tahmin Hatası"}, unit: "adet", format: "number" },
    { id: "safetyStockForecast", label: "Tahmin Bazlı Güvenlik Stoğu", label_i18n: {"en":"Tahmin Bazl Guvenlik Stogu","tr":"Tahmin Bazlı Güvenlik Stoğu"}, unit: "adet", format: "number" },
    { id: "forecastCarryingCost", label: "Taşıma Maliyeti (Sapma)", label_i18n: {"en":"Tasma Maliyeti (Sapma)","tr":"Taşıma Maliyeti (Sapma)"}, unit: "USD/dönem", format: "currency" },
    { id: "stockoutCostForecast", label: "Stok Dışı Maliyeti", label_i18n: {"en":"Stok Ds Maliyeti","tr":"Stok Dışı Maliyeti"}, unit: "USD/dönem", format: "currency" },
    { id: "totalForecastCost", label: "Toplam Tahmin Kaynaklı Maliyet", label_i18n: {"en":"Toplam Tahmin Kaynakl Maliyet","tr":"Toplam Tahmin Kaynaklı Maliyet"}, unit: "USD/dönem", format: "currency", isBigNumber: true },
  ],
  thresholds: [{ fieldId: "forecastError", warning: 100, critical: 300, direction: "higher_is_bad", warningMessage: "Tahmin hatası > 100 adet — forecast modeli gözden geçirilmeli.", warningMessage_i18n: {"en":"Tahmin hatası > 100 adet — forecast modeli gözden geçirilmeli.","tr":"Tahmin hatası > 100 adet — forecast modeli gözden geçirilmeli."}, criticalMessage: "Tahmin hatası > 300 adet — acil talep tahmini revizyonu gerekli.", criticalMessage_i18n: {"en":"Tahmin hatası > 300 adet — acil talep tahmini revizyonu gerekli.","tr":"Tahmin hatası > 300 adet — acil talep tahmini revizyonu gerekli."} }],
  formulaPipeline: [
    { formulaId: "measurement.forecast_error", inputMap: { actualDemand: "actualDemand", forecastDemand: "forecastDemand" }, outputId: "forecastError" },
    { formulaId: "measurement.safety_stock_forecast", inputMap: {
        leadTime: "leadTime",
        serviceFactor: "forecastError"
      }, outputId: "safetyStockForecast" },
    { formulaId: "cost.forecast_carrying_cost", inputMap: {
        safetyStock: "forecastError",
        holdingCostPerUnit: "unitCost"
      }, outputId: "forecastCarryingCost" },
    { formulaId: "cost.stockout_cost_forecast", inputMap: {
        stockoutUnits: "forecastError",
        lostMarginPerUnit: "stockoutCost"
      }, outputId: "stockoutCostForecast" },
    { formulaId: "cost.total_forecast_cost", inputMap: {
        carryingCost: "forecastCarryingCost",
        stockoutCost: "stockoutCostForecast"
      }, outputId: "totalForecastCost" },
  ],
  reportTemplate: { title: "Demand Forecast Cost Report", title_i18n: {"en":"Demand Forecast Cost Report","tr":"Demand Forecast Cost Report"}, sections: ["executive_summary", "thresholds", "action_plan", "assumptions"], exportFormats: ["pdf", "excel"] },
  assumptions: { hiddenLossMultiplier: 1.15, volatilityPercent: 10, targetMarginPercent: 15, assumptionNotes: ["Forecast error = |Actual − Forecast|.", "Safety stock = error × leadTime factor.", "Total = carrying + stockout cost."],assumptionNotes_i18n:[{"en":"Forecast error = |Actual − Forecast|.","tr":"Forecast error = |Actual − Forecast|."},{"en":"Safety stock = error × leadTime factor.","tr":"Safety stock = error × leadTime factor."},{"en":"Total = carrying + stockout cost.","tr":"Total = carrying + stockout cost."}] },
};
