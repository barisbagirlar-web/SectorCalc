/**
 * Tool #41 — Rota Maliyet Analizi
 */
import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";
export const ROUTE_COST_ANALYZER_SCHEMA: PremiumCalculatorSchema = {
  id: "route-cost-analyzer", legacyPaidSlug: "route-cost-analyzer",
  name: "Rota Maliyet Analizi", name_i18n: {"en":"Route Cost Analysis","tr":"Rota Maliyet Analizi"}, sectorSlug: "logistics-transport", category: "route",
  painStatement: "Rota maliyeti km, zaman, geçiş ücreti ve genel gider bazında hesaplanmazsa nakliye fiyatlaması zarar edebilir.", painStatement_i18n: {"en":"If route cost is not calculated based on distance, time, tolls, and overhead, transportation pricing may result in losses.","tr":"Rota maliyeti km, zaman, geçiş ücreti ve genel gider bazında hesaplanmazsa nakliye fiyatlaması zarar edebilir."},
  inputs: [
    { id: "distance", label: "Mesafe", label_i18n: {"en":"Mesafe","tr":"Mesafe"}, type: "number", unit: "km", required: true, smartDefault: 350, validation: { min: 0.1 }, helper: "", expertMeaning: "Route distance in km", expertMeaning_i18n: {"en":"Route distance in km","tr":"Route distance in km"} },
    { id: "fuelCostPerKm", label: "Yakıt Maliyeti", label_i18n: {"en":"Yakıt Maliyeti","tr":"Yakıt Maliyeti"}, type: "number", unit: "USD/km", required: true, smartDefault: 0.35, validation: { min: 0.01 }, helper: "", expertMeaning: "Fuel cost per km", expertMeaning_i18n: {"en":"Fuel cost per km","tr":"Fuel cost per km"} },
    { id: "driverWagePerHour", label: "Sürücü Saat Ücreti", label_i18n: {"en":"Sürücü Saat Ücreti","tr":"Sürücü Saat Ücreti"}, type: "number", unit: "USD/saat", required: true, smartDefault: 18, validation: { min: 1 }, helper: "", expertMeaning: "Driver hourly wage", expertMeaning_i18n: {"en":"Driver hourly wage","tr":"Driver hourly wage"} },
    { id: "avgSpeed", label: "Ortalama Hız", label_i18n: {"en":"Ortalama Hız","tr":"Ortalama Hız"}, type: "number", unit: "km/saat", required: true, smartDefault: 70, validation: { min: 1 }, helper: "", expertMeaning: "Average travel speed", expertMeaning_i18n: {"en":"Average travel speed","tr":"Average travel speed"} },
    { id: "numberOfDrops", label: "Teslimat Sayısı", label_i18n: {"en":"Teslimat Sayısı","tr":"Teslimat Sayısı"}, type: "number", unit: "durak", required: true, smartDefault: 8, validation: { min: 1 }, helper: "", expertMeaning: "Number of drops per route", expertMeaning_i18n: {"en":"Number of drops per route","tr":"Number of drops per route"} },
    { id: "tollCost", label: "Köprü / Geçiş Ücreti", label_i18n: {"en":"Köprü / Geçiş Ücreti","tr":"Köprü / Geçiş Ücreti"}, type: "number", unit: "USD", required: false, smartDefault: 25, validation: { min: 0 }, helper: "", expertMeaning: "Toll and bridge costs", expertMeaning_i18n: {"en":"Toll and bridge costs","tr":"Toll and bridge costs"} },
    { id: "maintenancePerKm", label: "Bakım Maliyeti", label_i18n: {"en":"Maintenance Cost","tr":"Bakım Maliyeti"}, type: "number", unit: "USD/km", required: false, smartDefault: 0.12, validation: { min: 0 }, helper: "", expertMeaning: "Maintenance cost per km", expertMeaning_i18n: {"en":"Maintenance cost per km","tr":"Maintenance cost per km"} },
    { id: "overheadPercent", label: "Genel Gider Oranı", label_i18n: {"en":"Genel Gider Oranı","tr":"Genel Gider Oranı"}, type: "number", unit: "%", required: false, smartDefault: 15, validation: { min: 0, max: 50 }, helper: "", expertMeaning: "Overhead allocation percentage", expertMeaning_i18n: {"en":"Overhead allocation percentage","tr":"Overhead allocation percentage"} },
  ],
  outputs: [
    { id: "routeDistanceCost", label: "Mesafe Maliyeti", label_i18n: {"en":"Mesafe Maliyeti","tr":"Mesafe Maliyeti"}, unit: "USD", format: "currency" },
    { id: "routeTimeCost", label: "Zaman Maliyeti", label_i18n: {"en":"Zaman Maliyeti","tr":"Zaman Maliyeti"}, unit: "USD", format: "currency" },
    { id: "routeTollCost", label: "Geçiş Ücreti", label_i18n: {"en":"Toll Cost","tr":"Geçiş Ücreti"}, unit: "USD", format: "currency" },
    { id: "routeMaintenanceCost", label: "Bakım Maliyeti", label_i18n: {"en":"Maintenance Cost","tr":"Bakım Maliyeti"}, unit: "USD", format: "currency" },
    { id: "routeOverhead", label: "Genel Gider", label_i18n: {"en":"Genel Gider","tr":"Genel Gider"}, unit: "USD", format: "currency" },
    { id: "routeTotalCost", label: "Toplam Rota Maliyeti", label_i18n: {"en":"Toplam Rota Maliyeti","tr":"Toplam Rota Maliyeti"}, unit: "USD", format: "currency" },
    { id: "routeCostPerKm", label: "Km Başına Maliyet", label_i18n: {"en":"Cost per Km","tr":"Km Başına Maliyet"}, unit: "USD/km", format: "currency" },
    { id: "routeCostPerDrop", label: "Teslimat Başına Maliyet", label_i18n: {"en":"Cost per Delivery","tr":"Teslimat Başına Maliyet"}, unit: "USD/durak", format: "currency" },
  ],
  thresholds: [{ fieldId: "routeCostPerKm", warning: 1.5, critical: 2.0, direction: "higher_is_bad", warningMessage: "Km maliyet > $1.50 — rota optimizasyonu önerilir.", warningMessage_i18n: {"en":"Cost per km > $1.50 — route optimization recommended.","tr":"Km maliyet > $1.50 — rota optimizasyonu önerilir."}, criticalMessage: "Km maliyet > $2.00 — rota kârlılığı risk altında.", criticalMessage_i18n: {"en":"Cost per km > $2.00 — route profitability at risk.","tr":"Km maliyet > $2.00 — rota kârlılığı risk altında."} }],
  formulaPipeline: [
    { formulaId: "cost.route_distance_cost", inputMap: { distance: "distance", fuelCostPerKm: "fuelCostPerKm" }, outputId: "routeDistanceCost" },
    { formulaId: "cost.route_time_cost", inputMap: { distance: "distance", avgSpeed: "avgSpeed", driverWagePerHour: "driverWagePerHour" }, outputId: "routeTimeCost" },
    { formulaId: "cost.route_toll_cost", inputMap: { tollCost: "tollCost" }, outputId: "routeTollCost" },
    { formulaId: "cost.route_maintenance_cost", inputMap: { distance: "distance", maintenancePerKm: "maintenancePerKm" }, outputId: "routeMaintenanceCost" },
    { formulaId: "cost.route_overhead", inputMap: { distance: "distance", fuelCostPerKm: "fuelCostPerKm", driverWagePerHour: "driverWagePerHour", avgSpeed: "avgSpeed", tollCost: "tollCost", maintenancePerKm: "maintenancePerKm", overheadPercent: "overheadPercent" }, outputId: "routeOverhead" },
    { formulaId: "cost.route_total_cost", inputMap: { routeDistanceCost: "routeDistanceCost", routeTimeCost: "routeTimeCost", routeTollCost: "routeTollCost", routeMaintenanceCost: "routeMaintenanceCost", routeOverhead: "routeOverhead" }, outputId: "routeTotalCost" },
    { formulaId: "measurement.route_cost_per_km", inputMap: { routeTotalCost: "routeTotalCost", distance: "distance" }, outputId: "routeCostPerKm" },
    { formulaId: "measurement.route_cost_per_drop", inputMap: { routeTotalCost: "routeTotalCost", numberOfDrops: "numberOfDrops" }, outputId: "routeCostPerDrop" },
  ],
  reportTemplate: { title: "Route Cost Analysis Report", title_i18n: {"en":"Route Cost Analysis Report","tr":"Rota Maliyet Analiz Raporu"}, sections: ["executive_summary", "thresholds", "action_plan", "assumptions"], exportFormats: ["pdf", "excel"] },
  assumptions: { hiddenLossMultiplier: 1.0, volatilityPercent: 10, targetMarginPercent: 15, assumptionNotes: ["Mesafe maliyeti = km × yakıt birim maliyet.", "Zaman maliyeti = (km/hız) × saat ücret.", "Genel gider = doğrudan maliyetler × oran.", "Km maliyet = toplam / km, drop maliyet = toplam / durak."],assumptionNotes_i18n:[{"en":"Distance cost = km × fuel unit cost.","tr":"Mesafe maliyeti = km × yakıt birim maliyet."},{"en":"Time cost = (km/speed) × hourly wage.","tr":"Zaman maliyeti = (km/hız) × saat ücret."},{"en":"Overhead = direct costs × rate.","tr":"Genel gider = doğrudan maliyetler × oran."},{"en":"Km maliyet = toplam / km, drop maliyet = toplam / durak.","tr":"Km maliyet = toplam / km, drop maliyet = toplam / durak."}] },
};
