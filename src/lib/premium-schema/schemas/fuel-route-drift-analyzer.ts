/**
 * Tool #36 — Yakıt Rota Sapma
 */
import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";
export const FUEL_ROUTE_DRIFT_SCHEMA: PremiumCalculatorSchema = {
  id: "fuel-route-drift-analyzer", legacyPaidSlug: "fuel-route-drift-analyzer",
  name: "Yakıt Rota Sapma Maliyeti", name_i18n: {"en":"Fuel Route Drift Cost","tr":"Yakıt Rota Sapma Maliyeti"}, sectorSlug: "logistics-transport", category: "cost",
  painStatement: "Araçlar planlanan rotadan sapınca yakıt tüketimi artar, teslimat süresi uzar ve karbon emisyonu yükselir. Rota sapma maliyeti ölçülmezse filo verimliliği düşer.", painStatement_i18n: {"en":"When vehicles deviate from planned routes, fuel consumption increases, delivery times extend, and carbon emissions rise. Fleet efficiency drops if route drift costs are not measured.","tr":"Araçlar planlanan rotadan sapınca yakıt tüketimi artar, teslimat süresi uzar ve karbon emisyonu yükselir. Rota sapma maliyeti ölçülmezse filo verimliliği düşer."},
  inputs: [
    { id: "plannedDistance", label: "Planlanan Rota Mesafesi", label_i18n: {"en":"Planned route distance","tr":"Planlanan Rota Mesafesi"}, type: "number", unit: "km", required: true, smartDefault: 200, validation: { min: 1 }, helper: "", expertMeaning: "Planned route distance", expertMeaning_i18n: {"en":"Planned route distance","tr":"Planlanan Rota Mesafesi"} },
    { id: "actualDistance", label: "Gerçekleşen Rota Mesafesi", label_i18n: {"en":"Actual route distance","tr":"Gerçekleşen Rota Mesafesi"}, type: "number", unit: "km", required: true, smartDefault: 250, validation: { min: 1 }, helper: "", expertMeaning: "Actual route distance", expertMeaning_i18n: {"en":"Actual route distance","tr":"Gerçekleşen Rota Mesafesi"} },
    { id: "fuelCostPerLiter", label: "Yakıt Birim Maliyeti", label_i18n: {"en":"Fuel cost per liter","tr":"Yakıt Birim Maliyeti"}, type: "number", unit: "USD/L", required: true, smartDefault: 1.5, validation: { min: 0.01 }, helper: "", expertMeaning: "Fuel cost per liter", expertMeaning_i18n: {"en":"Fuel cost per liter","tr":"Yakıt Birim Maliyeti"} },
    { id: "fuelEfficiency", label: "Yakıt Tüketimi", label_i18n: {"en":"Vehicle fuel efficiency","tr":"Yakıt Tüketimi"}, type: "number", unit: "km/L", required: true, smartDefault: 4, validation: { min: 0.1 }, helper: "", expertMeaning: "Vehicle fuel efficiency", expertMeaning_i18n: {"en":"Vehicle fuel efficiency","tr":"Yakıt Tüketimi"} },
    { id: "numTrips", label: "Sefer Sayısı / Yıl", label_i18n: {"en":"Annual trip count","tr":"Sefer Sayısı / Yıl"}, type: "number", unit: "sefer/yıl", required: true, smartDefault: 250, validation: { min: 1 }, helper: "", expertMeaning: "Annual trip count", expertMeaning_i18n: {"en":"Annual trip count","tr":"Sefer Sayısı / Yıl"} },
    { id: "idleTimePerTrip", label: "Rötar Süresi / Sefer", label_i18n: {"en":"Idle time per trip due to drift","tr":"Rötar Süresi / Sefer"}, type: "number", unit: "dk", required: false, smartDefault: 20, validation: { min: 0 }, helper: "", expertMeaning: "Idle time per trip due to drift", expertMeaning_i18n: {"en":"Idle time per trip due to drift","tr":"Rötar Süresi / Sefer"} },
    { id: "driverCostPerHour", label: "Sürücü Saat Ücreti", label_i18n: {"en":"Driver cost per hour","tr":"Sürücü Saat Ücreti"}, type: "number", unit: "USD/saat", required: false, smartDefault: 25, validation: { min: 1 }, helper: "", expertMeaning: "Driver cost per hour", expertMeaning_i18n: {"en":"Driver cost per hour","tr":"Sürücü Saat Ücreti"} },
    { id: "fleetSize", label: "Araç Sayısı", label_i18n: {"en":"Fleet size","tr":"Araç Sayısı"}, type: "number", unit: "araç", required: false, smartDefault: 10, validation: { min: 1 }, helper: "", expertMeaning: "Fleet size", expertMeaning_i18n: {"en":"Fleet size","tr":"Araç Sayısı"} },
  ],
  outputs:  [
    { id: "fuelWasteDistance", label: "Sapma Mesafesi", label_i18n: {"en":"Drift Distance","tr":"Sapma Mesafesi"}, unit: "km/sefer", format: "number" },
    { id: "fuelWasteEfficiency", label: "Yakıt İsrafı", label_i18n: {"en":"Fuel Waste","tr":"Yakıt İsrafı"}, unit: "L/sefer", format: "number" },
    { id: "idleFuelCost", label: "Rötar Yakıt Maliyeti", label_i18n: {"en":"Idle Fuel Cost","tr":"Rötar Yakıt Maliyeti"}, unit: "USD/yıl", format: "currency" },
    { id: "totalDriftCost", label: "Toplam Rota Sapma Maliyeti", label_i18n: {"en":"Total Route Drift Cost","tr":"Toplam Rota Sapma Maliyeti"}, unit: "USD/yıl", format: "currency", isBigNumber: true },
  ],
  thresholds: [
    { fieldId: "fuelWasteDistance", warning: 30, critical: 60, direction: "higher_is_bad", warningMessage: "Sapma > 30 km — rota planlaması iyileştirilmeli.", warningMessage_i18n: {"en":"Drift > 30 km — route planning should be improved.","tr":"Sapma > 30 km — rota planlaması iyileştirilmeli."}, criticalMessage: "Sapma > 60 km — GPS takibi ve dispatcher kontrolü gerekli.", criticalMessage_i18n: {"en":"Drift > 60 km — GPS tracking and dispatcher control required.","tr":"Sapma > 60 km — GPS takibi ve dispatcher kontrolü gerekli."} },
    { fieldId: "totalDriftCost", warning: 10000, critical: 30000, direction: "higher_is_bad", warningMessage: "Sapma maliyeti > $10K — filo yönetim sistemi gözden geçirilmeli.", warningMessage_i18n: {"en":"Drift cost > $10K — fleet management system should be reviewed.","tr":"Sapma maliyeti > $10K — filo yönetim sistemi gözden geçirilmeli."}, criticalMessage: "Sapma maliyeti > $30K — acil rota optimizasyonu başlatılmalı.", criticalMessage_i18n: {"en":"Drift cost > $30K — urgent route optimization needed.","tr":"Sapma maliyeti > $30K — acil rota optimizasyonu başlatılmalı."} },
  ],
  formulaPipeline: [
    { formulaId: "cost.fuel_waste_distance", inputMap: { plannedDistance: "plannedDistance", actualDistance: "actualDistance" }, outputId: "fuelWasteDistance" },
    { formulaId: "cost.fuel_waste_efficiency", inputMap: { fuelWasteDistance: "fuelWasteDistance", fuelEfficiency: "fuelEfficiency" }, outputId: "fuelWasteEfficiency" },
    { formulaId: "cost.idle_fuel_cost", inputMap: { idleTimePerTrip: "idleTimePerTrip", driverCostPerHour: "driverCostPerHour", numTrips: "numTrips" }, outputId: "idleFuelCost" },
    { formulaId: "cost.total_drift_cost", inputMap: { fuelWasteDistance: "fuelWasteDistance", fuelCostPerLiter: "fuelCostPerLiter", fuelEfficiency: "fuelEfficiency", numTrips: "numTrips", idleFuelCost: "idleFuelCost", fleetSize: "fleetSize" }, outputId: "totalDriftCost" },
  ],
  reportTemplate: { title: "Yakıt Rota Sapma Maliyeti Raporu", title_i18n: {"en":"Fuel Route Drift Cost Report","tr":"Yakıt Rota Sapma Maliyeti Raporu"}, sections: ["executive_summary", "loss_breakdown", "thresholds", "action_plan", "assumptions"], exportFormats: ["pdf", "excel"] },
  assumptions: { hiddenLossMultiplier: 1.15, volatilityPercent: 10, targetMarginPercent: 12, assumptionNotes: ["Sapma mesafesi = gerçekleşen - planlanan rota.", "Yakıt israfı = sapma mesafesi / yakıt tüketimi.", "Rötar maliyeti sürücü ücreti ve yakıt tüketimini içerir."],assumptionNotes_i18n:[{"en":"Drift distance = actual - planned route.","tr":"Sapma mesafesi = gerçekleşen - planlanan rota."},{"en":"Fuel waste = drift distance / fuel efficiency.","tr":"Yakıt israfı = sapma mesafesi / yakıt tüketimi."},{"en":"Idle cost includes driver wage and fuel consumption.","tr":"Rötar maliyeti sürücü ücreti ve yakıt tüketimini içerir."}] },
};
