/**
 * Tool — Ruzgar Turbini Yatirim
 */
import type { PremiumCalculatorSchema } from "@/lib/features/premium-schema/premium-calculator-schema";
export const WIND_TURBINE_INVESTMENT_ANALYZER: PremiumCalculatorSchema = {
  id: "wind-turbine-investment-analyzer", legacyPaidSlug: "wind-turbine-investment-analyzer",
  name: "Wind Turbine Investment Analyzer", name_i18n: {"en":"Wind Turbine Investment Analyzer"}, sectorSlug: "energy-carbon", category: "cost",
  painStatement: "Ruzgar turbini yatiriminda AEP, revenue ve NPV hesaplanmazsa yatirimin geri donusu ve fizibilitesi belirsiz kalir.", painStatement_i18n: {"en":"If AEP, Income, and NPV are not calculated in wind turbine investment, the Return and feasibility of the investment remain uncertain."},
  inputs: [
    { id: "rotorDiameter", label: "Rotor diameter in meters", label_i18n: {"en":"Rotor diameter in meters"}, type: "number", unit: "m", required: true, smartDefault: 82, validation: { min: 1 }, helper: "", expertMeaning: "Rotor diameter in meters", expertMeaning_i18n: {"en":"Rotor diameter in meters"} },
    { id: "hubHeight", label: "Hub height in meters", label_i18n: {"en":"Hub height in meters"}, type: "number", unit: "m", required: true, smartDefault: 80, validation: { min: 1 }, helper: "", expertMeaning: "Hub height in meters", expertMeaning_i18n: {"en":"Hub height in meters"} },
    { id: "avgWindSpeed", label: "Annual average wind speed at hub height", label_i18n: {"en":"Annual average wind speed at hub height"}, type: "number", unit: "m/s", required: true, smartDefault: 7.5, validation: { min: 2, max: 25 }, helper: "", expertMeaning: "Annual average wind speed at hub height", expertMeaning_i18n: {"en":"Annual average wind speed at hub height"} },
    { id: "airDensity", label: "Air density at site", label_i18n: {"en":"Air density at site"}, type: "number", unit: "kg/m³", required: false, smartDefault: 1.225, validation: { min: 0.5, max: 1.5 }, helper: "", expertMeaning: "Air density at site", expertMeaning_i18n: {"en":"Air density at site"} },
    { id: "capacityFactor", label: "Kapasite Faktoru", label_i18n: {"en":"Expected capacity factor"}, type: "number", unit: "%", required: false, smartDefault: 30, validation: { min: 5, max: 60 }, helper: "", expertMeaning: "Expected capacity factor", expertMeaning_i18n: {"en":"Expected capacity factor"} },
    { id: "electricityPrice", label: "Price per kWh sold", label_i18n: {"en":"Price per kWh sold"}, type: "number", unit: "USD/kWh", required: true, smartDefault: 0.08, validation: { min: 0.01 }, helper: "", expertMeaning: "Price per kWh sold", expertMeaning_i18n: {"en":"Price per kWh sold"} },
    { id: "investmentCost", label: "Total CAPEX", label_i18n: {"en":"Total CAPEX"}, type: "number", unit: "USD", required: true, smartDefault: 2500000, validation: { min: 1 }, helper: "", expertMeaning: "Total CAPEX", expertMeaning_i18n: {"en":"Total CAPEX"} },
    { id: "opexPerYear", label: "Annual OPEX", label_i18n: {"en":"Annual OPEX"}, type: "number", unit: "USD/yil", required: true, smartDefault: 75000, validation: { min: 1 }, helper: "", expertMeaning: "Annual OPEX", expertMeaning_i18n: {"en":"Annual OPEX"} },
    { id: "projectLife", label: "Proje Omru", label_i18n: {"en":"Project lifetime"}, type: "number", unit: "yil", required: false, smartDefault: 20, validation: { min: 1, max: 50 }, helper: "", expertMeaning: "Project lifetime", expertMeaning_i18n: {"en":"Project lifetime"} },
    { id: "discountRate", label: "Discount rate for NPV", label_i18n: {"en":"Discount rate for NPV"}, type: "number", unit: "%", required: false, smartDefault: 8, validation: { min: 0, max: 30 }, helper: "", expertMeaning: "Discount rate for NPV", expertMeaning_i18n: {"en":"Discount rate for NPV"} },
  ],
  outputs: [
    { id: "aep", label: "Yllk Enerji Uretimi (AEP)", label_i18n: {"en":"Annual energy Uretimi (AEP)"}, unit: "MWh/yil", format: "number", isBigNumber: true },
    { id: "annualRevenue", label: "Yllk Gelir", label_i18n: {"en":"Annual Income"}, unit: "USD/yil", format: "currency" },
    { id: "ebitda", label: "FVAOK (EBITDA)", label_i18n: {"en":"FVAOK (EBITDA)"}, unit: "USD/yil", format: "currency" },
    { id: "lcoe", label: "Seviyelendirilmis Enerji Maliyeti (LCOE)", label_i18n: {"en":"Seviyelendirilmis energy Cost (LCOE)"}, unit: "USD/kWh", format: "currency" },
    { id: "npv", label: "Net Bugunku Deger (NPV)", label_i18n: {"en":"Net Bugunku Value (NPV)"}, unit: "USD", format: "currency", isBigNumber: true },
  ],
  thresholds: [{ fieldId: "lcoe", warning: 0.06, critical: 0.10, direction: "higher_is_bad", warningMessage: "LCOE > $0.06/kWh — piyasa rekabeti zorlasabilir.", warningMessage_i18n: {"en":"LCOE > $0.06/kWh — Market competitiveness may become difficult."}, criticalMessage: "LCOE > $0.10/kWh — yatirim fizibilitesi dusuk.", criticalMessage_i18n: {"en":"LCOE > $0.10/kWh — Investment feasibility is low."} }],
  formulaPipeline: [
    { formulaId: "measurement.wind_aep", inputMap: {
        capacityFactor: "capacityFactor",
        ratedPower: "rotorDiameter",
        avgWindSpeed: "avgWindSpeed",
        airDensity: "airDensity"
      }, outputId: "aep" },
    { formulaId: "cost.wind_annual_revenue", inputMap: {
        aep: "aep",
        feedInTariff: "electricityPrice"
      }, outputId: "annualRevenue" },
    { formulaId: "cost.wind_ebitda", inputMap: {
        annualRevenue: "annualRevenue",
        opex: "opexPerYear"
      }, outputId: "ebitda" },
    { formulaId: "cost.wind_lcoe", inputMap: {
        projectLife: "projectLife",
        costPerMW: "investmentCost",
        opexAnnual: "aep",
        annualGeneration: "opexPerYear"
      ,
        totalCapex: "totalCapex",
        opex: "opex",
        lifeYears: "lifeYears",
        aep: "aep"}, outputId: "lcoe" },
    { formulaId: "cost.wind_npv", inputMap: {
        discountRate: "discountRate",
        projectLife: "projectLife",
        annualGeneration: "annualRevenue",
        wacc: "opexPerYear",
        costPerMW: "investmentCost"
      ,
        ebitda: "ebitda",
        lifeYears: "lifeYears",
        totalCapex: "totalCapex"}, outputId: "npv" },
  ],
  reportTemplate: { title: "Ruzgar Turbini Yatirim Reportu", title_i18n: {"en":"Wind Turbine Investment Report"}, sections: ["executive_summary", "loss_breakdown", "thresholds", "action_plan", "assumptions"], exportFormats: ["pdf", "excel"] },
  assumptions: { hiddenLossMultiplier: 1.1, volatilityPercent: 10, targetMarginPercent: 15, assumptionNotes: ["AEP = 0.5 × ρ × A × V³ × Cp × 8760 / 1e6.", "LCOE = (CAPEX + ΣOPEXₜ/(1+r)ᵗ) / ΣAEPₜ/(1+r)ᵗ.", "NPV = Σ(Revenueₜ − OPEXₜ)/(1+r)ᵗ − CAPEX.", "Ruzgar hizi Weibull dagilimi varsayilmistir."],assumptionNotes_i18n:[{"en":"AEP = 0.5 × ρ × A × V³ × Cp × 8760 / 1e6."},{"en":"LCOE = (CAPEX + ΣOPEXₜ/(1+r)ᵗ) / ΣAEPₜ/(1+r)ᵗ."},{"en":"NPV = Σ(Revenueₜ − OPEXₜ)/(1+r)ᵗ − CAPEX."},{"en":"Wind speed is assumed to follow Weibull distribution."}] },
};
