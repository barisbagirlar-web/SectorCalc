
import type { PremiumCalculatorSchema } from "@/lib/features/premium-schema/premium-calculator-schema";
export const TRANSPORT_MODE_RISK_SCHEMA: PremiumCalculatorSchema = {
  id: "transport-mode-risk-analyzer", legacyPaidSlug: "transport-mode-risk-analyzer",
  name: "Transport Mode Risk and Cost Analyzer", name_i18n: {"en":"Transport Mode Risk and Cost Analyzer"}, sectorSlug: "logistics-transport", category: "cost",
  painStatement: "When choosing between air, sea, and land carrying modes, risk and transit time cost are overlooked.", painStatement_i18n: {"en":"When choosing between air, sea, and land carrying modes, risk and transit time cost are overlooked."},
  inputs: [
    {
      id: "riskPct",
      label: "Risk Pct",
      label_i18n: { en: "Risk Pct" },
      type: "number",
      unit: "—",

      group: "General"
    },
    {
      id: "costOfCapital",
      label: "Cost Of Capital",
      label_i18n: { en: "Cost Of Capital" },
      type: "number",
      unit: "—",

      group: "General"
    },
    {
      id: "roadRatePerKm",
      label: "Road Rate Per Km",
      label_i18n: { en: "Road Rate Per Km" },
      type: "number",
      unit: "—",

      group: "General"
    },
    {
      id: "seaRatePerCbm",
      label: "Sea Rate Per Cbm",
      label_i18n: { en: "Sea Rate Per Cbm" },
      type: "number",
      unit: "—",

      group: "General"
    },
    {
      id: "airRatePerKg",
      label: "Air Rate Per Kg",
      label_i18n: { en: "Air Rate Per Kg" },
      type: "number",
      unit: "—",

      group: "General"
    },
    { id: "airFreightCost", label: "Air Kargo Cost", label_i18n: {"en":"Air Kargo Cost"}, type: "number", unit: "USD", required: true, smartDefault: 8000, validation: { min: 0 }, helper: "", expertMeaning: "Total air freight cost", expertMeaning_i18n: {"en":"Total air freight cost"} },
    { id: "seaFreightCost", label: "Deniz Kargo Cost", label_i18n: {"en":"Deniz Kargo Cost"}, type: "number", unit: "USD", required: true, smartDefault: 3000, validation: { min: 0 }, helper: "", expertMeaning: "Total sea freight cost", expertMeaning_i18n: {"en":"Total sea freight cost"} },
    { id: "roadFreightCost", label: "Kara Nakliye Cost", label_i18n: {"en":"Kara Nakliye Cost"}, type: "number", unit: "USD", required: true, smartDefault: 2000, validation: { min: 0 }, helper: "", expertMeaning: "Total road freight cost", expertMeaning_i18n: {"en":"Total road freight cost"} },
    { id: "airTransitDays", label: "Air transit days", label_i18n: {"en":"Air transit days"}, type: "number", unit: "days", required: true, smartDefault: 2, validation: { min: 0 }, helper: "", expertMeaning: "Air transit days", expertMeaning_i18n: {"en":"Air transit days"} },
    { id: "seaTransitDays", label: "Sea transit days", label_i18n: {"en":"Sea transit days"}, type: "number", unit: "days", required: true, smartDefault: 20, validation: { min: 0 }, helper: "", expertMeaning: "Sea transit days", expertMeaning_i18n: {"en":"Sea transit days"} },
    { id: "roadTransitDays", label: "Road transit days", label_i18n: {"en":"Road transit days"}, type: "number", unit: "days", required: true, smartDefault: 5, validation: { min: 0 }, helper: "", expertMeaning: "Road transit days", expertMeaning_i18n: {"en":"Road transit days"} },
    { id: "dailyCostOfDelay", label: "Daily cost of delay", label_i18n: {"en":"Daily cost of delay"}, type: "number", unit: "USD/day", required: false, smartDefault: 200, validation: { min: 0 }, helper: "", expertMeaning: "Daily cost of delay", expertMeaning_i18n: {"en":"Daily cost of delay"} },
    { id: "cargoValue", label: "Total cargo value", label_i18n: {"en":"Total cargo value"}, type: "number", unit: "USD", required: false, smartDefault: 100000, validation: { min: 0 }, helper: "", expertMeaning: "Total cargo value", expertMeaning_i18n: {"en":"Total cargo value"} },
  ],
  outputs: [
    { id: "transportAir", label: "Air Carrying Cost", label_i18n: {"en":"Air Carrying Cost"}, unit: "USD", format: "currency" },
    { id: "transportSea", label: "Deniz Carrying Cost", label_i18n: {"en":"Deniz Carrying Cost"}, unit: "USD", format: "currency" },
    { id: "transportRoad", label: "Kara Carrying Cost", label_i18n: {"en":"Kara Carrying Cost"}, unit: "USD", format: "currency" },
    { id: "transitTimeCost", label: "Transit Time Cost", label_i18n: {"en":"Transit Time Cost"}, unit: "USD", format: "currency" },
    { id: "riskCostTransport", label: "Risk Cost", label_i18n: {"en":"Risk Cost"}, unit: "USD", format: "currency" },
    { id: "totalModeCost", label: "Total Mod Cost", label_i18n: {"en":"Total Mod Cost"}, unit: "USD", format: "currency", isBigNumber: true },
  ],
  thresholds: [{ fieldId: "totalModeCost", warning: 10000, critical: 25000, direction: "higher_is_bad", warningMessage: "Total carrying cost > $10K — mode optimization is recommended.", warningMessage_i18n: {"en":"Total carrying cost > $10K — mode optimization is recommended."}, criticalMessage: "Total carrying cost > $25K — alternative routes should be evaluated.", criticalMessage_i18n: {"en":"Total carrying cost > $25K — alternative routes should be evaluated."} }],
  formulaPipeline: [
    { formulaId: "cost.transport_air", inputMap: { airFreightCost: "airFreightCost" ,
        airFreightKg: "airFreightCost",
        airRatePerKg: "airRatePerKg"}, outputId: "transportAir" },
    { formulaId: "cost.transport_sea", inputMap: { seaFreightCost: "seaFreightCost" ,
        seaFreightCbm: "seaFreightCost",
        seaRatePerCbm: "seaRatePerCbm"}, outputId: "transportSea" },
    { formulaId: "cost.transport_road", inputMap: { roadFreightCost: "roadFreightCost" ,
        roadFreightKm: "roadFreightCost",
        roadRatePerKm: "roadRatePerKm"}, outputId: "transportRoad" },
    { formulaId: "cost.transit_time_cost", inputMap: { airTransitDays: "airTransitDays", seaTransitDays: "seaTransitDays", roadTransitDays: "roadTransitDays", dailyCostOfDelay: "dailyCostOfDelay" ,
        transitDays: "airTransitDays",
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
