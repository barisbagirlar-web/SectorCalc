/**
 * Tool #53 — Isı Exchanger Fouling
 */
import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";
export const HEAT_EXCHANGER_FOULING_SCHEMA: PremiumCalculatorSchema = {
  id: "heat-exchanger-fouling-analyzer", legacyPaidSlug: "heat-exchanger-fouling-analyzer",
  name: "Isı Değiştirici Fouling & Enerji Kaybı Analizi", sectorSlug: "sheet-metal", category: "energy",
  painStatement: "Isı değiştiricide kirlenme (fouling) nedeniyle ısı transfer verimi düşer ve enerji maliyeti artar. Temizlik ROI'si hesaplanmalıdır.",
  inputs: [
    { id: "uClean", label: "U_clean (Temiz)", type: "number", unit: "W/m²K", required: true, smartDefault: 500, validation: { min: 1 }, helper: "", expertMeaning: "Clean overall heat transfer coeff" },
    { id: "uDirty", label: "U_dirty (Kirli)", type: "number", unit: "W/m²K", required: true, smartDefault: 350, validation: { min: 1 }, helper: "", expertMeaning: "Dirty overall heat transfer coeff" },
    { id: "area", label: "Isı Transfer Alanı", type: "number", unit: "m²", required: true, smartDefault: 100, validation: { min: 0.1 }, helper: "", expertMeaning: "Heat exchanger area" },
    { id: "lmtd", label: "LMTD", type: "number", unit: "K", required: true, smartDefault: 30, validation: { min: 0.1 }, helper: "", expertMeaning: "Log mean temperature difference" },
    { id: "operatingHours", label: "Yıllık Çalışma Saati", type: "number", unit: "saat/yıl", required: false, smartDefault: 8000, validation: { min: 0 }, helper: "", expertMeaning: "Annual operating hours" },
    { id: "boilerEff", label: "Kazan Verimi", type: "number", unit: "%", required: false, smartDefault: 85, validation: { min: 1, max: 100 }, helper: "", expertMeaning: "Boiler/furnace efficiency" },
    { id: "fuelCost", label: "Yakıt Birim Maliyeti", type: "number", unit: "USD/kWh", required: false, smartDefault: 0.05, validation: { min: 0 }, helper: "", expertMeaning: "Fuel cost per kWh" },
    { id: "deltaPIncrease", label: "Basınç Düşüşü Artışı", type: "number", unit: "bar", required: false, smartDefault: 0.5, validation: { min: 0 }, helper: "", expertMeaning: "DP increase due to fouling" },
    { id: "flowM3h", label: "Akış Debisi", type: "number", unit: "m³/saat", required: false, smartDefault: 200, validation: { min: 0 }, helper: "", expertMeaning: "Flow rate" },
    { id: "pumpEff", label: "Pompa Verimi", type: "number", unit: "%", required: false, smartDefault: 75, validation: { min: 1, max: 100 }, helper: "", expertMeaning: "Pump efficiency" },
    { id: "cleanCost", label: "Temizlik Maliyeti", type: "number", unit: "USD", required: false, smartDefault: 5000, validation: { min: 0 }, helper: "", expertMeaning: "Cost of cleaning" },
    { id: "heatLoss", label: "Isı Transfer Kaybı (kW)", type: "number", unit: "kW", required: true, smartDefault: 150, validation: { min: 0 }, helper: "", expertMeaning: "Heat loss due to fouling" },
  ],
  outputs: [
    { id: "rf", label: "Fouling Direnci (Rf)", unit: "m²K/W", format: "number" },
    { id: "heatLoss", label: "Isı Transfer Kaybı", unit: "kW", format: "number" },
    { id: "cost", label: "Yıllık Enerji Kaybı", unit: "USD/yıl", format: "currency" },
    { id: "roi", label: "Temizlik ROI", unit: "%", format: "percentage", isBigNumber: true },
  ],
  thresholds: [{ fieldId: "cost", warning: 10000, critical: 30000, direction: "higher_is_bad", warningMessage: "Enerji kaybı > $10K/yıl — temizlik planlanmalı.", criticalMessage: "Kayıp > $30K/yıl — acil temizlik gerekli." }],
  formulaPipeline: [
    { formulaId: "energy.fouling_resistance", inputMap: { uClean: "uClean", uDirty: "uDirty" }, outputId: "rf" },
    { formulaId: "energy.fouling_cost", inputMap: { heatLoss: "heatLoss", fuelCost: "fuelCost", pumpIncrease: "deltaPIncrease" }, outputId: "cost" },
    { formulaId: "energy.fouling_roi", inputMap: { totalCost: "cost", cleanCost: "cleanCost" }, outputId: "roi" },
  ],
  reportTemplate: { title: "Heat Exchanger Fouling Report", sections: ["executive_summary", "thresholds", "action_plan", "assumptions"], exportFormats: ["pdf", "excel"] },
  assumptions: { hiddenLossMultiplier: 1.15, volatilityPercent: 15, targetMarginPercent: 20, assumptionNotes: ["Rf = 1/U_dirty - 1/U_clean.", "Heat loss = Area×U_clean×LMTD - Area×U_dirty×LMTD.", "Cost = EnergyPenalty×FuelCost + PumpInc."] },
};
