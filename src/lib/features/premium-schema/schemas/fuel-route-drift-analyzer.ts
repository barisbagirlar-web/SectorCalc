/**
 * Tool #36 — Yakit Rota Sapma
 */
import type { PremiumCalculatorSchema } from "@/lib/features/premium-schema/premium-calculator-schema";
export const FUEL_ROUTE_DRIFT_SCHEMA: PremiumCalculatorSchema = {
  id: "fuel-route-drift-analyzer", legacyPaidSlug: "fuel-route-drift-analyzer",
  name: "Fuel Route Drift Cost Analyzer", name_i18n: {"en":"Fuel Route Drift Cost Analyzer"}, sectorSlug: "logistics-transport", category: "cost",
  painStatement: "Araclar planlanan rotadan sapinca yakit tuketimi artar, teslimat suresi uzar ve karbon emisyonu yukselir. Rota sapma maliyeti olculmezse filo verimliligi duser.", painStatement_i18n: {"en":"When vehicles deviate from the planned route, fuel consumption increases, delivery duration extends, and carbon emissions rise. If route deviation cost is not measured, fleet efficiency decreases."},
  inputs: [
    { id: "plannedDistance", label: "Planned Route Distance", label_i18n: {"en":"Planned Route Distance"}, type: "number", unit: "km", required: true, smartDefault: 200, validation: { min: 1 }, helper: "", expertMeaning: "Planned route distance", expertMeaning_i18n: {"en":"Planned route distance"} },
    { id: "actualDistance", label: "Actual route distance", label_i18n: {"en":"Actual route distance"}, type: "number", unit: "km", required: true, smartDefault: 250, validation: { min: 1 }, helper: "", expertMeaning: "Actual route distance", expertMeaning_i18n: {"en":"Actual route distance"} },
    { id: "fuelCostPerLiter", label: "Fuel cost per liter", label_i18n: {"en":"Fuel cost per liter"}, type: "number", unit: "USD/L", required: true, smartDefault: 1.5, validation: { min: 0.01 }, helper: "", expertMeaning: "Fuel cost per liter", expertMeaning_i18n: {"en":"Fuel cost per liter"} },
    { id: "fuelEfficiency", label: "Vehicle fuel efficiency", label_i18n: {"en":"Vehicle fuel efficiency"}, type: "number", unit: "km/L", required: true, smartDefault: 4, validation: { min: 0.1 }, helper: "", expertMeaning: "Vehicle fuel efficiency", expertMeaning_i18n: {"en":"Vehicle fuel efficiency"} },
    { id: "numTrips", label: "Annual trip count", label_i18n: {"en":"Annual trip count"}, type: "number", unit: "sefer/yil", required: true, smartDefault: 250, validation: { min: 1 }, helper: "", expertMeaning: "Annual trip count", expertMeaning_i18n: {"en":"Annual trip count"} },
    { id: "idleTimePerTrip", label: "Rotar Suresi / Sefer", label_i18n: {"en":"Idle time per trip due to drift"}, type: "number", unit: "dk", required: false, smartDefault: 20, validation: { min: 0 }, helper: "", expertMeaning: "Idle time per trip due to drift", expertMeaning_i18n: {"en":"Idle time per trip due to drift"} },
    { id: "driverCostPerHour", label: "Surucu Saat Ucreti", label_i18n: {"en":"Driver cost per hour"}, type: "number", unit: "USD/saat", required: false, smartDefault: 25, validation: { min: 1 }, helper: "", expertMeaning: "Driver cost per hour", expertMeaning_i18n: {"en":"Driver cost per hour"} },
    { id: "fleetSize", label: "Fleet size", label_i18n: {"en":"Fleet size"}, type: "number", unit: "arac", required: false, smartDefault: 10, validation: { min: 1 }, helper: "", expertMeaning: "Fleet size", expertMeaning_i18n: {"en":"Fleet size"} },
  ],
  outputs: [
    { id: "fuelWasteDistance", label: "Deviation Distance", label_i18n: {"en":"Deviation Distance"}, unit: "km/sefer", format: "number" },
    { id: "fuelWasteEfficiency", label: "Fuel Waste", label_i18n: {"en":"Fuel Waste"}, unit: "L/sefer", format: "number" },
    { id: "idleFuelCost", label: "Route Fuel Cost", label_i18n: {"en":"Route Fuel Cost"}, unit: "USD/yil", format: "currency" },
    { id: "totalDriftCost", label: "Total Route Deviation Cost", label_i18n: {"en":"Total Route Deviation Cost"}, unit: "USD/yil", format: "currency", isBigNumber: true },
  ],
  thresholds: [
    { fieldId: "fuelWasteDistance", warning: 30, critical: 60, direction: "higher_is_bad", warningMessage: "Sapma > 30 km — rota planlamasi iyilestirilmeli.", warningMessage_i18n: {"en":"Deviation > 30 km — route planning should be improved."}, criticalMessage: "Sapma > 60 km — GPS takibi ve dispatcher kontrolu gerekli.", criticalMessage_i18n: {"en":"Deviation > 60 km — GPS tracking and dispatcher control are required."} },
    { fieldId: "totalDriftCost", warning: 10000, critical: 30000, direction: "higher_is_bad", warningMessage: "Sapma maliyeti > $10K — filo yonetim sistemi gozden gecirilmeli.", warningMessage_i18n: {"en":"Deviation cost > $10K — fleet management system should be reviewed."}, criticalMessage: "Sapma maliyeti > $30K — acil rota optimizasyonu baslatilmali.", criticalMessage_i18n: {"en":"Deviation cost > $30K — urgent route optimization should be initiated."} },
  ],
  formulaPipeline: [
    { formulaId: "cost.fuel_waste_distance", inputMap: {
        actualKm: "plannedDistance",
        optimalKm: "actualDistance"
      ,
        fuelCostPerKm: "fuelCostPerKm"}, outputId: "fuelWasteDistance" },
    { formulaId: "cost.fuel_waste_efficiency", inputMap: {
        actualFuelUsed: "fuelWasteDistance",
        fuelPrice: "fuelEfficiency"
      ,
        expectedFuelCost: "expectedFuelCost"}, outputId: "fuelWasteEfficiency" },
    { formulaId: "cost.idle_fuel_cost", inputMap: {
        idleHours: "idleTimePerTrip",
        fuelCostPerHour: "driverCostPerHour",
        numTrips: "numTrips"
      }, outputId: "idleFuelCost" },
    { formulaId: "cost.total_drift_cost", inputMap: {
        fuelWasteDistance: "fuelWasteDistance",
        idleFuelCost: "idleFuelCost",
        fuelWasteEfficiency: "fuelCostPerLiter",
        fuelEfficiency: "fuelEfficiency",
        numTrips: "numTrips",
        fleetSize: "fleetSize"
      }, outputId: "totalDriftCost" },
  ],
  reportTemplate: { title: "Yakit Rota Sapma Maliyeti Reportu", title_i18n: {"en":"Fuel Route Deviation Cost Raporu"}, sections: ["executive_summary", "loss_breakdown", "thresholds", "action_plan", "assumptions"], exportFormats: ["pdf", "excel"] },
  assumptions: { hiddenLossMultiplier: 1.15, volatilityPercent: 10, targetMarginPercent: 12, assumptionNotes: ["Sapma mesafesi = gerceklesen - planlanan rota.", "Yakit israfi = sapma mesafesi / yakit tuketimi.", "Rotar maliyeti surucu ucreti ve yakit tuketimini icerir."],assumptionNotes_i18n:[{"en":"Deviation distance = actual - planned route."},{"en":"Fuel waste = deviation distance / fuel consumption."},{"en":"Delay cost includes driver wage and fuel consumption."}] },
};
