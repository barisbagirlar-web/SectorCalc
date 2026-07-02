/**
 * Tool — Rota Optimizasyonu
 */
import type { PremiumCalculatorSchema } from "@/lib/features/premium-schema/premium-calculator-schema";
export const ROUTE_OPTIMIZATION_ANALYZER: PremiumCalculatorSchema = {
  id: "route-optimization-analyzer", legacyPaidSlug: "route-optimization-analyzer",
  name: "Route Optimization Analysis", name_i18n: {"en":"Route Optimization Analysis"}, sectorSlug: "logistics-transport", category: "cost",
  painStatement: "If vehicle routes are not optimized, fuel, time, and maintenance costs grow uncontrollably, reducing fleet efficiency.", painStatement_i18n: {"en":"If vehicle routes are not optimized, fuel, time, and maintenance costs grow uncontrollably, reducing fleet efficiency."},
  inputs: [
    {
      id: "distAB",
      label: "Dist A B",
      label_i18n: { en: "Dist A B" },
      type: "number",
      unit: "—",

      group: "General"
    },
    { id: "numStops", label: "Number of Stops", label_i18n: {"en":"Number of Stops"}, type: "number", unit: "units", required: true, smartDefault: 20, validation: { min: 2 }, helper: "", expertMeaning: "Number of delivery stops", expertMeaning_i18n: {"en":"Number of delivery stops"} },
    { id: "totalDistance", label: "Total Distance", label_i18n: {"en":"Total Distance"}, type: "number", unit: "km", required: true, smartDefault: 350, validation: { min: 1 }, helper: "", expertMeaning: "Total route distance", expertMeaning_i18n: {"en":"Total route distance"} },
    { id: "fuelCostPerKm", label: "Fuel Cost per Km", label_i18n: {"en":"Fuel Cost per Km"}, type: "number", unit: "USD/km", required: true, smartDefault: 0.45, validation: { min: 0.01 }, helper: "", expertMeaning: "Fuel cost per km", expertMeaning_i18n: {"en":"Fuel cost per km"} },
    { id: "driverCostPerHour", label: "Driver Cost per Hour", label_i18n: {"en":"Driver Cost per Hour"}, type: "number", unit: "USD/hour", required: true, smartDefault: 25, validation: { min: 1 }, helper: "", expertMeaning: "Driver cost per hour", expertMeaning_i18n: {"en":"Driver cost per hour"} },
    { id: "avgSpeed", label: "Average Speed", label_i18n: {"en":"Average Speed"}, type: "number", unit: "km/saat", required: true, smartDefault: 50, validation: { min: 5 }, helper: "", expertMeaning: "Average vehicle speed", expertMeaning_i18n: {"en":"Average vehicle speed"} },
    { id: "vehicleCount", label: "Number of Vehicles", label_i18n: {"en":"Number of Vehicles"}, type: "number", unit: "units", required: false, smartDefault: 5, validation: { min: 1 }, helper: "", expertMeaning: "Number of vehicles", expertMeaning_i18n: {"en":"Number of vehicles"} },
    { id: "workingDaysPerYear", label: "Annual Working Days", label_i18n: {"en":"Annual Working Days"}, type: "number", unit: "days", required: false, smartDefault: 260, validation: { min: 1 }, helper: "", expertMeaning: "Working days per year", expertMeaning_i18n: {"en":"Working days per year"} },
  ],
  outputs: [
    { id: "nearestNeighborDist", label: "Nearest Neighbor Distance", label_i18n: {"en":"Nearest Neighbor Distance"}, unit: "km", format: "number" },
    { id: "clarkeWrightDist", label: "Clarke-Wright Distance", label_i18n: {"en":"Clarke-Wright Distance"}, unit: "km", format: "number" },
    { id: "efficiencyScore", label: "Route Efficiency Score", label_i18n: {"en":"Route Efficiency Score"}, unit: "%", format: "percentage" },
    { id: "totalSavings", label: "Total Tasarruf", label_i18n: {"en":"Total Tasarruf"}, unit: "USD/year", format: "currency", isBigNumber: true },
  ],
  thresholds: [{ fieldId: "efficiencyScore", warning: 75, critical: 50, direction: "lower_is_bad", warningMessage: "Efficiency < 75% — route optimization recommended.", warningMessage_i18n: {"en":"Efficiency < 75% — route optimization recommended."}, criticalMessage: "Efficiency < 50% — urgent route improvement needed.", criticalMessage_i18n: {"en":"Efficiency < 50% — urgent route improvement needed."} }],
  formulaPipeline: [
    { formulaId: "measurement.route_nearest_neighbor", inputMap: {
        minDistance: "numStops",
        totalDistance: "totalDistance"
      }, outputId: "nearestNeighborDist" },
    { formulaId: "measurement.route_clarke_wright", inputMap: {
        depotDistA: "numStops",
        depotDistB: "totalDistance"
      ,
        distAB: "distAB"}, outputId: "clarkeWrightDist" },
    { formulaId: "measurement.route_efficiency_score", inputMap: { nearestNeighborDist: "nearestNeighborDist", clarkeWrightDist: "clarkeWrightDist" ,
        theoreticalMin: "theoreticalMin",
        actualRouteDist: "actualRouteDist"}, outputId: "efficiencyScore" },
    { formulaId: "cost.route_total_savings", inputMap: { totalDistance: "totalDistance", fuelCostPerKm: "fuelCostPerKm", driverCostPerHour: "driverCostPerHour", avgSpeed: "avgSpeed", vehicleCount: "vehicleCount", workingDaysPerYear: "workingDaysPerYear", efficiencyScore: "efficiencyScore" ,
        baselineCost: "baselineCost",
        optimizedCost: "optimizedCost"}, outputId: "totalSavings" },
  ],
  reportTemplate: { title: "Route Optimization Report", title_i18n: {"en":"Route Optimization Report"}, sections: ["executive_summary", "loss_breakdown", "thresholds", "action_plan", "assumptions"], exportFormats: ["pdf", "excel"] },
  assumptions: { hiddenLossMultiplier: 1.1, volatilityPercent: 10, targetMarginPercent: 15, assumptionNotes: ["NN and CW algorithms perform comparative analysis.", "Verimlilik = (CW mesafesi / NN mesafesi) × 100.", "Savings are projected based on annual working days and fleet size."],assumptionNotes_i18n:[{"en":"NN and CW algorithms perform comparative analysis."},{"en":"Efficiency = (CW distance / NN distance) × 100."},{"en":"Savings are projected based on annual working days and fleet size."}] },
};
