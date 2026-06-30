/**
 * Tool — Rüzgar Türbini Yatırım
 */
import type { PremiumCalculatorSchema } from "@/lib/features/premium-schema/premium-calculator-schema";
export const WIND_TURBINE_INVESTMENT_ANALYZER: PremiumCalculatorSchema = {
  id: "wind-turbine-investment-analyzer", legacyPaidSlug: "wind-turbine-investment-analyzer",
  name: "Rüzgar Türbini Yatırım Analizi", name_i18n: {"en":"Wind Turbine Investment Analyzer","tr":"Rüzgar Türbini Yatırım Analizi"}, sectorSlug: "energy-carbon", category: "cost",
  painStatement: "Rüzgar türbini yatırımında AEP, gelir ve NPV hesaplanmazsa yatırımın geri dönüşü ve fizibilitesi belirsiz kalır.", painStatement_i18n: {"en":"Rüzgar türbini yatırımında AEP, gelir ve NPV hesaplanmazsa yatırımın geri dönüşü ve fizibilitesi belirsiz kalır.","tr":"Rüzgar türbini yatırımında AEP, gelir ve NPV hesaplanmazsa yatırımın geri dönüşü ve fizibilitesi belirsiz kalır."},
  inputs: [
    { id: "rotorDiameter", label: "Rotor Çapı", label_i18n: {"en":"Rotor diameter in meters","tr":"Rotor Çapı"}, type: "number", unit: "m", required: true, smartDefault: 82, validation: { min: 1 }, helper: "", expertMeaning: "Rotor diameter in meters", expertMeaning_i18n: {"en":"Rotor diameter in meters","tr":"rotor çapı"} },
    { id: "hubHeight", label: "Kule Yüksekliği", label_i18n: {"en":"Hub height in meters","tr":"Kule Yüksekliği"}, type: "number", unit: "m", required: true, smartDefault: 80, validation: { min: 1 }, helper: "", expertMeaning: "Hub height in meters", expertMeaning_i18n: {"en":"Hub height in meters","tr":"kule yüksekliği"} },
    { id: "avgWindSpeed", label: "Ortalama Rüzgar Hızı", label_i18n: {"en":"Annual average wind speed at hub height","tr":"Ortalama Rüzgar Hızı"}, type: "number", unit: "m/s", required: true, smartDefault: 7.5, validation: { min: 2, max: 25 }, helper: "", expertMeaning: "Annual average wind speed at hub height", expertMeaning_i18n: {"en":"Annual average wind speed at hub height","tr":"ortalama rüzgar hızı"} },
    { id: "airDensity", label: "Hava Yoğunluğu", label_i18n: {"en":"Air density at site","tr":"Hava Yoğunluğu"}, type: "number", unit: "kg/m³", required: false, smartDefault: 1.225, validation: { min: 0.5, max: 1.5 }, helper: "", expertMeaning: "Air density at site", expertMeaning_i18n: {"en":"Air density at site","tr":"hava yoğunluğu"} },
    { id: "capacityFactor", label: "Kapasite Faktörü", label_i18n: {"en":"Expected capacity factor","tr":"Kapasite Faktörü"}, type: "number", unit: "%", required: false, smartDefault: 30, validation: { min: 5, max: 60 }, helper: "", expertMeaning: "Expected capacity factor", expertMeaning_i18n: {"en":"Expected capacity factor","tr":"kapasite faktörü"} },
    { id: "electricityPrice", label: "Elektrik Fiyatı", label_i18n: {"en":"Price per kWh sold","tr":"Elektrik Fiyatı"}, type: "number", unit: "USD/kWh", required: true, smartDefault: 0.08, validation: { min: 0.01 }, helper: "", expertMeaning: "Price per kWh sold", expertMeaning_i18n: {"en":"Price per kWh sold","tr":"elektrik fiyatı"} },
    { id: "investmentCost", label: "Yatırım Maliyeti", label_i18n: {"en":"Total CAPEX","tr":"Yatırım Maliyeti"}, type: "number", unit: "USD", required: true, smartDefault: 2500000, validation: { min: 1 }, helper: "", expertMeaning: "Total CAPEX", expertMeaning_i18n: {"en":"Total CAPEX","tr":"yatırım maliyeti"} },
    { id: "opexPerYear", label: "Yıllık İşletme Maliyeti", label_i18n: {"en":"Annual OPEX","tr":"Yıllık İşletme Maliyeti"}, type: "number", unit: "USD/yıl", required: true, smartDefault: 75000, validation: { min: 1 }, helper: "", expertMeaning: "Annual OPEX", expertMeaning_i18n: {"en":"Annual OPEX","tr":"yıllık i̇şletme maliyeti"} },
    { id: "projectLife", label: "Proje Ömrü", label_i18n: {"en":"Project lifetime","tr":"Proje Ömrü"}, type: "number", unit: "yıl", required: false, smartDefault: 20, validation: { min: 1, max: 50 }, helper: "", expertMeaning: "Project lifetime", expertMeaning_i18n: {"en":"Project lifetime","tr":"proje ömrü"} },
    { id: "discountRate", label: "İskonto Oranı", label_i18n: {"en":"Discount rate for NPV","tr":"İskonto Oranı"}, type: "number", unit: "%", required: false, smartDefault: 8, validation: { min: 0, max: 30 }, helper: "", expertMeaning: "Discount rate for NPV", expertMeaning_i18n: {"en":"Discount rate for NPV","tr":"i̇skonto oranı"} },
  ],
  outputs: [
    { id: "aep", label: "Yıllık Enerji Üretimi (AEP)", label_i18n: {"en":"Yllk Enerji Uretimi (AEP)","tr":"Yıllık Enerji Üretimi (AEP)"}, unit: "MWh/yıl", format: "number", isBigNumber: true },
    { id: "annualRevenue", label: "Yıllık Gelir", label_i18n: {"en":"Yllk Gelir","tr":"Yıllık Gelir"}, unit: "USD/yıl", format: "currency" },
    { id: "ebitda", label: "FVAÖK (EBITDA)", label_i18n: {"en":"FVAOK (EBITDA)","tr":"FVAÖK (EBITDA)"}, unit: "USD/yıl", format: "currency" },
    { id: "lcoe", label: "Seviyelendirilmiş Enerji Maliyeti (LCOE)", label_i18n: {"en":"Seviyelendirilmis Enerji Maliyeti (LCOE)","tr":"Seviyelendirilmiş Enerji Maliyeti (LCOE)"}, unit: "USD/kWh", format: "currency" },
    { id: "npv", label: "Net Bugünkü Değer (NPV)", label_i18n: {"en":"Net Bugunku Deger (NPV)","tr":"Net Bugünkü Değer (NPV)"}, unit: "USD", format: "currency", isBigNumber: true },
  ],
  thresholds: [{ fieldId: "lcoe", warning: 0.06, critical: 0.10, direction: "higher_is_bad", warningMessage: "LCOE > $0.06/kWh — piyasa rekabeti zorlaşabilir.", warningMessage_i18n: {"en":"LCOE > $0.06/kWh — piyasa rekabeti zorlaşabilir.","tr":"LCOE > $0.06/kWh — piyasa rekabeti zorlaşabilir."}, criticalMessage: "LCOE > $0.10/kWh — yatırım fizibilitesi düşük.", criticalMessage_i18n: {"en":"LCOE > $0.10/kWh — yatırım fizibilitesi düşük.","tr":"LCOE > $0.10/kWh — yatırım fizibilitesi düşük."} }],
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
  reportTemplate: { title: "Rüzgar Türbini Yatırım Raporu", title_i18n: {"en":"Rüzgar Türbini Yatırım Raporu","tr":"Rüzgar Türbini Yatırım Raporu"}, sections: ["executive_summary", "loss_breakdown", "thresholds", "action_plan", "assumptions"], exportFormats: ["pdf", "excel"] },
  assumptions: { hiddenLossMultiplier: 1.1, volatilityPercent: 10, targetMarginPercent: 15, assumptionNotes: ["AEP = 0.5 × ρ × A × V³ × Cp × 8760 / 1e6.", "LCOE = (CAPEX + ΣOPEXₜ/(1+r)ᵗ) / ΣAEPₜ/(1+r)ᵗ.", "NPV = Σ(Revenueₜ − OPEXₜ)/(1+r)ᵗ − CAPEX.", "Rüzgar hızı Weibull dağılımı varsayılmıştır."],assumptionNotes_i18n:[{"en":"AEP = 0.5 × ρ × A × V³ × Cp × 8760 / 1e6.","tr":"AEP = 0.5 × ρ × A × V³ × Cp × 8760 / 1e6."},{"en":"LCOE = (CAPEX + ΣOPEXₜ/(1+r)ᵗ) / ΣAEPₜ/(1+r)ᵗ.","tr":"LCOE = (CAPEX + ΣOPEXₜ/(1+r)ᵗ) / ΣAEPₜ/(1+r)ᵗ."},{"en":"NPV = Σ(Revenueₜ − OPEXₜ)/(1+r)ᵗ − CAPEX.","tr":"NPV = Σ(Revenueₜ − OPEXₜ)/(1+r)ᵗ − CAPEX."},{"en":"Rüzgar hızı Weibull dağılımı varsayılmıştır.","tr":"Rüzgar hızı Weibull dağılımı varsayılmıştır."}] },
};
