import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";
export const LOGISTICS_ROUTE_LOSS_SCHEMA: PremiumCalculatorSchema = {
  id: "logistics-route-loss-analyzer", legacyPaidSlug: "logistics-route-loss-analyzer",
  name: "Lojistik Rota Kaybı", name_i18n: {"en":"Lojistik Rota Kaybı","tr":"Lojistik Rota Kaybı"}, sectorSlug: "logistics-transport", category: "cost",
  painStatement: "Rota sapmaları ve yakıt israfı hesaplanmazsa, filo maliyeti gizlice artar ve verim düşer.", painStatement_i18n: {"en":"Rota sapmaları ve yakıt israfı hesaplanmazsa, filo maliyeti gizlice artar ve verim düşer.","tr":"Rota sapmaları ve yakıt israfı hesaplanmazsa, filo maliyeti gizlice artar ve verim düşer."},
  inputs: [
    { id: "idealDistance", label: "İdeal Mesafe", label_i18n: {"en":"İdeal Mesafe","tr":"İdeal Mesafe"}, type: "number", unit: "km", required: true, smartDefault: 100, validation: { min: 1 }, helper: "", expertMeaning: "Point-to-point distance", expertMeaning_i18n: {"en":"Point-to-point distance","tr":"Point-to-point distance"} },
    { id: "actualDistance", label: "Gerçek Mesafe", label_i18n: {"en":"Gerçek Mesafe","tr":"Gerçek Mesafe"}, type: "number", unit: "km", required: true, smartDefault: 130, validation: { min: 1 }, helper: "", expertMeaning: "Actual route distance", expertMeaning_i18n: {"en":"Actual route distance","tr":"Actual route distance"} },
    { id: "avgSpeed", label: "Ortalama Hız", label_i18n: {"en":"Ortalama Hız","tr":"Ortalama Hız"}, type: "number", unit: "km/saat", required: false, smartDefault: 60, validation: { min: 1 }, helper: "", expertMeaning: "Average speed", expertMeaning_i18n: {"en":"Average speed","tr":"Average speed"} },
    { id: "fuelConsumption", label: "Yakıt Tüketim Oranı", label_i18n: {"en":"Yakıt Tüketim Oranı","tr":"Yakıt Tüketim Oranı"}, type: "number", unit: "L/km", required: true, smartDefault: 0.3, validation: { min: 0.01 }, helper: "", expertMeaning: "Fuel consumption per km", expertMeaning_i18n: {"en":"Fuel consumption per km","tr":"Fuel consumption per km"} },
    { id: "fuelPrice", label: "Yakıt Fiyatı", label_i18n: {"en":"Yakıt Fiyatı","tr":"Yakıt Fiyatı"}, type: "number", unit: "USD/L", required: true, smartDefault: 1.5, validation: { min: 0 }, helper: "", expertMeaning: "Fuel price", expertMeaning_i18n: {"en":"Fuel price","tr":"Fuel price"} },
    { id: "driverRate", label: "Sürücü Saatlik Ücreti", label_i18n: {"en":"Sürücü Saatlik Ücreti","tr":"Sürücü Saatlik Ücreti"}, type: "number", unit: "USD/saat", required: true, smartDefault: 20, validation: { min: 0 }, helper: "", expertMeaning: "Driver hourly wage", expertMeaning_i18n: {"en":"Driver hourly wage","tr":"Driver hourly wage"} },
    { id: "wearCostPerKm", label: "Araç Aşınma Maliyeti", label_i18n: {"en":"Araç Aşınma Maliyeti","tr":"Araç Aşınma Maliyeti"}, type: "number", unit: "USD/km", required: false, smartDefault: 0.15, validation: { min: 0 }, helper: "", expertMeaning: "Vehicle wear cost per km", expertMeaning_i18n: {"en":"Vehicle wear cost per km","tr":"Vehicle wear cost per km"} },
  ],
  outputs: [
    { id: "driftPct", label: "Sapma Oranı", label_i18n: {"en":"Sapma Oranı","tr":"Sapma Oranı"}, unit: "%", format: "percentage" },
    { id: "fuelWaste", label: "Yakıt İsrafı", label_i18n: {"en":"Yakıt İsrafı","tr":"Yakıt İsrafı"}, unit: "USD/sefer", format: "currency" },
    { id: "timeWaste", label: "Zaman Kaybı", label_i18n: {"en":"Zaman Kaybı","tr":"Zaman Kaybı"}, unit: "USD/sefer", format: "currency" },
    { id: "routeEfficiency", label: "Rota Verimi", label_i18n: {"en":"Rota Verimi","tr":"Rota Verimi"}, unit: "%", format: "percentage" },
    { id: "totalRouteLoss", label: "Toplam Rota Kaybı", label_i18n: {"en":"Toplam Rota Kaybı","tr":"Toplam Rota Kaybı"}, unit: "USD/sefer", format: "currency" },
  ],
  thresholds: [{ fieldId: "driftPct", warning: 10, critical: 25, direction: "higher_is_bad", warningMessage: "Sapma > %10 — rota optimizasyonu önerilir.", warningMessage_i18n: {"en":"Sapma > %10 — rota optimizasyonu önerilir.","tr":"Sapma > %10 — rota optimizasyonu önerilir."}, criticalMessage: "Sapma > %25 — rota planlaması yenilenmeli.", criticalMessage_i18n: {"en":"Sapma > %25 — rota planlaması yenilenmeli.","tr":"Sapma > %25 — rota planlaması yenilenmeli."} }],
  formulaPipeline: [
    { formulaId: "measurement.route_drift_pct", inputMap: { actualDistance: "actualDistance", idealDistance: "idealDistance" }, outputId: "driftPct" },
    { formulaId: "cost.route_fuel_waste", inputMap: { actualDistance: "actualDistance", idealDistance: "idealDistance", fuelConsumption: "fuelConsumption", fuelPrice: "fuelPrice" }, outputId: "fuelWaste" },
    { formulaId: "cost.route_time_waste", inputMap: { actualDistance: "actualDistance", idealDistance: "idealDistance", avgSpeed: "avgSpeed", driverRate: "driverRate" }, outputId: "timeWaste" },
    { formulaId: "measurement.route_efficiency", inputMap: { idealDistance: "idealDistance", actualDistance: "actualDistance" }, outputId: "routeEfficiency" },
    { formulaId: "cost.route_total_loss", inputMap: { fuelWaste: "fuelWaste", timeWaste: "timeWaste", actualDistance: "actualDistance", idealDistance: "idealDistance", wearCostPerKm: "wearCostPerKm" }, outputId: "totalRouteLoss" },
  ],
  reportTemplate: { title: "Rota Kaybı Raporu", title_i18n: {"en":"Rota Kaybı Raporu","tr":"Rota Kaybı Raporu"}, sections: ["executive_summary", "loss_breakdown", "thresholds", "action_plan", "assumptions"], exportFormats: ["pdf", "excel"] },
  assumptions: { hiddenLossMultiplier: 1.1, volatilityPercent: 10, targetMarginPercent: 15, assumptionNotes: ["Sapma = (Gerçek - İdeal) / İdeal.", "Yakıt israfı = Fark × Tüketim × Fiyat.", "Verim = İdeal / Gerçek."],assumptionNotes_i18n:[{"en":"Sapma = (Gerçek - İdeal) / İdeal.","tr":"Sapma = (Gerçek - İdeal) / İdeal."},{"en":"Yakıt israfı = Fark × Tüketim × Fiyat.","tr":"Yakıt israfı = Fark × Tüketim × Fiyat."},{"en":"Verim = İdeal / Gerçek.","tr":"Verim = İdeal / Gerçek."}] },
};
