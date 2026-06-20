/**
 * Tool #36 — Yakıt Rota Sapma
 */
import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";
export const FUEL_ROUTE_DRIFT_SCHEMA: PremiumCalculatorSchema = {
  id: "fuel-route-drift-analyzer", legacyPaidSlug: "fuel-route-drift-analyzer",
  name: "Yakıt Rota Sapma Maliyeti", sectorSlug: "logistics-transport", category: "cost",
  painStatement: "Araçlar planlanan rotadan sapınca yakıt tüketimi artar, teslimat süresi uzar ve karbon emisyonu yükselir. Rota sapma maliyeti ölçülmezse filo verimliliği düşer.",
  inputs: [
    { id: "plannedDistance", label: "Planlanan Rota Mesafesi", type: "number", unit: "km", required: true, smartDefault: 200, validation: { min: 1 }, helper: "", expertMeaning: "Planned route distance" },
    { id: "actualDistance", label: "Gerçekleşen Rota Mesafesi", type: "number", unit: "km", required: true, smartDefault: 250, validation: { min: 1 }, helper: "", expertMeaning: "Actual route distance" },
    { id: "fuelCostPerLiter", label: "Yakıt Birim Maliyeti", type: "number", unit: "USD/L", required: true, smartDefault: 1.5, validation: { min: 0.01 }, helper: "", expertMeaning: "Fuel cost per liter" },
    { id: "fuelEfficiency", label: "Yakıt Tüketimi", type: "number", unit: "km/L", required: true, smartDefault: 4, validation: { min: 0.1 }, helper: "", expertMeaning: "Vehicle fuel efficiency" },
    { id: "numTrips", label: "Sefer Sayısı / Yıl", type: "number", unit: "sefer/yıl", required: true, smartDefault: 250, validation: { min: 1 }, helper: "", expertMeaning: "Annual trip count" },
    { id: "idleTimePerTrip", label: "Rötar Süresi / Sefer", type: "number", unit: "dk", required: false, smartDefault: 20, validation: { min: 0 }, helper: "", expertMeaning: "Idle time per trip due to drift" },
    { id: "driverCostPerHour", label: "Sürücü Saat Ücreti", type: "number", unit: "USD/saat", required: false, smartDefault: 25, validation: { min: 1 }, helper: "", expertMeaning: "Driver cost per hour" },
    { id: "fleetSize", label: "Araç Sayısı", type: "number", unit: "araç", required: false, smartDefault: 10, validation: { min: 1 }, helper: "", expertMeaning: "Fleet size" },
  ],
  outputs: [
    { id: "fuelWasteDistance", label: "Sapma Mesafesi", unit: "km/sefer", format: "number" },
    { id: "fuelWasteEfficiency", label: "Yakıt İsrafı", unit: "L/sefer", format: "number" },
    { id: "idleFuelCost", label: "Rötar Yakıt Maliyeti", unit: "USD/yıl", format: "currency" },
    { id: "totalDriftCost", label: "Toplam Rota Sapma Maliyeti", unit: "USD/yıl", format: "currency", isBigNumber: true },
  ],
  thresholds: [
    { fieldId: "fuelWasteDistance", warning: 30, critical: 60, direction: "higher_is_bad", warningMessage: "Sapma > 30 km — rota planlaması iyileştirilmeli.", criticalMessage: "Sapma > 60 km — GPS takibi ve dispatcher kontrolü gerekli." },
    { fieldId: "totalDriftCost", warning: 10000, critical: 30000, direction: "higher_is_bad", warningMessage: "Sapma maliyeti > $10K — filo yönetim sistemi gözden geçirilmeli.", criticalMessage: "Sapma maliyeti > $30K — acil rota optimizasyonu başlatılmalı." },
  ],
  formulaPipeline: [
    { formulaId: "cost.fuel_waste_distance", inputMap: { plannedDistance: "plannedDistance", actualDistance: "actualDistance" }, outputId: "fuelWasteDistance" },
    { formulaId: "cost.fuel_waste_efficiency", inputMap: { fuelWasteDistance: "fuelWasteDistance", fuelEfficiency: "fuelEfficiency" }, outputId: "fuelWasteEfficiency" },
    { formulaId: "cost.idle_fuel_cost", inputMap: { idleTimePerTrip: "idleTimePerTrip", driverCostPerHour: "driverCostPerHour", numTrips: "numTrips" }, outputId: "idleFuelCost" },
    { formulaId: "cost.total_drift_cost", inputMap: { fuelWasteDistance: "fuelWasteDistance", fuelCostPerLiter: "fuelCostPerLiter", fuelEfficiency: "fuelEfficiency", numTrips: "numTrips", idleFuelCost: "idleFuelCost", fleetSize: "fleetSize" }, outputId: "totalDriftCost" },
  ],
  reportTemplate: { title: "Yakıt Rota Sapma Maliyeti Raporu", sections: ["executive_summary", "loss_breakdown", "thresholds", "action_plan", "assumptions"], exportFormats: ["pdf", "excel"] },
  assumptions: { hiddenLossMultiplier: 1.15, volatilityPercent: 10, targetMarginPercent: 12, assumptionNotes: ["Sapma mesafesi = gerçekleşen - planlanan rota.", "Yakıt israfı = sapma mesafesi / yakıt tüketimi.", "Rötar maliyeti sürücü ücreti ve yakıt tüketimini içerir."] },
};
