
import type { PremiumCalculatorSchema } from "@/lib/features/premium-schema/premium-calculator-schema";
export const DEMAND_FORECAST_STOCK_SCHEMA: PremiumCalculatorSchema = {
  id: "demand-forecast-stock-analyzer", legacyPaidSlug: "demand-forecast-stock-analyzer",
  name: "Demand Forecast Stock Cost Analyzer", name_i18n: {"en":"Demand Forecast Stock Cost Analyzer"}, sectorSlug: "logistics-transport", category: "cost",
  painStatement: "Demand estimate deviations cause either excess inventory carrying cost or out-of-inventory sales loss.", painStatement_i18n: {"en":"Demand estimate deviations cause either excess inventory carrying cost or out-of-inventory sales loss."},
  inputs: [
    { id: "actualDemand", label: "Actual realized demand", label_i18n: {"en":"Actual realized demand"}, type: "number", unit: "units/period", required: true, smartDefault: 1000, validation: { min: 1 }, helper: "", expertMeaning: "Actual realized demand", expertMeaning_i18n: {"en":"Actual realized demand"} },
    { id: "forecastDemand", label: "Estimated demand", label_i18n: {"en":"Estimated demand"}, type: "number", unit: "units/period", required: true, smartDefault: 1100, validation: { min: 1 }, helper: "", expertMeaning: "Forecasted demand", expertMeaning_i18n: {"en":"Forecasted demand"} },
    { id: "unitCost", label: "Unit Inventory Cost", label_i18n: {"en":"Unit Inventory Cost"}, type: "number", unit: "USD/unit", required: true, smartDefault: 5, validation: { min: 0.01 }, helper: "", expertMeaning: "Unit carrying cost", expertMeaning_i18n: {"en":"Unit carrying cost"} },
    { id: "stockoutCost", label: "Cost per stockout unit", label_i18n: {"en":"Cost per stockout unit"}, type: "number", unit: "USD/unit", required: true, smartDefault: 12, validation: { min: 0.01 }, helper: "", expertMeaning: "Cost per stockout unit", expertMeaning_i18n: {"en":"Cost per stockout unit"} },
    { id: "leadTime", label: "Replenishment lead time", label_i18n: {"en":"Replenishment lead time"}, type: "number", unit: "days", required: false, smartDefault: 5, validation: { min: 0 }, helper: "", expertMeaning: "Replenishment lead time", expertMeaning_i18n: {"en":"Replenishment lead time"} },
  ],
  outputs: [
    { id: "forecastError", label: "Estimate Hatas", label_i18n: {"en":"Estimate Hatas"}, unit: "units", format: "number" },
    { id: "safetyStockForecast", label: "Estimate Bazl Guvenlik Inventory", label_i18n: {"en":"Estimate Bazl Guvenlik Inventory"}, unit: "units", format: "number" },
    { id: "forecastCarryingCost", label: "Carrying Cost (Deviation)", label_i18n: {"en":"Carrying Cost (Deviation)"}, unit: "USD/donem", format: "currency" },
    { id: "stockoutCostForecast", label: "Inventory Ds Cost", label_i18n: {"en":"Inventory Ds Cost"}, unit: "USD/donem", format: "currency" },
    { id: "totalForecastCost", label: "Total Estimate Kaynakl Cost", label_i18n: {"en":"Total Estimate Kaynakl Cost"}, unit: "USD/donem", format: "currency", isBigNumber: true },
  ],
  thresholds: [{ fieldId: "forecastError", warning: 100, critical: 300, direction: "higher_is_bad", warningMessage: "Estimate Error > 100 Units — forecast model must be reviewed.", warningMessage_i18n: {"en":"Estimate Error > 100 Units — forecast model must be reviewed."}, criticalMessage: "Estimate Error > 300 Units — urgent demand Estimated revizyonu gerekli.", criticalMessage_i18n: {"en":"Estimate Error > 300 Units — urgent demand Estimated revizyonu gerekli."} }],
  formulaPipeline: [
    { formulaId: "measurement.forecast_error", inputMap: { actualDemand: "actualDemand", forecastDemand: "forecastDemand" }, outputId: "forecastError" },
    { formulaId: "measurement.safety_stock_forecast", inputMap: {
        leadTime: "leadTime",
        serviceFactor: "forecastError"
      ,
        demandStdDev: "forecastDemand"}, outputId: "safetyStockForecast" },
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
  reportTemplate: { title: "Demand Forecast Cost Report", title_i18n: {"en":"Demand Forecast Cost Report"}, sections: ["executive_summary", "thresholds", "action_plan", "assumptions"], exportFormats: ["pdf", "excel"] },
  assumptions: { hiddenLossMultiplier: 1.15, volatilityPercent: 10, targetMarginPercent: 15, assumptionNotes: ["Forecast error = |Actual − Forecast|.", "Safety stock = error × leadTime factor.", "Total = carrying + stockout cost."],assumptionNotes_i18n:[{"en":"Forecast error = |Actual − Forecast|."},{"en":"Safety stock = error × leadTime factor."},{"en":"Total = carrying + stockout cost."}] },
};
