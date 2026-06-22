/**
 * Tool — Rota Optimizasyonu
 */
import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";
export const ROUTE_OPTIMIZATION_ANALYZER: PremiumCalculatorSchema = {
  id: "route-optimization-analyzer", legacyPaidSlug: "route-optimization-analyzer",
  name: "Rota Optimizasyon Analizi", name_i18n: {"en":"Route Optimization Analysis","tr":"Rota Optimizasyon Analizi"}, sectorSlug: "logistics-transport", category: "cost",
  painStatement: "Araç rotaları optimize edilmezse yakıt, zaman ve bakım maliyetleri kontrolsüz büyür, filo verimi düşer.", painStatement_i18n: {"en":"If vehicle routes are not optimized, fuel, time, and maintenance costs grow uncontrollably, reducing fleet efficiency.","tr":"Araç rotaları optimize edilmezse yakıt, zaman ve bakım maliyetleri kontrolsüz büyür, filo verimi düşer."},
  inputs: [
    { id: "numStops", label: "Durak Sayısı", label_i18n: {"en":"Number of Stops","tr":"Durak Sayısı"}, type: "number", unit: "adet", required: true, smartDefault: 20, validation: { min: 2 }, helper: "", expertMeaning: "Number of delivery stops", expertMeaning_i18n: {"en":"Number of delivery stops","tr":"Teslimat durağı sayısı"} },
    { id: "totalDistance", label: "Toplam Mesafe", label_i18n: {"en":"Total Distance","tr":"Toplam Mesafe"}, type: "number", unit: "km", required: true, smartDefault: 350, validation: { min: 1 }, helper: "", expertMeaning: "Total route distance", expertMeaning_i18n: {"en":"Total route distance","tr":"Toplam rota mesafesi"} },
    { id: "fuelCostPerKm", label: "Km Başına Yakıt Maliyeti", label_i18n: {"en":"Fuel Cost per Km","tr":"Km Başına Yakıt Maliyeti"}, type: "number", unit: "USD/km", required: true, smartDefault: 0.45, validation: { min: 0.01 }, helper: "", expertMeaning: "Fuel cost per km", expertMeaning_i18n: {"en":"Fuel cost per km","tr":"Km başına yakıt maliyeti"} },
    { id: "driverCostPerHour", label: "Saatlik Sürücü Maliyeti", label_i18n: {"en":"Driver Cost per Hour","tr":"Saatlik Sürücü Maliyeti"}, type: "number", unit: "USD/saat", required: true, smartDefault: 25, validation: { min: 1 }, helper: "", expertMeaning: "Driver cost per hour", expertMeaning_i18n: {"en":"Driver cost per hour","tr":"Saatlik sürücü maliyeti"} },
    { id: "avgSpeed", label: "Ortalama Hız", label_i18n: {"en":"Average Speed","tr":"Ortalama Hız"}, type: "number", unit: "km/saat", required: true, smartDefault: 50, validation: { min: 5 }, helper: "", expertMeaning: "Average vehicle speed", expertMeaning_i18n: {"en":"Average vehicle speed","tr":"Ortalama araç hızı"} },
    { id: "vehicleCount", label: "Araç Sayısı", label_i18n: {"en":"Number of Vehicles","tr":"Araç Sayısı"}, type: "number", unit: "adet", required: false, smartDefault: 5, validation: { min: 1 }, helper: "", expertMeaning: "Number of vehicles", expertMeaning_i18n: {"en":"Number of vehicles","tr":"Araç sayısı"} },
    { id: "workingDaysPerYear", label: "Yıllık Çalışma Günü", label_i18n: {"en":"Annual Working Days","tr":"Yıllık Çalışma Günü"}, type: "number", unit: "gün", required: false, smartDefault: 260, validation: { min: 1 }, helper: "", expertMeaning: "Working days per year", expertMeaning_i18n: {"en":"Working days per year","tr":"Yıllık çalışma günü"} },
  ],
  outputs: [
    { id: "nearestNeighborDist", label: "En Yakın Komşu Mesafesi", label_i18n: {"en":"Nearest Neighbor Distance","tr":"En Yakın Komşu Mesafesi"}, unit: "km", format: "number" },
    { id: "clarkeWrightDist", label: "Clarke-Wright Mesafesi", label_i18n: {"en":"Clarke-Wright Distance","tr":"Clarke-Wright Mesafesi"}, unit: "km", format: "number" },
    { id: "efficiencyScore", label: "Rota Verimlilik Skoru", label_i18n: {"en":"Route Efficiency Score","tr":"Rota Verimlilik Skoru"}, unit: "%", format: "percentage" },
    { id: "totalSavings", label: "Toplam Tasarruf", label_i18n: {"en":"Toplam Tasarruf","tr":"Toplam Tasarruf"}, unit: "USD/yıl", format: "currency", isBigNumber: true },
  ],
  thresholds: [{ fieldId: "efficiencyScore", warning: 75, critical: 50, direction: "lower_is_bad", warningMessage: "Verimlilik <%75 — rota optimizasyonu önerilir.", warningMessage_i18n: {"en":"Efficiency < 75% — route optimization recommended.","tr":"Verimlilik <%75 — rota optimizasyonu önerilir."}, criticalMessage: "Verimlilik <%50 — acil rota iyileştirmesi gerekli.", criticalMessage_i18n: {"en":"Efficiency < 50% — urgent route improvement needed.","tr":"Verimlilik <%50 — acil rota iyileştirmesi gerekli."} }],
  formulaPipeline: [
    { formulaId: "measurement.route_nearest_neighbor", inputMap: { numStops: "numStops", totalDistance: "totalDistance" }, outputId: "nearestNeighborDist" },
    { formulaId: "measurement.route_clarke_wright", inputMap: { numStops: "numStops", totalDistance: "totalDistance" }, outputId: "clarkeWrightDist" },
    { formulaId: "measurement.route_efficiency_score", inputMap: { nearestNeighborDist: "nearestNeighborDist", clarkeWrightDist: "clarkeWrightDist" }, outputId: "efficiencyScore" },
    { formulaId: "cost.route_total_savings", inputMap: { totalDistance: "totalDistance", fuelCostPerKm: "fuelCostPerKm", driverCostPerHour: "driverCostPerHour", avgSpeed: "avgSpeed", vehicleCount: "vehicleCount", workingDaysPerYear: "workingDaysPerYear", efficiencyScore: "efficiencyScore" }, outputId: "totalSavings" },
  ],
  reportTemplate: { title: "Rota Optimizasyon Raporu", title_i18n: {"en":"Route Optimization Report","tr":"Rota Optimizasyon Raporu"}, sections: ["executive_summary", "loss_breakdown", "thresholds", "action_plan", "assumptions"], exportFormats: ["pdf", "excel"] },
  assumptions: { hiddenLossMultiplier: 1.1, volatilityPercent: 10, targetMarginPercent: 15, assumptionNotes: ["NN ve CW algoritmaları karşılaştırmalı analiz yapar.", "Verimlilik = (CW mesafesi / NN mesafesi) × 100.", "Tasarruf yıllık çalışma günü ve filo büyüklüğüne göre projekte edilir."],assumptionNotes_i18n:[{"en":"NN and CW algorithms perform comparative analysis.","tr":"NN ve CW algoritmaları karşılaştırmalı analiz yapar."},{"en":"Efficiency = (CW distance / NN distance) × 100.","tr":"Verimlilik = (CW mesafesi / NN mesafesi) × 100."},{"en":"Savings are projected based on annual working days and fleet size.","tr":"Tasarruf yıllık çalışma günü ve filo büyüklüğüne göre projekte edilir."}] },
};
