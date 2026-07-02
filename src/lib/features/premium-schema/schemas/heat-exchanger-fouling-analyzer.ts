
import type { PremiumCalculatorSchema } from "@/lib/features/premium-schema/premium-calculator-schema";
export const HEAT_EXCHANGER_FOULING_SCHEMA: PremiumCalculatorSchema = {
  id: "heat-exchanger-fouling-analyzer", legacyPaidSlug: "heat-exchanger-fouling-analyzer",
  name: "Heat Exchanger Fouling & Energy Loss Analyzer", name_i18n: {"en":"Heat Exchanger Fouling & Energy Loss Analyzer"}, sectorSlug: "sheet-metal", category: "energy",
  painStatement: "Fouling in the heat exchanger causes heat transfer efficiency to drop and energy cost to rise. Cleaning ROI should be calculated.", painStatement_i18n: {"en":"Fouling in the heat exchanger causes heat transfer efficiency to drop and energy cost to rise. Cleaning ROI should be calculated."},
  inputs: [
    { id: "uClean", label: "U_clean (Temiz)", label_i18n: {"en":"U_clean (Temiz)"}, type: "number", unit: "W/m²K", required: true, smartDefault: 500, validation: { min: 1 }, helper: "", expertMeaning: "Clean overall heat transfer coeff", expertMeaning_i18n: {"en":"Clean overall heat transfer coeff"} },
    { id: "uDirty", label: "U_dirty (Kirli)", label_i18n: {"en":"U_dirty (Kirli)"}, type: "number", unit: "W/m²K", required: true, smartDefault: 350, validation: { min: 1 }, helper: "", expertMeaning: "Dirty overall heat transfer coeff", expertMeaning_i18n: {"en":"Dirty overall heat transfer coeff"} },
    { id: "area", label: "Heat exchanger area", label_i18n: {"en":"Heat exchanger area"}, type: "number", unit: "m²", required: true, smartDefault: 100, validation: { min: 0.1 }, helper: "", expertMeaning: "Heat exchanger area", expertMeaning_i18n: {"en":"Heat exchanger area"} },
    { id: "lmtd", label: "LMTD", label_i18n: {"en":"LMTD"}, type: "number", unit: "K", required: true, smartDefault: 30, validation: { min: 0.1 }, helper: "", expertMeaning: "Log mean temperature difference", expertMeaning_i18n: {"en":"Log mean temperature difference"} },
    { id: "operatingHours", label: "Annual operating hours", label_i18n: {"en":"Annual operating hours"}, type: "number", unit: "saat/yil", required: false, smartDefault: 8000, validation: { min: 0 }, helper: "", expertMeaning: "Annual operating hours", expertMeaning_i18n: {"en":"Annual operating hours"} },
    { id: "boilerEff", label: "Kazan Efficiency", label_i18n: {"en":"Kazan Efficiency"}, type: "number", unit: "%", required: false, smartDefault: 85, validation: { min: 1, max: 100 }, helper: "", expertMeaning: "Boiler/furnace efficiency", expertMeaning_i18n: {"en":"Boiler/furnace efficiency"} },
    { id: "fuelCost", label: "Fuel cost per kWh", label_i18n: {"en":"Fuel cost per kWh"}, type: "number", unit: "USD/kWh", required: false, smartDefault: 0.05, validation: { min: 0 }, helper: "", expertMeaning: "Fuel cost per kWh", expertMeaning_i18n: {"en":"Fuel cost per kWh"} },
    { id: "deltaPIncrease", label: "DP increase due to fouling", label_i18n: {"en":"DP increase due to fouling"}, type: "number", unit: "bar", required: false, smartDefault: 0.5, validation: { min: 0 }, helper: "", expertMeaning: "DP increase due to fouling", expertMeaning_i18n: {"en":"DP increase due to fouling"} },
    { id: "flowM3h", label: "Flow rate", label_i18n: {"en":"Flow rate"}, type: "number", unit: "m³/saat", required: false, smartDefault: 200, validation: { min: 0 }, helper: "", expertMeaning: "Flow rate", expertMeaning_i18n: {"en":"Flow rate"} },
    { id: "pumpEff", label: "Pump Efficiency", label_i18n: {"en":"Pump Efficiency"}, type: "number", unit: "%", required: false, smartDefault: 75, validation: { min: 1, max: 100 }, helper: "", expertMeaning: "Pump efficiency", expertMeaning_i18n: {"en":"Pump efficiency"} },
    { id: "cleanCost", label: "Temizlik Cost", label_i18n: {"en":"Temizlik Cost"}, type: "number", unit: "USD", required: false, smartDefault: 5000, validation: { min: 0 }, helper: "", expertMeaning: "Cost of cleaning", expertMeaning_i18n: {"en":"Cost of cleaning"} },

  ],
  outputs: [
    { id: "rf", label: "Fouling Direnci (Rf)", label_i18n: {"en":"Fouling Direnci (Rf)"}, unit: "m²K/W", format: "number" },
    { id: "heatLoss", label: "Is Transfer Loss", label_i18n: {"en":"Is Transfer Loss"}, unit: "kW", format: "number" },
    { id: "cost", label: "Annual Energy Loss", label_i18n: {"en":"Annual Energy Loss"}, unit: "USD/year", format: "currency" },
    { id: "roi", label: "Temizlik ROI", label_i18n: {"en":"Temizlik ROI"}, unit: "%", format: "percentage", isBigNumber: true },
  ],
  thresholds: [{ fieldId: "cost", warning: 10000, critical: 30000, direction: "higher_is_bad", warningMessage: "Energy loss > $10K/year — cleaning should be scheduled.", warningMessage_i18n: {"en":"Energy loss > $10K/year — cleaning should be scheduled."}, criticalMessage: "Loss > $30K/year — urgent cleaning is required.", criticalMessage_i18n: {"en":"Loss > $30K/year — urgent cleaning is required."} }],
  formulaPipeline: [
    { formulaId: "energy.fouling_resistance", inputMap: { uClean: "uClean", uDirty: "uDirty" }, outputId: "rf" },
    { formulaId: "energy.heat_exchanger_loss", inputMap: { area: "area", uClean: "uClean", lmtd: "lmtd", uDirty: "uDirty" }, outputId: "heatLoss" },
    { formulaId: "energy.fouling_cost", inputMap: { heatLoss: "heatLoss", fuelCost: "fuelCost", operatingHours: "operatingHours", boilerEff: "boilerEff", deltaPIncrease: "deltaPIncrease", flowM3h: "flowM3h", pumpEff: "pumpEff" }, outputId: "cost" },
    { formulaId: "energy.fouling_roi", inputMap: { totalCost: "cost", cleanCost: "cleanCost" }, outputId: "roi" },
  ],
  reportTemplate: { title: "Heat Exchanger Fouling Report", title_i18n: {"en":"Heat Exchanger Fouling Report"}, sections: ["executive_summary", "thresholds", "action_plan", "assumptions"], exportFormats: ["pdf", "excel"] },
  assumptions: { hiddenLossMultiplier: 1.15, volatilityPercent: 15, targetMarginPercent: 20, assumptionNotes: ["Rf = 1/U_dirty - 1/U_clean.", "Heat loss = Area×U_clean×LMTD - Area×U_dirty×LMTD.", "Cost = EnergyPenalty×FuelCost + PumpInc."],assumptionNotes_i18n:[{"en":"Rf = 1/U_dirty - 1/U_clean."},{"en":"Heat loss = Area×U_clean×LMTD - Area×U_dirty×LMTD."},{"en":"Cost = EnergyPenalty×FuelCost + PumpInc."}] },
};
