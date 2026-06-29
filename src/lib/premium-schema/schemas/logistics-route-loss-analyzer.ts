import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";
export const LOGISTICS_ROUTE_LOSS_SCHEMA: PremiumCalculatorSchema = {
  id: "logistics-route-loss-analyzer", legacyPaidSlug: "logistics-route-loss-analyzer",
  name: "Lojistik Rota Kaybı", name_i18n: {"en":"Logistics Route Loss","tr":"Lojistik Rota Kaybı"}, sectorSlug: "logistics-transport", category: "cost",
  painStatement: "Rota sapmaları ve yakıt israfı hesaplanmazsa, filo maliyeti gizlice artar ve verim düşer.", painStatement_i18n: {"en":"Without measuring route deviations and fuel waste, fleet costs silently increase and efficiency declines.","tr":"Rota sapmaları ve yakıt israfı hesaplanmazsa, filo maliyeti gizlice artar ve verim düşer."},
  inputs: [
    { id: "idealDistance", label: "İdeal Mesafe", label_i18n: {"en":"Point-to-point distance","tr":"İdeal Mesafe"}, type: "number", unit: "km", required: true, smartDefault: 100, validation: { min: 1 }, helper: "", expertMeaning: "Point-to-point distance", expertMeaning_i18n: {"en":"Point-to-point distance","tr":"İdeal Mesafe"} },
    { id: "actualDistance", label: "Gerçek Mesafe", label_i18n: {"en":"Actual route distance","tr":"Gerçek Mesafe"}, type: "number", unit: "km", required: true, smartDefault: 130, validation: { min: 1 }, helper: "", expertMeaning: "Actual route distance", expertMeaning_i18n: {"en":"Actual route distance","tr":"Gerçek Mesafe"} },
    { id: "avgSpeed", label: "Ortalama Hız", label_i18n: {"en":"Average speed","tr":"Ortalama Hız"}, type: "number", unit: "km/saat", required: false, smartDefault: 60, validation: { min: 1 }, helper: "", expertMeaning: "Average speed", expertMeaning_i18n: {"en":"Average speed","tr":"Ortalama Hız"} },
    { id: "fuelConsumption", label: "Yakıt Tüketim Oranı", label_i18n: {"en":"Fuel consumption per km","tr":"Yakıt Tüketim Oranı"}, type: "number", unit: "L/km", required: true, smartDefault: 0.3, validation: { min: 0.01 }, helper: "", expertMeaning: "Fuel consumption per km", expertMeaning_i18n: {"en":"Fuel consumption per km","tr":"Yakıt Tüketim Oranı"} },
    { id: "fuelPrice", label: "Yakıt Fiyatı", label_i18n: {"en":"Fuel price","tr":"Yakıt Fiyatı"}, type: "number", unit: "USD/L", required: true, smartDefault: 1.5, validation: { min: 0 }, helper: "", expertMeaning: "Fuel price", expertMeaning_i18n: {"en":"Fuel price","tr":"Yakıt Fiyatı"} },
    { id: "driverRate", label: "Sürücü Saatlik Ücreti", label_i18n: {"en":"Driver hourly wage","tr":"Sürücü Saatlik Ücreti"}, type: "number", unit: "USD/saat", required: true, smartDefault: 20, validation: { min: 0 }, helper: "", expertMeaning: "Driver hourly wage", expertMeaning_i18n: {"en":"Driver hourly wage","tr":"Sürücü Saatlik Ücreti"} },
    { id: "wearCostPerKm", label: "Araç Aşınma Maliyeti", label_i18n: {"en":"Vehicle wear cost per km","tr":"Araç Aşınma Maliyeti"}, type: "number", unit: "USD/km", required: false, smartDefault: 0.15, validation: { min: 0 }, helper: "", expertMeaning: "Vehicle wear cost per km", expertMeaning_i18n: {"en":"Vehicle wear cost per km","tr":"Araç Aşınma Maliyeti"} },
  ],
  outputs:  [
    { id: "driftPct", label: "Sapma Oranı", label_i18n: {"en":"Drift Percentage","tr":"Sapma Oranı"}, unit: "%", format: "percentage" },
    { id: "fuelWaste", label: "Yakıt İsrafı", label_i18n: {"en":"Fuel Waste","tr":"Yakıt İsrafı"}, unit: "USD/sefer", format: "currency" },
    { id: "timeWaste", label: "Zaman Kaybı", label_i18n: {"en":"Time Waste","tr":"Zaman Kaybı"}, unit: "USD/sefer", format: "currency" },
    { id: "routeEfficiency", label: "Rota Verimi", label_i18n: {"en":"Route Efficiency","tr":"Rota Verimi"}, unit: "%", format: "percentage" },
    { id: "totalRouteLoss", label: "Toplam Rota Kaybı", label_i18n: {"en":"Total Route Loss","tr":"Toplam Rota Kaybı"}, unit: "USD/sefer", format: "currency" },
  ],
  thresholds: [{ fieldId: "driftPct", warning: 10, critical: 25, direction: "higher_is_bad", warningMessage: "Sapma > %10 — rota optimizasyonu önerilir.", warningMessage_i18n: {"en":"Drift > 10% — route optimization recommended.","tr":"Sapma > %10 — rota optimizasyonu önerilir."}, criticalMessage: "Sapma > %25 — rota planlaması yenilenmeli.", criticalMessage_i18n: {"en":"Drift > 25% — route planning should be renewed.","tr":"Sapma > %25 — rota planlaması yenilenmeli."} }],
  formulaPipeline: [
    { formulaId: "measurement.route_drift_pct", inputMap: { actualDistance: "actualDistance", idealDistance: "idealDistance" }, outputId: "driftPct" },
    { formulaId: "cost.route_fuel_waste", inputMap: { actualDistance: "actualDistance", idealDistance: "idealDistance", fuelConsumption: "fuelConsumption", fuelPrice: "fuelPrice" }, outputId: "fuelWaste" },
    { formulaId: "cost.route_time_waste", inputMap: { actualDistance: "actualDistance", idealDistance: "idealDistance", avgSpeed: "avgSpeed", driverRate: "driverRate" }, outputId: "timeWaste" },
    { formulaId: "measurement.route_efficiency", inputMap: { idealDistance: "idealDistance", actualDistance: "actualDistance" }, outputId: "routeEfficiency" },
    { formulaId: "cost.route_total_loss", inputMap: { fuelWaste: "fuelWaste", timeWaste: "timeWaste", actualDistance: "actualDistance", idealDistance: "idealDistance", wearCostPerKm: "wearCostPerKm" }, outputId: "totalRouteLoss" },
  ],
  reportTemplate: { title: "Rota Kaybı Raporu", title_i18n: {"en":"Route Loss Report","tr":"Rota Kaybı Raporu"}, sections: ["executive_summary", "loss_breakdown", "thresholds", "action_plan", "assumptions"], exportFormats: ["pdf", "excel"] },
  assumptions: { hiddenLossMultiplier: 1.1, volatilityPercent: 10, targetMarginPercent: 15, assumptionNotes: ["Sapma = (Gerçek - İdeal) / İdeal.", "Yakıt israfı = Fark × Tüketim × Fiyat.", "Verim = İdeal / Gerçek."],assumptionNotes_i18n:[{"en":"Drift = (Actual - Ideal) / Ideal.","tr":"Sapma = (Gerçek - İdeal) / İdeal."},{"en":"Fuel waste = Difference × Consumption × Price.","tr":"Yakıt israfı = Fark × Tüketim × Fiyat."},{"en":"Efficiency = Ideal / Actual.","tr":"Verim = İdeal / Gerçek."}] },
};
