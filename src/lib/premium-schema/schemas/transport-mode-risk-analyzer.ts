/**
 * Tool #20 — Taşıma Mode
 */
import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";
export const TRANSPORT_MODE_RISK_SCHEMA: PremiumCalculatorSchema = {
  id: "transport-mode-risk-analyzer", legacyPaidSlug: "transport-mode-risk-analyzer",
  name: "Taşıma Modu Risk ve Maliyet Analizi", sectorSlug: "logistics-transport", category: "cost",
  painStatement: "Hava, deniz ve kara taşıma modları arasında seçim yaparken risk ve transit süre maliyeti göz ardı edilir.",
  inputs: [
    { id: "airFreightCost", label: "Hava Kargo Maliyeti", type: "number", unit: "USD", required: true, smartDefault: 8000, validation: { min: 0 }, helper: "", expertMeaning: "Total air freight cost" },
    { id: "seaFreightCost", label: "Deniz Kargo Maliyeti", type: "number", unit: "USD", required: true, smartDefault: 3000, validation: { min: 0 }, helper: "", expertMeaning: "Total sea freight cost" },
    { id: "roadFreightCost", label: "Kara Nakliye Maliyeti", type: "number", unit: "USD", required: true, smartDefault: 2000, validation: { min: 0 }, helper: "", expertMeaning: "Total road freight cost" },
    { id: "airTransitDays", label: "Hava Transit Süresi", type: "number", unit: "gün", required: true, smartDefault: 2, validation: { min: 0 }, helper: "", expertMeaning: "Air transit days" },
    { id: "seaTransitDays", label: "Deniz Transit Süresi", type: "number", unit: "gün", required: true, smartDefault: 20, validation: { min: 0 }, helper: "", expertMeaning: "Sea transit days" },
    { id: "roadTransitDays", label: "Kara Transit Süresi", type: "number", unit: "gün", required: true, smartDefault: 5, validation: { min: 0 }, helper: "", expertMeaning: "Road transit days" },
    { id: "dailyCostOfDelay", label: "Gecikme Günlük Maliyeti", type: "number", unit: "USD/gün", required: false, smartDefault: 200, validation: { min: 0 }, helper: "", expertMeaning: "Daily cost of delay" },
    { id: "cargoValue", label: "Kargo Değeri", type: "number", unit: "USD", required: false, smartDefault: 100000, validation: { min: 0 }, helper: "", expertMeaning: "Total cargo value" },
  ],
  outputs: [
    { id: "transportAir", label: "Hava Taşıma Maliyeti", unit: "USD", format: "currency" },
    { id: "transportSea", label: "Deniz Taşıma Maliyeti", unit: "USD", format: "currency" },
    { id: "transportRoad", label: "Kara Taşıma Maliyeti", unit: "USD", format: "currency" },
    { id: "transitTimeCost", label: "Transit Süre Maliyeti", unit: "USD", format: "currency" },
    { id: "riskCostTransport", label: "Risk Maliyeti", unit: "USD", format: "currency" },
    { id: "totalModeCost", label: "Toplam Mod Maliyeti", unit: "USD", format: "currency", isBigNumber: true },
  ],
  thresholds: [{ fieldId: "totalModeCost", warning: 10000, critical: 25000, direction: "higher_is_bad", warningMessage: "Toplam taşıma maliyeti > $10K — mod optimizasyonu önerilir.", criticalMessage: "Toplam taşıma maliyeti > $25K — alternatif rotalar değerlendirilmeli." }],
  formulaPipeline: [
    { formulaId: "cost.transport_air", inputMap: { airFreightCost: "airFreightCost" }, outputId: "transportAir" },
    { formulaId: "cost.transport_sea", inputMap: { seaFreightCost: "seaFreightCost" }, outputId: "transportSea" },
    { formulaId: "cost.transport_road", inputMap: { roadFreightCost: "roadFreightCost" }, outputId: "transportRoad" },
    { formulaId: "cost.transit_time_cost", inputMap: { airTransitDays: "airTransitDays", seaTransitDays: "seaTransitDays", roadTransitDays: "roadTransitDays", dailyCostOfDelay: "dailyCostOfDelay" }, outputId: "transitTimeCost" },
    { formulaId: "cost.risk_cost_transport", inputMap: { cargoValue: "cargoValue" }, outputId: "riskCostTransport" },
    { formulaId: "cost.total_mode_cost", inputMap: { transportAir: "transportAir", transportSea: "transportSea", transportRoad: "transportRoad", transitTimeCost: "transitTimeCost", riskCostTransport: "riskCostTransport" }, outputId: "totalModeCost" },
  ],
  reportTemplate: { title: "Transport Mode Risk & Cost Report", sections: ["executive_summary", "thresholds", "sensitivity", "action_plan", "assumptions"], exportFormats: ["pdf", "excel"] },
  assumptions: { hiddenLossMultiplier: 1.15, volatilityPercent: 10, targetMarginPercent: 12, assumptionNotes: ["Air fastest but most expensive.", "Sea slowest but cheapest.", "Road balances speed and cost.", "Transit cost = days × daily delay cost."] },
};
