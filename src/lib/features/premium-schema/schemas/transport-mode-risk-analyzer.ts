/**
 * Tool #20 — Taşıma Mode
 */
import type { PremiumCalculatorSchema } from "@/lib/features/premium-schema/premium-calculator-schema";
export const TRANSPORT_MODE_RISK_SCHEMA: PremiumCalculatorSchema = {
  id: "transport-mode-risk-analyzer", legacyPaidSlug: "transport-mode-risk-analyzer",
  name: "Taşıma Modu Risk ve Maliyet Analizi", name_i18n: {"en":"Transport Mode Risk and Cost Analyzer"}, sectorSlug: "logistics-transport", category: "cost",
  painStatement: "Hava, deniz ve kara taşıma modları arasında seçim yaparken risk ve transit süre maliyeti göz ardı edilir.", painStatement_i18n: {"en":"Hava, deniz ve kara taşıma modları arasında seçim yaparken risk ve transit süre maliyeti göz ardı edilir."},
  inputs: [
    { id: "airFreightCost", label: "Hava Kargo Maliyeti", label_i18n: {"en":"Hava Kargo Maliyeti"}, type: "number", unit: "USD", required: true, smartDefault: 8000, validation: { min: 0 }, helper: "", expertMeaning: "Total air freight cost", expertMeaning_i18n: {"en":"Total air freight cost"} },
    { id: "seaFreightCost", label: "Deniz Kargo Maliyeti", label_i18n: {"en":"Deniz Kargo Maliyeti"}, type: "number", unit: "USD", required: true, smartDefault: 3000, validation: { min: 0 }, helper: "", expertMeaning: "Total sea freight cost", expertMeaning_i18n: {"en":"Total sea freight cost"} },
    { id: "roadFreightCost", label: "Kara Nakliye Maliyeti", label_i18n: {"en":"Kara Nakliye Maliyeti"}, type: "number", unit: "USD", required: true, smartDefault: 2000, validation: { min: 0 }, helper: "", expertMeaning: "Total road freight cost", expertMeaning_i18n: {"en":"Total road freight cost"} },
    { id: "airTransitDays", label: "Hava Transit Süresi", label_i18n: {"en":"Air transit days"}, type: "number", unit: "gün", required: true, smartDefault: 2, validation: { min: 0 }, helper: "", expertMeaning: "Air transit days", expertMeaning_i18n: {"en":"Air transit days"} },
    { id: "seaTransitDays", label: "Deniz Transit Süresi", label_i18n: {"en":"Sea transit days"}, type: "number", unit: "gün", required: true, smartDefault: 20, validation: { min: 0 }, helper: "", expertMeaning: "Sea transit days", expertMeaning_i18n: {"en":"Sea transit days"} },
    { id: "roadTransitDays", label: "Kara Transit Süresi", label_i18n: {"en":"Road transit days"}, type: "number", unit: "gün", required: true, smartDefault: 5, validation: { min: 0 }, helper: "", expertMeaning: "Road transit days", expertMeaning_i18n: {"en":"Road transit days"} },
    { id: "dailyCostOfDelay", label: "Gecikme Günlük Maliyeti", label_i18n: {"en":"Daily cost of delay"}, type: "number", unit: "USD/gün", required: false, smartDefault: 200, validation: { min: 0 }, helper: "", expertMeaning: "Daily cost of delay", expertMeaning_i18n: {"en":"Daily cost of delay"} },
    { id: "cargoValue", label: "Kargo Değeri", label_i18n: {"en":"Total cargo value"}, type: "number", unit: "USD", required: false, smartDefault: 100000, validation: { min: 0 }, helper: "", expertMeaning: "Total cargo value", expertMeaning_i18n: {"en":"Total cargo value"} },
  ],
  outputs: [
    { id: "transportAir", label: "Hava Taşıma Maliyeti", label_i18n: {"en":"Hava Tasma Maliyeti"}, unit: "USD", format: "currency" },
    { id: "transportSea", label: "Deniz Taşıma Maliyeti", label_i18n: {"en":"Deniz Tasma Maliyeti"}, unit: "USD", format: "currency" },
    { id: "transportRoad", label: "Kara Taşıma Maliyeti", label_i18n: {"en":"Kara Tasma Maliyeti"}, unit: "USD", format: "currency" },
    { id: "transitTimeCost", label: "Transit Süre Maliyeti", label_i18n: {"en":"Transit Sure Maliyeti"}, unit: "USD", format: "currency" },
    { id: "riskCostTransport", label: "Risk Maliyeti", label_i18n: {"en":"Risk Maliyeti"}, unit: "USD", format: "currency" },
    { id: "totalModeCost", label: "Toplam Mod Maliyeti", label_i18n: {"en":"Toplam Mod Maliyeti"}, unit: "USD", format: "currency", isBigNumber: true },
  ],
  thresholds: [{ fieldId: "totalModeCost", warning: 10000, critical: 25000, direction: "higher_is_bad", warningMessage: "Toplam taşıma maliyeti > $10K — mod optimizasyonu önerilir.", warningMessage_i18n: {"en":"Toplam taşıma maliyeti > $10K — mod optimizasyonu önerilir."}, criticalMessage: "Toplam taşıma maliyeti > $25K — alternatif rotalar değerlendirilmeli.", criticalMessage_i18n: {"en":"Toplam taşıma maliyeti > $25K — alternatif rotalar değerlendirilmeli."} }],
  formulaPipeline: [
    { formulaId: "cost.transport_air", inputMap: { airFreightCost: "airFreightCost" ,
        airFreightKg: "airFreightKg",
        airRatePerKg: "airRatePerKg"}, outputId: "transportAir" },
    { formulaId: "cost.transport_sea", inputMap: { seaFreightCost: "seaFreightCost" ,
        seaFreightCbm: "seaFreightCbm",
        seaRatePerCbm: "seaRatePerCbm"}, outputId: "transportSea" },
    { formulaId: "cost.transport_road", inputMap: { roadFreightCost: "roadFreightCost" ,
        roadFreightKm: "roadFreightKm",
        roadRatePerKm: "roadRatePerKm"}, outputId: "transportRoad" },
    { formulaId: "cost.transit_time_cost", inputMap: { airTransitDays: "airTransitDays", seaTransitDays: "seaTransitDays", roadTransitDays: "roadTransitDays", dailyCostOfDelay: "dailyCostOfDelay" ,
        transitDays: "transitDays",
        costOfCapital: "costOfCapital",
        cargoValue: "cargoValue"}, outputId: "transitTimeCost" },
    { formulaId: "cost.risk_cost_transport", inputMap: {
        cargoValue: "cargoValue"
      ,
        riskPct: "riskPct"}, outputId: "riskCostTransport" },
    { formulaId: "cost.total_mode_cost", inputMap: { transportAir: "transportAir", transportSea: "transportSea", transportRoad: "transportRoad", transitTimeCost: "transitTimeCost", riskCostTransport: "riskCostTransport" }, outputId: "totalModeCost" },
  ],
  reportTemplate: { title: "Transport Mode Risk & Cost Report", title_i18n: {"en":"Transport Mode Risk & Cost Report"}, sections: ["executive_summary", "thresholds", "sensitivity", "action_plan", "assumptions"], exportFormats: ["pdf", "excel"] },
  assumptions: { hiddenLossMultiplier: 1.15, volatilityPercent: 10, targetMarginPercent: 12, assumptionNotes: ["Air fastest but most expensive.", "Sea slowest but cheapest.", "Road balances speed and cost.", "Transit cost = days × daily delay cost."],assumptionNotes_i18n:[{"en":"Air fastest but most expensive."},{"en":"Sea slowest but cheapest."},{"en":"Road balances speed and cost."},{"en":"Transit cost = days × daily delay cost."}] },
};
