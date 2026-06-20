/**
 * Tool — Rota Optimizasyonu
 */
import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";
export const ROUTE_OPTIMIZATION_ANALYZER: PremiumCalculatorSchema = {
  id: "route-optimization-analyzer", legacyPaidSlug: "route-optimization-analyzer",
  name: "Rota Optimizasyon Analizi", sectorSlug: "logistics-transport", category: "cost",
  painStatement: "Araç rotaları optimize edilmezse yakıt, zaman ve bakım maliyetleri kontrolsüz büyür, filo verimi düşer.",
  inputs: [
    { id: "numStops", label: "Durak Sayısı", type: "number", unit: "adet", required: true, smartDefault: 20, validation: { min: 2 }, helper: "", expertMeaning: "Number of delivery stops" },
    { id: "totalDistance", label: "Toplam Mesafe", type: "number", unit: "km", required: true, smartDefault: 350, validation: { min: 1 }, helper: "", expertMeaning: "Total route distance" },
    { id: "fuelCostPerKm", label: "Km Başına Yakıt Maliyeti", type: "number", unit: "USD/km", required: true, smartDefault: 0.45, validation: { min: 0.01 }, helper: "", expertMeaning: "Fuel cost per km" },
    { id: "driverCostPerHour", label: "Saatlik Sürücü Maliyeti", type: "number", unit: "USD/saat", required: true, smartDefault: 25, validation: { min: 1 }, helper: "", expertMeaning: "Driver cost per hour" },
    { id: "avgSpeed", label: "Ortalama Hız", type: "number", unit: "km/saat", required: true, smartDefault: 50, validation: { min: 5 }, helper: "", expertMeaning: "Average vehicle speed" },
    { id: "vehicleCount", label: "Araç Sayısı", type: "number", unit: "adet", required: false, smartDefault: 5, validation: { min: 1 }, helper: "", expertMeaning: "Number of vehicles" },
    { id: "workingDaysPerYear", label: "Yıllık Çalışma Günü", type: "number", unit: "gün", required: false, smartDefault: 260, validation: { min: 1 }, helper: "", expertMeaning: "Working days per year" },
  ],
  outputs: [
    { id: "nearestNeighborDist", label: "En Yakın Komşu Mesafesi", unit: "km", format: "number" },
    { id: "clarkeWrightDist", label: "Clarke-Wright Mesafesi", unit: "km", format: "number" },
    { id: "efficiencyScore", label: "Rota Verimlilik Skoru", unit: "%", format: "percentage" },
    { id: "totalSavings", label: "Toplam Tasarruf", unit: "USD/yıl", format: "currency", isBigNumber: true },
  ],
  thresholds: [{ fieldId: "efficiencyScore", warning: 75, critical: 50, direction: "lower_is_bad", warningMessage: "Verimlilik <%75 — rota optimizasyonu önerilir.", criticalMessage: "Verimlilik <%50 — acil rota iyileştirmesi gerekli." }],
  formulaPipeline: [
    { formulaId: "measurement.route_nearest_neighbor", inputMap: { numStops: "numStops", totalDistance: "totalDistance" }, outputId: "nearestNeighborDist" },
    { formulaId: "measurement.route_clarke_wright", inputMap: { numStops: "numStops", totalDistance: "totalDistance" }, outputId: "clarkeWrightDist" },
    { formulaId: "measurement.route_efficiency_score", inputMap: { nearestNeighborDist: "nearestNeighborDist", clarkeWrightDist: "clarkeWrightDist" }, outputId: "efficiencyScore" },
    { formulaId: "cost.route_total_savings", inputMap: { totalDistance: "totalDistance", fuelCostPerKm: "fuelCostPerKm", driverCostPerHour: "driverCostPerHour", avgSpeed: "avgSpeed", vehicleCount: "vehicleCount", workingDaysPerYear: "workingDaysPerYear", efficiencyScore: "efficiencyScore" }, outputId: "totalSavings" },
  ],
  reportTemplate: { title: "Rota Optimizasyon Raporu", sections: ["executive_summary", "loss_breakdown", "thresholds", "action_plan", "assumptions"], exportFormats: ["pdf", "excel"] },
  assumptions: { hiddenLossMultiplier: 1.1, volatilityPercent: 10, targetMarginPercent: 15, assumptionNotes: ["NN ve CW algoritmaları karşılaştırmalı analiz yapar.", "Verimlilik = (CW mesafesi / NN mesafesi) × 100.", "Tasarruf yıllık çalışma günü ve filo büyüklüğüne göre projekte edilir."] },
};
