import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";
export const LOGISTICS_ROUTE_LOSS_SCHEMA: PremiumCalculatorSchema = {
  id: "logistics-route-loss-analyzer", legacyPaidSlug: "logistics-route-loss-analyzer",
  name: "Lojistik Rota Kaybı", sectorSlug: "logistics-transport", category: "cost",
  painStatement: "Rota sapmaları ve yakıt israfı hesaplanmazsa, filo maliyeti gizlice artar ve verim düşer.",
  inputs: [
    { id: "idealDistance", label: "İdeal Mesafe", type: "number", unit: "km", required: true, smartDefault: 100, validation: { min: 1 }, helper: "", expertMeaning: "Point-to-point distance" },
    { id: "actualDistance", label: "Gerçek Mesafe", type: "number", unit: "km", required: true, smartDefault: 130, validation: { min: 1 }, helper: "", expertMeaning: "Actual route distance" },
    { id: "avgSpeed", label: "Ortalama Hız", type: "number", unit: "km/saat", required: false, smartDefault: 60, validation: { min: 1 }, helper: "", expertMeaning: "Average speed" },
    { id: "fuelConsumption", label: "Yakıt Tüketim Oranı", type: "number", unit: "L/km", required: true, smartDefault: 0.3, validation: { min: 0.01 }, helper: "", expertMeaning: "Fuel consumption per km" },
    { id: "fuelPrice", label: "Yakıt Fiyatı", type: "number", unit: "USD/L", required: true, smartDefault: 1.5, validation: { min: 0 }, helper: "", expertMeaning: "Fuel price" },
    { id: "driverRate", label: "Sürücü Saatlik Ücreti", type: "number", unit: "USD/saat", required: true, smartDefault: 20, validation: { min: 0 }, helper: "", expertMeaning: "Driver hourly wage" },
    { id: "wearCostPerKm", label: "Araç Aşınma Maliyeti", type: "number", unit: "USD/km", required: false, smartDefault: 0.15, validation: { min: 0 }, helper: "", expertMeaning: "Vehicle wear cost per km" },
  ],
  outputs: [
    { id: "driftPct", label: "Sapma Oranı", unit: "%", format: "percentage" },
    { id: "fuelWaste", label: "Yakıt İsrafı", unit: "USD/sefer", format: "currency" },
    { id: "timeWaste", label: "Zaman Kaybı", unit: "USD/sefer", format: "currency" },
    { id: "routeEfficiency", label: "Rota Verimi", unit: "%", format: "percentage" },
    { id: "totalRouteLoss", label: "Toplam Rota Kaybı", unit: "USD/sefer", format: "currency" },
  ],
  thresholds: [{ fieldId: "driftPct", warning: 10, critical: 25, direction: "higher_is_bad", warningMessage: "Sapma > %10 — rota optimizasyonu önerilir.", criticalMessage: "Sapma > %25 — rota planlaması yenilenmeli." }],
  formulaPipeline: [
    { formulaId: "measurement.route_drift_pct", inputMap: { actualDistance: "actualDistance", idealDistance: "idealDistance" }, outputId: "driftPct" },
    { formulaId: "cost.route_fuel_waste", inputMap: { actualDistance: "actualDistance", idealDistance: "idealDistance", fuelConsumption: "fuelConsumption", fuelPrice: "fuelPrice" }, outputId: "fuelWaste" },
    { formulaId: "cost.route_time_waste", inputMap: { actualDistance: "actualDistance", idealDistance: "idealDistance", avgSpeed: "avgSpeed", driverRate: "driverRate" }, outputId: "timeWaste" },
    { formulaId: "measurement.route_efficiency", inputMap: { idealDistance: "idealDistance", actualDistance: "actualDistance" }, outputId: "routeEfficiency" },
    { formulaId: "cost.route_total_loss", inputMap: { fuelWaste: "fuelWaste", timeWaste: "timeWaste", actualDistance: "actualDistance", idealDistance: "idealDistance", wearCostPerKm: "wearCostPerKm" }, outputId: "totalRouteLoss" },
  ],
  reportTemplate: { title: "Rota Kaybı Raporu", sections: ["executive_summary", "loss_breakdown", "thresholds", "action_plan", "assumptions"], exportFormats: ["pdf", "excel"] },
  assumptions: { hiddenLossMultiplier: 1.1, volatilityPercent: 10, targetMarginPercent: 15, assumptionNotes: ["Sapma = (Gerçek - İdeal) / İdeal.", "Yakıt israfı = Fark × Tüketim × Fiyat.", "Verim = İdeal / Gerçek."] },
};
